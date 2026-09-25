import { getCityPage, institutions } from "../../app/data/institutions.js";
import {
  getSupabaseCities,
  getSupabaseInstitutions,
} from "./supabase-public-catalog.js";

const VALID_SOURCES = new Set(["local", "supabase"]);

function getSelectedSource(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";

  if (!VALID_SOURCES.has(source)) {
    throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  }

  return source;
}

function getMetadata(record, label) {
  const metadata = record.visual_metadata ?? {};

  if (!metadata || Array.isArray(metadata) || typeof metadata !== "object") {
    throw new Error(`Invalid visual_metadata for ${label}`);
  }

  return metadata;
}

function cloneLocalInstitution(institution) {
  return {
    ...institution,
    cities: [...institution.cities],
    gallery: [...institution.gallery],
    careers: institution.careers.map((career) => ({ ...career })),
  };
}

function adaptSupabaseInstitution(institution, cityById, localInstitutionByLegacyKey) {
  const localInstitution = localInstitutionByLegacyKey.get(institution.legacy_key);

  if (!localInstitution) {
    throw new Error(`Missing local career summaries for institution: ${institution.legacy_key}`);
  }

  const metadata = getMetadata(institution, `Supabase institution: ${institution.legacy_key}`);
  const city = cityById.get(institution.city_id);

  if (!city) {
    throw new Error(`Missing Supabase city for institution: ${institution.legacy_key}`);
  }

  return {
    id: institution.legacy_key,
    citySlug: city.slug,
    slug: institution.slug,
    name: institution.name,
    logo: institution.logo_text,
    type: institution.type,
    cities: [...(institution.cities_label ?? [])],
    plan: institution.plan,
    slogan: institution.slogan,
    description: institution.description,
    address: institution.address,
    whatsapp: institution.whatsapp,
    image: institution.hero_image_url,
    media: institution.media_label,
    gallery: [...(institution.gallery ?? [])],
    careers: localInstitution.careers.map((career) => ({ ...career })),
    ...(metadata.canonicalDataNotice
      ? { canonicalDataNotice: metadata.canonicalDataNotice }
      : {}),
  };
}

export function getLocalCityPageCatalog(citySlug) {
  const city = getCityPage(citySlug);

  if (!city) return null;

  return {
    ...city,
    institutionIds: [...city.institutionIds],
    featuredInstitutionIds: [...city.featuredInstitutionIds],
    institutions: city.institutions.map(cloneLocalInstitution),
    featuredInstitutions: city.featuredInstitutions.map(cloneLocalInstitution),
  };
}

export async function getSupabaseCityPageCatalog(citySlug, options = {}) {
  const [cities, remoteInstitutions] = await Promise.all([
    getSupabaseCities(options),
    getSupabaseInstitutions(options),
  ]);
  const remoteCity = cities.find((city) => city.slug === citySlug);

  if (!remoteCity) return null;

  const cityMetadata = getMetadata(remoteCity, `Supabase city: ${citySlug}`);
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const localInstitutionByLegacyKey = new Map(
    institutions.map((institution) => [institution.id, institution]),
  );
  const remoteInstitutionByLegacyKey = new Map(
    remoteInstitutions.map((institution) => [institution.legacy_key, institution]),
  );
  const adaptByLegacyKey = (legacyKey) => {
    const institution = remoteInstitutionByLegacyKey.get(legacyKey);
    if (!institution) {
      throw new Error(`Missing Supabase institution: ${legacyKey}`);
    }
    return adaptSupabaseInstitution(institution, cityById, localInstitutionByLegacyKey);
  };

  return {
    slug: remoteCity.slug,
    name: remoteCity.name,
    title: remoteCity.title,
    institutionIds: [...(cityMetadata.institutionIds ?? [])],
    featuredInstitutionIds: [...(cityMetadata.featuredInstitutionIds ?? [])],
    ...(cityMetadata.canonicalDataNotice
      ? { canonicalDataNotice: cityMetadata.canonicalDataNotice }
      : {}),
    institutions: (cityMetadata.institutionIds ?? []).map(adaptByLegacyKey),
    featuredInstitutions: (cityMetadata.featuredInstitutionIds ?? []).map(adaptByLegacyKey),
  };
}

export async function getCityPageCatalog(citySlug, options = {}) {
  const { env = process.env } = options;
  const source = getSelectedSource(env);

  return source === "local"
    ? getLocalCityPageCatalog(citySlug)
    : getSupabaseCityPageCatalog(citySlug, options);
}
