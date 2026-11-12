import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";
import { requireSupabaseConfiguration } from "../lib/admin/environment.mjs";
import { validateEmail } from "../lib/admin/auth-contract.mjs";

nextEnv.loadEnvConfig(process.cwd());
try {
  const { url } = requireSupabaseConfiguration(process.env);
  const email = process.env.GET_INITIAL_SUPERADMIN_EMAIL;
  const name = process.env.GET_INITIAL_SUPERADMIN_NAME;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!validateEmail(email) || !name?.trim() || name.length > 120 || !secret) throw new Error("Configurá email, nombre y credencial privada del servidor para el bootstrap.");
  const client = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const command = process.argv[2];
  if (command === "invite") {
    const origin = new URL(process.env.GET_ADMIN_ORIGIN);
    if (origin.origin !== process.env.GET_ADMIN_ORIGIN) throw new Error("Origen Auth no válido.");
    const { error } = await client.auth.admin.inviteUserByEmail(email, { redirectTo: `${origin.origin}/admin/callback` });
    if (error) throw new Error("No se pudo invitar la identidad. Si ya existe, confirmá su email antes de promoverla.");
    console.log("Invitación enviada. Confirmá el email y elegí tu contraseña antes de promover.");
  } else if (command === "promote") {
    const { data, error } = await client.rpc("cms_bootstrap_superadmin", { p_email: email, p_name: name });
    if (error || data?.role !== "SUPERADMIN" || data?.status !== "active") throw new Error("Bootstrap rechazado: verificá email confirmado, credencial y ausencia de otro superadmin.");
    console.log("Perfil SUPERADMIN verificado. Bootstrap completado.");
  } else throw new Error("Usá: npm run admin:bootstrap -- invite | promote");
} catch (error) { console.error(error.message); process.exitCode = 1; }
