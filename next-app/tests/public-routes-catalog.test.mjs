import assert from "node:assert/strict";
import test from "node:test";

import {
  createPublicRoutePaths,
  getLocalPublicRoutePaths,
  getPublicRoutePaths,
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

test("the local public sitemap has 51 unique canonical URLs", () => {
  const paths = getLocalPublicRoutePaths();

  assert.equal(paths.length, 51);
  assert.equal(new Set(paths).size, paths.length);
  assert.deepEqual(paths.slice(0, STATIC_PUBLIC_PATHS.length), STATIC_PUBLIC_PATHS);
  assert.deepEqual(
    paths.filter((path) => ["/concepcion", "/monteros", "/aguilares"].includes(path)).sort(),
    ["/aguilares", "/concepcion", "/monteros"],
  );
  assert.equal(paths.filter((path) => path.includes("/carreras/")).length, 30);
  assert.equal(paths.filter((path) => path.includes("/capacitaciones/")).length, 3);
});

test("the public sitemap excludes non-V1 routes and internal identifiers", () => {
  const serialized = JSON.stringify(getLocalPublicRoutePaths());

  for (const excluded of ["/eventos", "/admin", "/carreras", "/cursos-docentes/"]) {
    assert.equal(serialized.includes(`\"${excluded}\"`), false);
  }
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

test("public route source defaults to local and rejects unsupported sources", async () => {
  const local = await getPublicRoutePaths({});

  assert.deepEqual(local, getLocalPublicRoutePaths());
  assert.throws(
    () => getPublicRoutePaths({ env: { PUBLIC_CATALOG_SOURCE: "desconocido" } }),
    /Unsupported PUBLIC_CATALOG_SOURCE/,
  );
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
