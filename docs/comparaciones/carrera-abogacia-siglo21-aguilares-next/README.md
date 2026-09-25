# Validación — Abogacía | Universidad Siglo 21 | Aguilares

| Campo | Valor |
| --- | --- |
| Career master | Reutilizada: `abogacia` |
| Offering | `universidad-siglo-21-aguilares-abogacia` |
| Institución | `universidad-siglo-21-aguilares` |
| Ciudad | `aguilares` |
| Ruta | `/aguilares/universidad-siglo-21/carreras/abogacia` |

La offering es independiente de Concepción y Monteros, aunque reproduce los mismos valores canónicos Vite: Presencial, 3 años, título Abogacía, `imageBank.classroom`, “Inscripciones abiertas”, orden 1 y fallback institucional de WhatsApp `3865 41 2020`.

`CareerPageClient.js` y `carrera.css` permanecen intactos. Se reutilizan el formulario simulado, tabs, FAQ, sidebar, footer y fallback de WhatsApp. El formulario conserva su contrato académico y persiste leads simulados en `localStorage.guiaEducativaLeads` mediante el cliente compartido.

| Archivo | Viewport | Tema | Resultado |
| --- | --- | --- | --- |
| `abogacia-aguilares-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido; hero, hechos, tabs, sidebar y footer. |
| `abogacia-aguilares-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido; responsive compartido. |

El mecanismo claro/oscuro es compartido y persistido en `localStorage.guiaEducativaTheme`; no se agregaron estilos por sede. La matriz HTTP confirmó 200 en Abogacía de Aguilares, Concepción y Monteros, y 404 en las otras tres carreras de Siglo 21 Aguilares.
