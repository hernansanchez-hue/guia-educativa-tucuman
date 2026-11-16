// Bound decoded bytes while reading, including chunked requests without a length.
// Reject before JSON parsing; never log the request body.
export async function readBoundedJson(request, maxBytes) {
  const length = request.headers.get('content-length');
  if (length && /^\d+$/.test(length) && Number(length) > maxBytes) {
    await request.body?.cancel().catch(() => {});
    return {error: 'Solicitud demasiado grande', status: 413};
  }
  if (!request.body) return {error: 'JSON inválido', status: 400};
  const reader = request.body.getReader();
  let bytes = 0, text = '';
  const decoder = new TextDecoder('utf-8', {fatal: true});
  try {
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel().catch(() => {});
        return {error: 'Solicitud demasiado grande', status: 413};
      }
      text += decoder.decode(value, {stream: true});
    }
    text += decoder.decode();
    return {value: JSON.parse(text)};
  } catch {
    await reader.cancel().catch(() => {});
    return {error: 'JSON inválido', status: 400};
  } finally { reader.releaseLock(); }
}
