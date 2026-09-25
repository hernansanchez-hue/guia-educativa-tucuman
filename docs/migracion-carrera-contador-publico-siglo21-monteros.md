# Auditoría — Contador Público · Universidad Siglo 21 · Monteros

## Alcance

Esta etapa es exclusivamente de auditoría. No habilita offering, parámetro estático,
ruta ni navegación contextual para Contador Público en Monteros.

## Ubicación canónica en Vite

La tarjeta corresponde a la segunda carrera de Universidad Siglo 21 en la entrada
canónica compartida de `src/main.js`. Se muestra en Monteros a través de la sede
independiente `universidad-siglo-21-monteros`, cuyo slug público es
`universidad-siglo-21`.

| Campo | Valor auditado |
| --- | --- |
| Nombre | Contador Público |
| ID / slug de carrera | `contador-publico` / `contador-publico` |
| Carrera maestra | `contador-publico` existente en `next-app/app/data/careers.js` |
| Institución interna | `universidad-siglo-21-monteros` |
| Ciudad | `monteros` |
| Ruta futura | `/monteros/universidad-siglo-21/carreras/contador-publico` |
| Descripción | Herramientas contables, impositivas y financieras para empresas. |
| Imagen | `imageBank.students` |
| URL de imagen | `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80` |
| Badge | Nueva carrera |
| Orden | 2 |

## Datos para una offering futura

La implementación posterior deberá crear una offering propia, sin reutilizar la de
Concepción, con el ID previsto
`universidad-siglo-21-monteros-contador-publico` y únicamente estos datos auditados:

| Campo | Valor |
| --- | --- |
| `institutionId` | `universidad-siglo-21-monteros` |
| `citySlug` | `monteros` |
| `careerId` | `contador-publico` |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Contador Público |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.students` / URL auditada anterior |
| Badge | Nueva carrera |
| Formulario | Habilitado |
| Visible | Sí |
| Orden | 2 |
| WhatsApp propio | No |
| Fallback institucional | `3865 41 2020` |

La sede/dirección que hoy expone el objeto canónico Vite de Universidad Siglo 21 es
«San Martín 124, Concepción». Es una inconsistencia canónica ya preservada y no
debe corregirse ni duplicarse como dato exclusivo de la offering de Monteros.

## Relación con la carrera maestra

La carrera maestra `contador-publico` ya contiene descripción, perfil profesional,
campo laboral, plan de estudios, requisitos y FAQ reutilizables. No debe crearse
una carrera maestra específica de Monteros ni modificarse la existente. La offering
de Concepción `universidad-siglo-21-concepcion-contador-publico` es un antecedente
de estructura, no un dato a reutilizar: Monteros requiere su propia relación por
tener un `institution.id` distinto.

## UI, interacción y comportamiento a preservar

- La tarjeta visible debe conservar DOM, clases, imagen, badge, orden, dimensiones,
  responsive y hover de la institución ya migrada.
- La navegación contextual solo podrá habilitarse para esta tarjeta y esta sede al
  crear explícitamente su offering y parámetro estático.
- Hasta entonces, la ruta futura debe responder 404 y la tarjeta debe seguir sin
  navegación contextual.
- El formulario compartido, `localStorage.guiaEducativaLeads`, tabs, sticky,
  sidebar, WhatsApp, footer, `CareerPageClient.js` y `carrera.css` se reutilizarán
  sin cambios, salvo que una futura validación encuentre una diferencia real.
- El fallback WhatsApp debe normalizarse mediante la lógica compartida a
  `543865412020` y mantener el mensaje contextual de Contador Público.

## Riesgos y validaciones de la próxima etapa

1. No confundir el slug público compartido `universidad-siglo-21` con el ID interno
   de sede `universidad-siglo-21-monteros`.
2. No habilitar simultáneamente Lic. en Administración ni Higiene y Seguridad:
   deben continuar sin ruta contextual en Monteros.
3. Mantener las rutas y offerings de Concepción aisladas; su página de Contador
   Público debe seguir resolviendo contra la sede `universidad-siglo-21-concepcion`.
4. Validar HTTP 200 solo para la ruta nueva tras implementarla, y 404 para las otras
   dos carreras de Monteros aún no migradas.
5. Verificar formulario simulado, eliminación del lead de prueba, fallback WhatsApp,
   ausencia de overflow y regresión de las cuatro carreras ya disponibles de Siglo
   21 en Concepción.

## Archivos previstos para la próxima implementación

- `next-app/app/data/offerings.js`
- `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`
- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`

No se prevén cambios en `careers.js`, `CareerPageClient.js`, `carrera.css`, Vite,
dependencias ni lockfiles.
