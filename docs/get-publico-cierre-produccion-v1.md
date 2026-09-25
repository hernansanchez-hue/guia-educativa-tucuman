# Cierre de producción de GET público V1

Fecha de cierre técnico: 22 de agosto de 2026.

## 1. Alcance

GET público V1 queda compuesto por la portada, selector y páginas de ciudades, fichas institucionales, fichas académicas contextuales, capacitaciones contextuales, Cursos Docentes, Nosotros, Contacto y una respuesta 404 pública. La demo Vite permanece como fuente visual canónica y no fue modificada en este cierre.

No se incorporaron funcionalidades nuevas, datos canónicos, cambios de CSS existentes, cambios de dependencias, deploy, DNS ni mutaciones en Supabase.

## 2. Matriz final de rutas

| Ruta | Tipo | Fuente | Render | ISR | SEO | Sitemap | Estado |
|---|---|---|---|---:|---|---|---|
| `/` | portada | local/Supabase | estática | 60 s | global + propia | sí | 200 |
| `/ciudades` | catálogo | local/Supabase | estática | 60 s | propia | sí | 200 |
| `/[ciudad]` | catálogo contextual | local/Supabase | dinámica con params iniciales | 60 s | dinámica | sí | 3/3 en 200 |
| `/[ciudad]/[institucion]` | ficha contextual | local/Supabase | dinámica con params iniciales | 60 s | dinámica | sí | 10/10 en 200 |
| `/[ciudad]/[institucion]/carreras/[carrera]` | ficha académica | local/Supabase | dinámica con params iniciales | 60 s | dinámica | sí | 30/30 en 200 |
| `/[ciudad]/[institucion]/capacitaciones/[capacitacion]` | ficha de capacitación | local/Supabase | dinámica con params iniciales | 60 s | dinámica | sí | 3/3 en 200 |
| `/cursos-docentes` | catálogo | local/Supabase | estática | 60 s | propia | sí | 200 |
| `/nosotros` | editorial | local | estática | no requiere | propia | sí | 200 |
| `/contacto` | editorial | local | estática | no requiere | propia | sí | 200 |
| `/_not-found` | error público | local | estática | no requiere | hereda identidad | no | 404 efectivo |
| `/robots.txt` | SEO técnico | local | estática | no requiere | n/a | n/a | 200 |
| `/sitemap.xml` | SEO técnico | local/Supabase | estática regenerable | 60 s | n/a | n/a | 200 |

La compilación genera 56 páginas/artefactos estáticos de Next; el sitemap público contiene 51 URLs canónicas únicas: 5 estáticas, 3 ciudades, 10 instituciones, 30 carreras y 3 capacitaciones.

## 3. Rutas deliberadamente inexistentes

Quedan fuera de GET público V1 y responden 404:

- `/eventos`: requiere arquitectura funcional propia futura.
- `/admin`: pertenece a Auth y Centro de Control.
- `/carreras` y `/carreras/[slug]`: no existen en la demo canónica.
- `/cursos-docentes/[slug]`: Vite no posee detalle canónico.
- Auth, Centro de Control y Leads: pertenecen a una macroetapa privada futura.

Estas ausencias son decisiones de alcance, no defectos del cierre público.

## 4. Configuración de producción

- Next.js 16.2.12, React 19.2.4 y App Router.
- `next.config.mjs` conserva configuración mínima, output por defecto, sin configuración adicional de imágenes ni headers.
- `html lang="es"`, viewport `device-width` y escala inicial 1.
- Favicon y assets existentes preservados.
- Fuente por defecto: `PUBLIC_CATALOG_SOURCE=local`, necesaria para desarrollo y tests.
- Producción debe definir `PUBLIC_CATALOG_SOURCE=supabase`, `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` en el entorno de despliegue.
- No existe ni se creó `.env` o `.env.example`; no se versionaron credenciales.
- Dominio canónico previsto: `https://guiaeducativatuc.com.ar`. No se modificó DNS ni se desplegó.

## 5. Arquitectura Supabase y catálogo dinámico

El catálogo público usa lectores server-side y la API pública de Supabase con `apikey` publicable, sin `Authorization` privada ni service role. El modo Supabase fue verificado contra:

- 3 ciudades;
- 10 instituciones;
- 19 carreras maestras;
- 30 ofertas académicas;
- 3 programas de capacitación;
- 3 ofertas de capacitación;
- 10 Cursos Docentes.

La comparación estructural final del catálogo dio 68/68 registros equivalentes, 0 diferencias de campos, 0 faltantes locales, 0 faltantes remotos y 0 registros remotos inesperados. Cursos Docentes dio 10/10 y equivalencia completa.

Las rutas, tarjetas institucionales y sitemap se construyen desde slugs públicos y relaciones reales. No existen allowlists por institución, carrera piloto o capacitación piloto. `generateStaticParams` conserva únicamente semillas iniciales de build; `dynamicParams` permanece habilitado por defecto. Una nueva fila activa, visible y publicada entra bajo su slug sin mapping específico.

## 6. ISR y altas futuras

- Lecturas del catálogo Supabase: `next.revalidate = 60`.
- Cursos Docentes: `next.revalidate = 60`.
- Home y selector de ciudades: revalidación de 60 segundos cuando la fuente es Supabase.
- Ciudad, institución, carrera y capacitación: `revalidate = 60`.
- Sitemap: `revalidate = 60`.
- Metadata dinámica usa los mismos lectores y la misma política de caché.
- No se agregó `force-dynamic` ni `no-store`.

Resultado: altas y modificaciones publicadas pueden aparecer después del TTL sin editar código y sin un nuevo deploy, siempre que respeten las relaciones y slugs públicos del esquema aprobado.

## 7. Metadata, canonical y Open Graph

La metadata global define `metadataBase`, título por defecto, template de título, descripción institucional real y Open Graph básico con `siteName`, `es_AR`, tipo `website` y URL pública.

Cada familia pública tiene metadata propia:

- Home y Ciudades usan identidad y copy existentes.
- Ciudad usa el título y nombre reales de la ciudad.
- Institución usa institución y ciudad, con descripción e imagen existentes.
- Carrera usa carrera, institución y ciudad, con descripción e imagen contextuales.
- Capacitación usa programa, institución y ciudad, con descripción e imagen contextuales.
- Cursos Docentes, Nosotros y Contacto usan sus textos editoriales canónicos.

Las rutas inexistentes conservan `notFound()` y no reciben metadata inventada. Los canonical se forman exclusivamente con slugs públicos, nunca con UUID. Las nueve familias representativas expusieron título, canonical y Open Graph correctos; la página 404 deliberadamente no se declara canónica.

## 8. Sitemap y robots

`app/sitemap.js` genera 51 URLs canónicas únicas y, en producción, lee el catálogo Supabase con ISR de 60 segundos. No incluye Eventos, Admin, índices globales de carreras ni detalles inexistentes de Cursos Docentes. La comparación local/Supabase del sitemap fue 51/51, sin rutas faltantes, extras ni UUID.

`app/robots.js` permite indexación pública y referencia `https://guiaeducativatuc.com.ar/sitemap.xml`. `/sitemap.xml` y `/robots.txt` respondieron HTTP 200.

## 9. Página 404

Vite no tenía una vista 404 pública canónica. Se creó una pantalla mínima con el header y footer compartidos, texto sobrio “Página no encontrada” y acción “Volver al inicio”, sin Supabase ni rediseño de páginas existentes.

Se confirmó HTTP 404 en ciudad, institución, carrera y capacitación inexistentes, ruta general inexistente y rutas deliberadamente excluidas.

## 10. Navegación final

La portada navega de forma genérica a las tres ciudades. Las páginas de ciudad navegan a las diez instituciones, incluyendo los CTAs del slider. Las 33 tarjetas institucionales usan su ruta canónica derivada: 30 carreras y 3 capacitaciones.

El header, menú móvil, footer y navegación contextual fueron revisados. Las referencias visuales canónicas a Eventos continúan deliberadamente no navegables mientras `/eventos` no existe; no se creó un link roto. Login tampoco se expuso como ruta pública. Se comprobaron 11 enlaces HTML internos y ninguno respondió con error.

## 11. Seguridad pública

- Búsqueda de secretos: 0 service role, 0 claves secretas, 0 credenciales hardcodeadas y 0 `.env` versionados.
- El bundle público no recibe claves como texto visible; los readers permanecen en la frontera server-side.
- API pública: sólo GET con publishable key.
- RLS está activo en las siete tablas públicas auditadas.
- `anon` y `authenticated` poseen únicamente `SELECT`; no existen grants públicos de INSERT, UPDATE o DELETE.
- Las siete políticas públicas auditadas son exclusivamente `SELECT` y filtran registros activos/publicados.
- Advisor de seguridad Supabase: 0 hallazgos.
- Advisor de rendimiento: 1 aviso informativo por un índice aún no utilizado, sin impacto funcional ni cambio autorizado.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades.
- Matriz HTML: 0 UUID internos expuestos.
- Supabase remoto no fue modificado.

Aviso informativo de rendimiento: [Supabase Database Linter — unused index](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

## 12. SEO técnico

Se validaron títulos, descripciones, canonical, Open Graph, `lang=es`, URLs legibles, sitemap, robots, 0 imágenes sin atributo `alt`, 0 UUID y 0 enlaces internos rotos.

La jerarquía canónica usa un H1 en las fichas y páginas principales. Ciudad y Contacto conservan sus H2 visibles originales de Vite; no se cambió markup ni copy únicamente para forzar un H1 y romper fidelidad canónica. Esta decisión no bloquea la indexación técnica.

## 13. Responsive, tema y Edge

Microsoft Edge validó las diez familias: Home, Ciudades, ciudad, institución, carrera, capacitación, Cursos Docentes, Nosotros, Contacto y 404.

- Desktop real: 1440 × 900.
- Mobile real: `window.innerWidth = 390`, `window.innerHeight = 843`.
- Sin overflow horizontal en 10/10 familias desktop y 10/10 mobile.
- Menú móvil abierto y funcional en la página de ciudad.
- Dark mode correcto en todas las familias con control compartido.
- Home y Ciudades respetan el tema persistido por el mecanismo compartido, sin agregar un control visual ajeno a la demo.
- Cards, filtros, formularios, imágenes, textos y footer se mantuvieron responsivos.
- Consola Edge: 0 errores.
- Las capturas de comprobación no se versionaron.

## 14. Regresión y matriz HTTP

- 51/51 URLs del sitemap en modo Supabase: HTTP 200.
- 9/9 rutas inválidas representativas: HTTP 404.
- `/sitemap.xml`: HTTP 200, 51 URLs únicas.
- `/robots.txt`: HTTP 200 y sitemap correcto.
- 9 familias SEO representativas verificadas.
- 51 páginas inspeccionadas: 0 imágenes sin `alt`, 0 UUID y 0 enlaces internos rotos.
- Navegación genérica Edge comprobada desde Ciudades a Monteros, de Monteros a Centro de Formación Tucumán y desde su tarjeta a Auxiliar Administrativo.

## 15. Tests, lint y builds

- Tests completos: 99/99 aprobados.
- La matriz nueva prueba 51 URLs, exclusiones V1, ausencia de UUID, altas futuras sin mappings, filtros de publicación, canonical y Open Graph.
- Lint: 0 errores, 5 warnings conocidos de `<img>` canónicos en Cursos Docentes y Nosotros.
- Build local: correcto, 56 páginas/artefactos estáticos generados.
- Build Supabase: correcto, 56 páginas/artefactos estáticos generados.
- El warning conocido de dos lockfiles permanece documentado y no se ocultó con cambios de configuración.
- Los tests Node directos conservan el warning conocido de módulos sin `type: module`; no se cambió `package.json`.
- `git diff --check`: correcto.

## 16. Estado de las fuentes y pendientes

Las fuentes locales permanecen disponibles para desarrollo y tests. La demo Vite, sus datos canónicos, paquetes, lockfiles y Supabase remoto permanecen intactos.

Pendientes deliberados fuera de V1:

- Eventos y su arquitectura propia.
- Auth.
- Centro de Control privado.
- Leads e integraciones privadas.
- Deploy y configuración DNS/entorno en la plataforma productiva.

## 17. Dictamen

**A. GET PÚBLICO V1 CERRADO Y LISTO PARA PRODUCCIÓN.**

GET público terminado.

La próxima macroetapa sugerida, no ejecutada en este cierre, es **Auth + Centro de Control**.
