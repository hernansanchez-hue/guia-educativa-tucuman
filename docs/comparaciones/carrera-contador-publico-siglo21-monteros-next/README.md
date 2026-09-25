# Contador Público — Universidad Siglo 21, Monteros

## Alcance validado

- Ruta pública: `/monteros/universidad-siglo-21/carreras/contador-publico`.
- Carrera maestra reutilizada: `contador-publico`.
- Offering independiente: `universidad-siglo-21-monteros-contador-publico`.
- Sede Monteros: `universidad-siglo-21-monteros`.
- Sede Concepción: `universidad-siglo-21-concepcion`.

Las dos sedes comparten una sola carrera maestra, pero cada una resuelve su propia
offering mediante su `institutionId` y `citySlug`. La offering preexistente de
Concepción (`universidad-siglo-21-concepcion-contador-publico`) no fue modificada.

## Datos visibles de Monteros

| Campo | Valor |
| --- | --- |
| Carrera | Contador Público |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Contador Público |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.students` |
| Badge | Nueva carrera |
| Orden | 2 |
| Formulario | Simulado y habilitado; reutiliza `localStorage.guiaEducativaLeads` |
| WhatsApp | Sin número propio de offering; fallback institucional `3865 41 2020` |

El formulario, WhatsApp contextual, tabs, sidebar y comportamiento responsive
reutilizan la implementación compartida. `CareerPageClient.js` y `carrera.css`
permanecen sin cambios.

## Capturas técnicas Next.js

Generadas con Chrome headless CLI local, perfil temporal independiente y escala 1.

| Archivo | Viewport | Dimensiones PNG | Tema | Peso | Estado |
| --- | --- | --- | --- | ---: | --- |
| `contador-monteros-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro | 390.620 bytes | PNG válido |
| `contador-monteros-next-mobile-claro.png` | 390 × 843 | 390 × 843 | Claro | 315.358 bytes | PNG válido |

No se generaron comparaciones contra Vite en esta etapa: las capturas registran la
salida técnica de la ruta Next.js sin sustituir la línea base visual oficial.

## HTTP y aislamiento

En producción local se confirmó HTTP 200 para la ciudad e institución Monteros,
Abogacía Monteros, Contador Monteros, las cuatro carreras de Siglo 21 Concepción,
las tres instituciones y diez carreras contextuales de Concepción, Home y Ciudades.

Se confirmó HTTP 404 para Lic. en Administración Monteros, Higiene y Seguridad
Monteros, una carrera inexistente, las otras instituciones de Monteros aún no
migradas y Aguilares. Abogacía Monteros continúa navegable. Esto mantiene el
aislamiento de sede y evita habilitar carreras no autorizadas.

## Validación técnica

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm start`: correcto en el puerto temporal 3144 para la matriz HTTP.
- Advertencia no bloqueante conocida: Next.js detecta los lockfiles legítimos de
  Vite y Next.js e infiere `C:\Codex\GET` como workspace root.
