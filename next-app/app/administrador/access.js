'use server';
import { redirect } from 'next/navigation';
import { authClient, identity, origin, mailEnabled } from '../../lib/control/session';
import { validateEmail } from '../../lib/admin/auth-contract.mjs';
import { controlMode } from '../../lib/control/store';
export async function login(_prev, form) {
  if (controlMode() === 'off')
    return 'El almacenamiento editorial no está habilitado en este entorno.';
  const email = String(form.get('email') || '').trim(),
    password = form.get('password');
  if (!validateEmail(email) || typeof password !== 'string' || !password || password.length > 256)
    return 'Revisá los datos de ingreso.';
  let requiresMfa=false;
  try {
    const c = await authClient();
    if ((await c.auth.signInWithPassword({ email, password })).error)
      return 'Correo o contraseña incorrectos.';
    const session=await identity(true,{allowMfaChallenge:true});
    if (!session) {
      await c.auth.signOut({ scope: 'local' });
      return 'La cuenta no tiene acceso activo al Centro de Control.';
    }
    requiresMfa=session.requiresMfa;
  } catch {
    return 'No se pudo verificar el acceso. Revisá la configuración del servidor.';
  }
  redirect(requiresMfa?'/administrador/verificar':'/administrador');
}
export async function logout() {
  const c = await authClient();
  const r = await c.auth.signOut({ scope: 'local' });
  if (r.error) throw Error('No se pudo cerrar la sesión.');
  redirect('/administrador/login');
}
export async function recover(_prev, form) {
  if (!mailEnabled()) return 'El envío de correos no está habilitado en este entorno.';
  const email = String(form.get('email') || '').trim();
  if (!validateEmail(email)) return 'Ingresá un correo válido.';
  try {
    const c = await authClient();
    const result = await c.auth.resetPasswordForEmail(email, {
      redirectTo: origin() + '/administrador/callback',
    });
    if (result.error) return 'No se pudo iniciar el flujo de recuperación.';
  } catch {
    return 'No se pudo iniciar el flujo de recuperación.';
  }
  return 'Si la cuenta existe, recibirás las instrucciones en tu correo.';
}
export async function accept(input) {
  if (!input || typeof input !== 'object') return false;
  const safe = (v) => typeof v === 'string' && v.length > 0 && v.length < 12000;
  try {
    const c = await authClient();
    let r;
    if (safe(input.code)) r = await c.auth.exchangeCodeForSession(input.code);
    else if (safe(input.token_hash) && ['invite', 'recovery'].includes(input.type))
      r = await c.auth.verifyOtp({ token_hash: input.token_hash, type: input.type });
    else if (
      safe(input.access_token) &&
      safe(input.refresh_token) &&
      ['invite', 'recovery'].includes(input.type)
    )
      r = await c.auth.setSession({
        access_token: input.access_token,
        refresh_token: input.refresh_token,
      });
    return !!(r && !r.error && r.data?.session);
  } catch {
    return false;
  }
}
export async function reset(_prev, form) {
  const password = form.get('password');
  if (typeof password !== 'string' || password.length < 12 || password.length > 128)
    return 'Elegí una contraseña de 12 a 128 caracteres.';
  const c = await authClient(),
    u = await c.auth.getUser();
  if (u.error || !u.data.user?.email_confirmed_at) return 'El enlace no es válido o venció.';
  if ((await c.auth.updateUser({ password })).error) return 'No se pudo establecer la contraseña.';
  await c.auth.signOut({ scope: 'global' });
  redirect('/administrador/login');
}
