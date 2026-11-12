import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseConfiguration } from "../admin/environment.mjs";

/** Reserved for Auth invitations after a verified SUPERADMIN check; not editorial writes. */
export function createSupabaseServiceClient() {
  const { url } = requireSupabaseConfiguration(process.env);
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("La invitación requiere una credencial privada del servidor.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
