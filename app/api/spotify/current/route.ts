import { NextResponse } from 'next/server';

let cachedToken: { access_token: string; expires_at: number } | null = null;
let lastTokenFlow: 'REFRESH' | 'CLIENT_CREDENTIALS' | 'ACCESS_TOKEN' | 'NONE' = 'NONE';

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
      return NextResponse.json({ playing: false }, { status: 200 });
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
      if (debug) payload._debug = { token_flow: lastTokenFlow };
      // If we used client_credentials, explain why /me fails
      if (lastTokenFlow === 'CLIENT_CREDENTIALS') {
        payload.help = 'client_credentials token cannot access /me endpoints. Obtain an Authorization Code refresh token and set SPOTIFY_REFRESH_TOKEN in environment.';
      }
      return NextResponse.json(payload, { status: res.status });
    }

    const payload: any = { playing: true, data: body };
    if (debug) payload._debug = { token_flow: lastTokenFlow };
    return NextResponse.json(payload);
  } catch (err: any) {
    const payload: any = { error: err?.message || 'unexpected error' };
    if (debug) payload._raw = String(err?.stack || err);
    return NextResponse.json(payload, { status: 500 });
  }
}
