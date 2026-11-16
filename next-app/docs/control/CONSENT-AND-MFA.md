# Cierre de consentimiento comercial y MFA

## Consentimiento

Aviso inmutable `contacto-2026-11-15-v1`, política `2026-11-15`:

> Autorizo a GET a registrar y atender esta consulta en su bandeja comercial privada, según la Política de Privacidad. No se envía automáticamente a GET Instituciones ni autoriza publicidad ajena a mi consulta.

`lib/privacy/commercial-consent.mjs` conserva el texto que renderiza Contacto y su identificador. Si cambia el aviso, crear otra versión; no reutilizar este identificador. La política versionada se conserva en Git. La incorporación documenta una protección técnica, no cambia finalidad, destinatarios ni conservación.

El servidor exige aceptación booleana y política vigente, fija `/contacto` como origen y envía únicamente los cuatro campos de evidencia permitidos. PostgreSQL agrega su propia fecha con `clock_timestamp()`. La columna `consent_evidence` es nullable para no atribuir aceptación a consultas históricas. Los reintentos preservan el comprobante y la evidencia originales. Un trigger impide modificarla; Administrador/Editor activos pueden verla, Lector/anon no.

El overload nuevo de cinco argumentos de `get_commercial_contact_receive` exige evidencia. La firma histórica de cuatro argumentos se conserva para rollback compatible; no fabrica evidencia y solo es ejecutable por el servidor. Ninguna firma está disponible para usuarios públicos o humanos autenticados. No se modificó el contrato del receptor educativo GET Instituciones.

## MFA opt-in

`/administrador/seguridad` permite vincular un autenticador y confirmarlo con TOTP mediante Supabase Auth. El QR y secreto solo se entregan a su propietario autenticado, en memoria de la pantalla; no se guardan en GET ni se registran en logs. No compartir capturas del QR.

Un factor sin verificar no restringe el acceso. Con un factor verificado, `requireControl` exige AAL2 antes de datos, acciones, borradores, publicación, historial, usuarios y uploads. La identidad estricta también protege medios privados. El login AAL1 deriva a `/administrador/verificar`. El contexto de esa pantalla comprueba usuario confirmado, miembro activo y sesión vigente, y no permite leer contenido.

En SQL, `get_control_private.me()` y políticas restrictivas de la bandeja aplican MFA solo al Centro de Control. No hay políticas globales ni cambios en otros proyectos. La aplicación no confía en `user_metadata` ni en un rol o nivel enviado por el navegador. Las cookies mantienen HttpOnly, Secure en producción, SameSite=Lax y path `/administrador`; las pantallas son privadas/no-store/noindex y quedan fuera de GA4.

Desvincular requiere sesión autorizada y un código TOTP válido nuevo. Permite vincular un segundo autenticador para disponer de un dispositivo alternativo, sin códigos de recuperación inventados.

### Pérdida del dispositivo

1. Intentar otro autenticador ya verificado, si existe. Recuperar la contraseña no omite MFA.
2. Contactar al responsable por un canal previamente conocido y comprobar la identidad fuera del chat, sin pedir contraseñas ni TOTP. Registrar quién autorizó la recuperación y por qué, sin guardar secretos.
3. Un operador autorizado de Supabase verifica UUID y cuenta exactos en get-definitivo. Desactiva temporalmente **solo ese miembro** del Centro mientras restablece el factor mediante la administración oficial de Auth; revoca todas sus sesiones y verifica que no permanezcan sesiones válidas. No modificar RLS, JWT, contraseñas ni perfiles de otras cuentas.
4. Tras verificar la revocación, rehabilita el miembro con su rol previo. El usuario inicia sesión por el flujo normal y vincula un autenticador nuevo. Confirmar AAL2 y comprobar acceso antes de cerrar la recuperación.

No existe un endpoint de GET para quitar MFA sin un segundo factor. Una recuperación excepcional requiere intervención humana autorizada; no se ejecuta automáticamente.

## Publicación y reversión

Las migraciones `20261116011719` y `20261116011721` son aditivas, probadas sobre PostgreSQL 17 restaurado. Aplicar solo a `zomoblpgurchkxvkkutj` con respaldo/restore verificados. Nunca a GET Instituciones.

Publicar primero esquema compatible y después aplicación. Mantener las migraciones si se revierte el deploy: no borrar consultas ni evidencia posteriores. Antes de volver a una aplicación anterior que no exige MFA, deshabilitar temporalmente el acceso al Centro (sin borrar miembros), o usar una corrección forward; **no servir el administrador anterior a una cuenta con MFA activo**. La web pública y la recepción comercial no requieren desactivar la protección.

Prueba SQL: `node scripts/check-control-closure-sql.mjs <contenedor-propio-aislado> --apply-local`; solo admite Docker sin red ni puertos y usa fixtures que terminan en ROLLBACK. No pasar URLs remotas. Las pruebas unitarias usan dobles o SQLite temporal; las pruebas Auth reales usan únicamente una cuenta desechable sin datos personales ni correos enviados.
