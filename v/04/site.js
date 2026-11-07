// v04 films: autoplay muted loops that pause off screen; with prefers-reduced-motion they stay paused and get controls.
(() => {
  const vids = [...document.querySelectorAll('video')];
  if (!vids.length) return;
  const rm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const still = () => {
    for (const v of vids) { v.pause(); v.controls = true; v.removeAttribute('autoplay'); }
  };
  if (rm.matches) { still(); return; }
  if (rm.addEventListener) rm.addEventListener('change', (e) => { if (e.matches) still(); });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => {
    for (const e of es) {
      const v = e.target;
      if (rm.matches) continue;
      if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
    }
  }, { rootMargin: '200px 0px' });
  vids.forEach((v) => io.observe(v));
})();
