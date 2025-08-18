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

  if (!res.ok) throw new Error('failed to fetch access token');
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

// Se vuoi usare temporaneamente un token hard-coded, impostalo qui; altrimenti il token verrà
// recuperato automaticamente dal refresh token / client_credentials e salvato su disco.
// Nota: su hosting serverless (es. Vercel) la scrittura su disco può non persistere tra esecuzioni.
const ACCESS_TOKEN = '<INSERISCI_IL_TUO_TOKEN_SPOTIFY_QUI>';

async function getAccessToken() {
  // 1) fallback: explicit hard-coded token
  if (ACCESS_TOKEN && !ACCESS_TOKEN.includes('<INSERISCI')) return ACCESS_TOKEN;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret) {
    // cannot do any token flow without client credentials
    return null;
  }

  const now = Date.now();

  // 3) cached in-memory?
  if (cachedToken && cachedToken.expires_at > now + 5000) {
    return cachedToken.access_token;
  }

  // 4) prefer user-refresh flow if we have a refresh token (gives user-scoped access)
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

  // 5) fallback: client_credentials (note: not user-scoped)
  const tok = await fetchAccessTokenClientCredentials(clientId, clientSecret);
  const expires_at = now + tok.expires_in * 1000;
  cachedToken = { access_token: tok.access_token, expires_at };
  return tok.access_token;
}

export async function GET() {
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
    const body = text ? JSON.parse(text) : null;

    if (!res.ok) {
      return NextResponse.json({ error: body?.error || body }, { status: res.status });
    }

    return NextResponse.json(body);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unexpected error' }, { status: 500 });
  }
}
