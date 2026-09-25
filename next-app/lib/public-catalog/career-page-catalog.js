import { getCareerBySlug } from "../../app/data/careers.js";
import { getInstitutionPage } from "../../app/data/institutions.js";
import { getOffering } from "../../app/data/offerings.js";
import {
  getSupabaseAcademicOfferings,
  getSupabaseCareerMasters,
  getSupabaseCities,
  getSupabaseInstitutions,
} from "./supabase-public-catalog.js";

const SOURCES = new Set(["local", "supabase"]);
const LEGACY_CAREER_SLUGS = { "licenciatura-en-administracion": "lic-en-administracion" };

function sourceFor(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";
  if (!SOURCES.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  return source;
}

export function getLocalCareerPageCatalog(citySlug, institutionSlug, careerSlug) {
  const institutionPage = getInstitutionPage(citySlug, institutionSlug);
  const career = getCareerBySlug(LEGACY_CAREER_SLUGS[careerSlug] ?? careerSlug);
  if (!institutionPage || !career) return null;
  const offering = getOffering({ citySlug: institutionPage.city.slug, institutionId: institutionPage.institution.id, careerId: career.id });
  return offering ? { city: institutionPage.city, institution: institutionPage.institution, career, offering } : null;
}

function adaptCareer(record) {
  return {
    id: record.legacy_key,
    slug: record.slug,
    name: record.name,
    description: record.description,
    graduateProfile: record.graduate_profile,
    workField: record.work_field,
    studyPlan: [...record.study_plan],
    requirements: [...record.requirements],
    faq: record.faq.map((item) => ({ ...item })),
  };
}

function adaptInstitution(record, city, careers) {
  const institution = {
    id: record.legacy_key, citySlug: city.slug, slug: record.slug, name: record.name,
    logo: record.logo_text, type: record.type, cities: [...(record.cities_label ?? [])], plan: record.plan,
    slogan: record.slogan, description: record.description, address: record.address, whatsapp: record.whatsapp,
    image: record.hero_image_url, media: record.media_label, gallery: [...(record.gallery ?? [])], careers,
  };
  if (record.visual_metadata?.canonicalDataNotice) institution.canonicalDataNotice = record.visual_metadata.canonicalDataNotice;
  return institution;
}

function adaptOffering(record, institution, career, city) {
  const offering = {
    id: record.legacy_key, modality: record.modality, duration: record.duration, degree: record.degree,
    shifts: record.shifts, nationalValidity: record.national_validity,
    image: record.image_url, badge: record.badge, formEnabled: record.form_enabled,
    visible: record.is_visible, order: record.display_order,
    institutionId: institution.legacy_key, careerId: career.legacy_key, citySlug: city.slug,
  };
  if (record.campus != null) offering.campus = record.campus;
  if (record.whatsapp != null) offering.whatsapp = record.whatsapp;
  return offering;
}

export async function getSupabaseCareerPageCatalog(citySlug, institutionSlug, careerSlug, options = {}) {
  const [cities, institutions, careers, offerings] = await Promise.all([
    getSupabaseCities(options), getSupabaseInstitutions(options), getSupabaseCareerMasters(options), getSupabaseAcademicOfferings(options),
  ]);
  const city = cities.find((item) => item.slug === citySlug);
  if (!city) return null;
  const institution = institutions.find((item) => item.city_id === city.id && item.slug === institutionSlug);
  if (!institution) return null;
  const canonicalSlug = LEGACY_CAREER_SLUGS[careerSlug] ?? careerSlug;
  const career = careers.find((item) => item.slug === canonicalSlug && item.is_active);
  if (!career) return null;
  const offering = offerings.find((item) => item.institution_id === institution.id && item.career_master_id === career.id && item.is_visible && item.publication_status === "published");
  if (!offering) return null;
  const careerById = new Map(careers.map((item) => [item.id, item]));
  const summaries = offerings.filter((item) => item.institution_id === institution.id && item.is_visible && item.publication_status === "published").sort((a,b) => a.display_order-b.display_order).map((item) => {
    const master = careerById.get(item.career_master_id);
    return { id: master.legacy_key === "lic-en-administracion" ? "licenciatura-en-administracion" : master.legacy_key, slug: master.legacy_key === "lic-en-administracion" ? "licenciatura-en-administracion" : master.slug, name: master.name, description: master.description, image: item.image_url, badge: item.badge, duration: item.duration, modality: item.modality };
  });
  return { city: { slug: city.slug, name: city.name }, institution: adaptInstitution(institution, city, summaries), career: adaptCareer(career), offering: adaptOffering(offering, institution, career, city) };
}

export async function getCareerPageCatalog(citySlug, institutionSlug, careerSlug, options = {}) {
  const source = sourceFor(options.env ?? process.env);
  return source === "local"
    ? getLocalCareerPageCatalog(citySlug, institutionSlug, careerSlug)
    : getSupabaseCareerPageCatalog(citySlug, institutionSlug, careerSlug, options);
}
