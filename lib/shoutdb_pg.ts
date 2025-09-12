import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

/*
  Postgres helper for shoutbox. This file is provided as a ready-to-use helper
  but is NOT wired into the API by default. To enable, replace usage of the
  file-backed functions in lib/shoutdb.ts with these functions.

  Example DATABASE_URL (sample credentials):
  postgresql://example_user:example_password@localhost:5432/shoutboxdb

  Example migration:
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
  );
*/

function buildConnectionString() {
  // prefer explicit POSTGRES_URL, then DATABASE_URL, else build from parts
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const user = process.env.POSTGRES_USER;
  const host = process.env.POSTGRES_HOST;
  const password = process.env.POSTGRES_PASSWORD;
  const port = process.env.POSTGRES_PORT || '5432';
  const db = process.env.POSTGRES_DB || 'postgres';
  if (user && host) {
    const auth = password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}@` : `${encodeURIComponent(user)}@`;
    return `postgresql://${auth}${host}:${port}/${db}`;
  }
  return '';
}

let pool: Pool | null = null;
function getPool() {
  if (pool) return pool;
  // Use a global cache to avoid creating multiple pools in serverless/hot-reload environments
  const anyGlobal = global as any;
  if (anyGlobal.__pgPool) {
    pool = anyGlobal.__pgPool;
    return pool;
  }

  const connectionString = buildConnectionString();
  const opts: any = {};
  if (connectionString) opts.connectionString = connectionString;

  // If the connection string includes sslmode=require or looks like a Supabase URL,
  // ensure pg uses SSL and accepts the server certificate (rejectUnauthorized=false)
  if (connectionString && /sslmode=require|sslmode=verify-ca|ssl=true|supabase|supa=base-pooler/i.test(connectionString)) {
    opts.ssl = { rejectUnauthorized: false };
  }

  pool = new Pool(opts);
  anyGlobal.__pgPool = pool;
  return pool;
}

export type PgMessage = { id: string; text: string; created_at: string };

export async function getMessagesPg(limit = 200): Promise<PgMessage[]> {
  const p = getPool()!;
  const sql = `SELECT id, text, created_at FROM messages ORDER BY created_at DESC LIMIT $1`;
  const res = await p.query(sql, [limit]);
  const rows = res.rows as { id: string; text: string; created_at: Date }[];
  return rows.map((r) => ({ id: r.id, text: r.text, created_at: r.created_at.toISOString() }));
}

export async function addMessagePg(id: string, text: string): Promise<PgMessage> {
  const p = getPool()!;
  const sql = `INSERT INTO messages (id, text, created_at) VALUES ($1, $2, now() at time zone 'utc') RETURNING id, text, created_at`;
  const res = await p.query(sql, [id, text]);
  const r = res.rows[0];
  return { id: r.id, text: r.text, created_at: r.created_at.toISOString() };
}

export async function deleteMessagePg(id: string): Promise<boolean> {
  const p = getPool()!;
  const res = await p.query(`DELETE FROM messages WHERE id = $1`, [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function exportMessagesToJson(outFile = path.join(process.cwd(), 'data', 'shoutbox_export.json')): Promise<string> {
  const messages = await getMessagesPg(10000);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(messages, null, 2), 'utf8');
  return outFile;
}

// export the pool for ad-hoc queries if needed
export { pool };

// --- Compatibility wrappers ---
// Provide the same function names as the file-backed helper so the API can switch
// between implementations without changing its callers.

export async function getMessages(limit = 200) {
  return getMessagesPg(limit);
}

export async function addMessage(text: string) {
  const id = randomUUID();
  return addMessagePg(id, text);
}

export async function deleteMessage(id: string) {
  return deleteMessagePg(id);
}
