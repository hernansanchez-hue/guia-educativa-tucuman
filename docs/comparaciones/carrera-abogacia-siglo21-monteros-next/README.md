# Abogacía — Universidad Siglo 21, Monteros

## Alcance validado

- Ruta pública: `/monteros/universidad-siglo-21/carreras/abogacia`.
- Carrera maestra reutilizada: `abogacia`.
- Offering independiente: `universidad-siglo-21-monteros-abogacia`.
- Sede: Universidad Siglo 21 Monteros (`universidad-siglo-21-monteros`).
- Ciudad: Monteros.
- Institución pública compartida: `universidad-siglo-21`.

La offering es independiente de Concepción. La sede de Concepción continúa usando
`universidad-siglo-21-concepcion-abogacia`; no se reutiliza ni se sustituye su
relación institucional.

## Datos de la offering

| Campo | Valor |
| --- | --- |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Abogacía |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.classroom` de la demo Vite |
| Badge | Inscripciones abiertas |
| Orden | 1 |
| Formulario | Simulado, habilitado; usa el mecanismo compartido de `localStorage.guiaEducativaLeads` |
| WhatsApp | Sin número propio de offering; fallback institucional `3865 41 2020` |

El formulario, la normalización de WhatsApp y el mensaje contextual usan los
componentes compartidos ya validados. No se modificaron `CareerPageClient.js` ni
`carrera.css`.

## Capturas técnicas Next.js

Capturadas con Chrome headless local, perfil temporal independiente y escala 1.

| Archivo | Viewport | Dimensiones PNG | Tema | Peso | Estado |
| --- | --- | --- | --- | ---: | --- |
| `abogacia-monteros-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro | 367.738 bytes | PNG válido |
| `abogacia-monteros-next-mobile-claro.png` | 390 × 843 | 390 × 843 | Claro | 191.775 bytes | PNG válido |

Las capturas son técnicas de la ruta Next.js; no sustituyen la línea base Vite ni
implican una nueva validación visual comparativa.

## Validación de rutas

En la build de producción local se verificaron HTTP 200 para Home, Ciudades,
Concepción, Monteros, las cuatro carreras ya migradas de Siglo 21 Concepción, las
tres carreras contextuales de Santa Bárbara, las tres de IES y las dos rutas de
Abogacía (Concepción y Monteros).

Se verificaron HTTP 404 para las otras tres carreras de Siglo 21 Monteros,
una carrera inexistente, las otras instituciones de Monteros y Aguilares. Esto
confirma el aislamiento por `institution.id` y que solo Abogacía está habilitada
en Monteros en esta etapa.

## Validación técnica

- `npm run lint`: correcto.
- `npm run build`: correcto.
- Advertencia no bloqueante conocida: Next.js detecta los lockfiles legítimos de
  los proyectos Vite y Next.js y por eso infiere `C:\Codex\GET` como workspace root.
