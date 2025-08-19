import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET' }, { status: 500 });
  }

  if (!refreshToken) {
    return NextResponse.json({ error: 'No SPOTIFY_REFRESH_TOKEN configured in environment' }, { status: 400 });
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: body.toString(),
    });

    const text = await res.text();
    // try to parse json, otherwise return raw text
    try {
      const json = text ? JSON.parse(text) : {};
      return NextResponse.json(json, { status: res.status });
    } catch (e) {
      return NextResponse.json({ raw: text }, { status: res.status });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unexpected error' }, { status: 500 });
  }
}
