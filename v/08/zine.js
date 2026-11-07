// whatreally.is v08: films respect reduced motion; the marker annotations on the source are drawn when they come into view.
(() => {
  const root = document.documentElement;
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  const vids = [...document.querySelectorAll('video')];
  const still = () => vids.forEach((v) => { v.removeAttribute('autoplay'); v.autoplay = false; v.pause(); v.controls = true; });
  if (rm.matches) still();
  if (rm.addEventListener) rm.addEventListener('change', (e) => { if (e.matches) still(); });

  const marks = [...document.querySelectorAll('.draw')];
  if (rm.matches || !('IntersectionObserver' in window)) { marks.forEach((m) => m.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  marks.forEach((m) => io.observe(m));
  // safety: never leave a mark undrawn
  setTimeout(() => marks.forEach((m) => { const r = m.getBoundingClientRect(); if (r.top < innerHeight) m.classList.add('in'); }), 1500);

  // play the films only while they are on screen
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (rm.matches) return;
    if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  }), { threshold: 0.1 });
  vids.forEach((v) => vio.observe(v));
  root.classList.add('ready');
})();
