GET — ADMINISTRADOR/CMS COMPLETO DE GUÍA EDUCATIVA TUCUMÁN

PROYECTO
Guía Educativa Tucumán — GET

Repositorio:
C:\Codex\GET-production

Aplicación:
C:\Codex\GET-production\next-app

Web pública:
https://guiaeducativatuc.com.ar

Desarrollo actual:
localhost

────────────────────────────────────────
IMPORTANTE ANTES DE EMPEZAR
────────────────────────────────────────

Quiero construir un ADMINISTRADOR COMPLETO de GET.

La web pública ya está aproximadamente al 90%.

NO quiero rehacer la página pública.

Quiero construir encima de lo que ya existe un CMS/administrador privado que permita que el equipo pueda mantener GET sin tener que recurrir a Codex para cada modificación cotidiana.

El objetivo final es que aproximadamente el 90–95 % de:

- textos;
- imágenes;
- logos;
- videos;
- banners;
- instituciones;
- carreras;
- ciudades;
- capacitaciones;
- eventos;
- servicios;
- colores;
- tipografías;
- tamaños;
- orden de secciones;
- visibilidad;
- SEO;
- PDFs;
- información institucional;

pueda administrarse desde una interfaz visual.

Codex seguirá siendo necesario para funcionalidades nuevas o cambios estructurales de programación.

────────────────────────────────────────
RESPETAR AGENTS.md
────────────────────────────────────────

ANTES DE HACER NADA:

leer íntegramente:

AGENTS.md

Este mensaje es la ESPECIFICACIÓN MAESTRA del administrador.

Si AGENTS.md exige dividir el desarrollo por etapas:

RESPETARLO.

NO ignorar AGENTS.md para intentar hacer todo de una vez.

Pero:

- conservar esta especificación como objetivo global;
- avanzar todo lo posible dentro de cada etapa permitida;
- implementar código real, no limitarse a describir lo que se hará;
- validar cada etapa;
- detenerse únicamente cuando AGENTS.md realmente lo requiera;
- informar exactamente qué etapa sigue.

NO empezar nuevamente desde cero cada vez.

────────────────────────────────────────
MUY IMPORTANTE: CAMBIOS EXISTENTES
────────────────────────────────────────

El working tree actualmente contiene cambios previos.

Entre ellos existe trabajo relacionado con:

- diseño público;
- páginas;
- fondos;
- banners;
- estructura legal;
- docs/legal;
- legal-config.js;
- otros cambios todavía no publicados.

NO:

- reset;
- checkout destructivo;
- clean;
- stash destructivo;
- borrar;
- sobrescribir;

ningún trabajo existente.

Separar siempre:

CAMBIOS PREEXISTENTES

de:

CAMBIOS DEL ADMINISTRADOR.

────────────────────────────────────────
NO PUBLICAR
────────────────────────────────────────

Netlify actualmente tiene los deploys de producción pausados por créditos.

Por lo tanto:

NO git add
NO commit
NO push
NO deploy
NO Netlify

Trabajar y validar únicamente en LOCAL.

La conexión con servicios/backend sí puede realizarse cuando corresponda y sea segura.

────────────────────────────────────────
1. CONCEPTO GENERAL
────────────────────────────────────────

Crear un administrador privado dentro del mismo ecosistema GET.

Ruta principal:

/admin

Login:

/admin/login

Una persona NO autenticada que intente entrar a:

/admin

debe ser enviada a:

/admin/login

El administrador debe sentirse como un producto profesional independiente de la página pública, pero claramente perteneciente a GET.

NO quiero una pantalla técnica para programadores.

Debe poder utilizarla una persona de:

- comunicación;
- marketing;
- ventas;
- administración;

sin conocimientos de programación.

La prioridad es:

FACILIDAD DE USO
+
CLARIDAD
+
SEGURIDAD
+
PREVISUALIZACIÓN.

────────────────────────────────────────
2. LOGO DEL ADMINISTRADOR
────────────────────────────────────────

NO crear un nuevo logo.

Quiero utilizar el MISMO LOGO GET que actualmente aparece en la información/footer de la parte inferior de la página pública.

Revisar el componente/footer actual.

Identificar exactamente:

- asset;
- archivo;
- componente;

que utiliza ese logo.

REUTILIZARLO.

No recrearlo con texto.

No modificar la marca.

Si existen variantes claro/oscuro:

utilizar la que visualmente corresponda al sidebar.

────────────────────────────────────────
3. ESTÉTICA GENERAL DEL ADMIN
────────────────────────────────────────

Quiero un administrador:

- limpio;
- premium;
- moderno;
- profesional;
- fácil de leer;
- visualmente ordenado.

No quiero que parezca:

- WordPress antiguo;
- panel técnico;
- formulario interminable;
- Bootstrap genérico;
- dashboard saturado.

Usar como referencia la identidad visual actual de GET.

Sidebar oscuro/elegante.

Contenido principal claro.

Tarjetas livianas.

Sombras suaves.

Buenos espacios.

Tipografía actual del proyecto.

Iconos consistentes.

Animaciones discretas.

Excelente jerarquía.

────────────────────────────────────────
4. ESTRUCTURA PRINCIPAL
────────────────────────────────────────

DESKTOP:

SIDEBAR IZQUIERDO
+
ÁREA DE TRABAJO
+
VISTA PREVIA CUANDO SE EDITA.

Sidebar aproximadamente:

Logo GET

Panel

PÁGINAS
Home
Ciudades
Instituciones
Carreras
Capacitaciones
Eventos
Servicios
Orientación Vocacional
Nosotros

CONTENIDO
Banners
Multimedia
Menús
Footer

CONFIGURACIÓN
Diseño
SEO
Formularios
Legal

SISTEMA
Usuarios
Historial
Configuración

No tomar estos nombres rígidamente si la auditoría descubre una arquitectura distinta.

Adaptarlos al sitio REAL.

────────────────────────────────────────
5. AUDITAR TODAS LAS RUTAS ACTUALES
────────────────────────────────────────

Antes de crear el CMS:

auditar completamente:

next-app/app

y las fuentes actuales de contenido.

Generar un inventario de:

- rutas;
- tipos de página;
- componentes;
- datos;
- assets;
- contenido estático;
- contenido dinámico;
- configuración;
- datos duplicados;
- fuentes actuales.

Quiero saber exactamente qué administra hoy cada archivo.

NO inventar módulos que no tengan relación con GET.

────────────────────────────────────────
6. NO ROMPER LAS URLs
────────────────────────────────────────

Las URLs públicas actuales deben conservarse.

Ejemplos:

/
 /concepcion
 /monteros
 /aguilares

/concepcion/universidad-siglo-21

/concepcion/universidad-siglo-21/carreras/abogacia

/carreras
/carreras/abogacia

/instituciones

/eventos
/servicios
etc.

El administrador cambia la FUENTE DE DATOS.

NO debe destruir la estructura pública existente.

────────────────────────────────────────
7. SEO ES PRIORIDAD
────────────────────────────────────────

NO convertir GET en una SPA que dependa exclusivamente del navegador.

Mantener:

- renderizado compatible con SEO;
- metadata;
- title;
- description;
- canonical;
- Open Graph;
- schema cuando exista;
- sitemap;
- URLs indexables;
- contenido visible para buscadores.

Los datos pueden venir del CMS/database.

Pero Next.js debe seguir resolviendo correctamente las páginas públicas.

────────────────────────────────────────
8. BACKEND
────────────────────────────────────────

La solución preferida es:

SUPABASE

para:

- autenticación;
- base de datos;
- eventualmente almacenamiento;
- permisos;
- auditoría.

PERO:

primero revisar la integración actual.

Ya existe preparación para Supabase en GET para catálogo.

Auditar:

- clientes Supabase existentes;
- variables;
- PUBLIC_CATALOG_SOURCE;
- carpetas Supabase;
- migrations;
- configuración.

NO crear un segundo proyecto Supabase si GET ya tiene uno correctamente asociado.

NO conectarse a un proyecto desconocido.

NO inventar credenciales.

────────────────────────────────────────
9. SI SUPABASE YA ESTÁ CONECTADO
────────────────────────────────────────

Si el repositorio está correctamente vinculado a un proyecto GET:

reutilizarlo.

Crear migraciones versionadas.

NO modificar destructivamente tablas existentes.

NO borrar datos.

NO hacer DROP de tablas existentes sin una necesidad extraordinaria y explícitamente justificada.

────────────────────────────────────────
10. SI SUPABASE NO ESTÁ COMPLETAMENTE CONECTADO
────────────────────────────────────────

Si faltan:

- URL;
- anon key;
- proyecto;
- conexión;

NO inventar valores.

Preparar:

- código;
- migrations;
- configuración;
- documentación;

y señalar claramente qué dato necesito completar.

Continuar todo lo posible sin falsear una conexión exitosa.

────────────────────────────────────────
11. AUTENTICACIÓN
────────────────────────────────────────

Usar Supabase Auth o la solución segura ya existente.

Login con:

Usuario/email
Contraseña

No guardar contraseñas propias en una tabla.

No inventar un sistema de hashing casero.

No guardar contraseñas en localStorage.

Agregar:

- sesión segura;
- cerrar sesión;
- recuperación de contraseña;
- protección server-side;
- middleware si corresponde.

NO proteger /admin solamente ocultándolo desde React.

El servidor debe verificar la sesión.

────────────────────────────────────────
12. USUARIOS Y ROLES
────────────────────────────────────────

Preparar al menos:

SUPERADMIN
ADMIN
EDITOR

SUPERADMIN:
- todo;
- usuarios;
- configuración;
- diseño;
- publicar.

ADMIN:
- contenido;
- multimedia;
- SEO;
- publicar;
- sin acciones críticas de infraestructura.

EDITOR:
- crear/editar borradores;
- multimedia;
- contenido;
- NO administrar usuarios;
- publicación según permiso configurable.

Diseñar el sistema extensible.

────────────────────────────────────────
13. RLS Y SEGURIDAD
────────────────────────────────────────

Usar Row Level Security cuando corresponda.

La web pública solo debe leer información PUBLICADA.

Usuarios autenticados:

según rol.

Ninguna credencial privilegiada debe llegar al navegador.

Service role, si fuera necesaria:

SOLO SERVER.

Nunca:

NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY.

────────────────────────────────────────
14. NO CREAR CREDENCIALES INSEGURAS
────────────────────────────────────────

NO crear:

admin/admin

admin123

contraseñas hardcodeadas.

Si no existe un usuario administrador:

preparar el flujo para crear/invitar el primer usuario.

Para desarrollo:

indicar exactamente qué paso falta.

No introducir un bypass que pudiera terminar en producción accidentalmente.

────────────────────────────────────────
15. DASHBOARD
────────────────────────────────────────

Crear:

/admin

Dashboard claro.

Mostrar como mínimo:

- páginas publicadas;
- borradores;
- cambios pendientes;
- cantidad de ciudades;
- instituciones;
- carreras;
- eventos;
- servicios;
- últimos cambios;
- últimas publicaciones.

Acciones rápidas:

+ Nueva institución
+ Nueva carrera
+ Nuevo evento
+ Subir multimedia

No sobrecargar.

────────────────────────────────────────
16. SIDEBAR
────────────────────────────────────────

Sidebar izquierda permanente en desktop.

Debe contener:

LOGO GET arriba.

Después navegación.

Debe poder:

- colapsarse;
- mostrar iconos;
- mantener tooltips;
- indicar opción activa.

En tablet/mobile:

drawer lateral.

────────────────────────────────────────
17. BREADCRUMBS
────────────────────────────────────────

Arriba del área de trabajo mostrar claramente dónde estoy.

Ejemplo:

Instituciones
>
Universidad Siglo 21
>
Concepción
>
Editar

Nunca quiero que una persona se pregunte qué página está modificando.

────────────────────────────────────────
18. PRINCIPIO FUNDAMENTAL DEL EDITOR
────────────────────────────────────────

ESTE PUNTO ES FUNDAMENTAL.

NO quiero un administrador donde una persona modifica campos sin entender cómo quedará.

MIENTRAS EDITA:

DEBE VER EL RESULTADO.

Crear una:

VISTA PREVIA EN VIVO.

────────────────────────────────────────
19. VISTA PREVIA FLOTANTE
────────────────────────────────────────

En desktop:

cuando entro a EDITAR una página o elemento, mostrar una vista previa flotante/sticky en el sector derecho.

Visualmente:

┌ Sidebar ┐ ┌ Editor ┐ ┌ Vista previa ┐
│         │ │        │ │               │
│ menú    │ │ campos │ │ página        │
│         │ │        │ │ real          │
└─────────┘ └────────┘ └───────────────┘

La vista previa debe sentirse como un panel flotante profesional.

Puede:

- aparecer con animación suave;
- mantenerse sticky;
- poder minimizarse;
- poder ampliarse;
- poder ocultarse temporalmente.

NO usar una ventana emergente molesta.

────────────────────────────────────────
20. CAMBIOS ANTES DE GUARDAR
────────────────────────────────────────

Cuando una persona modifica:

- texto;
- imagen;
- color;
- tamaño;
- alineación;
- tipografía;
- fondo;
- sección;

la vista previa debe actualizarse INMEDIATAMENTE.

ANTES DE:

Guardar borrador

y ANTES DE:

Publicar.

Eso significa:

CAMBIO EN FORMULARIO
→
PREVIEW INSTANTÁNEA

sin modificar todavía la web pública.

────────────────────────────────────────
21. RESALTAR EXACTAMENTE QUÉ SE EDITA
────────────────────────────────────────

Quiero que quede CLARÍSIMO qué elemento se está editando.

Ejemplo:

Estoy modificando:

Home
→ Hero
→ Título principal

En el editor mostrar:

EDITANDO
Hero · Título principal

Y en la preview:

resaltar momentáneamente ese elemento con:

- borde;
- glow suave;
- overlay;
- etiqueta;

solo dentro del administrador.

Ejemplo visual:

┌──────────────────────────────┐
│ EDITANDO: Título principal   │
│                              │
│ Encontrá dónde estudiar...   │
│                              │
└──────────────────────────────┘

La marca debe desaparecer o suavizarse al perder foco.

NUNCA debe aparecer en la página pública.

────────────────────────────────────────
22. CLICK DIRECTO EN PREVIEW
────────────────────────────────────────

Si técnicamente es razonable:

permitir que una persona haga click sobre un elemento editable dentro de la preview.

Ejemplo:

click en título

→ editor abre automáticamente:

Hero > Título.

click en imagen

→ editor abre:

Hero > Imagen.

click en botón

→ editor abre:

Hero > CTA.

Implementarlo mediante una arquitectura reutilizable.

No agregar hacks específicos para cada texto.

────────────────────────────────────────
23. SELECTOR DE DISPOSITIVO
────────────────────────────────────────

La preview debe tener:

Desktop
Tablet
Móvil

La persona debe poder comprobar los cambios en los tres tamaños.

Añadir:

Abrir preview completa

para verla en un viewport mayor.

────────────────────────────────────────
24. CAMBIOS SIN GUARDAR
────────────────────────────────────────

Mostrar claramente:

Cambios sin guardar

cuando existan.

Botones:

Descartar
Guardar borrador
Publicar

Si intenta salir:

advertir:

“Tenés cambios sin guardar.”

No perder cambios silenciosamente.

────────────────────────────────────────
25. GUARDAR BORRADOR ≠ PUBLICAR
────────────────────────────────────────

Separar estrictamente:

BORRADOR

de:

PUBLICADO.

Guardar borrador:

NO cambia la web pública.

Publicar:

SÍ cambia la web pública.

Estados posibles:

Borrador
Publicado
Cambios pendientes
Archivado

────────────────────────────────────────
26. PUBLICAR CONTENIDO NO DEBE HACER DEPLOY
────────────────────────────────────────

Esto es MUY IMPORTANTE.

Cuando el administrador esté terminado:

cambiar un teléfono o una imagen y presionar:

PUBLICAR

NO debería necesitar:

Git
Codex
Netlify deploy.

La publicación debe ocurrir mediante:

DATABASE
+
revalidación de Next.js.

Usar cuando corresponda:

revalidatePath
revalidateTag

o arquitectura equivalente moderna.

Así los cambios editoriales se actualizan sin consumir deploys de Netlify.

────────────────────────────────────────
27. VERSIONES
────────────────────────────────────────

Guardar historial.

Cada publicación debe permitir saber:

- usuario;
- fecha;
- entidad;
- página;
- cambio realizado;
- versión anterior;
- versión nueva.

Idealmente permitir:

Restaurar versión.

No sobrescribir permanentemente el contenido anterior sin historial.

────────────────────────────────────────
28. AUDIT LOG
────────────────────────────────────────

Crear historial de acciones:

CREATED
UPDATED
PUBLISHED
UNPUBLISHED
ARCHIVED
RESTORED
DELETED
LOGIN

Cuando corresponda.

Guardar:

- actor;
- fecha;
- entidad;
- ID;
- acción.

No almacenar contraseñas ni secretos.

────────────────────────────────────────
29. BORRADO SEGURO
────────────────────────────────────────

No permitir eliminar fácilmente:

- ciudad;
- institución;
- carrera;
- página SEO;

si está publicada.

Primero ofrecer:

ARCHIVAR

o

DESPUBLICAR.

Para eliminación definitiva:

confirmación explícita.

────────────────────────────────────────
30. HOME
────────────────────────────────────────

Menú:

Home

Debe permitir editar la Home actual.

NO rediseñarla.

Mostrar estructura real detectada.

Permitir editar lo esencial:

- logo;
- textos;
- video/fondo;
- imágenes;
- CTA;
- colores;
- tipografías;
- tamaños;
- alineaciones;
- visibilidad;
- orden de secciones cuando sea seguro.

No permitir romper la estructura con CSS arbitrario.

────────────────────────────────────────
31. SISTEMA DE SECCIONES
────────────────────────────────────────

Para páginas compatibles:

mostrar las secciones en orden.

Ejemplo:

≡ Hero
≡ Orientación Vocacional
≡ Expo GET
≡ Carreras
≡ Instituciones
≡ CTA
≡ Footer

Permitir:

- mostrar/ocultar;
- reordenar con drag & drop;

SOLO donde técnicamente sea seguro.

No permitir mover Header debajo del Footer o estructuras absurdas.

────────────────────────────────────────
32. HOME: PREVIEW
────────────────────────────────────────

Si selecciono:

Hero

la preview debe desplazarse al Hero.

Si selecciono:

Orientación Vocacional

la preview debe enfocarla.

Esto debe facilitar muchísimo la edición.

────────────────────────────────────────
33. CIUDADES
────────────────────────────────────────

Menú:

Ciudades

Mostrar lista real de ciudades.

Ejemplo actual:

Concepción
Monteros
Aguilares

Tarjetas o tabla con:

- nombre;
- slug;
- estado;
- instituciones;
- carreras;
- último cambio.

Acción:

+ Nueva ciudad

────────────────────────────────────────
34. EDITAR CIUDAD
────────────────────────────────────────

Permitir:

- nombre;
- slug;
- hero;
- imagen;
- títulos;
- textos;
- carreras destacadas;
- instituciones destacadas;
- banners;
- orientación;
- expo;
- CTA;
- orden;
- visibilidad;
- SEO;
- diseño específico cuando corresponda.

Preview en vivo de la Home de esa ciudad.

────────────────────────────────────────
35. CREAR NUEVA CIUDAD
────────────────────────────────────────

Formulario guiado.

No pedir 50 cosas al mismo tiempo.

PASO 1
Información básica.

PASO 2
Diseño/imagen.

PASO 3
Contenido inicial.

PASO 4
SEO.

PASO 5
Preview.

PASO 6
Guardar borrador.

No publicar automáticamente.

────────────────────────────────────────
36. INSTITUCIONES
────────────────────────────────────────

Menú:

Instituciones.

Mostrar buscador y filtros.

Columnas:

- nombre;
- ciudad;
- carreras;
- estado;
- destacada;
- última actualización.

Acciones:

Editar
Duplicar
Archivar
Preview

────────────────────────────────────────
37. EDITAR INSTITUCIÓN
────────────────────────────────────────

Permitir editar lo que actualmente utiliza GET:

- nombre;
- slug;
- logo;
- portada;
- descripción;
- dirección;
- mapa;
- coordenadas si existen;
- WhatsApp;
- teléfono;
- email;
- web;
- redes;
- horarios;
- carreras;
- destacadas;
- galería;
- banners;
- CTA;
- SEO;
- diseño.

No inventar campos si la web no los necesita.

────────────────────────────────────────
38. DUPLICAR A OTRA CIUDAD
────────────────────────────────────────

Cuando una institución existe en varias ciudades:

permitir reutilizar información institucional.

No duplicar innecesariamente:

logo
marca
descripción corporativa

cuando pueda existir como entidad común.

Los datos de sede pueden variar:

- dirección;
- WhatsApp;
- teléfono;
- carreras;
- horarios.

Diseñar el modelo correctamente.

────────────────────────────────────────
39. CARRERAS
────────────────────────────────────────

Menú:

Carreras

Mostrar:

- nombre;
- institución;
- ciudad/sede;
- modalidad;
- duración;
- destacada;
- estado;
- SEO.

Buscador.

Filtros.

────────────────────────────────────────
40. EDITAR CARRERA
────────────────────────────────────────

Permitir editar:

- nombre;
- slug;
- descripción;
- introducción;
- imagen;
- video;
- duración;
- modalidad;
- título;
- validez;
- ingreso;
- requisitos;
- salida laboral;
- plan de estudios;
- PDF;
- institución;
- sede;
- ciudad;
- badges;
- “Nueva carrera”;
- destacada;
- fechas;
- CTA;
- SEO.

Mantener los campos según el modelo REAL existente.

────────────────────────────────────────
41. PLAN DE ESTUDIOS
────────────────────────────────────────

Crear editor visual.

Ejemplo:

1.º Año
≡ Materia 1
≡ Materia 2
≡ Materia 3

+ Agregar materia

+ Agregar año

Reordenar.

Subir PDF.

Preview.

────────────────────────────────────────
42. CAPACITACIONES
────────────────────────────────────────

Administrar:

- cursos;
- capacitaciones docentes;
- datos;
- imágenes;
- fechas;
- modalidad;
- duración;
- institución;
- inscripción;
- documentos;
- SEO.

Reutilizar la estructura actual.

────────────────────────────────────────
43. EVENTOS
────────────────────────────────────────

Administrar:

- título;
- descripción;
- imagen;
- banner;
- fecha;
- horario;
- ciudad;
- lugar;
- estado;
- CTA;
- multimedia;
- SEO.

Estados:

Próximamente
Confirmado
Finalizado
Cancelado
Borrador

Preview visual.

────────────────────────────────────────
44. SERVICIOS
────────────────────────────────────────

Administrar:

- listado;
- cada servicio;
- hero;
- imagen;
- textos;
- CTA;
- banners;
- secciones;
- SEO.

Ejemplos actuales:

Redes Sociales
Meta Ads
Google Ads
Podcast
etc.

No hardcodear únicamente esos.

Leer servicios reales del proyecto.

────────────────────────────────────────
45. ORIENTACIÓN VOCACIONAL
────────────────────────────────────────

Crear módulo de administración del CONTENIDO visible.

Permitir:

- título;
- descripción;
- imagen;
- disponibilidad;
- texto “próximamente”;
- ciudades;
- CTA.

IMPORTANTE:

Actualmente la parte legal identificó que NO existe un formulario.

NO inventar ni activar todavía un formulario de datos personales.

La futura inscripción queda pendiente de revisión legal específica por posible participación de menores.

────────────────────────────────────────
46. NOSOTROS
────────────────────────────────────────

Si existe:

administrar contenido actual.

Textos.
Equipo.
Fotos.
Cargos.
Secciones.
SEO.

No inventar miembros.

────────────────────────────────────────
47. BANNERS
────────────────────────────────────────

Crear módulo:

Banners.

Debe permitir localizar banners existentes.

Mostrar:

- página;
- tipo;
- imagen;
- título;
- estado.

Permitir editar:

- imagen;
- overlay;
- texto;
- CTA;
- posición;
- altura;
- alineación;
- color;
- dato secundario;
- visibilidad.

────────────────────────────────────────
48. NO CONVERTIRLO EN PHOTOSHOP
────────────────────────────────────────

El objetivo no es editar píxel por píxel.

Crear controles simples.

Ejemplo:

Altura:
Compacto
Normal
Grande

Overlay:
slider

Alineación:
Izquierda
Centro
Derecha

Título:
slider con límites seguros.

No permitir valores absurdos.

────────────────────────────────────────
49. MULTIMEDIA
────────────────────────────────────────

Crear Biblioteca Multimedia.

Categorías:

Imágenes
Videos
Logos
PDF
Documentos

Permitir:

Subir
Buscar
Filtrar
Reutilizar
Eliminar si no está en uso
Copiar referencia

────────────────────────────────────────
50. STORAGE
────────────────────────────────────────

Antes de decidir:

auditar media actual.

Actualmente se detectaron referencias a:

Cloudinary
Unsplash
assets locales
otros recursos externos.

NO agregar otro proveedor innecesariamente.

Si Cloudinary ya está correctamente preparado para subida:

evaluar reutilizarlo.

Si no existe infraestructura de upload adecuada:

Supabase Storage es una opción válida.

Elegir UNA arquitectura principal para nuevos uploads.

Documentar decisión.

────────────────────────────────────────
51. ASSETS EXISTENTES
────────────────────────────────────────

No hace falta migrar todos los assets el primer día.

Permitir registrar:

ASSET LOCAL
ASSET EXTERNO
ASSET STORAGE

en la biblioteca.

Migrar gradualmente.

────────────────────────────────────────
52. MEDIA PICKER
────────────────────────────────────────

Cuando edito una imagen:

botón:

Cambiar imagen

abre biblioteca.

Opciones:

Seleccionar existente
Subir nueva

Preview inmediata.

────────────────────────────────────────
53. ALT TEXT
────────────────────────────────────────

Para imágenes relevantes:

campo:

Texto alternativo

Mostrar advertencia si falta.

No generar automáticamente basura SEO.

────────────────────────────────────────
54. DISEÑO GLOBAL
────────────────────────────────────────

Crear:

Diseño

para controlar tokens importantes.

Ejemplos:

- color principal;
- color secundario;
- fondo;
- color de texto;
- tipografía;
- tipografía de títulos;
- border-radius;
- sombras;
- botones;
- espaciado base.

No permitir CSS libre.

────────────────────────────────────────
55. INHERIT / OVERRIDE
────────────────────────────────────────

Una página debe poder:

Usar diseño global

o:

Personalizar esta página.

Ejemplo:

☑ Usar color global

desactivar:

→ selector de color particular.

Eso evita repetir configuración innecesariamente.

────────────────────────────────────────
56. TIPOGRAFÍAS
────────────────────────────────────────

Permitir seleccionar solamente tipografías soportadas.

NO aceptar una URL arbitraria.

NO permitir subir fonts desde el admin inicialmente.

Preservar performance.

────────────────────────────────────────
57. CONTROLES VISUALES
────────────────────────────────────────

Crear componentes reutilizables:

TextField
Textarea
RichText controlado
ColorPicker
MediaPicker
Slider
Toggle
Select
LinkEditor
DatePicker
Repeater
SortableList
RelationPicker

No repetir controles distintos en cada módulo.

────────────────────────────────────────
58. RICH TEXT
────────────────────────────────────────

Si hace falta contenido enriquecido:

permitir solamente:

- párrafos;
- negrita;
- cursiva;
- links;
- listas;
- subtítulos.

NO permitir HTML/JS arbitrario.

Sanitizar contenido.

────────────────────────────────────────
59. MENÚS
────────────────────────────────────────

Crear módulo:

Menús

Administrar las opciones existentes.

Permitir:

- título;
- URL;
- orden;
- mostrar/ocultar.

No permitir eliminar accidentalmente navegación crítica.

Preview.

────────────────────────────────────────
60. FOOTER
────────────────────────────────────────

Módulo:

Footer.

Permitir editar:

- textos;
- logo;
- links;
- redes;
- datos;
- columnas;
- enlaces legales una vez aprobados.

Usar el footer REAL del sitio.

────────────────────────────────────────
61. SEO
────────────────────────────────────────

Crear módulo SEO.

Debe poder editar por página:

SEO Title
Meta Description
Canonical
Open Graph title
Open Graph description
Open Graph image
Index / Noindex

Con preview aproximada:

Google Search Preview.

────────────────────────────────────────
62. SEO Y SLUG
────────────────────────────────────────

Si una página publicada cambia de slug:

mostrar ADVERTENCIA.

Ejemplo:

“Cambiar esta URL puede afectar enlaces existentes y posicionamiento.”

Ofrecer:

Crear redirección desde URL anterior.

No cambiar slugs silenciosamente.

────────────────────────────────────────
63. REDIRECCIONES
────────────────────────────────────────

Crear estructura de redirects.

Cuando corresponda:

old_path
new_path
status
created_at

Preferir redirect permanente cuando sea realmente un cambio definitivo.

No crear cadenas de redirects.

────────────────────────────────────────
64. SITEMAP
────────────────────────────────────────

Cuando se publique:

- ciudad;
- institución;
- carrera;
- página;

el sitemap debe reflejarlo automáticamente según reglas existentes.

Cuando se archive/noindex:

actuar correctamente.

Preservar arquitectura SEO.

────────────────────────────────────────
65. FORMULARIOS
────────────────────────────────────────

Crear módulo de visualización/configuración de formularios actuales.

PERO:

NO implementar todavía un backend nuevo de leads sin respetar el trabajo legal pendiente.

Mostrar inicialmente:

- dónde existe cada formulario;
- qué campos tiene;
- estado;
- destino actual.

Recordar hallazgo previo:

las consultas actualmente usan localStorage.

Esto requerirá una etapa específica posterior.

────────────────────────────────────────
66. LEGAL
────────────────────────────────────────

Crear lugar reservado para:

Legal.

PERO:

los documentos actuales en:

docs/legal/

son BORRADORES.

NO publicarlos automáticamente.

NO convertirlos en páginas públicas sin revisión.

En el administrador puede mostrarse:

Legal
“Pendiente de revisión”

si aporta.

────────────────────────────────────────
67. HISTORIAL
────────────────────────────────────────

Crear:

Historial

Filtros:

usuario
fecha
tipo
entidad
acción

Ejemplo:

María
12/10/2026 18:32
Editó
Universidad Siglo 21 · Concepción

Click:

Ver cambios

────────────────────────────────────────
68. DIFF
────────────────────────────────────────

Cuando sea viable:

mostrar:

ANTES
vs
DESPUÉS

para cambios importantes.

Especialmente:

- textos;
- URLs;
- SEO;
- datos institucionales.

────────────────────────────────────────
69. RESTAURAR
────────────────────────────────────────

Desde historial:

Restaurar esta versión

Debe crear una NUEVA versión basada en la anterior.

No borrar historial intermedio.

────────────────────────────────────────
70. PAGE STATUS
────────────────────────────────────────

Usar estados visuales fáciles:

Publicado
Borrador
Cambios pendientes
Archivado

Color + texto.

No depender solo del color.

────────────────────────────────────────
71. INDICADORES DE EDICIÓN
────────────────────────────────────────

En la cabecera del editor:

Universidad Siglo 21
Concepción

Estado:
PUBLICADO

Cambios:
3 sin guardar

Última publicación:
fecha

Último editor:
usuario

────────────────────────────────────────
72. EDITOR AGRUPADO
────────────────────────────────────────

NO poner 80 campos en una única columna.

Organizar por grupos/acordeones/tabs.

Ejemplo:

General
Hero
Contacto
Carreras
Galería
Diseño
SEO

Mantener visible:

qué grupo estoy editando.

────────────────────────────────────────
73. MODO SIMPLE / AVANZADO
────────────────────────────────────────

Para facilidad de uso:

mostrar primero campos comunes.

Ejemplo:

BÁSICO
- título;
- descripción;
- imagen;
- WhatsApp.

AVANZADO
- tamaño;
- alineación;
- overlay;
- SEO;
- diseño.

No obligar a las chicas a entrar en opciones técnicas para cambios comunes.

────────────────────────────────────────
74. AYUDA CONTEXTUAL
────────────────────────────────────────

Campos no obvios deben tener:

?
tooltip breve.

Ejemplo:

Slug (?)
“Es la parte de la dirección web. Evitá modificarlo si la página ya está publicada.”

No escribir manuales gigantes dentro del UI.

────────────────────────────────────────
75. CONFIRMACIONES
────────────────────────────────────────

No pedir confirmación para:

cambiar tamaño de texto.

Sí pedir para:

- publicar;
- eliminar;
- archivar;
- cambiar URL;
- restaurar;
- cambios globales.

────────────────────────────────────────
76. UNDO / REDO
────────────────────────────────────────

Si la arquitectura lo permite:

deshacer/rehacer durante la edición local antes de guardar.

Al menos:

Descartar cambios

debe funcionar correctamente.

────────────────────────────────────────
77. PREVIEW REAL
────────────────────────────────────────

No quiero una falsa preview armada diferente a la página pública.

REUTILIZAR LOS COMPONENTES PÚBLICOS ACTUALES siempre que sea posible.

El objetivo es:

LO QUE VEO EN PREVIEW
=
LO QUE VERÉ PUBLICADO.

Diseñar arquitectura para no mantener dos diseños separados.

────────────────────────────────────────
78. COMPONENT REGISTRY
────────────────────────────────────────

Crear si resulta adecuado un sistema de definición para componentes editables.

Conceptualmente:

Hero
- title
- subtitle
- media
- overlay
- alignment
- height

CareerCard
- image
- title
- duration
- modality
- badges

etc.

Cada componente debería saber:

- qué campos son editables;
- cómo validarlos;
- cómo previsualizarlos.

Evitar hardcodear un formulario enorme separado del sistema público.

────────────────────────────────────────
79. SELECTED ELEMENT
────────────────────────────────────────

Cada campo editable puede tener un ID interno.

Ejemplo:

hero.title

hero.subtitle

hero.media

Esto permite sincronizar:

EDITOR
↔
PREVIEW.

Cuando el input:

hero.title

está en foco:

la preview resalta:

hero.title.

────────────────────────────────────────
80. PREVIEW RESPONSIVE
────────────────────────────────────────

Desktop:
panel derecho.

Tablet:
panel colapsable.

Mobile:
botón:

Vista previa

que abre pantalla completa o drawer.

El administrador debe poder usarse en celular.

Pero su experiencia principal puede estar optimizada para desktop/tablet.

────────────────────────────────────────
81. ARQUITECTURA DE DATOS
────────────────────────────────────────

No guardar toda la web en una única tabla gigante.

Diseñar modelo mantenible.

Evaluar arquitectura híbrida:

ENTIDADES NORMALIZADAS
+
CONFIGURACIÓN/PÁGINAS VERSIONADAS.

Posibles entidades:

admin_profiles
admin_roles

cities
institutions
institution_locations
careers
institution_careers
trainings
events
services

pages
page_sections
page_versions

site_settings
design_settings
navigation_items

media_assets

redirects

audit_logs

publish_versions

No copiar esta lista ciegamente.

Adaptarla después de auditar el modelo existente.

────────────────────────────────────────
82. DRAFT/PUBLISHED
────────────────────────────────────────

Diseñar de forma que exista:

draft

y:

published

sin duplicar datos de forma caótica.

Puede utilizar:

version tables
snapshots
status
published_version_id

o arquitectura equivalente.

Elegir una solución robusta.

Documentarla.

────────────────────────────────────────
83. CAMBIOS MULTIPÁGINA
────────────────────────────────────────

Dashboard debe poder indicar:

CAMBIOS PENDIENTES

Ejemplo:

Home
2 cambios

Universidad Siglo 21
4 cambios

Abogacía
1 cambio

Posibilidad futura:

Publicar todos.

No implementar publicación masiva insegura sin confirmación.

────────────────────────────────────────
84. VALIDACIÓN DE DATOS
────────────────────────────────────────

Usar validación server-side.

No confiar solamente en input HTML.

Validar:

URLs
email
teléfono
slug
colores
números
fechas
IDs
relaciones

Usar librería ya disponible o una solución consistente.

No instalar dependencias innecesarias.

────────────────────────────────────────
85. IMÁGENES
────────────────────────────────────────

Controlar:

- tipo;
- peso;
- extensión;
- dimensiones cuando corresponda.

No permitir subir ejecutables como imágenes.

────────────────────────────────────────
86. SEGURIDAD DE ADMIN
────────────────────────────────────────

Implementar:

- noindex;
- nofollow;
- robots;
- rutas protegidas;
- verificación server-side;
- RLS;
- sanitización;
- autorización por acción.

Ocultar un botón NO es autorización.

El backend debe comprobar permisos.

────────────────────────────────────────
87. ADMIN NO DEBE APARECER EN GOOGLE
────────────────────────────────────────

/admin
/admin/*

deben estar:

noindex
nofollow

y fuera del sitemap público.

────────────────────────────────────────
88. CONFIGURACIÓN GLOBAL
────────────────────────────────────────

Módulo Configuración:

- nombre del sitio;
- branding;
- contacto;
- redes;
- defaults;
- parámetros.

No exponer:

- secretos;
- keys;
- service role;
- variables sensibles.

────────────────────────────────────────
89. DATOS SENSIBLES
────────────────────────────────────────

No construir un panel que muestre secretos.

Variables de entorno sensibles permanecen servidor.

No permitir editarlas desde el CMS.

────────────────────────────────────────
90. MIGRACIÓN DE LA WEB ACTUAL
────────────────────────────────────────

NO migrar toda la web a Supabase de golpe.

Hacer migración progresiva.

Propuesta:

FASE A
Admin + Auth + estructura.

FASE B
Ciudades.

FASE C
Instituciones.

FASE D
Carreras.

FASE E
Home y páginas generales.

FASE F
Eventos/Servicios/Capacitaciones.

FASE G
Diseño/SEO/Multimedia.

Ajustar según AGENTS.md.

────────────────────────────────────────
91. ADAPTER / FALLBACK
────────────────────────────────────────

Mientras migremos:

la web pública debe seguir funcionando.

Puede utilizarse temporalmente una capa de datos que:

1. consulte contenido publicado del CMS cuando exista;

2. utilice la fuente actual como fallback cuando todavía no haya sido migrado.

Esto debe ser TEMPORAL y claramente documentado.

No dejar dos fuentes de verdad eternamente.

────────────────────────────────────────
92. NO CAMBIAR VISUALMENTE LA WEB PÚBLICA
────────────────────────────────────────

La primera migración al CMS debe preservar el diseño actual.

Ejemplo:

Antes:
Abogacía desde archivo JS.

Después:
Abogacía desde Supabase.

VISUALMENTE:

debe verse igual.

No mezclar:

MIGRACIÓN CMS

con:

REDISEÑO.

────────────────────────────────────────
93. PREVIEW DE CAMBIOS DE DISEÑO
────────────────────────────────────────

Para:

color
tamaño
tipografía
imagen
alineación
espaciado

la preview debe reaccionar sin guardar.

Ejemplo:

Título
52 px → 64 px

al mover slider:

preview actualiza inmediatamente.

────────────────────────────────────────
94. LÍMITES SEGUROS
────────────────────────────────────────

NO permitir:

font-size 500 px
border-radius 10000 px
padding 800 px

Definir mínimos/máximos razonables.

Opciones predefinidas cuando sea mejor.

────────────────────────────────────────
95. COLORES
────────────────────────────────────────

Selector de color debe:

- aceptar hex;
- mostrar color;
- permitir volver al color global;
- mantener contraste razonable.

Si se detecta contraste claramente problemático:

mostrar advertencia.

No bloquear innecesariamente.

────────────────────────────────────────
96. PUBLICACIÓN
────────────────────────────────────────

Al hacer click:

PUBLICAR

mostrar resumen.

Ejemplo:

Vas a publicar:

Universidad Siglo 21 · Concepción

Cambios:
- Imagen Hero
- Teléfono
- Carrera destacada

Cancelar
Publicar

────────────────────────────────────────
97. DESPUÉS DE PUBLICAR
────────────────────────────────────────

Registrar auditoría.

Revalidar rutas afectadas.

Ejemplo:

institución
carreras relacionadas
ciudad
SEO pages relacionadas

No revalidar todo el sitio innecesariamente.

────────────────────────────────────────
98. LOADING / SUCCESS / ERROR
────────────────────────────────────────

Toda acción debe tener estados claros:

Guardando...
Guardado

Publicando...
Publicado

Error al guardar

Nunca hacer click y no mostrar qué pasó.

────────────────────────────────────────
99. ERRORES
────────────────────────────────────────

Mensajes humanos.

NO mostrar:

PostgrestException 23505...

Mostrar:

“Ya existe una carrera con esa URL.”

Guardar detalle técnico en desarrollo/logs.

────────────────────────────────────────
100. EMPTY STATES
────────────────────────────────────────

Ejemplo:

No hay eventos todavía.

+ Crear primer evento

No mostrar tablas vacías confusas.

────────────────────────────────────────
101. BUSCADOR ADMIN
────────────────────────────────────────

Agregar búsqueda cuando haya suficiente contenido.

Buscar:

ciudad
institución
carrera
servicio
evento

Puede existir una búsqueda global del admin posteriormente.

────────────────────────────────────────
102. ACCESIBILIDAD
────────────────────────────────────────

Implementar correctamente:

- labels;
- focus visible;
- teclado;
- aria;
- contraste;
- botones reales;
- modales accesibles;
- drag/drop con alternativa accesible cuando sea posible.

────────────────────────────────────────
103. PERFORMANCE
────────────────────────────────────────

No cargar toda la base de datos en cada pantalla.

Usar:

- paginación;
- queries específicas;
- filtros;
- caching apropiado.

La preview no debe volver lento todo el administrador.

────────────────────────────────────────
104. RESPONSIVE ADMIN
────────────────────────────────────────

Validar:

1440
1280
1024
768
mobile

Sidebar adaptable.

Tablas con responsive correcto.

Preview configurable.

────────────────────────────────────────
105. DOCUMENTACIÓN DEL ADMIN
────────────────────────────────────────

Crear:

docs/admin/

Como mínimo:

ADMIN-ARCHITECTURE.md
ADMIN-DATA-MODEL.md
ADMIN-PERMISSIONS.md
ADMIN-PUBLISHING-FLOW.md
ADMIN-MIGRATION-STATUS.md
ADMIN-SETUP.md

Mantenerlos actualizados.

────────────────────────────────────────
106. ADMIN-SETUP
────────────────────────────────────────

Documentar:

- variables necesarias;
- Supabase;
- migrations;
- creación primer usuario;
- roles;
- desarrollo local;
- prueba;
- publicación futura.

NO escribir secretos reales.

────────────────────────────────────────
107. MIGRATION STATUS
────────────────────────────────────────

Crear tabla/checklist interna.

Ejemplo:

Home:
[ ] CMS
[ ] Preview
[ ] Publicación

Ciudades:
[ ] CMS
[ ] Preview
[ ] Publicación

etc.

Así sabemos exactamente qué partes ya dependen del administrador.

────────────────────────────────────────
108. NO TOCAR LEGAL PREEXISTENTE
────────────────────────────────────────

Los documentos:

docs/legal/*

y:

next-app/lib/legal-config.js

son trabajo previo.

Conservarlos.

No publicarlos.

No sobrescribirlos.

Integrar en el admin únicamente cuando corresponda posteriormente.

────────────────────────────────────────
109. FORMULARIOS / LEADS PREEXISTENTES
────────────────────────────────────────

No cambiar todavía el flujo de:

localStorage

a:

database

como efecto secundario de crear el admin.

Eso requiere su propia etapa legal/técnica.

────────────────────────────────────────
110. NO CREAR PAGE BUILDER TOTALMENTE LIBRE
────────────────────────────────────────

No quiero Webflow.

No quiero Figma.

No quiero que una persona pueda arrastrar cualquier elemento a cualquier lugar.

Quiero:

EDITOR CONTROLADO

de los componentes que ya existen.

Eso permite mantener GET profesional.

────────────────────────────────────────
111. OBJETIVO DE USABILIDAD
────────────────────────────────────────

Una persona nueva debería entender sin capacitación técnica:

“Quiero cambiar el teléfono de Siglo 21.”

Flujo:

Admin
→ Instituciones
→ buscar Siglo 21
→ Editar
→ Contacto
→ cambiar teléfono
→ ver preview
→ Guardar borrador
→ Publicar.

Nada más.

────────────────────────────────────────
112. OTRO EJEMPLO
────────────────────────────────────────

“Quiero cambiar el banner de Redes Sociales.”

Admin
→ Servicios
→ Redes Sociales
→ Hero
→ Cambiar imagen
→ seleccionar/subir
→ preview inmediata
→ comprobar móvil
→ Guardar
→ Publicar.

────────────────────────────────────────
113. OTRO EJEMPLO
────────────────────────────────────────

“Quiero destacar una nueva carrera.”

Admin
→ Carreras
→ carrera
→ activar Destacada
→ definir badge
→ preview
→ publicar.

Debe actualizar automáticamente donde corresponda.

────────────────────────────────────────
114. NO DUPLICAR DATOS
────────────────────────────────────────

Si la misma carrera aparece en:

SEO
institución
ciudad

no quiero editarla tres veces.

Diseñar una fuente de verdad coherente.

Las páginas deben consumir la misma entidad cuando corresponda.

────────────────────────────────────────
115. CONTENIDO ESPECÍFICO POR SEDE
────────────────────────────────────────

Sí puede existir información diferente cuando realmente corresponde.

Ejemplo:

Siglo 21 Concepción
y
Siglo 21 Monteros

pueden tener:

- dirección diferente;
- teléfono diferente;
- carreras diferentes.

Modelarlo correctamente.

────────────────────────────────────────
116. PREVIEW SEGURA
────────────────────────────────────────

La preview de contenido borrador:

NO debe ser pública.

No debe poder indexarse.

Si existe una URL de preview:

requiere sesión autorizada o token temporal seguro.

No usar:

?preview=true

como única protección.

────────────────────────────────────────
117. PUBLIC SITE READ POLICY
────────────────────────────────────────

Usuario público:

solo published.

Administrador:

draft + published según permiso.

RLS y server logic deben reflejarlo.

────────────────────────────────────────
118. AUDITORÍA INICIAL OBLIGATORIA
────────────────────────────────────────

ANTES de decidir el schema:

revisar:

- institutions.js;
- fuentes de carreras;
- configuración de ciudades;
- components;
- route files;
- page data;
- assets;
- servicios;
- eventos;
- capacitaciones;
- navbar;
- footer;
- SEO;
- sitemap.

No diseñar la base sin conocer el modelo actual.

────────────────────────────────────────
119. NO REESCRIBIR TODO
────────────────────────────────────────

Reutilizar componentes actuales.

Si algo ya funciona:

NO reemplazarlo solo para adaptarlo al CMS.

Crear una capa de datos limpia.

Minimizar riesgo.

────────────────────────────────────────
120. DISEÑO DEL ADMIN
────────────────────────────────────────

Quiero que el administrador se sienta terminado.

No quiero que visualmente quede como:

“pantalla temporal de desarrollador”.

Aunque se construya por fases:

desde la primera versión funcional quiero:

- buen sidebar;
- logo real;
- buenos espacios;
- iconos;
- navegación;
- estados;
- cards;
- formularios coherentes;
- preview profesional.

────────────────────────────────────────
121. IMPORTANTE SOBRE LA PREVIEW
────────────────────────────────────────

NO postergar toda la Preview para “algún día”.

La PREVIEW es PARTE CENTRAL DEL PRODUCTO.

Cuando se implemente el primer editor real:

por ejemplo Ciudades o Instituciones,

esa misma fase debe incluir:

VISTA PREVIA EN VIVO.

No aceptar como editor final un formulario que solo diga:

“Guardado correctamente”.

────────────────────────────────────────
122. PREVIEW VISUAL FLOTANTE
────────────────────────────────────────

Quiero que visualmente pueda sentirse como:

┌────────────────────────────┐
│ Vista previa    ◻︎ ◻︎ ◻︎  │
│────────────────────────────│
│                            │
│       PÁGINA REAL          │
│                            │
│    elemento resaltado      │
│                            │
└────────────────────────────┘

Con:

Desktop
Tablet
Mobile

y:

Abrir completa.

Debe tener sombra/relieve discreto para distinguirse del editor.

────────────────────────────────────────
123. SI LA PREVIEW NO CABE
────────────────────────────────────────

En pantallas medianas:

convertirla en panel flotante/drawer.

No achicarla hasta que sea inútil.

────────────────────────────────────────
124. PREVIEW + SCROLL
────────────────────────────────────────

Cuando edito una sección:

la preview puede hacer scroll automático hacia esa sección.

No hacerlo agresivamente en cada tecla.

Solo al seleccionar:

Hero
Carreras
Galería
etc.

────────────────────────────────────────
125. INDICADOR DE CAMBIO
────────────────────────────────────────

Los campos modificados y todavía no guardados pueden mostrar:

●

o:

Modificado

de forma discreta.

Al descartar:

volver al valor original.

────────────────────────────────────────
126. VERSIÓN PUBLICADA
────────────────────────────────────────

Permitir opcionalmente:

Ver publicada

vs.

Ver borrador

dentro del preview.

Especialmente útil cuando hay muchos cambios.

────────────────────────────────────────
127. COMPARACIÓN
────────────────────────────────────────

Una opción futura:

Comparar

Publicado | Borrador

No bloquear primera versión por esto si AGENTS divide etapas.

Pero preparar arquitectura.

────────────────────────────────────────
128. COMPONENTES DE ADMIN
────────────────────────────────────────

Crear sistema reutilizable:

AdminShell
AdminSidebar
AdminTopbar
AdminBreadcrumbs
AdminPageHeader
EditorPanel
EditorSection
LivePreview
DeviceSwitcher
PublishBar
MediaPicker
StatusBadge
UnsavedChangesGuard
etc.

Nombres pueden adaptarse a convenciones.

Evitar archivos gigantes.

────────────────────────────────────────
129. TESTS
────────────────────────────────────────

Agregar pruebas razonables para:

- auth;
- permisos;
- draft;
- publish;
- validación;
- slug;
- preview data;
- lectura pública.

Usar infraestructura de tests existente.

No instalar un ecosistema enorme sin necesidad.

────────────────────────────────────────
130. LINT Y BUILD
────────────────────────────────────────

Al final de CADA etapa con código:

npm run lint
npm run build

Si hay tests:

ejecutarlos.

Distinguir:

warnings preexistentes

de:

errores nuevos.

────────────────────────────────────────
131. NO INVENTAR QUE ALGO FUNCIONA
────────────────────────────────────────

Si no se pudo:

- conectar Supabase;
- probar Auth;
- aplicar migrations;
- subir media;
- probar publicación;

decirlo.

No responder:

“Todo conectado”

si solo se escribió código.

────────────────────────────────────────
132. BASE DE DATOS
────────────────────────────────────────

Cada migración debe:

- estar versionada;
- ser reversible cuando sea razonable;
- evitar pérdida de información;
- incluir RLS;
- incluir constraints;
- incluir índices cuando corresponda.

────────────────────────────────────────
133. FECHAS
────────────────────────────────────────

Usar timestamps adecuados.

created_at
updated_at
published_at
archived_at

según necesidad.

────────────────────────────────────────
134. ORDEN
────────────────────────────────────────

Para listados/secciones usar:

sort_order

o equivalente.

No depender del ID.

────────────────────────────────────────
135. SLUGS
────────────────────────────────────────

Unique constraints donde corresponda.

Tener en cuenta scope.

Ejemplo:

un slug puede ser único globalmente o por institución según arquitectura pública.

Replicar el comportamiento REAL.

────────────────────────────────────────
136. LEGIBILIDAD PARA EL EQUIPO
────────────────────────────────────────

Evitar términos técnicos dentro del UI.

NO:

published_version_id

SÍ:

Versión publicada.

NO:

sort_order

SÍ:

Orden.

NO:

is_featured

SÍ:

Destacada.

────────────────────────────────────────
137. IDIOMA
────────────────────────────────────────

El administrador debe estar en ESPAÑOL.

Código puede estar en inglés si coincide con convenciones del proyecto.

UI:

español claro.

────────────────────────────────────────
138. TONO
────────────────────────────────────────

Mensajes cortos.

Ejemplo:

“Carrera guardada como borrador.”

No:

“Mutation successfully persisted on database.”

────────────────────────────────────────
139. ICONOS
────────────────────────────────────────

Usar librería de iconos ya disponible si existe.

No mezclar 4 librerías.

────────────────────────────────────────
140. NO USAR EMOJIS COMO ICONOS DEL ADMIN
────────────────────────────────────────

Usar iconos UI profesionales.

────────────────────────────────────────
141. ANIMACIONES
────────────────────────────────────────

Animaciones pequeñas:

- sidebar;
- preview;
- drawer;
- cambio de estado;
- toast.

No animar todo.

────────────────────────────────────────
142. TOASTS
────────────────────────────────────────

Mostrar confirmaciones:

Guardado
Publicado
Restaurado
Archivado

con toast discreto.

────────────────────────────────────────
143. TABLAS
────────────────────────────────────────

Listas grandes:

tabla profesional con:

buscador
filtros
orden
paginación

Acciones agrupadas.

────────────────────────────────────────
144. EDICIÓN RÁPIDA
────────────────────────────────────────

En el futuro puede existir:

Edición rápida.

Ejemplo teléfono.

Pero no sacrificar validación.

No es prioridad de primera etapa.

────────────────────────────────────────
145. CREAR NUEVO CONTENIDO
────────────────────────────────────────

Todo contenido nuevo:

empieza como:

BORRADOR.

Nunca publicar automáticamente al crearlo.

────────────────────────────────────────
146. PREVIEW DE CONTENIDO NUEVO
────────────────────────────────────────

Aunque nunca haya sido publicado:

debe poder previsualizarse completo.

────────────────────────────────────────
147. PUBLICACIÓN PROGRAMADA
────────────────────────────────────────

Preparar arquitectura para futuro:

Publicar ahora
Programar

No hace falta implementar programación inicialmente si complica el MVP.

Documentarlo como evolución.

────────────────────────────────────────
148. ANALYTICS DEL ADMIN
────────────────────────────────────────

NO mandar actividad interna del administrador al GA4 público.

Excluir:

/admin

de Analytics público.

No contaminar métricas.

────────────────────────────────────────
149. ERRORES Y LOGS
────────────────────────────────────────

No mostrar datos privados de Supabase al usuario final del admin.

Logs de desarrollo pueden tener contexto técnico sin secretos.

────────────────────────────────────────
150. FASES
────────────────────────────────────────

ESTE ES EL OBJETIVO FINAL.

Seguir las etapas de AGENTS.md.

Una secuencia razonable sería:

FASE 1
Auditoría y arquitectura.

FASE 2
Supabase schema + Auth + RLS.

FASE 3
Shell visual del admin:
login
sidebar
dashboard
layout.

FASE 4
Primer editor REAL con Preview.

Preferentemente:
Ciudades
o Instituciones,
según arquitectura existente.

FASE 5
Instituciones.

FASE 6
Carreras.

FASE 7
Home.

FASE 8
Servicios/Eventos/Capacitaciones.

FASE 9
Multimedia.

FASE 10
Diseño.

FASE 11
SEO.

FASE 12
Historial/versiones/restauración.

FASE 13
Formularios/leads,
solo luego de resolver aspectos legales.

FASE 14
Legal,
solo cuando los textos estén aprobados.

FASE 15
Migración final y eliminación de fallbacks.

Puede modificar este orden si la auditoría técnica demuestra que otro es mejor.

Pero explicar el motivo.

────────────────────────────────────────
151. PRIMERA EXPERIENCIA
────────────────────────────────────────

Cuando el primer shell visual esté listo quiero poder entrar a:

http://localhost:4004/admin

y ver algo ESTÉTICAMENTE PROFESIONAL.

Sidebar:

logo GET real.

Menú.

Dashboard.

No una pantalla vacía con links.

────────────────────────────────────────
152. LOGIN
────────────────────────────────────────

El login debe verse profesional.

Logo GET.

Título:

Administrador GET

Campo:
Usuario o email

Campo:
Contraseña

Botón:
Ingresar

Link:
¿Olvidaste tu contraseña?

No incluir información pública innecesaria.

────────────────────────────────────────
153. DASHBOARD UX
────────────────────────────────────────

Bienvenida breve.

No frases infantiles.

Ejemplo:

Panel de administración

Gestioná el contenido y la publicación de GET.

Tarjetas simples.

────────────────────────────────────────
154. POSICIÓN DEL LOGO
────────────────────────────────────────

Logo del footer público:

parte superior del sidebar.

Tamaño correcto.

Buen padding.

No gigantesco.

No diminuto.

────────────────────────────────────────
155. COLOR DEL SIDEBAR
────────────────────────────────────────

Basarse en identidad GET.

Preferencia:

navy/azul oscuro.

Pero revisar el sitio real y usar sus tokens.

No inventar una nueva marca para el admin.

────────────────────────────────────────
156. VISTA PREVIA Y BORDES
────────────────────────────────────────

El Preview debe diferenciarse del editor.

Ejemplo:

fondo general admin claro.

preview:
borde suave;
sombra;
radio;
barra superior.

Que parezca una ventana real del sitio.

────────────────────────────────────────
157. NO MOSTRAR PREVIEW TODO EL TIEMPO
────────────────────────────────────────

Dashboard/listas:

no necesitan Preview.

Preview aparece al:

EDITAR.

────────────────────────────────────────
158. PÁGINA ACTUAL CLARA
────────────────────────────────────────

Ejemplo:

EDITANDO

Carrera
Abogacía

Institución
Universidad Siglo 21

Ciudad
Concepción

Esto debe verse arriba.

────────────────────────────────────────
159. FOCO DE USUARIO
────────────────────────────────────────

Diseñar pensando en que las personas encargadas NO programan.

Evitar:

JSON
IDs
CSS
hex si no es necesario
database terminology.

Mostrar controles visuales.

Un usuario avanzado puede ver más opciones en:

Avanzado.

────────────────────────────────────────
160. HEX
────────────────────────────────────────

El selector de color puede permitir Hex en Avanzado.

Pero la experiencia principal debe ser visual.

────────────────────────────────────────
161. PUBLICACIÓN GLOBAL
────────────────────────────────────────

Cambiar un token global puede afectar muchas páginas.

Antes de publicar:

mostrar:

“Este cambio puede afectar 38 páginas.”

y preview del sistema visual cuando sea posible.

────────────────────────────────────────
162. COMPONENTES GLOBALES
────────────────────────────────────────

Header
Footer
Botones
Tipografía

deben distinguirse como:

GLOBAL.

No hacer creer que se cambia una sola página.

────────────────────────────────────────
163. CONFIGURACIONES POR PÁGINA
────────────────────────────────────────

Cuando una página tiene override:

mostrar:

Personalizado.

Cuando hereda:

Global.

────────────────────────────────────────
164. MODO RESET
────────────────────────────────────────

Un override debe poder:

Restablecer al diseño global.

────────────────────────────────────────
165. EXPLICACIÓN VISUAL
────────────────────────────────────────

Ejemplo:

Color del título
[● Azul GET ▼]

Tamaño
[────────●────]
64 px

Vista previa actualiza.

Simple.

────────────────────────────────────────
166. CARGA DE ARCHIVOS
────────────────────────────────────────

Drag/drop.

También:

Seleccionar archivo.

Mostrar progreso.

Mostrar error.

────────────────────────────────────────
167. PDF
────────────────────────────────────────

Para plan de estudios:

subir PDF.

Mostrar:

nombre
peso
fecha
reemplazar
eliminar

Preview/enlace.

────────────────────────────────────────
168. RELACIONES
────────────────────────────────────────

Para asignar carrera:

selector buscable.

No pedir IDs.

Ejemplo:

Institución
[ Universidad Siglo 21 ▼ ]

Ciudad
[ Concepción ▼ ]

────────────────────────────────────────
169. DESEO FINAL
────────────────────────────────────────

Cuando este administrador esté terminado:

NO quiero tener que pedirle a Codex:

“Cambiale el teléfono a Siglo 21.”

Quiero entrar al panel y hacerlo.

NO quiero pedir:

“Subí una carrera nueva.”

Quiero crearla desde el panel.

NO quiero pedir:

“Cambiale el banner a Eventos.”

Quiero editarlo y previsualizarlo.

NO quiero pedir:

“Cambiale el color al título.”

Quiero mover el control y verlo inmediatamente.

Eso es lo que debe guiar toda la arquitectura.

────────────────────────────────────────
170. CRITERIO PROFESIONAL
────────────────────────────────────────

Tenés libertad para decidir:

- estructura interna;
- schema;
- composición;
- distribución del admin;
- componentes;
- tablas;
- patrones.

Pero respetar todos los objetivos anteriores.

Si existe una forma técnicamente mejor que la que describo:

podés usarla.

Documentar el motivo.

NO simplificar la experiencia eliminando:

- Preview;
- Draft;
- Roles;
- Seguridad;
- Versionado.

Esos puntos son esenciales.

────────────────────────────────────────
171. AL TERMINAR CADA ETAPA
────────────────────────────────────────

Informar:

1. Etapa completada.
2. Regla relevante de AGENTS.md.
3. Auditoría realizada.
4. Arquitectura decidida.
5. Archivos creados.
6. Archivos modificados.
7. Tablas/migrations creadas.
8. Políticas RLS.
9. Rutas creadas.
10. Componentes.
11. Estado de Auth.
12. Estado de Supabase.
13. Estado del sidebar.
14. Estado del Dashboard.
15. Estado del editor.
16. Estado de Live Preview.
17. Qué entidades están realmente administrables.
18. Qué entidades todavía siguen estáticas.
19. Qué datos ya vienen de database.
20. Qué datos todavía tienen fallback.
21. Desktop.
22. Tablet.
23. Mobile.
24. Accesibilidad.
25. Tests.
26. Lint.
27. Build.
28. Cambios preexistentes respetados.
29. Confirmar NO commit.
30. Confirmar NO push.
31. Confirmar NO deploy.
32. Próxima etapa exacta.

────────────────────────────────────────
172. NO DAR POR TERMINADO TODO EL CMS ANTES DE TIEMPO
────────────────────────────────────────

No decir:

“Administrador terminado”

si solamente existe:

login
sidebar
dashboard.

Informar claramente el porcentaje/estado funcional.

Ejemplo:

Shell Admin: completo
Auth: completo
Ciudades: editable
Instituciones: pendiente
Carreras: pendiente
Preview: funcional en Ciudades
Publicación: funcional en Ciudades

Ser preciso.

────────────────────────────────────────
173. CRITERIO DE ACEPTACIÓN FINAL
────────────────────────────────────────

El CMS completo estará realmente terminado cuando:

- login sea seguro;
- roles funcionen;
- todas las rutas principales estén administrables;
- cambios puedan verse en Preview antes de guardar;
- Draft funcione;
- Publicar funcione;
- web pública lea contenido publicado;
- SEO se preserve;
- media sea gestionable;
- diseño esencial sea editable;
- historial funcione;
- restaurar funcione;
- no se necesite deploy para cambios editoriales;
- el equipo pueda usarlo sin conocimientos técnicos.

────────────────────────────────────────
174. EMPEZAR
────────────────────────────────────────

Ahora:

1. Leer AGENTS.md.
2. Auditar arquitectura actual.
3. Auditar Supabase actual.
4. Auditar fuentes de datos.
5. Auditar rutas.
6. Definir arquitectura del CMS.
7. Comenzar la PRIMERA ETAPA DE IMPLEMENTACIÓN que permita AGENTS.md.
8. Implementar código real.
9. Validar.
10. Detenerse cuando corresponda según AGENTS.md.
11. Entregar el informe completo.

NO PUBLICAR.
