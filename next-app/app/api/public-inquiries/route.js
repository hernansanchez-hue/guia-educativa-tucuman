import {getPublishedCatalog} from '../../../lib/admin/published-editorial';
import {composeInstitution} from '../../../lib/admin/editorial-model.mjs';
import {institutionDesignPage} from '../../../lib/catalog/institution-design.mjs';
import {withPublishedContact} from '../../../lib/catalog/published-contact.mjs';
import {allowsCareerInquiry} from '../../../lib/catalog/profile-presentation.mjs';
import {readFile} from 'node:fs/promises';
import {resolvePublicInquiry} from '../../../lib/integration/public-inquiry.mjs';
import {hasTrustedPublicOrigin} from '../../../lib/security/request-origin.mjs';
import {readBoundedJson} from '../../../lib/security/bounded-json.mjs';

export const runtime = 'nodejs';

function reply(message, status) { return Response.json({ok:false, message}, {status, headers:{'Cache-Control':'no-store'}}); }

export async function POST(request) {
  if (!hasTrustedPublicOrigin(request)) return reply('Origen no permitido', 403);
  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey ?? '')) return reply('Identificador de solicitud inválido', 400);
  const body = await readBoundedJson(request, 8192);
  if (body.error) return reply(body.error, body.status);
  const input = body.value;
  if (input?.website) return reply('Solicitud inválida', 400);
  const denied = () => reply('El formulario no está habilitado para esta oferta.', 403);
  if (typeof input?.institutionId !== 'string' || typeof input?.offeringId !== 'string') return denied();
  try {
    const catalog = await getPublishedCatalog();
    const venue = composeInstitution(catalog, input.institutionId);
    if (!venue || !allowsCareerInquiry(withPublishedContact(catalog, institutionDesignPage(catalog, {institution:venue})).institution, input.offeringId)) return denied();
  } catch { return reply('No se pudo verificar la disponibilidad del formulario.', 503); }
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
