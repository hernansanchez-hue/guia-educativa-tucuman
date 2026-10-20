import assert from "node:assert/strict";
import test from "node:test";

import {
  createPublicRoutePaths,
  getPublicRoutePaths,
  getVersionedPublicRoutePaths,
  STATIC_PUBLIC_PATHS,
} from "../lib/public-catalog/public-routes-catalog.js";
import {
  createPublicMetadata,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo/public-metadata.js";

function createSupabaseFixture() {
  return {
    cities: [
      { id: "city-1", slug: "tafi-del-valle", is_active: true },
      { id: "city-2", slug: "inactiva", is_active: false },
    ],
    institutions: [
      { id: "institution-1", city_id: "city-1", slug: "instituto-futuro", is_active: true },
      { id: "institution-2", city_id: "city-2", slug: "instituto-inactivo", is_active: true },
    ],
    careers: [
      { id: "career-1", slug: "carrera-futura", status: "published" },
      { id: "career-2", slug: "carrera-borrador", status: "draft" },
    ],
    academicOfferings: [
      {
        city_id: "city-1",
        institution_id: "institution-1",
        career_master_id: "career-1",
        is_visible: true,
        publication_status: "published",
      },
      {
        city_id: "city-1",
        institution_id: "institution-1",
        career_master_id: "career-2",
        is_visible: true,
        publication_status: "published",
      },
      {
        city_id: "city-1",
        institution_id: "institution-1",
        career_master_id: "career-1",
        is_visible: false,
        publication_status: "published",
      },
    ],
    trainingPrograms: [
      { id: "training-1", slug: "curso-futuro", status: "published" },
      { id: "training-2", slug: "curso-borrador", status: "draft" },
    ],
    trainingOfferings: [
      {
        city_id: "city-1",
        institution_id: "institution-1",
        training_program_id: "training-1",
        is_visible: true,
        publication_status: "published",
      },
      {
        city_id: "city-1",
        institution_id: "institution-1",
        training_program_id: "training-2",
        is_visible: true,
        publication_status: "published",
      },
    ],
  };
}

test("the versioned public route catalog has 546 unique canonical URLs", () => {
  const paths = getVersionedPublicRoutePaths();

  assert.equal(paths.length, 546);
  assert.equal(new Set(paths).size, paths.length);
  assert.deepEqual(paths.slice(0, STATIC_PUBLIC_PATHS.length), STATIC_PUBLIC_PATHS);
  for(const path of ["/aguilares","/concepcion","/monteros","/san-miguel-de-tucuman","/famailla","/burruyacu"])assert.ok(paths.includes(path));
  assert.equal(paths.filter((path) => /^\/[a-z].*\/[a-z].*\/carreras\//.test(path)).length, 195);
  assert.equal(paths.filter((path) => path.includes("/capacitaciones/")).length, 3);
});

test("the public sitemap includes approved SEO indexes and excludes private routes and internal identifiers", () => {
  const serialized = JSON.stringify(getVersionedPublicRoutePaths());

  for (const excluded of ["/admin", "/api", "/media", "/cursos-docentes/"]) {
    assert.equal(serialized.includes(`\"${excluded}\"`), false);
  }
  for(const included of ["/carreras","/instituciones"])assert.ok(getVersionedPublicRoutePaths().includes(included));
  assert.equal(
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(serialized),
    false,
  );
});

test("future published Supabase rows enter the sitemap without slug mappings", () => {
  const paths = createPublicRoutePaths(createSupabaseFixture());

  assert.equal(paths.includes("/tafi-del-valle"), true);
  assert.equal(paths.includes("/tafi-del-valle/instituto-futuro"), true);
  assert.equal(paths.includes("/tafi-del-valle/instituto-futuro/carreras/carrera-futura"), true);
  assert.equal(paths.includes("/tafi-del-valle/instituto-futuro/capacitaciones/curso-futuro"), true);
});

test("inactive, hidden, and draft records are excluded from Supabase routes", () => {
  const serialized = JSON.stringify(createPublicRoutePaths(createSupabaseFixture()));

  assert.equal(serialized.includes("inactiva"), false);
  assert.equal(serialized.includes("instituto-inactivo"), false);
  assert.equal(serialized.includes("carrera-borrador"), false);
  assert.equal(serialized.includes("curso-borrador"), false);
});

test("public route source stays versioned under Netlify and cannot switch accidentally", async () => {
  const versioned = getVersionedPublicRoutePaths();
  assert.deepEqual(await getPublicRoutePaths({}), versioned);
  assert.deepEqual(await getPublicRoutePaths({env:{NETLIFY:"true",NODE_ENV:"production"}}), versioned);
  assert.deepEqual(await getPublicRoutePaths({env:{NETLIFY:"true",PUBLIC_CATALOG_SOURCE:"supabase"}}), versioned);
});

test("metadata helper emits canonical and basic Open Graph metadata", () => {
  const metadata = createPublicMetadata({
    title: "Página de prueba",
    description: "Descripción de prueba",
    path: "/ruta-de-prueba",
    image: "https://images.example/prueba.jpg",
  });

  assert.equal(SITE_URL, "https://guiaeducativatuc.com.ar");
  assert.equal(SITE_NAME, "Guía Educativa Tucumán");
  assert.equal(metadata.alternates.canonical, "/ruta-de-prueba");
  assert.equal(metadata.openGraph.url, "/ruta-de-prueba");
  assert.equal(metadata.openGraph.siteName, SITE_NAME);
  assert.equal(metadata.openGraph.images[0].url, "https://images.example/prueba.jpg");
});
