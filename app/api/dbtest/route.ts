import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to use the Postgres helper (will throw if not configured)
    const db = await import('../../../lib/shoutdb_pg');
    // call a lightweight method that will initialize the pool
    const sample = await db.getMessages(1).catch((e: any) => {
      // if messages table not present, still return the error for diagnosis
      throw e;
    });
    return NextResponse.json({ ok: true, sample }, { status: 200 });
  } catch (e: any) {
    const conn = (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL || '');
    const maskedConn = conn.replace(/:(.+?)@/, ':*****@');
    const sslInfo = { PGSSLMODE: process.env.PGSSLMODE || null, PGSSL_DISABLE: process.env.PGSSL_DISABLE || null };
    const payload: any = { ok: false, error: e && e.message ? e.message : String(e), conn: maskedConn, sslInfo };
    if (process.env.DB_DEBUG === 'true') {
      payload.stack = e && e.stack ? e.stack : null;
    }
    return NextResponse.json(payload, { status: 500 });
  }
}
