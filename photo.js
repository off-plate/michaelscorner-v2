/* Michael's Corner v2, halftone portrait (signature moment #3).
   Mounts on <canvas data-photo> layered over a photo inside .photo-frame.
   On hover the photo dissolves into its own dot-matrix halftone (ink dots on cream,
   orange follows the cursor) while the Corner brackets tighten like a lens.
   Ported from the v1 MCdots portrait engine. Static final frame under reduced motion. */
(function () {
  "use strict";
  var INK = [21, 19, 15], ORANGE = [242, 84, 27];
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function len(x, y) { return Math.sqrt(x * x + y * y); }
  function mixc(o) {
    o = clamp(o, 0, 1);
    return 'rgb(' + Math.round(INK[0] + (ORANGE[0] - INK[0]) * o) + ',' +
      Math.round(INK[1] + (ORANGE[1] - INK[1]) * o) + ',' +
      Math.round(INK[2] + (ORANGE[2] - INK[2]) * o) + ')';
  }
  var insts = [], running = false;

  function Halftone(canvas) {
    this.c = canvas; this.x = canvas.getContext('2d');
    this.grid = +canvas.getAttribute('data-grid') || 128;
    this.S = { hover: false, mx: 0, my: 0 };
    this.lum = null; this.dirty = true; this.drew = false;
    var self = this;
    this.size();
    var src = canvas.getAttribute('data-src') || 'assets/portrait.jpg';
    this._img = new Image();
    this._img.onload = function () { self.buildLum(); };
    this._img.src = src;
    var host = canvas.closest('.photo-frame') || canvas.parentNode;
    if (!RM) {
      host.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        self.S.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        self.S.my = (((e.clientY - r.top) / r.height) * 2 - 1) * self.asp;
        self.S.hover = true; self.dirty = true;
      });
      host.addEventListener('pointerleave', function () { self.S.hover = false; self.dirty = true; });
    }
    insts.push(this);
  }
  Halftone.prototype.size = function () {
    var r = this.c.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    this.w = w; this.h = h; this.cols = this.grid;
    this.rows = Math.max(1, Math.round(this.grid * h / w)); this.asp = this.rows / this.cols;
    var dpr = window.devicePixelRatio || 1;
    this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
    this.x.setTransform(dpr, 0, 0, dpr, 0, 0); this.dirty = true;
    if (this._img && this._img.complete && this._img.naturalWidth) this.buildLum();
  };
  Halftone.prototype.buildLum = function () {
    if (!this._img || !this._img.complete || !this._img.naturalWidth) return;
    var off = document.createElement('canvas'); off.width = this.cols; off.height = this.rows;
    var oc = off.getContext('2d'); oc.drawImage(this._img, 0, 0, this.cols, this.rows);
    var d; try { d = oc.getImageData(0, 0, this.cols, this.rows).data; } catch (e) { return; }
    var lum = []; for (var j = 0; j < this.rows; j++) { lum[j] = []; for (var i = 0; i < this.cols; i++) { var k = (j * this.cols + i) * 4; lum[j][i] = (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255; } }
    this.lum = lum; this.dirty = true;
  };
  Halftone.prototype.draw = function () {
    var x = this.x, cols = this.cols, rows = this.rows, sp = this.w / cols, S = this.S, lum = this.lum;
    x.clearRect(0, 0, this.w, this.h);
    if (!lum) { this.drew = true; return; }
    for (var j = 0; j < rows; j++) { for (var i = 0; i < cols; i++) {
      var px = ((i + 0.5) / cols) * 2 - 1, py = (((j + 0.5) / rows) * 2 - 1) * this.asp;
      var L = lum[j] ? lum[j][i] : 1, b = clamp(1 - L, 0, 1), o = 0;
      if (S.hover) { var dd = len(px - S.mx, py - S.my); o = clamp(1 - dd / 0.42, 0, 1); }
      if (b <= 0.06) continue; if (b > 1) b = 1;
      x.fillStyle = mixc(o); var rad = sp * (0.12 + b * 0.42);
      x.beginPath(); x.arc((i + 0.5) * sp, (j + 0.5) * sp, rad, 0, 6.2832); x.fill();
    } }
    this.drew = true;
  };
  Halftone.prototype.tick = function () {
    if (!this.c.isConnected) return;
    var live = this.dirty || this.S.hover;
    if (!this.drew) live = true;
    if (live) { this.dirty = false; this.draw(); }
  };
  function loop() { for (var i = 0; i < insts.length; i++) insts[i].tick(); requestAnimationFrame(loop); }
  function start() { if (running) return; running = true; requestAnimationFrame(loop); }

  function mount(root) {
    var els = (root || document).querySelectorAll('canvas[data-photo]:not([data-mounted])');
    for (var i = 0; i < els.length; i++) { els[i].setAttribute('data-mounted', '1'); try { new Halftone(els[i]); } catch (e) {} }
    if (els.length) start();
    window.addEventListener('resize', function () { for (var k = 0; k < insts.length; k++) insts[k].size(); });
  }
  window.MCPhoto = { mount: mount };
  if (document.readyState !== 'loading') mount();
  else document.addEventListener('DOMContentLoaded', function () { mount(); });
})();
