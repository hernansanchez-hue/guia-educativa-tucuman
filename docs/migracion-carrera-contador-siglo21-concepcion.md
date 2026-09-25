# Auditoría inicial — Contador Público contextual en Universidad Siglo 21, Concepción

## Alcance y decisión de esta etapa

Esta es una auditoría aislada de la ficha contextual de **Contador Público** de **Universidad Siglo 21** en **Concepción**. No implementa `/concepcion/universidad-siglo-21/carreras/contador-publico`, no cambia la SPA Vite ni modifica `next-app/`.

La referencia visual y funcional es la vista de carrera de la demo Vite. La ficha de Abogacía ya migrada es el único patrón Next.js comparable; no autoriza cambios de diseño ni generalizaciones de rutas.

## 1. Ubicación de la vista Vite y navegación

La fuente canónica está en `src/main.js`, dentro de `defaultInstitutions[0]` (Universidad Siglo 21). La segunda entrada del arreglo `careers` es el arreglo legado:

```js
["Contador Público", "Herramientas contables, impositivas y financieras para empresas.", imageBank.students]
```

Al normalizarse, `normalizeCareer()` genera un id no estable: `slugifyCareer(name) + "-" + Math.random().toString(36).slice(2, 7)`. En cada carga el sufijo cambia. `renderCareers()` construye la tarjeta y el botón **Ver carrera** llama a `showCareer(career.id)`. Esa función busca en `currentInstitution.careers`, guarda el resultado en `currentCareer`, oculta las demás páginas, activa `#careerPage`, repone el footer y vuelve al inicio con `window.scrollTo(0, 0)`.

La secuencia manual de la SPA es: Home → botón **Concepción** → **Universidad Siglo 21** → tarjeta **Contador Público** → **Ver carrera**. El botón **Volver a la institución** y el botón lateral **Ver más carreras de esta institución** llaman ambos a `backToInstitution()`, que ejecuta `showDetail(currentInstitution.name)`.

La futura correspondencia estricta es:

```text
SPA: showCareer(id aleatorio de Contador Público)
Next.js: /concepcion/universidad-siglo-21/carreras/contador-publico
```

## 2. Estructura visual y comparación con Abogacía

`showCareer()` rellena exactamente el mismo HTML estático de `index.html` para todas las carreras:

1. `.career-page-shell`, botón de regreso y `.career-detail-layout`.
2. `main.career-detail-main`: `.career-page-hero`, imagen, título, seis hechos, descripción y `.career-section-tabs`.
3. Cinco secciones: Sobre la carrera/Perfil, Campo laboral, Plan de estudios, Requisitos de ingreso y Preguntas frecuentes.
4. `aside.career-contact-sidebar`: formulario/interés, WhatsApp e información rápida.
5. Footer público compartido.

Frente a Abogacía, **no hay bloques, clases, iconos, orden, layout, breakpoints ni comportamientos distintos**. Solo cambian los datos de Contador Público, la imagen `imageBank.students` y el badge de la tarjeta institucional. La ficha contextual no muestra badge dentro del hero; ese badge existe en la tarjeta de la institución, igual que en Abogacía.

Clases sensibles que deben reutilizarse sin modificación: `.career-page-shell`, `.career-detail-layout`, `.career-page-hero`, `.career-page-copy`, `.career-page-image`, `.career-facts`, `.career-section-tabs`, `.career-info-section`, `.career-contact-sidebar`, `.career-interest-card`, `.career-quick-info`, `.career-form-divider` y `.career-whatsapp`.

Las reglas canónicas viven en `src/styles.css`: escritorio con layout `1.55fr / 0.65fr`, hero `0.72fr / 1.28fr`, radio de 8px; tabs sticky a 82px; sidebar sticky a 92px. En `max-width: 900px` se apilan hero/layout, la sidebar deja de ser sticky, los hechos pasan a dos columnas y tabs a `top: 72px`. En el breakpoint móvil final, la copia usa 25px 20px, título 29px e imagen mínima 220px. El tema oscuro usa las mismas reglas compartidas `body.dark-theme` y colores/variables ya migrados en `carrera.css`.

## 3. Inventario literal de contenido canónico

| Campo | Valor exacto Vite |
|---|---|
| Institución | `Universidad Siglo 21` |
| Ciudad contextual | `Concepción` |
| Tipo institucional | `Privada` |
| Nombre / título | `Contador Público` |
| Descripción / Sobre la carrera | `Herramientas contables, impositivas y financieras para empresas.` |
| Imagen | `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80` |
| Badge de tarjeta | `Nueva carrera` (segunda posición: índice 1 del ciclo de badges) |
| Duración | `3 años` |
| Sede | `San Martín 124, Concepción` |
| Título | `Contador Público` |
| Validez | `Sí` |
| Turnos | `Consultar` |
| Modalidad | `Presencial` |
| Campo laboral | `Ámbitos públicos y privados relacionados con la formación profesional.` |
| Perfil del egresado | `Profesional preparado para aplicar conocimientos y desarrollarse en su área.` |
| Plan | `Primer año`; `Segundo año`; `Tercer año` |
| Requisitos | `DNI`; `Título secundario`; `Formulario de inscripción` |
| FAQ 1 | `¿Cuándo comienzan las inscripciones?` — `Consultá con la institución para conocer las próximas fechas.` |
| FAQ 2 | `¿Cómo solicito más información?` — `Podés utilizar WhatsApp o el formulario de esta página.` |
| Chips de campo | `Instituciones públicas y privadas`; `Organizaciones vinculadas al sector`; `Ejercicio profesional y consultoría` |

La imagen se adapta por `cloudinaryImage(career.image, 1400)` en Vite, sin un `publicId` para esta entrada legada. En la siguiente etapa no debe inventarse un `publicId`, campus alternativo, WhatsApp propio ni contenidos académicos adicionales.

## 4. Datos propuestos para una futura capa local (no aplicados)

El id y slug estables propuestos son ambos `contador-publico`. La futura entrada de `next-app/app/data/careers.js` deberá contener literalmente nombre, descripción, campo laboral, perfil, plan, requisitos y FAQ de la tabla anterior.

La futura offering contextual propuesta, sin crearla ahora, es:

```js
{
  id: "universidad-siglo-21-concepcion-contador-publico",
  institutionId: "universidad-siglo-21",
  careerId: "contador-publico",
  citySlug: "concepcion",
  modality: "Presencial",
  duration: "3 años",
  degree: "Contador Público",
  shifts: "Consultar",
  nationalValidity: "Sí",
  image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
  badge: "Nueva carrera",
  formEnabled: true,
  visible: true,
  order: 2
}
```

No debe incluir `campus`: la ficha debe heredar la dirección institucional existente, como Abogacía. Tampoco debe incluir `whatsapp`: la demo usa el fallback de la institución. El registro resumido ya existe sin cambios en `next-app/app/data/institutions.js`; no es una autorización para editarlo.

## 5. Formulario, estado y WhatsApp

El formulario Vite tiene campos obligatorios `Nombre y Apellido`, `Teléfono / WhatsApp` y `Email`; select `¿En qué turno te interesa?` con opciones `Mañana`, `Tarde`, `Noche`; y textarea `Escribí tu consulta (opcional)`. Después de enviar, `saveCareerLead()` antepone en `localStorage.guiaEducativaLeads` exactamente: fecha ISO, institución, nombre, teléfono, email, carrera, turno y consulta; muestra `Consulta enviada correctamente.` y hace reset. No almacena ciudad aunque el contexto visual procede de `currentCity`.

No hay `sessionStorage` específico de carrera. El modo claro/oscuro viene del mecanismo global `localStorage.guiaEducativaTheme` y `body.dark-theme`; no debe reemplazarse. Las tarjetas/estado administrativo de la demo pueden alterar instituciones desde `guiaEducativaInstitutions`, pero la futura migración continúa con la capa local versionada aprobada.

No existe WhatsApp propio de Contador Público. La resolución es `career.whatsapp || currentInstitution.whatsapp`, por lo que debe usar `3865 41 2020`, normalizar a `543865412020` y generar el mensaje `Hola, quiero información sobre Contador Público`. Si falta número, el único fallback Vite de la acción de tarjeta es abrir `showCareer`; dentro de la ficha el dato canónico de esta institución siempre permite el enlace.

## 6. Reutilización futura y cambios mínimos previstos

Se deben reutilizar sin cambios estructurales `CareerPageClient.js`, `carrera.css`, las pestañas, FAQ, sidebar, formulario, información rápida, footer y el fallback de WhatsApp ya validados con Abogacía. No se justifica un nuevo componente cliente ni cambios de CSS, header, footer o `PublicFooter`.

Solo en la futura etapa de implementación se prevén estos cambios mínimos:

1. `next-app/app/data/careers.js`: añadir el master de Contador Público.
2. `next-app/app/data/offerings.js`: añadir solo la offering contextual especificada.
3. `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`: extender `generateStaticParams()` con el único par permitido de Contador Público; el resolver y `notFound()` permanecen igual.
4. `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`: ampliar la condición actual de `careerPath` para ese id, conservando sin handler las demás tarjetas.
5. `docs/comparaciones/carrera-contador-siglo21-concepcion-next/*`: capturas, comparación y análisis de la futura validación.

No se prevén cambios en `CareerPageClient.js` ni en `carrera.css` salvo que una comparación visual demuestre una diferencia real. No se modifican Vite, paquetes, lockfiles, `index.html`, `src/main.js`, `src/styles.css`, ni datos de ciudades.

## 7. Matriz HTTP y validación visual futura

Tras implementar, deben dar 200: `/concepcion/universidad-siglo-21/carreras/contador-publico` y las rutas ya aprobadas `/`, `/ciudades`, `/concepcion`, las tres instituciones de Concepción y Abogacía. Deben conservar 404: carreras inexistentes, Abogacía bajo Santa Bárbara/IES, y combinaciones Monteros/Aguilares con Universidad Siglo 21 para esta carrera.

La comparación obligatoria será Vite frente a Next.js en 1440×900 y 390×843, ambos en claro y oscuro. El móvil debe validar viewport CSS real (no recorte), `window.innerWidth === 390`, `document.documentElement.clientWidth === 390`, ausencia de overflow horizontal, header/regreso, hero, imagen, título/tipo, seis hechos, tabs envueltas con 150px de altura, secciones, formulario/sidebar y footer. Las zonas de medios dinámicos se documentarán como dinámicas; no se regeneran las comparaciones de Abogacía.

## 8. Riesgos visuales y de migración

- El id Vite aleatorio no puede trasladarse: el slug estable debe seguir siendo exclusivamente `contador-publico`.
- La página genérica comparte estructura; una condición demasiado amplia convertiría carreras aún no aprobadas en rutas válidas. `generateStaticParams`, offering y handler de tarjeta deben permanecer estrictos.
- La segunda tarjeta debe conservar exactamente `Nueva carrera`, imagen, orden, icono y geometría; no deben alterarse los otros tres botones.
- Los valores genéricos de perfil/campo/plan/requisitos/FAQ provienen de `normalizeCareer()` y no de una ficha académica individual: deben copiarse literalmente, sin enriquecerlos.
- El fallback institucional de campus y WhatsApp evita duplicación. Agregar datos propios podría divergir de la demo.
- La conversión HTML→JSX debe preservar ids, jerarquía, texto, orden de los seis hechos, sticky offsets, `scrollIntoView({ behavior: "smooth", block: "start" })`, temas y responsive.
- La diferencia histórica de altura del footer móvil compartido está documentada y no debe corregirse en esta etapa salvo evidencia visual nueva.

## Estado de cierre

Auditoría terminada. No se implementó la ruta, no se conectó Supabase y no se cambió ninguna pantalla. La próxima tarea, si se autoriza, debe limitarse a migrar los cuatro datos/rutas mínimos, generar la línea base de Contador Público y validar visualmente contra la demo.
