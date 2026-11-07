// v/07: films play only on screen; with reduced motion they stop and show their controls.
(function () {
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var vids = Array.prototype.slice.call(document.querySelectorAll('video'));
  var reduced = function () { return !!(mq && mq.matches); };
  function still() {
    vids.forEach(function (v) { v.pause(); v.removeAttribute('autoplay'); v.controls = true; });
  }
  if (reduced()) still();
  if (mq) {
    var on = function (e) { if (e.matches) still(); };
    if (mq.addEventListener) mq.addEventListener('change', on); else if (mq.addListener) mq.addListener(on);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (reduced()) return;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
      });
    }, { threshold: 0.1 });
    vids.forEach(function (v) { io.observe(v); });
  }
})();
