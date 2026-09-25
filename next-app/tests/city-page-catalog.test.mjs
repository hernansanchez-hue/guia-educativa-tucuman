import assert from "node:assert/strict";
import test from "node:test";
import {
  getCityPageCatalog,
  getLocalCityPageCatalog,
  getSupabaseCityPageCatalog,
} from "../lib/public-catalog/city-page-catalog.js";

const cityRows = [
  {
    id: "city-concepcion",
    slug: "concepcion",
    name: "Concepción",
    title: "Instituciones de Concepción",
    display_order: 1,
    visual_metadata: {
      institutionIds: ["universidad-siglo-21-concepcion", "instituto-santa-barbara-concepcion", "ies-concepcion-concepcion"],
      featuredInstitutionIds: ["universidad-siglo-21-concepcion", "instituto-santa-barbara-concepcion", "instituto-del-sur-monteros"],
      canonicalDataNotice: "inconsistencia canónica conservada temporalmente para mantener fidelidad visual",
    },
  },
  {
    id: "city-monteros",
    slug: "monteros",
    name: "Monteros",
    title: "Instituciones de Monteros",
    display_order: 2,
    visual_metadata: {
      institutionIds: ["universidad-siglo-21-monteros", "instituto-del-sur-monteros", "centro-de-formacion-tucuman-monteros", "instituto-san-miguel-monteros"],
      featuredInstitutionIds: ["universidad-siglo-21-monteros", "instituto-santa-barbara-concepcion", "instituto-del-sur-monteros"],
    },
  },
  {
    id: "city-aguilares",
    slug: "aguilares",
    name: "Aguilares",
    title: "Instituciones de Aguilares",
    display_order: 3,
    visual_metadata: {
      institutionIds: ["universidad-siglo-21-aguilares", "instituto-santa-barbara-aguilares", "academia-profesional-norte-aguilares"],
      featuredInstitutionIds: ["universidad-siglo-21-aguilares", "instituto-santa-barbara-aguilares", "instituto-del-sur-monteros"],
      canonicalDataNotice: "slider/fallback canónico preservado: incluye Instituto del Sur de Monteros",
    },
  },
];

function remoteInstitutionFromLocal(local, cityId, displayOrder, isFeatured) {
  return {
    id: `uuid-${local.id}`,
    legacy_key: local.id,
    city_id: cityId,
    slug: local.slug,
    name: local.name,
    type: local.type,
    logo_text: local.logo,
    plan: local.plan,
    slogan: local.slogan,
    description: local.description,
    address: local.address,
    whatsapp: local.whatsapp,
    website: null,
    opening_hours: null,
    hero_image_url: local.image,
    media_label: local.media,
    gallery: local.gallery,
    cities_label: local.cities,
    display_order: displayOrder,
    is_featured: isFeatured,
    visual_metadata: local.canonicalDataNotice
      ? { canonicalDataNotice: local.canonicalDataNotice }
      : {},
  };
}

const localConcepcion = getLocalCityPageCatalog("concepcion");
const localMonteros = getLocalCityPageCatalog("monteros");
const localAguilares = getLocalCityPageCatalog("aguilares");
const allLocalInstitutions = [
  ...localConcepcion.institutions,
  ...localMonteros.institutions,
  ...localAguilares.institutions,
  ...localConcepcion.featuredInstitutions,
  ...localMonteros.featuredInstitutions,
  ...localAguilares.featuredInstitutions,
].filter((institution, index, entries) => entries.findIndex((item) => item.id === institution.id) === index);
const cityIdBySlug = new Map(cityRows.map((city) => [city.slug, city.id]));
const institutionRows = allLocalInstitutions.map((institution, index) => remoteInstitutionFromLocal(
  institution,
  cityIdBySlug.get(institution.citySlug),
  index + 1,
  true,
));

function mockFetch(url) {
  const rows = url.includes("cities?") ? cityRows : institutionRows;
  return Promise.resolve({ ok: true, json: async () => rows });
}

function remoteOptions() {
  return {
    env: {
      PUBLIC_CATALOG_SOURCE: "supabase",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
    },
    fetchImpl: mockFetch,
  };
}

for (const citySlug of ["concepcion", "monteros", "aguilares"]) {
  test(`local and Supabase ${citySlug} catalogs have the same visual shape`, async () => {
    const local = getLocalCityPageCatalog(citySlug);
    const remote = await getSupabaseCityPageCatalog(citySlug, remoteOptions());
    assert.deepEqual(remote, local);
  });
}

test("default source is local", async () => {
  assert.deepEqual(await getCityPageCatalog("concepcion", { env: {} }), localConcepcion);
});

test("Supabase preserves legacy keys, order and featured references", async () => {
  const city = await getCityPageCatalog("monteros", remoteOptions());
  assert.deepEqual(city.institutionIds, localMonteros.institutionIds);
  assert.deepEqual(city.featuredInstitutionIds, localMonteros.featuredInstitutionIds);
  assert.deepEqual(city.institutions.map((institution) => institution.id), localMonteros.institutionIds);
  assert.deepEqual(city.featuredInstitutions.map((institution) => institution.id), localMonteros.featuredInstitutionIds);
});

test("invalid source fails clearly", async () => {
  await assert.rejects(
    () => getCityPageCatalog("concepcion", { env: { PUBLIC_CATALOG_SOURCE: "remote" } }),
    /Unsupported PUBLIC_CATALOG_SOURCE: remote/,
  );
});

test("Supabase requires URL and publishable key", async () => {
  await assert.rejects(
    () => getCityPageCatalog("concepcion", { env: { PUBLIC_CATALOG_SOURCE: "supabase" } }),
    /Missing SUPABASE_URL/,
  );
  await assert.rejects(
    () => getCityPageCatalog("concepcion", {
      env: { PUBLIC_CATALOG_SOURCE: "supabase", SUPABASE_URL: "https://example.supabase.co" },
    }),
    /Missing SUPABASE_PUBLISHABLE_KEY/,
  );
});
