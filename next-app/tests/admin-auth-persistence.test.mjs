import test from "node:test";
import assert from "node:assert/strict";
import { getAdminSessionFromClient, validateAdminProfile, adminDestination, isAdminPath } from "../lib/admin/auth-contract.mjs";
import { requireSupabaseConfiguration } from "../lib/admin/environment.mjs";
import { SupabaseContentRepository, readSupabasePublished } from "../lib/admin/supabase-content-repository.mjs";
import { canAdmin } from "../lib/admin/permissions.mjs";
import { readPublishedContent } from "../lib/admin/content-document.mjs";

const uid = "10101010-1010-4010-8010-101010101010";
const docId = "20202020-2020-4020-8020-202020202020";
const profile = { id: uid, display_name: "Fixture", role: "EDITOR", status: "active", can_publish: false };
const actor = validateAdminProfile(profile);
function authFixture({ user = { id: uid, email_confirmed_at: "2026-10-12T00:00:00Z" }, row = profile, error = null } = {}) {
  const client = { auth: { getUser: async () => ({ data: { user }, error }) }, from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row }) }) }) }) };
  return client;
}
test("anonymous/unverified/non-admin/disabled sessions are denied", async () => {
  assert.equal((await getAdminSessionFromClient(authFixture({ user: null }))).status, "anonymous");
  assert.equal((await getAdminSessionFromClient(authFixture({ user: { id: uid } }))).status, "denied");
  assert.equal((await getAdminSessionFromClient(authFixture({ row: null }))).status, "denied");
  assert.equal((await getAdminSessionFromClient(authFixture({ row: { ...profile, status: "disabled" } }))).status, "denied");
  assert.equal((await getAdminSessionFromClient(authFixture({ error: new Error("Auth unavailable") }))).status, "anonymous");
});
test("DB profile wins over editable user metadata and is re-read for each authorization", async () => {
  const client = authFixture({ user: { id: uid, email_confirmed_at: "yes", user_metadata: { role: "SUPERADMIN" } } });
  const result = await getAdminSessionFromClient(client);
  assert.equal(result.actor.role, "EDITOR"); assert.equal(canAdmin(result.actor, "users"), false);
  assert.equal((await getAdminSessionFromClient(authFixture({ row: { ...profile, id: docId } }))).status, "denied");
});
test("roles/statuses are constrained, including superadmin and publisher override", () => {
  assert.throws(() => validateAdminProfile({ ...profile, role: "OWNER" }));
  assert.throws(() => validateAdminProfile({ ...profile, status: "pending" }));
  assert.throws(() => validateAdminProfile({ ...profile, can_publish: "true" }));
  assert.ok(canAdmin(validateAdminProfile({ ...profile, role: "SUPERADMIN" }), "users"));
  assert.ok(canAdmin(validateAdminProfile({ ...profile, role: "ADMIN" }), "publish"));
  assert.equal(canAdmin(validateAdminProfile({ ...profile, role: "ADMIN" }), "users"), false);
  assert.ok(canAdmin(validateAdminProfile({ ...profile, can_publish: true }), "publish"));
});
test("admin routing is contextual and has no similarly named public-route exception", () => {
  assert.equal(adminDestination({ status: "anonymous" }), "/admin/login");
  assert.equal(adminDestination({ status: "denied" }), "/admin/acceso-denegado");
  assert.equal(adminDestination({ status: "active" }), "/admin");
  assert.ok(isAdminPath("/admin/preview/123")); assert.equal(isAdminPath("/administracion"), false); assert.equal(isAdminPath("/"), false);
});
test("environment supports existing aliases but rejects secrets and other projects", () => {
  const config = { SUPABASE_URL: "https://zomoblpgurchkxvkkutj.supabase.co", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fixture" };
  assert.equal(requireSupabaseConfiguration(config).key, config.SUPABASE_PUBLISHABLE_KEY);
  assert.ok(requireSupabaseConfiguration({ NEXT_PUBLIC_SUPABASE_URL: config.SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.SUPABASE_PUBLISHABLE_KEY }));
  assert.throws(() => requireSupabaseConfiguration({ ...config, SUPABASE_PUBLISHABLE_KEY: "sb_secret_fixture" }));
  assert.throws(() => requireSupabaseConfiguration({ ...config, SUPABASE_URL: "https://other.supabase.co" }));
  assert.throws(() => requireSupabaseConfiguration({ ...config, NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "unsafe" }));
});
test("repository creates through RPC without trusting a caller supplied actor", async () => {
  let sent;
  let row;
  const client = { rpc: async (method, input) => { sent = { method, input }; row = { id: docId, module_id: "institutions", entity_key: "sede", revision: 1, state: "draft", draft: input.p_payload, published_version: null }; return { data: { document: row, revalidation: { projectionPending: true } } }; },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row }), order: async () => ({ data: [] }) }) }) }) };
  const repo = new SupabaseContentRepository(client, actor);
  const result = await repo.create({ moduleId: "institutions", entityKey: "sede", payload: { title: "A" }, actor: { role: "SUPERADMIN" } });
  assert.equal(sent.method, "cms_mutate_content"); assert.equal(sent.input.p_operation, "create"); assert.equal(Object.hasOwn(sent.input, "actor"), false);
  assert.equal(result.document.state, "draft"); assert.equal(result.document.publishedVersion, null);
  await assert.rejects(repo.create({ moduleId: "legal", entityKey: "terms", payload: {} }));
  await assert.rejects(repo.create({ moduleId: "institutions", entityKey: "sede", payload: { html: "<script>bad</script>" } }));
});
test("published mutation returns complete immutable history compatible with phase-1 readers", async () => {
  const row = { id: docId, module_id: "institutions", entity_key: "sede", revision: 3, state: "published", draft: { title: "A" }, published_version: 1 };
  const history = [{ version_number: 1, snapshot: { title: "A" }, created_by: uid, created_at: "2026-10-12T00:00:00Z" }];
  const client = { rpc: async () => ({ data: { document: row, revalidation: { projectionPending: true } } }),
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row }), order: async () => ({ data: history }) }) }) }) };
  const result = await new SupabaseContentRepository(client, actor).mutate({ p_operation: "publish" });
  assert.deepEqual(readPublishedContent(result.document), { title: "A" });
  assert.equal(result.document.versions.length, 1);
  assert.ok(result.revalidation.projectionPending);
});
test("repository surfaces optimistic conflicts and never falls back to memory", async () => {
  const repo = new SupabaseContentRepository({ rpc: async () => ({ error: { code: "40001" } }) }, actor);
  await assert.rejects(repo.mutate({ p_operation: "save" }), { code: "40001" });
  await assert.rejects(repo.list({ limit: 1000 }));
});
test("public repository only requests a published snapshot, not documents or drafts", async () => {
  const calls = [];
  const client = { rpc: async (name, input) => { calls.push({ name, input }); return { data: null }; } };
  assert.equal(await readSupabasePublished(client, { moduleId: "institutions", entityKey: "sede" }), null);
  assert.equal(calls[0].name, "cms_read_published");
  client.rpc = async () => ({ data: { title: "Published" } });
  assert.deepEqual(await readSupabasePublished(client, { moduleId: "institutions", entityKey: "sede" }), { title: "Published" });
});
