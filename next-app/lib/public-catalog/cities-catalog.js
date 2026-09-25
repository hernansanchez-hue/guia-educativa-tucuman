import { cityPages } from "../../app/data/institutions.js";
import { getSupabaseCities } from "./supabase-public-catalog.js";

const VALID_SOURCES = new Set(["local", "supabase"]);

function getSelectedSource(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";

  if (!VALID_SOURCES.has(source)) {
    throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  }

  return source;
}

function cloneLocalCity(city) {
  return {
    slug: city.slug,
    name: city.name,
    title: city.title,
    institutionIds: [...city.institutionIds],
    featuredInstitutionIds: [...city.featuredInstitutionIds],
    ...(city.canonicalDataNotice ? { canonicalDataNotice: city.canonicalDataNotice } : {}),
  };
}

export function getLocalCitiesCatalog() {
  return Object.values(cityPages).map(cloneLocalCity);
}

export function adaptSupabaseCity(city) {
  const metadata = city.visual_metadata ?? {};

  if (!metadata || Array.isArray(metadata) || typeof metadata !== "object") {
    throw new Error(`Invalid visual_metadata for Supabase city: ${city.slug}`);
  }

  return {
    slug: city.slug,
    name: city.name,
    title: city.title,
    institutionIds: [...(metadata.institutionIds ?? [])],
    featuredInstitutionIds: [...(metadata.featuredInstitutionIds ?? [])],
    ...(metadata.canonicalDataNotice
      ? { canonicalDataNotice: metadata.canonicalDataNotice }
      : {}),
  };
}

export async function getSupabaseCitiesCatalog(options = {}) {
  const cities = await getSupabaseCities(options);

  return cities
    .slice()
    .sort((left, right) => left.display_order - right.display_order || left.slug.localeCompare(right.slug, "es"))
    .map(adaptSupabaseCity);
}

export async function getCitiesCatalog(options = {}) {
  const { env = process.env } = options;
  const source = getSelectedSource(env);

  return source === "local" ? getLocalCitiesCatalog() : getSupabaseCitiesCatalog(options);
}
