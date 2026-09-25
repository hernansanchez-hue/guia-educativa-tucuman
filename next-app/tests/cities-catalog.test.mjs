import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptSupabaseCity,
  getCitiesCatalog,
  getLocalCitiesCatalog,
  getSupabaseCitiesCatalog,
} from "../lib/public-catalog/cities-catalog.js";

const env = {
  SUPABASE_URL: "https://catalog.example.test",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_key",
};

function fetchCities(rows) {
  return async () => ({ ok: true, status: 200, json: async () => rows });
}

const remoteCities = [
  { slug: "aguilares", name: "Aguilares", title: "Instituciones de Aguilares", display_order: 3, visual_metadata: { institutionIds: ["academia-profesional-norte-aguilares"], featuredInstitutionIds: ["instituto-del-sur-monteros"] } },
  { slug: "concepcion", name: "Concepción", title: "Instituciones de Concepción", display_order: 1, visual_metadata: { institutionIds: ["universidad-siglo-21-concepcion"], featuredInstitutionIds: ["instituto-del-sur-monteros"], canonicalDataNotice: "nota canónica" } },
  { slug: "monteros", name: "Monteros", title: "Instituciones de Monteros", display_order: 2, visual_metadata: { institutionIds: ["instituto-del-sur-monteros"], featuredInstitutionIds: ["instituto-santa-barbara-concepcion"] } },
];

test("default source is local", async () => {
  assert.deepEqual(await getCitiesCatalog({ env: {} }), getLocalCitiesCatalog());
});

test("explicit local source uses local catalog", async () => {
  assert.deepEqual(await getCitiesCatalog({ env: { PUBLIC_CATALOG_SOURCE: "local" } }), getLocalCitiesCatalog());
});

test("explicit Supabase source adapts and orders cities", async () => {
  const cities = await getCitiesCatalog({ env: { ...env, PUBLIC_CATALOG_SOURCE: "supabase" }, fetchImpl: fetchCities(remoteCities) });
  assert.deepEqual(cities.map((city) => city.slug), ["concepcion", "monteros", "aguilares"]);
  assert.deepEqual(cities[0], { slug: "concepcion", name: "Concepción", title: "Instituciones de Concepción", institutionIds: ["universidad-siglo-21-concepcion"], featuredInstitutionIds: ["instituto-del-sur-monteros"], canonicalDataNotice: "nota canónica" });
});

test("invalid source fails clearly without exposing a key", async () => {
  await assert.rejects(getCitiesCatalog({ env: { ...env, PUBLIC_CATALOG_SOURCE: "invalid-source" } }), (error) => {
    assert.match(error.message, /Unsupported PUBLIC_CATALOG_SOURCE/);
    assert.doesNotMatch(error.message, /sb_publishable_test_key/);
    return true;
  });
});

test("Supabase requires URL and publishable key", async () => {
  await assert.rejects(getCitiesCatalog({ env: { PUBLIC_CATALOG_SOURCE: "supabase", SUPABASE_PUBLISHABLE_KEY: env.SUPABASE_PUBLISHABLE_KEY } }), /Missing SUPABASE_URL environment variable/);
  await assert.rejects(getCitiesCatalog({ env: { PUBLIC_CATALOG_SOURCE: "supabase", SUPABASE_URL: env.SUPABASE_URL } }), /Missing SUPABASE_PUBLISHABLE_KEY environment variable/);
});

test("adapter preserves visual metadata arrays and accepts Supabase rows", () => {
  const adapted = adaptSupabaseCity(remoteCities[0]);
  assert.deepEqual(adapted.institutionIds, ["academia-profesional-norte-aguilares"]);
  assert.deepEqual(adapted.featuredInstitutionIds, ["instituto-del-sur-monteros"]);
});

test("direct Supabase adapter orders by display_order", async () => {
  const cities = await getSupabaseCitiesCatalog({ env, fetchImpl: fetchCities(remoteCities) });
  assert.deepEqual(cities.map((city) => city.name), ["Concepción", "Monteros", "Aguilares"]);
});
