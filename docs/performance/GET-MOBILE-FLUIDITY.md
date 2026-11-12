# GET — auditoría de fluidez mobile

22 de octubre de 2026. Cambios locales; sin staging, commit, push ni deploy. Se preservó el working tree previo y la adaptación visual GET.

## Método

- Build de producción local, no `next dev`. Edge headless, escala 2 y CPU ×4.
- 390×844: 1,6 Mbps descarga / 750 kbps subida / 150 ms latencia. 360×800: 9 Mbps / 1,5 Mbps / 60 ms.
- Ocho rutas prioritarias con caché fría del navegador; cuatro con caché caliente y cuatro con el segundo perfil. La misma matriz se repitió antes/después. El caché de variantes de imagen del servidor estaba disponible en la pasada final, como en un CDN con variantes generadas.
- Ventana de carga de 16 s y desplazamiento sintético con rAF. Los recursos externos no se bloquearon en la comparación. No se enviaron formularios ni se usaron cuentas administrativas.
- LCP/FCP/CLS: PerformanceObserver. Bloqueo aproximado: suma de `duration - 50 ms` de las long tasks posteriores a FCP en la ventana. **No es el TBT oficial de Lighthouse.** Interacción: muestra Event Timing, **no INP de usuarios reales**. Speed Index no disponible.
- Son muestras de laboratorio, no una prueba en teléfono físico ni una garantía de Core Web Vitals de campo. Video, CDN, tráfico y carga del equipo introducen variación. La prueba de scroll con rAF no equivale al scroll táctil de un dispositivo real.
- `production.json` conserva cuatro rutas del sitio publicado como referencia inicial, no como resultado de estos cambios sin deploy.

## Causas y correcciones

1. **Imágenes sobredimensionadas:** logo común de 9077×5421 px para unos 134 px de ancho visible; logo Home de 4501×4500 para 160 px. El mismo asset ahora se entrega mediante Next Image, con `sizes`, WebP y dimensiones reservadas. Se conservaron encuadre, colores, geometría y archivos originales.
2. **Medios fuera de pantalla:** imágenes inferiores sin lazy loading y cuatro videos Premium que se iniciaban antes de verse. Ahora las imágenes de Orientación, Expo, tarjetas y galería son lazy. Los videos se preparan a 200 px del viewport, se reproducen al acercarse y se pausan al alejarse/ocultar la pestaña. Se conservan sus fuentes y posters. La galería se pausa fuera de pantalla.
3. **Slider sin preparación:** cambiaba el src/background cada 3 s sin esperar descarga/decodificación. Ahora se prepara solamente el siguiente slide, se espera `decode()` y se conserva el actual ante un fallo. Mantiene intervalo nominal, swipe, textos y destinos; se pausa fuera de pantalla, en pestaña oculta y con reduced motion. Los dos `object-position` añadidos al CSS conservan el encuadre anterior.
4. **Prefetch de fichas no abiertas:** los directorios disparaban solicitudes RSC y preloads de imágenes de los destinos. Se desactiva exclusivamente en las tarjetas de esos listados; no globalmente. Se comprobó ausencia de RSC previo al clic y navegación correcta al tocar las tarjetas.
5. **Parallax SEO:** escribía ocho variables heredadas en todo el escenario por frame. Ahora actualiza directamente siete elementos con las mismas fórmulas, omite posiciones repetidas y evita frames en pestañas ocultas. Conserva animaciones CSS, velocidad, colores, listener pasivo, cleanup y reduced motion.
6. **Home:** el video observado es 3840×2160 y transfiere varios MB inicialmente. Solo se pausa/reanuda al ocultar/mostrar la pestaña; no se sustituyó ni se redujo calidad.
7. **JS/terceros:** la baseline envió unos 341–346 KB de JS comprimido, incluidos unos 181 KB de Analytics. El soporte de imágenes agrega pocos KB en rutas que antes no usaban Next Image; no se presenta como reducción del bundle. Se redujeron descargas/trabajo especulativo. Analytics permanece intacto.

## Resultados finales

390×844, CPU ×4, 4G limitada y caché fría del navegador. Son muestras, no medianas de múltiples ejecuciones por ruta. KB/MB decimales.

| Ruta | LCP antes → final | Bytes antes → final | Bloqueo aprox. antes → final | CLS antes → final |
|---|---:|---:|---:|---:|
| `/` | 1,368 → 1,232 s | 7,479 → 8,462 MB | 1330 → 1826 ms | 0,0037 → 0,0031 |
| `/concepcion` | 4,848 → 1,876 s | 1,673 → 0,845 MB | 1811 → 1420 ms | 0,0212 → 0,0212 |
| `/san-miguel-de-tucuman` | 4,540 → 2,948 s | 1,199 → 0,644 MB | 1386 → 1397 ms | 0,0015 → 0,0018 |
| `/instituciones` | 3,684 → 2,004 s | 1,257 → 0,564 MB | 2437 → 1525 ms | 0,0614 → 0 |
| `/concepcion/universidad-siglo-21` | 6,312 → 2,156 s | 3,066 → 0,515 MB | 2578 → 900 ms | 0,0193 → 0 |
| `/concepcion/ies-concepcion` | 7,180 → 4,124 s | 1,434 → 0,741 MB | 1789 → 1976 ms | 0,0009 → 0 |
| `/carreras` | 1,560 → 1,444 s | 1,189 → 0,522 MB | 1866 → 710 ms | 0,0238 → 0,0227 |
| `/concepcion/universidad-siglo-21/carreras/abogacia` | 3,124 → 1,908 s | 0,914 → 0,510 MB | 1750 → 1446 ms | 0 → 0,0033 |

Detalle de Concepción:

| Métrica | Antes | Final | Cambio |
|---|---:|---:|---|
| LCP | 4848 ms | 1876 ms | −61,3% |
| FCP | 1896 ms | 1840 ms | −3,0% |
| CLS | 0,0212 | 0,0212 | sin cambio, bajo 0,10 |
| Bloqueo aproximado | 1811 ms | 1420 ms | −21,6%; sigue siendo elevado |
| Interacción muestreada | 152 ms | 88 ms | no equivale a INP de campo |
| Transferencia | 1.672.545 B | 844.742 B | −49,5% |
| Requests | 35 | 36 | +1; no se redujeron en todas las rutas |
| JS transferido | 345.543 B | 353.027 B | +7484 B por soporte compartido de imágenes/parallax |
| Imágenes | 1.221.440 B | 384.784 B | −68,5% |
| p95 de frame en scroll sintético | 33,4 ms | 16,8 ms | mejora en esta muestra; no uniforme en todo el sitio |

Los directorios sí redujeron requests: Instituciones 36→30 y Carreras 39→30. Sus imágenes bajaron de 804.551→117.311 B y 722.699→66.499 B respectivamente. La Home mantiene una transferencia muy alta por el video; el volumen recibido en la ventana varía con su buffering y no se presenta como mejora de peso total.

LCP final con caché caliente: Home 480 ms; Concepción 532 ms; Instituciones 1476 ms; ficha Abogacía 864 ms. Instituciones caliente empeoró frente a la muestra anterior de 812 ms; no se oculta esa variación. La interacción muestreada caliente de Concepción llegó a 208 ms, de modo que no se certifica un INP ≤200 ms.

Seis de las ocho rutas quedaron bajo 2,5 s de LCP en esta muestra fría. San Miguel e IES siguen por encima. El scroll no mejoró uniformemente: en Carreras el p95 fue 33,4→66,8 ms, y en la institución Premium 66,5→66,8 ms. No se certifica fluidez completa en todos los casos.

Evidencia exacta: `before.json` frente a `final.json`. `after.json` es la pasada intermedia y no se confunde con la final. La matriz 360×800 y todos los recursos, eventos y long tasks quedan en los JSON.

## Inventario de imágenes críticas

Pesos de archivo; los bytes transferidos incluyen headers y pueden variar por formato negociado.

| Recurso y uso | Dimensiones originales | Original | Variante mobile observada |
|---|---:|---:|---|
| `get-city-footer-logo.png`, header/footer | 9077×5421 | 406.477 B | candidato 384 px, WebP, unos 10.466 B en header; footer lazy con `sizes` propio |
| `get-logo-hero-white.png`, Home | 4501×4500 | 191.536 B | candidato 384 px, WebP, unos 11.048 B |
| `get-logo-oficial.png`, variante compacta | 5225×5225 | 7.296.786 B | no se descargó en la muestra prioritaria; variante preparada para optimización |
| Unsplash `photo-1509062522246-3755977927d7`, hero ciudad/ficha | 1200×747 | 62.775 B | WebP, unos 47.884 B; se conserva el detalle del recorte alto |
| Unsplash `photo-1498243691581-b145c3f54a5a`, Siglo 21 | 1200×800 | 83.145 B | hero candidato 1080 px, unos 54.252 B; miniatura 640 px, unos 28.604 B |
| Unsplash `photo-1517486808906-6ca8b3f04846`, Orientación | 1100×1422 | 132.396 B | candidato 750 px, unos 49.466 B, lazy |
| Unsplash `photo-1519389950473-47ba0277781c`, Expo | 1200×800 | 116.383 B | candidato 750 px, unos 44.278 B, lazy |
| Unsplash `photo-1568792923760-d70635a89fdc`, IES | 1200×800 | 299.692 B | hero candidato 1080 px, unos 173.227 B; galería 640 px, lazy |
| `institution-neutral.webp`, banner editorial | 1200×800 | 92.154 B | unos 80.982 B en hero y 42.755 B en tarjeta |

El parámetro `w` es el candidato solicitado, no necesariamente el ancho físico de salida: Next no amplía un original menor. Un hero alto con `cover` necesita más resolución que el ancho estrecho del teléfono. No se sobrescribió ningún asset. `image-inventory.json` conserva fuentes, dimensiones, transferencias y cabeceras.

## Resto de la auditoría

- DOM inicial de 111–620 elementos; los directorios ya paginan de a 24. Sin evidencia para agregar paginación o virtualización.
- No se encontró un scroll handler que actualice toda la página mediante React. No se añadieron memoizaciones generales ni migraciones masivas de componentes.
- Los fondos ya reducen elementos en mobile y ambos soportan reduced motion. No se eliminaron efectos. Un control diagnóstico con animación SEO pausada mejoró el p95 de scroll, pero esa muestra aislada no demuestra por sí sola rendimiento en un teléfono real.
- Maps ya era lazy y tenía espacio reservado. Se conservaron dirección, mapa y enlaces.
- Poppins/Geist y sus pesos permanecen iguales. Se descargaron 3–6 fuentes en la muestra, no todos los pesos declarados. No se cambió tipografía.
- Caché: las variantes locales observadas tienen `max-age=14400`; las remotas heredan el TTL del proveedor. No se cambió Netlify/CDN ni se agregó caché larga a nombres de archivo reemplazables.
- No se afirma que se hayan eliminado todos los tirones: el video Home, fondos y terceros siguen consumiendo recursos. Se reportan también las métricas sin mejora.

## Validaciones

- 82/82 tests relevantes: imágenes, navegación, consistencia de ciudades, catálogos y mapa Home.
- Lint exit 0, con 9 advertencias preexistentes de `<img>` en Nosotros, Servicios y Cursos Docentes; sin advertencias nuevas.
- TypeScript integrado de Next aprobado. Proyecto JavaScript con `jsconfig.json`, sin `tsconfig.json` independiente.
- Build final exit 0 y 400/400 páginas. Hubo interrupciones previas por el recordatorio de seguridad de Next; no por errores de compilación.
- HTTP 200, sin imágenes visibles rotas ni overflow a 390×844 y 360×800 en las ocho rutas. Ciudad, institución y ficha también verificadas a 768×1024 y 1440×900.
- Videos Premium: sin fuente inicial fuera de pantalla; reproducción real `readyState=4`, `paused=false`, `muted=true` al acercarse, y pausa al alejarse.
- Slider: todas las selecciones con imagen completa; autoplay detenido 6,5 s fuera de pantalla; reduced motion detenido 3,5 s.
- Parallax: transformación equivalente comprobada y reset correcto con reduced motion.
- Directorios: cuatro combinaciones ruta/ancho con cero RSC previo al clic y navegación efectiva.
- Sin envío de consultas ni cambios de leads, datos, contenido, Auth o RLS.

## Cambios pendientes de aprobación

| Problema | Propuesta | Mejora esperada | Posible cambio visible/funcional |
|---|---|---|---|
| Video Home 4K | Preparar una versión responsive del mismo video y compararla | Menos descarga, memoria y decodificación | Requiere aprobar detalle tras el recorte vertical; no implementado |
| Fondos animados continuos | Probar una variante mobile de menor frecuencia/coste | Más margen de GPU/CPU al desplazar | Puede variar ligeramente el movimiento; no se eliminaron efectos |
| Ejecución de Analytics | Evaluar carga tras idle/interacción | Menor competencia con la carga inicial | Puede cambiar la medición de visitas breves; no implementado |

## Seguridad y localhost

`npm audit --omit=dev --json` informa Next 16.4.0 con avisos críticos/alto y propone 16.4.2. Fuentes oficiales:

- https://github.com/advisories/GHSA-2464-fhr4-w9xw — optimización de imágenes, dependencia upstream y Linux glibc.
- https://github.com/advisories/GHSA-p3m5-59mp-jv5r — Server Actions / denegación de servicio.
- https://github.com/advisories/GHSA-673q-mjm6-r5xr — determinadas funciones `use cache` con typed arrays.

No se comprobó explotación ni se afirma que todos esos escenarios estén presentes en GET. Se recomienda actualizar/verificar antes de publicar. No se modificaron dependencias ni lockfile.

Servidor final: `http://127.0.0.1:4004` / `http://localhost:4004`, limitado a loopback. No se cambió el firewall. Tras resolver el aviso, para la misma Wi-Fi: `npm run start -- --port 4004 --hostname 0.0.0.0`; IP detectada `192.168.1.89` (puede cambiar), URL `http://192.168.1.89:4004/concepcion`. Esa exposición LAN no quedó habilitada.

## Archivos de esta tarea

Modificados bajo `next-app/`:

- `app/[ciudad]/CityFeaturedCareers.js`
- `app/[ciudad]/CityInstitutionSections.js`
- `app/[ciudad]/[institucion]/InstitutionPageClient.js`
- `app/[ciudad]/[institucion]/carreras/[carrera]/CareerPageClient.js`
- `app/[ciudad]/ciudad.css` — dos declaraciones para conservar el encuadre; conserva el diff de marca previo.
- `app/components/CatalogFilters.js`
- `app/components/HomeMapClient.js`
- `app/components/PublicFooter.js`
- `app/components/PublicHeader.js`
- `app/components/SeoAuroraBackground.js`
- `next.config.mjs` — allowlist de proveedores públicos; conserva la configuración anterior.
- `tests/city-template-consistency.test.mjs` — el render aislado usa la configuración real de imágenes.

Creados:

- `next-app/app/components/PublicImage.js`
- `next-app/app/components/useViewportActivity.js`
- `next-app/lib/public-image.mjs`
- `next-app/tests/public-image.test.mjs`
- `docs/performance/GET-MOBILE-FLUIDITY.md`

Los cambios previos en `globals.css`, `catalog-filters.css`, `public-footer.css`, `.gitignore`, `AGENTS.md`, CMS, documentación y SQL se conservaron. No son cambios nuevos de esta auditoría. Tampoco se modificaron datos, paquete o lockfile.

## Evidencias reproducibles

Directorio: `C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/mobile-performance/`.

- `before.json`: baseline original, 16 navegaciones.
- `after.json`: comparación intermedia, 16 navegaciones.
- `final.json`: build final con la misma matriz.
- `production.json`: cuatro rutas del sitio publicado, solo baseline.
- `image-inventory.json`: dimensiones, pesos, variantes y caché.
- `diagnostic-profile.json`: controles aislados de CPU; no son cambios del sitio.
- `acceptance.json`: validación funcional y responsive.
- `directory-check.json`: navegación y ausencia de prefetch previo al clic.
- Capturas antes/después mobile y a 768/1440 px.

Los scripts están en el directorio padre. No se instalaron librerías en el proyecto para medir.
