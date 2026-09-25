# Higiene y Seguridad — Universidad Siglo 21, Monteros

## Alcance validado

- Carrera maestra reutilizada: `higiene-y-seguridad`.
- Career ID y slug canónicos: `higiene-y-seguridad`.
- Offering Monteros: `universidad-siglo-21-monteros-higiene-y-seguridad`.
- Offering independiente Concepción:
  `universidad-siglo-21-concepcion-higiene-y-seguridad`.
- Ruta Monteros: `/monteros/universidad-siglo-21/carreras/higiene-y-seguridad`.

No se requiere mapping. El slug alternativo sin «y», `higiene-seguridad`, se
confirmó en HTTP 404 y no existe como alias ni redirect.

## Offering Monteros

| Campo | Valor |
| --- | --- |
| Institución interna | `universidad-siglo-21-monteros` |
| Ciudad | `monteros` |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Higiene y Seguridad |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.lab` |
| Badge | Inscripciones abiertas |
| Orden | 4 |
| Formulario | Simulado y habilitado; reutiliza `localStorage.guiaEducativaLeads` |
| WhatsApp | Sin número propio; fallback institucional `3865 41 2020` |

Concepción y Monteros comparten el career master, pero resuelven offerings por
`institutionId` y `citySlug` diferentes. No se modificó la offering de Concepción.

## Capturas técnicas Next.js

Generadas con Chrome headless CLI local, perfil temporal independiente y escala 1.

| Archivo | Viewport | Dimensiones PNG | Tema | Peso | Estado |
| --- | --- | --- | --- | ---: | --- |
| `higiene-monteros-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro | 292.341 bytes | PNG válido |
| `higiene-monteros-next-mobile-claro.png` | 390 × 843 | 390 × 843 | Claro | 113.691 bytes | PNG válido |

La vista mantiene la plantilla compartida y su responsive. No se modificaron
`CareerPageClient.js` ni `carrera.css`.

## HTTP, regresión e integridad

La build de producción confirmó HTTP 200 para Home, Ciudades, Concepción, Monteros,
las tres instituciones y diez carreras contextuales ya migradas de Concepción, y
las cuatro carreras canónicas de Universidad Siglo 21 Monteros: Abogacía, Contador
Público, Lic. en Administración e Higiene y Seguridad.

Se confirmó HTTP 404 para `higiene-seguridad`, una carrera inexistente, Instituto
del Sur, Centro de Formación Tucumán, Instituto San Miguel y Aguilares. Las cuatro
tarjetas de Monteros conservan orden, imágenes, badges, navegación, DOM, clases,
geometría, hover y responsive existentes.

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm start`: correcto en el puerto temporal 3148; detenido tras validar.
- Formulario y WhatsApp reutilizan la lógica compartida; la normalización esperada
  del fallback es `543865412020` con mensaje contextual de Higiene y Seguridad.
- Vite, baseline, `careers.js`, paquetes, lockfiles, dependencias,
  `CareerPageClient.js` y `carrera.css`: sin cambios.
- Advertencia no bloqueante conocida: Next.js detecta los lockfiles legítimos de
  Vite y Next.js e infiere `C:\Codex\GET` como workspace root.
