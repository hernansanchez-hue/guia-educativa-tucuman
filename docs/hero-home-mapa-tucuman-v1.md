# Hero Home con mapa departamental de Tucumán v1

## Alcance y referencia

Se rediseñó exclusivamente `/` siguiendo la composición de la imagen de referencia recibida el 24-09-2026: fotografía de fondo, identidad GET, título, búsqueda, mapa a la izquierda y panel informativo a la derecha. No se implementó el cuadro tipo Google Maps de la referencia, calles, tiles ni imágenes de mapas ficticios. `/ciudades` conserva su `HomeClient` anterior; no se alteraron páginas internas ni el resto del sitio.

## Geografía y licencia

- Fuente: [GeoRef Argentina, descarga de la base completa](https://www.argentina.gob.ar/georef/descarga-de-la-base-completa), con geometrías de departamentos provistas por IGN. Archivo de origen: `departamentos.ndjson`, versión **13.0.0**, creado **2026-04-09 23:30:31 UTC** según el encabezado del archivo descargado.
- Licencia del [dataset de GeoRef](https://portal-andino.datos.gob.ar/dataset/servicio-normalizacion-datos-geograficos): **Creative Commons Attribution 4.0 (CC BY 4.0)**. La atribución también aparece en el hero.
- Se extrajeron los 17 registros con `provincia.id = "90"`, usando `id`, `nombre` y `geometria` (`MultiPolygon`). No se dibujaron polígonos manualmente.
- El recurso público es `next-app/public/assets/tucuman-departamentos.geojson`. Para limitar la descarga a unos 363 KB, `next-app/scripts/generate-tucuman-departments.mjs` aplica simplificación cartográfica Ramer–Douglas–Peucker de **0.00015°** y redondeo a 6 decimales, preservando cierres de anillos. La transformación es reproducible a partir del NDJSON oficial. No se editaron vértices a mano.
- Departamentos: Burruyacú, Cruz Alta, Chicligasta, Famaillá, Graneros, Juan Bautista Alberdi, La Cocha, Leales, Lules, Monteros, Río Chico, Capital, Simoca, Tafí del Valle, Tafí Viejo, Trancas y Yerba Buena.
- Se usan códigos oficiales, no coincidencia textual sensible a acentos: Concepción → `90021` Chicligasta; Monteros → `90070` Monteros; Aguilares → `90077` Río Chico. La relación está aislada en `CITY_DEPARTMENT_IDS`; una ciudad pública futura sin vínculo produce error explícito en lugar de asignación incorrecta.

## Catálogo y conteos

`home-map-catalog.js` unifica ambas fuentes en la misma estructura. En local, toma las ciudades de `cityPages`, únicamente `institutionIds` de cada ciudad (no los destacados visuales, que pueden incluir sedes cruzadas), y las ofertas académicas `visible` con carrera maestra. En Supabase, consulta ciudades, instituciones, carreras maestras y ofertas académicas por el lector público existente y filtra activos, maestros publicados y ofertas visibles/publicadas, además de la RLS vigente. Los UUID se usan solo durante los joins en servidor; no llegan al componente.

Los conteos son cantidades de **ofertas académicas** (no carreras maestras únicas ni capacitaciones), agregadas por ciudad y departamento. No hay cifras manuales en el hero. Para el catálogo local actual: **3 ciudades, 10 instituciones, 30 ofertas académicas**; Chicligasta 1/3/10, Monteros 1/4/10, Río Chico 1/3/10. Estos números son resultados de validación, no constantes del código.

No se agregó `department_id` remoto: el mapeo local por slug es una adaptación mínima para las tres ciudades actuales y no altera Supabase. Si se suman ciudades, habrá que asignarles un código oficial antes de publicarlas; una futura columna `cities.department_id` podría reemplazar esta capa, con migración y seed revisados por separado. **Supabase remoto no fue modificado**.

## Interacción

- Estado inicial: resumen provincial calculado.
- Desktop: hover de cualquier departamento actualiza el panel. Click en departamento con una ciudad navega a `/<ciudad>`; sin ciudades selecciona y muestra “Próximamente en GET”; con dos o más muestra “Elegí una ciudad” y enlaces individuales.
- Touch: primer tap siempre selecciona y muestra el panel; una ciudad se abre desde su CTA, no mediante navegación automática. Teclado: foco y Enter/Espacio seleccionan, con enlace posterior.
- Búsqueda: texto normalizado sin acentos, entre ciudades, instituciones y ofertas académicas activas. Enter abre el primer resultado; las opciones ofrecen rutas públicas existentes. No se modificó el buscador de `/ciudades`.
- Cada polígono tiene nombre accesible y estado de selección; los departamentos sin cobertura no muestran cursor de navegación. Los 17 están presentes y el mapa no tiene etiquetas permanentes.

## Responsive y verificación

Se inspeccionó en Edge la Home a **1440×900**, **1366×768** y **390×843** de viewport CSS dentro de un marco temporal de prueba (retirado después). En 1440, `clientWidth=scrollWidth=1440`; en 1366, `clientWidth=scrollWidth=1366`; en móvil, `innerWidth=390`, `innerHeight=843`, `clientWidth=scrollWidth=373` por la barra vertical. No hubo overflow horizontal. En 1366×768 se compactó el espacio vertical para conservar el mapa y el panel en el primer viewport. En móvil se apilan título, buscador, mapa y panel, con desplazamiento vertical normal.

Se verificó en navegador el panel provincial, selección de Burruyacú sin cobertura, selección por teclado de Chicligasta con CTA a Concepción y búsqueda de “Contador” con resultados de las tres sedes. El caso de varias ciudades y la política touch se validaron en pruebas de la función de interacción con datos simulados, sin alterar el catálogo. Las rutas de Concepción, Monteros y Aguilares no se cambiaron.

Pruebas: `node --test --test-isolation=none tests/home-map-catalog.test.mjs tests/home-catalog.test.mjs tests/cities-catalog.test.mjs tests/public-routes-catalog.test.mjs` (**21/21**, incluidas 6 pruebas nuevas). `npm run lint` sin errores (cinco advertencias preexistentes de `<img>` fuera del hero). `npm run build` local correcto, **56 páginas**. `git diff --check` correcto. Supabase real no se consultó en esta sesión porque faltan `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`; su adaptación se verificó con respuesta pública simulada, filtrado y ausencia de UUID en props. No se cambiaron dependencias ni variables.

## Archivos de esta etapa

- `next-app/app/page.js`
- `next-app/app/components/HomeMapClient.js`
- `next-app/app/home-map.css`
- `next-app/lib/public-catalog/home-map-catalog.js`
- `next-app/lib/public-catalog/home-map-interaction.js`
- `next-app/public/assets/tucuman-departamentos.geojson`
- `next-app/scripts/generate-tucuman-departments.mjs`
- `next-app/tests/home-map-catalog.test.mjs`
- `docs/hero-home-mapa-tucuman-v1.md`

Los cambios de trabajo que ya existían antes de esta etapa se conservaron. No se hizo commit.
