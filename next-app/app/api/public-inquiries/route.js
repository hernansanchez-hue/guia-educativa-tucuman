import {readFile} from 'node:fs/promises';
import {resolvePublicInquiry} from '../../../lib/integration/public-inquiry.mjs';

export const runtime = 'nodejs';

function reply(message, status) { return Response.json({ok:false, message}, {status, headers:{'Cache-Control':'no-store'}}); }

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return reply('Origen no permitido', 403);
  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey ?? '')) return reply('Identificador de solicitud inválido', 400);
  const body = await request.text();
  if (body.length > 8192) return reply('Solicitud demasiado grande', 413);
  let input;
  try { input = JSON.parse(body); } catch { return reply('JSON inválido', 400); }
  if (input?.website) return reply('Solicitud inválida', 400);
  let mapping;
  try { mapping = JSON.parse(await readFile(process.env.GET_CRM_MAPPING_PATH, 'utf8')); }
  catch { return reply('Integración CRM no configurada', 503); }
  const resolved = resolvePublicInquiry(input, mapping);
  if (resolved.error) return reply(resolved.error, resolved.status);
  const endpoint = process.env.GET_CRM_INGEST_URL;
  const secret = process.env.GET_CRM_INGEST_SECRET;
  if (!endpoint || !secret || !endpoint.startsWith('https://')) return reply('Integración CRM no configurada', 503);
  try {
    const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${secret}`}, body:JSON.stringify({...resolved.value, idempotencyKey}), cache:'no-store', signal:AbortSignal.timeout(10000)});
    if (!response.ok) return reply('No se pudo confirmar la recepción. Intentá más tarde.', 502);
    const receipt = await response.json();
    if (!receipt?.accepted || !receipt?.receiptId) return reply('El CRM no confirmó la recepción', 502);
    return Response.json({ok:true, receiptId:receipt.receiptId}, {status:201, headers:{'Cache-Control':'no-store'}});
  } catch { return reply('No se pudo confirmar la recepción. Intentá más tarde.', 502); }
}
