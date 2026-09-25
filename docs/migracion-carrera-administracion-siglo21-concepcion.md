# Auditoría inicial — Lic. en Administración contextual, Universidad Siglo 21, Concepción

## Alcance

Esta auditoría cubre únicamente la ficha contextual que la demo Vite abre para **Lic. en Administración** dentro de Universidad Siglo 21, Concepción. No implementa la ruta, no conecta la tarjeta, no modifica `next-app/`, Vite, dependencias ni datos existentes.

La referencia visual absoluta es la demo Vite. Abogacía y Contador Público ya migradas son referencias de arquitectura, no autorización para rediseñar o ampliar rutas.

## 1. Identidad canónica y navegación Vite

La entrada canónica está en `src/main.js`, institución Universidad Siglo 21, tercera posición del arreglo legado `careers` (índice 2):

```js
["Lic. en Administración", "Gestión, liderazgo y estrategia para organizaciones actuales.", imageBank.design]
```

El nombre visible es exactamente **Lic. en Administración**. La demo no suministra un nombre completo alternativo; no debe expandirse a “Licenciatura en Administración”. La imagen es `imageBank.design`:

```text
https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80
```

La tarjeta ocupa el orden 3 (índice 2) y recibe el badge **Próximo ingreso** por el ciclo canónico `Inscripciones abiertas`, `Nueva carrera`, `Próximo ingreso`.

Al cargar la demo, `normalizeCareer()` convierte cada arreglo legado en un objeto. Para esta carrera crea un id efímero:

```text
lic-en-administracion-<cinco caracteres aleatorios>
```

El prefijo se deriva de `slugifyCareer("Lic. en Administración")`. El id cambia por `Math.random()` cada carga y `renderCareers()` conecta el botón **Ver carrera** a `showCareer(career.id)`. `showCareer()` depende de `currentInstitution`, asigna `currentCareer`, activa `#careerPage`, rellena sus ids y ejecuta `window.scrollTo(0, 0)`.

### Slug estable recomendado

El slug contextual futuro debe ser **`lic-en-administracion`**. Es el prefijo que produce la lógica canónica de Vite y es distinto de:

- `licenciatura-administracion`, usado solamente en una prueba 404 anterior; no es canónico.
- `licenciatura-en-administracion`, id/slug resumido ya presente en `next-app/app/data/institutions.js`; tampoco procede de `slugifyCareer()` de Vite.

Esa discrepancia existente no se corrige en esta auditoría. En la migración, la condición de tarjeta deberá reconocer el id resumido existente de la tarjeta y conducirlo a la ruta canónica `lic-en-administracion`, sin cambiar texto, orden, clases ni geometría.

## 2. Estructura visual comparada

Se comprobó que `showCareer()` usa el mismo `#careerPage` estático para todas las carreras. Lic. en Administración no agrega ni elimina bloques frente a Abogacía o Contador Público:

1. Header público, botón **Volver a la institución**, `.career-page-shell` y layout principal/lateral.
2. Hero con institución/ciudad, nombre, título, imagen, descripción y seis hechos.
3. Cinco tabs: Sobre la carrera, Plan de estudios, Campo laboral, Requisitos e ingreso y Más información.
4. Descripción y perfil; campo laboral con tres chips; plan, requisitos y dos FAQ.
5. Sidebar sticky con formulario, WhatsApp, información rápida y regreso.
6. Footer público compartido.

No hay diferencias reales de hero, imagen (solo la fuente), hechos, tabs, sticky, descripción, perfil, campo laboral, plan, requisitos, FAQ, sidebar, formulario, WhatsApp ni footer. Se aplican las mismas reglas Vite: tabs sticky a 82px en escritorio y 72px en móvil; hero/layout se apilan hasta 900px; hechos a dos columnas en móvil; sidebar deja de ser sticky; tema por `body.dark-theme`.

## 3. Inventario literal para carrera maestra futura

| Campo | Valor Vite |
|---|---|
| id / slug futuro | `lic-en-administracion` |
| Nombre | `Lic. en Administración` |
| Descripción / Sobre la carrera | `Gestión, liderazgo y estrategia para organizaciones actuales.` |
| Perfil del egresado | `Profesional preparado para aplicar conocimientos y desarrollarse en su área.` |
| Campo laboral | `Ámbitos públicos y privados relacionados con la formación profesional.` |
| Chips | `Instituciones públicas y privadas`; `Organizaciones vinculadas al sector`; `Ejercicio profesional y consultoría` |
| Plan | `Primer año`; `Segundo año`; `Tercer año` |
| Requisitos | `DNI`; `Título secundario`; `Formulario de inscripción` |
| FAQ 1 | `¿Cuándo comienzan las inscripciones?` — `Consultá con la institución para conocer las próximas fechas.` |
| FAQ 2 | `¿Cómo solicito más información?` — `Podés utilizar WhatsApp o el formulario de esta página.` |

No existe nivel, orientación, acreditación ni otro dato académico específico en la entrada legada. Los valores de perfil, campo, plan, requisitos y FAQ provienen literalmente de la normalización común de Vite; no deben enriquecerse.

## 4. Offering contextual futura (no aplicada)

La offering propuesta debe representar exclusivamente Universidad Siglo 21 + Concepción + `lic-en-administracion`:

```js
{
  id: "universidad-siglo-21-concepcion-lic-en-administracion",
  institutionId: "universidad-siglo-21",
  careerId: "lic-en-administracion",
  citySlug: "concepcion",
  modality: "Presencial",
  duration: "3 años",
  degree: "Lic. en Administración",
  shifts: "Consultar",
  nationalValidity: "Sí",
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  badge: "Próximo ingreso",
  formEnabled: true,
  visible: true,
  order: 3
}
```

No debe duplicarse `campus`: la Vite legada usa la dirección institucional `San Martín 124, Concepción`. No existe WhatsApp específico; deberá quedar ausente para que se aplique `offering.whatsapp || institution.whatsapp`, cuyo valor institucional es `3865 41 2020`.

## 5. Formulario y WhatsApp

La ficha usa el formulario compartido sin diferencias: `Nombre y Apellido`, `Teléfono / WhatsApp`, `Email`, select `¿En qué turno te interesa?` con `Mañana`, `Tarde`, `Noche`, y `Escribí tu consulta (opcional)`. Los tres primeros campos son obligatorios.

`saveCareerLead()` escribe en `localStorage.guiaEducativaLeads` fecha ISO, institución, nombre, teléfono, email, carrera, turno y consulta; muestra `Consulta enviada correctamente.` y resetea. No guarda la ciudad. No hay `sessionStorage` propio de carrera.

La carrera usa WhatsApp institucional de fallback. El número normalizado es `543865412020` y el mensaje debe ser `Hola, quiero información sobre Lic. en Administración`. No se debe inventar número de offering ni generar leads reales.

## 6. Reutilización y navegación futura

Pueden reutilizarse sin cambios: `page.js` contextual (salvo un parámetro estático explícito), `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y lógica de fallback de WhatsApp. No existe diferencia visual comprobada que requiera modificar componente cliente o CSS.

El cambio mínimo futuro en `InstitutionPageClient.js` será añadir una única clave para el id ya existente de la tarjeta:

```js
"licenciatura-en-administracion":
  "/concepcion/universidad-siglo-21/carreras/lic-en-administracion"
```

No se debe cambiar el id, slug visible, nombre ni datos de `institutions.js` en esa tarea, porque son los datos que conservan la tarjeta visual aprobada. Abogacía y Contador deben seguir siendo las únicas rutas ya activas antes de esa modificación; Higiene y Seguridad debe continuar inactiva.

## 7. Matriz HTTP y comparación futura

Después de migrar, debe responder 200:

- `/concepcion/universidad-siglo-21/carreras/abogacia`
- `/concepcion/universidad-siglo-21/carreras/contador-publico`
- `/concepcion/universidad-siglo-21/carreras/lic-en-administracion`

Deben permanecer 404 la ruta de prueba no canónica `/concepcion/universidad-siglo-21/carreras/licenciatura-administracion`, Higiene y Seguridad, cualquier carrera no ofrecida, instituciones ajenas y ciudades ajenas.

La comparación visual futura debe incluir Vite/Next.js en escritorio claro y oscuro 1440×900, y móvil claro y oscuro 390×843 CSS reales. En móvil se debe registrar `window.innerWidth`, `window.innerHeight`, `devicePixelRatio` y `document.documentElement.clientWidth`; debe verificarse el ancho 390 y ausencia de overflow horizontal. Las cuatro comparaciones deben revisar hero, imagen, seis hechos, tabs sticky/envueltas, contenido, sidebar/formulario/footer y temas.

## 8. Archivos previstos y riesgos

Cambios futuros mínimos:

1. `next-app/app/data/careers.js` — nuevo master `lic-en-administracion`.
2. `next-app/app/data/offerings.js` — única offering contextual.
3. `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js` — único static param canónico.
4. `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js` — ruta para el id existente de la tercera tarjeta.
5. `docs/comparaciones/carrera-administracion-siglo21-concepcion-next/*` — 20 PNG, README y análisis de validación.

`CareerPageClient.js` y `carrera.css` deben permanecer intactos salvo una diferencia visual real comprobada. No se prevén cambios en Vite, `institutions.js`, paquetes, lockfiles, Supabase, SEO ni rutas generales.

Riesgos: confundir el slug canónico con el id heredado de la tarjeta; habilitar rutas por patrón amplio; modificar la geometría/orden/badge de la tercera tarjeta; inventar contenido académico, campus o WhatsApp; y corregir indebidamente el footer móvil compartido ya documentado fuera de alcance.

## Cierre

Auditoría completada sin implementar Lic. en Administración. La siguiente etapa, si se autoriza, debe limitarse a los cuatro cambios de datos/ruta/tarjeta descritos y a su validación visual completa.
