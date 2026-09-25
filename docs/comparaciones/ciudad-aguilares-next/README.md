# Validación — Ciudad Aguilares

- Ruta: `/aguilares`.
- Ciudad y slug: Aguilares / `aguilares`.
- Implementación: se reutilizan `app/[ciudad]/page.js`, `CityPageClient.js` y `ciudad.css`; no se creó una página ni CSS específicos.

## Instituciones visibles

| Orden | Institución | ID interno | Slug público | Tipo | Estado de ficha |
| --- | --- | --- | --- | --- | --- |
| 1 | Universidad Siglo 21 | `universidad-siglo-21-aguilares` | `universidad-siglo-21` | Privada | 404 pendiente |
| 2 | Instituto Santa Bárbara | `instituto-santa-barbara-aguilares` | `instituto-santa-barbara` | Terciario Privado | 404 pendiente |
| 3 | Academia Profesional Norte | `academia-profesional-norte-aguilares` | `academia-profesional-norte` | Academia | 404 pendiente |

## Capturas y responsive

| Archivo | Viewport | Tema | Resultado |
| --- | --- | --- | --- |
| `aguilares-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido; hero, slider, filtros, tarjetas y footer presentes. |
| `aguilares-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido; estructura responsive compartida, sin CSS específico. |

El modo claro y oscuro reutilizan el mecanismo compartido de `PublicHeader` y sus estilos globales, sin variantes específicas para Aguilares. La validación funcional confirmó que las tres fichas institucionales y sus rutas contextuales continúan en 404.

## Anomalías canónicas preservadas

- El slider/fallback mantiene `Instituto del Sur` de Monteros como tercera entrada destacada.
- Universidad Siglo 21 conserva la dirección heredada `San Martín 124, Concepción`.
- Instituto Santa Bárbara conserva sus imágenes, textos y datos heredados de Vite.
