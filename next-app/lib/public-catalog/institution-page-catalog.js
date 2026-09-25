import { getInstitutionPage } from "../../app/data/institutions.js";
import {
  getSupabaseCities,
  getSupabaseInstitutions,
} from "./supabase-public-catalog.js";
import {
  getInstitutionOfferingsCatalog,
  getLocalInstitutionOfferingsCatalog,
} from "./institution-offerings-catalog.js";

const VALID_SOURCES = new Set(["local", "supabase"]);

function sourceFor(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";
  if (!VALID_SOURCES.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  return source;
}

function cloneLocalPage(page) {
  if (!page) return null;
  return {
    city: { ...page.city },
    institution: {
      ...page.institution,
      cities: [...page.institution.cities],
      gallery: [...page.institution.gallery],
      careers: page.institution.careers.map((career) => ({ ...career })),
    },
  };
}

function metadataFor(record, label) {
  const metadata = record.visual_metadata ?? {};
  if (!metadata || Array.isArray(metadata) || typeof metadata !== "object") {
    throw new Error(`Invalid visual_metadata for ${label}`);
  }
  return metadata;
}

export function getLocalInstitutionPageCatalog(citySlug, institutionSlug) {
  const page = cloneLocalPage(getInstitutionPage(citySlug, institutionSlug));
  if (!page) return null;
  return {
    ...page,
    institution: { ...page.institution, careers: getLocalInstitutionOfferingsCatalog(citySlug, institutionSlug) },
  };
}

export async function getSupabaseInstitutionPageCatalog(citySlug, institutionSlug, options = {}) {
  const [cities, institutions] = await Promise.all([
    getSupabaseCities(options),
    getSupabaseInstitutions(options),
  ]);
  const city = cities.find((item) => item.slug === citySlug);
  if (!city) return null;
  const remote = institutions.filter(
    (item) => item.city_id === city.id && item.slug === institutionSlug,
  );
  if (!remote.length) return null;
  if (remote.length !== 1) throw new Error(`Expected one Supabase institution for ${citySlug}/${institutionSlug}`);

  const institution = remote[0];
  const metadata = metadataFor(institution, `Supabase institution: ${institution.legacy_key}`);

  return {
    city: { slug: city.slug, name: city.name },
    institution: {
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
      careers: [],
      ...(metadata.canonicalDataNotice ? { canonicalDataNotice: metadata.canonicalDataNotice } : {}),
    },
  };
}

export async function getInstitutionPageCatalog(citySlug, institutionSlug, options = {}) {
  const source = sourceFor(options.env ?? process.env);
  const page = source === "local"
    ? getLocalInstitutionPageCatalog(citySlug, institutionSlug)
    : await getSupabaseInstitutionPageCatalog(citySlug, institutionSlug, options);
  if (!page) return null;
  const careers = await getInstitutionOfferingsCatalog(citySlug, institutionSlug, options);
  return { ...page, institution: { ...page.institution, careers } };
}
