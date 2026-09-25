# Sistema visual de GET público V1

## Paleta oficial

- Azul GET: `#0D1B3D`.
- Dorado GET: `#C9971A`.
- Blanco: `#FFFFFF`.
- Superficies auxiliares: `#081327`, `#F5F7FB`, `#EEF2F8`, `#D9E1EF` y `#6E7C99`.

El dorado reemplaza al verde como acento corporativo en botones, badges, labels, iconos decorativos, checks, líneas, bordes activos, indicadores y fondos suaves. Para esos fondos se usan tintes derivados del dorado. El verde `#19A974` queda reservado exclusivamente para confirmaciones semánticas reales de éxito, como el mensaje posterior al envío de una consulta.

## Logos y headers

- Sobre hero, imagen o fondo oscuro se usa `get-logo-hero-blanco-dorado.png`.
- Sobre una superficie clara se usa la marca compacta azul/dorado del asset oficial `get-logo-oficial.png`.
- En modo oscuro el header compartido cambia al asset blanco/dorado.
- Los headers públicos no reconstruyen la marca con texto, SVG ni filtros y no muestran la versión larga “Guía Educativa Tucumán”.
- Navegación y controles usan azul/blanco según el fondo; el activo y el CTA usan dorado.

## Componentes de identidad

- CTA principal: dorado `#C9971A`, texto blanco y hover dorado más oscuro.
- Botón secundario: azul GET `#0D1B3D`, texto blanco.
- Badges, labels, checks y detalles editoriales: dorado o tintes con opacidad del mismo color.
- Claro y oscuro continúan usando el mecanismo existente basado en `localStorage.guiaEducativaTheme`; no se agregó otro sistema de tema.
- Los títulos editoriales conservan contraste claro en superficies oscuras tras adoptar el azul oficial más profundo.
- Footer, cards, formularios, filtros y componentes editoriales conservan su estructura y comportamiento.

## Alcance funcional

La unificación se aplica a Home, Ciudades, páginas de ciudad, instituciones, carreras, capacitaciones, Cursos Docentes, Nosotros y Contacto. No modifica catálogo, readers, Supabase, formularios, filtros, routing, SEO ni contenido. Eventos continúa como módulo futuro no implementado y su elemento de navegación no recibe una ruta nueva.
