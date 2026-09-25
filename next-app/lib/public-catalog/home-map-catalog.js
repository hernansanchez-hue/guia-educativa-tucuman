import { cityPages, institutions } from "../../app/data/institutions.js";
import { careers } from "../../app/data/careers.js";
import { offerings } from "../../app/data/offerings.js";
import {
  getSupabaseAcademicOfferings,
  getSupabaseCareerMasters,
  getSupabaseCities,
  getSupabaseInstitutions,
} from "./supabase-public-catalog.js";

// Official GeoRef department IDs (province 90); local until a future city schema migration.
export const CITY_DEPARTMENT_IDS = Object.freeze({
  concepcion: "90021", // Chicligasta
  monteros: "90070", // Monteros
  aguilares: "90077", // Río Chico
});

function departmentIdForCity(slug, mapping) {
  const id = mapping[slug];
  if (!id) throw new Error(`Missing official Tucumán department mapping for city ${slug}`);
  return id;
}

export function buildHomeMapCatalog({ cities, institutions: locations, offerings: academicOfferings }, mapping = CITY_DEPARTMENT_IDS) {
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const institutionById = new Map(locations.map((item) => [item.id, item]));
  const byDepartment = {};
  const search = [];

  for (const city of cities) {
    if (!city.active) continue;
    const departmentId = departmentIdForCity(city.slug, mapping);
    const entry = byDepartment[departmentId] ??= { cities: [], institutionCount: 0, careerCount: 0 };
    entry.cities.push({ slug: city.slug, name: city.name });
    search.push({ type: "Ciudad", label: city.name, href: `/${city.slug}` });
  }

  for (const institution of locations) {
    const city = cityById.get(institution.cityId);
    if (!institution.active || !city?.active) continue;
    const entry = byDepartment[departmentIdForCity(city.slug, mapping)];
    entry.institutionCount += 1;
    search.push({ type: "Institución", label: institution.name, context: city.name, href: `/${city.slug}/${institution.slug}` });
  }

  for (const offering of academicOfferings) {
    const institution = institutionById.get(offering.institutionId);
    const city = institution && cityById.get(institution.cityId);
    if (!offering.active || !institution?.active || !city?.active) continue;
    const entry = byDepartment[departmentIdForCity(city.slug, mapping)];
    entry.careerCount += 1;
    search.push({
      type: "Carrera",
      label: offering.careerName,
      context: `${institution.name} · ${city.name}`,
      href: `/${city.slug}/${institution.slug}/carreras/${offering.careerSlug}`,
    });
  }

  const province = Object.values(byDepartment).reduce((total, entry) => ({
    cityCount: total.cityCount + entry.cities.length,
    institutionCount: total.institutionCount + entry.institutionCount,
    careerCount: total.careerCount + entry.careerCount,
  }), { cityCount: 0, institutionCount: 0, careerCount: 0 });

  return { byDepartment, province, search };
}

export function getLocalHomeMapCatalog() {
  const listed = new Set(Object.values(cityPages).flatMap((city) => city.institutionIds));
  const localInstitutions = institutions.filter((item) => listed.has(item.id));
  const careerById = new Map(careers.map((career) => [career.id, career]));
  return buildHomeMapCatalog({
    cities: Object.values(cityPages).map((city) => ({ id: city.slug, slug: city.slug, name: city.name, active: true })),
    institutions: localInstitutions.map((item) => ({ id: item.id, cityId: item.citySlug, slug: item.slug, name: item.name, active: true })),
    offerings: offerings.filter((item) => item.visible && careerById.has(item.careerId)).map((item) => ({
      institutionId: item.institutionId,
      careerName: careerById.get(item.careerId).name,
      careerSlug: careerById.get(item.careerId).slug,
      active: true,
    })),
  });
}

export async function getSupabaseHomeMapCatalog(options = {}) {
  const [cities, locations, masters, academicOfferings] = await Promise.all([
    getSupabaseCities(options),
    getSupabaseInstitutions(options),
    getSupabaseCareerMasters(options),
    getSupabaseAcademicOfferings(options),
  ]);
  const masterById = new Map(masters.filter((item) => item.is_active && item.status === "published").map((item) => [item.id, item]));
  return buildHomeMapCatalog({
    cities: cities.map((item) => ({ id: item.id, slug: item.slug, name: item.name, active: item.is_active })),
    institutions: locations.map((item) => ({ id: item.id, cityId: item.city_id, slug: item.slug, name: item.name, active: item.is_active })),
    offerings: academicOfferings.filter((item) => masterById.has(item.career_master_id)).map((item) => ({
      institutionId: item.institution_id,
      careerName: masterById.get(item.career_master_id).name,
      careerSlug: masterById.get(item.career_master_id).slug,
      active: item.is_visible && item.publication_status === "published",
    })),
  });
}

export async function getHomeMapCatalog(options = {}) {
  const source = (options.env ?? process.env).PUBLIC_CATALOG_SOURCE ?? "local";
  if (source === "local") return getLocalHomeMapCatalog();
  if (source === "supabase") return getSupabaseHomeMapCatalog(options);
  throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
}
