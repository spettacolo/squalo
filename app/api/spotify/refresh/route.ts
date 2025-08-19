import { NextResponse } from 'next/server';

async function upsertVercelEnvVar(key: string, value: string) {
	const token = process.env.VERCEL_TOKEN;
	const projectId = process.env.VERCEL_PROJECT_ID;
	const teamId = process.env.VERCEL_TEAM_ID;
	if (!token || !projectId) return { ok: false, reason: 'missing_vercel_credentials' };

	const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
	const teamQuery = teamId ? `?teamId=${teamId}` : '';

	try {
		const listRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env${teamQuery}`, { headers });
		const listJson = await listRes.json();
		const envs = Array.isArray(listJson) ? listJson : (listJson.envs || []);
		const existing = envs.find((e: any) => e.key === key);

		if (existing && existing.id) {
			const patchRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}${teamQuery}`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ value }),
			});
			const patched = await patchRes.json();
			return { ok: patchRes.ok, action: 'patched', status: patchRes.status, result: patched };
		}

		const postRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env${teamQuery}`, {
			method: 'POST',
			headers,
			body: JSON.stringify({ key, value, target: ['development', 'preview', 'production'] }),
		});
		const created = await postRes.json();
		return { ok: postRes.ok, action: 'created', status: postRes.status, result: created };
	} catch (e: any) {
		return { ok: false, reason: String(e?.message || e) };
	}
}

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
		try {
			const json = text ? JSON.parse(text) : {};
			const out: any = { ...(json || {}) };

			if (json.refresh_token) {
				// attempt to update Vercel env var
				const vercelResult = await upsertVercelEnvVar('SPOTIFY_REFRESH_TOKEN', String(json.refresh_token));
				out._vercel = vercelResult;
			}

			return NextResponse.json(out, { status: res.status });
		} catch (e) {
			return NextResponse.json({ raw: text }, { status: res.status });
		}
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || 'unexpected error' }, { status: 500 });
	}
}

