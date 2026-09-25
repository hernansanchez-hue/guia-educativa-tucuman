import { getInstitutionPage } from "../../app/data/institutions.js";
import { getTrainingProgramBySlug } from "../../app/data/trainingPrograms.js";
import { getTrainingOffering } from "../../app/data/trainingOfferings.js";
import { getSupabaseCities, getSupabaseInstitutions, getSupabaseTrainingOfferings, getSupabaseTrainingPrograms } from "./supabase-public-catalog.js";

const sources = new Set(["local", "supabase"]);
const sourceFor = (env) => { const source = env.PUBLIC_CATALOG_SOURCE ?? "local"; if (!sources.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`); return source; };

export function getLocalTrainingPageCatalog(citySlug, institutionSlug, trainingSlug) {
  const institutionPage = getInstitutionPage(citySlug, institutionSlug);
  const program = getTrainingProgramBySlug(trainingSlug);
  if (!institutionPage || !program) return null;
  const offering = getTrainingOffering({ citySlug: institutionPage.city.slug, institutionId: institutionPage.institution.id, trainingProgramId: program.id });
  return offering ? { city: institutionPage.city, institution: institutionPage.institution, program, offering } : null;
}
export async function getSupabaseTrainingPageCatalog(citySlug, institutionSlug, trainingSlug, options = {}) {
  const [cities, institutions, programs, offerings] = await Promise.all([getSupabaseCities(options), getSupabaseInstitutions(options), getSupabaseTrainingPrograms(options), getSupabaseTrainingOfferings(options)]);
  const city = cities.find((item) => item.slug === citySlug); if (!city) return null;
  const rawInstitution = institutions.find((item) => item.city_id === city.id && item.slug === institutionSlug); if (!rawInstitution) return null;
  const rawProgram = programs.find((item) => item.slug === trainingSlug && item.is_active); if (!rawProgram) return null;
  const rawOffering = offerings.find((item) => item.institution_id === rawInstitution.id && item.training_program_id === rawProgram.id && item.is_visible && item.publication_status === "published"); if (!rawOffering) return null;
  const localInstitution = getInstitutionPage(citySlug, institutionSlug)?.institution;
  const institution = { id: rawInstitution.legacy_key, citySlug: city.slug, slug: rawInstitution.slug, name: rawInstitution.name, logo: rawInstitution.logo_text, type: rawInstitution.type, cities: [...(rawInstitution.cities_label ?? [])], plan: rawInstitution.plan, slogan: rawInstitution.slogan, description: rawInstitution.description, address: rawInstitution.address, whatsapp: rawInstitution.whatsapp, image: rawInstitution.hero_image_url, media: rawInstitution.media_label, gallery: [...(rawInstitution.gallery ?? [])], careers: localInstitution?.careers ?? [] };
  if (rawInstitution.visual_metadata?.canonicalDataNotice) institution.canonicalDataNotice = rawInstitution.visual_metadata.canonicalDataNotice;
  const program = { id: rawProgram.legacy_key, slug: rawProgram.slug, name: rawProgram.name, description: rawProgram.description, profile: rawProgram.profile, workField: rawProgram.work_field, contents: [...rawProgram.contents], requirements: [...rawProgram.requirements], faq: rawProgram.faq.map((item) => ({ ...item })), status: rawProgram.status };
  const offering = { id: rawOffering.legacy_key, institutionId: rawInstitution.legacy_key, citySlug: city.slug, trainingProgramId: rawProgram.legacy_key, modality: rawOffering.modality, duration: rawOffering.duration, certification: rawOffering.certification, campus: rawOffering.campus, shifts: rawOffering.shifts, nationalValidity: rawOffering.national_validity, image: rawOffering.image_url, badge: rawOffering.badge, formEnabled: rawOffering.form_enabled, visible: rawOffering.is_visible, order: rawOffering.display_order, publicationStatus: rawOffering.publication_status };
  if (rawOffering.whatsapp != null) offering.whatsapp = rawOffering.whatsapp;
  return { city: { slug: city.slug, name: city.name }, institution, program, offering };
}
export async function getTrainingPageCatalog(citySlug, institutionSlug, trainingSlug, options = {}) { return sourceFor(options.env ?? process.env) === "local" ? getLocalTrainingPageCatalog(citySlug, institutionSlug, trainingSlug) : getSupabaseTrainingPageCatalog(citySlug, institutionSlug, trainingSlug, options); }
