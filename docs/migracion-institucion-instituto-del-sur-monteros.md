# Auditoría — Instituto del Sur · Monteros

## Alcance

Auditoría exclusiva de la segunda institución visible en la página canónica Vite de
Monteros, después de Universidad Siglo 21. No implementa ficha, rutas, carreras ni
modifica Vite.

## Identidad y orden comprobados

La fuente canónica `src/main.js` define las instituciones en el mismo orden que usa
`cityInstitutions()` para filtrar Monteros: Universidad Siglo 21, Instituto del Sur,
Centro de Formación Tucumán e Instituto San Miguel. Por ello la segunda institución
visible real es Instituto del Sur.

| Campo | Valor canónico Vite |
| --- | --- |
| Nombre visible | Instituto del Sur |
| ID legado Vite | `instituto-del-sur-<cinco caracteres aleatorios>` generado por `normalizeInstitution()`; no es estable |
| ID interno futuro estable | `instituto-del-sur-monteros` |
| Slug público futuro | `instituto-del-sur` |
| `citySlug` futuro | `monteros` |
| Tipo | Terciario |
| Plan | Profesional |
| Orden en Monteros | 2 |
| Logo textual | IDS |
| Imagen / portada | `imageBank.students` — `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80` |
| Media visible en tarjeta | Video de carreras |
| Slogan | Tecnicaturas orientadas a una salida laboral concreta. |
| Descripción | Formación técnica y profesional en áreas comerciales, administrativas y digitales. |
| Dirección heredada | Av. Mitre 420, Concepción |
| WhatsApp institucional | 3865 44 8712 |
| Ruta futura | `/monteros/instituto-del-sur` |

## Colisión y arquitectura de sede

No existe otra entrada de Instituto del Sur en Vite ni en los datos actuales del
proyecto. No hay colisión de slug con otra sede. Aun así, el ID interno definitivo
debe ser `instituto-del-sur-monteros` y debe incorporar explícitamente
`citySlug: "monteros"`, separado del slug público `instituto-del-sur`, para cumplir
el modelo de resolución por sede (`institution.id` único + `citySlug` + slug
público). No se debe reutilizar un ID de otra ciudad si apareciera una sede futura
con el mismo nombre.

## Carreras resumidas visibles

Las tres tarjetas de carrera de la ficha Vite, en este orden, son:

| Orden | Nombre | Descripción | Imagen | Badge derivado por ciclo Vite |
| ---: | --- | --- | --- | --- |
| 1 | Marketing | Planificación comercial, comunicación y campañas digitales. | `imageBank.design` | Inscripciones abiertas |
| 2 | Recursos Humanos | Selección, capacitación y gestión de equipos. | `imageBank.fair` | Nueva carrera |
| 3 | Administración de Empresas | Organización, procesos y gestión operativa. | `imageBank.classroom` | Próximo ingreso |

La demo normaliza cada carrera legada con IDs efímeros y utiliza los valores
compartidos: Presencial, 3 años, turnos Consultar, validez Sí, formulario habilitado
y fallback WhatsApp institucional. No se inventan aún careers maestras, offerings
ni rutas contextuales.

## Ficha Vite y preservación visual

La ficha reutiliza la estructura institucional común de la SPA:

- Header público, navegación y control claro/oscuro; botón de regreso a
  instituciones.
- Portada `detailCover` con la imagen institucional; tipo y ciudad; nombre,
  slogan y logo `IDS` mediante `institutionLogoMarkup`.
- Marquee `#institutionGallery` con la portada, `imageBank.students`,
  `imageBank.classroom` e `imageBank.graduation`, repetidos para animación.
- Tres tarjetas con imagen, badge, duración, modalidad, ciudad, tipo y acciones
  `Ver carrera` / `Consultar`.
- Footer público y control flotante administrativo oculto en la vista pública.

La normalización Vite no aporta una galería ni logo de imagen específicos; aplica el
fallback de cuatro imágenes anterior. Los temas claro/oscuro, responsive, marquee,
hover, accesibilidad de tarjetas y layout son los compartidos de la ficha
institucional. No se detectó una excepción visual que requiera CSS o componentes
nuevos.

## Reutilización y riesgos

La futura ficha puede reutilizar la plantilla institucional existente y sus estilos
sin cambios, una vez que los datos se normalicen a tarjetas compatibles. Riesgos:

1. Usar como ID permanente el sufijo aleatorio de Vite.
2. No añadir `citySlug`, lo cual impediría resolver la futura ruta con
   `getInstitutionPage()`.
3. Alterar el orden de instituciones de Monteros o el orden/badges de sus tres
   carreras.
4. Corregir la dirección heredada «Av. Mitre 420, Concepción» sin autorización:
   es un dato canónico inconsistente que debe preservarse.
5. Migrar carreras, instituciones adicionales o Aguilares antes de una etapa
   explícita.

## Implementación de ficha institucional

La ficha institucional fue implementada posteriormente con un único registro de sede
`instituto-del-sur-monteros`, `citySlug: "monteros"` y slug público
`instituto-del-sur`. Se añadieron solo la combinación estática
`/monteros/instituto-del-sur` y la autorización de navegación de esa tarjeta desde
la ciudad. Las tres carreras se normalizaron como tarjetas de presentación para que
la plantilla existente pueda renderizarlas, sin crear carreras maestras, offerings
ni rutas contextuales.

## Próxima etapa prevista

La futura migración institucional, si se autoriza, deberá limitarse a datos de sede,
parámetro estático de ficha y conexión de la tarjeta de Instituto del Sur desde
Monteros. No autoriza todavía rutas de Marketing, Recursos Humanos ni Administración
de Empresas.
