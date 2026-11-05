/* D'SALMS · Animación 03: revelado de letras (scramble). JavaScript vanilla.
   Cada 40 ms: step = floor(elapsed/40); resolved = min(len, step); n = min(13, len - resolved).
   Se muestra el prefijo real y hasta 13 letras cambiantes; noise[i] = (step*17 + i*7 + 3) mod 26. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const ABC = 'abcdefghijklmnopqrstuvwxyz', TICK = 40, MAXN = 13;
  document.querySelectorAll('[data-scramble]').forEach((btn) => {
    const text = btn.dataset.text || 'Viste tu esencia', vis = btn.querySelector('.ls-vis');
    let t0 = 0, timer = 0, visible = true;
    const show = (s) => { if (vis.textContent !== s) vis.textContent = s; };
    const restore = () => { clearInterval(timer); timer = 0; show(text); };
    const frame = () => {
      const step = Math.floor((performance.now() - t0) / TICK);
      if (step >= text.length + MAXN) { restore(); return; }
      const resolved = Math.min(text.length, step), n = Math.min(MAXN, text.length - resolved);
      let out = text.slice(0, resolved);
      for (let i = 0; i < n; i++) {
        const real = text.charAt(resolved + i);
        out += real === ' ' ? ' ' : ABC.charAt((step * 17 + i * 7 + 3) % 26);
      }
      show(out);
    };
    const start = () => {
      if (reduce.matches || !visible || document.hidden) { show(text); return; }
      clearInterval(timer); t0 = performance.now(); frame(); timer = setInterval(frame, TICK);
    };
    btn.addEventListener('pointerenter', start);
    btn.addEventListener('focus', start);
    btn.addEventListener('click', start);
    btn.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') restore(); });
    btn.addEventListener('blur', restore);
    document.addEventListener('visibilitychange', () => { if (document.hidden) restore(); });
    new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; if (!visible) restore(); }), { threshold: .15 }).observe(btn);
    addEventListener('pagehide', restore, { once: true });
    show(text);
  });
})();
