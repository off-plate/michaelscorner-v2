/* Michael's Corner, the signature wave.
   A muscle-orange ASCII waveform that flows while something is thinking / loading / generating.
   Portable: MCSignature.mount(el, { chars, speed, phase, color }). */
(function () {
  "use strict";
  var BLOCK = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']; // ▁▂▃▄▅▆▇█

  function render(n, phase, t, speed) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var h = 0.5 + 0.5 * Math.sin(t * speed - i * phase);
      var k = Math.round(h * (BLOCK.length - 1));
      s += BLOCK[k < 0 ? 0 : k > 7 ? 7 : k];
    }
    return s;
  }

  function mount(el, opts) {
    opts = opts || {};
    var n = opts.chars || 22, speed = opts.speed || 7, phase = opts.phase || 0.5;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.style.whiteSpace = 'pre';
    el.style.fontFamily = "'Space Mono', ui-monospace, Menlo, monospace";
    el.style.color = opts.color || '#F2541B';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', opts.label || 'working');
    if (reduce) { el.textContent = render(n, phase, 0, speed); return { stop: function () {} }; }
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now(), raf = 0, alive = true;
    function frame(now) {
      if (!alive) return;
      el.textContent = render(n, phase, ((now || Date.now()) - t0) / 1000, speed);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return { stop: function () { alive = false; if (raf) cancelAnimationFrame(raf); } };
  }

  function mountAll(root) {
    (root || document).querySelectorAll('[data-mc-signature]').forEach(function (el) {
      if (el.getAttribute('data-mc-on')) return;
      el.setAttribute('data-mc-on', '1');
      mount(el, {
        chars: +el.getAttribute('data-chars') || 22,
        speed: +el.getAttribute('data-speed') || 7,
        phase: +el.getAttribute('data-phase') || 0.5,
        color: el.getAttribute('data-color') || undefined,
        label: el.getAttribute('data-label') || undefined
      });
    });
  }

  window.MCSignature = { mount: mount, mountAll: mountAll, render: render, BLOCK: BLOCK };
  if (document.readyState !== 'loading') mountAll();
  else document.addEventListener('DOMContentLoaded', function () { mountAll(); });
})();
