import { cityPages, institutions } from "../../app/data/institutions.js";
import { offerings } from "../../app/data/offerings.js";
import { getSupabaseAcademicOfferings, getSupabaseCities, getSupabaseInstitutions } from "./supabase-public-catalog.js";

function groupInstitutions(rows, cities, offeringRows, remote = false) {
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const groups = new Map();
  for (const row of rows) {
    const key = row.slug;
    const city = cityById.get(remote ? row.city_id : row.citySlug);
    if (!city) continue;
    const current = groups.get(key) ?? { slug: key, name: row.name, type: row.type, description: row.description || row.slogan, slogan: row.slogan, logo: row.logo ?? row.logo_text, image: row.image ?? row.hero_image_url, gallery: row.gallery ?? [], venues: [] };
    const rawId = row.id;
    const venueOfferings = offeringRows.filter((offering) => (remote ? offering.institution_id : offering.institutionId) === rawId && (offering.is_visible ?? offering.visible) !== false && (offering.publication_status ?? "published") === "published");
    current.venues.push({ city: { slug: city.slug, name: city.name }, address: row.address, whatsapp: row.whatsapp, image: row.image ?? row.hero_image_url, offerings: venueOfferings.map((offering) => ({ name: offering.degree, slug: offering.careerId ?? offering.career_master_id, modality: offering.modality, duration: offering.duration, image: offering.image ?? offering.image_url })) });
    groups.set(key, current);
  }
  return [...groups.values()].map((institution) => ({ ...institution, isMultiVenue: institution.venues.length > 1, modalities: [...new Set(institution.venues.flatMap((venue) => venue.offerings.map((offering) => offering.modality)).filter(Boolean))], careers: [...new Map(institution.venues.flatMap((venue) => venue.offerings.map((offering) => [offering.slug, { ...offering, cities: [] }]))).values()].map((career) => ({ ...career, cities: institution.venues.filter((venue) => venue.offerings.some((offering) => offering.slug === career.slug)).map((venue) => venue.city) })) })).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function getLocalInstitutionsCatalog() { return groupInstitutions(institutions, Object.values(cityPages).map((city) => ({ id: city.slug, slug: city.slug, name: city.name })), offerings); }
export async function getInstitutionsCatalog(options = {}) { if ((options.env ?? process.env).PUBLIC_CATALOG_SOURCE !== "supabase") return getLocalInstitutionsCatalog(); const [cities, rows, offeringRows] = await Promise.all([getSupabaseCities(options), getSupabaseInstitutions(options), getSupabaseAcademicOfferings(options)]); return groupInstitutions(rows, cities, offeringRows, true); }
export async function getInstitutionCatalog(slug, options = {}) { return (await getInstitutionsCatalog(options)).find((institution) => institution.slug === slug) ?? null; }
