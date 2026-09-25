# Comparación visual de `/concepcion`

Esta carpeta contiene la validación equivalente de la pantalla canónica de Concepción en la demo Vite y en la ruta dinámica de Next.js. Los cuatro pares usan el mismo viewport, tema, contenido, primera diapositiva y posición de desplazamiento.

## Capturas fuente

Todas las capturas tienen firma PNG válida (`89 50 4E 47 0D 0A 1A 0A`), pudieron decodificarse completamente y no presentan corrupción.

| Escenario | Aplicación | Archivo | Dimensiones | Tema | Bytes | SHA-256 |
|---|---|---|---:|---|---:|---|
| Escritorio claro | Vite | `vite-concepcion-desktop-claro.png` | 1440 × 900 | Claro | 1.217.303 | `2ad1100e7e4bbbc5b7555d643957bf64fec8fb56d45988fdf52794a9d5037fb3` |
| Escritorio claro | Next.js | `next-concepcion-desktop-claro.png` | 1440 × 900 | Claro | 1.214.630 | `d362c3067b89d1d10918c205d8ceba861a18ce530ee619b3508eb896328da653` |
| Escritorio oscuro | Vite | `vite-concepcion-desktop-oscuro.png` | 1440 × 900 | Oscuro | 1.168.109 | `8d1ddb34d8769928206b89e7528b8913ef3c9c780d1f62a1da52fedccac9f8d1` |
| Escritorio oscuro | Next.js | `next-concepcion-desktop-oscuro.png` | 1440 × 900 | Oscuro | 1.168.086 | `1a33a8b367ebf75e386154ff550877a1b1382e4d317c8eefca1a1e7bb125052a` |
| Móvil claro | Vite | `vite-concepcion-mobile-claro.png` | 390 × 843 | Claro | 335.603 | `29201bacdc40f428de66530c5c8d5dd9158b3f24fd4d5c57581eaea763baf5d2` |
| Móvil claro | Next.js | `next-concepcion-mobile-claro.png` | 390 × 843 | Claro | 332.754 | `a2c484a642d451d0e1d6ebe7bf61a38abfb73db8719ed362c4320c6c060307f1` |
| Móvil oscuro | Vite | `vite-concepcion-mobile-oscuro.png` | 390 × 843 | Oscuro | 323.049 | `54d6907d3ca2f73c449fc2f30812872447c1483c580b57cf60e889cdc6c0890c` |
| Móvil oscuro | Next.js | `next-concepcion-mobile-oscuro.png` | 390 × 843 | Oscuro | 323.059 | `b30f2a0b4e2681a12d9a1a26aaa213ca864393e7f7612eca49033341c9a60072` |

El servicio de captura entregó inicialmente bytes JPEG pese a solicitar extensión `.png`. Esos bytes se decodificaron y se guardaron como PNG reales sin reescalar. En escritorio, el backend produjo 1440 × 901; se retiró únicamente la última fila inferior vacía para respetar el viewport solicitado de 1440 × 900. En móvil no fue necesario recortar.

## Imágenes de análisis

| Escenario | Tipo | Archivo | Dimensiones | Tema | Bytes | SHA-256 |
|---|---|---|---:|---|---:|---|
| Escritorio claro | Lado a lado | `desktop-claro-lado-a-lado.png` | 2880 × 900 | Claro | 916.827 | `59965d66c8c7eb9b48c3068282e44da86d61f41371c950ce0e478f9eb285b89b` |
| Escritorio claro | Superposición 50 % | `desktop-claro-superposicion.png` | 1440 × 900 | Claro | 857.038 | `e3252fb5eb913bfe206b4ac61917a0290523a276f64a29993dd0057fdd4df415` |
| Escritorio claro | Diferencia absoluta | `desktop-claro-diferencias.png` | 1440 × 900 | Claro | 18.259 | `f187730738aa613a7f28455813bf7d420b3a00ebe6b4e4cab3b0861f6feee52c` |
| Escritorio oscuro | Lado a lado | `desktop-oscuro-lado-a-lado.png` | 2880 × 900 | Oscuro | 887.302 | `7b5f48e6ae524b5a99cca0476d13144b1fc84569e2ea85209ecadea206650dc1` |
| Escritorio oscuro | Superposición 50 % | `desktop-oscuro-superposicion.png` | 1440 × 900 | Oscuro | 836.203 | `82202c29720a5671d93be6f469b8b69cfb2906dfaaeb950804ef90d06cb54679` |
| Escritorio oscuro | Diferencia absoluta | `desktop-oscuro-diferencias.png` | 1440 × 900 | Oscuro | 7.238 | `2e0c2cae7df8a1a951243ddb47b6f7ade45b4ea36141454ffb158b9b9ef0c2ea` |
| Móvil claro | Lado a lado | `mobile-claro-lado-a-lado.png` | 780 × 843 | Claro | 314.565 | `0dfe132c2f49dfa3eb146d77bc8fab02bd487495076d0210891e5f8c07e8d9e7` |
| Móvil claro | Superposición 50 % | `mobile-claro-superposicion.png` | 390 × 843 | Claro | 251.091 | `0540dad7a403733e6582429f7ca8c1a2712c6036c30cee0ef7a12af142f75636` |
| Móvil claro | Diferencia absoluta | `mobile-claro-diferencias.png` | 390 × 843 | Claro | 39.667 | `09ddefaca98636f675012c8325136f3d350e06c31f9ea88408f3f91060addc12` |
| Móvil oscuro | Lado a lado | `mobile-oscuro-lado-a-lado.png` | 780 × 843 | Oscuro | 259.602 | `94f51d70d0cb3b089b1608e32613dab4787caf398b030f3cc956875e10cdd75e` |
| Móvil oscuro | Superposición 50 % | `mobile-oscuro-superposicion.png` | 390 × 843 | Oscuro | 242.921 | `1af43e2a6f7e4ec399433e0b21599b7a57f401864c954d6570aba53bc509aecd` |
| Móvil oscuro | Diferencia absoluta | `mobile-oscuro-diferencias.png` | 390 × 843 | Oscuro | 1.585 | `00e7f9d0d1d323181b83c8446706edcf53fe821d0b1d8230f78350e21f2f7910` |

Las imágenes lado a lado conservan ambas capturas en su resolución original. La superposición mezcla los pares al 50 %. La diferencia es el valor RGB absoluto por píxel; no se aplicaron realces, retoques ni reescalado.

## Navegación y estado de captura

- Vite: Home → botón `Concepción` del selector canónico → `section#cityPage`.
- Next.js: Home o `/ciudades` → botón `Concepción` → `/concepcion`.
- Las capturas se tomaron con la primera institución destacada (`Universidad Siglo 21`), slider en pausa durante la toma, fuentes cargadas y el mismo tema.
- El modo oscuro se activó mediante el control visible y el mecanismo existente `localStorage.guiaEducativaTheme`; no se incorporó ningún parámetro o control temporal.

## Elementos interactivos verificados

- Slider: avance automático, flechas anterior/siguiente, pausa al pasar el puntero y gesto horizontal móvil.
- Filtros: texto sin sensibilidad a mayúsculas/acentos, modalidad, nivel, combinación de criterios y estado vacío.
- Navegación: `Concepción` funciona desde Home y `/ciudades`, también al buscarla y pulsar Enter. `Monteros` y `Aguilares` continúan inactivos.
- Menú móvil, control de tema, estados hover/focus y estructura responsive conservados.
- Las tarjetas y botones de instituciones, los enlaces internos no migrados, Cursos Docentes y Centro de Control permanecen visualmente presentes pero sin rutas nuevas.

## Datos canónicos preservados

El tercer destacado sigue siendo `Instituto del Sur`, aunque sus datos indiquen otra ciudad. Se registra como **“inconsistencia canónica conservada temporalmente para mantener fidelidad visual”**. No se corrigió, reemplazó ni reasignó.

Conclusión: los cuatro pares son visualmente comparables. No se detectaron diferencias estructurales, CSS o de datos que bloqueen esta etapa. El detalle cuantitativo y la regresión de Home y `/ciudades` están en `analisis.md`.
