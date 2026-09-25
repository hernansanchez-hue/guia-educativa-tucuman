import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildHomeMapCatalog,
  CITY_DEPARTMENT_IDS,
  getHomeMapCatalog,
  getLocalHomeMapCatalog,
  getSupabaseHomeMapCatalog,
} from "../lib/public-catalog/home-map-catalog.js";
import { departmentAction } from "../lib/public-catalog/home-map-interaction.js";

test("official GeoRef asset contains all 17 individually identified departmental polygons", () => {
  const geojson = JSON.parse(readFileSync(new URL("../public/assets/tucuman-departamentos.geojson", import.meta.url)));
  assert.equal(geojson.type, "FeatureCollection");
  assert.equal(geojson.features.length, 17);
  assert.equal(new Set(geojson.features.map((feature) => feature.properties.id)).size, 17);
  assert.ok(geojson.features.every((feature) => feature.geometry.type === "MultiPolygon" && feature.geometry.coordinates.length));
  for (const code of Object.values(CITY_DEPARTMENT_IDS)) assert.ok(geojson.features.some((feature) => feature.properties.id === code));
});

test("current cities map to Chicligasta, Monteros and Río Chico, with dynamic local counts", () => {
  assert.deepEqual(CITY_DEPARTMENT_IDS, { concepcion: "90021", monteros: "90070", aguilares: "90077" });
  const result = getLocalHomeMapCatalog();
  assert.deepEqual(result.province, { cityCount: 3, institutionCount: 10, careerCount: 30 });
  assert.deepEqual(Object.keys(result.byDepartment).sort(), ["90021", "90070", "90077"]);
  assert.equal(result.byDepartment["90021"].cities[0].slug, "concepcion");
  assert.equal(result.byDepartment["90070"].cities[0].slug, "monteros");
  assert.equal(result.byDepartment["90077"].cities[0].slug, "aguilares");
  assert.ok(result.search.some((entry) => entry.type === "Carrera" && entry.href.endsWith("/lic-en-administracion")));
});

test("zero, one and multiple cities aggregate their own active institutions and published academic offerings", () => {
  const result = buildHomeMapCatalog({
    cities: [
      { id: "a", slug: "alpha", name: "Alpha", active: true },
      { id: "b", slug: "beta", name: "Beta", active: true },
      { id: "c", slug: "gamma", name: "Gamma", active: true },
      { id: "d", slug: "hidden", name: "Hidden", active: false },
    ],
    institutions: [
      { id: "i1", cityId: "a", slug: "one", name: "One", active: true },
      { id: "i2", cityId: "b", slug: "two", name: "Two", active: true },
      { id: "i3", cityId: "c", slug: "three", name: "Three", active: false },
      { id: "i4", cityId: "d", slug: "four", name: "Four", active: true },
    ],
    offerings: [
      { institutionId: "i1", careerName: "Career A", careerSlug: "career-a", active: true },
      { institutionId: "i2", careerName: "Career B", careerSlug: "career-b", active: true },
      { institutionId: "i2", careerName: "Draft", careerSlug: "draft", active: false },
      { institutionId: "i3", careerName: "Hidden", careerSlug: "hidden", active: true },
    ],
  }, { alpha: "1", beta: "2", gamma: "2", hidden: "3" });
  assert.equal(result.byDepartment["0"], undefined);
  assert.deepEqual(result.byDepartment["1"], { cities: [{ slug: "alpha", name: "Alpha" }], institutionCount: 1, careerCount: 1 });
  assert.equal(result.byDepartment["2"].cities.length, 2);
  assert.equal(result.byDepartment["2"].institutionCount, 1);
  assert.equal(result.byDepartment["2"].careerCount, 1);
  assert.deepEqual(result.province, { cityCount: 3, institutionCount: 2, careerCount: 2 });
});

test("unmapped public city fails instead of silently assigning the wrong department", () => {
  assert.throws(() => buildHomeMapCatalog({ cities: [{ id: "x", slug: "unknown", name: "Unknown", active: true }], institutions: [], offerings: [] }), /Missing official Tucumán department mapping/);
});

test("department action handles no city, desktop direct navigation, touch selection and multiple cities", () => {
  assert.deepEqual(departmentAction([], true), { type: "coming-soon" });
  assert.deepEqual(departmentAction([{ slug: "concepcion" }], true), { type: "navigate", href: "/concepcion" });
  assert.deepEqual(departmentAction([{ slug: "concepcion" }], false), { type: "select", href: "/concepcion" });
  assert.deepEqual(departmentAction([{ slug: "concepcion" }], true, true), { type: "select", href: "/concepcion" });
  assert.deepEqual(departmentAction([{ slug: "concepcion" }, { slug: "other" }], true), { type: "choose-city" });
});

test("Supabase adapter keeps UUIDs server-side and filters inactive/draft rows", async () => {
  const tables = {
    cities: [{ id: "uuid-city", slug: "concepcion", name: "Concepción", is_active: true }],
    institutions: [{ id: "uuid-institution", city_id: "uuid-city", slug: "instituto", name: "Instituto", is_active: true }],
    career_masters: [{ id: "uuid-master", slug: "abogacia", name: "Abogacía", is_active: true, status: "published" }],
    academic_offerings: [
      { institution_id: "uuid-institution", career_master_id: "uuid-master", is_visible: true, publication_status: "published" },
      { institution_id: "uuid-institution", career_master_id: "uuid-master", is_visible: false, publication_status: "draft" },
    ],
  };
  const options = { env: { PUBLIC_CATALOG_SOURCE: "supabase", SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "test" }, fetchImpl: async (url) => ({ ok: true, json: async () => tables[url.match(/\/rest\/v1\/([^?]+)/)[1]] }) };
  const result = await getSupabaseHomeMapCatalog(options);
  assert.deepEqual(result.province, { cityCount: 1, institutionCount: 1, careerCount: 1 });
  assert.ok(!JSON.stringify(result).includes("uuid-"));
  assert.deepEqual(await getHomeMapCatalog(options), result);
});
