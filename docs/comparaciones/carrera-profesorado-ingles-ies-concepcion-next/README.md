# Validación — Profesorado de Inglés · IES Concepción

| Campo | Valor |
| --- | --- |
| Ruta | `/concepcion/ies-concepcion/carreras/profesorado-ingles` |
| Carrera maestra / offering | `profesorado-ingles` / `ies-concepcion-concepcion-profesorado-ingles` |
| Imagen / badge | `imageBank.fair` / Próximo ingreso |
| Modalidad / duración / título | Presencial / 3 años / Profesorado de Inglés |
| WhatsApp | Sin número propio; fallback IES `3865 50 3300` |

Capturas Next.js con Chrome headless CLI, sin CDP y contra producción:

| Archivo | Viewport | Dimensiones verificadas | Peso |
| --- | --- | --- | --- |
| `profesorado-ingles-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | 367223 bytes |
| `profesorado-ingles-next-mobile-claro.png` | 390 × 843 | 390 × 843 | 218758 bytes |

La ficha reutiliza íntegramente el DOM, CSS responsive, formulario, tabs, FAQ, sidebar, footer, WhatsApp y `localStorage.guiaEducativaLeads` ya validados. `CareerPageClient.js` y `carrera.css` permanecen intactos. La matriz HTTP confirmó 200 para las diez carreras contextuales de Concepción y 404 para slugs y combinaciones inválidos. `npm run lint` y `npm run build` finalizaron correctamente; la advertencia conocida de lockfiles múltiples no se modificó.
