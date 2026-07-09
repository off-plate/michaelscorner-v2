/* Michael's Corner v2, shared runtime for every page.
   Multi-page static site: no router, no loader. This file mounts the brand devices
   (dot icons, signature wave, corner-bracket focus), marks the active nav item,
   and provides the helpers pages share. Load order: icons.js, signature.js, shared.js. */

window.MC2 = window.MC2 || {};
(function () {
  "use strict";
  var MC2 = window.MC2;
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  MC2.reducedMotion = RM;

  /* ---------- tiny helpers ---------- */
  MC2.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  MC2.kc = function (n) { /* 12 340 Kč */
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč';
  };
  MC2.copy = function (text, btn, doneLabel) {
    var done = false;
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      } catch (e) {}
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(fallback); done = true;
      }
    } catch (e) {}
    if (!done) fallback();
    if (btn) {
      var old = btn.textContent;
      btn.textContent = doneLabel || 'Copied';
      btn.classList.add('copied');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('copied'); }, 1600);
    }
  };

  /* receipt HTML builder: opts = {title, date, onInk, rows:[{k,v,big,orange}], verdict:{stamp,text,ink}} */
  MC2.receipt = function (opts) {
    var h = '<div class="receipt' + (opts.onInk ? ' on-ink' : '') + '">';
    h += '<div class="receipt-head"><span>' + MC2.esc(opts.title || "MICHAEL'S CORNER") + '</span><span>' + MC2.esc(opts.date || '') + '</span></div>';
    h += '<div class="receipt-rows">';
    (opts.rows || []).forEach(function (r) {
      h += '<div class="receipt-row"><span class="k">' + MC2.esc(r.k) + '</span><span class="v' + (r.big ? ' big' : '') + (r.orange ? ' orange' : '') + '">' + MC2.esc(r.v) + '</span></div>';
    });
    h += '</div>';
    if (opts.verdict) {
      h += '<hr class="receipt-tear">';
      h += '<div class="receipt-verdict"><span class="receipt-stamp' + (opts.verdict.ink ? ' ink' : '') + '">' + MC2.esc(opts.verdict.stamp) + '</span><span>' + MC2.esc(opts.verdict.text) + '</span></div>';
    }
    return h + '</div>';
  };

  /* signature moment 5: the wave works, the number stamps.
     waveWork(label,el, work) shows the 9-glyph wave inside el while work runs
     (work = function(done)), then removes it and flashes the result surface. */
  var BLOCK = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  MC2.wave = function (n, t, speed, phase) {
    n = n || 9; speed = speed || 7; phase = phase || 0.62;
    var s = '';
    for (var i = 0; i < n; i++) {
      var v = 0.5 + 0.5 * Math.sin(t * speed - i * phase);
      var k = Math.round(v * 7);
      s += BLOCK[k < 0 ? 0 : k > 7 ? 7 : k];
    }
    return s;
  };
  MC2.waveWork = function (el, resultEl, work, minMs) {
    if (RM) { work(function () {}); return; }
    var span = document.createElement('span');
    span.className = 'mono orange';
    span.style.whiteSpace = 'pre';
    span.setAttribute('role', 'img'); span.setAttribute('aria-label', 'working');
    el.appendChild(span);
    var t0 = performance.now(), raf = 0;
    (function tick(now) {
      span.textContent = MC2.wave(9, (now - t0) / 1000);
      raf = requestAnimationFrame(tick);
    })(t0);
    var began = performance.now();
    work(function finish() {
      var wait = Math.max(0, (minMs || 600) - (performance.now() - began));
      setTimeout(function () {
        cancelAnimationFrame(raf);
        if (span.parentNode) span.parentNode.removeChild(span);
        if (resultEl) {
          resultEl.style.transition = 'background-color 150ms ease-out';
          var prev = resultEl.style.backgroundColor;
          resultEl.style.backgroundColor = '#F1EADD';
          setTimeout(function () { resultEl.style.backgroundColor = prev || ''; }, 160);
        }
      }, wait);
    });
  };

  /* ---------- brand devices ---------- */
  function mountIcons(root) {
    if (!window.MCIcons) return;
    var els = root.querySelectorAll('canvas[data-dot]:not([data-mounted])');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], key = el.getAttribute('data-dot'), def = null;
      for (var k = 0; k < MCIcons.icons.length; k++) { if (MCIcons.icons[k].key === key) { def = MCIcons.icons[k]; break; } }
      if (!def) continue;
      el.setAttribute('data-mounted', '1');
      try { new MCIcons.DotIcon(el, def); } catch (e) {}
    }
    try { if (els.length) MCIcons.start(); } catch (e) {}
  }
  function mountWaves(root) {
    if (!window.MCSignature) return;
    try { MCSignature.mountAll(root); } catch (e) {}
  }
  function tagFx(root) {
    var els = root.querySelectorAll('button, a[href], summary');
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.classList.contains('head-word') || e.classList.contains('no-fx')) continue;
      if (!e.classList.contains('fx')) e.classList.add('fx');
    }
  }
  MC2.mountDevices = function (root) { root = root || document; mountIcons(root); mountWaves(root); tagFx(root); };

  /* ---------- active nav (by pathname) ---------- */
  function activeNav() {
    var path = location.pathname.replace(/\/+$/, '');
    var file = path.split('/').pop() || 'index.html';
    var root = file.replace('.html', '');
    if (root === 'index' || root === '') root = 'home';
    /* generated subpages live under packs/ and prompts/: both belong to the library */
    if (/\/(packs|prompts)\//.test(location.pathname)) root = 'library';
    if (/\/tools\//.test(location.pathname)) root = 'tools';
    var navs = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < navs.length; i++) {
      navs[i].classList.toggle('active', navs[i].getAttribute('data-nav') === root);
    }
  }

  /* ---------- boot ---------- */
  function boot() {
    activeNav();
    MC2.mountDevices(document);
    document.body.classList.add('mc-enter');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
