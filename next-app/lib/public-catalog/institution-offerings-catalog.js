import { getInstitutionPage } from "../../app/data/institutions.js";
import { offerings } from "../../app/data/offerings.js";
import { trainingOfferings } from "../../app/data/trainingOfferings.js";
import {
  getSupabaseAcademicOfferings,
  getSupabaseCareerMasters,
  getSupabaseCities,
  getSupabaseInstitutions,
  getSupabaseTrainingOfferings,
  getSupabaseTrainingPrograms,
} from "./supabase-public-catalog.js";

const VALID_SOURCES = new Set(["local", "supabase"]);
const LEGACY_SUMMARY_IDENTITIES = {
  "lic-en-administracion": "licenciatura-en-administracion",
};
const MASTER_IDENTITIES = {
  "licenciatura-en-administracion": "lic-en-administracion",
};

function sourceFor(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";
  if (!VALID_SOURCES.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  return source;
}

function summaryIdentity(record) {
  return LEGACY_SUMMARY_IDENTITIES[record.legacy_key] ?? record.legacy_key;
}

function withRoutePath(summary, routePath) {
  return routePath ? { ...summary, routePath } : summary;
}

export function adaptAcademicOffering(offering, career, routePath) {
  return withRoutePath({
    id: summaryIdentity(career),
    slug: summaryIdentity(career),
    name: career.name,
    description: career.description,
    image: offering.image_url,
    badge: offering.badge,
    duration: offering.duration,
    modality: offering.modality,
  }, routePath);
}

export function adaptTrainingOffering(offering, program, routePath) {
  return withRoutePath({
    id: program.legacy_key,
    slug: program.slug,
    name: program.name,
    description: program.description,
    image: offering.image_url,
    badge: offering.badge,
    duration: offering.duration,
    modality: offering.modality,
  }, routePath);
}

export function getLocalInstitutionOfferingsCatalog(citySlug, institutionSlug) {
  const page = getInstitutionPage(citySlug, institutionSlug);
  if (!page) return null;

  return page.institution.careers.map((career) => {
    const careerId = MASTER_IDENTITIES[career.id] ?? career.id;
    const academic = offerings.find((offering) =>
      offering.citySlug === citySlug
      && offering.institutionId === page.institution.id
      && offering.careerId === careerId
      && offering.visible
    );
    if (academic) {
      return { ...career, routePath: `/${citySlug}/${institutionSlug}/carreras/${careerId}` };
    }

    const training = trainingOfferings.find((offering) =>
      offering.citySlug === citySlug
      && offering.institutionId === page.institution.id
      && offering.trainingProgramId === career.id
      && offering.visible
      && offering.publicationStatus === "published"
    );
    return training
      ? { ...career, routePath: `/${citySlug}/${institutionSlug}/capacitaciones/${career.slug}` }
      : { ...career };
  });
}

export async function getSupabaseInstitutionOfferingsCatalog(citySlug, institutionSlug, options = {}) {
  const [cities, institutions, careers, academicOfferings, programs, trainingOfferings] = await Promise.all([
    getSupabaseCities(options),
    getSupabaseInstitutions(options),
    getSupabaseCareerMasters(options),
    getSupabaseAcademicOfferings(options),
    getSupabaseTrainingPrograms(options),
    getSupabaseTrainingOfferings(options),
  ]);
  const city = cities.find((item) => item.slug === citySlug);
  if (!city) return null;
  const matches = institutions.filter((item) => item.city_id === city.id && item.slug === institutionSlug);
  if (!matches.length) return null;
  if (matches.length !== 1) throw new Error(`Expected one Supabase institution for ${citySlug}/${institutionSlug}`);
  const institution = matches[0];
  const careerById = new Map(careers.map((career) => [career.id, career]));
  const programById = new Map(programs.map((program) => [program.id, program]));
  const academic = academicOfferings
    .filter((offering) => offering.institution_id === institution.id && offering.is_visible && offering.publication_status === "published")
    .sort((a, b) => a.display_order - b.display_order || a.legacy_key.localeCompare(b.legacy_key))
    .map((offering) => {
      const career = careerById.get(offering.career_master_id);
      if (!career) throw new Error(`Missing Supabase career master for ${offering.legacy_key}`);
      return adaptAcademicOffering(
        offering,
        career,
        `/${city.slug}/${institution.slug}/carreras/${career.slug}`,
      );
    });
  const training = trainingOfferings
    .filter((offering) => offering.institution_id === institution.id && offering.is_visible && offering.publication_status === "published")
    .sort((a, b) => a.display_order - b.display_order || a.legacy_key.localeCompare(b.legacy_key))
    .map((offering) => {
      const program = programById.get(offering.training_program_id);
      if (!program) throw new Error(`Missing Supabase training program for ${offering.legacy_key}`);
      return adaptTrainingOffering(
        offering,
        program,
        `/${city.slug}/${institution.slug}/capacitaciones/${program.slug}`,
      );
    });
  return [...academic, ...training];
}

export async function getInstitutionOfferingsCatalog(citySlug, institutionSlug, options = {}) {
  const source = sourceFor(options.env ?? process.env);
  return source === "local"
    ? getLocalInstitutionOfferingsCatalog(citySlug, institutionSlug)
    : getSupabaseInstitutionOfferingsCatalog(citySlug, institutionSlug, options);
}
