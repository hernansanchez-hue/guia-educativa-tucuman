# Piloto de carrera: Abogacía Concepción — Supabase v1

## Alcance

- Ruta piloto: `/concepcion/universidad-siglo-21/carreras/abogacia`.
- Ciudad: Concepción (`concepcion`).
- Institución: Universidad Siglo 21 (`universidad-siglo-21-concepcion`).
- Career master: Abogacía (`abogacia`).
- Academic offering: `universidad-siglo-21-concepcion-abogacia`.

Antes del piloto, esta ficha se componía exclusivamente desde `careers.js`, `institutions.js` y `offerings.js`. La capa reutilizable `lib/public-catalog/career-page-catalog.js` conserva ese adaptador local y añade el adaptador público de Supabase. La página usa éste únicamente cuando la ruta corresponde al piloto; las restantes 29 carreras académicas siguen locales, igual que las tres capacitaciones individuales.

## Contrato de datos

`PUBLIC_CATALOG_SOURCE` selecciona `local` por defecto o `supabase` de forma explícita. En modo Supabase no hay fallback silencioso a `careers.js` ni a `offerings.js`: ciudad, institución, career master y academic offering proceden de las tablas públicas remotas. Los UUID internos se convierten a `legacy_key` antes de llegar al cliente; los slugs públicos se preservan.

El shape compartido incluye los campos generales del master (nombre, descripción, perfil, campo laboral, plan, requisitos y FAQ) y los contextuales de la offering (modalidad, duración, título, sede cuando exista, turnos, validez, imagen, badge, WhatsApp y formulario). La preparación del alias `licenciatura-en-administracion` → `lic-en-administracion` queda encapsulada en la capa y no altera la ruta piloto.

## Validación real

La comparación local contra Supabase para Abogacía devolvió:

- Field mismatches: 0.
- Missing: 0.
- Unexpected: 0.
- Plan, requisitos, FAQ, perfil, campo laboral, modalidad, duración, título, imagen, enlaces y metadatos consumidos: equivalentes.
- HTTP local: 200.
- HTTP Supabase: 200.

Microsoft Edge generó cuatro capturas temporales no versionadas de la misma ruta: local/Supabase en 1440 × 900 y 390 × 843. El texto, viewport, geometría y responsive coincidieron; en móvil no hubo overflow horizontal. No se detectaron diferencias visuales significativas; sólo se admite la variación física normal de rasterizado.

## Regresiones y validaciones

- Home, `/ciudades`, las tres páginas de ciudad y las diez fichas institucionales respondieron 200 en modo local.
- Una carrera académica ajena al piloto y una capacitación individual respondieron 200, confirmando que continúan locales.
- Tests: 45/45 correctos, incluido `career-page-catalog.test.mjs`.
- Lint: correcto.
- Build local: correcto, 50 páginas generadas.
- Build Supabase: correcto, 50 páginas generadas.
- La advertencia conocida de múltiples lockfiles se mantuvo sin cambios de configuración.
- `CareerPageClient.js`, `carrera.css`, Vite y Supabase remoto permanecieron intactos.

## Conclusión

**PILOTO CARRERA ABOGACÍA VALIDADO.**

Las capturas no se versionan y no se almacenaron credenciales en archivos.
