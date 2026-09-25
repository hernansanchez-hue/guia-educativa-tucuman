# Lic. en Administración — Universidad Siglo 21, Monteros

## Identidad y mapping validados

- Carrera maestra reutilizada: `lic-en-administracion`.
- ID histórico de tarjeta: `licenciatura-en-administracion`.
- Slug público canónico: `lic-en-administracion`.
- Mapping interno de presentación: `licenciatura-en-administracion` →
  `lic-en-administracion`.
- Ruta Monteros: `/monteros/universidad-siglo-21/carreras/lic-en-administracion`.

El slug histórico no es una segunda URL pública. Se confirmó HTTP 404 para
`/monteros/universidad-siglo-21/carreras/licenciatura-en-administracion` y para la
misma variante histórica de Concepción.

## Sedes y offerings independientes

| Sede | ID interno | Offering |
| --- | --- | --- |
| Concepción | `universidad-siglo-21-concepcion` | `universidad-siglo-21-concepcion-lic-en-administracion` |
| Monteros | `universidad-siglo-21-monteros` | `universidad-siglo-21-monteros-lic-en-administracion` |

Ambas rutas usan la misma carrera maestra, pero cada sede resuelve la offering que
corresponde a su `institutionId` y `citySlug`. La offering de Concepción permanece
sin modificaciones.

## Datos visibles de Monteros

| Campo | Valor |
| --- | --- |
| Carrera | Lic. en Administración |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Lic. en Administración |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.design` |
| Badge | Próximo ingreso |
| Orden | 3 |
| Formulario | Simulado y habilitado; reutiliza `localStorage.guiaEducativaLeads` |
| WhatsApp | Sin número propio de offering; fallback institucional `3865 41 2020` |

El perfil, descripción, plan, requisitos y FAQ proceden de la carrera maestra
compartida. El título de mayor longitud conserva el comportamiento existente: no
motivó cambios automáticos de CSS.

## Capturas técnicas Next.js

Generadas con Chrome headless CLI local, perfil temporal independiente y escala 1.

| Archivo | Viewport | Dimensiones PNG | Tema | Peso | Estado |
| --- | --- | --- | --- | ---: | --- |
| `administracion-monteros-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro | 349.206 bytes | PNG válido |
| `administracion-monteros-next-mobile-claro.png` | 390 × 843 | 390 × 843 | Claro | 168.405 bytes | PNG válido |

La geometría y responsive usan la plantilla ya validada; no se modificaron
`CareerPageClient.js` ni `carrera.css`.

## HTTP, regresión e integridad

La matriz de producción local confirmó HTTP 200 para Home, Ciudades, Concepción,
Monteros, sus instituciones disponibles, las diez carreras contextuales de
Concepción y las tres rutas autorizadas de Siglo 21 Monteros: Abogacía, Contador
Público y Lic. en Administración.

Se confirmó HTTP 404 para ambas variantes históricas de Administración, Higiene y
Seguridad Monteros (incluido `higiene-seguridad`), carrera inexistente, las otras
instituciones Monteros y Aguilares. Abogacía y Contador continúan navegables.

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm start`: correcto en el puerto temporal 3146; detenido tras validar.
- Vite, baseline, paquetes, lockfiles, dependencias, `careers.js`,
  `CareerPageClient.js` y `carrera.css`: sin cambios.
- Advertencia no bloqueante conocida: Next.js detecta los lockfiles legítimos de
  Vite y Next.js e infiere `C:\Codex\GET` como workspace root.
