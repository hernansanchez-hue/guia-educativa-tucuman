# Auditoría — Abogacía | Universidad Siglo 21 | Aguilares

## Alcance

Documento exclusivamente documental. No implementa Abogacía, no crea offering y no habilita rutas de carrera.

## Identidad y relación

| Campo | Valor |
| --- | --- |
| Carrera | Abogacía |
| `careerId` | `abogacia` |
| Career master | Ya existe y es conceptualmente equivalente |
| Institución futura | `universidad-siglo-21-aguilares` |
| Ciudad | `aguilares` |
| Offering ID previsto | `universidad-siglo-21-aguilares-abogacia` |
| Ruta futura | `/aguilares/universidad-siglo-21/carreras/abogacia` |

En Vite la carrera se deriva de la misma entrada institucional visible en Aguilares. Su ID legacy se normaliza dinámicamente con el prefijo `abogacia-`; el modelo definitivo debe reutilizar el master estable `abogacia`.

## Datos Vite auditados

| Dato de futura offering | Valor canónico |
| --- | --- |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Abogacía |
| Sede | San Martín 124, Concepción (dato heredado) |
| Turnos | Consultar |
| Validez | Sí |
| Imagen | `imageBank.classroom` |
| Badge | Inscripciones abiertas |
| Visible | Sí |
| Orden | 1 |
| Formulario | Simulado, habilitado |
| WhatsApp propio | No |
| Fallback WhatsApp | Institucional `3865 41 2020` |

Los valores coinciden con las offerings ya migradas de Abogacía para Concepción y Monteros porque Vite usa la misma fuente compartida. Deben comprobarse por pertenencia de offering, no reutilizando esas offerings.

## Contenido y plantilla

La descripción canónica es: “Formación jurídica con modalidad flexible y acompañamiento tutorial.” El master existente contiene perfil, campo laboral, plan, requisitos y FAQ compatibles con Vite.

La futura ficha reutiliza sin cambios estructurales `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y fallback de WhatsApp. El mapping adicional no es requerido: el slug público y `careerId` son `abogacia`.

## Orden posterior

La segunda carrera visible después de Abogacía es **Contador Público**. No se audita en profundidad en esta etapa.

## Riesgos

- Preservar la sede heredada de Concepción y el fallback institucional, sin corregirlos.
- No permitir que offers de Concepción o Monteros validen rutas bajo Aguilares.
- Conservar el orden, imagen y badge de la tarjeta antes de habilitar la ruta contextual.
