import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../supabase/server";

export async function handleAuthCallback(request) {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  const token_hash = params.get("token_hash"); const type = params.get("type");
  try {
    const client = await createSupabaseServerClient();
    let result;
    if (code && code.length < 4096) result = await client.auth.exchangeCodeForSession(code);
    else if (token_hash && token_hash.length < 4096 && ["invite", "recovery"].includes(type)) result = await client.auth.verifyOtp({ token_hash, type });
    if (result && !result.error) {
      const destination = type === "invite" ? "/admin/restablecer?modo=invitacion" : "/admin/restablecer";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  } catch { /* Return only a safe recovery path, never Auth internals or token values. */ }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
