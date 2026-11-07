// whatreally.is v10: films respect reduced motion; the small-print notes start folded on phones only.
(function () {
  var rm = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motion() {
    if (!rm || !rm.matches) return;
    document.querySelectorAll('video').forEach(function (v) { v.pause(); v.removeAttribute('autoplay'); v.controls = true; });
  }
  motion();
  if (rm && rm.addEventListener) rm.addEventListener('change', motion);
  if (window.matchMedia && matchMedia('(max-width: 699px)').matches) {
    document.querySelectorAll('details.nd').forEach(function (d) { d.open = false; });
  }
})();
