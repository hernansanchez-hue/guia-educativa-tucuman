import EightDesignShell from '../components/approved/EightDesignShell';
import Link from 'next/link';
import {legalConfig} from '../../lib/legal-config';
import './privacidad.css';

export const metadata = {
  title: 'Política de Privacidad | GET',
  description: 'Responsable, uso de los datos, consultas, conservación y derechos sobre datos personales en Guía Educativa Tucumán.',
  alternates: {canonical: '/privacidad'},
};

export default function PrivacyPage() {
  return <EightDesignShell><main className="get-privacy">
    <span className="eyebrow">Privacidad y datos personales</span>
    <h1>Política de Privacidad</h1>
    <p>Versión {legalConfig.privacyVersion}. Última actualización: 11 de noviembre de 2026.</p>

    <section aria-labelledby="privacy-controller"><h2 id="privacy-controller">Quién es responsable</h2>
      <p>El responsable de Guía Educativa Tucumán (GET) es <strong>{legalConfig.legalName}</strong>, quien desarrolla la actividad {legalConfig.activity}.</p>
      <p>Domicilio de contacto del responsable para consultas y solicitudes sobre datos personales: {legalConfig.contactAddress}. Se informa como domicilio de contacto, no como domicilio legal.</p>
      <p>Podés ejercer tus derechos escribiendo a <a href={'mailto:' + legalConfig.privacyEmail}>{legalConfig.privacyEmail}</a>. Esta política se aplica al sitio guiaeducativatuc.com.ar.</p>
    </section>

    <section aria-labelledby="privacy-inquiries"><h2 id="privacy-inquiries">Qué datos pedimos y para qué</h2>
      <p>En los perfiles de instituciones y carreras solicitamos nombre, teléfono o WhatsApp y email para gestionar la consulta que elegís enviar. Asociamos la institución, la sede y, cuando corresponde, la oferta educativa seleccionada. El mensaje y la selección de una carrera para una consulta general son opcionales.</p>
      <p>En <Link href="/contacto">Contacto</Link> solicitamos nombre de la institución, persona de contacto, teléfono o WhatsApp, email y plan de interés para responder sobre los servicios de GET. El mensaje es opcional. Conservamos la fecha de recepción, un identificador de consulta y su estado de seguimiento.</p>
      <p>Los campos obligatorios se indican en cada formulario. Si no los completás o no autorizás el tratamiento indicado, no podemos enviar la consulta; podés seguir navegando. Datos incorrectos pueden impedir que recibas una respuesta. Enviar una consulta no equivale a una inscripción ni garantiza una vacante.</p>
      <p>No incluyas DNI, contraseñas, información de salud ni otros datos sensibles en los mensajes. Estos formularios no solicitan esa documentación. El permiso para responder tu consulta no es una autorización para campañas publicitarias ajenas a ella.</p>
    </section>

    <section aria-labelledby="privacy-recipients"><h2 id="privacy-recipients">Quién recibe las consultas</h2>
      <p><strong>Consultas educativas:</strong> el servidor de GET las envía al receptor de GET Instituciones y las vincula con la institución y el programa seleccionados mediante identificadores verificados. El destinatario educativo se identifica en el formulario; no se distribuyen automáticamente entre otras instituciones ni cambia este destino por el plan comercial del perfil.</p>
      <p><strong>Consultas comerciales:</strong> se registran en la bandeja privada del Centro de Control GET. Pueden consultarlas los miembros activos con rol Administrador o Editor autorizados para atenderlas. No se envían automáticamente a GET Instituciones ni se notifican por email.</p>
      <p>Solo se informa una recepción exitosa cuando el servidor obtiene un comprobante del almacenamiento correspondiente. Si falla el envío, los formularios de institución y carrera mantienen los campos para que puedas reintentar, sin crear una copia automática de tus datos en el almacenamiento persistente del navegador.</p>
    </section>

    <section aria-labelledby="privacy-retention"><h2 id="privacy-retention">Conservación y eliminación</h2>
      <p>Conservamos las consultas mientras se atienden o existe un seguimiento solicitado por la persona interesada. Al cerrarlas, el responsable debe revisar y eliminar o anonimizar los datos que ya no sean necesarios. La falta de respuesta no justifica conservar una consulta indefinidamente: se debe revisar si todavía existe una gestión pendiente.</p>
      <p>Esta revisión es <strong>manual</strong>. Cambiar el estado a “Cerrada” no borra automáticamente la consulta y no existe un plazo automático de eliminación. Solo se conserva información adicional si hay una obligación o un reclamo concreto documentado, con acceso restringido y revisión al finalizar ese motivo.</p>
      <p>Cuando una consulta fue recibida por GET Instituciones, la gestión de eliminación o rectificación debe abarcar también ese destino. En respaldos, se debe impedir que una restauración vuelva a incorporar datos ya eliminados. No se promete un plazo de purga de respaldos o de registros técnicos de proveedores que no haya sido verificado.</p>
    </section>

    <section aria-labelledby="privacy-rights"><h2 id="privacy-rights">Cómo ejercer tus derechos</h2>
      <p>Escribí a <a href={'mailto:' + legalConfig.privacyEmail}>{legalConfig.privacyEmail}</a> para solicitar acceso, rectificación, actualización, supresión o confidencialidad, o para retirar el consentimiento. Indicá qué solicitud querés realizar y un dato que permita localizar tu consulta. No envíes una copia de tu DNI de forma espontánea: se verificará tu identidad con los datos mínimos necesarios.</p>
      <p>El acceso debe responderse dentro de diez días corridos desde el requerimiento fehaciente; la rectificación, actualización o supresión que corresponda, dentro de cinco días hábiles. Una obligación legal de conservación o derechos legítimos de terceros pueden limitar la supresión; en tal caso se debe informar el motivo. Si hubo una cesión, corresponde comunicar al destinatario la corrección o supresión.</p>
      <p>Podés consultar tus derechos y presentar un reclamo ante la <a href="https://www.argentina.gob.ar/aaip/datospersonales/derechos" target="_blank" rel="noopener noreferrer">Agencia de Acceso a la Información Pública</a>. Referencia: <a href="https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion" target="_blank" rel="noopener noreferrer">Ley 25.326</a>.</p>
    </section>

    <section aria-labelledby="privacy-analytics"><h2 id="privacy-analytics">Analítica opcional</h2>
      <p>La integración de Google Analytics 4 (G-KY9E5NG5V2) está condicionada a verificar su configuración y a tu aceptación previa. Mientras esa verificación esté pendiente, permanece desactivada. Rechazarla no impide navegar ni enviar consultas.</p>
      <p>Los eventos propios registran páginas públicas conocidas e interacciones. No envían nombres, emails, teléfonos, mensajes, el texto buscado, comprobantes de consultas ni parámetros de las URLs. El administrador y las vistas previas privadas están excluidos. No se ha incorporado Microsoft Clarity.</p>
      <p>La preferencia de analítica guardada en este navegador se considera válida durante 180 días; después se vuelve a pedir una elección. Si se habilita Analytics, la etiqueta solicita una duración de 180 días para sus cookies, sin renovar ese plazo en cada visita. Esto no equivale al plazo de conservación de datos en la cuenta de Google.</p>
      <p>Podés cambiar tu elección desde “Preferencias de analítica”. Retirarla detiene la medición, elimina las cookies de Analytics accesibles desde GET y recarga la página. Las sesiones del administrador utilizan almacenamiento de autenticación necesario para mantener un acceso autorizado, no para publicidad.</p>
      <p>Si usaste una versión anterior que guardaba consultas solo en tu navegador, pueden quedar copias locales: podés quitarlas borrando los datos de este sitio en tu navegador. Eso no elimina consultas ya recibidas por GET o por una institución.</p>
    </section>

    <section aria-labelledby="privacy-providers"><h2 id="privacy-providers">Infraestructura y enlaces externos</h2>
      <p>Netlify aloja el sitio y ejecuta sus rutas de servidor. Supabase proporciona almacenamiento y autenticación; las consultas comerciales permanecen en el proyecto de GET y las educativas se derivan por el receptor separado de GET Instituciones. Estos servicios procesan los datos necesarios para esas funciones.</p>
      <p>Según los recursos de cada página, pueden cargarse mapas de Google e imágenes o videos externos, por ejemplo desde Cloudinary o Unsplash. El proveedor recibe la información técnica de la conexión, como la dirección IP y datos del navegador; los campos de tu formulario no se incluyen en esas solicitudes de recursos.</p>
      <p>Al abrir WhatsApp, un sitio institucional u otro enlace externo, salís de GET. El destino recibe la información que decidas enviar allí y aplica su propia política. GET no presenta esta política como una certificación de los contratos, países de tratamiento o plazos de conservación de cada proveedor.</p>
    </section>

    <section aria-labelledby="privacy-security"><h2 id="privacy-security">Protección de la información</h2>
      <p>El sitio limita los campos enviados, valida las solicitudes en el servidor y exige autorización para las consultas. El acceso administrativo requiere autenticación y permisos; la bandeja comercial utiliza controles de acceso por fila, límites de envío y protección contra duplicados. Las claves privadas no se envían al navegador. Estas medidas reducen riesgos, sin prometer una seguridad absoluta.</p>
      <p>Una modificación de finalidad, destinatarios o de estas reglas se informará en una versión actualizada. No se presume tu consentimiento para un uso nuevo incompatible con la consulta original.</p>
    </section>
  </main></EightDesignShell>;
}
