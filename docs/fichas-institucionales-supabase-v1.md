# Fichas institucionales — Supabase v1

Fecha de validación: 2026-08-21.

## Alcance

La ruta institucional dinámica usa `getInstitutionPageCatalog(ciudad, institucion)` para las diez fichas publicadas. La fuente predeterminada sigue siendo local; con `PUBLIC_CATALOG_SOURCE=supabase`, la adaptación remota conserva la misma forma visual. Los resúmenes de carreras y capacitaciones siguen siendo locales: esta etapa no consume `academic_offerings` ni `training_offerings` para renderizarlos.

| Ciudad | Institución | Slug | legacy_key | Resumen local preservado |
| --- | --- | --- | --- | --- |
| Concepción | Universidad Siglo 21 | universidad-siglo-21 | universidad-siglo-21-concepcion | 4 carreras |
| Concepción | Instituto Santa Bárbara | instituto-santa-barbara | instituto-santa-barbara-concepcion | 3 carreras |
| Concepción | IES Concepción | ies-concepcion | ies-concepcion-concepcion | 3 carreras |
| Monteros | Universidad Siglo 21 | universidad-siglo-21 | universidad-siglo-21-monteros | 4 carreras |
| Monteros | Instituto del Sur | instituto-del-sur | instituto-del-sur-monteros | 3 carreras |
| Monteros | Centro de Formación Tucumán | centro-de-formacion-tucuman | centro-de-formacion-tucuman-monteros | 3 capacitaciones locales |
| Monteros | Instituto San Miguel | instituto-san-miguel | instituto-san-miguel-monteros | 3 carreras |
| Aguilares | Universidad Siglo 21 | universidad-siglo-21 | universidad-siglo-21-aguilares | 4 carreras |
| Aguilares | Instituto Santa Bárbara | instituto-santa-barbara | instituto-santa-barbara-aguilares | 3 carreras |
| Aguilares | Academia Profesional Norte | academia-profesional-norte | academia-profesional-norte-aguilares | 3 ofertas académicas locales; 0 capacitaciones visuales remotas |

La matriz de pruebas valida para las diez rutas: forma local/remota equivalente, `legacy_key` visible como ID, UUID remoto no expuesto, `citySlug`, slug, campos institucionales, y orden de los resúmenes. También cubre las tres sedes de Siglo 21, las dos de Santa Bárbara, las tres capacitaciones de CFT y las tres ofertas de Academia.

## Validación remota y HTTP

La consulta real a las tablas públicas `cities` e `institutions` de Supabase devolvió las diez fichas y la comparación recursiva local/remota produjo **field mismatches = 0**. Las diez rutas devolvieron HTTP 200 tanto con fuente local como con fuente Supabase.

## Capturas Edge

Las doce capturas están en `docs/comparaciones/fichas-institucionales-supabase-v1/`: tres fichas representativas, cada una en fuente local/Supabase, escritorio y móvil.

| Ficha | Escenarios | Viewport CSS verificado | Estado visual |
| --- | --- | --- | --- |
| Santa Bárbara Aguilares | local/Supabase, desktop/mobile | 1440×900 y 390×843 | Equivalente |
| Centro de Formación Tucumán Monteros | local/Supabase, desktop/mobile | 1440×900 y 390×843 | Equivalente |
| Academia Profesional Norte Aguilares | local/Supabase, desktop/mobile | 1440×900 y 390×843 | Equivalente |

Antes de cada captura se verificaron `window.innerWidth`, `window.innerHeight`, `scrollY = 0`, `document.documentElement.scrollWidth` y los títulos de las tres tarjetas. No hubo overflow horizontal: escritorio informó 1425 px dentro de 1440 px y móvil 375 px dentro de 390 px.

Las capturas JPEG se guardaron sin reescalarlas. La extensión de Edge exportó rasteres con dimensiones físicas variables (por ejemplo, 1425×891, 1424×900, 375×810 o 375×843) aunque el viewport CSS sí fue exactamente el solicitado; es una particularidad del canal de captura de Edge, no una diferencia del DOM/CSS. Las comparaciones visuales se realizaron sobre la misma posición superior y los mismos textos, tarjetas, geometría CSS y ausencia de overflow. Las diferencias de bytes corresponden al rasterizado/carga de recursos dinámicos y no implican una diferencia estructural.

## Validaciones finales

- `node --test tests/*.test.mjs`: 41 pruebas aprobadas.
- `npm run lint`: correcto.
- `npm run build` local: correcto, 50 páginas generadas.
- `npm run build` con Supabase: correcto, 50 páginas generadas.
- `git diff --check`: pendiente de ejecutar inmediatamente antes del commit.

No se modificaron la demo Vite, CSS, dependencias, archivos de paquete ni lockfiles. La advertencia conocida de dos lockfiles de Next.js continúa, sin ocultarla mediante configuración.
