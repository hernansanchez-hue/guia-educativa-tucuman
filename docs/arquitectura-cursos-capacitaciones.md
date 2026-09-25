# Arquitectura: cursos y capacitaciones institucionales

## Decisión de dominio

El módulo interno recomendado se denomina **capacitaciones institucionales** (`trainings` en código). Es independiente de carreras académicas y de Cursos Docentes provinciales.

La fuente Vite confirma que Centro de Formación Tucumán es `Capacitación`, se presenta con el slogan “Cursos cortos para fortalecer tu perfil laboral” y posee tres ofertas visibles:

1. Auxiliar Administrativo
2. Secretariado
3. Operador de PC

La SPA técnica las almacena en `careers` y usa el encabezado visual genérico “Carreras”, pero eso es una simplificación de implementación compartida, no prueba de dominio académico. Su clasificación canónica para la migración es **capacitaciones/ofertas institucionales**. No deben entrar en `careers.js` ni `offerings.js`.

## Modelo recomendado

Se recomienda el patrón reutilizable de dos entidades, preservando dominio separado:

### Training program (entidad general)

`trainingProgram` representa una capacitación reusable cuando los contenidos son equivalentes entre sedes.

- `id`, `slug`, `name`, `description`
- `objectives` o `profile`
- `contents`
- `requirements`
- `faq`
- `status`

Vite aún no prueba que una capacitación pueda estar disponible en varias sedes: Centro de Formación Tucumán también declara Aguilares, pero la sede Monteros se modela independientemente. Por eso el master se propone por extensibilidad y no implica reutilización automática.

### Training offering (entidad contextual)

`trainingOffering` expresa cómo una sede publica el programa:

- `id`, `institutionId`, `citySlug`, `programId`
- `duration`, `modality`, `certification`, `shifts`
- `image`, `badge`, `visible`, `order`, `publicationStatus`
- `whatsapp` opcional, con fallback institucional
- datos de sede que sean realmente contextuales

La relación se expresa como `Centro de Formación Tucumán Monteros → trainingOffering → trainingProgram`, sin transformarla en carrera académica. Permite futuras sedes sin duplicar contenido general cuando Vite/Supabase demuestren equivalencia.

## Ruta pública futura

Ruta canónica propuesta: `/[ciudad]/[institucion]/capacitaciones/[slug]`.

El término se apoya en el tipo institucional canónico `Capacitación`, evita colisión con `/carreras/[slug]` y distingue claramente las ofertas de los Cursos Docentes. No se crea ruta en esta etapa.

## Separación obligatoria

| Dominio | Modelo | Ruta |
| --- | --- | --- |
| Carreras académicas | career master + institutional offering | `/[ciudad]/[institucion]/carreras/[slug]` |
| Capacitaciones institucionales | training program + training offering | futura `/[ciudad]/[institucion]/capacitaciones/[slug]` |
| Cursos Docentes provinciales | módulo provincial independiente | `/cursos-docentes/[slug]` |

Los Cursos Docentes no dependen de una sede institucional y no deben compartir tablas, administración ni rutas por defecto con capacitaciones institucionales.

## Presentación y administración futuras

La vista de capacitación podrá reutilizar parcialmente la presentación de `CareerPageClient` (hero, hechos, tabs, FAQ, sidebar, formulario, WhatsApp y footer), pero mediante un componente/adaptador específico que reciba `trainingProgram` y `trainingOffering`. No debe importar datos desde `careers.js` ni depender del dominio de carreras.

El futuro Centro de Control deberá permitir crear o reutilizar una capacitación, asociarla a una sede, editar sus datos contextuales, publicar/despublicar, ordenar la oferta y decidir el WhatsApp específico o fallback. Esta operación deberá mantenerse separada de la gestión de carreras y de Cursos Docentes.

## Archivos locales previstos antes de Supabase

Cuando se apruebe la implementación, los archivos temporales mínimos previstos son:

- `next-app/app/data/trainingPrograms.js`
- `next-app/app/data/trainingOfferings.js`
- `next-app/app/[ciudad]/[institucion]/capacitaciones/[capacitacion]/page.js`
- un cliente/presentador específico o adaptador visual para capacitación
- documentación y comparaciones visuales de cada oferta

No se crea ninguno en esta etapa. Auxiliar Administrativo, Secretariado y Operador de PC no fueron implementados.
