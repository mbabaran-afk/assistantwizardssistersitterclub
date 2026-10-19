import { getStore } from '@netlify/blobs';

export default async () => {
  const store = getStore('portfolio');
  const { blobs } = await store.list();
  const items = {};
  for (const b of blobs) items[b.key] = b.etag ? b.etag.replace(/"/g, '').slice(0, 12) : '1';
  return Response.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
};
