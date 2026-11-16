import {createHmac, randomBytes} from 'node:crypto';
import {hasInquiryConsent} from '../privacy/inquiry-consent.mjs';
import {commercialConsent} from '../privacy/commercial-consent.mjs';
import {hasTrustedPublicOrigin} from '../security/request-origin.mjs';

const KEY_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECEIPT_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,159}$/;
const NO_DESTINATION = 'El envío del formulario todavía no está habilitado. Podés contactar a GET por WhatsApp.';
const FAILED_DELIVERY = 'No pudimos confirmar la recepción. Intentá nuevamente más tarde.';
const textValid = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
const reply = (message, status, extra = {}) => Response.json({ok: false, message}, {
  status, headers: {'Cache-Control': 'no-store', ...extra},
});

export function validateCommercialContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.website) return null;
  if (!textValid(input.institutionName, 2, 200) || !textValid(input.name, 2, 200)
    || !textValid(input.phone, 3, 50) || !textValid(input.email, 3, 320)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
    || !['Básico', 'Profesional', 'Premium'].includes(input.plan)
    || !textValid(input.message ?? '', 0, 4000)) return null;
  // Only explicitly allowed commercial fields leave this server. Never infer an academic tenant.
  return {
    institutionName: input.institutionName.trim(), name: input.name.trim(),
    phone: input.phone.trim(), email: input.email.trim(), plan: input.plan,
    message: (input.message ?? '').trim(),
  };
}

function receiverConfiguration(env) {
  const secret = env.GET_CONTACT_INGEST_SECRET;
  try {
    const endpoint = new URL(env.GET_CONTACT_INGEST_URL);
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash
      || !secret || secret.length < 16) return null;
    // The existing academic lead receiver has a different, institution-bound contract.
    if (endpoint.pathname.replace(/\/$/, '').endsWith('/public-inquiry-ingest')) return null;
    return {endpoint: endpoint.href, secret};
  } catch { return null; }
}

export function commercialContactConfigured(env = process.env) {
  return Boolean(receiverConfiguration(env));
}

// Process-local protections supplement, rather than replace, the receiver's durable idempotency
// and distributed rate limit. No message content, email, address or IP is retained here.
export function createContactGuard({now = Date.now, maxEntries = 1000, limit = 5, windowMs = 600000} = {}) {
  const rates = new Map(), requests = new Map(), salt = randomBytes(32);
  const digest = value => createHmac('sha256', salt).update(value).digest('hex');
  function prune() {
    const time = now();
    for (const [key, row] of rates) if (time - row.created >= windowMs) rates.delete(key);
    for (const [key, row] of requests) if (time - row.created >= 900000 && !row.pending) requests.delete(key);
  }
  return {
    allow(address) {
      prune();
      const key = digest(address), current = rates.get(key);
      if (!current) {
        if (rates.size >= maxEntries) return false;
        rates.set(key, {created: now(), count: 1});
        return true;
      }
      if (current.count >= limit) return false;
      current.count += 1;
      return true;
    },
    async once(key, payload, deliver) {
      prune();
      const fingerprint = digest(JSON.stringify(payload)), current = requests.get(key);
      if (current) {
        if (current.fingerprint !== fingerprint) return {status: 409, message: 'El identificador ya corresponde a otra consulta.'};
        return current.promise;
      }
      if (requests.size >= maxEntries) return {status: 429, message: 'Hay demasiadas solicitudes. Intentá más tarde.'};
      const record = {fingerprint, created: now(), pending: true};
      record.promise = Promise.resolve().then(deliver).finally(() => {record.pending = false;});
      requests.set(key, record);
      const result = await record.promise;
      // Do not cache delivery failures; callers retry the same key and the receiver deduplicates.
      if (result.status !== 201) requests.delete(key);
      return result;
    },
  };
}

async function readInput(request) {
  const reader = request.body?.getReader();
  if (!reader) return {status: 400, message: 'Solicitud inválida.'};
  const parts = [];
  let length = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 16384) {
      await reader.cancel();
      return {status: 413, message: 'La consulta es demasiado extensa.'};
    }
    parts.push(Buffer.from(value));
  }
  try { return {input: JSON.parse(Buffer.concat(parts).toString('utf8'))}; }
  catch { return {status: 400, message: 'Solicitud inválida.'}; }
}

const defaultGuard = createContactGuard();

export async function handleCommercialContact(request, {
  env = process.env, fetchImpl = fetch, guard = defaultGuard, now = Date.now, persistence = null,
} = {}) {
  if (!hasTrustedPublicOrigin(request, env)) return reply('Origen no permitido.', 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply('Formato no permitido.', 415);
  const key = request.headers.get('idempotency-key');
  if (!KEY_PATTERN.test(key ?? '')) return reply('Identificador de solicitud inválido.', 400);
  if (!guard.allow(request.headers.get('x-nf-client-connection-ip') || 'local')) {
    return reply('Alcanzaste el límite de consultas. Intentá nuevamente en unos minutos.', 429, {'Retry-After': '600'});
  }
  let parsed;
  try { parsed = await readInput(request); }
  catch { return reply('No se pudo leer la solicitud.', 400); }
  if (parsed.status) return reply(parsed.message, parsed.status);
  if (!hasInquiryConsent(parsed.input)) return reply('Revisá la Política de Privacidad y autorizá el envío de tu consulta.', 400);
  const payload = validateCommercialContact(parsed.input);
  if (!payload) return reply('Revisá los datos de contacto y el plan seleccionado.', 400);
  const internal = ['local','supabase'].includes(env.GET_CONTACT_STORE);
  const config = internal ? null : receiverConfiguration(env);
  if (internal ? !persistence : !config) return reply(NO_DESTINATION, 503);
  const evidence = commercialConsent(parsed.input);
  const result = await guard.once(key, internal ? {...payload, consent: evidence} : payload, async () => {
    try {
      if (internal) {
        const stored = await persistence.receive(key,payload,request.headers.get('x-nf-client-connection-ip') || 'local',evidence);
        if (stored?.status === 201 && RECEIPT_PATTERN.test(stored.receiptId ?? '')) return {status:201,receiptId:stored.receiptId};
        if (stored?.status === 409) return {status:409,message:'El identificador ya corresponde a otra consulta.'};
        if (stored?.status === 429) return {status:429,message:'Alcanzaste el límite de consultas. Intentá nuevamente en unos minutos.'};
        return {status:503,message:FAILED_DELIVERY};
      }
      const response = await fetchImpl(config.endpoint, {
        method: 'POST', cache: 'no-store', redirect: 'error',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${config.secret}`, 'Idempotency-Key': key},
        body: JSON.stringify({
          ...payload, idempotencyKey: key, origin: 'website', kind: 'commercial-contact',
          sourcePath: '/contacto', receivedAt: new Date(now()).toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return {status: 502, message: FAILED_DELIVERY};
      const receipt = await response.json();
      if (receipt?.accepted !== true || !RECEIPT_PATTERN.test(receipt.receiptId ?? '')
        || receipt.idempotencyKey !== key) return {status: 502, message: FAILED_DELIVERY};
      return {status: 201, receiptId: receipt.receiptId};
    } catch { return {status: 502, message: FAILED_DELIVERY}; }
  });
  if (result.status !== 201) return reply(result.message, result.status);
  return Response.json({ok: true, receiptId: result.receiptId}, {status: 201, headers: {'Cache-Control': 'no-store'}});
}
