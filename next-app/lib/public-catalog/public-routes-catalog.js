import { careers } from "../../app/data/careers.js";
import { cityPages, institutions } from "../../app/data/institutions.js";
import { offerings } from "../../app/data/offerings.js";
import { trainingOfferings } from "../../app/data/trainingOfferings.js";
import { trainingPrograms } from "../../app/data/trainingPrograms.js";
import {
  getSupabaseAcademicOfferings,
  getSupabaseCareerMasters,
  getSupabaseCities,
  getSupabaseInstitutions,
  getSupabaseTrainingOfferings,
  getSupabaseTrainingPrograms,
} from "./supabase-public-catalog.js";

export const STATIC_PUBLIC_PATHS = Object.freeze([
  "/",
  "/ciudades",
  "/cursos-docentes",
  "/nosotros",
  "/contacto",
]);

const VALID_SOURCES = new Set(["local", "supabase"]);

function sourceFor(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";
  if (!VALID_SOURCES.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  return source;
}

function isPublishedOffering(record) {
  const visible = record.is_visible ?? record.visible;
  const publicationStatus = record.publication_status ?? record.publicationStatus ?? "published";
  return visible !== false && publicationStatus === "published";
}

function isActive(record) {
  return record.is_active !== false;
}

function isPublishedMaster(record) {
  return isActive(record) && (record.status ?? "published") === "published";
}

export function createPublicRoutePaths(snapshot) {
  const activeCities = snapshot.cities.filter(isActive);
  const activeCityById = new Map(activeCities.map((city) => [city.id, city]));
  const activeInstitutions = snapshot.institutions.filter(
    (institution) => isActive(institution) && activeCityById.has(institution.city_id),
  );
  const institutionById = new Map(activeInstitutions.map((institution) => [institution.id, institution]));
  const careerById = new Map(snapshot.careers.filter(isPublishedMaster).map((career) => [career.id, career]));
  const trainingById = new Map(snapshot.trainingPrograms.filter(isPublishedMaster).map((program) => [program.id, program]));
  const paths = new Set(STATIC_PUBLIC_PATHS);

  for (const city of activeCities) paths.add(`/${city.slug}`);

  for (const institution of activeInstitutions) {
    const city = activeCityById.get(institution.city_id);
    paths.add(`/${city.slug}/${institution.slug}`);
  }

  for (const offering of snapshot.academicOfferings.filter(isPublishedOffering)) {
    const institution = institutionById.get(offering.institution_id);
    const career = careerById.get(offering.career_master_id);
    if (!institution || !career) continue;
    const city = activeCityById.get(institution.city_id);
    paths.add(`/${city.slug}/${institution.slug}/carreras/${career.slug}`);
  }

  for (const offering of snapshot.trainingOfferings.filter(isPublishedOffering)) {
    const institution = institutionById.get(offering.institution_id);
    const program = trainingById.get(offering.training_program_id);
    if (!institution || !program) continue;
    const city = activeCityById.get(institution.city_id);
    paths.add(`/${city.slug}/${institution.slug}/capacitaciones/${program.slug}`);
  }

  return [...paths];
}

export function getLocalPublicRoutePaths() {
  const localCities = Object.values(cityPages).map((city) => ({
    id: city.slug,
    slug: city.slug,
    is_active: true,
  }));
  const localInstitutions = institutions.map((institution) => ({
    id: institution.id,
    city_id: institution.citySlug,
    slug: institution.slug,
    is_active: true,
  }));
  const localCareers = careers.map((career) => ({
    id: career.id,
    slug: career.slug,
    status: "published",
    is_active: true,
  }));
  const localPrograms = trainingPrograms.map((program) => ({
    id: program.id,
    slug: program.slug,
    status: program.status ?? "published",
    is_active: true,
  }));

  return createPublicRoutePaths({
    cities: localCities,
    institutions: localInstitutions,
    careers: localCareers,
    academicOfferings: offerings.map((offering) => ({
      institution_id: offering.institutionId,
      career_master_id: offering.careerId,
      is_visible: offering.visible,
      publication_status: "published",
    })),
    trainingPrograms: localPrograms,
    trainingOfferings: trainingOfferings.map((offering) => ({
      institution_id: offering.institutionId,
      training_program_id: offering.trainingProgramId,
      is_visible: offering.visible,
      publication_status: offering.publicationStatus,
    })),
  });
}

export async function getSupabasePublicRoutePaths(options = {}) {
  const [cities, remoteInstitutions, remoteCareers, academicOfferings, remotePrograms, remoteTrainingOfferings] = await Promise.all([
    getSupabaseCities(options),
    getSupabaseInstitutions(options),
    getSupabaseCareerMasters(options),
    getSupabaseAcademicOfferings(options),
    getSupabaseTrainingPrograms(options),
    getSupabaseTrainingOfferings(options),
  ]);
  return createPublicRoutePaths({
    cities,
    institutions: remoteInstitutions,
    careers: remoteCareers,
    academicOfferings,
    trainingPrograms: remotePrograms,
    trainingOfferings: remoteTrainingOfferings,
  });
}

export function getPublicRoutePaths(options = {}) {
  return sourceFor(options.env ?? process.env) === "local"
    ? getLocalPublicRoutePaths()
    : getSupabasePublicRoutePaths(options);
}
