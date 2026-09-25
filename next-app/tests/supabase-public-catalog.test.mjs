import assert from "node:assert/strict";
import test from "node:test";

import {
  getSupabaseAcademicOfferings,
  getSupabaseCareerMasters,
  getSupabaseCities,
  getSupabaseInstitutions,
  getSupabaseTrainingOfferings,
  getSupabaseTrainingPrograms,
} from "../lib/public-catalog/supabase-public-catalog.js";

const env = { SUPABASE_URL: "https://catalog.example.test", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_key" };
const readers = [
  ["cities", getSupabaseCities, "cities?select=*&order=display_order.asc,slug.asc"],
  ["institutions", getSupabaseInstitutions, "institutions?select=*&order=display_order.asc,legacy_key.asc"],
  ["career masters", getSupabaseCareerMasters, "career_masters?select=*&order=slug.asc"],
  ["academic offerings", getSupabaseAcademicOfferings, "academic_offerings?select=*&order=display_order.asc,legacy_key.asc"],
  ["training programs", getSupabaseTrainingPrograms, "training_programs?select=*&order=slug.asc"],
  ["training offerings", getSupabaseTrainingOfferings, "training_offerings?select=*&order=display_order.asc,legacy_key.asc"],
];

for (const [name, reader, resource] of readers) {
  test(`${name} uses public GET with only apikey`, async () => {
    let request;
    const result = await reader({ env, fetchImpl: async (url, options) => { request = { url, options }; return { ok: true, status: 200, json: async () => [{ name }] }; } });
    assert.deepEqual(result, [{ name }]);
    assert.equal(request.url, `https://catalog.example.test/rest/v1/${resource}`);
    assert.equal(request.options.method, "GET");
    assert.deepEqual(request.options.headers, { apikey: env.SUPABASE_PUBLISHABLE_KEY });
    assert.deepEqual(request.options.next, { revalidate: 60 });
    assert.equal("Authorization" in request.options.headers, false);
  });
}

test("fails clearly when SUPABASE_URL is missing", async () => {
  await assert.rejects(getSupabaseCities({ env: { SUPABASE_PUBLISHABLE_KEY: env.SUPABASE_PUBLISHABLE_KEY }, fetchImpl: async () => ({}) }), /Missing SUPABASE_URL environment variable/);
});

test("fails clearly when SUPABASE_PUBLISHABLE_KEY is missing", async () => {
  await assert.rejects(getSupabaseCities({ env: { SUPABASE_URL: env.SUPABASE_URL }, fetchImpl: async () => ({}) }), /Missing SUPABASE_PUBLISHABLE_KEY environment variable/);
});

test("reports table and HTTP status without including the key", async () => {
  await assert.rejects(getSupabaseCities({ env, fetchImpl: async () => ({ ok: false, status: 403 }) }), (error) => {
    assert.match(error.message, /cities/);
    assert.match(error.message, /HTTP 403/);
    assert.doesNotMatch(error.message, /sb_publishable_test_key/);
    return true;
  });
});
