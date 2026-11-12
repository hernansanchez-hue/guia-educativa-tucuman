# Editar → ver → guardar → publicar
13/10/2026.

1. Guard server y DB verifica identidad/sesión/email/perfil/permiso en cada acción.
2. Editor carga dueño/shared/revision. Campos cambian copia local; iframe privado usa renderers reales1440/768/390. PostMessage validado; navegación/submit comercial interceptado.
3. Guardar valida schemas/texto/URLs/SEO/diseño/revisión; solo draft, público intacto.
4. Publicar confirma resumen/impacto compartido/global. Bundle atómico comprueba TODOS los documentos/permisos/relaciones/rutas; crea snapshot/audit inmutable y actualiza puntero.
5. updateTag/revalidatePath por dueño/descendientes; globales cms:site-configuration+layout, entidades normales no revalidan layout entero.
6. Slug→redirect de dueño/descendientes; manual origen sin página pública, destino existente, sin cadenas/bucles. Proxy status exacto/cache60s.
7. Restore confirma entidad/versión y revisión, recupera draft sin tocar historia/público. Baseline presentación se conserva al restaurar antiguas.
8. Despublicar retira sin borrar; archive conserva historia. Home/singletons/settings no se retiran.

SEO master/marca = URL general; oferta/sede = local. Metadata/sitemap usan publicaciones, nunca draft. Noindex/canonical diferente/privados fuera de sitemap.

Media sign→PUT directo privado→validarbytes→registrar→seleccionar→preview→draft→publish. Delete SUPERADMIN, reserva/lock y cero referencias en draft/publicado/historial. Legacy solo desregistro, no archivo original. Fallidos privados se revisan manualmente.

Sin Git/Netlify desde el CMS. HTTP autenticado→revalidation/upload real pendiente de sesión humana; SQL/harness no equivalen a esa aceptación.
