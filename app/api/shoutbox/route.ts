import { NextResponse } from 'next/server';

// Require Postgres. If no POSTGRES_URL or POSTGRES_URL_NON_POOLING is set, return 503
let db: any = null;
async function getDb() {
  if (db) return db;
  if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING && !process.env.DATABASE_URL) {
    throw new Error('No Postgres configured. Set POSTGRES_URL or POSTGRES_URL_NON_POOLING');
  }
  try {
    const pg = await import('../../../lib/shoutdb_pg');
    db = pg;
    return db;
  } catch (e) {
    console.error('Failed to load Postgres helper:', e);
    throw e;
  }
}

export async function GET() {
  try {
    const d = await getDb();
    const msgs = await d.getMessages(200);
    return NextResponse.json(msgs);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'DB not configured' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body.text !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const d = await getDb();
    const msg = await d.addMessage(body.text);
    return NextResponse.json(msg, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/shoutbox error:', e);
    const status = e && e.message && e.message.includes('No Postgres configured') ? 503 : 400;
    return NextResponse.json({ error: (e && e.message) || 'Invalid JSON' }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const d = await getDb();
    const ok = await d.deleteMessage(id);
    return NextResponse.json({ success: ok });
  } catch (e: any) {
    console.error('DELETE /api/shoutbox error:', e);
    const status = e && e.message && e.message.includes('No Postgres configured') ? 503 : 500;
    return NextResponse.json({ error: 'Failed' }, { status });
  }
}
