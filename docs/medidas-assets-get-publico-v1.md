# Auditoría de medidas de assets — GET público V1

Fecha de auditoría: 2026-09-23
Alcance: aplicación pública de `next-app`, en su estado actual de `master`.

## Método y alcance

Se revisaron las rutas públicas `/`, `/ciudades`, `/[ciudad]`, `/[ciudad]/[institucion]`, las fichas de carrera y capacitación, `/cursos-docentes`, `/nosotros` y `/contacto`; además de `PublicHeader`, `PublicFooter`, selectores, carruseles y cards compartidas. Las medidas de render son aproximadas y derivan de las reglas CSS vigentes para desktop de referencia (1440 px) y móvil (390 px), no de un recorte arbitrario.

El catálogo entrega imágenes remotas mediante los campos de ciudad, institución, offering, carrera, capacitación y curso docente. La app no redimensiona ni genera variantes: quien publique un asset debe entregar un original ya preparado para el slot. Las imágenes remotas se renderizan con `<img>` o `background-image`; los recortes indicados son efectivos en el navegador.

## Tabla de espacios visuales

| Página | Componente / uso | Tipo | Ratio de render | Render desktop aprox. | Render móvil aprox. | Fuente recomendada / mínimo | Formato y peso sugerido | Fit / crop y notas |
|---|---|---|---|---:|---:|---|---|---|
| Todas excepto Home y hero de ciudad | `PublicHeader` / logo GET claro | Logo | recorte de master 1:1 a ventana horizontal | 104 × 40 px | 104 × 40 px | 800 × 800 / 400 × 400 px | PNG transparente; ideal < 200 KB | Se usa `get-logo-oficial.png` dentro de una ventana con `overflow:hidden`; no convertirlo en logo horizontal sin ajustar CSS. Dejar 15–20% de aire y no ubicar texto crítico cerca de los bordes. |
| Todas excepto Home y hero de ciudad | `PublicHeader` y `PublicFooter` / logo GET oscuro | Logo | recorte de master 1:1 a ventana horizontal | 104 × 50 px en oscuro | 104 × 50 px | 800 × 800 / 400 × 400 px | PNG transparente; ideal < 200 KB | `get-logo-hero-blanco-dorado.png`; conserva transparencia y contraste para fondos oscuros. Se reutiliza también en Home. |
| `/` | `HomeClient` / marca superior | Logo | recorte de master 1:1 a ventana horizontal | 104 × 52 px | 104 × 52 px | 800 × 800 / 400 × 400 px | PNG transparente; ideal < 200 KB | Mismo asset oscuro del header. Está sobre video/fondo oscuro: no usar versión azul oscura sin contraste. |
| `/[ciudad]` | `PublicHeader` variante `city-hero` / marca | Logo | recorte de master 1:1 a ventana horizontal | 112 × 57 px | 90 × 46 px | 800 × 800 / 400 × 400 px | PNG transparente; ideal < 200 KB | Usa el logo oficial y crop posicionado por CSS. Mantener la figura y estrella dentro de la zona central; fondo transparente. |
| `/` | `HomeClient` / fondo principal | Video hero | pantalla completa, cover | hasta 1440 × 900 px (100vw × 100svh) | 390 × 843 px (100vw × 100svh) | 1920 × 1080 para archivo horizontal; entregar además 1080 × 1920 si se desea un encuadre móvil distinto. Mínimo 1280 × 720 / 720 × 1280 | MP4 H.264; WebM opcional; 3–8 MB ideal, máximo práctico 10 MB | `<video>` con `autoplay`, `muted`, `loop`, `playsInline`, `preload=auto`, `object-fit:cover` y posición centrada. Puede perder laterales en móvil y arriba/abajo en desktop. No hay `poster` ni fallback visual adicional configurado: el primer frame debe ser usable y no contener texto crítico. Duración ideal 8–20 s, movimiento discreto. |
| `/ciudades` | `HomeClient` + `CitySelector` / selector | Sin media raster | — | — | — | — | — | No hay imágenes, thumbnails ni video; íconos son SVG inline. |
| `/[ciudad]` | `CityFeaturedCareers` / fondo del hero de carrera activa | Hero / background | variable; caja 100vw de alto | aprox. 1440 × 710 px | 390 × 560–700 px según contenido | 1920 × 1080 / 1440 × 810 px; si se prepara móvil, 1080 × 1350 o 1080 × 1920 | WebP o JPEG; ideal < 700 KB, máximo 1 MB | `background-size:cover`, `background-position:center`; overlay oscuro fuerte. Se pierde contenido lateral en móvil y vertical en desktop; dejar rostros, logos y objetos importantes en el 55% central, sin texto incrustado. Reutiliza `career.image`. |
| `/[ciudad]` | `CityFeaturedCareers` / card institucional flotante | Portada institucional | variable, miniatura panorámica | aprox. 340–420 × 180–240 px | aprox. 330 × 180 px | 1600 × 900 / 1200 × 675 px | WebP o JPEG; < 350 KB | `<img>` dentro de la card; la composición debe tolerar crop. Reutiliza `institution.image` también en cards y ficha institucional. |
| `/[ciudad]` | Cards de instituciones (`CityPageClient`) | Card institucional | 4:3 visual | aprox. 280–360 × 210–270 px por card | ancho disponible × aprox. 230 px | 1600 × 1200 / 1200 × 900 px | WebP o JPEG; < 350 KB | `<img>` con `object-fit:cover`. Dejar cara, fachada o marca principal centrada con 10% de safe area. Mismo `institution.image` que hero/card flotante. |
| `/[ciudad]/[institucion]` | `InstitutionPageClient` / `detail-cover` | Hero institucional | panorámico, aprox. 16:7 | ancho de contenedor hasta 1180 × aprox. 360 px | 358 × aprox. 280 px | 1920 × 1080 / 1440 × 810 px | WebP o JPEG; < 700 KB | `background-image` con `cover`; se superpone copy. Reservar el lado o franja de texto para legibilidad y evitar logos/texto dentro de la fotografía. Reutiliza `institution.image`. |
| `/[ciudad]/[institucion]` | `InstitutionPageClient` / galería animada | Galería | cards 3:2 aproximadas | aprox. 270 × 180 px cada una | aprox. 220 × 147 px | 1500 × 1000 / 1200 × 800 px por foto | WebP o JPEG; < 300 KB por imagen | `<img>` en marquee; crop `cover` previsto. No hay lightbox ni video en galería. Variar encuadres, pero conservar sujeto principal central y no subir texto incrustado. |
| `/[ciudad]/[institucion]` | `InstitutionPageClient` / resumen de carrera | Card de carrera | 16:9 | aprox. 360 × 203 px | aprox. 340 × 191 px | 1600 × 900 / 1200 × 675 px | WebP o JPEG; < 300 KB | `career.image` con `object-fit:cover`. Reutilizado por hero de ciudad y ficha individual; para máxima consistencia, partir de 16:9 y guardar el foco en zona central. |
| `/[ciudad]/[institucion]/carreras/[carrera]` | `CareerPageClient` / imagen de ficha | Portada de carrera | variable dentro de grilla; 1.28:1 visual | aprox. 490 × 315 px mínimo | 358 × 220–240 px | 1600 × 1000 / 1200 × 750 px | WebP o JPEG; < 450 KB | `<img>` con `object-fit:cover`, altura mínima 315 px desktop y 220 px móvil. Puede recortar bordes; dejar 12% de safe area en cuatro lados. Reutiliza `offering.image`/`career.image`. |
| `/[ciudad]/[institucion]/capacitaciones/[capacitacion]` | `TrainingPageClient` / imagen de ficha | Portada de capacitación | igual a ficha de carrera | aprox. 490 × 315 px mínimo | 358 × 220–240 px | 1600 × 1000 / 1200 × 750 px | WebP o JPEG; < 450 KB | Misma clase `career-page-image` y mismo `object-fit:cover`; aplicar las mismas zonas seguras. Reutiliza `training_offering.image`. |
| `/cursos-docentes` | `CoursesClient` / visual principal | Hero editorial | 4:3 aproximado | aprox. 370–430 × 300 px | no se renderiza bajo 820 px | 1600 × 1200 / 1200 × 900 px | WebP o JPEG; < 450 KB | `<img>` `object-fit:cover`, con card superpuesta en el ángulo inferior izquierdo. Mantener libre esa esquina y el centro del encuadre. En móvil este visual se oculta; no hace falta archivo alternativo salvo que se cambie el componente. |
| `/cursos-docentes` | `CourseCard` en destacados y próximos | Thumbnail / card | 16:9 | aprox. 360–390 × 203–219 px | aprox. 310–343 × 174–193 px | 1600 × 900 / 1200 × 675 px | WebP o JPEG; < 300 KB | `object-fit:cover`; carrusel horizontal. Reutiliza `course.image` en varias secciones. Foco en centro; reservar 10% de aire. |
| `/cursos-docentes` | `CourseListCard` / catálogo | Thumbnail lista | 150:92 (1.63:1) | 150 × 92 px | 92 × 88 px | 1200 × 736 / 800 × 490 px | WebP o JPEG; < 200 KB | `object-fit:cover`; el mismo `course.image` puede servir si se exporta 16:9 con sujeto centrado. En móvil el slot es casi cuadrado, por lo que se recortan laterales. |
| `/nosotros` | `AboutPage` / imagen de hero | Hero editorial | 4:3 aproximado | aprox. 430 × 330 px | aprox. 336 × 255 px | 1600 × 1200 / 1200 × 900 px | WebP o JPEG; < 450 KB | `object-fit:cover`; una card se superpone en la esquina inferior izquierda. Mantener esa zona y el centro visual despejados. |
| `/nosotros` | `AboutPage` / cierre | Background / banner | panorámico, aprox. 2.5:1 | hasta 1240 × 480 px | 358 × 440 px | 1920 × 1080 / 1440 × 810 px; crop móvil opcional 1080 × 1350 | WebP o JPEG; < 700 KB | imagen absoluta a todo el bloque con `object-fit:cover`, posición `center 42%`, overlay oscuro. Debe admitir crop vertical muy distinto en móvil; usar rostro/acción centrada y sin textos internos. |
| `/contacto` | `ContactPage` | Sin media raster | — | — | — | — | — | No hay logos, fotos, video ni galerías; solo formulario, copy e íconos SVG inline. |
| Todas las rutas con footer | `PublicFooter` | Logo e íconos | logo: crop de 1:1; íconos SVG | 104 × 40–50 px | 104 × 40–50 px | Ver regla de logo GET | PNG transparente; < 200 KB | No hay assets de partners ni badges externos; Google Play, App Store y redes son SVG/texto inline. |

## Medidas maestras recomendadas

Estas categorías agrupan los slots realmente existentes. Se recomiendan fuentes mayores que el render para preservar nitidez en pantallas de alta densidad, sin almacenar originales innecesariamente grandes.

| Categoría | Fuente recomendada | Mínimo | Máximo razonable | Uso actual |
|---|---:|---:|---:|---|
| Video hero Home horizontal | 1920 × 1080 (16:9) | 1280 × 720 | 1920 × 1080, 10 MB | Home a pantalla completa |
| Video hero Home móvil, solo si se incorpora variante | 1080 × 1920 (9:16) | 720 × 1280 | 1080 × 1920, 8 MB | No existe selector de fuente móvil actual; sería un futuro cambio de código |
| Hero de ciudad / portada de institución | 1920 × 1080 (16:9) | 1440 × 810 | 2560 × 1440 | Fondo con `cover` y overlays |
| Portada de carrera o capacitación | 1600 × 1000 (8:5) | 1200 × 750 | 2000 × 1250 | Ficha individual, `cover` |
| Galería institucional | 1500 × 1000 (3:2) | 1200 × 800 | 1800 × 1200 | Marquee de fotos |
| Card / thumbnail de carrera o curso | 1600 × 900 (16:9) | 1200 × 675 | 1920 × 1080 | Cards, sliders y cursos docentes |
| Card / hero institucional compartido | 1600 × 1200 (4:3) | 1200 × 900 | 2000 × 1500 | Cards institucionales; puede recortarse a hero |
| Banner editorial de cierre | 1920 × 1080 (16:9) | 1440 × 810 | 2560 × 1440 | `/nosotros`, `cover` con crop muy variable |
| Logo GET o logo institucional cuadrado | 800 × 800 (1:1) | 400 × 400 | 1200 × 1200 | PNG transparente; el CSS actual recorta logos GET maestros |
| Logo institucional horizontal, si se habilita como imagen | 1200 × 600 (2:1) | 800 × 400 | 1600 × 800 | No hay `<img>` de logo institucional activo hoy; el catálogo usa `logo` como texto/mark. |

## Reglas de crop y safe area

- Todo slot con `cover` debe contar con un 10–15% de margen de seguridad para caras, logotipos, manos, edificios identificables y objetos de estudio.
- Nunca colocar copy, precios, teléfonos, CTA o marcas de agua dentro de las fotos: la interfaz los puede cubrir, o el crop los puede eliminar.
- Para el hero de ciudad, conservar la información importante dentro del 55% central horizontal; en móvil se pierden principalmente los laterales.
- Para la portada de carrera/capacitación, privilegiar el centro y evitar sujetos cortados en la mitad de rostro o manos.
- Para imágenes de instituciones, la fachada o identidad visual debe quedar centrada; las miniaturas pueden ser 4:3 y los usos hero aplicarán su crop.
- Un mismo archivo 16:9 puede reutilizarse entre cards de carrera, cursos docentes y hero de ciudad si se compone con foco central; el hero institucional y la ficha individual ganan calidad con fuentes 16:9 u 8:5 específicas.

## Auditoría de logos

| Logo | Archivo actual | Tamaño de origen auditado | Uso / render | Recomendación |
|---|---|---:|---|---|
| GET oficial claro | `public/assets/get-logo-oficial.png` | 5225 × 5225 px, 7.30 MB | Header, footer y variante city hero; ventana visible entre 90–112 px de ancho | El archivo actual es mucho mayor de lo necesario para su render. Mantener por ahora sin cambios; para optimización futura, exportar PNG transparente 800–1200 px cuadrado, < 200 KB, respetando exactamente el crop que el CSS espera. |
| GET blanco/dorado | `public/assets/get-logo-hero-blanco-dorado.png` | 1254 × 1254 px, 170 KB | Home y modo oscuro en header/footer | Dimensión y peso son suficientes. Mantener PNG transparente y contraste alto; una versión de 800–1200 px cuadrada sería óptima si se vuelve a exportar. |
| Institucionales | `institution.logo` | texto/mark, no asset raster | Badge `mini-logo` en ficha institucional | No hay pipeline de logo raster/SVG institucional activo. Si se incorpora, usar PNG transparente o SVG, lienzo 1:1 de 800 px, con 15% de margen; no mezclar una foto de fachada como logo. |
| Partners | No existe | — | — | No se encontraron logos de partners externos ni badges raster. |

## Auditoría de video

Existe un único soporte de video activo: el hero de Home en `HomeClient`.

- Fuente actual: MP4 remoto de Cloudinary.
- Render: fondo de viewport completo, `object-fit: cover`, centrado.
- Reproducción: autoplay sí; muted sí; loop sí; `playsInline` sí; controles no.
- Poster: no hay atributo `poster` ni fallback de imagen configurado.
- Mobile: utiliza el mismo MP4 horizontal con crop centrado; no hay una fuente vertical diferente.
- Fallback: el color base del hero es azul oscuro, pero no hay imagen de fallback; el primer frame debería ser representativo y con contraste suficiente.
- Recomendación operativa: MP4 H.264 de 8–20 segundos, 24/30 fps, sin audio necesario, 1920 × 1080, ideal 3–8 MB. Si en el futuro se habilita una segunda fuente móvil, usar 1080 × 1920 y conservar el foco en el centro.
- No se encontraron videos, posters ni reproductores en ciudad, instituciones, carreras, capacitaciones, cursos docentes, Nosotros o Contacto. Tampoco hay un lugar de galería que acepte video actualmente.

## Cobertura por rutas y componentes

- `/`: logo blanco/dorado y video hero; selector de ciudad sin assets de contenido.
- `/ciudades`: reutiliza Home, por lo que mantiene el mismo video y logo.
- `/[ciudad]`: logo hero, fondo de carrera, imagen institucional flotante y cards de instituciones.
- `/[ciudad]/[institucion]`: hero institucional, galería y thumbnails de carreras.
- `/[ciudad]/[institucion]/carreras/[carrera]`: portada de la offering/carrera.
- `/[ciudad]/[institucion]/capacitaciones/[capacitacion]`: portada de la training offering.
- `/cursos-docentes`: hero editorial, cards y lista de cursos.
- `/nosotros`: hero editorial y banner de cierre.
- `/contacto`: sin media raster o video.
- `PublicHeader` y `PublicFooter`: logos GET; el resto son SVG inline.

## Conclusión

La app pública cuenta con nueve familias de espacios visuales auditables: logo GET, logo institucional futuro, video hero Home, hero de ciudad, portada institucional, galería, portada de carrera/capacitación, cards/thumbnails y banners editoriales. Las reglas reales de `cover`, los tamaños de render y el uso compartido de campos de catálogo permiten preparar assets consistentes sin modificar el código.

No se detectó funcionalidad de video fuera del hero de Home, ni soporte actual para video dentro de galerías institucionales. No se realizaron cambios de código, datos, CSS, assets, configuración ni Supabase.

**Dictamen: A. AUDITORÍA COMPLETA DE ASSETS FINALIZADA.**
