import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseConfiguration } from "../lib/admin/environment.mjs";

nextEnv.loadEnvConfig(process.cwd());
const { url, key } = requireSupabaseConfiguration(process.env);
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const drafts = await client.from("cms_documents").select("id").limit(1);
const mutation = await client.rpc("cms_mutate_content", { p_operation: "create", p_module: "institutions", p_entity: "anonymous-denial-check", p_payload: {} });
const published = await client.rpc("cms_read_published", { p_module: "institutions", p_entity: "anonymous-denial-check" });
if (drafts.error?.code !== "42501" || mutation.error?.code !== "42501" || published.error || published.data !== null) {
  throw new Error("La verificación anónima de la conexión/RLS no coincide con el contrato esperado.");
}
const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
if (!response.ok) throw new Error("Auth no disponible.");
const settings = await response.json();
console.log(JSON.stringify({ connected: true, anonymousDraftRead: "denied", anonymousWrite: "denied", publishedOnly: true, authAvailable: true, emailAutoConfirm: settings.mailer_autoconfirm ?? null }));
