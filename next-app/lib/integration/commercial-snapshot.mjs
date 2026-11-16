import { createHash, timingSafeEqual } from "node:crypto";

export const MAX_SNAPSHOT_ROWS = 2000;
const MAX_PUBLICATIONS = 20000;
const ID = /^[a-z0-9][a-z0-9_-]{0,159}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REVISION = /^(0|[1-9]\d{0,15})$/;
const object = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const fail = () => {
  throw new Error("No se pudo verificar el catálogo publicado.");
};

export function normalizePublishedRevision(value) {
  const text =
    typeof value === "number" && Number.isSafeInteger(value)
      ? String(value)
      : value;
  if (
    typeof text !== "string" ||
    !REVISION.test(text) ||
    BigInt(text) > BigInt(Number.MAX_SAFE_INTEGER)
  )
    fail();
  return text;
}

/** Lee sólo publicaciones, nunca borradores. Una publicación concurrente invalida
 * la lectura completa; sólo se reintenta una vez y no se usa el catálogo base
 * como sustituto de una base de datos que no responde. */
export async function readStablePublications({
  readRevision,
  readPage,
  pageSize = 500,
  attempts = 2,
}) {
  if (
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 1000 ||
    ![1, 2].includes(attempts)
  )
    fail();
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const before = normalizePublishedRevision(await readRevision());
    const publications = [];
    const seenKeys = new Set();
    for (let from = 0; ; from += pageSize) {
      const page = await readPage({ from, to: from + pageSize - 1 });
      if (!Array.isArray(page) || page.length > pageSize) fail();
      for (const row of page) {
        if (
          !object(row) ||
          typeof row.key !== "string" ||
          !row.key ||
          row.key.length > 200 ||
          !object(row.published) ||
          seenKeys.has(row.key)
        )
          fail();
        // PostgreSQL ordena por su collation; no reinterpretarla como orden JS.
        seenKeys.add(row.key);
        publications.push({ key: row.key, published: row.published });
        if (publications.length > MAX_PUBLICATIONS) fail();
      }
      if (page.length < pageSize) break;
    }
    const after = normalizePublishedRevision(await readRevision());
    if (before === after) return { revision: after, publications };
  }
  fail();
}

/** Adaptador de sólo lectura. El cliente privado ya existente permanece en el
 * servidor de GET público y no forma parte del contrato de sincronización. */
export function publicationReader(client, signal) {
  const result = (response) => {
    if (response.error || !Array.isArray(response.data)) fail();
    return response.data;
  };
  return {
    async readRevision() {
      // COUNT de commits visibles, no MAX(id): dos transacciones pueden obtener
      // secuencias en orden distinto de su COMMIT. La auditoría es append-only.
      const response = await client
        .from("get_control_changes")
        .select("id", { count: "exact", head: true })
        .eq("operation", "publish")
        .abortSignal(signal);
      if (response.error) fail();
      return normalizePublishedRevision(response.count);
    },
    async readPage({ from, to }) {
      return result(
        await client
          .from("get_control_docs")
          .select("key,published")
          // No leer draft. Excluir filas aún no publicadas impide que un alta
          // de borrador desplace offsets sin cambiar la revisión publicada.
          .neq("published", "{}")
          .order("key", { ascending: true })
          .range(from, to)
          .abortSignal(signal),
      );
    },
  };
}

/** Proyección del modelo REAL inyectado por la ruta. No replica las reglas de
 * destacados, no usa plan/get_enabled y no admite IDs CRM ni datos personales. */
export function buildCommercialSnapshot({
  entries,
  catalogVersion,
  revision,
  generatedAt,
  editorialCatalog,
  cityPageFromCatalog,
}) {
  revision = normalizePublishedRevision(revision);
  if (
    typeof catalogVersion !== "string" ||
    !DATE.test(catalogVersion) ||
    Number.isNaN(Date.parse(catalogVersion + "T00:00:00.000Z")) ||
    new Date(catalogVersion + "T00:00:00.000Z").toISOString().slice(0, 10) !==
      catalogVersion ||
    typeof generatedAt !== "string" ||
    Number.isNaN(Date.parse(generatedAt)) ||
    new Date(generatedAt).toISOString() !== generatedAt ||
    !Array.isArray(entries) ||
    !entries.length ||
    entries.length > MAX_PUBLICATIONS
  )
    fail();

  const keys = new Set(),
    identities = new Set(),
    institutions = new Map(),
    cities = new Map(),
    brands = new Map();
  for (const entry of entries) {
    if (
      !object(entry) ||
      typeof entry.key !== "string" ||
      !entry.key ||
      keys.has(entry.key) ||
      !object(entry.payload) ||
      !object(entry.payload.data)
    )
      fail();
    keys.add(entry.key);
    const { _kind: kind, data } = entry.payload;
    if (!["institution", "city", "brand"].includes(kind)) continue;
    if (
      typeof data.id !== "string" ||
      !data.id ||
      identities.has(`${kind}:${data.id}`)
    )
      fail();
    identities.add(`${kind}:${data.id}`);
    if (kind === "institution") {
      if (!ID.test(data.id)) fail();
      institutions.set(data.id, entry);
    } else if (kind === "city") cities.set(data.id, data);
    else brands.set(data.id, data);
  }
  if (
    !institutions.size ||
    institutions.size > MAX_SNAPSHOT_ROWS ||
    !cities.size ||
    !brands.size
  )
    fail();
  for (const {
    payload: { data },
  } of institutions.values()) {
    if (!cities.has(data.cityId || data.citySlug) || !brands.has(data.brandId))
      fail();
  }

  const catalog = editorialCatalog(entries, { includeLegacy: false });
  if (
    !object(catalog) ||
    !Array.isArray(catalog.cities) ||
    !Array.isArray(catalog.institutions)
  )
    fail();
  const visible = new Map(),
    citySlugs = new Set(),
    featured = new Set();
  for (const institution of catalog.institutions) {
    const original = institutions.get(institution?.id);
    if (
      !original ||
      visible.has(institution.id) ||
      original.visibility === "hidden" ||
      original.payload.data.visible === false
    )
      fail();
    visible.set(institution.id, institution);
  }
  for (const city of catalog.cities) {
    if (
      !city ||
      typeof city.slug !== "string" ||
      !city.slug ||
      citySlugs.has(city.slug)
    )
      fail();
    citySlugs.add(city.slug);
    const page = cityPageFromCatalog(catalog, city.slug);
    if (!page || !Array.isArray(page.featuredInstitutions)) fail();
    for (const institution of page.featuredInstitutions) {
      if (
        !institution ||
        !visible.has(institution.id) ||
        visible.get(institution.id).citySlug !== city.slug ||
        featured.has(institution.id)
      )
        fail();
      featured.add(institution.id);
    }
  }
  for (const institution of visible.values())
    if (!citySlugs.has(institution.citySlug)) fail();
  const rows = [...institutions.keys()].sort().map((publicInstitutionId) => ({
    publicInstitutionId,
    featured: featured.has(publicInstitutionId),
  }));
  const canonical =
    `${catalogVersion}\n${revision}\n` +
    rows
      .map((row) => `${row.publicInstitutionId}|${row.featured ? 1 : 0}`)
      .join("\n");
  return {
    schemaVersion: 1,
    source: "get_public",
    catalogVersion,
    revision,
    generatedAt,
    rows,
    digest: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
}

const headers = {
  "Cache-Control": "no-store, private",
  "X-Content-Type-Options": "nosniff",
};
const reply = (status, message) =>
  Response.json({ ok: false, message }, { status, headers });
const validSecret = (secret) =>
  typeof secret === "string" && /^[\x21-\x7e]{32,512}$/.test(secret);

export function createSnapshotRequestHandler({ getSecret, getSnapshot }) {
  return async (request) => {
    if (request.method !== "GET") return reply(405, "Método no permitido.");
    try {
      const secret = getSecret();
      if (!validSecret(secret))
        return reply(503, "Sincronización no disponible.");
      const authorization = request.headers.get("authorization") || "";
      const provided = authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : "";
      if (
        !validSecret(provided) ||
        !timingSafeEqual(
          createHash("sha256").update(secret).digest(),
          createHash("sha256").update(provided).digest(),
        )
      )
        return reply(401, "Acceso no autorizado.");
      if (new URL(request.url).search)
        return reply(400, "Solicitud no válida.");
      return Response.json(await getSnapshot(), { status: 200, headers });
    } catch {
      return reply(503, "No se pudo verificar el catálogo publicado.");
    }
  };
}
