// v03 case pages: plays the then-now films and draws the gold alarm rings from each film's head track (src/films.js
// of the round-2 page, unchanged in what it draws), pauses everything and shows the controls for readers who ask for
// reduced motion, holds the shorter top columns in view on wide screens, and makes the "Copy link" button work.
(() => {
  const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vs = [...document.querySelectorAll('video.clip')], tracks = {};
  vs.forEach((v) => {
    const k = v.dataset.topic;
    if (k && v.dataset.track && !(k in tracks)) { tracks[k] = null; fetch(v.dataset.track).then((r) => r.json()).then((j) => { tracks[k] = j; }).catch(() => {}); }
    v.muted = true;
    if (still) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; return; }
    const p = v.play(); if (p) p.catch(() => {});
  });
  function rings(T) {
    vs.forEach((v) => {
      const c = v.nextElementSibling, tr = tracks[v.dataset.topic];
      if (!c || c.tagName !== 'CANVAS' || !tr || v.dataset.signal !== '1') return;
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      const s = tr[v.dataset.part], p = s && s.pts[Math.min(s.pts.length - 1, Math.floor(v.currentTime * s.fps))]; if (!p) return;
      const x = p[0] * w, y = p[1] * h, r = Math.max(8, Math.min(p[2] * w * 1.3, h * 0.13));
      g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 3; g.strokeStyle = '#d9ab3c';
      for (let k = 0; k < 3; k++) { const u = (T * 0.9 + k / 3) % 1; g.globalAlpha = (1 - u) * 0.95; g.lineWidth = Math.max(1.4, r * 0.07 * (1 - u * 0.5)); g.beginPath(); g.arc(x, y, r * (0.75 + u * 0.9), 0, Math.PI * 2); g.stroke(); }
      g.restore();
    });
  }
  if (vs.length) { const loop = (ms) => { rings(still ? 0 : ms / 1000); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  // wide screens: the three top columns hold once their end is in view ([data-st] in style.css), so the shorter
  // columns never show an empty stretch while the longest one finishes
  const top = document.querySelector('.top:not(.short-post)');
  if (top && window.matchMedia && window.ResizeObserver) {
    const wide = matchMedia('(min-width:1180px)');
    const all = [...top.children].filter((e) => e.matches('.mid,.post,.claims'));
    const fit = () => all.forEach((e) => {
      if (wide.matches) { e.style.setProperty('--st', `${Math.min(16, innerHeight - e.offsetHeight - 16)}px`); e.dataset.st = ''; }
      else delete e.dataset.st;
    });
    const ro = new ResizeObserver(fit); all.forEach((e) => ro.observe(e));
    addEventListener('resize', fit); fit();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    try { navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = 'Copied'; }, () => {}); } catch (err) { /* no clipboard */ }
  });
})();
