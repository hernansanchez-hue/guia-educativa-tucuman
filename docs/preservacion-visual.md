# Preservación visual de Guía Educativa Tucumán

Fecha de registro: 30 de julio de 2026.

## Principio de preservación

La aplicación Vite de la raíz es la referencia visual oficial. La futura implementación en Next.js debe reproducir su apariencia, contenido, estructura visible, interacción y comportamiento responsive. Este documento no autoriza rediseños ni sustituciones.

Los archivos canónicos son:

- `index.html`: estructura, textos, SVG inline y pantallas.
- `src/styles.css`: apariencia, responsive, temas y animaciones.
- `src/main.js`: navegación, renderizado dinámico, estado y comportamiento.

## Tipografías y fuentes externas

- Familia principal: `"Poppins", Arial, Helvetica, sans-serif`.
- Poppins se importa desde Google Fonts con pesos `100` a `900`.
- Geist se importa desde Google Fonts con rango `100..900` y se utiliza en sectores de la interfaz.
- Usos puntuales: `Georgia, "Times New Roman", serif` y `Arial, Helvetica, sans-serif`.
- Deben preservarse familia, peso, tamaño, altura de línea, tracking y fallback de cada selector.
- La carga o sustitución de fuentes puede alterar saltos de línea, altura de tarjetas, botones y navegación.

## Variables CSS y colores principales

Variables definidas en `:root`:

```css
--azul: #173b7a;
--azul-2: #2456a6;
--verde: #19a974;
--amarillo: #f6c85f;
--coral: #ef6f6c;
--gris: #f5f7fa;
--linea: #dfe7f2;
--texto: #172033;
--muted: #667085;
--blanco: #ffffff;
--sombra: 0 16px 36px rgba(15, 23, 42, 0.13);
--radio: 8px;
```

La paleta se amplía mediante colores y transparencias escritos directamente en reglas específicas. No debe asumirse que reemplazar únicamente estas variables reproduce toda la demo.

Usos relevantes:

- Azul profundo y azul secundario: identidad, encabezados, botones, administración y textos destacados.
- Verde: acciones principales, estados positivos, badges y focos.
- Amarillo y coral: acentos, categorías, alertas y jerarquías.
- Blanco y grises azulados: superficies, fondos y divisores.
- Texto principal `#172033` y muted `#667085`.

## Fondos

- `body` usa una combinación de gradiente radial azul muy claro y gradiente lineal blanco.
- Home usa video a pantalla completa con overlay.
- Encabezado de Home es transparente sobre el hero.
- Encabezado interior usa superficie blanca y sombra.
- Portadas de instituciones y secciones editoriales usan imágenes con overlays.
- Tarjetas y paneles alternan blanco, grises suaves, gradientes y fondos temáticos.
- Centro de Control tiene fondos y superficies propios.
- El modo oscuro redefine fondos de página, tarjetas, formularios, navegación, footer, cursos, eventos, carreras y administración.

Al migrar, debe conservarse el orden de capas: imagen o video, pseudo-elementos, overlay y contenido.

## Sombras

La sombra global es:

```css
0 16px 36px rgba(15, 23, 42, 0.13)
```

Además existen numerosas sombras específicas, desde elevaciones suaves como `0 4px 12px rgba(15, 23, 42, 0.05)` hasta elevaciones fuertes como `0 20px 50px rgba(0, 0, 0, 0.26)` y la sombra lateral del menú móvil `22px 0 45px rgba(15, 23, 42, 0.2)`.

No se deben homogeneizar. La intensidad diferencia tarjetas, botones, paneles flotantes, hero, slider, navegación y administración.

## Bordes y divisores

- Color base de línea: `--linea: #dfe7f2`.
- Hay bordes sólidos, semitransparentes y coloreados según contexto.
- Inputs, selects, textareas, tarjetas, chips y módulos administrativos usan bordes distintos.
- Focos de formulario incluyen anillos verdes mediante sombras `0 0 0 3px`.
- Divisores del footer, tabs, tablas y paneles deben conservar ancho, color y espaciado.

## Radios

- Radio base: `8px`.
- Valores observados: `3`, `4`, `5`, `6`, `7`, `8`, `10`, `18`, `22` y `24` px.
- Píldoras y avatares usan `999px` o `50%`.
- Existen radios asimétricos en controles agrupados.

No debe reemplazarse todo por un único token: la combinación actual forma parte de la jerarquía visual.

## Anchos máximos

Anchos de contenedores observados:

- `1440px`.
- `1240px`.
- `1180px`.
- `1152px`.
- `830px`, `780px`, `760px` y `680px` para sectores más acotados.
- `480px`, `360px`, `340px` y `300px` para formularios, tarjetas o paneles.

También hay `max-width: 100%` y anulaciones con `max-width: none`.

La combinación entre `max-width`, porcentajes, padding lateral y grid debe trasladarse sin recalcular proporciones.

## Estructura general

- Un único `.app-shell` contiene encabezados, todas las vistas, acceso flotante administrativo y footer.
- Home y las páginas interiores alternan visibilidad.
- Las pantallas interiores usan `.page`; la activa recibe `.active`.
- Home se oculta con `.hidden`.
- El footer se muestra únicamente en vistas públicas interiores.
- El Centro de Control reemplaza la navegación pública y usa su propio shell.

En Next.js las rutas podrán separar documentos, pero el DOM visible resultante debe mantener la misma jerarquía y las mismas relaciones de layout.

## Header

Existen dos encabezados:

1. `homeHeader`: absoluto, transparente, centrado sobre el hero y con marca blanca.
2. `siteHeader`: sticky, inicialmente oculto, con logo, navegación y acciones.

Elementos sensibles:

- Altura y padding.
- Posición sticky y `z-index`.
- Logo, marca `GE`, colores y sombra.
- Alternancia de visibilidad.
- Botón de tema.
- CTA de Cursos Docentes.
- Botón hamburguesa.

No deben fusionarse visualmente aunque en React compartan componentes internos.

## Navegación

- Navegación principal con Inicio, Eventos y Nosotros.
- Cursos Docentes tiene CTA de escritorio y entrada propia en móvil.
- Estado activo mediante clase `.active`.
- Botones, no enlaces tradicionales, en la demo actual.
- Fichas incluyen acciones de regreso.
- Carrera incluye tabs con scroll horizontal y desplazamiento a secciones.
- Administración tiene sidebar y vistas internas.

Al convertir a rutas se debe preservar el estado visual activo, el scroll y el comportamiento de regreso.

## Menú móvil

- Se abre agregando `.open` a `#siteMenu`.
- Funciona como panel lateral con sombra fuerte.
- Incluye botón de cierre y entrada móvil para Cursos Docentes.
- Cambia a partir de breakpoints de navegación, principalmente `900px` y `720px`.
- El overlay, foco, orden y áreas táctiles deben revisarse durante la migración, aunque la demo no implemente un focus trap.

## Footer

- Marca y descripción.
- Columna Explorar.
- Dirección y WhatsApp.
- Botones de futuras aplicaciones.
- Caja de redes sociales.
- Franja inferior con copyright y regreso al inicio.
- Variantes de tema oscuro.
- Reorganización responsive por columnas y filas.

Son sensibles la cantidad de columnas, los anchos, los íconos SVG, el orden móvil y la separación de la caja social.

## Modo claro y oscuro

- La clase `body.dark-theme` controla el tema.
- La preferencia se persiste como `guiaEducativaTheme`.
- El botón cambia icono, `aria-label` y `title`.
- No se utiliza exclusivamente `prefers-color-scheme`.
- Hay overrides oscuros específicos para:
  - Header y navegación.
  - Páginas y secciones.
  - Tarjetas y paneles.
  - Inputs, selects y textareas.
  - Carreras.
  - Cursos.
  - Nosotros.
  - Eventos.
  - Centro de Control.
  - Footer.

Migrar sólo variables globales dejaría múltiples componentes incorrectos.

## Breakpoints responsive

Breakpoints registrados:

- `max-width: 1100px`.
- `max-width: 1050px`.
- `max-width: 980px`.
- `max-width: 900px`.
- `max-width: 820px`.
- `max-width: 720px`.
- `max-width: 414px`.
- `max-width: 360px`.

También existen dos bloques de `prefers-reduced-motion: reduce`.

La comparación debe realizarse exactamente en esos límites y algunos anchos intermedios. Particular cuidado en:

- Cambio de navegación a menú móvil.
- Grillas de ciudades, instituciones y carreras.
- Slider destacado.
- Hero y portadas.
- Ficha de carrera con sidebar.
- Carruseles y lista de cursos.
- Agenda y filtros.
- Footer.
- Sidebar y formularios administrativos.

## Sliders y carruseles

### Instituciones destacadas

- Hasta tres elementos.
- Track transformado horizontalmente.
- Contador, flechas y puntos.
- Autoplay.
- Pausa y reinicio.
- Soporte táctil mediante distancia de swipe.
- Imágenes, copy y facts con proporciones específicas.

### Galería institucional

- Repite elementos para crear continuidad visual.
- Usa overlays y recortes de imagen.

### Cursos Docentes

- Carruseles horizontales para destacados y próximos.
- Scroll suave calculado según el ancho visible.

La conversión a componentes no debe alterar anchura del track, `overflow`, gaps, duración, orden ni recorte de imágenes.

## Modales, overlays y diálogos

No se detectaron elementos HTML `<dialog>` ni un sistema de modales funcional.

Sí existen:

- Overlay del hero inicial.
- Overlays de tarjetas y cierre editorial.
- Menú móvil lateral.
- `alert`, `confirm` y `prompt` nativos para acciones simuladas o administrativas.

No se deben reemplazar por modales diseñados durante la migración visual inicial. Cualquier sustitución futura requiere una etapa autorizada.

## Formularios

Formularios visibles:

- Búsqueda de ciudad.
- Búsqueda y filtros de instituciones.
- Consulta por carrera.
- Filtros de Cursos Docentes.
- Filtros de Eventos.
- Consulta comercial.
- Login.
- Edición de instituciones, slider, galería y carreras.
- Importación de respaldos y cargas multimedia.

Aspectos a preservar:

- Orden de campos.
- Labels y placeholders.
- Alturas, padding, radios y bordes.
- Estados de foco, error, éxito, carga y disabled cuando existan.
- Grillas y spans de ancho completo.
- Botones y jerarquía de acciones.
- Layout móvil.
- Textos visibles exactos.

## Centro de Control

El Centro de Control tiene un lenguaje visual propio dentro de GET:

- Login centrado.
- Shell administrativo.
- Sidebar.
- Header de workspace.
- Dashboard y tarjetas métricas.
- Jerarquía ciudad/institución.
- Listas y selectores.
- Editor de slider.
- Editor extenso de institución.
- Previews multimedia.
- Galería editable.
- Editor de carreras.
- Tabla de consultas.
- Tarjetas de configuración.
- Barra fija o destacada de guardado.

La densidad, alineación, tamaño de campos y contraste deben mantenerse. No debe convertirse en un dashboard genérico.

## Dependencias visuales externas

- Google Fonts: Poppins y Geist.
- Cloudinary: video hero y futuros medios cargados.
- Unsplash: fotografías de instituciones, cursos, Nosotros y Eventos.
- SVG inline: iconografía de toda la interfaz.
- WhatsApp y Google Maps: enlaces externos visibles.

La línea base visual necesita acceso de red o copias controladas de esos recursos. Una captura con recursos fallidos no es una referencia válida.

## Elementos sensibles a cambios del DOM

- Selectores descendientes del header y navegación.
- Reglas que dependen de `.active`, `.visible`, `.hidden`, `.open` y `.dark-theme`.
- `nth` implícitos por orden visual.
- Pseudo-elementos de hero, cards, timeline, facts y divisores.
- Grids cuyos hijos directos definen columnas.
- Tracks de sliders y carruseles.
- Sidebar de carrera y administración.
- SVG que heredan `currentColor`.
- Formularios con elementos `.full`.
- Reglas tardías que sobrescriben bloques anteriores.
- Código JavaScript que busca IDs concretos y escribe `innerHTML`.

Agregar wrappers de React sin verificar selectores puede cambiar grid, flex, espaciado, herencia y pseudo-elementos.

## Riesgos al convertir HTML en JSX

1. Cambiar `class` a `className` sin conservar todas las clases condicionales.
2. Renombrar IDs utilizados por JavaScript o por navegación interna.
3. Introducir wrappers adicionales.
4. Reordenar CSS y alterar la cascada.
5. Convertir SVG inline con atributos incompatibles sin revisar `strokeWidth`, `strokeLinecap`, `fillRule` y `viewBox`.
6. Cambiar botones por enlaces y alterar estilos, foco o dimensiones.
7. Perder atributos ARIA, `alt`, `role`, `autocomplete` o tipos de input.
8. Provocar diferencias de hidratación con datos dependientes del navegador.
9. Acceder a `window`, `document`, storage o media queries desde Server Components.
10. Reemplazar `innerHTML` sin replicar exactamente el marcado generado.
11. Modificar el orden de fuentes o depender de métricas distintas.
12. Cambiar el comportamiento de imágenes (`object-fit`, dimensiones y recorte).
13. Convertir el tema a renderizado del servidor sin evitar parpadeos.
14. Perder scroll, autoplay, swipe o pausa del slider.
15. Modificar textos, incluso por “mejoras” de copy.

## Método propuesto de comparación Vite–Next.js

### 1. Preparar estados equivalentes

- Usar el mismo conjunto de datos.
- Limpiar o fijar `localStorage` antes de cada serie.
- Fijar ciudad, institución, carrera, filtros y vista administrativa.
- Esperar carga de fuentes, imágenes y video.
- Pausar animaciones y slider en un estado reproducible sólo mediante herramientas de captura, sin cambiar los fuentes.

### 2. Matriz mínima

Para cada pantalla migrada:

- Escritorio: `1440 × 1000`.
- Tablet: anchos `980`, `900` y `820`.
- Móvil: `414 × 896` y `360 × 800`.
- Modo claro.
- Modo oscuro.
- Parte superior y captura de página completa cuando corresponda.

### 3. Captura paralela

- Levantar Vite y Next.js simultáneamente en puertos diferentes.
- Navegar al mismo estado.
- Capturar con nombres emparejados:

```text
vite-ciudad-concepcion-1440-claro.png
next-ciudad-concepcion-1440-claro.png
```

### 4. Comparación

- Comparación lado a lado.
- Overlay al 50%.
- Diferencia de píxeles con umbral bajo.
- Inspección manual de tipografía, saltos de línea, espaciado, recortes, sombras, temas y responsive.

### 5. Criterios de aprobación

- Ningún texto o sección ausente.
- Estructura y jerarquía equivalentes.
- Sin cambios perceptibles de color, tipografía, tamaño o proporción.
- Mismo comportamiento en breakpoints.
- Interacciones principales equivalentes.
- Diferencias de píxeles explicadas por contenido remoto dinámico, video o antialiasing, no por layout.

### 6. Control por etapa

Cada pantalla debe aprobarse antes de migrar la siguiente. Las capturas aprobadas se guardarán en `docs/baseline-visual/` y se conservarán como artefactos de regresión.

## Estado actual de la línea base

La demo Vite respondió correctamente, pero el controlador del navegador no pudo iniciar por un `package.json` inválido ubicado en la carpeta temporal externa al proyecto. La incidencia y la matriz pendiente están registradas en `docs/baseline-visual/README.md`.

No debe iniciarse la migración definitiva de Home hasta completar las capturas pendientes o contar con autorización expresa para avanzar sin esa evidencia.
