# Auditoría — Lic. en Administración · Universidad Siglo 21 · Monteros

## Alcance

Esta es una auditoría documental exclusiva. No habilita offering, ruta ni navegación
contextual para la tercera carrera visible de Universidad Siglo 21 Monteros.

## Identidad canónica comprobada

Vite muestra como tercera tarjeta de Universidad Siglo 21 el texto «Lic. en
Administración», con la descripción «Gestión, liderazgo y estrategia para
organizaciones actuales.». La normalización visual conservada en
`next-app/app/data/institutions.js` confirma que tanto Concepción como Monteros
usan el mismo ID histórico de tarjeta y el mismo orden.

| Campo | Valor auditado |
| --- | --- |
| Nombre visible | Lic. en Administración |
| ID histórico de tarjeta | `licenciatura-en-administracion` |
| Slug histórico de tarjeta | `licenciatura-en-administracion` |
| Carrera maestra reutilizable | `lic-en-administracion` |
| Slug futuro de ruta | `lic-en-administracion` |
| Ciudad | `monteros` |
| Institución interna | `universidad-siglo-21-monteros` |
| Imagen | `imageBank.design` |
| URL de imagen | `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80` |
| Badge | Próximo ingreso |
| Orden | 3 |

## Mapping obligatorio

Sí, se requiere mapping explícito. El ID y slug de la tarjeta no coinciden con la
carrera maestra ni con la URL contextual canónica:

`licenciatura-en-administracion` → `lic-en-administracion`

Monteros reproduce exactamente la diferencia histórica ya resuelta en Concepción.
No se debe crear una carrera maestra `licenciatura-en-administracion` ni una
variante específica de Monteros.

## Futura offering independiente

La próxima etapa deberá crear una offering exclusiva de Monteros, separada de la
offering existente de Concepción:

| Campo | Valor previsto desde la auditoría |
| --- | --- |
| ID | `universidad-siglo-21-monteros-lic-en-administracion` |
| `institutionId` | `universidad-siglo-21-monteros` |
| `citySlug` | `monteros` |
| `careerId` | `lic-en-administracion` |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Lic. en Administración |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.design` / URL auditada anterior |
| Badge | Próximo ingreso |
| Formulario | Habilitado |
| Visible | Sí |
| Orden | 3 |
| WhatsApp propio | No |
| Fallback institucional | `3865 41 2020` |

La dirección canónica que Vite conserva para el objeto compartido de Siglo 21 es
«San Martín 124, Concepción». Es una inconsistencia de origen: debe mantenerse como
dato compartido hasta una futura decisión de datos, sin convertirla en información
inventada para la offering de Monteros.

## Ruta y navegación futuras

- Ruta contextual exacta: `/monteros/universidad-siglo-21/carreras/lic-en-administracion`.
- La ruta debe resolver `citySlug: monteros`, el slug público
  `universidad-siglo-21`, el ID interno `universidad-siglo-21-monteros` y el
  `careerId: lic-en-administracion`.
- La tarjeta histórica `licenciatura-en-administracion` debe conectarse mediante el
  mapping explícito anterior; no debe construirse su URL usando el slug histórico.
- Higiene y Seguridad Monteros debe seguir sin ruta al concluir la futura etapa.

## Reutilización y riesgos

La carrera maestra `lic-en-administracion` existente contiene los textos generales,
perfil, campo laboral, plan, requisitos y FAQ. `CareerPageClient.js`, `carrera.css`,
formulario simulado con `localStorage.guiaEducativaLeads`, tabs, sidebar y fallback
de WhatsApp son reutilizables sin cambios. La normalización de fallback esperada es
`543865412020` con mensaje contextual de Lic. en Administración.

Riesgos principales: confundir la identidad de tarjeta con `careerId`, habilitar la
URL histórica incorrecta, mezclar la offering de Concepción
`universidad-siglo-21-concepcion-lic-en-administracion`, o habilitar Higiene en
Monteros de forma involuntaria.

## Archivos previstos para la futura implementación

- `next-app/app/data/offerings.js`
- `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`
- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`

No se prevén cambios en `careers.js`, `CareerPageClient.js`, `carrera.css`, Vite,
baseline, dependencias ni lockfiles.
