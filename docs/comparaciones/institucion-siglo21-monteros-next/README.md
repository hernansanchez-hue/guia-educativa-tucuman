# Validación — Universidad Siglo 21 · Monteros

| Campo | Valor |
| --- | --- |
| Ruta pública | `/monteros/universidad-siglo-21` |
| ID interno | `universidad-siglo-21-monteros` |
| Slug público / ciudad | `universidad-siglo-21` / `monteros` |
| Registro de Concepción | `universidad-siglo-21-concepcion` |
| Plantilla | Institucional compartida, sin cambios de JSX o CSS |

La fuente de verdad es Vite. No existía baseline institucional válida de Monteros; se generó evidencia Next.js con Chrome headless CLI, sin CDP.

| Archivo | Viewport | Dimensiones verificadas | Peso |
| --- | --- | --- | --- |
| `siglo21-monteros-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | 947471 bytes |
| `siglo21-monteros-next-mobile-claro.png` | 390 × 843 | 390 × 843 | 306687 bytes |

La sede conserva los datos canónicos Vite: portada `imageBank.siglo`, logo US21, marquee de cuatro imágenes y tarjetas Abogacía, Contador Público, Lic. en Administración e Higiene y Seguridad, con sus badges y orden canónicos. Claro/oscuro y responsive se heredan sin cambios de la plantilla institucional. Las carreras son únicamente datos resumidos: no existen offerings ni rutas contextuales Monteros.

La matriz HTTP confirmó 200 para ambas sedes públicas de Siglo 21 y las diez rutas de carrera de Concepción. Confirmó 404 para las carreras equivalentes de Monteros y las otras tres instituciones de Monteros. Lint y build finalizaron correctamente.
