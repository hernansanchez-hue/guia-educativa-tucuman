import assert from "node:assert/strict";
import test from "node:test";
import {
  getLocalTeacherCoursesCatalog,
  getSupabaseTeacherCoursesCatalog,
  getTeacherCoursesCatalog,
} from "../lib/public-catalog/teacher-courses-catalog.js";

const supabaseEnv = {
  PUBLIC_CATALOG_SOURCE: "supabase",
  SUPABASE_URL: "https://example.test",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

function toRemote(course, index = course.order) {
  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    legacy_key: course.id,
    slug: course.slug,
    title: course.name,
    institution_name: course.institution,
    city_name: course.city,
    modality: course.modality,
    score: course.score,
    duration_weeks: course.weeks,
    start_date: course.start,
    status: course.status,
    badge: course.badge,
    urgency: course.urgency,
    image_url: course.image,
    is_featured: course.featured,
    display_order: course.order,
  };
}

function responseFor(rows, { ok = true, status = 200 } = {}) {
  return async (url, init) => {
    assert.match(url, /teacher_courses\?select=/);
    assert.match(url, /order=display_order\.asc,slug\.asc/);
    assert.equal(url.includes("id,"), false, "the internal UUID must not be selected");
    assert.equal(init.headers.apikey, supabaseEnv.SUPABASE_PUBLISHABLE_KEY);
    assert.deepEqual(init.next, { revalidate: 60 });
    return { ok, status, json: async () => rows };
  };
}

test("local catalog preserves the 10 canonical Vite courses and order", () => {
  const local = getLocalTeacherCoursesCatalog();
  assert.equal(local.length, 10);
  assert.deepEqual(local.map((course) => course.order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(local.filter((course) => course.featured).length, 4);
});

test("Supabase catalog reproduces local shape and never exposes UUIDs", async () => {
  const local = getLocalTeacherCoursesCatalog();
  const remote = await getSupabaseTeacherCoursesCatalog({
    env: supabaseEnv,
    fetchImpl: responseFor(local.map(toRemote)),
  });
  assert.deepEqual(remote, local);
  assert.equal(JSON.stringify(remote).includes("00000000-0000-4000-8000"), false);
});

test("source defaults to local and rejects unsupported values", async () => {
  assert.deepEqual(await getTeacherCoursesCatalog({ env: {} }), getLocalTeacherCoursesCatalog());
  await assert.rejects(
    () => getTeacherCoursesCatalog({ env: { PUBLIC_CATALOG_SOURCE: "other" } }),
    /Unsupported PUBLIC_CATALOG_SOURCE/,
  );
});

test("Supabase source requires both public credentials", async () => {
  await assert.rejects(
    () => getSupabaseTeacherCoursesCatalog({ env: {} }),
    /Missing SUPABASE_URL/,
  );
  await assert.rejects(
    () => getSupabaseTeacherCoursesCatalog({ env: { SUPABASE_URL: "https://example.test" } }),
    /Missing SUPABASE_PUBLISHABLE_KEY/,
  );
});

test("remote errors surface without a silent local fallback", async () => {
  await assert.rejects(
    () => getTeacherCoursesCatalog({
      env: supabaseEnv,
      fetchImpl: responseFor([], { ok: false, status: 503 }),
    }),
    /HTTP 503/,
  );
});

test("a future published course is returned without a code-specific mapping", async () => {
  const future = {
    id: "curso-docente-futuro",
    slug: "curso-docente-futuro",
    name: "Curso docente futuro",
    institution: "Institución futura",
    city: "Tucumán",
    modality: "Virtual",
    score: 0,
    weeks: 3,
    start: "2027-01-10",
    status: "Inscripciones abiertas",
    badge: "Nuevo",
    urgency: "Inicia en enero",
    image: "https://example.test/curso.jpg",
    featured: false,
    order: 11,
  };
  const remote = await getSupabaseTeacherCoursesCatalog({
    env: supabaseEnv,
    fetchImpl: responseFor([toRemote(future, 11)]),
  });
  assert.deepEqual(remote, [future]);
});
