import { getStore } from '@netlify/blobs';

export default async (req) => {
  const id = new URL(req.url).searchParams.get('id') || '';
  if (!/^[a-z0-9-]{1,40}$/.test(id)) return new Response('Bad id', { status: 400 });
  const store = getStore('portfolio');
  const res = await store.getWithMetadata(id, { type: 'arrayBuffer' });
  if (!res) return new Response('Not found', { status: 404 });
  return new Response(res.data, { headers: { 'Content-Type': (res.metadata && res.metadata.type) || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
