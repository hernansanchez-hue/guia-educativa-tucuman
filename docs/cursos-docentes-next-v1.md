# Cursos Docentes Next.js v1

## Alcance y fuente Vite

La ruta pública `/cursos-docentes` reproduce `index.html#coursesPage`. La apertura canónica de la SPA es `showCoursesPage()`; `teacherCourses`, `renderTeacherCourses()`, `filterTeacherCourses()`, `clearCourseFilters()`, `loadMoreCourses()`, `scrollCourseCarousel()`, `viewTeacherCourse()` y `consultTeacherCourse()` están en `src/main.js`. El CSS fuente corresponde a `.courses-*`, `.course-*` y `.teacher-course-*` en `src/styles.css`.

La auditoría confirmó 10 cursos y los campos reales nombre, institución, ciudad, modalidad, puntaje, duración en semanas, fecha de inicio, estado, badge, urgencia, imagen y destacado. No hay descripción, resolución ni horas en el catálogo canónico.

## Detalle individual

No se implementó `/cursos-docentes/[slug]`. Vite no posee una ficha canónica: `viewTeacherCourse()` sólo muestra el aviso de disponibilidad futura. La ruta inválida `/cursos-docentes/curso-inexistente` responde 404.

## Implementación

- `app/cursos-docentes/page.js` es Server Component, obtiene el catálogo según `PUBLIC_CATALOG_SOURCE` y declara `revalidate = 60`.
- `CoursesClient.js` conserva búsqueda, seis controles de filtro, reset, contador, vacío, carga incremental 5 + 4, carruseles, aviso “Ver curso”, consulta WhatsApp y CTA hacia `/contacto`.
- `course-filters.js` contiene la lógica pura y comprobable de búsqueda/filtros.
- `cursos-docentes.css` conserva el CSS canónico, dark mode, breakpoints 1100/820/720 px y reduced motion.
- `AboutRevealClient` se reutiliza sin modificarlo para el reveal canónico con threshold 0,12 y `unobserve`.
- `PublicHeader` conecta el CTA desktop y la opción móvil. `PublicFooter` conecta “Cursos docentes”. No se agregó navegación a Eventos ni Auth.

El catálogo provincial permanece separado de `training_programs` y `training_offerings`; la página sólo consume `teacher_courses`.

## Datos local y Supabase

El catálogo local y el remoto tienen 10 registros, el mismo orden y 0 faltantes, inesperados o mismatches de campos. El reader no selecciona ni expone UUID; conserva `legacy_key` como identidad estable y `slug` como identidad pública. La fuente por defecto es `local`; `supabase` no hace fallback silencioso y usa cache `revalidate: 60`.

Una fila futura publicada y activa aparece mediante el reader genérico después del TTL sin cambio de código ni redeploy. No obtiene ficha individual porque esa experiencia no existe en Vite.

## Validación funcional

En Edge se comprobaron:

- búsqueda sin acentos: “evaluacion formativa” → 1 resultado;
- modalidad Virtual → 3 resultados;
- combinación de filtros y orden canónico mediante tests;
- resultado inexistente → 0 y estado vacío visible;
- limpiar filtros → 10 resultados y límite visible reiniciado;
- carga incremental 5 + 4 hasta los 10 registros mediante la lógica canónica;
- navegación desde header desktop, menú móvil y footer;
- CTA institucional hacia `/contacto`;
- carruseles, badges, estados, fechas y botones preservados.

El endpoint local y el modo Supabase responden 200 en `/cursos-docentes`. El smoke Supabase confirmó 200 en Home, `/ciudades`, las tres ciudades, las diez fichas institucionales, una carrera, una capacitación, `/nosotros`, `/contacto` y `/cursos-docentes`.

## Validación visual Edge

Evidencia temporal —no versionada—:

- Vite: desktop y mobile, claro y oscuro;
- Next local: desktop y mobile, claro y oscuro;
- Next Supabase: desktop y mobile, claro.

Viewports:

- desktop: `window.innerWidth = 1440`, `window.innerHeight = 900`;
- mobile: `window.innerWidth = 390`, `window.innerHeight = 843`.

Mediciones desktop coincidentes: header 1120 × 62 px; hero 1240 × 430 px; filtros 1240 × 69,6 px. En móvil `clientWidth = scrollWidth = 375` por la barra física de Edge, con viewport CSS real 390 × 843 y sin overflow horizontal. Hero, buscador, filtros, 4 destacados, 5 próximos, cards, badges, CTA, responsive y modo oscuro coinciden visualmente con Vite.

No existen diferencias significativas. Sólo se observó el indicador técnico de Next en el servidor de desarrollo y el tiempo variable de activación del reveal en la sesión Edge automatizada; el servidor de producción y la aplicación hidratada no presentan una diferencia estructural.

## Tests y builds

- `teacher-courses-catalog.test.mjs`: 6 tests de local, Supabase, igualdad, orden, fuente, credenciales, error remoto, ausencia de UUID y alta futura.
- `teacher-courses-filters.test.mjs`: 3 tests de búsqueda, filtros individuales, combinaciones, orden y vacío.
- total dedicado: 9/9 aprobado.
- regresión completa de `next-app/tests`: 92/92 aprobada.
- lint: 0 errores; 5 warnings de `<img>` canónicos (3 en Cursos Docentes y 2 preexistentes en Nosotros).
- build local: correcto, 53 páginas.
- build Supabase: correcto, 53 páginas; `/cursos-docentes` usa ISR de 60 segundos.
- advertencia conocida: dos lockfiles; no se modificó configuración para ocultarla.
- `git diff --check`: correcto.

## Integridad

Vite permanece intacta. No se modificaron CSS compartidos salvo las conexiones funcionales de navegación en header/footer; el CSS nuevo está aislado en la ruta. No se tocaron dependencias, `package.json`, lockfiles, `get-mvp`, `get-instituciones`, Eventos, Auth, Centro de Control ni otros dominios. El remoto sólo recibió las dos migraciones de `teacher_courses` en `get-definitivo`.
