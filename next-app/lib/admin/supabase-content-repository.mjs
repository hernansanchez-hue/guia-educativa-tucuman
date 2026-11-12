import { createContentDocument, saveContentDraft, publishContentDocument, restoreContentVersion, createPreviewPayload, readPublishedContent, validateDraftPayload } from "./content-document.mjs";
import { requireAdminPermission } from "./permissions.mjs";
import { isUuid } from "./auth-contract.mjs";

function assertId(id) { if (!isUuid(id)) throw new Error("Identificador no válido."); }
function assertRevision(revision) { if (!Number.isInteger(revision) || revision < 1) throw new Error("Revisión no válida."); }
function databaseError(error) {
  const messages = { "42501": "Acceso denegado.", "40001": "El contenido cambió. Actualizá antes de guardar.", "23505": "El documento ya existe.", "22023": "Contenido no válido.", "23514": "Contenido no válido." };
  const result = new Error(messages[error.code] || "No se pudo completar la operación del CMS.");
  result.code = error.code;
  return result;
}
function mapDocument(row, versions = []) {
  return { id: row.id, moduleId: row.module_id, entityKey: row.entity_key, revision: row.revision,
    schemaVersion: row.schema_version, state: row.state, draft: row.draft,
    publishedVersion: row.published_version, updatedAt: row.updated_at, updatedBy: row.updated_by,
    versions: versions.map(v => ({ version: v.version_number, payload: v.snapshot, publishedAt: v.created_at, publishedBy: v.created_by })) };
}

/** Used by the server factory with a verified DB actor. SQL independently rechecks every mutation. */
export class SupabaseContentRepository {
  constructor(client, actor) { requireAdminPermission(actor, "read"); this.client = client; this.actor = actor; }
  async get(id) {
    assertId(id); requireAdminPermission(this.actor, "read");
    const { data, error } = await this.client.from("cms_documents").select("*").eq("id", id).maybeSingle();
    if (error) throw databaseError(error);
    if (!data) throw new Error("Documento no disponible.");
    const history = await this.client.from("cms_versions").select("version_number,snapshot,created_at,created_by").eq("document_id", id).order("version_number");
    if (history.error) throw databaseError(history.error);
    return mapDocument(data, history.data);
  }
  async list({ moduleId, offset = 0, limit = 25 } = {}) {
    requireAdminPermission(this.actor, "read");
    if (!Number.isInteger(offset) || offset < 0 || !Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error("Paginación no válida.");
    let query = this.client.from("cms_documents").select("id,module_id,entity_key,state,revision,updated_at,published_version").order("updated_at", { ascending: false }).range(offset, offset + limit - 1);
    if (moduleId) query = query.eq("module_id", moduleId);
    const { data, error } = await query;
    if (error) throw databaseError(error);
    return data;
  }
  async mutate(parameters) {
    const { data, error } = await this.client.rpc("cms_mutate_content", parameters);
    if (error) throw databaseError(error);
    // Return the same complete document/history contract as the pure phase-1 functions.
    return { document: await this.get(data.document.id), revalidation: data.revalidation };
  }
  async create({ moduleId, entityKey, payload }) {
    const draft = createContentDocument({ moduleId, entityKey, payload, actor: this.actor });
    return this.mutate({ p_operation: "create", p_module: draft.moduleId, p_entity: draft.entityKey, p_payload: draft.draft });
  }
  async save(id, { payload, expectedRevision }) {
    assertRevision(expectedRevision);
    const doc = await this.get(id);
    const next = saveContentDraft(doc, { payload, expectedRevision, actor: this.actor });
    return this.mutate({ p_operation: "save", p_id: id, p_payload: next.draft, p_revision: expectedRevision });
  }
  async publish(id, { expectedRevision }) {
    assertRevision(expectedRevision);
    const doc = await this.get(id);
    publishContentDocument(doc, { expectedRevision, actor: this.actor });
    return this.mutate({ p_operation: "publish", p_id: id, p_revision: expectedRevision });
  }
  async restore(id, { version, expectedRevision }) {
    assertRevision(expectedRevision); assertRevision(version);
    const doc = await this.get(id);
    restoreContentVersion(doc, { version, expectedRevision, actor: this.actor });
    return this.mutate({ p_operation: "restore", p_id: id, p_revision: expectedRevision, p_version: version });
  }
  async archive(id, { expectedRevision }) {
    requireAdminPermission(this.actor, "archive"); assertId(id); assertRevision(expectedRevision);
    return this.mutate({ p_operation: "archive", p_id: id, p_revision: expectedRevision });
  }
  async unpublish(id, { expectedRevision }) {
    requireAdminPermission(this.actor, "publish"); assertId(id); assertRevision(expectedRevision);
    return this.mutate({ p_operation: "unpublish", p_id: id, p_revision: expectedRevision });
  }
  async preview(id, unsavedPayload) {
    return createPreviewPayload(await this.get(id), unsavedPayload, this.actor);
  }
  async published(id) { return readPublishedContent(await this.get(id)); }
}

export async function readSupabasePublished(client, { moduleId, entityKey }) {
  if (typeof moduleId !== "string" || typeof entityKey !== "string" || entityKey.length > 250) throw new Error("Identidad no válida.");
  const { data, error } = await client.rpc("cms_read_published", { p_module: moduleId, p_entity: entityKey });
  if (error) throw databaseError(error);
  return data === null ? null : validateDraftPayload(data);
}
