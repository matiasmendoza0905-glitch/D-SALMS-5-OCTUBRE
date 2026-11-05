/* ==========================================================
   D'SALMS · interactions.js (JavaScript vanilla)
   Componentes interactivos de Auditoría, Manual, Comunicación,
   diagramas y guía de recursos. Cada bloque solo actúa si su
   elemento existe en la página. Respeta prefers-reduced-motion.
   ========================================================== */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROOT = document.body.dataset.root || '';
const toast = (t) => { let e = $('.toast'); if (!e) { e = document.createElement('div'); e.className = 'toast'; e.setAttribute('role', 'status'); document.body.append(e); }
  e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 1600); };
const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); } catch (e) { const a = document.createElement('textarea'); a.value = txt; document.body.append(a); a.select(); try { document.execCommand('copy'); } catch (e2) { /* sin portapapeles */ } a.remove(); } toast('Copiado: ' + (txt.length > 38 ? txt.slice(0, 38) + '…' : txt)); };

/* 1. Pestañas con indicador deslizante y teclado */
$$('[data-xtabs]').forEach((box) => {
  const list = $('.xt-list', box), tabs = $$('[role=tab]', list), ind = $('.xt-ind', list), panels = $$('.xt-panel', box);
  const place = () => { const t = tabs.find((x) => x.getAttribute('aria-selected') === 'true'); if (!t) return; ind.style.setProperty('--x', t.offsetLeft + 'px'); ind.style.setProperty('--w', t.offsetWidth + 'px'); };
  const go = (i, focus) => {
    tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; panels[k].hidden = !on; });
    place(); if (focus) tabs[i].focus(); tabs[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    box.dispatchEvent(new CustomEvent('xtab', { detail: { i, panel: panels[i] } }));
  };
  tabs.forEach((t, i) => { t.addEventListener('click', () => go(i)); t.addEventListener('keydown', (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); go((i + k + tabs.length) % tabs.length, true); }
    if (e.key === 'Home') { e.preventDefault(); go(0, true); } if (e.key === 'End') { e.preventDefault(); go(tabs.length - 1, true); } }); });
  place(); addEventListener('resize', place); if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
});

/* 2. Comparadores antes/después */
$$('[data-cmp]').forEach((c) => { const v = $('.cmp-view', c), r = $('input', c); const set = () => v.style.setProperty('--pos', r.value + '%'); r.addEventListener('input', set); set(); });

/* 3. Esquema que ilumina conexiones */
$$('[data-hl]').forEach((box) => {
  const items = $$('.hl-i', box);
  const on = (it) => { const rel = (it.dataset.rel || '').split(' ').concat(it.dataset.id); box.classList.add('has');
    items.forEach((x) => { x.classList.toggle('on', rel.includes(x.dataset.id)); x.classList.toggle('sel', x === it); }); };
  const off = () => { box.classList.remove('has'); items.forEach((x) => x.classList.remove('on', 'sel')); };
  items.forEach((it) => { it.addEventListener('mouseenter', () => on(it)); it.addEventListener('focus', () => on(it)); it.addEventListener('mouseleave', off); it.addEventListener('blur', off); it.addEventListener('click', () => on(it)); });
});

/* 4. Conversaciones: los mensajes aparecen por turnos */
$$('.xt-conv').forEach((box) => {
  const start = (panel) => { const d = $('.dev-body', panel); if (!d) return; $$('[data-seq]', d).forEach((e, i) => { e.style.animationDelay = (0.15 + i * 1.05) + 's'; }); d.classList.remove('seq-on'); void d.offsetWidth; d.classList.add('seq-on'); };
  let seen = false;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; start($('.xt-panel:not([hidden])', box)); } }), { threshold: .3 }); io.observe(box);
  box.addEventListener('xtab', (e) => start(e.detail.panel));
  $$('.replay', box).forEach((b) => b.addEventListener('click', () => start(b.closest('.xt-panel'))));
  if (reduce) $$('.dev-body', box).forEach((d) => d.classList.add('seq-on'));
});

/* 5. Línea de tiempo con progreso al aparecer */
const tio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.style.setProperty('--prog', '100%'); tio.unobserve(e.target); } }), { threshold: .35 });
$$('[data-tl]').forEach((t) => { if (reduce) t.style.setProperty('--prog', '100%'); else tio.observe(t); });

/* 6. Barras y diagramas: se animan al entrar en pantalla */
const bio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); bio.unobserve(e.target); } }), { threshold: .3 });
$$('.bars, .stack, .radial').forEach((b) => bio.observe(b));

/* 7. Índice lateral con apartado activo */
$$('.ix').forEach((ix) => {
  const links = $$('a', ix), targets = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const sio = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return;
    links.forEach((a) => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); }), { rootMargin: '-25% 0px -65% 0px' });
  targets.forEach((t) => sio.observe(t));
});

/* 8. Copiar valores (colores, nombres) */
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-copy]'); if (c) { copy(c.dataset.copy); return; }
  const p = e.target.closest('[data-copy-prompt]'); if (p && window.DS_IMAGES) { const m = window.DS_IMAGES[p.dataset.copyPrompt]; if (m) copy(m.prompt); }
});

/* 9. Manual: variantes del logotipo */
$$('[data-vstage]').forEach((st) => {
  const img = $('img', st), btns = $$('.vbtn');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.setAttribute('aria-pressed', x === b)); if (!reduce) img.classList.add('swp');
    setTimeout(() => { img.src = b.dataset.src; st.style.background = b.dataset.bg; img.classList.remove('swp'); }, reduce ? 0 : 220);
  }));
});
/* 10. Manual: zona de seguridad */
$$('[data-safe]').forEach((s) => { const r = $('[data-safe-r]', s.closest('.split3')), o = $('output', r.parentElement);
  const set = () => { s.style.setProperty('--x', r.value / 100); o.textContent = r.value + ' %'; }; r.addEventListener('input', set); set(); });
/* 11. Manual: usos incorrectos / correcto */
$$('[data-bads]').forEach((box) => { const b = $('[data-bad-toggle]'); if (!b) return;
  b.addEventListener('click', () => { const fixed = box.classList.toggle('fixed'); b.setAttribute('aria-pressed', fixed); b.textContent = fixed ? 'Ver usos incorrectos' : 'Ver uso correcto'; }); });
/* 12. Manual: probador tipográfico */
$$('[data-typer]').forEach((t) => { const tx = $('input[type=text]', t), sz = $('input[type=range]', t), k = $('[data-k]', t), d = $('[data-d]', t);
  const set = () => { k.textContent = d.textContent = tx.value || 'Viste tu esencia'; t.style.setProperty('--s', sz.value + 'px'); }; tx.addEventListener('input', set); sz.addEventListener('input', set); set(); });
/* 13. Manual: lista de control con progreso */
$$('[data-chkl]').forEach((c) => { const cb = $$('input', c), pct = $('[data-pct]', c);
  const upd = () => { const n = cb.filter((x) => x.checked).length, p = Math.round(n / cb.length * 100); c.style.setProperty('--pc', p); pct.textContent = p + ' %'; };
  cb.forEach((x) => x.addEventListener('change', upd)); upd(); });

/* 14. Guía de recursos visuales: filtros, estado real y vista previa local */
const gt = $('#gTable');
if (gt) {
  const rows = $$('tbody tr', gt), msg = $('.cnt-g'), selP = $('#gPage'), selE = $('#gEst');
  const filt = () => { let n = 0; rows.forEach((r) => { const okP = !selP.value || r.dataset.page === selP.value, okE = !selE.value || r.dataset.state === selE.value; r.hidden = !(okP && okE); if (!r.hidden) n++; }); msg.textContent = n + ' de ' + rows.length + ' espacios'; };
  const mark = (r, ok) => { r.dataset.state = ok ? 'ok' : 'pend'; $('.est', r).innerHTML = ok ? '<span class="st st-ok">Instalada</span>' : '<span class="st st-pd">Pendiente</span>'; filt(); };
  rows.forEach((r) => { const base = r.dataset.src.replace(/\.webp$/, ''); const exts = ['.webp', '.jpg', '.png']; let i = 0;
    const tryNext = () => { if (i >= exts.length) { mark(r, false); return; } const t = new Image(); t.onload = () => mark(r, true); t.onerror = () => { i++; tryNext(); }; t.src = ROOT + base + exts[i]; };
    tryNext(); });
  selP.addEventListener('change', filt); selE.addEventListener('change', filt); filt();
  const f = $('#gFile'), pv = $('#gPrev');
  if (f) f.addEventListener('change', () => { const file = f.files[0]; if (!file) return; const url = URL.createObjectURL(file); pv.innerHTML = ''; const im = new Image(); im.src = url; im.alt = 'Vista previa local de ' + file.name; pv.append(im); const p = document.createElement('p'); p.textContent = file.name + ' · vista local: no se guarda ni se publica.'; pv.append(p); });
}
})();
