import { canAdmin } from "./permissions.mjs";

export function isAdminPath(pathname = "") {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function validateAdminProfile(profile) {
  if (!profile || !isUuid(profile.id) || !["SUPERADMIN", "ADMIN", "EDITOR"].includes(profile.role)
    || !["active", "disabled"].includes(profile.status) || typeof profile.can_publish !== "boolean") {
    throw new Error("Perfil administrativo no válido.");
  }
  return { id: profile.id, displayName: profile.display_name, role: profile.role,
    isActive: profile.status === "active", canPublish: profile.can_publish };
}

export function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/** Always asks Auth for a current record, then reads an RLS-protected DB profile. */
export async function getAdminSessionFromClient(client) {
  const { data, error } = await client.auth.getUser();
  const user = data?.user;
  if (error || !user || !isUuid(user.id)) return { status: "anonymous" };
  if (!user.email_confirmed_at || user.is_anonymous) return { status: "denied" };
  const { data: profile, error: profileError } = await client.from("admin_profiles")
    .select("id,display_name,role,status,can_publish").eq("id", user.id).maybeSingle();
  if (profileError || !profile || profile.id !== user.id) return { status: "denied" };
  try {
    const actor = validateAdminProfile(profile);
    return canAdmin(actor, "read") ? { status: "active", actor } : { status: "denied" };
  } catch { return { status: "denied" }; }
}

export function adminDestination(session) {
  return session.status === "active" ? "/admin" : session.status === "anonymous" ? "/admin/login" : "/admin/acceso-denegado";
}

export function validateEmail(value) {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
