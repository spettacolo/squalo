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

async function getAccessToken() {
  // prefer explicit long-lived token if provided
  const explicit = process.env.SPOTIFY_ACCESS_TOKEN;
  if (explicit) return explicit;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  // cached token still valid?
  const now = Date.now();
  if (cachedToken && cachedToken.expires_at > now + 5000) {
    return cachedToken.access_token;
  }

  const tok = await fetchAccessTokenClientCredentials(clientId, clientSecret);
  cachedToken = { access_token: tok.access_token, expires_at: now + tok.expires_in * 1000 };
  return tok.access_token;
}

export async function GET() {
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ error: 'No SPOTIFY_ACCESS_TOKEN or client credentials configured' }, { status: 500 });
    }

    const res = await fetch('https://api.spotify.com/user/ar0ywn3bpj4umygis3i3eavqi/get-now-playing', {
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
