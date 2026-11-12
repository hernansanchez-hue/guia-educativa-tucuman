"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { getAdminSessionFromClient, adminDestination, validateEmail } from "../../lib/admin/auth-contract.mjs";

function authOrigin() {
  const value = process.env.GET_ADMIN_ORIGIN;
  const url = new URL(value);
  if (url.origin !== value || (url.protocol !== "https:" && !(process.env.NODE_ENV === "development" && url.hostname === "localhost"))) throw new Error("Origen Auth no configurado.");
  return url.origin;
}
export async function loginAction(_previous, formData) {
  const email = formData.get("email"); const password = formData.get("password");
  if (!validateEmail(email) || typeof password !== "string" || !password || password.length > 128) return { message: "Revisá el email y la contraseña." };
  let destination;
  try {
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { message: "No se pudo iniciar sesión. Revisá tus credenciales." };
    const session = await getAdminSessionFromClient(client);
    destination = adminDestination(session);
    if (session.status === "active") {
      const { error: auditError } = await client.rpc("cms_auth_event", { p_action: "LOGIN" });
      if (auditError) { await client.auth.signOut({ scope: "local" }); return { message: "No se pudo validar el acceso administrativo." }; }
    } else await client.auth.signOut({ scope: "local" });
  } catch { return { message: "El administrador no está disponible. Revisá su configuración." }; }
  redirect(destination);
}
export async function logoutAction() {
  const client = await createSupabaseServerClient();
  // Denied/disabled identities must still be able to sign out.
  const session = await getAdminSessionFromClient(client);
  if (session.status === "active") await client.rpc("cms_auth_event", { p_action: "LOGOUT" });
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) throw new Error("No se pudo cerrar sesión. Intentá nuevamente.");
  redirect("/admin/login");
}
export async function recoverAction(_previous, formData) {
  const email = formData.get("email");
  if (!validateEmail(email)) return { message: "Ingresá un email válido." };
  try {
    const client = await createSupabaseServerClient();
    await client.auth.resetPasswordForEmail(email, { redirectTo: `${authOrigin()}/admin/callback` });
  } catch { return { message: "La recuperación no está disponible. Revisá la configuración." }; }
  // Same response for existing/unknown accounts and rate limits: no email enumeration.
  return { message: "Si el email corresponde a una cuenta, recibirás un enlace de recuperación." };
}
export async function resetPasswordAction(_previous, formData) {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length < 12 || password.length > 128) return { message: "Usá entre 12 y 128 caracteres." };
  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user?.email_confirmed_at) return { message: "El enlace venció. Solicitá uno nuevo." };
    const { error: updateError } = await client.auth.updateUser({ password });
    if (updateError) return { message: "No se pudo actualizar la contraseña." };
    await client.auth.signOut({ scope: "global" });
  } catch { return { message: "No se pudo completar la recuperación." }; }
  redirect("/admin/login");
}
