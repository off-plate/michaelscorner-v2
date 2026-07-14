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
    /* The corner-bracket focus used to be auto-applied to EVERY link and button. It
       clipped inside horizontal scrollers and mis-aligned on full-width footer links,
       so it is no longer blanket-applied. Hovers are handled per component in CSS. */
  }
  MC2.mountDevices = function (root) { root = root || document; mountIcons(root); mountWaves(root); tagFx(root); };

  /* ---------- active nav (by pathname) ---------- */
  function activeNav() {
    var path = location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1); /* '' for a directory index, else 'about.html' */
    var root = (!file || file === 'index.html') ? 'home' : file.replace('.html', '');
    /* generated subpages live under packs/ and prompts/: both belong to the library */
    if (/\/(packs|prompts)\//.test(location.pathname)) root = 'library';
    if (/\/tools\//.test(location.pathname)) root = 'tools';
    var navs = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < navs.length; i++) {
      navs[i].classList.toggle('active', navs[i].getAttribute('data-nav') === root);
    }
  }

  /* ---------- mobile menu (hamburger), injected once, works on every page ---------- */
  function buildMobileMenu() {
    var head = document.querySelector('.site-head');
    if (!head || head.querySelector('.nav-toggle')) return;
    var top = head.querySelector('.head-top');
    var nav = head.querySelector('.head-nav');
    if (!top || !nav) return;

    var btn = document.createElement('button');
    btn.className = 'nav-toggle no-fx';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    top.appendChild(btn);

    /* the handle + free-kit link, shown only inside the open panel on mobile */
    var extra = document.createElement('div');
    extra.className = 'nav-extra';
    extra.innerHTML = '<span class="h">@michaelflorian_ai</span><a href="kit.html">Free kit <span class="oa">↗</span></a>';
    nav.appendChild(extra);

    function setOpen(open) {
      head.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () { setOpen(!head.classList.contains('nav-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    /* if resized up to desktop, always reset to closed */
    var mq = window.matchMedia('(max-width:720px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { setOpen(false); });
  }

  /* ---------- brand loader (the signature wave, once per session) ----------
     The wordmark holds while the wave flows, then the screen lifts to reveal the page
     (which is already settling underneath). Skipped under reduced motion and on repeat
     views this session, so it never gets in the way. */
  function brandLoader() {
    if (RM) return;
    var l = document.createElement('div');
    l.className = 'mc-loader';
    l.setAttribute('aria-hidden', 'true');
    l.innerHTML = '<div class="lm">Michael’s <span>Corner</span></div><div class="lw"></div>';
    document.body.appendChild(l);
    var w = l.querySelector('.lw'), t0 = performance.now(), raf = 0;
    (function tick(now) { w.textContent = MC2.wave(13, (now - t0) / 1000, 6.5, 0.5); raf = requestAnimationFrame(tick); })(t0);
    setTimeout(function () {
      cancelAnimationFrame(raf);
      l.classList.add('hide');
      setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 460);
    }, 820);
  }

  /* ---------- header: on desktop, the top row (handle + wordmark + kit) tucks away on
     scroll-down so only the nav stays anchored; it slides back the moment you scroll up. ---------- */
  function headerScroll() {
    var head = document.querySelector('.site-head');
    if (!head) return;
    var last = window.pageYOffset || 0, ticking = false;
    function update() {
      var y = window.pageYOffset || 0;
      if (y > 120 && y > last + 4) head.classList.add('head-min');
      else if (y < last - 4 || y < 120) head.classList.remove('head-min');
      last = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* ---------- boot ---------- */
  function boot() {
    activeNav();
    buildMobileMenu();
    headerScroll();
    MC2.mountDevices(document);
    document.body.classList.add('mc-enter');
    brandLoader();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
