import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { getAdminSessionFromClient, adminDestination } from "./auth-contract.mjs";
import { requireAdminPermission } from "./permissions.mjs";

export async function getAdminSession() {
  const client = await createSupabaseServerClient();
  return { ...await getAdminSessionFromClient(client), client };
}

export async function requireAdmin(action = "read") {
  const session = await getAdminSession();
  if (session.status !== "active") redirect(adminDestination(session));
  requireAdminPermission(session.actor, action);
  return session;
}

export async function requireRole(...roles) {
  const session = await requireAdmin();
  if (!roles.includes(session.actor.role)) throw new Error("Acceso denegado.");
  return session;
}
