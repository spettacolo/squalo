import { NextResponse } from 'next/server';

// Dynamically choose DB implementation: prefer Postgres helper when POSTGRES_URL is set,
// otherwise fall back to the file-backed helper.
let db: any = null;
async function getDb() {
  if (db) return db;
  if (process.env.POSTGRES_URL) {
    try {
      const pg = await import('../../../lib/shoutdb_pg');
      db = pg;
      return db;
    } catch (e) {
      console.error('Failed to load Postgres helper, falling back to file DB:', e);
      // fallthrough to file-backed implementation
    }
  }
  const fileDb = await import('../../../lib/shoutdb');
  db = fileDb;
  return db;
}

export async function GET() {
  const d = await getDb();
  const msgs = await d.getMessages(200);
  return NextResponse.json(msgs);
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
    return NextResponse.json({ error: (e && e.message) || 'Invalid JSON' }, { status: 400 });
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
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
