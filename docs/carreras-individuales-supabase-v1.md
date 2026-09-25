# Carreras individuales Supabase v1

El piloto de Abogacía Concepción validó el adaptador `career master + academic offering + institution + city`. Esta etapa lo generaliza a las 30 rutas académicas existentes mediante `career-page-catalog.js`, manteniendo `PUBLIC_CATALOG_SOURCE=local` como valor por defecto. En modo Supabase no existe fallback silencioso a `careers.js` ni `offerings.js`; los UUID internos se adaptan a `legacy_key` antes de las props visuales.

## Cobertura

| Institución | Rutas |
|---|---:|
| Siglo 21 Concepción | 4 |
| Santa Bárbara Concepción | 3 |
| IES Concepción | 3 |
| Siglo 21 Monteros | 4 |
| Instituto del Sur | 3 |
| Instituto San Miguel | 3 |
| Siglo 21 Aguilares | 4 |
| Santa Bárbara Aguilares | 3 |
| Academia Profesional Norte Aguilares | 3 |
| **Total** | **30** |

Centro de Formación Tucumán queda excluido: sus tres rutas individuales son capacitaciones y continúan locales. Academia Profesional Norte se conserva como oferta académica. Abogacía, Contador, Administración e Higiene usan masters compartidos; Diagnóstico posee dos offerings contextuales. Administración conserva la URL pública `lic-en-administracion` y el alias heredado interno sin crear otro master.

## Validación

- Comparación pública real local/Supabase: 30/30 encontradas; 0 mismatches, 0 missing y 0 unexpected.
- HTTP Supabase: 30/30 con 200.
- Edge, capturas temporales no versionadas, desktop 1440×900 y móvil 390×843: Administración Monteros, Diagnóstico Aguilares, primera carrera IES Concepción y Ventas Digitales Academia. Texto y geometría local/Supabase equivalentes; sin overflow móvil ni diferencias significativas.
- Tests de matriz, lint, build local y build Supabase: correctos.
- Las 3 capacitaciones individuales, Home y Vite no se modificaron. Supabase remoto no fue modificado.

Siguiente etapa recomendada: validar de forma independiente la migración de las páginas individuales de capacitación.
