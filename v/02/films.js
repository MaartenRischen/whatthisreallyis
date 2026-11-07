// whatreally.is v/02: the 28 Oct films.js. Plays the then-now films and draws the gold alarm rings from each
// film's head track, makes the "Copy link" button work, and evens out the two desktop columns.
// For people who asked for less motion: films paused with controls, rings drawn still.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vs = [...document.querySelectorAll('video.clip')], tracks = {};
  vs.forEach((v) => {
    const k = v.dataset.topic;
    if (!(k in tracks)) { tracks[k] = null; fetch(v.dataset.track).then((r) => r.json()).then((j) => { tracks[k] = j; if (still) rings(0); }).catch(() => {}); }
    v.muted = true;
    if (still) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; v.addEventListener('seeked', () => rings(0)); }
    else { const p = v.play(); if (p) p.catch(() => {}); }
  });
  function rings(T) {
    vs.forEach((v) => {
      const c = v.nextElementSibling, tr = tracks[v.dataset.topic];
      if (!c || c.tagName !== 'CANVAS' || !tr || v.dataset.signal !== '1') return;
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      const s = tr[v.dataset.part], p = s && s.pts && s.pts[Math.min(s.pts.length - 1, Math.floor(v.currentTime * s.fps))];
      if (!p) return;
      const x = p[0] * w, y = p[1] * h, r = Math.max(8, Math.min(p[2] * w * 1.3, h * 0.13));
      g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 3; g.strokeStyle = '#d9ab3c';
      const n = still ? 1 : 3;
      for (let k = 0; k < n; k++) {
        const u = still ? 0.2 : (T * 0.9 + k / 3) % 1;
        g.globalAlpha = (1 - u) * 0.95; g.lineWidth = Math.max(1.4, r * 0.07 * (1 - u * 0.5));
        g.beginPath(); g.arc(x, y, r * (0.75 + u * 0.9), 0, Math.PI * 2); g.stroke();
      }
      g.restore();
    });
  }
  if (vs.length && !still) { const loop = (ms) => { rings(ms / 1000); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    try { navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = 'Copied'; }, () => {}); } catch (err) {}
  });
  // desktop: the two top stacks (post frame + reading left, pictures + claims right) end unevenly; move "What they
  // say it is", then "The mechanisms at work", into the shorter stack while that evens them out. Phone: untouched.
  const A = document.querySelector('.colA'), B = document.querySelector('.colB');
  const movers = ['theysay', 'mechanisms'].map((id) => document.getElementById(id)).filter(Boolean)
    .map((el) => ({ el, home: el.parentNode, after: el.nextSibling }));
  function balance() {
    if (!A || !B) return;
    for (const m of movers.slice().reverse()) if (m.el.parentNode !== m.home) { m.home.insertBefore(m.el, m.after); m.el.classList.add('wide'); }
    if (!matchMedia('(min-width: 1000px)').matches) return;
    for (const m of movers) {
      const d0 = B.offsetHeight - A.offsetHeight; const short = d0 > 0 ? A : B;
      short.appendChild(m.el); m.el.classList.remove('wide');
      const d1 = B.offsetHeight - A.offsetHeight;
      if (Math.abs(d1) >= Math.abs(d0)) { m.home.insertBefore(m.el, m.after); m.el.classList.add('wide'); break; }
    }
  }
  balance();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(balance);
  addEventListener('load', balance);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(balance, 150); });
})();
