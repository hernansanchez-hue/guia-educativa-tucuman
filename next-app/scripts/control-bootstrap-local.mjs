import { join } from 'node:path';
import { homedir } from 'node:os';
import { createClient } from '@supabase/supabase-js';
import { openLocalStore } from '../lib/control/local-store.mjs';
import { requireSupabaseConfiguration } from '../lib/admin/environment.mjs';
import { isUuid, validateEmail } from '../lib/admin/auth-contract.mjs';
const [id, email] = process.argv.slice(2);
if (!isUuid(id) || !validateEmail(email)) {
  console.log(
    'Uso: node --env-file=.env.local scripts/control-bootstrap-local.mjs UUID CORREO_VERIFICADO',
  );
  process.exitCode = 1;
} else {
  if (
    process.env.NETLIFY ||
    process.env.NODE_ENV === 'production' ||
    process.env.GET_CONTROL_STORE === 'supabase'
  )
    throw Error('Solo se permite bootstrap local.');
  const { url } = requireSupabaseConfiguration(process.env),
    secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw Error('Falta la clave privada del servidor para verificar la identidad.');
  const client = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const r = await client.auth.admin.getUserById(id),
    u = r.data?.user;
  if (
    r.error ||
    !u ||
    u.id !== id ||
    u.email?.toLowerCase() !== email.toLowerCase() ||
    !u.email_confirmed_at ||
    u.is_anonymous ||
    new Date(u.banned_until || 0) > new Date()
  )
    throw Error('La identidad no coincide o no está confirmada/activa.');
  const store = openLocalStore(
    join(process.env.LOCALAPPDATA || homedir(), 'GET', 'centro-control', 'editorial.sqlite'),
  );
  try {
    if (!store.bootstrap(id, email)) throw Error('Ya existe un equipo. Usá la gestión de accesos.');
    console.log('Administrador vinculado solo en el Centro local. No se modificó Auth.');
  } finally {
    store.close();
  }
}
