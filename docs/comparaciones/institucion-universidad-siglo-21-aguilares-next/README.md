# Validación — Universidad Siglo 21 | Aguilares

- Ruta: `/aguilares/universidad-siglo-21`.
- Identidad: `universidad-siglo-21-aguilares` / `aguilares` / `universidad-siglo-21`.
- Plantilla: ruta dinámica institucional e `InstitutionPageClient.js` compartidos; no se creó una página ni CSS específicos.

## Contenido canónico preservado

La sede reproduce los valores Vite de Aguilares: portada `imageBank.siglo`, logo `US21`, marquee/galería compartida, slogan, descripción, dirección heredada `San Martín 124, Concepción` y WhatsApp `3865 41 2020`. Coincide visualmente y en datos con las sedes de Concepción y Monteros porque así está definido en Vite, manteniendo un ID interno independiente.

Carreras resumidas, en orden: Abogacía, Contador Público, Lic. en Administración e Higiene y Seguridad. Ninguna tiene aún ruta contextual bajo Aguilares.

## Capturas

| Archivo | Viewport | Tema | Resultado |
| --- | --- | --- | --- |
| `universidad-siglo-21-aguilares-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido; portada, logo, marquee, carreras y footer. |
| `universidad-siglo-21-aguilares-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido; responsive compartido. |

El modo claro/oscuro usa el mecanismo global persistido en `localStorage.guiaEducativaTheme`; no se agregaron reglas específicas para Aguilares.

## Validación de rutas

- La ficha institucional responde HTTP 200.
- Instituto Santa Bárbara y Academia Profesional Norte de Aguilares continúan en HTTP 404.
- Las cuatro carreras de Siglo 21 Aguilares continúan en HTTP 404.
