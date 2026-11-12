# Informe de fase 1 — CMS GET

Fecha: 12/10/2026. Estado: completada en local; próxima fase pendiente de inicio.

1. **Etapa completada:** auditoría y arquitectura con fundamento de código ejecutable. No se declara terminado el CMS.
2. **Regla AGENTS.md:** analizar antes de modificar, no migrar todo de una vez, validar cada etapa y detenerse al finalizar; apariencia pública preservada.
3. **Auditoría:** 84 archivos de app/catálogo/SEO, 18 patrones de página, 103 paths locales, 14 assets públicos, fuentes/duplicaciones, cinco migraciones y siete tablas remotas con RLS. Consultas remotas exclusivamente SELECT.
4. **Arquitectura:** catálogo normalizado reutilizado + documentos/versiones editoriales privados + proyecciones públicas transaccionales + componentes públicos para preview. Primer editor recomendado: sede institucional.
5. **Archivos creados:** los 16 archivos listados abajo.
6. **Archivos existentes modificados:** ninguno. Comparación SHA-256 confirmó los mismos contenidos de 116 archivos previos.
7. **Tablas/migrations nuevas:** ninguna; schema aditivo definido para fase 2.
8. **RLS:** auditadas siete políticas SELECT existentes; nuevas políticas CMS pendientes.
9. **Rutas creadas:** ninguna. `/admin` y `/admin/login` no están implementadas en esta etapa.
10. **Componentes:** registro de 22 módulos y referencias de componentes públicos para preview. No componentes UI nuevos.
11. **Auth:** pendiente. La política pura de roles no autentica; ninguna credencial o bypass creado.
12. **Supabase:** `get-definitivo` confirmado activo y accesible por conector. El proceso Next local carece de URL/publishable key. No conexiones de escritura ni cambios de datos.
13. **Sidebar:** pendiente de fase 3; logo del footer identificado y registrado.
14. **Dashboard:** pendiente de fase 3; no se muestran números ficticios en una interfaz.
15. **Editor:** pendiente de fase 4. Contratos y validación base implementados, no formulario visual.
16. **Live Preview:** payload clonado/validado probado; render visual privado pendiente con el primer editor.
17. **Entidades realmente administrables desde UI:** ninguna todavía.
18. **Entidades estáticas:** servicios, eventos, equipo, textos generales, componentes globales y bloques de páginas siguen en sus fuentes actuales; catálogo conserva modo local/Supabase previo.
19. **Datos en database:** 3 ciudades, 10 sedes, 19 masters de carrera, 30 ofertas, 3 programas, 3 ofertas training y 10 cursos docentes. No datos editoriales CMS.
20. **Fallback:** fuente default local en el proceso auditado. Adaptadores remotos existentes; ciudad conserva dependencia de summaries locales. No se cambió el modo público.
21. **Desktop:** no UI nueva para evaluar; fuentes de layout público sin cambios.
22. **Tablet:** no UI nueva para evaluar; responsive público sin cambios de código.
23. **Mobile:** no UI nueva para evaluar; responsive público sin cambios de código.
24. **Accesibilidad:** sin controles nuevos en esta fase. Requisitos de labels, teclado, foco, drawer/preview y alternativa de orden accesible documentados en la especificación; validación visual pendiente con el shell/editor.
25. **Tests:** 11/11 pruebas nuevas pasan. Suite completa: 116 tests, 103 pasan y 13 fallan en pruebas preexistentes. Detalle abajo.
26. **Lint:** pasa, 0 errores y 9 warnings preexistentes de `<img>` en cursos docentes, nosotros y servicios. Dos nombres de variable reservados detectados en archivos nuevos durante la validación se corrigieron antes del resultado final.
27. **Build:** pasa con Next.js 16.2.12 y comprobación TypeScript; 108 páginas generadas. Sin nuevas rutas públicas.
28. **Cambios preexistentes:** conservados y verificados por hashes, incluidos legales, estilos, fondos y banners. Working tree continúa sucio con esos cambios y los archivos nuevos del CMS.
29. **Commit:** no realizado; tampoco staging.
30. **Push:** no realizado.
31. **Deploy:** no realizado; no se operó Netlify.
32. **Próxima etapa exacta:** fase 2, schema editorial mínimo + Supabase Auth + RLS y guard servidor; configuración local y primer superadmin sin credenciales hardcodeadas. La fase 3 construye el shell y la fase 4 la sede editable con live preview/borrador/publicación. Trabajo detenido al cierre de fase 1.

## Archivos nuevos

```text
docs/admin/ADMIN-MASTER-SPEC.md
docs/admin/ADMIN-ARCHITECTURE.md
docs/admin/ADMIN-DATA-MODEL.md
docs/admin/ADMIN-PERMISSIONS.md
docs/admin/ADMIN-PUBLISHING-FLOW.md
docs/admin/ADMIN-MIGRATION-STATUS.md
docs/admin/ADMIN-SETUP.md
docs/admin/ADMIN-AUDIT.md
docs/admin/ADMIN-SOURCE-INVENTORY.json
docs/admin/ADMIN-PHASE-1-REPORT.md
next-app/lib/admin/module-registry.mjs
next-app/lib/admin/permissions.mjs
next-app/lib/admin/content-document.mjs
next-app/lib/admin/environment.mjs
next-app/scripts/audit-admin.mjs
next-app/tests/admin-foundation.test.mjs
```

## Fallos de la suite pública previa

- 11 fallos en `institution-page-catalog.test.mjs`: fixtures remotas y shape local difieren en `nationalValidity` añadido por los adaptadores/resúmenes actuales. Esos archivos existían y no fueron modificados en esta fase.
- 2 fallos en `public-routes-catalog.test.mjs`: espera 51 URLs frente a 79 actuales y excluye rutas SEO que ya existen. Tests y catálogo público no cambiaron en esta fase.
- La nueva prueba del CMS no importa ni modifica esos módulos públicos; comparación de hashes y ejecución de todos los tests identifican los fallos como ajenos a las adiciones de esta etapa. No se corrigieron fixtures ni código público fuera del alcance.

## Otros controles

El inventario regenerado coincide con el JSON guardado. `git diff --check` no reportó errores; los avisos LF/CRLF corresponden a archivos previos. El índice Git permanece sin archivos agregados.

Los contratos de versión están probados en memoria, no en base de datos. Falta implementar autorización real, persistencia, transacciones, validadores completos por entidad, preview visual y revalidación. La URL `/admin` aún no permite entrar a un panel.
