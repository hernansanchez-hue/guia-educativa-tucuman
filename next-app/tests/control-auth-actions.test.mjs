import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
import { validateEmail } from '../lib/admin/auth-contract.mjs';

// Execute the real Server Action with an isolated Auth client: no mail or network calls.
const compiled = transformSync(
  readFileSync(new URL('../app/administrador/access.js', import.meta.url), 'utf8'),
  { loader: 'js', format: 'cjs' },
).code;

function harness({ enabled = true, result = { data: {}, error: null }, rejects = false } = {}) {
  const calls = [];
  const modules = {
    'next/navigation': { redirect: () => assert.fail('Recovery must not redirect before acceptance') },
    '../../lib/control/session': {
      authClient: async () => ({
        auth: {
          resetPasswordForEmail: async (...args) => {
            calls.push(args);
            if (rejects) throw Error('Internal provider failure');
            return result;
          },
        },
      }),
      origin: () => 'https://guiaeducativatuc.com.ar',
      mailEnabled: () => enabled,
    },
    '../../lib/admin/auth-contract.mjs': { validateEmail },
    '../../lib/control/store': { controlMode: () => 'supabase' },
  };
  const compiledModule = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(
    (name) => {
      assert.ok(Object.hasOwn(modules, name), `Unexpected dependency: ${name}`);
      return modules[name];
    },
    compiledModule,
    compiledModule.exports,
  );
  const run = (email = 'acceptance@example.invalid') => {
    const form = new FormData();
    form.set('email', email);
    return compiledModule.exports.recover('', form);
  };
  return { run, calls };
}

test('recovery confirms only an accepted official request with the production callback', async () => {
  const { run, calls } = harness();
  assert.equal(await run(), 'Si la cuenta existe, recibirás las instrucciones en tu correo.');
  assert.deepEqual(calls, [[
    'acceptance@example.invalid',
    { redirectTo: 'https://guiaeducativatuc.com.ar/administrador/callback' },
  ]]);
});

test('recovery does not claim mail delivery when Supabase returns an error or rate limit', async () => {
  for (const status of [400, 429, 500]) {
    const { run, calls } = harness({ result: { data: {}, error: { status, message: 'Private diagnostic' } } });
    assert.equal(await run(), 'No se pudo iniciar el flujo de recuperación.');
    assert.equal(calls.length, 1, 'No automatic retries');
  }
});

test('recovery handles network failures without exposing provider details', async () => {
  const { run, calls } = harness({ rejects: true });
  assert.equal(await run(), 'No se pudo iniciar el flujo de recuperación.');
  assert.equal(calls.length, 1);
});

test('recovery makes no Auth request when mail is disabled or the email is invalid', async () => {
  const disabled = harness({ enabled: false });
  assert.equal(await disabled.run(), 'El envío de correos no está habilitado en este entorno.');
  assert.equal(disabled.calls.length, 0);
  const invalid = harness();
  assert.equal(await invalid.run('not-an-email'), 'Ingresá un correo válido.');
  assert.equal(invalid.calls.length, 0);
});
