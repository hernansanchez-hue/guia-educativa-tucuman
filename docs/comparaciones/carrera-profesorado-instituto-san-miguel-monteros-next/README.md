# Validación — Profesorado | Instituto San Miguel | Monteros

## Contexto implementado

- Career master nueva: `profesorado`.
- No reutiliza `profesorado-educacion-primaria` ni `profesorado-ingles`: son entidades académicas distintas en la demo Vite, con nombre, título y descripción propios.
- `institutionId`: `instituto-san-miguel-monteros`.
- `citySlug`: `monteros`.
- Offering: `instituto-san-miguel-monteros-profesorado`.
- Ruta: `/monteros/instituto-san-miguel/carreras/profesorado`.

## Datos auditados

Profesorado conserva la descripción **Formación pedagógica con prácticas y acompañamiento.** La offering es presencial, dura 3 años, otorga el título Profesorado, tiene turnos a consultar, validez Sí, badge Inscripciones abiertas, imagen `imageBank.classroom`, formulario habilitado y orden 1. La sede se resuelve con el fallback institucional `Laprida 660, Monteros`.

No existe WhatsApp propio de la offering. Se reutiliza el fallback institucional `3863 47 6400`, normalizado por el componente a `543863476400`, con el mensaje contextual de Profesorado.

## Capturas y responsive

| Archivo | Tema | Viewport | Dimensiones reales | SHA-256 |
| --- | --- | --- | --- | --- |
| `profesorado-next-desktop-claro.png` | Claro | 1440 × 900 | 1440 × 900 | `1A0243C8497A838F9DED0439B644EB7EAE740C59AC97AA8E4FA09635C61ED971` |
| `profesorado-next-mobile-claro.png` | Claro | 390 × 843 | 390 × 843 | `31B107843B8AEA2DC0716BE344F12901C60E73A61AF9299C0A06D1009D1F824F` |

Las capturas se obtuvieron mediante Chrome headless CLI, sin CDP. La página reutiliza la plantilla responsive de carreras sin modificar DOM, clases ni CSS. El modo oscuro continúa a cargo del mecanismo compartido de tema; no se introdujo ninguna variante visual específica para Profesorado.

## Validaciones

- HTTP 200: ruta canónica de Profesorado.
- HTTP 404: las otras dos carreras de Instituto San Miguel, la variante `/capacitaciones/profesorado`, Profesorado bajo instituciones ajenas y Profesorado en Concepción.
- El formulario es el contrato académico existente: campos de nombre, teléfono, email, turno y consulta; guarda el lead en `localStorage.guiaEducativaLeads` con `career: "Profesorado"` y ejecuta `form.reset()`.
- `CareerPageClient.js` y `carrera.css` permanecen intactos.
- `npm run lint` y `npm run build` finalizaron correctamente.
