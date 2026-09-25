import assert from "node:assert/strict";
import test from "node:test";
import { careers as localCareers } from "../app/data/careers.js";
import { cityPages, institutions as localInstitutions } from "../app/data/institutions.js";
import { offerings as localOfferings } from "../app/data/offerings.js";

import {
  getCareerPageCatalog,
  getLocalCareerPageCatalog,
  getSupabaseCareerPageCatalog,
} from "../lib/public-catalog/career-page-catalog.js";

const citySlug = "concepcion";
const institutionSlug = "universidad-siglo-21";
const careerSlug = "abogacia";
const local = getLocalCareerPageCatalog(citySlug, institutionSlug, careerSlug);
const masterKey = (id) => id === "licenciatura-en-administracion" ? "lic-en-administracion" : id;

const city = { id: "city-uuid-hidden", slug: local.city.slug, name: local.city.name };
const institution = {
  id: "institution-uuid-hidden", legacy_key: local.institution.id, city_id: city.id,
  slug: local.institution.slug, name: local.institution.name, logo_text: local.institution.logo,
  type: local.institution.type, cities_label: local.institution.cities, plan: local.institution.plan,
  slogan: local.institution.slogan, description: local.institution.description,
  address: local.institution.address, whatsapp: local.institution.whatsapp,
  hero_image_url: local.institution.image, media_label: local.institution.media,
  gallery: local.institution.gallery,
};
const careers = local.institution.careers.map((summary) => {
  const detail = summary.id === careerSlug ? local.career : {
    id: summary.id, slug: masterKey(summary.id), name: summary.name, description: summary.description,
    graduateProfile: "", workField: "", studyPlan: [], requirements: [], faq: [],
  };
  return {
    id: `career-uuid-${masterKey(summary.id)}`, legacy_key: masterKey(summary.id), slug: detail.slug,
    name: detail.name, description: detail.description, graduate_profile: detail.graduateProfile,
    work_field: detail.workField, study_plan: detail.studyPlan, requirements: detail.requirements, faq: detail.faq,
    is_active: true,
  };
});
const offerings = local.institution.careers.map((summary, index) => ({
  id: `offering-uuid-${summary.id}`,
  legacy_key: `${local.institution.id}-${masterKey(summary.id)}`,
  institution_id: institution.id,
  career_master_id: careers[index].id,
  modality: summary.modality,
  duration: summary.duration,
  degree: summary.name,
  campus: null,
  shifts: summary.id === careerSlug ? local.offering.shifts : "Consultar",
  national_validity: summary.id === careerSlug ? local.offering.nationalValidity : "Sí",
  image_url: summary.image,
  badge: summary.badge,
  display_order: index + 1,
  form_enabled: summary.id === careerSlug ? local.offering.formEnabled : true,
  whatsapp: null,
  is_visible: true,
  publication_status: "published",
  metadata: {},
}));
const env = {
  PUBLIC_CATALOG_SOURCE: "supabase",
  SUPABASE_URL: "https://catalog.example.test",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};
const options = {
  env,
  fetchImpl: async (url) => ({
    ok: true,
    status: 200,
    json: async () => url.includes("cities?") ? [city]
      : url.includes("institutions?") ? [institution]
        : url.includes("career_masters?") ? careers
          : offerings,
  }),
};

test("Abogacía Concepción preserves the local page shape through Supabase", async () => {
  assert.deepEqual(await getSupabaseCareerPageCatalog(citySlug, institutionSlug, careerSlug, options), local);
});

test("adapted pilot exposes legacy keys, never UUIDs, and preserves contextual fields", async () => {
  const remote = await getCareerPageCatalog(citySlug, institutionSlug, careerSlug, options);
  assert.equal(remote.city.slug, "concepcion");
  assert.equal(remote.institution.id, "universidad-siglo-21-concepcion");
  assert.equal(remote.institution.slug, "universidad-siglo-21");
  assert.equal(remote.career.id, "abogacia");
  assert.equal(remote.career.slug, "abogacia");
  assert.equal(remote.offering.id, "universidad-siglo-21-concepcion-abogacia");
  assert.equal(remote.offering.institutionId, remote.institution.id);
  assert.equal(remote.offering.careerId, remote.career.id);
  assert.equal(remote.offering.citySlug, remote.city.slug);
  assert.equal(JSON.stringify(remote).includes("uuid-hidden"), false);
  assert.equal(JSON.stringify(remote).includes("career-uuid-"), false);
  assert.equal(remote.career.graduateProfile, local.career.graduateProfile);
  assert.equal(remote.career.workField, local.career.workField);
  assert.deepEqual(remote.career.studyPlan, local.career.studyPlan);
  assert.deepEqual(remote.career.requirements, local.career.requirements);
  assert.deepEqual(remote.career.faq, local.career.faq);
  assert.equal(remote.offering.modality, local.offering.modality);
  assert.equal(remote.offering.duration, local.offering.duration);
  assert.equal(remote.offering.degree, local.offering.degree);
  assert.equal(remote.offering.image, local.offering.image);
  assert.equal(remote.offering.badge, local.offering.badge);
  assert.equal(remote.offering.formEnabled, local.offering.formEnabled);
  assert.deepEqual(remote.institution.careers, local.institution.careers);
});

test("local is the default, invalid source fails, and the Administración alias is prepared", async () => {
  assert.deepEqual(await getCareerPageCatalog(citySlug, institutionSlug, careerSlug, { env: {} }), local);
  assert.equal(getLocalCareerPageCatalog(citySlug, institutionSlug, "licenciatura-en-administracion").career.id, "lic-en-administracion");
  await assert.rejects(() => getCareerPageCatalog(citySlug, institutionSlug, careerSlug, { env: { PUBLIC_CATALOG_SOURCE: "remote" } }), /Unsupported/);
});

test("missing entities, offering, variables, and remote HTTP errors are explicit", async () => {
  assert.equal(await getSupabaseCareerPageCatalog("inexistente", institutionSlug, careerSlug, options), null);
  assert.equal(await getSupabaseCareerPageCatalog(citySlug, "inexistente", careerSlug, options), null);
  assert.equal(await getSupabaseCareerPageCatalog(citySlug, institutionSlug, "inexistente", options), null);
  const withoutOffering = { ...options, fetchImpl: async (url) => ({ ok: true, status: 200, json: async () => url.includes("cities?") ? [city] : url.includes("institutions?") ? [institution] : url.includes("career_masters?") ? careers : [] }) };
  assert.equal(await getSupabaseCareerPageCatalog(citySlug, institutionSlug, careerSlug, withoutOffering), null);
  await assert.rejects(() => getCareerPageCatalog(citySlug, institutionSlug, careerSlug, { env: { PUBLIC_CATALOG_SOURCE: "supabase" } }), /Missing SUPABASE_URL/);
  await assert.rejects(() => getCareerPageCatalog(citySlug, institutionSlug, careerSlug, { env: { PUBLIC_CATALOG_SOURCE: "supabase", SUPABASE_URL: env.SUPABASE_URL } }), /Missing SUPABASE_PUBLISHABLE_KEY/);
  await assert.rejects(() => getSupabaseCareerPageCatalog(citySlug, institutionSlug, careerSlug, { ...options, fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
});

const canonicalMasterKey = (id) => id === "licenciatura-en-administracion" ? "lic-en-administracion" : id;
const publishedOfferings = localOfferings.filter((offering) => offering.visible);
const routeMatrix = publishedOfferings.map((offering) => {
  const institution = localInstitutions.find((item) => item.id === offering.institutionId);
  const career = localCareers.find((item) => item.id === offering.careerId);
  return { citySlug: offering.citySlug, institutionSlug: institution.slug, careerSlug: career.slug, offeringId: offering.id };
});
const matrixCities = Object.entries(cityPages).map(([slug, page], index) => ({ id: `matrix-city-uuid-${index}`, slug, name: page.name }));
const matrixCityIds = new Map(matrixCities.map((city) => [city.slug, city.id]));
const matrixInstitutions = localInstitutions.map((item, index) => ({
  id: `matrix-institution-uuid-${index}`, legacy_key: item.id, city_id: matrixCityIds.get(item.citySlug), slug: item.slug,
  name: item.name, logo_text: item.logo, type: item.type, cities_label: item.cities, plan: item.plan,
  slogan: item.slogan, description: item.description, address: item.address, whatsapp: item.whatsapp,
  hero_image_url: item.image, media_label: item.media, gallery: item.gallery,
  visual_metadata: item.canonicalDataNotice ? { canonicalDataNotice: item.canonicalDataNotice } : {},
}));
const matrixMasters = [...new Map(publishedOfferings.map((offering) => {
  const career = localCareers.find((item) => item.id === offering.careerId);
  const key = canonicalMasterKey(career.id);
  return [key, { id: `matrix-career-uuid-${key}`, legacy_key: key, slug: career.slug, name: career.name,
    description: career.description, graduate_profile: career.graduateProfile, work_field: career.workField,
    study_plan: career.studyPlan, requirements: career.requirements, faq: career.faq, is_active: true }];
})).values()];
const matrixMasterIds = new Map(matrixMasters.map((master) => [master.legacy_key, master.id]));
const matrixInstitutionIds = new Map(matrixInstitutions.map((institution) => [institution.legacy_key, institution.id]));
const matrixOfferings = publishedOfferings.map((offering) => ({
  id: `matrix-offering-uuid-${offering.id}`, legacy_key: offering.id, institution_id: matrixInstitutionIds.get(offering.institutionId),
  career_master_id: matrixMasterIds.get(canonicalMasterKey(offering.careerId)), modality: offering.modality, duration: offering.duration,
  degree: offering.degree, campus: offering.campus ?? null, shifts: offering.shifts, national_validity: offering.nationalValidity,
  image_url: offering.image, badge: offering.badge, display_order: offering.order, form_enabled: offering.formEnabled,
  whatsapp: offering.whatsapp ?? null, is_visible: offering.visible, publication_status: "published", metadata: {},
}));
const matrixOptions = { env, fetchImpl: async (url) => ({ ok: true, status: 200, json: async () =>
  url.includes("cities?") ? matrixCities : url.includes("institutions?") ? matrixInstitutions : url.includes("career_masters?") ? matrixMasters : matrixOfferings,
}) };

test("the canonical academic route matrix contains thirty pages with the expected institutional distribution", () => {
  assert.equal(routeMatrix.length, 30);
  assert.deepEqual(Object.fromEntries(localInstitutions.map((institution) => [institution.id, routeMatrix.filter((item) => item.institutionSlug === institution.slug && item.citySlug === institution.citySlug).length])), {
    "universidad-siglo-21-concepcion": 4, "instituto-santa-barbara-concepcion": 3, "ies-concepcion-concepcion": 3,
    "universidad-siglo-21-monteros": 4, "instituto-del-sur-monteros": 3, "centro-de-formacion-tucuman-monteros": 0,
    "instituto-san-miguel-monteros": 3, "universidad-siglo-21-aguilares": 4, "instituto-santa-barbara-aguilares": 3,
    "academia-profesional-norte-aguilares": 3,
  });
});

for (const entry of routeMatrix) {
  test(`${entry.citySlug}/${entry.institutionSlug}/${entry.careerSlug} preserves complete local shape through Supabase`, async () => {
    const localPage = getLocalCareerPageCatalog(entry.citySlug, entry.institutionSlug, entry.careerSlug);
    const remotePage = await getSupabaseCareerPageCatalog(entry.citySlug, entry.institutionSlug, entry.careerSlug, matrixOptions);
    assert.deepEqual(remotePage, localPage);
    assert.equal(remotePage.offering.id, entry.offeringId);
    assert.equal(JSON.stringify(remotePage).includes("matrix-"), false);
  });
}

test("shared masters and training boundary remain canonical", () => {
  assert.equal(routeMatrix.filter((item) => item.careerSlug === "abogacia").length, 3);
  assert.equal(routeMatrix.filter((item) => item.careerSlug === "contador-publico").length, 3);
  assert.equal(routeMatrix.filter((item) => item.careerSlug === "lic-en-administracion").length, 3);
  assert.equal(routeMatrix.filter((item) => item.careerSlug === "higiene-y-seguridad").length, 3);
  assert.equal(routeMatrix.filter((item) => item.careerSlug === "diagnostico-por-imagenes").length, 2);
  assert.equal(routeMatrix.filter((item) => item.institutionSlug === "academia-profesional-norte").length, 3);
  assert.equal(routeMatrix.some((item) => item.institutionSlug === "centro-de-formacion-tucuman"), false);
});
