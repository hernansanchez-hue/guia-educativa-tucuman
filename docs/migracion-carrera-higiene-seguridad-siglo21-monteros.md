# Auditoría — Higiene y Seguridad · Universidad Siglo 21 · Monteros

## Alcance

Auditoría documental exclusiva de la cuarta y última carrera visible de Universidad
Siglo 21 Monteros. No crea offering, ruta, navegación ni modifica Vite.

## Identidad canónica comprobada

La entrada canónica de la demo Vite es la cuarta del arreglo de carreras de
Universidad Siglo 21:

```js
["Higiene y Seguridad", "Prevención, normativa y seguridad aplicada al trabajo.", imageBank.lab]
```

La sede independiente Monteros preserva los mismos valores de tarjeta que la sede
Concepción.

| Campo | Valor auditado |
| --- | --- |
| Nombre | Higiene y Seguridad |
| ID de tarjeta | `higiene-y-seguridad` |
| Slug de tarjeta | `higiene-y-seguridad` |
| Carrera maestra reutilizable | `higiene-y-seguridad` |
| Ciudad | `monteros` |
| Institución interna | `universidad-siglo-21-monteros` |
| Imagen | `imageBank.lab` |
| URL de imagen | `https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80` |
| Badge | Inscripciones abiertas |
| Orden | 4 |

No hay mapping de ID a slug: la identidad de tarjeta, el career master y el slug
canónico coinciden. El slug alternativo `higiene-seguridad` (sin «y») no es válido y
debe permanecer en HTTP 404.

## Reutilización de carrera maestra

La carrera maestra existente `higiene-y-seguridad` corresponde conceptualmente a la
tarjeta de Monteros y aporta la descripción, perfil, campo laboral, plan, requisitos
y FAQ. No se debe crear `higiene-y-seguridad-monteros` ni modificar la entrada
maestra existente.

## Futura offering independiente

La implementación posterior deberá agregar una offering propia, sin reutilizar la
de Concepción:

| Campo | Valor previsto exclusivamente desde Vite |
| --- | --- |
| ID | `universidad-siglo-21-monteros-higiene-y-seguridad` |
| `institutionId` | `universidad-siglo-21-monteros` |
| `citySlug` | `monteros` |
| `careerId` | `higiene-y-seguridad` |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Higiene y Seguridad |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.lab` / URL auditada anterior |
| Badge | Inscripciones abiertas |
| Formulario | Habilitado |
| Visible | Sí |
| Orden | 4 |
| WhatsApp propio | No |
| Fallback institucional | `3865 41 2020` |

La dirección canónica del objeto compartido de Siglo 21 permanece «San Martín 124,
Concepción». Es un dato heredado de Vite y no se debe corregir ni convertir en un
campo exclusivo de la offering Monteros.

## Ruta, plantilla y funcionamiento futuros

- Ruta canónica: `/monteros/universidad-siglo-21/carreras/higiene-y-seguridad`.
- La ruta deberá resolver el slug público `universidad-siglo-21`, la ciudad
  `monteros`, el ID interno `universidad-siglo-21-monteros` y la nueva offering.
- `higiene-seguridad` debe continuar en 404; no se debe crear alias ni redirect.
- `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y
  fallback WhatsApp se reutilizan sin cambios.
- El formulario compartido conserva `localStorage.guiaEducativaLeads`; el fallback
  WhatsApp se normaliza a `543865412020` con el mensaje contextual de Higiene y
  Seguridad.

## Riesgos y archivos previstos

1. No mezclar la offering Concepción
   `universidad-siglo-21-concepcion-higiene-y-seguridad` con la futura offering de
   Monteros.
2. No habilitar rutas amplias ni el slug alternativo sin «y».
3. Mantener la cuarta posición, imagen, badge, DOM, clases, hover y responsive de
   la tarjeta sin cambios.
4. No modificar Vite, `careers.js`, `CareerPageClient.js`, `carrera.css`, paquetes
   ni lockfiles.

Archivos previstos para una futura implementación:

- `next-app/app/data/offerings.js`
- `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`
- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`
