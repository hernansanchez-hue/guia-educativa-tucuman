export const GET_SUPABASE_PROJECT_REF = "zomoblpgurchkxvkkutj";

/** Readiness diagnostics only: no key values are returned, no connection is attempted. */
export function inspectAdminEnvironment(env = {}) {
  const resolved = resolveSupabaseConfiguration(env);
  const missing = [];
  if (!resolved.url) missing.push("SUPABASE_URL");
  if (!resolved.key) missing.push("SUPABASE_PUBLISHABLE_KEY");
  let projectMatches = false;
  try {
    const url = new URL(resolved.url);
    projectMatches = url.protocol === "https:" && url.hostname === `${GET_SUPABASE_PROJECT_REF}.supabase.co` && !url.username && !url.password;
  } catch { /* Missing/invalid configuration is a reported state, not a successful connection. */ }
  const forbiddenPublicSecrets = Object.keys(env).filter((name) => /^NEXT_PUBLIC_.*SUPABASE.*(?:SERVICE_ROLE|SECRET)/i.test(name));
  return {
    missing, projectMatches, forbiddenPublicSecrets,
    configured: missing.length === 0 && projectMatches && forbiddenPublicSecrets.length === 0,
    source: "versioned",
    authImplemented: true,
  };
}

export function resolveSupabaseConfiguration(env = {}) {
  return {
    url: env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "",
    key: env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  };
}

export function requireSupabaseConfiguration(env) {
  if (!inspectAdminEnvironment(env).configured) throw new Error("Administrador no configurado.");
  const config = resolveSupabaseConfiguration(env);
  // Even a server-only secret must never be used by the ordinary Auth/RLS client.
  if (config.key.startsWith("sb_secret_")) throw new Error("Usá una clave publicable para Auth.");
  if (!config.key.startsWith("sb_publishable_")) {
    try {
      const part = config.key.split(".")[1];
      const decoded = JSON.parse(globalThis.atob(part.replace(/-/g, "+").replace(/_/g, "/")));
      if (decoded.role !== "anon") throw new Error();
    } catch { throw new Error("Usá una clave publicable para Auth."); }
  }
  return config;
}
