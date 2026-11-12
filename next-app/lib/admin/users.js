import "server-only";
import { requireAdmin } from "./auth";
import { validateAdminProfile, isUuid, validateEmail } from "./auth-contract.mjs";
import { createSupabaseServiceClient } from "../supabase/service";

export async function listAdminProfiles() {
  const { client } = await requireAdmin("users");
  const { data, error } = await client.from("admin_profiles").select("id,display_name,role,status,can_publish,created_at,last_login_at").order("created_at").limit(100);
  if (error) throw new Error("No se pudieron obtener los perfiles.");
  return data;
}
export async function manageAdminProfile({ id, displayName, role, status, canPublish = false }) {
  const { client } = await requireAdmin("users");
  validateAdminProfile({ id, display_name: displayName, role, status, can_publish: canPublish });
  if (!isUuid(id) || typeof displayName !== "string" || displayName.trim().length < 1 || displayName.length > 120) throw new Error("Perfil no válido.");
  const { data, error } = await client.rpc("cms_manage_profile", { p_id: id, p_name: displayName, p_role: role, p_status: status, p_can_publish: canPublish });
  if (error) throw new Error("No se pudo guardar el perfil. Verificá identidad y permisos.");
  return data;
}
export async function inviteAdminIdentity(email) {
  await requireAdmin("users");
  if (!validateEmail(email)) throw new Error("Email no válido.");
  const origin = new URL(process.env.GET_ADMIN_ORIGIN);
  if (origin.origin !== process.env.GET_ADMIN_ORIGIN) throw new Error("Origen no válido.");
  const service = createSupabaseServiceClient();
  const { data, error } = await service.auth.admin.inviteUserByEmail(email, { redirectTo: `${origin.origin}/admin/callback` });
  if (error) throw new Error("No se pudo enviar la invitación.");
  // No automatic profile grant; after verification a SUPERADMIN assigns a protected role.
  return { id: data.user.id, verificationPending: true };
}
