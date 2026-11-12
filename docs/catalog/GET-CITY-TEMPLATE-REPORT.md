# Consistencia de ciudades y continuación provincial

## Causa real y corrección

Había una única ruta dinámica, pero tres decisiones de datos/render reducían la experiencia: (1) el render podía devolver null cuando no había slides Premium ni hero propio; (2) Orientación aplicaba cityIds como allowlist de las tres ciudades originales; (3) el generador provincial asignó orientationVisible:false y expoVisible:false a las 24 localidades nuevas. Los heroes neutrales ya existentes del seed sí permitían mostrar un banner en algunas de ellas, pero no resolvían el caso de futuras ciudades sin hero propio.

Se corrigieron CityFeaturedCareers.js y CityInstitutionSections.js, se centralizó el fallback/visibilidad en lib/catalog/city-template.mjs y se retiraron los dos flags reductores del generador y del seed nuevo. No se cambiaron los datos académicos, slugs, imágenes ni planes. Tampoco se tocó CSS, Home, header, footer ni el administrador. Se respetan ocultamientos editoriales explícitos posteriores por ciudad y el apagado global; las ciudades nuevas no reciben esos ocultamientos por defecto.

## Orden real de la plantilla aprobada

1. PublicFloatingHeader → PublicHeaderFrame → PublicHeader.
2. CityFeaturedCareers dentro de city-showcase-panel: slider comercial válido o banner editorial GET.
3. Orientación Vocacional: mismo singleton del PublicEditorialProvider, con overrides locales ya soportados.
4. Expo Carreras GET: bloque existente, con estado “Próximamente · Fecha a confirmar” cuando no hay datos propios.
5. Instituciones destacadas, sólo si existen selecciones comerciales válidas.
6. Todas las instituciones de la localidad, normales y Premium.
7. Cierre “Tu propuesta educativa puede estar acá”.
8. Aviso de interés accesible y PublicFooter global.

No existe una grilla general “Todas las carreras” en la home de ciudad. El slider comercial es el bloque destacado inicial; no se agregó otro módulo de carreras normales ni otra plantilla.

## Fallback y contenido global

resolveCityBanner conserva los slides aprobados y los campos hero propios. Si no hay publicidad válida, devuelve un banner editorial de GET con una biblioteca genérica existente; no es foto de una institución, no contiene un anunciante ni cambia ningún flag Premium. Reutiliza exactamente las clases y el tamaño responsive de city-featured. Su botón “Ver instituciones” desplaza al directorio de la ciudad. Una sola diapositiva editorial no muestra flechas inactivas ni tarjetas comerciales falsas.

Orientación lee una sola fuente global: los cambios de ese contenido se reflejan en las ciudades sin copiar textos por localidad. cityIds queda como dato legacy sin restringir la presentación pública. Expo no tiene una consulta territorial de eventos en esta plantilla: se conserva su estado editorial próximo, sin inventar fechas, instituciones participantes ni eventos de Famaillá u otras ciudades.

## Auditoría por ciudad

Cada fila fue comprobada en navegador a 1920×1080, 1440×900, 1366×768, 768×1024 y 390×844. Premium NO APLICA significa que el bloque comercial se oculta y se usa banner GET. La selección comercial legacy de Instituto del Sur en Monteros sigue preservada, sin alterar su plan Básico ni admitir nuevos registros normales como destacados.

| Ciudad | Header | Banner | Orientación | Expo | Premium | Instituciones | Footer | SEO | Responsive |
|---|---|---|---|---|---|---|---|---|---|
| Concepción | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Monteros | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Aguilares | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Burruyacú | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| La Ramada | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| San Miguel de Tucumán | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Alderetes | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Banda del Río Salí | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Esperanza | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Los Ralos | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Famaillá | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Graneros | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Lamadrid | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Juan Bautista Alberdi | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| La Cocha | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Bella Vista | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Santa Rosa de Leales | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Lules | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Villa Quinteros | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Simoca | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Amaicha del Valle | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Tafí del Valle | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Tafí Viejo | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| San Pedro de Colalao | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Villa Trancas | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| Yerba Buena | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |
| San Pablo | PASS | PASS | PASS | PASS | NO APLICA | PASS | PASS | PASS | PASS |

## Continuación del macrotrabajo

La extracción de las 30 páginas ya estaba finalizada; no se reimportaron duplicados para simular progreso. Se continuó integrando las 24 localidades nuevas en la experiencia completa y revalidando su catálogo. Instituciones/carreras adicionales en esta corrección: 0/0. Se conservan 27 ciudades, 93 marcas, 125 sedes, 195 carreras maestras, 198 ofertas territoriales y 128 referencias universitarias generales. Todas las 103 sedes terciarias y las 8 redes universitarias procesadas siguen representadas. Las carreras que faltan en la fuente siguen pendientes; no se inventaron.

## Pruebas y evidencia

- 8 tests nuevos (A-I agrupados), 210/210 en suite completa; suite CMS anterior incluida: 84/84. Las pruebas comprueban también una ciudad futura sin configuración ni allowlist.
- Build PASS, TypeScript integrado PASS. Lint: 0 errores, 9 advertencias anteriores por img.
- 135 vistas de ciudades, sin overflow, cortes de títulos ni errores JavaScript capturados. 25 capturas nuevas de Concepción, Aguilares, Monteros, Famaillá y Burruyacú en cinco anchos.
- Flujos reales: CTA del fallback, aviso Orientación contextual, aviso Expo contextual y Home principal con video intacto.
- Sitemap, búsqueda, filtros y relaciones siguen cubiertos por las pruebas de expansión. La comprobación HTTP/SEO anterior de 670 rutas está en GET-CATALOG-ROUTES.json; en esta corrección se volvió a verificar canonical/title de las 27 ciudades.
- Comparativa: GET-CITY-TEMPLATE-CAPTURAS.md. Evidencia automática detallada: GET-CITY-TEMPLATE-AUDIT.json.

## Archivos de esta corrección

- next-app/app/[ciudad]/CityFeaturedCareers.js
- next-app/app/[ciudad]/CityInstitutionSections.js
- next-app/lib/catalog/city-template.mjs (nuevo)
- next-app/lib/catalog/territorial-entries.json (sólo flags de las ciudades nuevas)
- next-app/scripts/prepare-territorial-catalog.mjs
- next-app/scripts/check-city-template.mjs (nuevo)
- next-app/scripts/finalize-territorial-report.mjs
- next-app/tests/city-template-consistency.test.mjs (nuevo)
- docs/catalog/GET-CITY-TEMPLATE-AUDIT.json, GET-CITY-TEMPLATE-REPORT.md y GET-CITY-TEMPLATE-CAPTURAS.md (nuevos)
- Informes GET-CATALOG-IMPORT-REPORT.json, GET-CATALOG-ARCHITECTURE-CHECKPOINT.json, GET-CATALOG-VALIDATION.json, GET-CATALOG-REPORT.md, GET-CATALOG-FILES.md y GET-CATALOG-CAPTURAS.md actualizados.

## Pendientes reales y estado

Todo continúa en localhost: el seed no está importado al CMS remoto y se desactiva en producción/Netlify. Falta revisión humana y autorización de carga/publicación futura. Persisten únicamente los faltantes/ambigüedades de oferta, contactos/cohortes y etiquetas territoriales documentados en GET-CATALOG-PENDING.md; no se intentó completarlos mediante imaginación. El filtro cityIds legacy de Orientación ya no gobierna la visibilidad de las ciudades. No se envían inscripciones reales: se mantienen los avisos próximos aprobados.

Git add NO. Commit NO. Push NO. Deploy NO. Ningún cambio anterior fue descartado.
