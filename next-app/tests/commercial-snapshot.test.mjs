import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildCommercialSnapshot,
  createSnapshotRequestHandler,
  normalizePublishedRevision,
  publicationReader,
  readStablePublications,
} from "../lib/integration/commercial-snapshot.mjs";

// Al copiar estos archivos a GET público no requiere variable. En la carpeta de
// integración se exige una fuente Next explícita: nunca se simula el modelo real.
const source = process.env.GET_PUBLIC_SOURCE_ROOT;
const sourceUrl = source
  ? pathToFileURL(resolve(source) + "/").href
  : new URL("../", import.meta.url).href;
const fromSource = (path) => import(new URL(path, sourceUrl).href);
const { editorialCatalog, cityPageFromCatalog } = await fromSource(
  "lib/admin/editorial-model.mjs",
);
const { project } = await fromSource("lib/control/domain.mjs");
const { isExtendedRecord } = await fromSource("lib/control/extended.mjs");
const { getVersionedPublicCatalogEntries, PUBLIC_CATALOG_VERSION } =
  await fromSource("lib/catalog/versioned-public-catalog.mjs");
const at = "2026-11-15T12:00:00.000Z";
const entry = (kind, data, key = `${kind}/${data.id}`) => ({
  key,
  moduleId: kind === "city" ? "cities" : "institutions",
  visibility: "published",
  payload: { _kind: kind, data },
});
function fixture() {
  return [
    entry("city", {
      id: "city-a",
      slug: "city-a",
      institutionIds: ["sede-a", "sede-b"],
      featuredInstitutionIds: ["sede-a"],
    }),
    entry("city", {
      id: "city-b",
      slug: "city-b",
      institutionIds: ["sede-c"],
      featuredInstitutionIds: [],
    }),
    entry("brand", { id: "marca", name: "Marca ficticia" }),
    ...["a", "b", "c"].map((id) =>
      entry("institution", {
        id: `sede-${id}`,
        slug: `sede-${id}`,
        cityId: id === "c" ? "city-b" : "city-a",
        citySlug: id === "c" ? "city-b" : "city-a",
        brandId: "marca",
        plan: id === "b" ? "Premium" : "Básico",
      }),
    ),
  ];
}
const build = (entries = fixture(), extra = {}) =>
  buildCommercialSnapshot({
    entries,
    catalogVersion: "2026-11-15",
    revision: "4",
    generatedAt: at,
    editorialCatalog,
    cityPageFromCatalog,
    ...extra,
  });
const featured = (snapshot) =>
  snapshot.rows
    .filter((row) => row.featured)
    .map((row) => row.publicInstitutionId);
const publication = (key, published = {}) => ({ key, published });

test("modelo real: contrato mínimo, orden ASCII, digest canónico y sin PII/IDs CRM", () => {
  const snapshot = build();
  assert.deepEqual(featured(snapshot), ["sede-a"]);
  assert.deepEqual(Object.keys(snapshot).sort(), [
    "catalogVersion",
    "digest",
    "generatedAt",
    "revision",
    "rows",
    "schemaVersion",
    "source",
  ]);
  assert.deepEqual(snapshot.rows, [
    { publicInstitutionId: "sede-a", featured: true },
    { publicInstitutionId: "sede-b", featured: false },
    { publicInstitutionId: "sede-c", featured: false },
  ]);
  assert.equal(
    snapshot.digest,
    createHash("sha256")
      .update("2026-11-15\n4\nsede-a|1\nsede-b|0\nsede-c|0")
      .digest("hex"),
  );
  assert.equal(JSON.stringify(snapshot).includes("Marca ficticia"), false);
  assert.equal(build(fixture().reverse()).digest, snapshot.digest);
  assert.equal(
    build(fixture(), { generatedAt: "2026-11-16T12:00:00.000Z" }).digest,
    snapshot.digest,
  );
  assert.notEqual(build(fixture(), { revision: "5" }).digest, snapshot.digest);
});

test("catálogo real versionado: 125 sedes, seis tarjetas y ninguna QA del CRM", () => {
  const snapshot = build(getVersionedPublicCatalogEntries(), {
    catalogVersion: PUBLIC_CATALOG_VERSION,
  });
  assert.equal(snapshot.rows.length, 125);
  assert.equal(featured(snapshot).length, 6);
  assert.equal(
    snapshot.rows.some((row) => row.publicInstitutionId.startsWith("qa-")),
    false,
  );
  assert.equal(
    snapshot.rows.some(
      (row) => row.publicInstitutionId === "qa-validation-institution-20261028",
    ),
    false,
  );
  assert.equal(
    snapshot.rows.find(
      (row) => row.publicInstitutionId === "instituto-del-sur-monteros",
    ).featured,
    true,
  );
});

test("publicar alta/baja de tarjeta modifica el snapshot; no consulta plan comercial", () => {
  const rows = [
    publication("city/city-a", {
      placements: [
        { id: "sede-b", active: true },
        { id: "sede-a", active: false },
      ],
    }),
  ];
  assert.deepEqual(featured(build(project(fixture(), rows))), ["sede-b"]);
  rows[0].published.placements = [];
  assert.deepEqual(featured(build(project(fixture(), rows))), []);
});

test("guardado de borrador no altera la clasificación publicada", () => {
  const rows = [
    {
      ...publication("city/city-a", {
        placements: [{ id: "sede-b", active: true }],
      }),
      draft: { placements: [{ id: "sede-a", active: true }] },
    },
  ];
  assert.deepEqual(featured(build(project(fixture(), rows))), ["sede-b"]);
});

test("sede oculta se conserva en el snapshot con featured=false", () => {
  const rows = [publication("institution/sede-a", { visible: false })];
  const snapshot = build(project(fixture(), rows));
  assert.equal(snapshot.rows.length, 3);
  assert.deepEqual(featured(snapshot), []);
  const entries = fixture();
  entries.find((row) => row.key === "institution/sede-a").visibility = "hidden";
  assert.deepEqual(featured(build(entries)), []);
});

test("ciudad oculta conserva sus sedes, sin marcar tarjetas no publicadas", () => {
  const snapshot = build(
    project(fixture(), [publication("city/city-a", { visible: false })]),
  );
  assert.equal(snapshot.rows.length, 3);
  assert.deepEqual(featured(snapshot), []);
});

test("lista editorial de otra ciudad no produce una tarjeta inexistente", () => {
  const entries = fixture();
  entries[0].payload.data.featuredInstitutionIds.push("sede-c");
  assert.deepEqual(featured(build(entries)), ["sede-a"]);
});

test("sede nueva publicada conserva ID público; no inventa UUID CRM ni depende de mapping", () => {
  const newEntry = entry("institution", {
    id: "cc-new-public-venue",
    slug: "nueva",
    cityId: "city-a",
    brandId: "marca",
  });
  const rows = [publication(newEntry.key, { _created: [newEntry] })];
  const snapshot = build(project(fixture(), rows));
  assert.equal(snapshot.rows.length, 4);
  assert.deepEqual(
    snapshot.rows.find(
      (row) => row.publicInstitutionId === "cc-new-public-venue",
    ),
    { publicInstitutionId: "cc-new-public-venue", featured: false },
  );
});

test("alta posteriormente oculta conserva _created publicado sin devolver contenido ni borradores", () => {
  const newEntry = entry("institution", {
    id: "cc-hidden-venue",
    slug: "oculta",
    cityId: "city-a",
    brandId: "marca",
    name: "Identidad no expuesta",
    email: "fixture@example.com",
  });
  const rows = [
    {
      ...publication(newEntry.key, { _created: [newEntry], visible: false }),
      draft: { visible: true, email: "borrador@example.com" },
    },
    publication("city/city-a", {
      placements: [{ id: "cc-hidden-venue", active: true }],
    }),
  ];
  const snapshot = build(project(fixture(), rows));
  assert.equal(snapshot.rows.length, 4);
  assert.deepEqual(
    snapshot.rows.find((row) => row.publicInstitutionId === "cc-hidden-venue"),
    { publicInstitutionId: "cc-hidden-venue", featured: false },
  );
  const serialized = JSON.stringify(snapshot);
  assert.equal(
    /Identidad|fixture@example|borrador@example|_created|draft/.test(
      serialized,
    ),
    false,
  );
});

test("ignora publicaciones de eventos/servicios según el filtro real", () => {
  const publications = [
    publication("extended/events/event/test", { visible: true }),
  ];
  assert.deepEqual(
    build(
      project(
        fixture(),
        publications.filter((row) => !isExtendedRecord(row)),
      ),
    ),
    build(),
  );
});

test("duplicado de entrada, identidad, tarjeta o ciudad ambigua aborta", () => {
  const original = fixture();
  assert.throws(() => build([...original, structuredClone(original[3])]));
  assert.throws(() =>
    build([
      ...original,
      { ...structuredClone(original[3]), key: "otra-clave" },
    ]),
  );
  const duplicateCard = project(fixture(), [
    publication("city/city-a", {
      placements: [
        { id: "sede-a", active: true },
        { id: "sede-a", active: true },
      ],
    }),
  ]);
  assert.throws(() => build(duplicateCard));
  const duplicateCity = fixture();
  duplicateCity[1].payload.data.slug = "city-a";
  assert.throws(() => build(duplicateCity));
});

test("identidades inválidas, referencias ausentes y catálogo vacío/incompleto abortan", () => {
  for (const id of [
    "<script>",
    "sede con espacio",
    "á",
    "-sede",
    "_sede",
    "a".repeat(161),
  ]) {
    const entries = fixture();
    entries[3].payload.data.id = id;
    assert.throws(() => build(entries));
  }
  assert.throws(() => build([]));
  assert.throws(() =>
    build(fixture().filter((row) => row.payload._kind !== "brand")),
  );
  assert.throws(() =>
    build(fixture().filter((row) => row.payload.data.id !== "city-a")),
  );
  const tooMany = fixture();
  for (let i = 0; i < 2000; i += 1)
    tooMany.push(
      entry("institution", {
        id: `sede-extra-${i}`,
        cityId: "city-a",
        brandId: "marca",
      }),
    );
  assert.throws(() => build(tooMany));
});

test("revisión segura y fechas exactas: no acepta valores ambiguos ni truncados", () => {
  for (const value of [
    -1,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
    "01",
    "1.0",
    "9007199254740992",
    null,
  ]) {
    assert.throws(() => normalizePublishedRevision(value));
  }
  assert.equal(
    normalizePublishedRevision("9007199254740991"),
    "9007199254740991",
  );
  assert.equal(normalizePublishedRevision(0), "0");
  assert.throws(() => build(fixture(), { catalogVersion: "2026-02-30" }));
  assert.throws(() => build(fixture(), { generatedAt: "hoy" }));
});

test("lectura estable pagina por clave y termina sólo tras página incompleta", async () => {
  const all = [publication("a"), publication("b"), publication("c")],
    ranges = [];
  const result = await readStablePublications({
    pageSize: 2,
    readRevision: async () => 8,
    readPage: async ({ from, to }) => {
      ranges.push([from, to]);
      return all.slice(from, to + 1);
    },
  });
  assert.deepEqual(result, { revision: "8", publications: all });
  assert.deepEqual(ranges, [
    [0, 1],
    [2, 3],
  ]);
});

test("publicación concurrente descarta primera lectura y sólo reintenta una vez", async () => {
  const revisions = ["1", "2", "2", "2"];
  let calls = 0;
  const result = await readStablePublications({
    readRevision: async () => revisions.shift(),
    readPage: async () => [publication(`publicacion-${++calls}`)],
  });
  assert.equal(calls, 2);
  assert.deepEqual(result, {
    revision: "2",
    publications: [publication("publicacion-2")],
  });
});

test("concurrencia continua o error de DB aborta; nunca responde catálogo base", async () => {
  const revisions = ["1", "2", "3", "4"];
  await assert.rejects(
    readStablePublications({
      readRevision: async () => revisions.shift(),
      readPage: async () => [],
    }),
  );
  let calls = 0;
  await assert.rejects(
    readStablePublications({
      readRevision: async () => "4",
      readPage: async () => {
        calls += 1;
        throw Error("fallo simulado");
      },
    }),
  );
  assert.equal(calls, 1);
  await assert.rejects(
    readStablePublications({
      readRevision: async () => "4",
      readPage: async () => null,
    }),
  );
});

test("página duplicada/inválida o truncamiento excesivo falla cerrado", async () => {
  await assert.rejects(
    readStablePublications({
      pageSize: 1,
      readRevision: async () => "0",
      readPage: async () => [publication("a")],
    }),
  );
  await assert.rejects(
    readStablePublications({
      readRevision: async () => "0",
      readPage: async () => [{ key: "a", draft: {} }],
    }),
  );
  await assert.rejects(
    readStablePublications({
      pageSize: 1,
      readRevision: async () => "0",
      readPage: async () => [publication("a"), publication("b")],
    }),
  );
});

test("adaptador lee published sin draft y COUNT exacto de publish; orden y abortSignal", async () => {
  const operations = [],
    signal = AbortSignal.timeout(5000);
  const db = {
    from(table) {
      const chain = {
        then(resolve) {
          return Promise.resolve({
            data: table === "get_control_changes" ? null : [],
            count: table === "get_control_changes" ? 42 : null,
            error: null,
          }).then(resolve);
        },
      };
      for (const method of [
        "select",
        "eq",
        "neq",
        "order",
        "limit",
        "range",
        "abortSignal",
      ])
        chain[method] = (...args) => {
          operations.push([table, method, ...args]);
          return chain;
        };
      return chain;
    },
  };
  const reader = publicationReader(db, signal);
  assert.equal(await reader.readRevision(), "42");
  assert.deepEqual(await reader.readPage({ from: 0, to: 499 }), []);
  assert.ok(
    operations.some(
      (row) =>
        row[0] === "get_control_changes" &&
        row[1] === "eq" &&
        row[2] === "operation" &&
        row[3] === "publish",
    ),
  );
  assert.ok(
    operations.some(
      (row) =>
        row[0] === "get_control_docs" &&
        row[1] === "select" &&
        row[2] === "key,published",
    ),
  );
  assert.ok(
    operations.some(
      (row) => row[1] === "order" && row[2] === "key" && row[3].ascending,
    ),
  );
  assert.equal(
    operations.filter((row) => row[1] === "abortSignal" && row[2] === signal)
      .length,
    2,
  );
  assert.ok(
    operations.some(
      (row) =>
        row[0] === "get_control_changes" &&
        row[1] === "select" &&
        row[2] === "id" &&
        row[3].count === "exact" &&
        row[3].head === true,
    ),
  );
  assert.ok(
    operations.some(
      (row) =>
        row[0] === "get_control_docs" &&
        row[1] === "neq" &&
        row[2] === "published" &&
        row[3] === "{}",
    ),
  );
  assert.equal(
    operations.some((row) => row[1] === "select" && row[2].includes("draft")),
    false,
  );
  assert.equal(
    operations.some(
      (row) => row[0] === "get_control_changes" && row[1] === "order",
    ),
    false,
  );
});

test("commit tardío con ID menor cambia COUNT aunque MAX no cambie y exige repetir snapshot", async () => {
  const committed = [[100], [99, 100], [99, 100], [99, 100]];
  assert.equal(Math.max(...committed[0]), Math.max(...committed[1]));
  let calls = 0;
  const result = await readStablePublications({
    readRevision: async () => committed.shift().length,
    readPage: async () => [publication(`lectura-${++calls}`)],
  });
  assert.equal(calls, 2);
  assert.deepEqual(result, {
    revision: "2",
    publications: [publication("lectura-2")],
  });
});

test("COUNT no disponible o error de DB nunca se convierte en revisión cero", async () => {
  for (const value of [
    { count: null, error: null },
    { count: 1, error: { message: "error simulado" } },
  ]) {
    const db = {
      from() {
        const chain = {
          select: () => chain,
          eq: () => chain,
          abortSignal: async () => value,
        };
        return chain;
      },
    };
    await assert.rejects(
      publicationReader(db, AbortSignal.timeout(1000)).readRevision(),
    );
  }
});

const secret = "fixture-only-catalog-sync-".repeat(3);
const request = (
  authorization = `Bearer ${secret}`,
  path = "",
  method = "GET",
) =>
  new Request(`https://public.example/api/institution-classification${path}`, {
    method,
    headers: authorization ? { Authorization: authorization } : {},
  });

test("sin configuración, sin Bearer o credencial distinta no consulta DB", async () => {
  let calls = 0;
  const getSnapshot = async () => {
    calls += 1;
    return build();
  };
  for (const configured of [undefined, "", "corta"]) {
    assert.equal(
      (
        await createSnapshotRequestHandler({
          getSecret: () => configured,
          getSnapshot,
        })(request())
      ).status,
      503,
    );
  }
  const handle = createSnapshotRequestHandler({
    getSecret: () => secret,
    getSnapshot,
  });
  for (const value of [
    "",
    `Basic ${secret}`,
    `Bearer ${"incorrecta-".repeat(8)}`,
  ]) {
    assert.equal((await handle(request(value))).status, 401);
  }
  assert.equal(calls, 0);
});

test("GET autenticado no-cache, sin CORS/cookies/PII; no admite filtros ni otros métodos", async () => {
  let calls = 0;
  const handle = createSnapshotRequestHandler({
    getSecret: () => secret,
    getSnapshot: async () => {
      calls += 1;
      return build();
    },
  });
  const response = await handle(request());
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(response.headers.has("access-control-allow-origin"), false);
  assert.equal(response.headers.has("set-cookie"), false);
  assert.deepEqual(await response.json(), build());
  assert.equal(
    (await handle(request(undefined, "?institutionId=sede-a"))).status,
    400,
  );
  for (const method of ["POST", "HEAD", "OPTIONS"])
    assert.equal((await handle(request(undefined, "", method))).status, 405);
  assert.equal(calls, 1);
});

test("fallos se sanitizan sin valores privados ni stack; no reintenta mutaciones", async () => {
  let calls = 0;
  const handle = createSnapshotRequestHandler({
    getSecret: () => secret,
    getSnapshot: async () => {
      calls += 1;
      throw Error("dato-privado-simulado y stack de base");
    },
  });
  const response = await handle(request());
  assert.equal(response.status, 503);
  const body = await response.text();
  assert.equal(body.includes("dato-privado"), false);
  assert.equal(body.includes(secret), false);
  assert.equal(calls, 1);
});

test("ruta reutiliza proyección real y secreto dedicado; no amplía ingest ni modifica datos", async () => {
  const code = await readFile(
    new URL("../app/api/institution-classification/route.js", import.meta.url),
    "utf8",
  );
  assert.match(code, /GET_CATALOG_SYNC_SECRET/);
  assert.match(code, /controlMode\(\)\s*!==\s*["']supabase["']/);
  assert.match(
    code,
    /project\(\s*getVersionedPublicCatalogEntries\(\),\s*publications\.filter/,
  );
  assert.match(code, /editorialCatalog,\s*cityPageFromCatalog/);
  assert.equal(
    /GET_CRM_INGEST_SECRET|GET_PUBLIC_INGEST_SECRET|\.insert\(|\.update\(|\.upsert\(|\.delete\(/.test(
      code,
    ),
    false,
  );
});
