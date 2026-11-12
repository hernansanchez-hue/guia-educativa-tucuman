"use client";
import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfiguration } from "../admin/environment.mjs";

/** Only URL + publishable key from a server component, never process.env or a service key. */
export function createSupabaseBrowserClient({ url, key }) {
  const config = requireSupabaseConfiguration({ SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: key });
  return createBrowserClient(config.url, config.key, {
    cookieOptions: { path: "/admin", sameSite: "lax", secure: window.location.protocol === "https:" },
  });
}
