-- GET Cursos Docentes v1: exact canonical data from Vite teacherCourses.
-- This migration is intentionally non-idempotent so uniqueness violations expose drift.

insert into public.teacher_courses (
  legacy_key,
  slug,
  title,
  institution_name,
  city_name,
  modality,
  score,
  duration_weeks,
  start_date,
  status,
  badge,
  urgency,
  image_url,
  is_featured,
  display_order,
  publication_status,
  is_active
) values
  ('inteligencia-artificial-aplicada-al-aula', 'inteligencia-artificial-aplicada-al-aula', 'Inteligencia artificial aplicada al aula', 'Universidad Siglo 21', 'Concepción', 'Mixta', 40, 6, '2026-06-26', 'Últimos cupos', 'Destacado', 'Inicia mañana', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', true, 1, 'published', true),
  ('evaluacion-formativa-y-nuevas-estrategias', 'evaluacion-formativa-y-nuevas-estrategias', 'Evaluación formativa y nuevas estrategias', 'IES Concepción', 'Concepción', 'Presencial', 30, 4, '2026-06-28', 'Inscripciones abiertas', 'Recomendado', 'Inicia en 3 días', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', true, 2, 'published', true),
  ('herramientas-digitales-para-docentes', 'herramientas-digitales-para-docentes', 'Herramientas digitales para docentes', 'Centro de Formación Tucumán', 'Monteros', 'Virtual', 25, 5, '2026-07-02', 'Inscripciones abiertas', 'Nuevo', 'Inicia la próxima semana', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', true, 3, 'published', true),
  ('educacion-emocional-y-convivencia-escolar', 'educacion-emocional-y-convivencia-escolar', 'Educación emocional y convivencia escolar', 'Instituto San Miguel', 'Monteros', 'Presencial', 35, 8, '2026-07-06', 'Inscripciones abiertas', 'Recomendado', 'Inicia la próxima semana', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80', true, 4, 'published', true),
  ('diseno-de-proyectos-interdisciplinarios', 'diseno-de-proyectos-interdisciplinarios', 'Diseño de proyectos interdisciplinarios', 'Instituto Santa Bárbara', 'Aguilares', 'Mixta', 45, 10, '2026-07-13', 'Últimos cupos', 'Destacado', 'Inicia en 18 días', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', false, 5, 'published', true),
  ('inclusion-educativa-y-trayectorias-escolares', 'inclusion-educativa-y-trayectorias-escolares', 'Inclusión educativa y trayectorias escolares', 'IES Concepción', 'Concepción', 'Virtual', 40, 7, '2026-07-20', 'Inscripciones abiertas', 'Nuevo', 'Inicia en julio', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80', false, 6, 'published', true),
  ('alfabetizacion-inicial-enfoques-actuales', 'alfabetizacion-inicial-enfoques-actuales', 'Alfabetización inicial: enfoques actuales', 'Instituto San Miguel', 'Monteros', 'Presencial', 30, 6, '2026-08-03', 'Próximamente', 'Nuevo', 'Inicia en agosto', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', false, 7, 'published', true),
  ('gamificacion-y-aprendizaje-basado-en-retos', 'gamificacion-y-aprendizaje-basado-en-retos', 'Gamificación y aprendizaje basado en retos', 'Academia Profesional Norte', 'Aguilares', 'Virtual', 20, 4, '2026-08-10', 'Inscripciones abiertas', 'Recomendado', 'Inicia en agosto', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', false, 8, 'published', true),
  ('gestion-institucional-y-liderazgo-pedagogico', 'gestion-institucional-y-liderazgo-pedagogico', 'Gestión institucional y liderazgo pedagógico', 'Universidad Siglo 21', 'Tucumán', 'Mixta', 50, 12, '2026-08-17', 'Próximamente', 'Destacado', 'Inicia en agosto', 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80', false, 9, 'published', true),
  ('estrategias-para-la-ensenanza-de-matematica', 'estrategias-para-la-ensenanza-de-matematica', 'Estrategias para la enseñanza de matemática', 'Centro de Formación Tucumán', 'Aguilares', 'Presencial', 25, 5, '2026-09-01', 'Próximamente', 'Nuevo', 'Inicia en septiembre', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80', false, 10, 'published', true);

do $teacher_courses_seed_validation$
declare
  actual_count bigint;
  unique_legacy_count bigint;
  unique_slug_count bigint;
  unique_order_count bigint;
begin
  select count(*), count(distinct legacy_key), count(distinct slug), count(distinct display_order)
  into actual_count, unique_legacy_count, unique_slug_count, unique_order_count
  from public.teacher_courses;

  if actual_count <> 10 then
    raise exception 'Expected 10 teacher courses, found %', actual_count;
  end if;
  if unique_legacy_count <> 10 then
    raise exception 'Expected 10 unique teacher course legacy keys, found %', unique_legacy_count;
  end if;
  if unique_slug_count <> 10 then
    raise exception 'Expected 10 unique teacher course slugs, found %', unique_slug_count;
  end if;
  if unique_order_count <> 10 then
    raise exception 'Expected 10 unique teacher course display orders, found %', unique_order_count;
  end if;
end;
$teacher_courses_seed_validation$;
