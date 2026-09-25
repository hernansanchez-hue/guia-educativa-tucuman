# Auditoría — Contador Público | Universidad Siglo 21 | Aguilares

## Alcance

Auditoría exclusivamente documental. No implementa Contador Público ni habilita su ruta.

## Identidad

| Campo | Valor |
| --- | --- |
| Carrera | Contador Público |
| `careerId` | `contador-publico` |
| Career master | Ya existe; coincide conceptualmente con Vite |
| Institución futura | `universidad-siglo-21-aguilares` |
| Ciudad | `aguilares` |
| Offering futura | `universidad-siglo-21-aguilares-contador-publico` |
| Ruta futura | `/aguilares/universidad-siglo-21/carreras/contador-publico` |
| Mapping | No requerido |

## Datos de Vite para la offering futura

| Dato | Valor |
| --- | --- |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Contador Público |
| Sede | San Martín 124, Concepción (dato heredado) |
| Turnos | Consultar |
| Validez | Sí |
| Imagen | `imageBank.students` |
| Badge | Nueva carrera |
| Visible | Sí |
| Orden | 2 |
| Formulario | Simulado, habilitado |
| WhatsApp propio | No |
| Fallback | Institucional `3865 41 2020` |

Estos valores coinciden canónicamente con Concepción y Monteros porque Vite parte de la misma entrada institucional; la offering de Aguilares deberá ser independiente y no reutilizar esas dos offerings.

## Plantilla y orden

La futura ficha puede reutilizar `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y fallback de WhatsApp, sin cambios estructurales. La tercera carrera visible de la sede es **Lic. en Administración**, con slug público previsto `lic-en-administracion`; el career master existente es `lic-en-administracion` y no debe duplicarse.

## Riesgos

- Mantener la imagen, badge, orden y dirección heredada exactamente como Vite.
- No habilitar Contador Público hasta crear su offering aislada y su parámetro estático.
- Impedir que offerings de Concepción o Monteros validen rutas bajo Aguilares.
