/* D'SALMS · Animación 02: titular enorme controlado por el scroll (sin bibliotecas).
   x = V - p * (V + T), con p = clamp(-top / D, 0, 1) y sin easing. El listener de scroll
   solo existe mientras la sección está cerca de la pantalla. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-st]').forEach((run) => {
    const frame = run.querySelector('.st-frame'), title = run.querySelector('.st-title'), img = run.querySelector('.st-img');
    if (!frame || !title) return;
    let V = 0, T = 0, D = 1, raf = 0, listening = false, ro = null;
    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const measure = () => { V = frame.clientWidth; T = title.offsetWidth; D = Math.max(1, run.offsetHeight - frame.clientHeight); };
    const apply = () => {
      raf = 0; if (reduce.matches) { title.style.transform = ''; return; }
      const p = clamp(-run.getBoundingClientRect().top / D, 0, 1);
      title.style.transform = `translate3d(${V - p * (V + T)}px,-50%,0)`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const on = () => { if (!listening) { addEventListener('scroll', schedule, { passive: true }); listening = true; } };
    const off = () => { if (listening) { removeEventListener('scroll', schedule); listening = false; } };
    const io = new IntersectionObserver((es) => es.forEach((e) => { measure(); if (e.isIntersecting) on(); else { off(); schedule(); } }), { rootMargin: '25% 0px 25% 0px' });
    const init = () => { measure(); schedule(); };
    io.observe(run);
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(() => { measure(); schedule(); }); ro.observe(frame); ro.observe(title); } else addEventListener('resize', init);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
    if (img && !img.complete) img.addEventListener('load', init, { once: true });
    reduce.addEventListener('change', init);
    addEventListener('pagehide', () => { off(); io.disconnect(); if (ro) ro.disconnect(); if (raf) cancelAnimationFrame(raf); }, { once: true });
    init();
  });
})();
