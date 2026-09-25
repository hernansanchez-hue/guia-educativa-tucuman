const TABLES = Object.freeze({
  cities: "cities?select=*&order=display_order.asc,slug.asc",
  institutions: "institutions?select=*&order=display_order.asc,legacy_key.asc",
  careerMasters: "career_masters?select=*&order=slug.asc",
  academicOfferings:
    "academic_offerings?select=*&order=display_order.asc,legacy_key.asc",
  trainingPrograms: "training_programs?select=*&order=slug.asc",
  trainingOfferings:
    "training_offerings?select=*&order=display_order.asc,legacy_key.asc",
});

function getRequiredEnvironment(name, env) {
  const value = env[name];
  if (!value) throw new Error(`Missing ${name} environment variable for public catalog read.`);
  return value;
}

async function getPublicCatalogTable(table, options = {}) {
  const { env = process.env, fetchImpl = fetch } = options;
  const resource = TABLES[table];
  if (!resource) throw new Error(`Unsupported public catalog table: ${table}`);

  const baseUrl = getRequiredEnvironment("SUPABASE_URL", env).replace(/\/$/, "");
  const publishableKey = getRequiredEnvironment("SUPABASE_PUBLISHABLE_KEY", env);
  const response = await fetchImpl(`${baseUrl}/rest/v1/${resource}`, {
    method: "GET",
    headers: { apikey: publishableKey },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Supabase public catalog request failed for ${table}: HTTP ${response.status}`);
  }
  return response.json();
}

export function getSupabaseCities(options) { return getPublicCatalogTable("cities", options); }
export function getSupabaseInstitutions(options) { return getPublicCatalogTable("institutions", options); }
export function getSupabaseCareerMasters(options) { return getPublicCatalogTable("careerMasters", options); }
export function getSupabaseAcademicOfferings(options) { return getPublicCatalogTable("academicOfferings", options); }
export function getSupabaseTrainingPrograms(options) { return getPublicCatalogTable("trainingPrograms", options); }
export function getSupabaseTrainingOfferings(options) { return getPublicCatalogTable("trainingOfferings", options); }
