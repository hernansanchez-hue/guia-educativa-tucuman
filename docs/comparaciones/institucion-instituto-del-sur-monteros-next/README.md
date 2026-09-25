# Instituto del Sur — Monteros

## Identidad de sede validada

| Campo | Valor |
| --- | --- |
| Nombre | Instituto del Sur |
| ID interno | `instituto-del-sur-monteros` |
| Slug público | `instituto-del-sur` |
| Ciudad | `monteros` |
| Ruta | `/monteros/instituto-del-sur` |
| Tipo | Terciario |
| Logo | IDS |
| Portada | `imageBank.students` |
| Media de tarjeta | Video de carreras |

La identidad interna está separada del slug público, aunque hoy exista una sola sede.
No hay dependencia de `id = slug` y la ruta se resuelve por `citySlug` y slug
público mediante la ruta dinámica institucional existente.

## Fuente visual y contenido preservado

La fuente de verdad es la entrada canónica de `src/main.js`. No existe una baseline
versionada específica de Instituto del Sur Monteros dentro de `docs/baseline-visual/`;
por eso se registran capturas técnicas Next.js y se valida el contenido contra Vite.

- Portada: `imageBank.students`.
- Logo textual: `IDS` visible en el hero.
- Galería marquee: portada, `imageBank.students`, `imageBank.classroom` e
  `imageBank.graduation`, repetidos como lo hace el fallback Vite.
- Tarjetas en orden canónico: Marketing, Recursos Humanos y Administración de
  Empresas.
- Badges: Inscripciones abiertas, Nueva carrera y Próximo ingreso.
- Duración y modalidad: 3 años / Presencial.
- Footer, header, control de tema, claro/oscuro y responsive: plantilla institucional
  compartida sin cambios de CSS.

La dirección y WhatsApp canónicos están presentes en los datos Vite, pero la ficha
pública no recibió bloques nuevos para mostrarlos, preservando la interfaz actual.

## Capturas técnicas Next.js

Generadas con Chrome headless CLI local, perfil temporal independiente y escala 1.

| Archivo | Viewport | Dimensiones PNG | Tema | Peso | Estado |
| --- | --- | --- | --- | ---: | --- |
| `instituto-del-sur-monteros-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro | 872.750 bytes | PNG válido |
| `instituto-del-sur-monteros-next-mobile-claro.png` | 390 × 843 | 390 × 843 | Claro | 270.501 bytes | PNG válido |

El modo oscuro reutiliza el mecanismo global `guiaEducativaTheme`; no se introdujo
un mecanismo de tema ni estilos particulares para la sede.

## HTTP y límites de alcance

HTTP 200 confirmado para la ciudad Monteros, Universidad Siglo 21 y sus cuatro
carreras, Instituto del Sur, Concepción con sus tres instituciones y diez carreras
contextuales, Home y Ciudades.

HTTP 404 confirmado para Centro de Formación Tucumán, Instituto San Miguel,
institución inexistente, Aguilares y cualquier carrera contextual de Instituto del
Sur. Marketing, Recursos Humanos y Administración de Empresas siguen siendo solo
tarjetas resumidas, sin navegación contextual.

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm start`: correcto en el puerto temporal 3150; detenido tras validar.
- No se modificaron CSS institucional, `CareerPageClient.js`, `carrera.css`,
  `careers.js`, `offerings.js`, Vite, baseline, paquetes, lockfiles ni dependencias.
- Advertencia no bloqueante conocida: Next.js detecta los lockfiles legítimos de
  Vite y Next.js e infiere `C:\Codex\GET` como workspace root.
