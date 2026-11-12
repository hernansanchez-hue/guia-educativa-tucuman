# Matriz de finalidades y consentimientos

ESTADO: BORRADOR  
REVISIÓN LEGAL: PENDIENTE  
USO EN PRODUCCIÓN: NO APROBADO

Matriz funcional para revisión profesional; no afirma que hoy exista consentimiento jurídicamente suficiente. “Necesario”, “obligatorio” y “opcional” describen una propuesta a validar, no una conclusión legal. **Hoy no se encontró derivación automática a instituciones ni marketing desde los formularios.**

| Flujo | Finalidad y tratamiento necesario propuesto | Compartir con institución | Marketing | Consentimiento actual | Diseño futuro: obligatorio / opcional | Versión y evidencia | Estado / pendiente |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Consulta institución | Gestionar y responder interés por institución. | Actual: **no** hay envío automático. Futuro posible: institución elegida dinámicamente. | No detectado. | Sin casilla ni registro. | Aviso de finalidad principal; eventual autorización de derivación separada; marketing solo opt-in opcional. | Propuesta `consentVersion: DRAFT-001`; **sin evidencia persistente actual**. | REQUIERE DEFINIR FLUJO FUNCIONAL + REVISIÓN LEGAL. |
| Consulta carrera | Gestionar y responder interés por carrera. | Actual: **no** hay envío automático. Futuro posible: institución de la oferta. | No detectado. | Ninguno. | Mismo criterio con institución/carrera identificadas; marketing independiente. | `DRAFT-001` propuesto; sin evidencia. | Definir quién responde y destino real. |
| Consulta capacitación | Gestionar y responder interés por programa. | Actual: **no** hay envío automático. Futuro posible: institución de la oferta. | No detectado. | Ninguno. | Aviso principal y, si se deriva, autorización separada; marketing opcional solo si se incorpora. | `DRAFT-001` propuesto; sin evidencia. | Definir envío y manejo de errores. |
| Contacto comercial | Recibir consulta de una institución. | No es derivación de estudiante. | No se encontró suscripción automática. | Ninguno; submit solo muestra alerta. | Aviso de finalidad y privacidad antes de un envío real; necesidad de casilla a revisar. | `DRAFT-001` propuesto; sin registro. | Definir canal, almacenamiento y destinatario. |
| Futuros eventos | A definir por actividad. | No implementado. | No implementado. | Sin formulario. | Definir por finalidad; imagen separada de inscripción y marketing. | No hay versión aplicada ni evidencia. | REVISIÓN LEGAL PENDIENTE. |
| Futura Orientación Vocacional | A definir antes de captar datos. | No implementado. | No implementado. | Sin formulario. | Datos mínimos y tratamiento de menores sujetos a revisión profesional. | No hay versión aplicada ni evidencia. | REVISIÓN LEGAL PENDIENTE. |

No premarcar casillas ni condicionar consultas a marketing. Informar el destinatario **real** antes de compartir; si se implementa derivación, obtener institución dinámicamente. Versionar el texto mostrado y asociar la decisión a un registro solo tras definir backend, retención y revisión legal. Las versiones de borrador en `next-app/lib/legal-config.js` **no son prueba de aceptación**.
