# Auditoría de rutas generales públicas v1

## Hallazgos Vite

La navegación canónica usa handlers SPA en `index.html` y `src/main.js`: `showCoursesPage`, `showInfoPage('about'|'contact'|'events')`, login y Centro de Control. Home, ciudades, fichas y detalles ya están migrados.

| Ruta futura | Equivalente Vite | Clasificación | Acción |
|---|---|---|---|
| `/carreras` | No existe listado provincial independiente | C: no crear | No inventar |
| `/carreras/[slug]` | No existe master sin institución | C: no crear | Mantener detalles contextuales |
| `/cursos-docentes` | Sí, `showCoursesPage` y `renderTeacherCourses` | B: migrar después | Requiere dominio/modelo separado |
| `/cursos-docentes/[slug]` | No se confirmó detalle canónico | C: no crear | No inventar |
| `/nosotros` | Sí, `showInfoPage('about')` | A: migrar ahora | Editorial fijo |
| `/contacto` | Sí, `showInfoPage('contact')`, CTA/formulario | A: migrar ahora | Editorial/contacto; auditar datos exactos |
| `/admin` | Centro de Control SPA + login/localStorage | D: reservada | Pertenece a GET Instituciones/Auth |

Cursos Docentes no es capacitación institucional: Vite posee cards, filtros y datos propios provinciales; no corresponde usar `training_programs` ni `training_offerings`. Eventos también existe como vista SPA, pero no está incluida en las rutas previstas y requerirá modelo propio. Nosotros y Contacto son contenido editorial. La demo conserva responsive mediante CSS canónico y las vistas se abren desde menú, footer y CTAs.

Orden recomendado: primero migrar Nosotros y Contacto con contenido literal Vite; después definir modelo Supabase independiente para Cursos Docentes/Eventos; mantener carreras generales sin crear y reservar Admin para GET Instituciones.
