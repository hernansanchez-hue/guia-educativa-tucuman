# Auditoría inicial — Higiene y Seguridad contextual, Universidad Siglo 21, Concepción

## Alcance

Auditoría exclusiva de la cuarta carrera visible de Universidad Siglo 21, Concepción. No implementa ruta, tarjeta, datos, Vite, Supabase ni páginas generales. La demo Vite conserva prioridad visual absoluta.

## 1. Identidad canónica

La entrada legada de `src/main.js` es:

```js
["Higiene y Seguridad", "Prevención, normativa y seguridad aplicada al trabajo.", imageBank.lab]
```

El nombre visible completo es **Higiene y Seguridad**; no hay otro nombre. Es la cuarta tarjeta (índice 3), imagen `imageBank.lab` (`https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80`) y badge **Inscripciones abiertas** (índice 3 del ciclo de badges).

`normalizeCareer()` crea un id efímero `higiene-y-seguridad-<cinco caracteres aleatorios>` mediante `slugifyCareer()`. Por tanto, id y slug estable canónicos futuros son **`higiene-y-seguridad`**, no `higiene-seguridad`. La tarjeta Next existente ya usa id/slug `higiene-y-seguridad`, por lo que no hay discrepancia ID→slug como en Administración.

## 2. Estructura visual comparada

`showCareer(career.id)` rellena el mismo `#careerPage` para las cuatro carreras. Higiene y Seguridad tiene exactamente los mismos bloques que Abogacía, Contador y Administración: header y regreso; hero, imagen y seis hechos; cinco tabs sticky; descripción/perfil; campo laboral y chips; plan, requisitos y FAQ; sidebar, formulario, WhatsApp, información rápida y footer.

No se encontró diferencia real de DOM, CSS, responsive, oscuro/claro, formulario o footer. Se mantienen tabs sticky a 82px escritorio/72px móvil, hero apilado hasta 900px y sidebar no sticky en móvil.

## 3. Carrera maestra futura

| Campo | Valor literal Vite |
|---|---|
| id / slug | `higiene-y-seguridad` |
| Nombre | `Higiene y Seguridad` |
| Descripción / sobre la carrera | `Prevención, normativa y seguridad aplicada al trabajo.` |
| Perfil | `Profesional preparado para aplicar conocimientos y desarrollarse en su área.` |
| Campo laboral | `Ámbitos públicos y privados relacionados con la formación profesional.` |
| Chips | `Instituciones públicas y privadas`; `Organizaciones vinculadas al sector`; `Ejercicio profesional y consultoría` |
| Plan | `Primer año`; `Segundo año`; `Tercer año` |
| Requisitos | `DNI`; `Título secundario`; `Formulario de inscripción` |
| FAQ | `¿Cuándo comienzan las inscripciones?` / `Consultá con la institución para conocer las próximas fechas.`; `¿Cómo solicito más información?` / `Podés utilizar WhatsApp o el formulario de esta página.` |

No hay nivel u otros datos específicos. Perfil, campo, plan, requisitos y FAQ proceden literalmente de la normalización común y no deben enriquecerse.

## 4. Offering contextual futura

```js
{
  id: "universidad-siglo-21-concepcion-higiene-y-seguridad",
  institutionId: "universidad-siglo-21",
  careerId: "higiene-y-seguridad",
  citySlug: "concepcion",
  modality: "Presencial",
  duration: "3 años",
  degree: "Higiene y Seguridad",
  shifts: "Consultar",
  nationalValidity: "Sí",
  image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
  badge: "Inscripciones abiertas",
  formEnabled: true,
  visible: true,
  order: 4
}
```

No debe contener `campus`: hereda `San Martín 124, Concepción`. No posee WhatsApp específico: aplica `offering.whatsapp || institution.whatsapp` con `3865 41 2020`.

## 5. Formulario y WhatsApp

El formulario es idéntico: Nombre y Apellido, Teléfono / WhatsApp, Email, select con Mañana/Tarde/Noche y consulta opcional. Los tres primeros son obligatorios. `saveCareerLead()` guarda fecha, institución, nombre, teléfono, email, carrera, turno y consulta en `localStorage.guiaEducativaLeads`, confirma y resetea; no guarda ciudad.

WhatsApp usa fallback institucional normalizado a `543865412020`, con mensaje `Hola, quiero información sobre Higiene y Seguridad`.

## 6. Reutilización, navegación y HTTP futura

Reutilizables sin cambios: `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer, `page.js` (salvo un static param), y fallback WhatsApp. No hay razón comprobada para modificar cliente o CSS.

El cambio futuro mínimo en `InstitutionPageClient.js` será mapear `higiene-y-seguridad` a `/concepcion/universidad-siglo-21/carreras/higiene-y-seguridad`. `generateStaticParams()` añadirá exclusivamente esa terna; no se abrirán rutas por patrón amplio.

Tras la migración deben dar 200 Abogacía, Contador, Administración e Higiene bajo Concepción/Siglo 21. Deben permanecer 404 `higiene-seguridad`, carreras inexistentes y combinaciones institución/ciudad/carrera inválidas.

## 7. Comparación futura, archivos y riesgos

Capturar Vite/Next en 1440×900 claro/oscuro y 390×843 CSS real claro/oscuro mediante CDP, validando `innerWidth`, `innerHeight`, DPR, `clientWidth`, tabs, temas y ausencia de overflow. Crear `docs/comparaciones/carrera-higiene-seguridad-siglo21-concepcion-next/` con 20 PNG, README y análisis.

Archivos mínimos futuros: `next-app/app/data/careers.js`, `next-app/app/data/offerings.js`, `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`, `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js` y documentación de comparación. No modificar `CareerPageClient.js`, `carrera.css`, Vite, `institutions.js`, paquetes ni lockfiles.

Riesgos: usar el slug alternativo sin “y”; habilitar rutas genéricas; alterar el cuarto orden/badge/geometría; inventar datos de oferta; o modificar el footer móvil compartido ya documentado.

## 8. Cierre de Siglo 21

Higiene y Seguridad es la cuarta y última carrera actualmente visible en esta ficha institucional. Después de su futura migración, las cuatro tarjetas de Universidad Siglo 21 Concepción quedarían navegables, manteniendo alcance estricto: no autoriza migrar carreras de otras instituciones o ciudades.
