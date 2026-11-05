/* ==========================================================
   D'SALMS · motion.js (JavaScript vanilla, sin dependencias)
   Compartido por todas las páginas; cada pieza solo actúa si
   encuentra su elemento. Respeta prefers-reduced-motion.
   ========================================================== */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROOT = document.body.dataset.root || '';

/* 1. Barra de progreso de lectura */
const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); document.body.prepend(bar);
const prog = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', m > 0 ? Math.min(1, scrollY / m).toFixed(4) : 0); };
addEventListener('scroll', prog, { passive: true }); addEventListener('resize', prog); prog();

/* 2. Palabras cinéticas en los títulos principales (el texto sigue siendo texto real) */
function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.style.setProperty('--i', i++); s.textContent = t; w.append(s); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el); el.classList.add('kin'); el.classList.remove('rv', 'in');
  el.style.opacity = 1; el.style.transform = 'none';
}
if (!reduce) $$('.phero h1, .hero h1').forEach(splitWords);

/* 3. Luz que sigue al puntero en los héroes */
if (!reduce && matchMedia('(hover:hover)').matches) {
  $$('.hero, .phero').forEach((h) => {
    let raf = 0;
    h.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = h.getBoundingClientRect();
        h.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        h.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); raf = 0;
      });
    });
  });
}

/* 4. Aparición escalonada de tarjetas y filas */
$$('.cards, .pgrid, .col3, .slotrow, .statsband .grid').forEach((g) =>
  [...g.children].forEach((c, i) => { if (c.classList.contains('rv')) c.style.setProperty('--d', Math.min(i, 8) * 80 + 'ms'); }));

/* 5. Contadores (solo cifras verificables del propio sitio) */
const ease = (t) => 1 - Math.pow(1 - t, 3);
function count(el) {
  const n = +el.dataset.n; if (reduce) { el.textContent = n; return; }
  const t0 = performance.now(), D = 1400;
  const step = (t) => { const k = Math.min(1, (t - t0) / D); el.textContent = Math.round(n * ease(k)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }), { threshold: .6 });
$$('.cnt[data-n]').forEach((c) => { c.textContent = reduce ? c.dataset.n : '0'; cio.observe(c); });

/* 6. Espacios de imagen: si el archivo existe, reemplaza el marcador */
const EXTS = ['.webp', '.jpg', '.png'];
function probe(base, ok) { let i = 0; const next = () => { if (i >= EXTS.length) return; const t = new Image(); t.onload = () => ok(t.src); t.onerror = () => { i++; next(); }; t.src = ROOT + base + EXTS[i]; }; next(); }
$$('.slot').forEach((s) => {
  const im = $('img', s); if (!im) return;
  if (!im.getAttribute('src') && s.dataset.src) probe(s.dataset.src.replace(/\.webp$/, ''), (src) => { im.src = src; s.classList.remove('empty'); });
  else if (im.complete && im.naturalWidth === 0 && im.getAttribute('src')) s.classList.add('empty');
});
/* Fotos de producto y comparadores: si existe la fotografía real, sustituye la ilustración provisional */
$$('img[data-photo]').forEach((im) => probe(im.dataset.photo.replace(/\.webp$/, ''), (src) => { im.src = src; const h = im.closest('.pcard, .cmp-side'); if (h) h.classList.add('real'); }));

/* 7. Productos: filtro por colección + ficha desplegable + inclinación */
const cards = $$('.pcard');
if (cards.length) {
  const btns = $$('[data-filter]'), msg = $('.cnt-msg');
  const set = (f, push) => {
    btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.filter === f));
    let shown = 0;
    cards.forEach((c) => {
      const ok = f === 'todas' || c.dataset.line === f; c.hidden = !ok;
      if (ok) { shown++; if (!reduce) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } }
    });
    if (msg) msg.textContent = shown + (shown === 1 ? ' diseño conceptual' : ' diseños conceptuales');
    if (push) { try { history.replaceState(null, '', f === 'todas' ? location.pathname : '#' + f); } catch (e) { /* sin historial */ } }
  };
  btns.forEach((b) => b.addEventListener('click', () => set(b.dataset.filter, true)));
  const h = location.hash.replace('#', ''); set(['esencia', 'fe', 'palabra', 'femenina'].includes(h) ? h : 'todas', false);
  $$('.pmore').forEach((b) => b.addEventListener('click', () => {
    const d = b.nextElementSibling, o = d.classList.toggle('open'); b.setAttribute('aria-expanded', o);
  }));
  if (!reduce && matchMedia('(hover:hover)').matches) cards.forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg'); c.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  });
}
})();
