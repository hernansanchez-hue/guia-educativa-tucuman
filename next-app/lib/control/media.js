import 'server-only';
import { controlStore, controlMode } from './store';
import { identity } from './session';
import { referencedMedia } from './domain.mjs';
import { mediaResponse } from '../admin/media-response.mjs';
export async function serveFile(request, id, priv) {
  if (!/^[a-f0-9-]{36}\.(?:jpg|webp|png|pdf)$/.test(id) || controlMode() === 'off')
    return new Response(null, { status: 404 });
  const store = await controlStore();
  if (priv) {
    if (!(await identity()))
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'private,no-store' } });
  } else if (
    !(await store.published()).some(
      (r) => r.published.visible !== false && referencedMedia(r.published).has(id),
    )
  )
    return new Response(null, { status: 404 });
  const blob = await store.file(id);
  if (!blob) return new Response(null, { status: 404 });
  const response = mediaResponse(request, blob, priv);
  if (priv && blob.type === 'application/pdf')
    response.headers.set('Content-Disposition', 'inline');
  return response;
}
