/* whatreally.is v/05: two small jobs.
   1. Reduced motion: pause the then/now films and give them controls.
   2. Headline fitting: like a sub-editor fitting a splash, set the largest size at which the headline
      still fits its column and a height budget. Without JS the CSS sizes stand. */
(function () {
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motion() {
    var vids = document.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      var v = vids[i];
      if (mq && mq.matches) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; }
      else if (!v.controls) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    }
  }
  motion();
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', motion); else if (mq.addListener) mq.addListener(motion); }

  function budget(kind) {
    var w = window.innerWidth, h = window.innerHeight;
    if (kind === 'case') {
      if (w >= 1100) return { maxH: Math.max(300, Math.min(h * 0.6, 560)), lo: 56, hi: 168 };
      if (w >= 760) return { maxH: Math.max(280, h * 0.48), lo: 44, hi: 120 };
      return { maxH: Math.max(260, h * 0.5), lo: 30, hi: 64 };
    }
    if (kind === 'splash') {
      if (w >= 1100) return { maxH: Math.max(300, Math.min(h * 0.58, 540)), lo: 56, hi: 150 };
      if (w >= 760) return { maxH: Math.max(260, h * 0.42), lo: 44, hi: 110 };
      return { maxH: Math.max(240, h * 0.42), lo: 30, hi: 60 };
    }
    return null;
  }
  function fit(el) {
    var b = budget(el.getAttribute('data-fit'));
    if (!b) return;
    var lo = b.lo, hi = b.hi, best = lo;
    for (var k = 0; k < 14 && hi - lo > 0.5; k++) {
      var mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      if (el.scrollHeight <= b.maxH && el.scrollWidth <= el.clientWidth + 1) { best = mid; lo = mid; } else { hi = mid; }
    }
    el.style.fontSize = Math.floor(best) + 'px';
  }
  function fitAll() { var els = document.querySelectorAll('[data-fit]'); for (var i = 0; i < els.length; i++) fit(els[i]); }
  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  var t, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; fitAll(); } }, 120);
  });
})();
