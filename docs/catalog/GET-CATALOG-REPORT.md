# GET - Expansión territorial y corrección de arquitectura

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
- 21 imágenes editoriales generadas, 42 WebP optimizados, 1988498 bytes en total. No representan edificios reales ni logotipos inventados. Prompts/escenas y procedencia en GET-CATALOG-IMAGE-SOURCES.json; tamaños en GET-CATALOG-IMAGES.json. Imágenes pendientes: 0.

## Comercial

Todo contenido nuevo es Normal, con premium/featured false. Los 5 planes Premium previos, sus ofertas y las selecciones comerciales explícitas anteriores se preservaron. Caso legacy documentado: Instituto del Sur conserva su selección destacada previa aunque su plan se llama Básico; se respeta el mecanismo comercial equivalente existente, sin cambiarle el plan ni destacar nuevos registros normales. Todas las instituciones incluye normales y Premium; ciudades sin selección Premium no se rellenan artificialmente.

## Por ciudad

Carreras = ofertas académicas territoriales, no títulos únicos. Sin oferta = sedes del PDF sin carrera territorial atribuible. Premium = plan explícito Premium; la excepción comercial previa de Instituto del Sur se explica arriba. PASS acredita HTTP/SEO y geometría mobile de la ruta; la revisión visual multiancho se hizo en plantillas representativas, no manualmente en cada una de las 670 páginas.

| Ciudad | Sedes | Ofertas | Sin oferta | Premium | Normal/no Premium | Ruta | Estado |
|---|---:|---:|---:|---:|---:|---|---|
| Concepción | 10 | 40 | 5 | 2 | 8 | /concepcion | PASS |
| Monteros | 11 | 18 | 5 | 1 | 10 | /monteros | PASS |
| Aguilares | 5 | 18 | 1 | 2 | 3 | /aguilares | PASS |
| Burruyacú | 1 | 0 | 1 | 0 | 1 | /burruyacu | PASS |
| La Ramada | 1 | 0 | 1 | 0 | 1 | /la-ramada | PASS |
| San Miguel de Tucumán | 58 | 67 | 43 | 0 | 58 | /san-miguel-de-tucuman | PASS |
| Alderetes | 1 | 3 | 0 | 0 | 1 | /alderetes | PASS |
| Banda del Río Salí | 3 | 1 | 2 | 0 | 3 | /banda-del-rio-sali | PASS |
| Esperanza | 1 | 0 | 1 | 0 | 1 | /esperanza | PASS |
| Los Ralos | 1 | 0 | 1 | 0 | 1 | /los-ralos | PASS |
| Famaillá | 4 | 5 | 3 | 0 | 4 | /famailla | PASS |
| Graneros | 2 | 0 | 2 | 0 | 2 | /graneros | PASS |
| Lamadrid | 1 | 0 | 1 | 0 | 1 | /lamadrid | PASS |
| Juan Bautista Alberdi | 3 | 6 | 2 | 0 | 3 | /juan-bautista-alberdi | PASS |
| La Cocha | 1 | 1 | 0 | 0 | 1 | /la-cocha | PASS |
| Bella Vista | 2 | 2 | 1 | 0 | 2 | /bella-vista | PASS |
| Santa Rosa de Leales | 1 | 0 | 1 | 0 | 1 | /santa-rosa-de-leales | PASS |
| Lules | 2 | 2 | 1 | 0 | 2 | /lules | PASS |
| Villa Quinteros | 1 | 4 | 0 | 0 | 1 | /villa-quinteros | PASS |
| Simoca | 2 | 5 | 1 | 0 | 2 | /simoca | PASS |
| Amaicha del Valle | 2 | 0 | 2 | 0 | 2 | /amaicha-del-valle | PASS |
| Tafí del Valle | 1 | 0 | 1 | 0 | 1 | /tafi-del-valle | PASS |
| Tafí Viejo | 3 | 6 | 1 | 0 | 3 | /tafi-viejo | PASS |
| San Pedro de Colalao | 1 | 0 | 1 | 0 | 1 | /san-pedro-de-colalao | PASS |
| Villa Trancas | 4 | 1 | 3 | 0 | 4 | /villa-trancas | PASS |
| Yerba Buena | 2 | 19 | 1 | 0 | 2 | /yerba-buena | PASS |
| San Pablo | 1 | 0 | 1 | 0 | 1 | /san-pablo | PASS |

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
