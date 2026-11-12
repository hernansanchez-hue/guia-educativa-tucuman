import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseConfiguration } from "../admin/environment.mjs";

export async function createSupabaseServerClient() {
  const { url, key } = requireSupabaseConfiguration(process.env);
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookieOptions: { path: "/admin", sameSite: "lax", secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(items) {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Components are read-only; proxy refreshes cookies before render. */ }
      },
    },
  });
}
