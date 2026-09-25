# Auditoría — Ciudad Aguilares

## Identidad y vista Vite

- Nombre canónico: Aguilares; slug público futuro: `aguilares`.
- La SPA Vite abre la misma vista `cityPage` mediante `showCity("Aguilares")`: título “Instituciones de Aguilares”, buscador institucional, filtros, slider destacado, tarjetas, footer, navegación móvil y tema claro/oscuro compartidos.
- El listado se obtiene con `institutions.filter(inst => inst.city.includes(currentCity))`; conserva el orden del arreglo fuente. Desktop y móvil usan la misma estructura CSS responsive de ciudad.

## Instituciones visibles, en orden Vite

| Orden | Nombre | ID legacy | Slug | ID futuro | Tipo | Imagen | Badge de tarjeta | Ofertas resumidas | Dominio | Ficha Vite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Universidad Siglo 21 | `universidad-siglo-21-<aleatorio>` | `universidad-siglo-21` | `universidad-siglo-21-aguilares` | Privada | `imageBank.siglo` | Privada | Abogacía; Contador Público; Lic. en Administración; Higiene y Seguridad | carrera | Sí |
| 2 | Instituto Santa Bárbara | `instituto-santa-barbara-<aleatorio>` | `instituto-santa-barbara` | `instituto-santa-barbara-aguilares` | Terciario Privado | `imageBank.santa` | Terciario Privado | Instrumentación Quirúrgica; Laboratorio de Análisis Clínicos; Diagnóstico por Imágenes | carrera | Sí |
| 3 | Academia Profesional Norte | `academia-profesional-norte-<aleatorio>` | `academia-profesional-norte` | `academia-profesional-norte-aguilares` | Academia | `imageBank.design` | Academia | Diseño Gráfico; Community Manager; Ventas Digitales | capacitación/otro según la heurística Vite de Academia | Sí |

Los IDs legacy son aleatorios porque `normalizeInstitution()` deriva las carreras y `normalizeCareer()` usa el slug más un sufijo aleatorio; los IDs futuros deben ser sedes independientes. Universidad Siglo 21 e Instituto Santa Bárbara aparecen también en otras ciudades, pero la futura migración deberá tratarlas como sede independiente de Aguilares.

## Slider, filtros y anomalías canónicas

El slider prioriza instituciones Premium locales y después agrega `otherPremium` de otras ciudades, antes de un fallback privado. Por ello puede exhibir una institución destacada ajena a Aguilares: anomalía canónica que debe preservarse. Las tarjetas sí quedan filtradas sólo por `inst.city.includes("Aguilares")`.

La fuente contiene direcciones heredadas que no deben corregirse con datos externos: Universidad Siglo 21 muestra `San Martín 124, Concepción`; Centro de Formación Tucumán no es tarjeta de Aguilares aunque figura en datos para la ciudad; Instituto Santa Bárbara comparte su entrada fuente con Concepción. Imágenes y ofertas se reutilizan entre sedes según el arreglo Vite.

## Reutilización futura

Aguilares puede reutilizar íntegramente `app/[ciudad]/page.js`, `CityPageClient.js` y el CSS compartido. La migración posterior requiere datos de ciudad, tres IDs de sede y un `generateStaticParams` temporal; no se detecta una diferencia estructural.

## Primera institución futura

La primera institución visible es Universidad Siglo 21: slug `universidad-siglo-21`, tipo Privada, orden 1 e ID futuro previsto `universidad-siglo-21-aguilares`. Aunque existe en Concepción y Monteros, debe auditarse como sede independiente antes de implementar.
