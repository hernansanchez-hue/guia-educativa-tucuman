# Cursos Docentes: arquitectura Supabase v1

## Fuente canónica Vite

La vista está en `index.html#coursesPage`, se abre mediante `showCoursesPage()` y se alimenta del array `teacherCourses` de `src/main.js`. `renderTeacherCourses()`, `filterTeacherCourses()`, `clearCourseFilters()`, `loadMoreCourses()` y `scrollCourseCarousel()` implementan su comportamiento. Los estilos canónicos son `.courses-*`, `.course-*` y `.teacher-course-*` en `src/styles.css`, incluidos los breakpoints de 1100, 820 y 720 px y el ajuste móvil global del carrusel.

La demo contiene 10 cursos. Los campos reales son: nombre, institución, ciudad, modalidad, puntaje, duración en semanas, fecha de inicio, estado, badge, urgencia, imagen y destacado. No contiene descripción, resolución ni carga horaria; por fidelidad no se agregaron esos conceptos al esquema.

## Clasificación del detalle

La clasificación es **C: intención futura sin implementación canónica**. `viewTeacherCourse(name)` sólo muestra el aviso `La ficha de “…” estará disponible próximamente.`. No existen panel, modal, contenido expandido, slug, `pushState` ni ruta individual. Por eso no se implementa `/cursos-docentes/[slug]`.

## Modelo elegido

Se eligió una tabla única, `public.teacher_courses`, porque cada registro de Vite es una oferta provincial autocontenida y no existe una entidad maestra separada de una sede u organizador. `institution_name` y `city_name` son textos canónicos: la lista incluye `Tucumán`, que no es una de las tres ciudades navegables actuales, y el dominio debe admitir organizadores provinciales sin depender del catálogo institucional.

Campos:

- identidad interna UUID y pública mediante `legacy_key` y `slug` únicos;
- `title`, `institution_name`, `city_name`, `modality`, `score`, `duration_weeks`, `start_date`;
- `status`, `badge`, `urgency`, `image_url`, `is_featured`, `display_order`;
- `publication_status`, `is_active`, `created_at`, `updated_at`.

El modelo es deliberadamente independiente de `career_masters`, `academic_offerings`, `training_programs` y `training_offerings`. Cursos Docentes es un catálogo provincial y no una capacitación institucional del dominio `training_*`.

## Seguridad y publicación

La migración `20260822013952_teacher_courses_schema_rls_v1.sql` crea tabla, constraints, índices, trigger con `public.set_updated_at()`, grants de sólo lectura y RLS. `anon` y `authenticated` sólo pueden hacer `select` de registros `is_active = true` y `publication_status = 'published'`. No existe política pública de escritura ni uso de service role en el frontend.

La migración `20260822013953_teacher_courses_seed_v1.sql` inserta los 10 registros canónicos en su orden original y valida cantidad, `legacy_key`, `slug` y orden únicos. Es intencionalmente no idempotente para que cualquier drift se haga visible.

## Administración futura

La tabla permite crear, editar, publicar/despublicar, activar/desactivar y ordenar cursos sin editar código. El Centro de Control no se implementa en esta etapa. Una alta publicada podrá aparecer mediante el reader Supabase y el ISR de 60 segundos sin cambio de código ni redeploy; no tendrá ficha individual porque Vite no define esa experiencia.

## Aplicación y validación

El SQL no contiene `drop`, alteraciones destructivas ni cambios sobre las tablas previas o sus políticas. Las migraciones se aplicaron exclusivamente al proyecto `get-definitivo` (`zomoblpgurchkxvkkutj`) como `teacher_courses_schema_rls_v1` y `teacher_courses_seed_v1`; no se operó sobre `get-mvp` ni `get-instituciones`.

La verificación remota confirmó tabla con RLS activa, 10 filas y grants `SELECT` —sin escritura— para `anon` y `authenticated`. El Security Advisor devolvió 0 observaciones. El Performance Advisor sólo informó como índices todavía no usados los dos índices recién creados, resultado esperado antes del tráfico real y no un problema de seguridad ni de diseño.

Tras las consultas HTTP y validaciones reales, ambos índices de `teacher_courses` dejaron de aparecer en el Performance Advisor. El único aviso final es un índice no usado preexistente de `training_offerings`, ajeno a esta etapa.

La comparación local/Supabase, el reader y sus pruebas se completan en el segundo commit de esta etapa.
