# Release: expansión provincial del catálogo público

Fecha: 2026-10-20

Producción: `https://guiaeducativatuc.com.ar`

Punto de retorno previo: `e4f4da5085612e80c60ecd8843f4b3ecd817c166`

## Alcance

Esta publicación convierte el catálogo provincial aprobado en una fuente pública versionada y apta para Netlify. El sitio público deja de depender del catálogo académico remoto incompleto para resolver ciudades, instituciones, carreras, relaciones, búsqueda, filtros, mapa, metadatos y sitemap.

La publicación conserva los cambios públicos aprobados que estaban pendientes: plantilla común de ciudades, páginas de institución y carrera, directorios SEO, navegación pública, eventos, servicios, Nosotros, fondos y componentes públicos compartidos. No promociona ni publica como producto terminado la consola administrativa.

## Catálogo publicado

- 27 ciudades/localidades;
- 93 marcas institucionales;
- 125 sedes;
- 195 carreras maestras;
- 198 ofertas territoriales;
- 128 referencias universitarias generales;
- 638 documentos editoriales versionados.

La fuente oficial está documentada en `docs/catalog/GET-PUBLIC-CATALOG-ARCHITECTURE.md`.

## Reglas conservadas

- Los datos validados existentes prevalecen sobre importaciones incompletas.
- Las instituciones incorporadas desde el padrón son normales por defecto.
- Premium sigue apareciendo en destacados y en el listado completo.
- Las instituciones normales no ocupan espacios destacados.
- Las ciudades usan la plantilla compartida y no muestran una grilla general “Todas las carreras”.
- Orientación Vocacional y Expo mantienen los bloques globales aprobados.
- Las ciudades sin publicidad usan el banner editorial neutro de GET.
- Las instituciones sin carreras no inventan oferta ni rompen la página.
- `/admin`, previews y borradores quedan fuera del sitemap.

## Seguridad y privacidad

- No se incluyen `.env`, `.env.local`, contraseñas, tokens ni claves privadas.
- No se incluyen notas de prospección ni campos comerciales internos del PDF.
- No se ejecutan migraciones ni escrituras remotas.
- Los assets locales del catálogo están dentro de `next-app/public/assets/catalog/`.

## Validación previa

- Suite completa: 215/215 PASS.
- Lint: PASS, 0 errores; 9 advertencias preexistentes por `<img>`.
- TypeScript: PASS dentro del build.
- Build con `NETLIFY=true`: PASS, 400 páginas generadas.
- Rutas canónicas del catálogo: 546 antes de agregar eventos/servicios SEO.
- Sitemap local en modo producción: 670 URLs, 27/27 ciudades y 0 rutas `/admin`.
- HTTP local producción: Concepción, Monteros, Aguilares, San Miguel de Tucumán, Famaillá, Burruyacú, Lules, Tafí Viejo, Tafí del Valle, Juan Bautista Alberdi y Simoca: 200.
- Auditoría responsive: 135/135 vistas PASS en 1920, 1440, 1366, 768 y 390 px.
- Flujos de búsqueda/filtros/institución-carrera: 8/8 PASS.
- Errores del servidor local de producción: ninguno.

## Exclusiones deliberadas

- UI y rutas privadas del administrador.
- Auth, perfiles administrativos y bootstrap de SUPERADMIN.
- Migraciones y tests SQL del CMS.
- Scripts administrativos.
- Documentación administrativa y legal pendiente.
- Seeds/reports conceptuales de revisión que no son necesarios para el runtime público.

Los módulos compartidos de lectura/modelado requeridos por el sitio público se incluyen como dependencias seguras. No contienen credenciales ni operaciones administrativas remotas.

## Rollback

El punto anterior verificable es `e4f4da5085612e80c60ecd8843f4b3ecd817c166`. Ante una regresión, restaurar ese commit mediante un commit de reversión normal; no usar force push.

## Migración futura

La transición posterior será controlada:

`VERSIONED PUBLIC CATALOG → IMPORT TO CMS → VALIDATE → SWITCH SOURCE`

No se realizó esa migración en esta publicación.
