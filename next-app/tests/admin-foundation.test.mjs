import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ADMIN_BRANDING, ADMIN_MODULES, getAdminModule, PREVIEW_TARGETS } from "../lib/admin/module-registry.mjs";
import { canAdmin } from "../lib/admin/permissions.mjs";
import {
  createContentDocument, saveContentDraft, publishContentDocument, restoreContentVersion,
  readPublishedContent, createPreviewPayload, isSafeContentLink, isValidSlug, validateDraftPayload,
} from "../lib/admin/content-document.mjs";
import { inspectAdminEnvironment } from "../lib/admin/environment.mjs";

const editor = { id: "editor-1", role: "EDITOR", isActive: true };
const admin = { id: "admin-1", role: "ADMIN", isActive: true };
const superadmin = { id: "superadmin-1", role: "SUPERADMIN", isActive: true };
const now = "2026-10-12T15:00:00Z";
const makeDraft = () => createContentDocument({ moduleId: "institutions", entityKey: "concepcion/universidad-siglo-21", payload: { name: "Universidad Siglo 21", address: "Dirección original" }, actor: editor, now });

test("registry names real sources and the existing footer logo", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  assert.equal(new Set(ADMIN_MODULES.map((item) => item.id)).size, ADMIN_MODULES.length);
  for (const definition of ADMIN_MODULES) for (const source of definition.sources) assert.ok(existsSync(resolve(root, source)), source);
  assert.ok(existsSync(resolve(root, "public", ADMIN_BRANDING.logo.slice(1))));
  assert.equal(getAdminModule("unknown"), null);
  assert.equal(PREVIEW_TARGETS.institutions.component, "app/[ciudad]/[institucion]/InstitutionPageClient.js");
});

test("authorization denies anonymous, inactive and unknown roles", () => {
  for (const actor of [null, {}, { ...admin, id: "" }, { ...admin, isActive: false }, { ...admin, role: "toString" }]) {
    assert.equal(canAdmin(actor, "read"), false);
    assert.equal(canAdmin(actor, "publish"), false);
  }
  assert.equal(canAdmin(admin, "unknown"), false);
});

test("roles and protected editor publishing override stay distinct", () => {
  assert.equal(canAdmin(editor, "edit"), true);
  assert.equal(canAdmin(editor, "publish"), false);
  assert.equal(canAdmin({ ...editor, canPublish: true }, "publish"), true);
  assert.equal(canAdmin(admin, "publish"), true);
  for (const action of ["users", "settings", "design", "delete"]) {
    assert.equal(canAdmin(admin, action), false);
    assert.equal(canAdmin(editor, action), false);
    assert.equal(canAdmin(superadmin, action), true);
  }
});

test("new content is draft and cannot be read as published", () => {
  const draft = makeDraft();
  assert.equal(draft.state, "draft");
  assert.equal(readPublishedContent(draft), null);
  assert.throws(() => publishContentDocument(draft, { expectedRevision: 1, actor: editor, now }), /permiso/);
});

test("live preview payload and saved draft cannot mutate published content", () => {
  const draft = makeDraft();
  const published = publishContentDocument(draft, { expectedRevision: 1, actor: admin, now });
  const preview = createPreviewPayload(published, { name: "Cambio sin guardar" }, editor);
  preview.name = "Otro cambio";
  assert.equal(published.draft.name, "Universidad Siglo 21");
  const changed = saveContentDraft(published, { expectedRevision: 2, actor: editor, payload: { name: "Borrador nuevo" }, now });
  assert.equal(changed.state, "pending_changes");
  assert.equal(readPublishedContent(changed).name, "Universidad Siglo 21");
  const publicCopy = readPublishedContent(changed);
  publicCopy.name = "Alteración externa";
  assert.equal(readPublishedContent(changed).name, "Universidad Siglo 21");
});

test("restoring creates a draft and republishing appends a version", () => {
  const one = publishContentDocument(makeDraft(), { expectedRevision: 1, actor: admin, now });
  const twoDraft = saveContentDraft(one, { expectedRevision: 2, payload: { name: "Segunda versión" }, actor: admin, now });
  const two = publishContentDocument(twoDraft, { expectedRevision: 3, actor: admin, now });
  const restored = restoreContentVersion(two, { version: 1, expectedRevision: 4, actor: admin, now });
  assert.equal(readPublishedContent(restored).name, "Segunda versión");
  const three = publishContentDocument(restored, { expectedRevision: 5, actor: admin, now });
  assert.equal(three.versions.length, 3);
  assert.equal(three.versions[1].payload.name, "Segunda versión");
  assert.equal(readPublishedContent(three).name, "Universidad Siglo 21");
  assert.equal(two.versions.length, 2);
});

test("stale writes and archived documents fail", () => {
  const draft = makeDraft();
  assert.throws(() => saveContentDraft(draft, { expectedRevision: 0, payload: {}, actor: editor }), /cambió/);
  assert.throws(() => publishContentDocument({ ...draft, state: "archived" }, { expectedRevision: 1, actor: admin }), /archivado/);
  assert.equal(readPublishedContent({ ...draft, state: "archived" }), null);
});

test("legal and infrastructure modules cannot bypass their restrictions", () => {
  for (const moduleId of ["legal", "forms", "users", "history"]) {
    assert.throws(() => createContentDocument({ moduleId, entityKey: "a", payload: {}, actor: superadmin }), /módulo/);
  }
  for (const moduleId of ["design", "settings"]) {
    assert.throws(() => createContentDocument({ moduleId, entityKey: "a", payload: {}, actor: admin }), /permiso/);
  }
});

test("content validation rejects executable or non-JSON payloads", () => {
  for (const payload of [{ text: "<script>alert(1)</script>" }, { value: undefined }, { value: Infinity }, { value: () => {} }, JSON.parse('{"__proto__":{}}')]) {
    assert.throws(() => validateDraftPayload(payload));
  }
  assert.deepEqual(validateDraftPayload({ name: "Abogacía", years: ["1.º año"], visible: true }), { name: "Abogacía", years: ["1.º año"], visible: true });
});

test("slug and content link validation reject dangerous inputs", () => {
  assert.equal(isValidSlug("universidad-siglo-21"), true);
  for (const slug of ["", "../admin", "Carrera nueva", "abogacía", "a--b"]) assert.equal(isValidSlug(slug), false);
  assert.equal(isSafeContentLink("/concepcion"), true);
  assert.equal(isSafeContentLink("https://wa.me/5493865751273"), true);
  for (const url of ["javascript:alert(1)", "//example.com", "https://user:password@example.com", " /admin", "/\\example.com", "https://a.com\n"]) assert.equal(isSafeContentLink(url), false);
});

test("environment diagnostics reveal names only and reject a different project", () => {
  assert.equal(inspectAdminEnvironment({}).configured, false);
  const env = { SUPABASE_URL: "https://zomoblpgurchkxvkkutj.supabase.co", SUPABASE_PUBLISHABLE_KEY: "test-placeholder" };
  assert.equal(inspectAdminEnvironment(env).configured, true);
  assert.equal(inspectAdminEnvironment({ ...env, SUPABASE_URL: "https://other.supabase.co" }).configured, false);
  const result = inspectAdminEnvironment({ ...env, NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "do-not-return" });
  assert.equal(result.configured, false);
  assert.ok(!JSON.stringify(result).includes("do-not-return"));
  assert.equal(result.authImplemented, true);
});
