# Auditoría — Lic. en Administración | Universidad Siglo 21 | Aguilares

## Alcance

Documento exclusivamente documental. No implementa Lic. en Administración ni habilita su ruta.

## Identidad y offering futura

| Campo | Valor |
| --- | --- |
| Carrera | Lic. en Administración |
| `careerId` | `lic-en-administracion` |
| Career master | Ya existe y coincide conceptualmente con Vite |
| Institución | `universidad-siglo-21-aguilares` |
| Ciudad | `aguilares` |
| Offering futura | `universidad-siglo-21-aguilares-lic-en-administracion` |
| Ruta futura | `/aguilares/universidad-siglo-21/carreras/lic-en-administracion` |
| Mapping | No requerido |

## Datos canónicos Vite

| Dato | Valor |
| --- | --- |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Lic. en Administración |
| Sede | San Martín 124, Concepción (dato heredado) |
| Turnos | Consultar |
| Validez | Sí |
| Imagen | `imageBank.design` |
| Badge | Próximo ingreso |
| Visible | Sí |
| Orden | 3 |
| Formulario | Simulado, habilitado |
| WhatsApp propio | No |
| Fallback | Institucional `3865 41 2020` |

Los valores coinciden canónicamente con Concepción y Monteros, pero la offering de Aguilares debe existir de manera independiente.

## Plantilla y cuarta carrera

La implementación futura reutiliza el master `lic-en-administracion`, `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y WhatsApp.

La cuarta y última carrera visible es **Higiene y Seguridad**: slug y `careerId` previstos `higiene-y-seguridad`, career master existente, orden 4. Tras implementar Lic. en Administración quedará sólo esa carrera pendiente para Siglo 21 Aguilares.
