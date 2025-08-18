import { NextResponse } from 'next/server';

let cachedToken: { access_token: string; expires_at: number } | null = null;
let lastTokenFlow: 'REFRESH' | 'CLIENT_CREDENTIALS' | 'ACCESS_TOKEN' | 'NONE' = 'NONE';

// simple in-memory cache for lyrics per Spotify track id
const lyricsCache: Map<string, { fetchedAt: number; lyrics: any[] }> = new Map();

function parseLrc(lrc: string) {
  // parse lines like [mm:ss.xx] text
  const lines: any[] = [];
  const re = /\[(\d+):(\d+(?:\.\d+)?)\](.*)/;
  for (const raw of lrc.split(/\r?\n/)) {
    const m = raw.match(re);
    if (m) {
      const mm = parseInt(m[1], 10);
      const ss = parseFloat(m[2]);
      const start_ms = Math.round((mm * 60 + ss) * 1000);
      const text = m[3].trim();
      if (text) lines.push({ start_ms, text });
    }
  }
  return lines;
}

async function fetchLyricsFromMusixmatch(title: string, artists: string, duration_ms: number) {
  const key = process.env.MUSIXMATCH_API_KEY;
  if (!key) return null;
  try {
    const base = 'https://api.musixmatch.com/ws/1.1';
    // search for track (prefer tracks with subtitles/timed lyrics)
    const qs = new URLSearchParams({ q_track: title, q_artist: artists, f_has_subtitle: '1', apikey: key, s_track_rating: 'desc' });
    let res = await fetch(`${base}/track.search?${qs.toString()}`);
    if (!res.ok) return null;
    const js = await res.json();
    const trackList = js?.message?.body?.track_list;
    let mmTrackId: number | null = null;
    if (Array.isArray(trackList) && trackList.length > 0) {
      mmTrackId = trackList[0]?.track?.track_id ?? null;
    }

    if (mmTrackId) {
      // try subtitle (timed) first
      res = await fetch(`${base}/track.subtitle.get?track_id=${mmTrackId}&apikey=${key}`);
      if (res.ok) {
        const sub = await res.json();
        const body = sub?.message?.body;
        const subtitle = body?.subtitle;
        const subBody = subtitle?.subtitle_body;
        if (subBody && typeof subBody === 'string') {
          const parsed = parseLrc(subBody);
          if (parsed.length > 0) return parsed;
        }
      }

      // fallback to plain lyrics
      res = await fetch(`${base}/track.lyrics.get?track_id=${mmTrackId}&apikey=${key}`);
      if (res.ok) {
        const l = await res.json();
        const lyricsBody = l?.message?.body?.lyrics?.lyrics_body;
        if (lyricsBody && typeof lyricsBody === 'string') {
          // split into lines and approximate timings by proportion along duration
          const lines = lyricsBody.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
          if (lines.length === 0) return null;
          const out: any[] = [];
          for (let i = 0; i < lines.length; i++) {
            const start = Math.round((i / Math.max(1, lines.length - 1)) * (duration_ms || 180000));
            out.push({ start_ms: start, text: lines[i] });
          }
          return out;
        }
      }
    }
  } catch (e) {
    console.warn('musixmatch lyrics fetch failed', String(e));
  }
  return null;
}

async function fetchAccessTokenClientCredentials(clientId: string, clientSecret: string) {
  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` },
    body: body.toString(),
  });

  if (!res.ok) throw new Error('failed to fetch access token (client_credentials)');
  const json = await res.json();
  return json as { access_token: string; token_type: string; expires_in: number };
}

async function fetchAccessTokenRefresh(refreshToken: string, clientId: string, clientSecret: string) {
  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` },
    body: body.toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error('failed to refresh access token: ' + txt);
  }
  const json = await res.json();
  return json as { access_token: string; token_type: string; expires_in: number; refresh_token?: string };
}

async function getAccessToken() {
  // prefer explicit access token env var if present (useful for quick testing)
  const explicit = process.env.SPOTIFY_ACCESS_TOKEN;
  if (explicit) {
    lastTokenFlow = 'ACCESS_TOKEN';
    return explicit;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expires_at > now + 5000) {
    return cachedToken.access_token;
  }

  // prefer refresh flow if we have a refresh token (gives user-scoped access)
  if (refreshToken) {
    try {
      const tok = await fetchAccessTokenRefresh(refreshToken, clientId, clientSecret);
      const expires_at = now + tok.expires_in * 1000;
      cachedToken = { access_token: tok.access_token, expires_at };
      lastTokenFlow = 'REFRESH';
      return tok.access_token;
    } catch (e) {
      console.warn('refresh token flow failed:', String(e));
    }
  }

  // fallback to client_credentials
  const tok = await fetchAccessTokenClientCredentials(clientId, clientSecret);
  const expires_at = now + tok.expires_in * 1000;
  cachedToken = { access_token: tok.access_token, expires_at };
  lastTokenFlow = 'CLIENT_CREDENTIALS';
  return tok.access_token;
}

export async function GET() {
  const debug = process.env.DEBUG_SPOTIFY === 'true';
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ error: 'No SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET configured' }, { status: 500 });
    }

    // fetch profile to confirm which user the token is for (helps debug wrong account)
    let profile: any = null;
    let devices: any[] | null = null;
    try {
      const p = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      if (p.ok) profile = await p.json();
    } catch (e) {
      // ignore profile errors
    }

    // fetch devices to help debug why /player/currently-playing reports nothing
    try {
      const d = await fetch('https://api.spotify.com/v1/me/player/devices', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      if (d.ok) {
        const dd = await d.json();
        devices = Array.isArray(dd.devices) ? dd.devices : (dd.devices || null);
      }
    } catch (e) {
      // ignore devices errors
    }

    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    // handle empty body (Spotify returns 204 when nothing is playing)
    if (res.status === 204) {
      const payload: any = { playing: false };
      if (debug) payload._debug = { token_flow: lastTokenFlow, profile, devices };
      return NextResponse.json(payload, { status: 200 });
    }

    const text = await res.text();
    let body: any = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (e) {
      body = text;
    }

    if (!res.ok) {
      const payload: any = { error: body?.error || body, status: res.status };
      if (debug) payload._debug = { token_flow: lastTokenFlow, profile, devices };
      if (lastTokenFlow === 'CLIENT_CREDENTIALS') {
        payload.help = 'client_credentials token cannot access /me endpoints. Obtain an Authorization Code refresh token and set SPOTIFY_REFRESH_TOKEN in environment.';
      }
      return NextResponse.json(payload, { status: res.status });
    }
    // optionally try to attach lyrics (timed) to the response if we have a provider key
    try {
      const out: any = { ...(body || {}) };
      const trackId = body?.item?.id ?? body?.item?.track?.id ?? null;
      const title = body?.item?.name ?? body?.item?.track?.name ?? '';
      const artists = (body?.item?.artists || body?.item?.track?.artists || []).map((a: any) => a.name).join(', ');
      const duration = body?.item?.duration_ms ?? body?.item?.track?.duration_ms ?? 0;

      if (trackId) {
        const cacheKey = `mm:${trackId}`;
        const cached = lyricsCache.get(cacheKey);
        if (cached && (Date.now() - cached.fetchedAt) < 1000 * 60 * 60 * 6) { // 6h cache
          out.lyrics = cached.lyrics;
        } else {
          const mm = await fetchLyricsFromMusixmatch(title, artists, duration);
          if (mm && mm.length > 0) {
            lyricsCache.set(cacheKey, { fetchedAt: Date.now(), lyrics: mm });
            out.lyrics = mm;
          }
        }
      }

      if (debug) {
        out._debug = { token_flow: lastTokenFlow, profile, devices };
      }
      return NextResponse.json(out);
    } catch (e) {
      if (debug) {
        const out = { ...(body || {}), _debug: { token_flow: lastTokenFlow, profile, devices, lyrics_error: String(e) } };
        return NextResponse.json(out);
      }
      return NextResponse.json(body);
    }
  } catch (err: any) {
    const payload: any = { error: err?.message || 'unexpected error' };
    if (debug) payload._raw = String(err?.stack || err);
    return NextResponse.json(payload, { status: 500 });
  }
}
