# Permisos y seguridad CMS
13/10/2026.

| Acción | SUPERADMIN | ADMIN | EDITOR |
| --- | --- | --- | --- |
| Leer/editar/preview/media/SEO | Sí | Sí | Sí |
| Publicar | Sí | Sí | Solo can_publish autorizado |
| Archivar/restaurar | Sí | Sí | No |
| Usuarios/roles/diseño/settings global | Sí | No | No |
| Eliminar media sin referencias | Sí | No | No |

Auth getUser + email confirmado + sesión DB + perfil activo. user_metadata no concede roles. Desactivado pierde acceso aun con JWT. Último SUPERADMIN protegido por lock. Invitación ADMIN/EDITOR sin password; rol soloSUPERADMIN; sin acceso hasta verificar email.

RLS niega anon drafts/audit/profiles/registro/preview. Proyecciones públicas mínimas de snapshots/tombstones/config validada/redirects, no secrets. SECURITY DEFINER privado con search_path vacío; invokers y grants explícitos. Historial inmutable. Revisiones optimistas y locks evitan pisadas/cadenas/delete en uso.

Servidor valida plain-text/shapes/URLs/diseño/SEO; no richHTML/scripts/CSS libre. Dialogs confirman publish/restore/roles/desactivar. Admin/preview noindex/nofollow/no-store y GA excluido.

Uploader oficial verifica bytes/MIME/ext/peso/Sharp, sinSVG/HTML/JS; APIs origin/sesión, sign/complete JSON≤4KB, PUT directo privado sinupsert. Documentos attachment+sandbox/nosniff, MP4Range. No se presenta validación binaria como una propiedad de RLS: el equipo con permiso media puede usar SDK/Storage; verificar antes de publicar fuera del uploader oficial.

Next16.4.0; audit runtime0. Parches brace-expansion1.1.21/5.0.12 y js-yaml4.3.2. Quedan5high dev braces/cadenaESLint,0critical. [Advisory sin parche compatible](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Sinforceupgrade/downgrade.

SQL rollback/HTTP/harness aprobados; aceptación humana login/logout/recovery/invite/upload/publish pendiente por credencial privada/alta inicial. No bypass.
La política cms_profiles_read también exige can_perform(read): un JWT de sesión revocada no obtiene ni su propio perfil. requireAdmin depende de esa lectura RLS, por lo que también protege la invitación privilegiada antes de enviar email. Tres checks finales adicionales verifican perfil/Usuarios/mutación de rol con sesión borrada, siempre rollback.
