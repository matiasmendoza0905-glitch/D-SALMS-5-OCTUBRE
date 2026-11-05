ESTRUCTURA MULTIPÁGINA (actualización)
======================================
Cada apartado del menú es su propia página (14 con Inicio). Colores y movimiento: css/extras.css y js/motion.js. Imágenes nuevas: docs/ESPACIOS_DE_IMAGENES.md: una carpeta con su index.html.
  index.html (Inicio) · empresa/ · publico-objetivo/ · identidad-corporativa/ · identidad-visual/ · imagen-institucional/
  aplicaciones/ · productos/ (NUEVO) · comunicacion/ · plan-comunicacion/ (NUEVO) · manual-identidad/ · propuestas/ · contacto/
Todas comparten css/styles.css, js/script.js, img/ y video/. Las páginas dentro de carpetas usan rutas ../css, ../img.
- TEXTOS: ahora se editan en el index.html de cada carpeta (los comentarios <!-- ... --> siguen marcando cada bloque).
- MENÚ / PIE: el mismo bloque <header class="top"> y <footer> está repetido en las 13 páginas: si cambias el menú, cámbialo en todas.
- script.js sigue siendo uno solo: cada componente solo se activa si la página lo contiene (atributo data-root del <body> indica la raíz).
- Donde antes decía «index.html» en las instrucciones de abajo, ahora es el index.html de la página que contiene ese componente.
- Para abrir en local haz doble clic en index.html; los enlaces incluyen index.html, así que también funcionan sin servidor.
- GitHub Pages distingue mayúsculas: mantén los nombres de carpeta en minúsculas.

D'SALMS · WEB INTERACTIVA (HTML5 + CSS3 + JavaScript vanilla)
============================================================
1. ABRIR: doble clic en index.html (no necesita servidor ni instalación).
   Las fuentes Kalnia y DM Sans se cargan desde Google Fonts (requiere internet); sin conexión se usa Georgia / sistema.
2. VISUAL STUDIO CODE: Archivo > Abrir carpeta > D-SALMS-WEB. Opcional: extensión "Live Server" > clic derecho en index.html > Open with Live Server.
3. DREAMWEAVER: Sitio > Nuevo sitio > elegir la carpeta D-SALMS-WEB. Abrir index.html en vista Código o En vivo.
4. TEXTOS: edita index.html. Cada sección empieza con un comentario (<!-- EMPRESA -->, <!-- IDENTIDAD VISUAL -->, etc.).
5. CAMBIAR UNA IMAGEN: reemplaza el archivo en /img con el mismo nombre y formato (ej. img/hero.jpg).
6. LOGO: img/logo.png (imagotipo) e img/logotipo.png (Kalnia aplicada). No lo redibujes ni lo deformes.
7. COLORES: css/styles.css, bloque :root (--primary, --background, --black, --red, --purple). --primary-deep es un turquesa oscuro derivado para texto pequeño (requiere validación).
8. TIPOGRAFÍAS: variables --font-title (Kalnia) y --font-body (DM Sans) en :root y el <link> de Google Fonts en <head>.
9. AGREGAR APLICACIONES: copia el mockup a img/aplicaciones/ y agrega una línea en la lista APPS al inicio de js/script.js:
   ['Prendas','aplicaciones/mi-imagen.jpg','Texto alternativo'] (la categoría crea el filtro automáticamente).
   Para ajustar proporciones, agrega su tamaño en DIM: 'aplicaciones/mi-imagen.jpg':[ancho,alto].
10. WHATSAPP, REDES Y CORREO: abre js/script.js y edita el bloque CONFIG (arriba del todo).
    - WHATSAPP_NUMBER (primera línea de js/script.js): pega tu número con código de país, sin + ni espacios (ej. '51987654321'). Mientras esté vacío se ve [AGREGAR WHATSAPP]; al llenarlo aparece el botón que abre el chat.
    - usuario, facebook y correo son PROPUESTAS (@dsalms.pe, hola@dsalms.pe), marcadas como POR DEFINIR en la web. Verifica que estén libres antes de crear los perfiles y cámbialos aquí si hace falta.
18. VIDEO DE PORTADA: guarda tu video como video/hero.mp4 (MP4/H.264, ideal vertical o cuadrado, menos de 10 MB). Se reproduce solo, sin sonido y en bucle. Para cambiar la proporción del recuadro edita --hero-video-ratio en css/styles.css.
19. CARRUSELES: arrastra con el mouse, desliza con el dedo, usa las flechas o el teclado. Para agregar fotos a un carrusel, añade una línea en la lista GAL (o en VALS, PERS, TONOS) de js/script.js.
20. VALORES, PERSONALIDAD Y TONOS: los textos y las 5 frases de cada uno están en VALS, PERS y TONOS (js/script.js).
11. AGREGAR FOTOGRAFÍAS: guárdalas en img/ y añádelas en la lista GAL (o APPS) de js/script.js.
12. PROBAR RESPONSIVE: en Chrome, F12 > icono de móvil > 320, 375, 390, 768, 1024 y 1440 px.
13. ANIMACIONES: clase .rv (aparición al hacer scroll) en styles.css, sección ANIMACIÓN. Quita la clase "rv" de un elemento para que no se anime. Con "reducir movimiento" activado en el sistema, se desactivan solas.
14. GALERÍA Y LIGHTBOX: cualquier imagen con el atributo data-lb se abre ampliada. Navegación: botones, flechas ← →, deslizar en móvil, Esc o clic fuera para cerrar.
15. CONTENIDO DEL LIGHTBOX: usa el atributo alt de la imagen como pie de foto; el orden sigue el de la página.
NOTA: las imágenes provienen del documento "Imagen Corporativa D'Salms". Las aplicaciones (prendas, packaging, redes, etc.) son mockups propuestos, no productos producidos.

21. FICHAS DE COLOR, TIPOGRAFÍA, DIMENSIONES, PLAN Y REDES: los datos están en js/script.js (COL, TY, DIMS, PLAN, PRES, MX). Edita ahí los textos.
22. APLICACIONES: los grupos se definen en GRUPOS (js/script.js); el botón 'Ver todo en mosaico' muestra todas las imágenes juntas.
