# Sistema de movimiento
Variables en css/pages.css: --dur-s (.2 s), --dur-m (.6 s), --dur-l (1 s), --ease-o, --ease-io, --dist y --stag.
Identidad de movimiento por página (cabecera): Empresa y Plan = nodos conectados; Público y Recursos = puntos que laten; Identidad corporativa e Imagen institucional = órbitas; Identidad visual, Aplicaciones y Manual = marcos que giran; Productos y Contacto = ondas; Comunicación = burbujas de chat; Auditoría y Propuestas = barras que suben.
Interacciones: pestañas con indicador deslizante, comparadores antes/después, esquema que ilumina conexiones, mensajes por turnos, línea de tiempo con progreso, barras animadas, diagramas con conexiones, índice lateral con apartado activo, zona de seguridad ajustable y lista de control con progreso.
Reglas: solo transform y opacity en lo posible; ninguna animación continua en decenas de elementos; prefers-reduced-motion desactiva todo; el contenido nunca espera a una animación.

## Animaciones avanzadas (V4)
1. Carrusel 3D curvo (Productos, después del hero y antes del catálogo): un solo canvas WebGL, cámara fov 65.7 y z 8.1, planos de 2.38 x 1.5771 con 48 x 24 segmentos y curvatura cilíndrica (base 0.30, hasta 0.42 con movimiento rápido). Teclado (flechas y Home), arrastre, rueda horizontal y botones ocultos para lectores de pantalla. El scroll vertical normal sigue hacia el catálogo; la rueda solo se captura tras interactuar. Si Three.js o WebGL fallan, se muestra una galería HTML.
2. Tipografía controlada por scroll (Inicio): x = V - p·(V + T), con p = clamp(-top / D, 0, 1), sin easing. Con movimiento reducido se muestra la frase completa, centrada.
3. Revelado de letras (Identidad corporativa): cada 40 ms se revela un carácter más; hasta 13 letras cambiantes; hover, foco o clic reinician; con movimiento reducido no hay scramble.
Los datos de las seis portadas del carrusel están en la matriz ITEMS de js/curved-reel.js.
