import { careers } from "../../app/data/careers.js";
import { cityPages, institutions } from "../../app/data/institutions.js";
import { offerings } from "../../app/data/offerings.js";
import { getSupabaseAcademicOfferings, getSupabaseCareerMasters, getSupabaseCities, getSupabaseInstitutions } from "./supabase-public-catalog.js";

const VALID_SOURCES = new Set(["local", "supabase"]);
function sourceFor(env) { const source = env.PUBLIC_CATALOG_SOURCE ?? "local"; if (!VALID_SOURCES.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`); return source; }
function publishedOffering(offering) { return (offering.visible ?? offering.is_visible) !== false && (offering.publication_status ?? "published") === "published"; }

function createCatalog({ careerRows, institutionRows, cityRows, offeringRows, remote = false }) {
  const careerById = new Map(careerRows.map((career) => [career.id, career]));
  const institutionById = new Map(institutionRows.map((institution) => [institution.id, institution]));
  const cityById = new Map(cityRows.map((city) => [city.id, city]));
  const entries = offeringRows.filter(publishedOffering).map((offering) => {
    const career = careerById.get(remote ? offering.career_master_id : offering.careerId);
    const institution = institutionById.get(remote ? offering.institution_id : offering.institutionId);
    const city = cityById.get(remote ? institution?.city_id : offering.citySlug);
    if (!career || !institution || !city) return null;
    return { career: { id: career.id, slug: career.slug, name: career.name, description: career.description, graduateProfile: career.graduateProfile ?? career.graduate_profile, workField: career.workField ?? career.work_field }, institution: { slug: institution.slug, name: institution.name, type: institution.type, image: institution.image ?? institution.hero_image_url }, city: { slug: city.slug, name: city.name }, offering: { modality: offering.modality, duration: offering.duration, degree: offering.degree, image: offering.image ?? offering.image_url } };
  }).filter(Boolean);
  const bySlug = new Map();
  for (const entry of entries) { const current = bySlug.get(entry.career.slug) ?? { ...entry.career, offerings: [] }; current.offerings.push(entry); bySlug.set(entry.career.slug, current); }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function getLocalCareersCatalog() { return createCatalog({ careerRows: careers, institutionRows: institutions, cityRows: Object.values(cityPages).map((city) => ({ id: city.slug, slug: city.slug, name: city.name })), offeringRows: offerings }); }
export async function getSupabaseCareersCatalog(options = {}) { const [careerRows, institutionRows, cityRows, offeringRows] = await Promise.all([getSupabaseCareerMasters(options), getSupabaseInstitutions(options), getSupabaseCities(options), getSupabaseAcademicOfferings(options)]); return createCatalog({ careerRows, institutionRows, cityRows, offeringRows, remote: true }); }
export async function getCareersCatalog(options = {}) { return sourceFor(options.env ?? process.env) === "local" ? getLocalCareersCatalog() : getSupabaseCareersCatalog(options); }
export async function getCareerCatalog(slug, options = {}) { return (await getCareersCatalog(options)).find((career) => career.slug === slug) ?? null; }
