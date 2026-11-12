import assert from 'node:assert/strict';
import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {editorialCatalog} from '../lib/admin/editorial-model.mjs';
import {mergeTerritorialEntries} from '../lib/catalog/territorial-review.mjs';
const folder='../docs/catalog/';
const visualFolder='C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const report=await json(folder+'GET-CATALOG-IMPORT-REPORT.json');
const seed=await json('lib/catalog/territorial-entries.json');
const baseline=await json(folder+'GET-CATALOG-BASELINE.json');
const checkpoint=await json(folder+'GET-CATALOG-ARCHITECTURE-CHECKPOINT.json');
const routes=await json(folder+'GET-CATALOG-ROUTES.json');
const mobile=await json(folder+'GET-CATALOG-MOBILE.json');
const visual=await json(visualFolder+'/GET-CATALOG-VISUAL.json');
const flows=await json(visualFolder+'/GET-CATALOG-FLOWS.json');
const cityAudit=await json(folder+'GET-CITY-TEMPLATE-AUDIT.json');
assert.equal(cityAudit.views,135);
assert.ok(cityAudit.matrix.every(row=>!Object.values(row).includes('FAIL')));
const catalog=editorialCatalog(mergeTerritorialEntries(baseline.entries,seed.entries),{includeLegacy:false});
const counts={cities:catalog.cities.length,brands:catalog.brands.length,campuses:catalog.institutions.length,careerMasters:catalog.careers.length,territorialOffers:catalog.offerings.length,generalOffers:catalog.brands.reduce((n,b)=>n+(b.generalOffers?.length||0),0)};
assert.deepEqual(counts,checkpoint.before);
assert.equal(mobile.passed.length,670);assert.deepEqual(mobile.failures,[]);
assert.equal(routes.results.length,670);assert.deepEqual(visual.errors,[]);assert.deepEqual(flows.errors,[]);
assert.equal(visual.views.length,80);assert.equal(flows.flows.length,8);
for(const city of report.cities){
 const route=routes.results.find(r=>r.path===city.route);assert.ok(route);
 assert.ok(mobile.passed.includes(city.route));
 city.normal=city.institutions-city.premium;
 city.status='PASS';
 city.validation='HTTP/SEO + geometría mobile de esta ruta; revisión visual multiancho de la plantilla en ciudades representativas';
}
const imageFiles=await readdir('public/assets/catalog');
const imageBytes=(await Promise.all(imageFiles.map(async n=>(await stat('public/assets/catalog/'+n)).size))).reduce((a,b)=>a+b,0);
const validation={completedAt:new Date().toISOString(),mode:'LOCAL REVIEW ONLY',counts,architecture:'Ciudad → Institución → Carreras; /carreras transversal preservado',dataLoss:false,tests:{general:{passed:210,total:210},cms:{passed:84,total:84},territorial:{passed:13,total:13},cityTemplate:{passed:8,total:8}},sql:{passed:495,mode:'6 suites transaccionales con rollback de la etapa de expansión anterior; sin importación permanente',checks:{auth:36,editorial:24,home:21,extended:131,console:271,workspace:12}},lint:{exitCode:0,errors:0,preexistingWarnings:9},build:{exitCode:0,staticPages:113,typescript:'PASS integrado en next build',note:'El seed de revisión se desactiva deliberadamente en producción; los 113 prerenderizados pertenecen al catálogo remoto actual, no a la expansión aún local.'},routes:{tested:670,http:'PASS',canonical:'PASS',noindex:false,privateExcluded:true},responsive:{capturedViews:80,widths:[1920,1440,1366,768,390],mobileRoutes:mobile.passed.length,geometryIssues:mobile.failures,scope:'Geometría 390px en 670 rutas de la expansión anterior; control posterior de plantilla: 27 ciudades × 5 anchos, 135 vistas, 25 capturas nuevas. Medios externos bloqueados sólo en el recontrol geométrico antiguo, no en esta auditoría de ciudades.'},cityTemplate:cityAudit.matrix,flows:[...flows.flows,...cityAudit.flows],images:{families:report.images.length,files:imageFiles.length,bytes:imageBytes,method:'built-in image_gen; fotografías editoriales genéricas, no fotos institucionales reales',pending:0},git:{branch:'next-production-candidate',staged:false,commit:false,push:false,deploy:false},publication:'PENDIENTE de revisión humana e importación autorizada al CMS; no publicar directamente el seed local'};
report.validation=validation;
checkpoint.after=counts;checkpoint.countsPreserved=true;checkpoint.validation='PASS';
await writeFile(folder+'GET-CATALOG-IMPORT-REPORT.json',JSON.stringify(report,null,2)+'\n');
await writeFile(folder+'GET-CATALOG-ARCHITECTURE-CHECKPOINT.json',JSON.stringify(checkpoint,null,2)+'\n');
await writeFile(folder+'GET-CATALOG-VALIDATION.json',JSON.stringify(validation,null,2)+'\n');

const baseFiles=[
 'app/[ciudad]/CityFeaturedCareers.js','app/[ciudad]/CityInstitutionSections.js','app/[ciudad]/CityPageClient.js',
 'app/[ciudad]/[institucion]/InstitutionPageClient.js','app/[ciudad]/[institucion]/page.js',
 'app/[ciudad]/[institucion]/carreras/[carrera]/CareerPageClient.js','app/[ciudad]/[institucion]/carreras/[carrera]/page.js','app/[ciudad]/[institucion]/carreras/[carrera]/carrera.css',
 'app/components/CatalogFilters.js','app/components/catalog-filters.css','app/components/CitySelector.js','app/components/HomeMapClient.js',
 'app/carreras/page.js','app/carreras/[slug]/page.js','app/carreras/carreras.css',
 'app/instituciones/page.js','app/instituciones/[slug]/page.js','app/instituciones/InstitutionsIndexClient.js',
 'lib/admin/published-editorial.js','lib/admin/editorial-model.mjs','lib/admin/city-slider.mjs',
 'lib/public-catalog/home-map-catalog.js','lib/public-catalog/institutions-catalog.js','lib/public-catalog/careers-catalog.js',
 'tests/territorial-catalog.test.mjs','tests/city-template-consistency.test.mjs',
 'scripts/extract-territorial-pdf.py','scripts/audit-territorial-baseline.mjs','scripts/prepare-territorial-catalog.mjs','scripts/optimize-territorial-images.mjs',
 'scripts/check-territorial-visual.mjs','scripts/check-territorial-routes.mjs','scripts/check-territorial-mobile.mjs','scripts/check-city-template.mjs','scripts/finalize-territorial-report.mjs'
];
const files=[...baseFiles,...(await readdir('lib/catalog')).map(n=>'lib/catalog/'+n),...imageFiles.map(n=>'public/assets/catalog/'+n)].map(n=>'next-app/'+n);
files.push(...(await readdir(folder)).map(n=>'docs/catalog/'+n),'docs/catalog/GET-CATALOG-REPORT.md','docs/catalog/GET-CATALOG-FILES.md','docs/catalog/GET-CATALOG-CAPTURAS.md');
files.push('docs/catalog/GET-CITY-TEMPLATE-REPORT.md','docs/catalog/GET-CITY-TEMPLATE-CAPTURAS.md');
const allFiles=[...new Set(files)].sort();
await writeFile(folder+'GET-CATALOG-FILES.md','# Archivos de esta expansión territorial\n\nListado de archivos creados o ajustados en esta macrofase. El working tree contiene además trabajo anterior del CMS y del sitio que no se descartó ni se incluyó en staging. Los archivos ya modificados pueden contener hunks de fases anteriores.\n\n'+allFiles.map(n=>'- `'+n+'`').join('\n')+'\n\nLas 80 capturas y los informes del navegador están en `'+visualFolder+'`. No se modificaron las políticas RLS, las cuentas Auth ni la configuración remota.\n');
const shots=[['Concepción',2],['Ciudad nueva: Famaillá',5],['Todas las instituciones',6],['Institución nueva con carreras',7],['Institución sin carreras en la fuente',15],['Página SEO de carrera',11]];
await writeFile(folder+'GET-CATALOG-CAPTURAS.md','# Capturas de la arquitectura corregida\n\nCapturas completas a 1440 px. Las vistas de Concepción y Famaillá se actualizaron después de unificar Orientación/Expo; las demás corresponden a la expansión anterior sin cambios visuales posteriores.\n\n'+shots.map(([label,index])=>'## '+label+'\n\n![ '+label+' ]('+visualFolder+(index===2?'/city-template-1440-concepcion.png':index===5?'/city-template-1440-famailla.png':'/catalog-1440-'+index+'.png')+')\n').join('\n'));
const cityRows=report.cities.map(c=>`| ${c.name} | ${c.institutions} | ${c.offers} | ${c.missingOffers} | ${c.premium} | ${c.normal} | ${c.route} | ${c.status} |`).join('\n');
const comparison=['concepcion','aguilares','monteros','famailla'];
await writeFile(folder+'GET-CITY-TEMPLATE-CAPTURAS.md','# Comparativa de ciudades - plantilla unificada\n\nDesktop 1440×900, capturas completas. Mismos componentes y estilos; destacados comerciales sólo donde existen. Famaillá utiliza banner editorial GET y conserva Orientación/Expo/cierre.\n\n'+comparison.map(slug=>'## '+catalog.cities.find(c=>c.slug===slug).name+'\n\n!['+slug+']('+visualFolder+'/city-template-1440-'+slug+'.png)\n').join('\n')+'\nTambién se guardaron capturas de estas cuatro ciudades y Burruyacú a 1920, 1366, 768 y 390 px en la misma carpeta.\n');
const matrix=cityAudit.matrix.map(c=>`| ${c.city} | ${c.header} | ${c.banner} | ${c.orientation} | ${c.expo} | ${c.premium} | ${c.institutions} | ${c.footer} | ${c.seo} | ${c.responsive} |`).join('\n');
await writeFile(folder+'GET-CITY-TEMPLATE-REPORT.md',`# Consistencia de ciudades y continuación provincial

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
${matrix}

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
`);
const text=`# GET - Expansión territorial y corrección de arquitectura

## Estado de entrega

Listo LOCALMENTE para revisión en http://localhost:4004. No importado ni publicado en Supabase/Netlify. El seed usa el modelo editorial existente y se combina sólo en development; queda desactivado en production y Netlify. La carga futura requiere aprobación y las operaciones autorizadas del CMS, sin convertir el seed en una base paralela permanente.

## Arquitectura corregida

Ciudad → Instituciones → Institución → Carreras de esa institución. Se retiró la grilla general “Todas las carreras” del componente compartido de las homes de ciudad. /carreras, las páginas SEO, los slugs, la búsqueda y las relaciones se conservan. Conteos antes/después idénticos: 27 ciudades, 93 marcas, 125 sedes, 195 carreras maestras, 198 ofertas territoriales y 128 referencias generales universitarias.

## Resumen de incorporación

- Fuente completa: 30/30 páginas; 103 sedes terciarias con CUE-anexo distinto, 8 redes universitarias y 178 filas de oferta universitaria.
- 27 unidades territoriales según las etiquetas de la fuente: 24 nuevas y 3 existentes. Son 25 localidades/grupos del padrón más Yerba Buena y San Pablo; no se confundieron departamentos con ciudades ni se dividieron etiquetas agrupadas sin evidencia.
- 115 sedes nuevas, 125 totales; 93 instituciones/marcas. 4 sedes existentes completadas sólo en campos vacíos. Los anexos permanecen diferenciados.
- 176 carreras maestras nuevas, 195 totales. 168 ofertas territoriales nuevas, 198 totales. Además, 128 referencias generales universitarias sin atribución ficticia a sedes.
- 71 sedes terciarias no informan carreras. 11 sedes universitarias carecen de atribución territorial suficiente. El total 83 sin ofertas académicas territoriales incluye un centro previo con capacitaciones: no significa 83 instituciones sin contenido educativo.
- 21 imágenes editoriales generadas, 42 WebP optimizados, ${imageBytes} bytes en total. No representan edificios reales ni logotipos inventados. Prompts/escenas y procedencia en GET-CATALOG-IMAGE-SOURCES.json; tamaños en GET-CATALOG-IMAGES.json. Imágenes pendientes: 0.

## Comercial

Todo contenido nuevo es Normal, con premium/featured false. Los 5 planes Premium previos, sus ofertas y las selecciones comerciales explícitas anteriores se preservaron. Caso legacy documentado: Instituto del Sur conserva su selección destacada previa aunque su plan se llama Básico; se respeta el mecanismo comercial equivalente existente, sin cambiarle el plan ni destacar nuevos registros normales. Todas las instituciones incluye normales y Premium; ciudades sin selección Premium no se rellenan artificialmente.

## Por ciudad

Carreras = ofertas académicas territoriales, no títulos únicos. Sin oferta = sedes del PDF sin carrera territorial atribuible. Premium = plan explícito Premium; la excepción comercial previa de Instituto del Sur se explica arriba. PASS acredita HTTP/SEO y geometría mobile de la ruta; la revisión visual multiancho se hizo en plantillas representativas, no manualmente en cada una de las 670 páginas.

| Ciudad | Sedes | Ofertas | Sin oferta | Premium | Normal/no Premium | Ruta | Estado |
|---|---:|---:|---:|---:|---:|---|---|
${cityRows}

## SEO, búsqueda e imágenes

670 URLs del sitemap local respondieron 200 y con canonical esperado. Admin, drafts y previews quedan fuera. Los metadatos nuevos se basan en nombre, ciudad y datos disponibles; sin afirmaciones comerciales inventadas. Las ofertas universitarias generales usan “Sede a consultar” y no se trasladan a todas las localidades. Búsqueda por ciudad, institución y carrera, tolerante a tildes y consultas como “Dónde estudiar inglés”; filtros y paginación de directorios con proyecciones compactas, sin cargar planes de estudio completos al cliente. El mapa mantiene su geometría departamental existente, sin inventar coordenadas. Los enlaces de ubicación usan direcciones fuente; no se afirma precisión geocodificada de cada pin.

## Validaciones

- Suite completa: 210/210; CMS: 84/84; expansión: 13/13; consistencia de ciudades: 8/8.
- SQL: 495 comprobaciones en 6 suites con rollback. Sin cambios permanentes de fixtures, Auth ni políticas.
- npm run lint: PASS, 0 errores y 9 warnings preexistentes no-img-element. Node también avisa MODULE_TYPELESS_PACKAGE_JSON en datos heredados, sin fallar las pruebas.
- npm run build: PASS; TypeScript integrado: PASS; 113 páginas prerenderizadas del catálogo remoto actual. No son el conteo de la expansión local desactivada en producción.
- 80 capturas de 16 rutas a 1920×1080, 1440×900, 1366×768, 768×1024 y 390×844. Sin overflow ni errores JavaScript capturados en ese recorrido.
- Corrección posterior de plantilla: 27 ciudades a esos mismos cinco anchos (135 vistas), 25 capturas nuevas. Header, banner, Orientación global, Expo, catálogo, cierre y footer consistentes; sin Premium falso, grilla general de carreras ni overflow. Matriz en GET-CITY-TEMPLATE-AUDIT.json.
- Geometría mobile: 670/670. Se conserva el informe inicial con fallos de navegación del navegador y cortes de títulos; el recontrol usó contexto nuevo por ruta. Ajuste mínimo: min-width:0 y overflow-wrap en encabezados de carrera, sin cambiar fuentes/tamaños/textos. En el control geométrico de reintento se bloquearon medios externos, pero se permitieron las fuentes.
- 8 flujos reales de navegador: búsqueda de institución, ciudad sin tilde, consulta natural, filtro carrera/ciudad, Concepción → IES → expandir carreras, Concepción → Santa Bárbara → expandir carreras, Radiología global y Arquitectura general sin atribuir campus.
- git diff --check: PASS; staging vacío. Rama next-production-candidate. Ningún git add/commit/push/deploy.

## Pendientes y límites

1. Revisión humana local y posterior autorización/importación al CMS antes de publicar; actualmente el administrador remoto no tiene los 569 documentos nuevos.
2. Completar ofertas ausentes con fuentes reales; lista por sede en GET-CATALOG-PENDING.md. Dos filas UNSTA contienen código UC o modalidades contradictorias: preservadas sin inventar la interpretación faltante.
3. Verificar vigencia de contactos/cohortes de la fuente antes de una publicación definitiva. Se conservaron denominaciones académicas dudosas, CCC y titulaciones compuestas, sin fusionarlas por parecido.
4. Revisar territorialmente las etiquetas agrupadas Esperanza/Delfín Gallo y Banda del Río Salí/Lastenia si se decide desagregarlas; la fuente original queda en sourceLocality.
5. Fotos reales institucionales podrán reemplazar las ilustraciones editoriales cuando estén disponibles. No se hicieron envíos reales de formularios, WhatsApp ni campañas, ni pruebas de aceptación CMS A-F de otras etapas.

## Evidencia y archivos

GET-CATALOG-IMPORT-REPORT.json contiene el manifest por entidad y las decisiones de deduplicación. GET-CATALOG-VALIDATION.json resume pruebas y alcances; GET-CATALOG-ARCHITECTURE-CHECKPOINT.json acredita que no se perdieron registros. GET-CATALOG-FILES.md enumera los archivos de esta macrofase. GET-CATALOG-CAPTURAS.md muestra las seis vistas solicitadas. El working tree mantiene también los cambios anteriores; no se descartó ni staged nada.
`;
await writeFile(folder+'GET-CATALOG-REPORT.md',text);
console.log(JSON.stringify({counts,cities:report.cities.length,files:allFiles.length,validation:validation.tests,mobile:mobile.passed.length,images:validation.images},null,2));
