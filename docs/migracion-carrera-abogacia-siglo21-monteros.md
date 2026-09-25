# Auditoría — Abogacía · Universidad Siglo 21 · Monteros

## Identidad canónica

Vite muestra Abogacía como primera tarjeta visible de Universidad Siglo 21 en Monteros. Proviene de la misma entrada canónica de marca: ID de tarjeta `abogacia`, slug `abogacia`, imagen `imageBank.classroom`, badge «Inscripciones abiertas» y orden 1.

| Campo | Valor auditado |
| --- | --- |
| Nombre | Abogacía |
| Carrera maestra | `abogacia` existente; no debe duplicarse como `abogacia-monteros` |
| Institución interna | `universidad-siglo-21-monteros` |
| Ciudad | `monteros` |
| Ruta futura | `/monteros/universidad-siglo-21/carreras/abogacia` |
| Imagen / badge | `imageBank.classroom` / Inscripciones abiertas |

## Futura offering independiente

La offering futura debe tener `institutionId: universidad-siglo-21-monteros`, `citySlug: monteros` y `careerId: abogacia`, sin reutilizar la offering de Concepción. La normalización Vite de esta tarjeta determina modalidad Presencial, duración 3 años, título Abogacía, turnos Consultar, validez Sí, formulario habilitado y fallback WhatsApp institucional `3865 41 2020`. La sede/dirección canónica del objeto Vite compartido es «San Martín 124, Concepción»; se documenta como dato canónico heredado, no se corrige ni se muestra como elemento nuevo.

Abogacía Monteros y Concepción comparten carrera maestra e imagen/badge canónicos, pero necesitan offerings independientes por sus IDs de sede distintos. Antes de implementar, se deberá volver a verificar si Vite proporciona una diferencia local adicional; no se asume igualdad por nombre de marca.

## Reutilización prevista

`CareerPageClient.js`, `carrera.css`, formulario, `localStorage.guiaEducativaLeads`, tabs, FAQ, sidebar, footer y lógica WhatsApp son reutilizables sin cambios. La carrera Monteros debe permanecer 404 hasta crear expresamente la offering y la ruta estática correspondiente.
