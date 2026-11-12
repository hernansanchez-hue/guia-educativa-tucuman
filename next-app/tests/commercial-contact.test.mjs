import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {validateCommercialContact, commercialContactConfigured, createContactGuard, handleCommercialContact} from '../lib/integration/commercial-contact.mjs';
import {INQUIRY_PRIVACY_VERSION} from '../lib/privacy/inquiry-consent.mjs';

const input = {institutionName: 'Institución de prueba', name: 'Persona de prueba', phone: '3811234567', email: 'test@example.invalid', plan: 'Básico', message: 'Consulta controlada', website: '', privacyConsent:true, privacyVersion:INQUIRY_PRIVACY_VERSION};
const env = {GET_CONTACT_INGEST_URL: 'https://receiver.example.invalid/contact', GET_CONTACT_INGEST_SECRET: 'test-only-not-a-real-secret'};
const request = (body = input, {key = randomUUID(), origin = 'http://localhost:4004', headers = {}} = {}) => new Request('http://localhost:4004/api/commercial-contact', {
  method: 'POST', headers: {'Content-Type': 'application/json', Origin: origin, 'Idempotency-Key': key, ...headers}, body: typeof body === 'string' ? body : JSON.stringify(body),
});
const settings = (fetchImpl, extra = {}) => ({env, fetchImpl, guard: createContactGuard(), ...extra});
const confirmed = async (_, init) => Response.json({accepted: true, receiptId: 'receipt-test', idempotencyKey: init.headers['Idempotency-Key']});

test('normalizes commercial fields without a public institution/tenant association', () => {
  const validated = validateCommercialContact({...input, name: ' Persona ', institutionId: 'not-allowed', role: 'SUPERADMIN'});
  assert.equal(validated.name, 'Persona');
  assert.equal('institutionId' in validated, false);
  assert.equal('role' in validated, false);
  assert.equal('website' in validated, false);
});
test('rejects invalid commercial fields and honeypot', () => {
  for (const invalid of [null, [], {...input, website: 'bot'}, {...input, plan: 'Otro'}, {...input, email: 'invalid'}, {...input, name: 'x'}, {...input, message: 'x'.repeat(4001)}]) assert.equal(validateCommercialContact(invalid), null);
});
test('requires separate secure contact destination, never the academic receiver', () => {
  assert.equal(commercialContactConfigured({}), false);
  assert.equal(commercialContactConfigured({...env, GET_CONTACT_INGEST_URL: 'http://receiver.example.invalid'}), false);
  assert.equal(commercialContactConfigured({...env, GET_CONTACT_INGEST_URL: 'https://example.invalid/functions/v1/public-inquiry-ingest'}), false);
  assert.equal(commercialContactConfigured({...env, GET_CONTACT_INGEST_SECRET: ''}), false);
  assert.equal(commercialContactConfigured(env), true);
});
test('does not persist or forward a commercial inquiry without current explicit consent', async () => {
  for(const extra of [{privacyConsent:false},{privacyConsent:'on'},{privacyConsent:undefined},{privacyVersion:'old'},{privacyVersion:undefined}]) {
    for(const internal of [false,true]) {
      const response=await handleCommercialContact(request({...input,...extra}), settings(()=>assert.fail('must not forward'), {
        ...(internal?{env:{GET_CONTACT_STORE:'supabase'},persistence:{receive:()=>assert.fail('must not store')}}:{}),
      }));
      assert.equal(response.status,400);
    }
  }
});
test('absent configuration returns 503 without transport or simulated success', async () => {
  let sends = 0;
  const response = await handleCommercialContact(request(), settings(() => {sends++;}, {env: {}}));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(sends, 0);
});
test('origin, content-type and idempotency checks fail closed', async () => {
  for (const [options, expected] of [[{origin: 'https://other.example'}, 403], [{key: 'invalid'}, 400], [{headers: {'Content-Type': 'text/plain'}}, 415]]) {
    const response = await handleCommercialContact(request(input, options), settings(() => {assert.fail('must not send');}));
    assert.equal(response.status, expected);
  }
});
test('malformed JSON and oversized bodies are rejected', async () => {
  assert.equal((await handleCommercialContact(request('{invalid'), settings(confirmed))).status, 400);
  assert.equal((await handleCommercialContact(request('x'.repeat(17000)), settings(confirmed))).status, 413);
});
test('success requires durable acceptance and a matching idempotency receipt', async () => {
  for (const receipt of [{}, {accepted: true}, {accepted: true, receiptId: 'id'}, {accepted: false, receiptId: 'id'}]) {
    const response = await handleCommercialContact(request(), settings(async () => Response.json(receipt)));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  }
  const response = await handleCommercialContact(request(), settings(confirmed));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).receiptId, 'receipt-test');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
test('outgoing request is commercial-only, server-authenticated and cannot follow redirects', async () => {
  const response = await handleCommercialContact(request(), settings(async (url, init) => {
    assert.equal(url, env.GET_CONTACT_INGEST_URL);
    assert.equal(init.headers.Authorization, 'Bearer ' + env.GET_CONTACT_INGEST_SECRET);
    assert.equal(init.redirect, 'error');
    const body = JSON.parse(init.body);
    assert.equal(body.kind, 'commercial-contact');
    assert.equal(body.sourcePath, '/contacto');
    assert.equal('institutionId' in body, false);
    assert.equal('programId' in body, false);
    assert.equal('website' in body, false);
    assert.equal('privacyConsent' in body, false);
    assert.equal('privacyVersion' in body, false);
    return confirmed(url, init);
  }));
  const body = await response.text();
  assert.equal(body.includes(env.GET_CONTACT_INGEST_SECRET), false);
  assert.equal(body.includes(input.email), false);
});
test('upstream failures, exceptions and invalid JSON do not report delivery', async () => {
  for (const transport of [
    async () => new Response('unavailable', {status: 503}),
    async () => {throw Error('private provider details');},
    async () => new Response('not-json'),
  ]) {
    const response = await handleCommercialContact(request(), settings(transport));
    assert.equal(response.status, 502);
    assert.equal((await response.text()).includes('private provider details'), false);
  }
});
test('duplicate and concurrent requests use one transport call; changed payload rejects key reuse', async () => {
  const key = randomUUID(), guard = createContactGuard();
  let sends = 0;
  const dependencies = settings(async (url, init) => {sends++; await new Promise(resolve => setTimeout(resolve, 15)); return confirmed(url, init);}, {guard});
  const responses = await Promise.all([handleCommercialContact(request(input, {key}), dependencies), handleCommercialContact(request(input, {key}), dependencies)]);
  assert.equal(responses.every(r => r.status === 201), true);
  assert.equal(sends, 1);
  assert.equal((await handleCommercialContact(request(input, {key}), dependencies)).status, 201);
  assert.equal(sends, 1);
  assert.equal((await handleCommercialContact(request({...input, message: 'different'}, {key}), dependencies)).status, 409);
});
test('failed delivery may be retried with the same idempotency key', async () => {
  const key = randomUUID(), guard = createContactGuard();
  let sends = 0;
  const dependencies = settings(async (url, init) => ++sends === 1 ? new Response('no', {status: 500}) : confirmed(url, init), {guard});
  assert.equal((await handleCommercialContact(request(input, {key}), dependencies)).status, 502);
  assert.equal((await handleCommercialContact(request(input, {key}), dependencies)).status, 201);
  assert.equal(sends, 2);
});
test('rate limiting is bounded and expires without storing raw identities', async () => {
  let now = 0;
  const guard = createContactGuard({limit: 2, maxEntries: 2, windowMs: 100, now: () => now});
  assert.equal(guard.allow('a'), true);
  assert.equal(guard.allow('a'), true);
  assert.equal(guard.allow('a'), false);
  assert.equal(guard.allow('b'), true);
  assert.equal(guard.allow('c'), false);
  now = 101;
  assert.equal(guard.allow('c'), true);
  const dependencies = settings(confirmed, {guard: createContactGuard({limit: 1})});
  assert.equal((await handleCommercialContact(request(), dependencies)).status, 201);
  const response = await handleCommercialContact(request(), dependencies);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '600');
});
