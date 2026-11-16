import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { requireSupabaseConfiguration } from '../admin/environment.mjs';
import { verifiedControlSession } from './identity.mjs';
import { permit } from './domain.mjs';
import { controlStore, controlMode } from './store';
export const cookieOptions = {
  name: 'get-control-session',
  path: '/administrador',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};
export async function authClient() {
  const jar = await cookies(),
    { url, key } = requireSupabaseConfiguration(process.env);
  return createServerClient(url, key, {
    cookieOptions,
    cookies: {
      getAll: () => jar.getAll(),
      setAll(items) {
        try {
          for (const { name, value, options } of items)
            jar.set(name, value, {
              ...options,
              path: '/administrador',
              httpOnly: true,
              sameSite: 'lax',
              secure: cookieOptions.secure,
            });
        } catch {
          /* Cookies are read-only in Server Components; proxy persists the refresh. */
        }
      },
    },
  });
}
export function origin() {
  const value = process.env.GET_CONTROL_ORIGIN || process.env.GET_ADMIN_ORIGIN;
  const url = new URL(value);
  if (
    url.origin !== value ||
    (url.protocol !== 'https:' &&
      !(
        process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname)
      ))
  )
    throw Error('Falta configurar el origen seguro del Centro.');
  return url.origin;
}
export async function identity(bootstrap = false, {allowMfaChallenge = false} = {}) {
  if (!(await cookies()).getAll().some((c) => /^get-control-session(?:\.\d+)?$/.test(c.name)))
    return null;
  const client = await authClient(),
    store = await controlStore();
  const verified = await verifiedControlSession(client, store, {localBootstrap:bootstrap && controlMode() === 'local',allowMfaChallenge});
  return verified ? { ...verified, store, client } : null;
}
export async function requireControl(op = 'read') {
  if (controlMode() === 'off') redirect('/administrador/login');
  const s = await identity(false,{allowMfaChallenge:true});
  if (!s) redirect('/administrador/login');
  if (s.requiresMfa) redirect('/administrador/verificar');
  permit(s.actor, op);
  if (
    op !== 'read' &&
    controlMode() === 'supabase' &&
    process.env.GET_CONTROL_WRITES_ENABLED !== 'true'
  )
    throw Error('Las escrituras de este entorno no están habilitadas.');
  return s;
}
export const mailEnabled = () => process.env.GET_CONTROL_ALLOW_AUTH_MAIL === 'true';
