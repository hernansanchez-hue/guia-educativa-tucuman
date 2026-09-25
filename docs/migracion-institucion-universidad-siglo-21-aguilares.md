# Auditoría — Universidad Siglo 21 | Aguilares

## Alcance

Documento exclusivamente documental. No habilita la ficha institucional, carreras ni offerings.

## Identidad canónica

| Campo | Valor |
| --- | --- |
| Nombre | Universidad Siglo 21 |
| Ciudad | Aguilares |
| `citySlug` | `aguilares` |
| Slug público futuro | `universidad-siglo-21` |
| ID interno futuro obligatorio | `universidad-siglo-21-aguilares` |
| Tipo | Privada |
| Orden en Aguilares | 1 |
| Ruta futura | `/aguilares/universidad-siglo-21` |

La fuente Vite usa una sola institución con `city: ["Concepción", "Monteros", "Aguilares"]`; el modelo Next debe conservar una sede independiente por ciudad. No se deben reutilizar los IDs `universidad-siglo-21-concepcion` ni `universidad-siglo-21-monteros`.

## Datos literales relevados de Vite

- Logo: `US21`; visible en la ficha; portada `imageBank.siglo`; medio superior: “Video institucional”.
- Slogan: “Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.”
- Descripción: “Educación innovadora, profesional y conectada con el mundo.”
- Dirección heredada: `San Martín 124, Concepción`.
- WhatsApp heredado: `3865 41 2020`.
- Web y horarios: no hay valores separados en la fuente Vite auditada.
- Galería/fallback: `imageBank.siglo`, `imageBank.students`, `imageBank.classroom`, `imageBank.graduation`.

La dirección y el contacto aparentemente heredados deben preservarse; no se corrigen con fuentes externas.

## Comparación literal con otras sedes

| Aspecto | Concepción | Monteros | Aguilares |
| --- | --- | --- | --- |
| Nombre, tipo, logo, portada, marquee, galería, slogan y descripción | Igual | Igual | Igual |
| Dirección y WhatsApp | `San Martín 124, Concepción` / `3865 41 2020` | Igual | Igual; anomalía canónica preservada |
| Slug público | `universidad-siglo-21` | Igual | Igual |
| ID interno | `universidad-siglo-21-concepcion` | `universidad-siglo-21-monteros` | `universidad-siglo-21-aguilares` |

## Carreras visibles, auditoría preliminar

| Orden | Nombre | ID legacy normalizado | Slug previsto | Imagen | Badge |
| --- | --- | --- | --- | --- | --- |
| 1 | Abogacía | `abogacia` | `abogacia` | `imageBank.classroom` | Inscripciones abiertas |
| 2 | Contador Público | `contador-publico` | `contador-publico` | `imageBank.students` | Nueva carrera |
| 3 | Lic. en Administración | `licenciatura-en-administracion` | `lic-en-administracion` | `imageBank.design` | Próximo ingreso |
| 4 | Higiene y Seguridad | `higiene-y-seguridad` | `higiene-y-seguridad` | `imageBank.lab` | Inscripciones abiertas |

La primera carrera futura es **Abogacía**, slug previsto `abogacia`. El career master conceptualmente equivalente ya existe; cualquier offering de Aguilares deberá auditarse e implementarse en una etapa separada.

## Plantilla y riesgos

La futura ficha puede reutilizar íntegramente `InstitutionPageClient.js`, la ruta dinámica `/[ciudad]/[institucion]` y el CSS institucional existente. Antes de habilitarla, será necesario agregar sólo su parámetro estático y verificar el aislamiento de las tres sedes con mismo slug público.

Riesgos visuales: no reemplazar las imágenes compartidas; preservar el marquee, la portada, la galería y los datos heredados; no transformar la anomalía de dirección en una corrección editorial.
