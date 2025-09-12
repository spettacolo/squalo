import { NextResponse } from 'next/server';
import { addMessage, getMessages, deleteMessage } from '../../../lib/shoutdb';

export async function GET() {
  const msgs = await getMessages(200);
  return NextResponse.json(msgs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body.text !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const msg = await addMessage(body.text);
    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const ok = await deleteMessage(id);
    return NextResponse.json({ success: ok });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
