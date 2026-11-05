# Actualización D'Salms V8 — 5 de noviembre de 2026

Esta entrega toma como base técnica el sitio D-SALMS-WEB-v4, preservando las 15 páginas, animaciones y galerías existentes. Se agregaron recursos del archivo `D´Salms Proyect.zip` y una nueva página de Imagen Pública, para alcanzar **16 páginas HTML independientes**.

- Se integraron **176 fotografías e imágenes** del archivo suministrado, optimizadas a WebP en `img/coleccion-2026/`.
- Se añadieron **2 videos** del mismo archivo en la carpeta `video/`.
- Se creó un archivo visual completo con las 176 imágenes en Recursos Visuales.
- Se ampliaron las galerías de las páginas con imágenes seleccionadas según el tema.
- Se incorporó `imagen-publica/index.html`, con 10 gráficos SVG programados, selector, tablas de frecuencias, matriz de 15 registros, descarga CSV, FODA y propuestas estratégicas.
- Se añadieron las hojas `css/v8.css`, `css/imagen-publica.css` y el script `js/imagen-publica.js`.
- Se agregaron accesos a Imagen Pública desde todos los menús y footers.
- Se conservaron los efectos existentes Curved Reel 3D, Scroll Typography y Letter Scramble.

## Alcances y límites

Esta versión integra y amplía **v4** en lugar de reemplazar todas las plantillas desde cero, para mantener contenido, animaciones y recursos anteriores sin pérdidas. Las cifras son académicas simuladas. Esta entrega no incluye backend, ventas reales ni cuentas verificadas.

## Publicación en GitHub Pages

Subir los **contenidos de la carpeta raíz** del ZIP al repositorio `D-Salms` (de modo que `index.html` quede en la raíz). Habilitar Settings → Pages → Deploy from a branch, branch `main`, carpeta `/ (root)`.

Los enlaces son relativos para que funcione bajo `/D-Salms/`. Para probar localmente, usar un servidor HTTP estático: `python -m http.server 8000` y abrir `http://localhost:8000/`.

## Validación

Se verificó la existencia de archivos HTML, JS, CSS e imágenes enlazadas. La validación automatizada de navegador puede no estar disponible en este entorno; abrir Inicio, Productos, Imagen Pública y Recursos Visuales en Chrome antes de publicar para comprobar animaciones y comportamiento móvil.
