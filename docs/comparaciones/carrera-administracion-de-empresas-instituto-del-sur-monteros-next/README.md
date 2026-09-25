# Administración de Empresas — Instituto del Sur, Monteros

## Alcance

- Career master nuevo: `administracion-de-empresas`.
- Offering: `instituto-del-sur-monteros-administracion-de-empresas`.
- Institución: `instituto-del-sur-monteros`; ciudad: `monteros`.
- Ruta: `/monteros/instituto-del-sur/carreras/administracion-de-empresas`.
- Es una carrera distinta de `lic-en-administracion`: la demo denomina esta propuesta **Administración de Empresas** y la describe como `Organización, procesos y gestión operativa.`, mientras que la propuesta de Siglo 21 es **Lic. en Administración** con otra descripción.
- Formulario reutilizado con `localStorage.guiaEducativaLeads`. No existe WhatsApp propio de offering: se aplica el fallback institucional `3865 44 8712` (`543865448712` mediante la lógica compartida).

## Capturas técnicas

| Archivo | Viewport CSS | Tema | Estado |
| --- | --- | --- | --- |
| `administracion-de-empresas-instituto-del-sur-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido; 380072 bytes |
| `administracion-de-empresas-instituto-del-sur-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido; 198632 bytes |

Se generaron mediante Chrome headless CLI sin CDP ni cambios a Vite. La plantilla compartida conserva el mecanismo existente de claro/oscuro; las capturas corresponden a claro. La composición se mantiene responsive en ambos viewports.

## Validación e integridad

- `npm run lint` y `npm run build`: correctos.
- HTTP 200: rutas generales, Concepción (3 instituciones y 10 carreras), Siglo 21 Monteros (ficha y 4 carreras), e Instituto del Sur (ficha, Marketing, Recursos Humanos y Administración de Empresas).
- HTTP 404: Administración de Empresas bajo Siglo 21 o Concepción, instituciones aún sin migrar, rutas inexistentes y Aguilares.
- La ficha muestra el título, institución, descripción, imagen `imageBank.classroom`, badge `Próximo ingreso`, modalidad presencial y duración de 3 años auditados, sin heredar contexto de Lic. en Administración.
- `CareerPageClient.js`, `carrera.css`, Vite, baselines, dependencias, `package.json` y lockfiles permanecen intactos.
