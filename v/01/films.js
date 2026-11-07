// v/01 films: autoplay muted loops; with prefers-reduced-motion they stay paused on the poster and get controls.
// Off-screen films pause to save the battery.
(() => {
  const vids = [...document.querySelectorAll('video')];
  if (!vids.length) return;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new Set();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    for (const e of es) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); if (!mq.matches) (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()); }
  }, { rootMargin: '200px 0px' }) : null;
  const apply = () => {
    for (const v of vids) {
      if (mq.matches) { v.pause(); v.removeAttribute('autoplay'); v.controls = true; }
      else { v.controls = false; if (!io || seen.has(v)) v.play().catch(() => {}); }
    }
  };
  if (io) vids.forEach((v) => io.observe(v));
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
})();
