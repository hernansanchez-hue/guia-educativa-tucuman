import { teacherCourses } from "../../app/data/teacherCourses.js";

const VALID_SOURCES = new Set(["local", "supabase"]);
const TEACHER_COURSE_FIELDS = [
  "legacy_key",
  "slug",
  "title",
  "institution_name",
  "city_name",
  "modality",
  "score",
  "duration_weeks",
  "start_date",
  "status",
  "badge",
  "urgency",
  "image_url",
  "is_featured",
  "display_order",
].join(",");

function getSelectedSource(env) {
  const source = env.PUBLIC_CATALOG_SOURCE ?? "local";
  if (!VALID_SOURCES.has(source)) {
    throw new Error(`Unsupported PUBLIC_CATALOG_SOURCE: ${source}`);
  }
  return source;
}

function getRequiredEnvironment(name, env) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing ${name} environment variable for teacher courses catalog read.`);
  }
  return value;
}

function cloneCourse(course) {
  return { ...course };
}

function adaptSupabaseCourse(course) {
  return {
    id: course.legacy_key,
    slug: course.slug,
    name: course.title,
    institution: course.institution_name,
    city: course.city_name,
    modality: course.modality,
    score: course.score,
    weeks: course.duration_weeks,
    start: course.start_date,
    status: course.status,
    badge: course.badge,
    urgency: course.urgency,
    image: course.image_url,
    featured: course.is_featured,
    order: course.display_order,
  };
}

export function getLocalTeacherCoursesCatalog() {
  return teacherCourses.map(cloneCourse);
}

export async function getSupabaseTeacherCoursesCatalog(options = {}) {
  const { env = process.env, fetchImpl = fetch } = options;
  const baseUrl = getRequiredEnvironment("SUPABASE_URL", env).replace(/\/$/, "");
  const publishableKey = getRequiredEnvironment("SUPABASE_PUBLISHABLE_KEY", env);
  const resource = `teacher_courses?select=${TEACHER_COURSE_FIELDS}&order=display_order.asc,slug.asc`;
  const response = await fetchImpl(`${baseUrl}/rest/v1/${resource}`, {
    method: "GET",
    headers: { apikey: publishableKey },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Supabase teacher courses catalog request failed: HTTP ${response.status}`);
  }

  const courses = await response.json();
  return courses.map(adaptSupabaseCourse);
}

export async function getTeacherCoursesCatalog(options = {}) {
  const { env = process.env } = options;
  return getSelectedSource(env) === "local"
    ? getLocalTeacherCoursesCatalog()
    : getSupabaseTeacherCoursesCatalog(options);
}
