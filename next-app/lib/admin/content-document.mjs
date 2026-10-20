import { getAdminModule } from "./module-registry.mjs";
import { requireAdminPermission } from "./permissions.mjs";

/** In-memory domain contract; no persistence, endpoint or public-reader integration. */
export function isValidSlug(value) {
  return typeof value === "string" && value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isSafeContentLink(value) {
  if (typeof value !== "string" || !value || value !== value.trim() || /[\\\s\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

function validateJson(value, depth = 0) {
  if (depth > 15) throw new Error("El contenido tiene demasiados niveles.");
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (typeof value === "string") {
    if (value.length > 20000 || /<\/?[a-z][^>]*>/i.test(value)) throw new Error("Usá texto sin código HTML.");
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 1000) throw new Error("La lista supera el límite permitido.");
    value.forEach((item) => validateJson(item, depth + 1));
    return;
  }
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    if (Object.keys(value).length > 250) throw new Error("El contenido supera el límite permitido.");
    for (const [key, item] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("Campo no permitido.");
      validateJson(item, depth + 1);
    }
    return;
  }
  throw new Error("Formato de contenido no válido.");
}

export function validateDraftPayload(payload) {
  if (!payload || Object.getPrototypeOf(payload) !== Object.prototype) throw new Error("El contenido debe ser un objeto.");
  validateJson(payload);
  if (JSON.stringify(payload).length > 500000) throw new Error("El contenido supera el tamaño permitido.");
  return structuredClone(payload);
}

function timestamp(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("Fecha no válida.");
  return date.toISOString();
}

function mutableModule(moduleId) {
  const definition = getAdminModule(moduleId);
  if (!definition || definition.requiresLegalReview || ["users", "history", "forms", "media"].includes(moduleId)) {
    throw new Error("Este módulo no admite documentos editoriales en esta etapa.");
  }
  return definition;
}

function requireContentPermission(actor, moduleId, action) {
  mutableModule(moduleId);
  requireAdminPermission(actor, action);
  if (moduleId === "design") requireAdminPermission(actor, "design");
  if (moduleId === "settings") requireAdminPermission(actor, "settings");
}

export function createContentDocument({ moduleId, entityKey, payload, actor, now = new Date() }) {
  requireContentPermission(actor, moduleId, "edit");
  if (typeof entityKey !== "string" || !entityKey.trim() || entityKey.length > 250) throw new Error("Identidad de contenido no válida.");
  return {
    moduleId, entityKey, revision: 1, state: "draft",
    draft: validateDraftPayload(payload), publishedVersion: null,
    versions: [], updatedAt: timestamp(now), updatedBy: actor.id,
  };
}

function assertRevision(document, expectedRevision) {
  if (!document || !Number.isInteger(expectedRevision) || expectedRevision !== document.revision) {
    throw new Error("El contenido cambió. Actualizá antes de guardar.");
  }
  if (document.state === "archived") throw new Error("El contenido está archivado.");
}

export function saveContentDraft(document, { payload, expectedRevision, actor, now = new Date() }) {
  requireContentPermission(actor, document?.moduleId, "edit");
  assertRevision(document, expectedRevision);
  return {
    ...structuredClone(document), draft: validateDraftPayload(payload),
    state: document.publishedVersion === null ? "draft" : "pending_changes",
    revision: document.revision + 1, updatedAt: timestamp(now), updatedBy: actor.id,
  };
}

export function publishContentDocument(document, { expectedRevision, actor, now = new Date() }) {
  requireContentPermission(actor, document?.moduleId, "publish");
  assertRevision(document, expectedRevision);
  const next = structuredClone(document);
  const version = next.versions.length + 1;
  next.versions.push({ version, payload: validateDraftPayload(document.draft), publishedAt: timestamp(now), publishedBy: actor.id });
  return { ...next, state: "published", publishedVersion: version, revision: document.revision + 1, updatedAt: timestamp(now), updatedBy: actor.id };
}

export function restoreContentVersion(document, { version, expectedRevision, actor, now = new Date() }) {
  requireContentPermission(actor, document?.moduleId, "restore");
  assertRevision(document, expectedRevision);
  const previous = document.versions.find((item) => item.version === version);
  if (!previous) throw new Error("No se encontró la versión.");
  // Restoration produces a draft. Publishing creates a new immutable snapshot.
  return saveContentDraft(document, { payload: previous.payload, expectedRevision, actor, now });
}

export function readPublishedContent(document) {
  if (!document || document.state === "archived" || document.publishedVersion === null) return null;
  const published = document.versions.find((item) => item.version === document.publishedVersion);
  return published ? structuredClone(published.payload) : null;
}

export function createPreviewPayload(document, unsavedPayload, actor) {
  requireContentPermission(actor, document?.moduleId, "preview");
  return validateDraftPayload(unsavedPayload ?? document.draft);
}
