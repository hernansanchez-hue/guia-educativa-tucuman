# Academia Profesional Norte — ficha institucional Next.js

- Institución: Academia Profesional Norte.
- ID interno: `academia-profesional-norte-aguilares`.
- Slug público: `academia-profesional-norte`.
- Ciudad: Aguilares.
- Tipo: Academia.
- Ruta: `/aguilares/academia-profesional-norte`.

La ficha reutiliza la plantilla institucional existente sin cambios estructurales en `InstitutionPageClient.js`. Se habilitó exclusivamente la combinación estática de ciudad e institución y la navegación desde la tarjeta de Aguilares.

## Datos canónicos preservados

- Logo: `APN`.
- Portada: `imageBank.design`.
- Galería: diseño, estudiantes, aula y graduación, según la composición institucional existente.
- Slogan: “Capacitaciones digitales para empezar a trabajar.”
- Descripción: “Cursos prácticos de diseño, redes sociales, ventas y herramientas digitales.”
- Dirección: Moreno 575, Aguilares.
- WhatsApp institucional: 3865 60 7711.
- Ofertas resumidas, en orden: Diseño Gráfico, Community Manager y Ventas Digitales.

Aunque el copy de Vite emplea “cursos” y “capacitaciones”, las tres ofertas pertenecen al dominio académico: Vite las declara en `defaultInstitutions[].careers`, las muestra mediante `renderCareers()` y las abre con `showCareer()`. No se crearon `trainingPrograms`, `trainingOfferings`, carreras maestras ni offerings para esta etapa.

## Validación funcional

- HTTP 200: ficha de Academia, ciudades generales, ficha y cuatro carreras de Siglo 21 Aguilares, y ficha y tres carreras de Santa Bárbara Aguilares.
- HTTP 404: las tres rutas futuras `/carreras/` de Academia, las tres rutas `/capacitaciones/` equivalentes y las rutas cruzadas de Diseño Gráfico bajo Siglo 21 y Santa Bárbara.
- La ficha responde en `/aguilares/academia-profesional-norte`; las ofertas continúan como datos resumidos sin navegación contextual.

## Validación visual

Capturas generadas con Chrome headless CLI, sin CDP:

| Archivo | Viewport | Tema | Resultado |
| --- | --- | --- | --- |
| `academia-profesional-norte-aguilares-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido, portada, logo APN, galería, slogan, copy, dirección y tarjetas conservados. |
| `academia-profesional-norte-aguilares-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido, composición responsive y galería sin alteración estructural. |

El tema claro/oscuro usa el mecanismo compartido `localStorage.guiaEducativaTheme`, equivalente al de Vite. La ficha no introduce lógica de tema propia: los selectores existentes `body.dark-theme` de la plantilla institucional preservan la variante oscura. No se forzó ni alteró el tema para esta etapa.

No se detectaron diferencias estructurales en la plantilla, footer, orden de ofertas ni responsive. Las imágenes remotas pueden variar únicamente por carga/rasterizado, sin cambio de datos ni DOM.

## Validaciones técnicas

- `npm run lint`: correcto.
- `npm run build`: correcto (48 páginas estáticas).
- `npm start`: correcto en el puerto temporal 3211; detenido al concluir.
- Se mantiene la advertencia conocida de Next.js por los dos `package-lock.json`; no se modificaron configuración ni lockfiles.
