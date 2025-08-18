import { NextResponse } from 'next/server';

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function fetchAccessTokenClientCredentials(clientId: string, clientSecret: string) {
  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

  if (!res.ok) throw new Error('failed to refresh access token');
  const json = await res.json();
  return json as { access_token: string; token_type: string; expires_in: number; refresh_token?: string };
}

// Optional: temporary hard-coded token — prefer this if set.
const ACCESS_TOKEN = '<INSERISCI_IL_TUO_TOKEN_SPOTIFY_QUI>';

async function getAccessToken() {
  // prefer explicit hard-coded token if provided
  if (ACCESS_TOKEN && !ACCESS_TOKEN.includes('<INSERISCI')) return ACCESS_TOKEN;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret) {
    // cannot do any token flow without client credentials
    return null;
  }

  const now = Date.now();
  // cached in-memory?
  if (cachedToken && cachedToken.expires_at > now + 5000) {
    return cachedToken.access_token;
  }

  // prefer user-refresh flow if we have a refresh token (gives user-scoped access)
  if (refreshToken) {
    try {
      const tok = await fetchAccessTokenRefresh(refreshToken, clientId, clientSecret);
      const expires_at = now + tok.expires_in * 1000;
      cachedToken = { access_token: tok.access_token, expires_at };
      return tok.access_token;
    } catch (e) {
      console.warn('refresh token flow failed, falling back to client_credentials', e);
    }
  }

  // fallback: client_credentials (note: not user-scoped)
  const tok = await fetchAccessTokenClientCredentials(clientId, clientSecret);
  const expires_at = now + tok.expires_in * 1000;
  cachedToken = { access_token: tok.access_token, expires_at };
  return tok.access_token;
}

export async function GET(request: Request) {
  const debug = process.env.DEBUG_SPOTIFY === 'true';
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ error: 'No access token available (set ACCESS_TOKEN or SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET)' }, { status: 500 });
    }

    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const text = await res.text();
    let body: any = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (e) {
      body = text;
    }

    if (!res.ok) {
      const payload: any = { error: body?.error || body, status: res.status };
      if (debug) payload._debug = { flow: ACCESS_TOKEN && !ACCESS_TOKEN.includes('<INSERISCI') ? 'ACCESS_TOKEN' : (process.env.SPOTIFY_REFRESH_TOKEN ? 'REFRESH' : 'CLIENT_CREDENTIALS') };
      return NextResponse.json(payload, { status: res.status });
    }

    return NextResponse.json(body);
  } catch (err: any) {
    const payload: any = { error: err?.message || 'unexpected error' };
    if (process.env.DEBUG_SPOTIFY === 'true') payload._raw = String(err?.stack || err);
    return NextResponse.json(payload, { status: 500 });
  }
}
