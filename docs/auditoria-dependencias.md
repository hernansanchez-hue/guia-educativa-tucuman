# Auditoría de dependencias

Fecha del diagnóstico: 3 de agosto de 2026.

## Alcance y método

Se auditaron por separado la demo Vite de la raíz y `next-app` con `npm audit --json`, `npm audit`, `npm explain` y `npm ls --depth=0`. El diagnóstico se realizó sobre los árboles instalados y los lockfiles existentes.

No se ejecutó `npm audit fix`, `npm audit fix --force`, ninguna actualización de paquetes ni ninguna edición de `package.json` o `package-lock.json`.

## Resumen

| Proyecto | Total | Moderadas | Altas | Críticas |
| --- | ---: | ---: | ---: | ---: |
| Demo Vite (raíz) | 2 | 1 | 1 | 0 |
| Next.js (`next-app`) | 4 paquetes afectados | 0 | 4 | 0 |

La cifra de npm agrega vulnerabilidades por paquete afectado. Un mismo paquete puede contener varias advertencias y una vulnerabilidad transitiva puede elevar el nivel agregado del paquete directo que la incorpora.

## Demo Vite

### `vite@5.4.21`

- Origen: dependencia directa de desarrollo, declarada como `vite: ^5.4.11`.
- Uso: servidor y compilador de la demo; no es una dependencia de ejecución del sitio generado.
- Severidad agregada: alta.
- Avisos directos:
  - GHSA-4w7w-66w2-5vf9: recorrido de rutas en mapas de dependencias optimizadas; moderada; afecta Vite `<=6.4.1`.
  - GHSA-v6wh-96g9-6wx3: exposición de hash NTLMv2 mediante rutas UNC en Windows; moderada; afecta Vite `<=6.4.2`.
  - GHSA-fx2h-pf6j-xcff: evasión de `server.fs.deny` mediante rutas alternativas de Windows; alta; afecta Vite `<=6.4.2`.
- Cadena: proyecto raíz → `vite@5.4.21`.
- Corrección propuesta por npm: `npm audit fix --force`, que instalaría `vite@8.2.0`.
- Impacto de la corrección: salto mayor 5 → 8 y cambio explícitamente marcado como incompatible por npm. Requiere una tarea separada, revisión de notas de migración y regresión completa de la demo.

### `esbuild@0.21.5`

- Origen: dependencia transitiva de desarrollo de `vite@5.4.21`.
- Uso: transformación y empaquetado durante desarrollo/compilación; no se entrega como dependencia de ejecución del sitio generado.
- Severidad: moderada.
- Aviso: GHSA-67mh-4wv8-2f99, posibilidad de que otro sitio envíe solicitudes al servidor de desarrollo y lea respuestas; afecta `esbuild <=0.24.2`.
- Cadena: proyecto raíz → `vite@5.4.21` → `esbuild@0.21.5`.
- Corrección propuesta por npm: la misma actualización forzada a `vite@8.2.0`.
- Impacto de la corrección: indirectamente exige el mismo salto mayor e incompatible de Vite.

## Next.js

### `next@16.2.12`

- Origen: dependencia directa de producción, fijada exactamente en `16.2.12`.
- Severidad agregada: alta por depender de versiones afectadas de `postcss` y `sharp`.
- Cadena: `next-app` → `next@16.2.12`.
- Corrección propuesta por npm: `npm audit fix --force`, que instalaría `next@16.3.0`.
- Impacto de la corrección: no es un salto mayor semántico (16.2 → 16.3), pero queda fuera del rango exacto declarado y npm exige `--force`. Debe tratarse como actualización potencialmente incompatible hasta validar App Router, webpack, ESLint, desarrollo, build y comparación visual.

### `postcss@8.4.31`

- Origen: dependencia transitiva de producción de Next.js.
- Severidad agregada: alta.
- Avisos:
  - GHSA-qx2v-qp2m-jg93: XSS al serializar `</style>` sin escapar; moderada; afecta `<8.5.10`.
  - GHSA-6g55-p6wh-862q: lectura arbitraria de archivos por `sourceMappingURL`; alta; afecta `<=8.5.11`.
  - GHSA-r28c-9q8g-f849: recorrido de rutas al autocargar mapas previos; alta; afecta `<=8.5.17`.
  - GHSA-fxqj-rqcc-2cmp: corrección incompleta de lectura de mapas cuando no se define `from`; moderada; afecta `<=8.5.22`.
- Cadena: `next-app` → `next@16.2.12` → `postcss@8.4.31`.
- Corrección propuesta por npm: actualización forzada de Next.js a `16.3.0`.
- Impacto de la corrección: no es salto mayor, pero sí queda fuera de la versión exacta declarada y requiere validación independiente.

### `sharp@0.34.5`

- Origen: dependencia transitiva opcional de producción de Next.js.
- Uso: procesamiento/optimización de imágenes del entorno Next.js.
- Severidad: alta.
- Aviso: GHSA-f88m-g3jw-g9cj, vulnerabilidades heredadas de libvips (CVE-2026-33327, CVE-2026-33328, CVE-2026-35590 y CVE-2026-35591); afecta `sharp <0.35.0`.
- Cadena: `next-app` → `next@16.2.12` → `sharp@0.34.5` (opcional).
- Corrección propuesta por npm: actualización forzada de Next.js a `16.3.0`.
- Impacto de la corrección: no es salto mayor de Next.js, pero queda fuera del pin actual y debe validarse como cambio separado.

### `brace-expansion@5.0.8` y `brace-expansion@1.1.17`

- Origen: dos dependencias transitivas de desarrollo del ecosistema ESLint.
- Severidad: alta.
- Aviso: GHSA-rgw5-rvv9-x895, denegación de servicio por arreglos intermedios sin límite; afecta `>=4.0.0 <5.0.9` y `<1.1.18`.
- Cadenas principales:
  - `eslint-config-next@16.2.12` → `typescript-eslint` → `@typescript-eslint/typescript-estree` → `minimatch@10.2.6` → `brace-expansion@5.0.8`.
  - `eslint@9.39.5` y plugins/configuraciones ESLint → `minimatch@3.1.5` → `brace-expansion@1.1.17`.
- Corrección propuesta por npm: `npm audit fix`, sin `--force`.
- Impacto de la corrección: npm no lo marca como salto mayor; aun así modificaría el lockfile y debe hacerse en una tarea de dependencias separada con lint/build posteriores.

## Evaluación operativa

- Los hallazgos de Vite afectan principalmente al servidor de desarrollo. No debe exponerse el servidor Vite a redes no confiables mientras permanezca en esta versión.
- Los hallazgos de Next.js incluyen herramientas de producción (`next`, `postcss`, `sharp`) y herramientas de desarrollo (`brace-expansion`). La actualización debe priorizarse antes de publicar, pero no se mezcla con la migración visual de Home.
- La recomendación es abrir una tarea independiente después de validar visualmente Home: actualizar primero Next.js dentro de la rama/tarea de seguridad, validar las notas de 16.3, luego revisar Vite como una migración mayor separada. No se recomienda ejecutar correcciones automáticas forzadas sin esa revisión.

## Integridad posterior a la auditoría

La auditoría fue de sólo lectura respecto de dependencias. Deben permanecer sin cambios:

- `package.json`
- `package-lock.json`
- `next-app/package.json`
- `next-app/package-lock.json`
