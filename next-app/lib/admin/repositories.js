import "server-only";
import { requireAdmin } from "./auth";
import { SupabaseContentRepository } from "./supabase-content-repository.mjs";

export async function getContentRepository(action = "read") {
  const { client, actor } = await requireAdmin(action);
  return new SupabaseContentRepository(client, actor);
}
