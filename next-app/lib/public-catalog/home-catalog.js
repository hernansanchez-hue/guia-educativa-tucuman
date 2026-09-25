import { cityPages } from "../../app/data/institutions.js";
import { getSupabaseCities } from "./supabase-public-catalog.js";

const sources = new Set(["local", "supabase"]);
const sourceFor = (env) => { const source = env.PUBLIC_CATALOG_SOURCE ?? "local"; if (!sources.has(source)) throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`); return source; };
export function getLocalHomeCatalog() { return { cities: Object.values(cityPages).map(({ slug, name }) => ({ slug, name })) }; }
export async function getSupabaseHomeCatalog(options = {}) { const cities = await getSupabaseCities(options); return { cities: cities.filter((city) => city.is_visible !== false && city.publication_status !== "draft").map(({ slug, name }) => ({ slug, name })) }; }
export async function getHomeCatalog(options = {}) { return sourceFor(options.env ?? process.env) === "local" ? getLocalHomeCatalog() : getSupabaseHomeCatalog(options); }
