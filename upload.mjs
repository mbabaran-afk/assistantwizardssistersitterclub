import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'Bad request' }, { status: 400 }); }
  const code = process.env.UPLOAD_CODE || '';
  if (!code || body.code !== code) return Response.json({ error: 'Wrong upload code' }, { status: 401 });
  const id = String(body.id || '');
  if (!/^[a-z0-9-]{1,40}$/.test(id)) return Response.json({ error: 'Bad slot' }, { status: 400 });
  const store = getStore('portfolio');
  if (body.action === 'check') return Response.json({ ok: true });
  if (body.action === 'delete') { await store.delete(id); return Response.json({ ok: true }); }
  const type = /^image\/(jpeg|png|webp)$/.test(body.type) ? body.type : 'image/jpeg';
  const buf = Buffer.from(String(body.data || ''), 'base64');
  if (!buf.length || buf.length > 4.5e6) return Response.json({ error: 'Image too large' }, { status: 413 });
  await store.set(id, buf, { metadata: { type, at: new Date().toISOString() } });
  return Response.json({ ok: true });
};
