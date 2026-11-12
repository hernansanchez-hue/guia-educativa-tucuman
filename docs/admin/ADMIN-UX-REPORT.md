# GET CMS — Entrega de rediseño UX local

Fecha: 14/10/2026. Estado: implementado para revisión personal; no se declara el CMS finalizado.

## Resultado

El menú se organiza en Inicio, Contenido, Recursos y Administración. Los módulos avanzados se agrupan en `/admin/ajustes`. El Panel ofrece acciones de trabajo y acceso directo a las ciudades. Las tablas cotidianas se reemplazan por filas o tarjetas con Editar como acción principal.

Los editores siguen las secciones públicas. Sus opciones técnicas quedan en Más opciones; se conservan los campos, historial, restauración y controles visuales seguros. En pantallas pequeñas se alterna Editar / Vista previa.

El slider de ciudad tiene edición de sus diapositivas: contenido, imagen con Biblioteca, institución/propuesta relacionada, CTA, duplicar, ocultar, eliminar con confirmación y ordenar con flechas. Su preview enfoca la diapositiva seleccionada. Los bloques de la ciudad incorporan overrides de texto, imagen y visibilidad, con fallback exacto al contenido existente.

No se añade un CMS paralelo. El contenido permanece en los documentos, bundles, revisiones, versiones y lectores públicos ya existentes.

## Problemas auditados

1. Los 22 módulos del roadmap aparecían casi al mismo nivel.
2. El Panel priorizaba métricas y mensajes decorativos.
3. El editor de ciudad no representaba su página y no administraba la colección real del slider.
4. Las acciones secundarias y peligrosas competían con Editar.
5. Las pestañas y textos mezclaban lenguaje editorial con detalles de implementación.
6. Multimedia mostraba todos sus controles en la vista inicial.
7. Usuarios exponía cambios de rol permanentemente.
8. Historial y filtros SEO pedían o mostraban identificadores internos.

La matriz de páginas, bloques, fuentes, edición y límites está en [ADMIN-UX-SITE-MAP.md](./ADMIN-UX-SITE-MAP.md). La ruta pública `/orientacion-vocacional` no existe actualmente: el módulo edita un bloque real de ciudades.

## Rutas y recorridos

| Tarea | Recorrido |
|---|---|
| Editar slider | Panel → ciudad → Slider principal |
| Editar institución | Instituciones → buscar/filtrar → Editar |
| Carreras de una institución | Institución → Carreras → agregar/editar; desasociar archiva solo la oferta con el permiso correspondiente |
| Cambiar foto de carrera | Carreras → Editar → Portada → Biblioteca |
| Crear evento | Eventos → Crear evento |
| Editar páginas índice | Eventos/Servicios → Editar página de Eventos/Servicios |
| Subir imagen | Multimedia → Subir archivo |
| Invitar personal | Usuarios → Invitar persona |
| Opciones compartidas | Ajustes avanzados → Navegación / Footer / Diseño global / SEO / Configuración |
| Recuperar versión | Historial → Ver cambio → Restaurar; después revisar y publicar |

Las rutas previas permanecen operativas y protegidas. Banners tiene acceso avanzado de SUPERADMIN; Cursos docentes, Contacto, Formularios y Legal conservan infraestructura sin ocupar el menú cotidiano.

## Cambios de experiencia adicionales

- Las páginas nuevas completan su dirección desde el nombre; editarla es una opción secundaria.
- Se puede elegir una imagen desde Biblioteca durante la creación.
- Multimedia muestra archivos en grid, subida en diálogo, ficha de detalle, texto alternativo, usos con acceso a los editores, copia de enlace y borrado protegido.
- Los cambios de rol y desactivación pasan por un menú y confirmación.
- SEO usa listas de ciudades/instituciones/carreras y alertas que filtran los resultados.
- Historial muestra persona, acción, contenido y fecha. Los identificadores quedan en detalles de SUPERADMIN.
- Los colores muestran selector y HEX, con restauración del valor original.
- La vista previa sigue privada, usa el renderer público, recibe cambios en vivo y permite Desktop/Tablet/Móvil. Se corrigió el cierre de diálogos anidados del selector de archivos.

## Migración y conservación

No se ejecutaron migraciones de esquema, cambios de RLS ni publicaciones persistentes. El modelo JSON actual admite las diapositivas opcionales. La composición inicial se deriva de las mismas cinco propuestas actuales y se materializa en memoria; se guarda únicamente al editar/guardar el borrador.

Paridad verificada para Concepción, Monteros y Aguilares: orden, imágenes, textos, rutas y tarjeta institucional. No se tocaron las hojas de estilo públicas ni la Home principal.

Estado de base de datos antes y después de las pruebas transaccionales:

| Dato | Antes | Después |
|---|---:|---:|
| Documentos | 106 | 106 |
| Versiones | 119 | 119 |
| Políticas public/storage | 17 | 17 |
| Usuarios de prueba persistentes | 0 | 0 |

El usuario temporal sigue siendo único, confirmado, SUPERADMIN y active, con IDs correctamente relacionados. La cuenta definitiva conserva su email sin confirmar y sin perfil administrativo; no se cambió.

## Validaciones ejecutadas

| Validación | Resultado |
|---|---|
| Tests CMS | **84/84 PASS** |
| Suite completa | **189/189 PASS** |
| SQL: Auth/RLS instalación activa | **36 PASS**, rollback |
| SQL: editorial | **24 PASS**, rollback |
| SQL: Home | **21 PASS**, rollback |
| SQL: módulos y multimedia | **131 PASS**, rollback |
| SQL: consola final | **271 PASS**, rollback |
| SQL: slider y permisos nuevos | **12 PASS**, rollback |
| Total SQL | **495 PASS** |
| Lint | **0 errores**, 9 avisos de imágenes existentes |
| Build | **PASS**, 113 páginas generadas |
| TypeScript | **PASS en la compilación Next.js** |
| Nuevo recorrido visual | **90 vistas**, 7 recorridos, 0 errores JS |
| Regresión visual CMS existente | 35 vistas, 9 interacciones, sin errores |
| Regresión visual módulos | 48 vistas, 7 interacciones, sin errores |
| Regresión Home | 4 layouts y 3 tamaños de público, sin errores |
| Consola avanzada | 35 vistas, 3 interacciones, sin errores |
| HTTP real local | 29 rutas privadas redirigen; 8 públicas responden 200; login/recuperación/noindex/caché/sitemap correctos |
| Git diff check | PASS; solo avisos de conversión LF/CRLF |

El primer intento de los tests históricos SQL detectó dos supuestos de base vacía: bootstrap inicial y ser el único SUPERADMIN. Los fixtures se adaptaron al estado instalado sin modificar cuentas humanas. La rama original de bootstrap continúa probándose en una base vacía; sus cuatro verificaciones exclusivas de primera instalación no forman parte del conteo actual. No se ocultaron errores ni se cambió código de autorización para hacerlos pasar.

Los tests nuevos verifican orden de secciones, menú por rol, conservación del slider en las tres ciudades, edición/duplicación/visibilidad, URL segura, borrador privado, historial inmutable, portada de capacitación y bloqueo de publicación/escalada del EDITOR.

Resoluciones revisadas: **1920×1080, 1440×900, 1366×768, 768×1024 y 390×844**. Sin overflow horizontal; sidebar móvil, alternancia de preview, barra de acciones y modales operativos.

Las pruebas visuales de edición/publicación usan fixtures aisladas y acciones simuladas, nunca un bypass de Auth. Las pruebas SQL realizan operaciones reales dentro de transacciones con rollback. No se presenta esto como aceptación con una sesión humana ni como una subida/invitación real.

El asesor de seguridad informó una configuración de Auth con protección de contraseñas filtradas desactivada y un INFO de RLS en una tabla privada sin políticas. No se modificó esa configuración. [Referencia de Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Capturas

[Galería local de las diez pantallas solicitadas](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/CMS-UX-CAPTURAS.html). Incluye Desktop 1440/1920 y Móvil. Las capturas contienen datos de prueba claramente identificados.

- [Dashboard](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-dashboard-1440.png)
- [Ciudades](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-ciudades-1440.png)
- [Editor Concepción](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-concepcion-1440.png)
- [Edición del slider](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-slider-1440.png)
- [Instituciones](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-instituciones-1440.png)
- [Editor institución](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-institucion-1440.png)
- [Carreras](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-carreras-1440.png)
- [Multimedia](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-multimedia-1440.png)
- [Ajustes](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-ajustes-1440.png)
- [Usuarios](C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd/cms-ux-usuarios-1440.png)

## Límites y revisión pendiente

- Falta que el equipo evalúe personalmente la nueva UX en `http://localhost:4004/admin`.
- Los encabezados estructurales de índices SEO y otros textos de plantilla identificados en el mapa no se convirtieron en documentos nuevos.
- Crear capacitaciones nuevas continúa sin wizard propio; el editor existente sigue disponible.
- Descartar cambios vuelve al último borrador guardado. Para recuperar una publicación anterior se usa Historial.
- El nombre de archivo es de lectura y la sustitución de una imagen se hace desde su página; no se sobrescriben archivos compartidos con versiones previas.
- Inscripciones, leads, legal y módulos previamente pendientes mantienen su estado anterior.

Estos límites se documentan; no se implementan mejoras opcionales por fuera del pedido.

## Archivos y publicación

La lista completa de los **44 archivos de esta etapa** está en [ADMIN-UX-FILES.json](./ADMIN-UX-FILES.json). Se preservaron los cambios previos del working tree.

**git add NO · commit NO · push NO · deploy NO**. No se declara el CMS finalizado hasta la prueba personal del usuario.

