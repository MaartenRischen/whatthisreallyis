/* whatreally.is v09: films play only while on screen; the system graph fills in as you scroll.
   Without JS everything is already shown (bars full, winner marked). With reduced motion: films
   paused with controls, graph shown complete. */
(function () {
  var d = document, w = window;
  var rm = false;
  /* the Cor bar can wrap to two lines on narrow phones: keep sticky offsets equal to its real height */
  var bar = d.querySelector('.corbar');
  function barH() { if (!bar) return; var s = d.documentElement.style; s.removeProperty('--bar'); s.setProperty('--bar', bar.offsetHeight + 'px'); }
  barH(); w.addEventListener('resize', barH);
  try { rm = w.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------------- films: play in view, pause out of view */
  var vids = [].slice.call(d.querySelectorAll('video'));
  if (rm) {
    vids.forEach(function (v) { v.removeAttribute('autoplay'); try { v.pause(); } catch (e) {} v.controls = true; });
  } else if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { try { v.pause(); } catch (x) {} }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  } else {
    vids.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
  }

  /* ---------------- which system wins: rows fill in with scroll */
  var sec = d.querySelector('.sys');
  var g = sec && sec.querySelector('.graph');
  if (!g || rm) return;
  var rows = [].slice.call(g.querySelectorAll('.g-row'));
  var stick = sec.querySelector('.sys-graph .sticky');
  var why = sec.querySelector('.s-why');
  g.classList.add('armed');

  function sticky() {
    sec.classList.remove('nosticky');
    if (getComputedStyle(stick).position !== 'sticky') return false;
    if (g.getBoundingClientRect().height > w.innerHeight - 60) { sec.classList.add('nosticky'); return false; }
    return true;
  }
  var isSticky = sticky();
  var ticking = false;
  function update() {
    ticking = false;
    var vh = w.innerHeight, n = rows.length, k = 0, done = false;
    if (isSticky) {
      // reveal starts when the graph is pinned and ends when the "why" step reaches the middle
      var y = w.scrollY || w.pageYOffset;
      var start = y + sec.getBoundingClientRect().top - vh * 0.2;
      var end = y + why.getBoundingClientRect().top - vh * 0.62;
      var p = end > start ? (y - start) / (end - start) : 1;
      k = p <= 0 ? 0 : Math.min(n, Math.floor(p * n) + 1);
      done = p >= 1;
    } else {
      rows.forEach(function (r) { if (r.getBoundingClientRect().top < vh * 0.86) k++; });
      done = k === n;
    }
    rows.forEach(function (r, i) { r.classList.toggle('on', i < k); });
    g.classList.toggle('done', done);
  }
  function req() { if (!ticking) { ticking = true; w.requestAnimationFrame(update); } }
  rows.forEach(function (r) { r.classList.remove('on'); });
  g.classList.remove('done');
  w.addEventListener('scroll', req, { passive: true });
  w.addEventListener('resize', function () { isSticky = sticky(); req(); });
  update();
})();
