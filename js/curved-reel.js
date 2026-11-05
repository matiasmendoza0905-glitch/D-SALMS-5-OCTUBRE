/* D'SALMS · Animación 01: «Colecciones en movimiento» — carrusel 3D curvo (Three.js, un solo canvas).
   Los datos de las seis portadas están en ITEMS. Si WebGL o Three.js fallan, queda la galería HTML. */
(() => {
  'use strict';
  const sec = document.querySelector('[data-reel]');
  if (!sec) return;
  const canvas = sec.querySelector('.reel-canvas'), hint = sec.querySelector('.reel-hint');
  const root = document.body.dataset.root || '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  /* ---------- datos editables ---------- */
  const ITEMS = [
    { k: 'LÍNEA ESENCIA', name: 'Polo Esencia Turquesa', img: 'img/productos/polo-esencia-turquesa-modelo.webp', c: ['#D7F0F2', '#2DB7C7'], ink: '#142B40', ac: '#188D9B' },
    { k: 'LÍNEA FE', name: 'Hoodie Propósito', img: 'img/productos/hoodie-proposito-modelo.webp', c: ['#4B1B6B', '#B22222'], ink: '#F8F6EF', ac: '#DCC8E8' },
    { k: 'LÍNEA PALABRA', name: 'Polo Filipenses 1:6', img: 'img/productos/polo-filipenses-1-6-modelo.webp', c: ['#F8F6EF', '#DCC8E8'], ink: '#4B1B6B', ac: '#4B1B6B' },
    { k: 'ESENCIA FEMENINA', name: 'Conjunto Serenidad', img: 'img/productos/conjunto-serenidad-modelo.webp', c: ['#4B1B6B', '#188D9B'], ink: '#F8F6EF', ac: '#D7F0F2' },
    { k: 'ELEGANCIA FEMENINA', name: 'Conjunto Plenitud', img: 'img/productos/conjunto-plenitud-modelo.webp', c: ['#F8F6EF', '#D79A95'], ink: '#602B38', ac: '#B22222' },
    { k: 'ESTILO CONTEMPORÁNEO', name: 'Camisa Horizonte', img: 'img/productos/camisa-horizonte-modelo.webp', c: ['#142B40', '#2DB7C7'], ink: '#F8F6EF', ac: '#D7F0F2' },
  ];
  const N = ITEMS.length, FOV = 65.7, CAMZ = 8.1, PW = 2.38, PH = 1.5771, HALF = 1.19;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fail = () => { sec.classList.remove('reel-on'); if (canvas) canvas.hidden = true; if (hint) hint.hidden = true; };
  if (!window.THREE || !canvas) { fail(); return; }
  const T = window.THREE;
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); } catch (e) { fail(); return; }
  if (!renderer || !renderer.getContext()) { fail(); return; }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAMZ);
  const geo = new T.PlaneGeometry(PW, PH, 48, 24);
  const VERT = `uniform float uBend,uTime,uRip;varying vec2 vUv;varying float vSh;
    void main(){vUv=uv;vec3 p=position;float ang=(p.x/${HALF.toFixed(2)})*uBend;float rad=${HALF.toFixed(2)}/uBend;
      p.x=sin(ang)*rad;p.z+=(cos(ang)-1.0)*rad;p.z+=sin(uTime*.55+p.x*2.1+p.y*1.7)*uRip;vSh=cos(ang);
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`;
  const FRAG = `uniform sampler2D uMap;uniform vec2 uSize;uniform float uR;varying vec2 vUv;varying float vSh;
    float sdb(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
    void main(){vec2 p=(vUv-.5)*uSize;float d=sdb(p,uSize*.5,uR);float aa=max(fwidth(d),1e-4);float a=1.0-smoothstep(-aa,aa,d);
      if(a<.01)discard;vec4 c=texture2D(uMap,vUv);float sh=mix(.86,1.0,vSh);float rim=smoothstep(.0,.05,-d);
      gl_FragColor=vec4(c.rgb*sh*mix(.96,1.0,rim),a);}`;
  const cards = [], textures = [];
  let W = 1, H = 1, S = 1.8, R = 5, DEP = 2, PITCH = .9, YOFF = 0;
  let phase = 0, target = 0, last = 0, raf = 0, running = false, visible = false, vel = 0, bend = .3, needs = true, armedUntil = 0, drag = null, snapT = 0, idx = -1, t = 0, disposed = false;
  /* ---------- portadas editoriales dibujadas en canvas (la foto conserva su proporción) ---------- */
  const loadImg = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error(src)); i.src = root + src; });
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  function cover(item, img, logo) {
    const cw = 1536, ch = Math.round(cw * PH / PW), c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, cw, ch);
    gr.addColorStop(0, item.c[0]); gr.addColorStop(1, item.c[1]); g.fillStyle = gr; g.fillRect(0, 0, cw, ch);
    g.globalAlpha = .16; g.fillStyle = item.ac; g.beginPath(); g.arc(cw * .8, ch * .12, ch * .6, 0, 7); g.fill(); g.beginPath(); g.arc(cw * .05, ch * 1.02, ch * .42, 0, 7); g.fill(); g.globalAlpha = 1;
    const ph = ch * .86, pw = ph * (img.naturalWidth / img.naturalHeight), px = cw - pw - ch * .07, py = (ch - ph) / 2;
    g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 40; g.shadowOffsetY = 14; rr(g, px, py, pw, ph, 26); g.fillStyle = '#fff'; g.fill(); g.restore();
    g.save(); rr(g, px, py, pw, ph, 26); g.clip(); g.drawImage(img, px, py, pw, ph); g.restore();
    const lx = ch * .09, maxW = px - lx - ch * .05; g.fillStyle = item.ink; g.textBaseline = 'alphabetic';
    g.font = `700 ${ch * .03}px "DM Sans",Arial,sans-serif`; g.globalAlpha = .85; g.fillText("D'SALMS · COLECCIÓN", lx, ch * .15); g.globalAlpha = 1;
    const words = item.k.split(' '), lines = words.length > 2 ? [words.slice(0, 1).join(' '), words.slice(1).join(' ')] : [words[0], words.slice(1).join(' ')].filter(Boolean);
    let fs = ch * .12; const fit = () => Math.max(...lines.map((l) => g.measureText(l).width)); g.font = `700 ${fs}px Kalnia,Georgia,serif`;
    while (fit() > maxW && fs > 20) { fs -= 2; g.font = `700 ${fs}px Kalnia,Georgia,serif`; }
    lines.forEach((l, i) => g.fillText(l, lx, ch * .36 + i * fs * 1.04));
    g.font = `500 ${ch * .045}px "DM Sans",Arial,sans-serif`; g.fillText(item.name, lx, ch * .36 + lines.length * fs * 1.04 + ch * .07);
    g.globalAlpha = .9; g.font = `italic 600 ${ch * .05}px Kalnia,Georgia,serif`; g.fillText('Viste tu esencia', lx + ch * .15, ch * .81); g.globalAlpha = 1;
    if (logo) { const ls = ch * .12; g.save(); rr(g, lx, ch * .735, ls, ls, 14); g.clip(); g.drawImage(logo, lx, ch * .735, ls, ls * (logo.naturalHeight / logo.naturalWidth)); g.restore(); }
    const tex = new T.CanvasTexture(c); tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return tex;
  }
  /* ---------- diseño según el tamaño de pantalla ---------- */
  function layout() {
    const phone = W < 640, asp = W / H, tf = Math.tan(FOV * Math.PI / 360);
    DEP = 2.0; const dist = CAMZ - (DEP - .28), wv = 2 * tf * dist * asp, hv = 2 * tf * dist;
    const tier = phone ? 0 : (W < 1024 ? 1 : 2), frac = [.77, .55, .37][tier];
    S = frac * wv / PW; R = wv * [1.0, .82, .58][tier]; PITCH = .52 * S; YOFF = -hv * (phone ? .08 : .1);
  }
  function resize() {
    if (disposed) return; W = Math.max(1, sec.clientWidth); H = Math.max(1, sec.clientHeight);
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); layout(); needs = true;
  }
  /* ---------- trayectoria ---------- */
  function place() {
    const wrapN = (v) => ((((v + N / 2) % N) + N) % N) - N / 2;
    for (let i = 0; i < N; i++) {
      const m = cards[i], rel = wrapN(i - phase), th = rel * .73;
      const x = Math.sin(th) * R, y = rel * PITCH + YOFF, z = Math.cos(th) * DEP - .28;
      m.position.set(x, y, z); m.scale.setScalar(S);
      m.rotation.set(rel * -.01 + (reduce.matches ? 0 : vel * -.012), Math.atan2(DEP * Math.sin(th), R * Math.cos(th)), 0);
      m.visible = Math.abs(th) < 1.62; m.material.uniforms.uBend.value = bend; m.material.uniforms.uTime.value = t;
      m.material.uniforms.uRip.value = reduce.matches ? 0 : .006;
    }
  }
  const setLabel = () => {
    const k = ((Math.round(target) % N) + N) % N; if (k === idx) return; idx = k;
    canvas.setAttribute('aria-label', `Colección en pantalla: ${ITEMS[k].k.toLowerCase()}, ${ITEMS[k].name}. Usa las flechas para ver la siguiente o la anterior.`);
  };
  function frame(now) {
    if (!running || disposed) return; raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
    const prev = phase;
    if (reduce.matches) phase = target; else phase += (target - phase) * (1 - Math.exp(-13 * dt));
    vel = dt > 0 ? (phase - prev) / dt : 0; const rapid = reduce.matches ? 0 : clamp(Math.abs(vel) / 6, 0, 1);
    bend += ((.30 + .12 * rapid) - bend) * (1 - Math.exp(-8 * dt));
    if (!needs && Math.abs(target - phase) < 1e-4 && reduce.matches) return;
    place(); setLabel(); renderer.render(scene, camera); needs = false;
  }
  const start = () => { if (running || disposed || !visible || document.hidden) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  const snap = () => { target = Math.round(target); needs = true; };
  const go = (d) => { target = Math.round(target) + d; needs = true; arm(); };
  const arm = () => { armedUntil = performance.now() + 2200; };
  /* ---------- entradas: rueda deliberada, arrastre, teclado ---------- */
  sec.addEventListener('wheel', (e) => {
    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2 && Math.abs(e.deltaX) > 1, armed = performance.now() < armedUntil;
    if (!(horiz || armed || e.shiftKey)) return; /* el scroll vertical normal sigue hacia el catálogo */
    e.preventDefault(); const d = clamp(horiz ? e.deltaX : (e.shiftKey ? (e.deltaY || e.deltaX) : e.deltaY), -120, 120);
    target += d * .0042; needs = true; arm(); clearTimeout(snapT); snapT = setTimeout(snap, 140);
  }, { passive: false });
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: target }; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* sin captura */ }
    arm(); canvas.classList.add('is-drag'); canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    target = drag.t - dx / (W * .3) + dy / (H * .55); needs = true; arm();
  });
  const endDrag = (e) => { if (!drag) return; try { canvas.releasePointerCapture(drag.id); } catch (er) { /* ya liberado */ } drag = null; canvas.classList.remove('is-drag'); snap(); };
  canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag); canvas.addEventListener('lostpointercapture', endDrag);
  canvas.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); go(1); } else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); go(-1); }
    else if (k === 'Home') { e.preventDefault(); target = Math.round(target / N) * N; needs = true; arm(); }
  });
  canvas.addEventListener('focus', arm); sec.addEventListener('pointerleave', () => { armedUntil = 0; });
  sec.querySelectorAll('[data-reel-go]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.reelGo)));
  /* ---------- ciclo de vida ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; if (visible) start(); else stop(); }), { threshold: .05 });
  const onVis = () => { if (document.hidden) stop(); else start(); };
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  function dispose() {
    if (disposed) return; disposed = true; stop(); io.disconnect(); if (ro) ro.disconnect(); document.removeEventListener('visibilitychange', onVis);
    cards.forEach((m) => { m.material.dispose(); }); textures.forEach((x) => x.dispose()); geo.dispose(); renderer.dispose();
    try { renderer.forceContextLoss(); } catch (e) { /* sin contexto */ }
  }
  addEventListener('pagehide', dispose, { once: true });
  document.addEventListener('visibilitychange', onVis);
  io.observe(sec); if (ro) ro.observe(sec); else addEventListener('resize', resize);
  /* ---------- arranque: fuentes e imágenes reales del catálogo ---------- */
  const fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('700 80px Kalnia'), document.fonts.load('500 40px "DM Sans"')]).catch(() => 0) : Promise.resolve();
  Promise.all([fonts, loadImg('img/logo.png').catch(() => null), ...ITEMS.map((i) => loadImg(i.img))]).then((res) => {
    if (disposed) return; const logo = res[1], imgs = res.slice(2);
    ITEMS.forEach((it, i) => {
      const tex = cover(it, imgs[i], logo); textures.push(tex);
      const mat = new T.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, side: T.FrontSide, extensions: { derivatives: true },
        uniforms: { uMap: { value: tex }, uSize: { value: new T.Vector2(PW, PH) }, uR: { value: .085 }, uBend: { value: .3 }, uTime: { value: 0 }, uRip: { value: .006 } } });
      const m = new T.Mesh(geo, mat); scene.add(m); cards.push(m);
    });
    sec.classList.add('reel-on'); resize(); setLabel(); needs = true; if (visible) start();
  }).catch(() => { dispose(); fail(); });
})();
