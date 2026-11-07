// v/06: films respect prefers-reduced-motion (paused, with controls) and pause when off screen.
(function () {
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var vids = Array.prototype.slice.call(document.querySelectorAll('video'));
  function reduced() { return !!(mq && mq.matches); }
  function apply() {
    vids.forEach(function (v) {
      if (reduced()) { v.pause(); v.removeAttribute('autoplay'); v.controls = true; }
      else { v.controls = false; }
    });
  }
  apply();
  if (mq && mq.addEventListener) mq.addEventListener('change', apply);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (reduced()) return;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  }
})();
