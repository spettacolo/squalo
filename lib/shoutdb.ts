import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

type Message = {
  id: string;
  text: string;
  createdAt: string; // ISO
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'shoutbox.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch (e) {
    // create empty array file
    await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf8');
  }
}

async function readMessages(): Promise<Message[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as Message[];
  } catch (e) {
    // fallthrough
  }
  return [];
}

async function writeMessages(messages: Message[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

export async function getMessages(limit = 100): Promise<Message[]> {
  const all = await readMessages();
  // newest first
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}

export async function addMessage(text: string): Promise<Message> {
  const msg: Message = { id: randomUUID(), text, createdAt: new Date().toISOString() };
  const all = await readMessages();
  all.push(msg);
  await writeMessages(all);
  return msg;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const all = await readMessages();
  const filtered = all.filter((m) => m.id !== id);
  if (filtered.length === all.length) return false;
  await writeMessages(filtered);
  return true;
}

/*
  NOTE: This helper uses a file-based JSON store by default for simplicity and local development.
  If you want to use a proper database, replace the implementations above with calls to your DB
  (Postgres, etc). Example DATABASE_URL (sample credentials):

  postgresql://example_user:example_password@localhost:5432/shoutboxdb

  To integrate Postgres, you can use the `pg` package and implement getMessages/addMessage/deleteMessage
  using SQL (CREATE TABLE IF NOT EXISTS messages (id text primary key, text text, created_at timestamptz);
*/

export type { Message };
