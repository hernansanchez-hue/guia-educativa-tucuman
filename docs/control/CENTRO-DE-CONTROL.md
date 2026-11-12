# Centro de Control GET

**Entrada:** [Centro local](http://localhost:4004/administrador) · [Login](http://localhost:4004/administrador/login). Desde `next-app`, con Node 24, ejecutar `npm run dev -- --hostname 127.0.0.1 --port 4004`. Es otra interfaz, no una personalización de `/admin`. El proxy redirige las visitas al panel anterior y rechaza sus mutaciones por esa ruta; se conservan sus fuentes y las dependencias que usa el sitio. GET Instituciones es otro sistema.

## Primera cuenta y sesión

No hay alta pública, credencial inicial, rol en el navegador ni cuenta de demostración. Usar una identidad confirmada en Auth **del proyecto público GET**, no del CRM. Se mantienen las variables privadas/publicables ya utilizadas por el proyecto. Cada operación comprueba identidad con Auth, pertenencia y estado. El navegador solo recibe una cookie de sesión protegida en `/administrador`. En HTTPS: Secure; siempre HttpOnly y SameSite=Lax. El panel, vista previa y archivos privados no son cacheables ni indexables.

- **Local:** si existe un perfil anterior activo y verificado SUPERADMIN, su primer ingreso explícito puede inicializar el equipo local vacío. No concede acceso por ser el primer visitante. Para otra identidad, el operador puede ejecutar en `next-app`: `node --env-file=.env.local scripts/control-bootstrap-local.mjs UUID CORREO`. El script **solo consulta** Auth usando configuración privada, exige que UUID, email y confirmación coincidan y solo escribe en la base local vacía. No admite reemplazar a un administrador existente. No comunicar la contraseña ni las claves al equipo de desarrollo.
- **Staging/producción:** solo después de revisar y aprobar el SQL de instalación. Invitar al responsable mediante Auth, verificar el correo y obtener su UUID. Como operador de la base, abrir una transacción, bloquear `public.get_control_members` con `LOCK TABLE ... IN EXCLUSIVE MODE` e insertar el primer perfil con `INSERT ... SELECT` desde `auth.users`, filtrando a la vez por el UUID y correo confirmados, usuario no anónimo y no bloqueado, y `NOT EXISTS (SELECT 1 FROM public.get_control_members)`. Comprobar una sola fila antes de confirmar. SQL parametrizable debajo. No copiar miembros del editor anterior en masa.

```sql
begin;
lock table public.get_control_members in exclusive mode;
-- Reemplazar los valores en el editor privado del proyecto correcto.
insert into public.get_control_members(id,name,role,active)
select u.id, 'Responsable GET','ADMINISTRADOR',true from auth.users u
where u.id = '<uuid-verificado>'::uuid and lower(u.email)=lower('<correo-verificado>')
and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
and (u.banned_until is null or u.banned_until<now())
and not exists(select 1 from public.get_control_members);
-- Revisar el UUID/rol retornado por la siguiente consulta. Si no corresponde, ROLLBACK.
select id,role,active from public.get_control_members;
-- COMMIT; solo después de la comprobación.
```

En Usuarios, el administrador puede vincular una identidad existente, invitar, asignar rol y desactivar a otro miembro. No puede desactivarse a sí mismo. EDITOR edita contenidos/medios y guarda o descarta borradores; solo ADMINISTRADOR publica, restaura versiones y gestiona el equipo. LECTOR no escribe. Una baja se vuelve efectiva sin esperar a que expire el JWT.

Las invitaciones y recuperación requieren SMTP/redirects de Supabase. `GET_CONTROL_ORIGIN` debe contener el origen exacto (o se toma `GET_ADMIN_ORIGIN`); autorizar `/administrador/callback` en ese origen. El callback admite PKCE, token_hash y enlaces de invitación/recuperación con fragmento. No registra tokens. `GET_CONTROL_ALLOW_AUTH_MAIL=true` habilita correos reales **solo con autorización para ese entorno**. Invitar desde el panel también requiere modo Supabase; la asignación de rol es independiente de la verificación del email.

## Almacén y publicación

El archivo `next-app/lib/catalog/public-catalog.json` es la base inmutable. No se importa una copia del catálogo ni se actualiza el archivo al guardar. El editor usa sus claves reales (`sede/…`, `oferta/…`, `marca/…`, ciudad). En cada entorno hay **un solo almacén activo** de cambios por campo. El sitio superpone únicamente campos publicados y conserva el resto del JSON, incluidas correcciones futuras que no hayan sido sobreescritas. Si se retira o cambia una clave en un futuro catálogo, reconciliar sus ediciones explícitamente antes del despliegue. No cambiar claves/relaciones para trasladar una sede u oferta desde esta interfaz: afectaría rutas y vínculos con el CRM.

| Modo | Lectura pública | Escrituras y persistencia |
| --- | --- | --- |
| Local (predeterminado en next dev) | Base + últimas publicaciones locales | SQLite fuera del proyecto, en `%LOCALAPPDATA%/GET/centro-control/editorial.sqlite`. Incluye equipo, medios, borradores, publicaciones e historial; sobrevive al reinicio del servidor. No usar en Netlify. |
| off (predeterminado en build/producción) | Base versionada sin cambios | No se habilita la edición ni se rellena otra base como fallback. |
| supabase (activación explícita) | Base + tabla de publicaciones con permiso solo de lectura | Base persistente de GET y bucket privado. Un nuevo deploy no borra contenidos. Si la fuente activa falla, se informa el error en vez de publicar silenciosamente el JSON antiguo. |

Las ediciones locales NO se promueven automáticamente a una base remota. Antes de activar un nuevo entorno, decidir si las pruebas locales se descartan o preparar una transferencia revisada de parches y archivos asociados preservando IDs; no copiar miembros ni borradores de ensayo. Nunca operar ambos almacenes como escritores de un mismo entorno.

El guardado y la publicación son transacciones distintas, con revisión esperada y detección de ediciones concurrentes. Publicar invalida el layout y sus rutas hijas en Next; editar/descartar no invalida el público. El historial conserva actor, hora y estado anterior. Recuperar una publicación produce un borrador; no se hace visible hasta confirmar otra publicación. Ocultar no elimina el registro.

## Edición y medios

- **Slider:** elegir ciudad, oferta de una sede habilitada, imagen, texto y CTA; cambiar orden, activar/desactivar o retirar. Se conserva el carrusel original y su fallback. El destino deriva del vínculo real, no de un URL libre.
- **Destaques:** seleccionar una sede de la localidad, confirmar posición y publicar. La tarjeta usa las mismas clases/componentes públicos. Destacar no cambia el plan ni duplica la sede.
- **Institución:** editar la sede, sus contactos, modalidades y sus fotos verificadas. La sección Sedes distingue edición local de edición de marca compartida. El identificador de sede y la ciudad no son campos de texto editables. Las fotos del catálogo que son ilustrativas no se promueven automáticamente a galería verificada.
- **Oferta:** editar la ficha institucional específica, no la carrera maestra de otras sedes. Incluye duración, modalidad, título, descripción, programa por etapas, PDF, ingreso, FAQ, trabajo, medios, botones y SEO. En una sede paga solo se admiten cinco tarjetas seleccionadas; en gratuita o no clasificada no se habilitan beneficios pagos. Una oferta no destacada conserva su destino público actual. La vista previa usa los componentes públicos y deshabilita interacciones que enviarían consultas.
- **Biblioteca:** JPG/PNG/WebP y planes PDF de hasta 5 MB. MIME, firma y tamaño se validan en servidor. El archivo no tiene URL pública utilizable hasta publicar una asociación. Quitar una asociación no elimina el archivo compartido. En remoto la descarga pasa por el servidor; el bucket no es público.

## Activación controlada posterior (no ejecutada por la implementación)

1. Respaldar y trabajar primero en un entorno de prueba aislado. Revisar `instalar-en-staging.sql`; se ejecuta una vez, en una transacción y solo por autorización. No cambia ninguna tabla ni plan académico anterior. El script falla si ya existen objetos; no borra ni sobrescribe una instalación.
2. Verificar RLS/grants: ni anon ni authenticated pueden acceder a borradores, equipo, medios o historial. Solo el conjunto publicado puede leerse públicamente. Las RPC de escritura están reservadas al servidor; comprueban rol y revisión nuevamente. El rol se lee de la membresía; no de metadatos de usuario. No habilitar políticas generales sobre el nuevo bucket.
3. Configurar el primer miembro, Auth, URL de retorno y secreto de servicio **solo en el servidor**. La configuración existente fija el proyecto público permitido: no apuntar por accidente al CRM. Para un proyecto de ensayo diferente se necesita aprobar explícitamente su referencia en la configuración de seguridad.
4. Habilitar `GET_CONTROL_STORE=supabase`; las mutaciones exigen además `GET_CONTROL_WRITES_ENABLED=true`. No usar variables NEXT_PUBLIC para secretos. Probar sesiones humanas de los tres roles, ciclo completo de borrador/publicación y caché, archivo privado/público, invitación y recuperación con cuentas de ensayo. No habilitar producción antes de la aceptación.
5. Para recuperar contenido, usar historial y publicar la restauración. Ante un incidente de escritura, deshabilitar escrituras manteniendo el mismo almacén de lectura. No cambiar a off como sustituto de restaurar: volvería a mostrar la base sin sus correcciones publicadas.

La batería automatizada incluye pruebas del dominio, persistencia SQLite real y aislamiento entre publicado/borrador. No reemplaza la aceptación del proyecto alojado con sesiones humanas, SMTP y Netlify.
