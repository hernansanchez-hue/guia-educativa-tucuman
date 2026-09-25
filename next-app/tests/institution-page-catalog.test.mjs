import assert from "node:assert/strict";
import test from "node:test";
import { getLocalInstitutionPageCatalog, getSupabaseInstitutionPageCatalog, getInstitutionPageCatalog } from "../lib/public-catalog/institution-page-catalog.js";
import { cityPages, institutions } from "../app/data/institutions.js";

const local = getLocalInstitutionPageCatalog("concepcion", "universidad-siglo-21");
const city = { id: "city-concepcion", slug: "concepcion", name: "Concepción", title: "Instituciones de Concepción", visual_metadata: {} };
const institution = {
  id: "uuid-hidden", legacy_key: local.institution.id, city_id: city.id, slug: local.institution.slug,
  name: local.institution.name, type: local.institution.type, logo_text: local.institution.logo,
  plan: local.institution.plan, slogan: local.institution.slogan, description: local.institution.description,
  address: local.institution.address, whatsapp: local.institution.whatsapp, hero_image_url: local.institution.image,
  media_label: local.institution.media, gallery: local.institution.gallery, cities_label: local.institution.cities,
  visual_metadata: {},
};
const options = { env: { PUBLIC_CATALOG_SOURCE: "supabase", SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" }, fetchImpl: (url) => Promise.resolve({ ok: true, json: async () => url.includes("cities?") ? [city] : [institution] }) };

const catalogCases = Object.entries(cityPages).flatMap(([citySlug, page]) =>
  page.institutionIds.map((legacyKey) => {
    const localInstitution = institutions.find((item) => item.id === legacyKey);
    return { citySlug, slug: localInstitution.slug, legacyKey };
  }),
);
const catalogCities = Object.entries(cityPages).map(([slug, page], index) => ({
  id: `city-${index}`,
  slug,
  name: page.name,
  title: page.title,
  visual_metadata: {},
}));
const cityIds = new Map(catalogCities.map((item) => [item.slug, item.id]));
const catalogInstitutions = institutions.map((item, index) => ({
  id: `uuid-${index}`,
  legacy_key: item.id,
  city_id: cityIds.get(item.citySlug),
  slug: item.slug,
  name: item.name,
  type: item.type,
  logo_text: item.logo,
  plan: item.plan,
  slogan: item.slogan,
  description: item.description,
  address: item.address,
  whatsapp: item.whatsapp,
  hero_image_url: item.image,
  media_label: item.media,
  gallery: item.gallery,
  cities_label: item.cities,
  visual_metadata: item.canonicalDataNotice ? { canonicalDataNotice: item.canonicalDataNotice } : {},
}));
const summaryMasterKey = (id) => id === "licenciatura-en-administracion" ? "lic-en-administracion" : id;
const localSummaries = institutions.flatMap((institution) => institution.careers.map((career) => ({ institution, career })));
const catalogCareerMasters = [...new Map(localSummaries.filter(({ institution }) => institution.id !== "centro-de-formacion-tucuman-monteros").map(({ career }) => [summaryMasterKey(career.id), {
  id: `career-${summaryMasterKey(career.id)}`, legacy_key: summaryMasterKey(career.id), slug: summaryMasterKey(career.id), name: career.name, description: career.description,
}])).values()];
const catalogTrainingPrograms = localSummaries.filter(({ institution }) => institution.id === "centro-de-formacion-tucuman-monteros").map(({ career }) => ({
  id: `training-${career.id}`, legacy_key: career.id, slug: career.slug, name: career.name, description: career.description,
}));
const catalogAcademicOfferings = localSummaries.filter(({ institution }) => institution.id !== "centro-de-formacion-tucuman-monteros").map(({ institution, career }, index) => ({
  id: `academic-${index}`, legacy_key: `${institution.id}-${summaryMasterKey(career.id)}`, institution_id: catalogInstitutions.find((item) => item.legacy_key === institution.id).id,
  career_master_id: `career-${summaryMasterKey(career.id)}`, image_url: career.image, badge: career.badge, duration: career.duration, modality: career.modality,
  display_order: institution.careers.findIndex((item) => item.id === career.id) + 1, is_visible: true, publication_status: "published",
}));
const catalogTrainingOfferings = localSummaries.filter(({ institution }) => institution.id === "centro-de-formacion-tucuman-monteros").map(({ institution, career }, index) => ({
  id: `training-offering-${index}`, legacy_key: `${institution.id}-${career.id}`, institution_id: catalogInstitutions.find((item) => item.legacy_key === institution.id).id,
  training_program_id: `training-${career.id}`, image_url: career.image, badge: career.badge, duration: career.duration, modality: career.modality,
  display_order: index + 1, is_visible: true, publication_status: "published",
}));
const catalogOptions = {
  env: options.env,
  fetchImpl: (url) => Promise.resolve({
    ok: true,
    json: async () => url.includes("cities?") ? catalogCities : url.includes("career_masters?") ? catalogCareerMasters : url.includes("academic_offerings?") ? catalogAcademicOfferings : url.includes("training_programs?") ? catalogTrainingPrograms : url.includes("training_offerings?") ? catalogTrainingOfferings : catalogInstitutions,
  }),
};

test("local and Supabase pilot have the same shape", async () => assert.deepEqual(await getInstitutionPageCatalog("concepcion", "universidad-siglo-21", catalogOptions), local));
test("default source is local", async () => assert.deepEqual(await getInstitutionPageCatalog("concepcion", "universidad-siglo-21", { env: {} }), local));
test("legacy key is visible and UUID is not exposed", async () => { const page = await getInstitutionPageCatalog("concepcion", "universidad-siglo-21", catalogOptions); assert.equal(page.institution.id, "universidad-siglo-21-concepcion"); assert.equal(JSON.stringify(page).includes("uuid-"), false); });
test("four local career summaries preserve order", async () => { const page = await getInstitutionPageCatalog("concepcion", "universidad-siglo-21", catalogOptions); assert.deepEqual(page.institution.careers.map((career) => career.id), ["abogacia", "contador-publico", "licenciatura-en-administracion", "higiene-y-seguridad"]); });
test("missing city or institution returns null", async () => { assert.equal(await getSupabaseInstitutionPageCatalog("concepcion", "inexistente", options), null); });
test("invalid source and missing variables fail clearly", async () => { await assert.rejects(() => getInstitutionPageCatalog("concepcion", "universidad-siglo-21", { env: { PUBLIC_CATALOG_SOURCE: "remote" } }), /Unsupported/); await assert.rejects(() => getInstitutionPageCatalog("concepcion", "universidad-siglo-21", { env: { PUBLIC_CATALOG_SOURCE: "supabase" } }), /Missing SUPABASE_URL/); });

test("the fixture matrix contains the ten published institutional pages", () => {
  assert.deepEqual(catalogCases, [
    { citySlug: "concepcion", slug: "universidad-siglo-21", legacyKey: "universidad-siglo-21-concepcion" },
    { citySlug: "concepcion", slug: "instituto-santa-barbara", legacyKey: "instituto-santa-barbara-concepcion" },
    { citySlug: "concepcion", slug: "ies-concepcion", legacyKey: "ies-concepcion-concepcion" },
    { citySlug: "monteros", slug: "universidad-siglo-21", legacyKey: "universidad-siglo-21-monteros" },
    { citySlug: "monteros", slug: "instituto-del-sur", legacyKey: "instituto-del-sur-monteros" },
    { citySlug: "monteros", slug: "centro-de-formacion-tucuman", legacyKey: "centro-de-formacion-tucuman-monteros" },
    { citySlug: "monteros", slug: "instituto-san-miguel", legacyKey: "instituto-san-miguel-monteros" },
    { citySlug: "aguilares", slug: "universidad-siglo-21", legacyKey: "universidad-siglo-21-aguilares" },
    { citySlug: "aguilares", slug: "instituto-santa-barbara", legacyKey: "instituto-santa-barbara-aguilares" },
    { citySlug: "aguilares", slug: "academia-profesional-norte", legacyKey: "academia-profesional-norte-aguilares" },
  ]);
});

for (const entry of catalogCases) {
  test(`${entry.citySlug}/${entry.slug} preserves local institutional shape through Supabase`, async () => {
    const remote = await getInstitutionPageCatalog(entry.citySlug, entry.slug, catalogOptions);
    const localPage = getLocalInstitutionPageCatalog(entry.citySlug, entry.slug);
    assert.deepEqual(remote, localPage);
    assert.equal(remote.city.slug, entry.citySlug);
    assert.equal(remote.institution.slug, entry.slug);
    assert.equal(remote.institution.id, entry.legacyKey);
    assert.equal(JSON.stringify(remote).includes("uuid-"), false);
    assert.deepEqual(remote.institution.careers, localPage.institution.careers);
  });
}

test("institution-specific local summary counts and order remain canonical", async () => {
  const pages = await Promise.all(catalogCases.map(({ citySlug, slug }) =>
    getInstitutionPageCatalog(citySlug, slug, catalogOptions),
  ));
  const byLegacyKey = new Map(pages.map((page) => [page.institution.id, page]));
  assert.equal(byLegacyKey.get("universidad-siglo-21-concepcion").institution.cities.length, 3);
  assert.equal(byLegacyKey.get("universidad-siglo-21-monteros").institution.cities.length, 3);
  assert.equal(byLegacyKey.get("universidad-siglo-21-aguilares").institution.cities.length, 3);
  assert.equal(byLegacyKey.get("instituto-santa-barbara-concepcion").institution.cities.length, 2);
  assert.equal(byLegacyKey.get("instituto-santa-barbara-aguilares").institution.cities.length, 2);
  assert.deepEqual(byLegacyKey.get("centro-de-formacion-tucuman-monteros").institution.careers.map((item) => item.id), ["auxiliar-administrativo", "secretariado", "operador-de-pc"]);
  assert.deepEqual(byLegacyKey.get("academia-profesional-norte-aguilares").institution.careers.map((item) => item.id), ["diseno-grafico", "community-manager", "ventas-digitales"]);
  assert.equal(byLegacyKey.get("academia-profesional-norte-aguilares").institution.careers.length, 3);
});

test("all institutional summaries expose a generic canonical route", () => {
  const summaries = catalogCases.flatMap(({ citySlug, slug }) => {
    const page = getLocalInstitutionPageCatalog(citySlug, slug);
    return page.institution.careers;
  });

  assert.equal(summaries.length, 33);
  assert.equal(summaries.filter((item) => item.routePath.includes("/carreras/")).length, 30);
  assert.equal(summaries.filter((item) => item.routePath.includes("/capacitaciones/")).length, 3);

  for (const summary of summaries) {
    assert.equal(typeof summary.routePath, "string");
    assert.match(summary.routePath, /^\/(concepcion|monteros|aguilares)\//);
    assert.equal(summary.routePath.includes("undefined"), false);
  }
});
