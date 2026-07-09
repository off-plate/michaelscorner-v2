/* Michaels Corner, dot-matrix icon engine.
   Halftone ink dots on cream, one muscle-car-orange accent (#F2541B).
   Every icon is a function cell(px,py,S) -> [brightness 0..1, orangeMix 0..1]
   sampled over a square grid. Same aesthetic as the site's 404 globe. */
(function () {
  "use strict";

  var INK = [21, 19, 15], ORANGE = [242, 84, 27];
  var GRID = 15;          // dots per side
  var EDGE = 0.12;        // edge softness in p-units

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function cov(sd) { return 1 - smooth(-EDGE, EDGE, sd); }   // 1 inside, 0 outside
  function len(x, y) { return Math.sqrt(x * x + y * y); }
  function mixc(a, b, t) {
    t = clamp(t, 0, 1);
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," +
                    Math.round(a[1] + (b[1] - a[1]) * t) + "," +
                    Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }

  // signed distance fields (p-space, +x right, +y down)
  function sdCircle(px, py, cx, cy, r) { return len(px - cx, py - cy) - r; }
  function sdBox(px, py, cx, cy, w, h) {
    var dx = Math.abs(px - cx) - w, dy = Math.abs(py - cy) - h;
    return len(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0);
  }
  function dSeg(px, py, ax, ay, bx, by) {
    var pax = px - ax, pay = py - ay, bax = bx - ax, bay = by - ay;
    var h = clamp((pax * bax + pay * bay) / (bax * bax + bay * bay || 1e-6), 0, 1);
    return len(pax - bax * h, pay - bay * h);
  }
  function sdTri(px, py, p0x, p0y, p1x, p1y, p2x, p2y) {
    var e0x = p1x - p0x, e0y = p1y - p0y, e1x = p2x - p1x, e1y = p2y - p1y, e2x = p0x - p2x, e2y = p0y - p2y;
    var v0x = px - p0x, v0y = py - p0y, v1x = px - p1x, v1y = py - p1y, v2x = px - p2x, v2y = py - p2y;
    function cl(vx, vy, ex, ey) { return clamp((vx * ex + vy * ey) / (ex * ex + ey * ey || 1e-6), 0, 1); }
    var q0x = v0x - e0x * cl(v0x, v0y, e0x, e0y), q0y = v0y - e0y * cl(v0x, v0y, e0x, e0y);
    var q1x = v1x - e1x * cl(v1x, v1y, e1x, e1y), q1y = v1y - e1y * cl(v1x, v1y, e1x, e1y);
    var q2x = v2x - e2x * cl(v2x, v2y, e2x, e2y), q2y = v2y - e2y * cl(v2x, v2y, e2x, e2y);
    var s = Math.sign(e0x * e2y - e0y * e2x);
    var dx0 = q0x * q0x + q0y * q0y, dy0 = s * (v0x * e0y - v0y * e0x);
    var dx1 = q1x * q1x + q1y * q1y, dy1 = s * (v1x * e1y - v1y * e1x);
    var dx2 = q2x * q2x + q2y * q2y, dy2 = s * (v2x * e2y - v2y * e2x);
    var dx = Math.min(dx0, dx1, dx2);
    var dy = Math.min(dy0, dy1, dy2);            // component-wise min (iq), sign = inside/outside
    return -Math.sqrt(dx) * Math.sign(dy);
  }
  // coverage of a stroke around a distance-to-line value
  function line(d, hw) { return cov(d - hw); }
  function outline(sd, hw) { return cov(Math.abs(sd) - hw); }

  // accumulate brightness + orange into a 2-slot result
  function add(res, b, o) { if (b > res[0]) res[0] = b; if (o > res[1]) res[1] = o; return res; }

  // ----------------------------------------------------------------------
  //  ICON DEFINITIONS
  // ----------------------------------------------------------------------
  var ICONS = [
    // ---------- SECTIONS ----------
    {
      key: "corner", label: "Corner", group: "sections", tag: "interactive",
      cell: function (px, py, S) {
        var r = [0, 0];
        var off = (1 - S.snap) * 0.16;           // focus-snap: brackets fly inward
        var c = 0.66 + off, a = 0.32, hw = 0.072;
        // top-left bracket
        var dTL = Math.min(dSeg(px, py, -c, -c, -c + a, -c), dSeg(px, py, -c, -c, -c, -c + a));
        add(r, line(dTL, hw), 0);
        // bottom-right bracket
        var dBR = Math.min(dSeg(px, py, c, c, c - a, c), dSeg(px, py, c, c, c, c - a));
        add(r, line(dBR, hw), 0);
        // the M (orange), monoline
        var m = Math.min(
          dSeg(px, py, -0.26, 0.34, -0.26, -0.34),
          dSeg(px, py, 0.26, 0.34, 0.26, -0.34),
          dSeg(px, py, -0.26, -0.34, 0.0, 0.04),
          dSeg(px, py, 0.0, 0.04, 0.26, -0.34));
        var mb = line(m, 0.06);
        if (mb > 0) add(r, mb, mb);
        return r;
      }
    },
    {
      key: "prompt", label: "Prompt", group: "sections", tag: "animated",
      cell: function (px, py, S) {
        var r = [0, 0];
        // chevron ">"
        var ch = Math.min(dSeg(px, py, -0.55, -0.36, -0.16, 0.0), dSeg(px, py, -0.16, 0.0, -0.55, 0.36));
        add(r, line(ch, 0.075), 0);
        // baseline underscore
        add(r, cov(sdBox(px, py, 0.22, 0.34, 0.22, 0.045)), 0);
        // blinking block cursor (orange)
        var blink = (S.t % 1.0) < 0.6 ? 1 : 0;
        if (blink) { var cb = cov(sdBox(px, py, 0.24, 0.04, 0.11, 0.18)); add(r, cb, cb); }
        return r;
      }
    },
    {
      key: "tools", label: "Tools", group: "sections", tag: "interactive", hoverAccent: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        var k1 = -0.18 + S.hv * 0.44;            // knobs slide on hover
        var k2 = 0.20 - S.hv * 0.44;
        add(r, line(dSeg(px, py, -0.62, -0.26, 0.62, -0.26), 0.035), 0);
        add(r, line(dSeg(px, py, -0.62, 0.26, 0.62, 0.26), 0.035), 0);
        add(r, cov(sdCircle(px, py, k1, -0.26, 0.15)), 0);
        add(r, cov(sdCircle(px, py, k2, 0.26, 0.15)), 0);
        return r;
      }
    },
    {
      key: "play", label: "Play", group: "sections", tag: "interactive", click: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        if (S.playing) {
          add(r, cov(sdBox(px, py, -0.22, 0, 0.12, 0.4)), 0);
          add(r, cov(sdBox(px, py, 0.22, 0, 0.12, 0.4)), 0);
        } else {
          add(r, cov(sdTri(px, py, -0.32, -0.46, -0.32, 0.46, 0.46, 0)), 0);
        }
        if (S.hv > 0.01) { var all = r[0]; add(r, all, all * S.hv); }
        return r;
      }
    },
    {
      key: "about", label: "About", group: "sections", tag: "static",
      cell: function (px, py, S) {
        var r = [0, 0];
        add(r, cov(sdCircle(px, py, 0, -0.28, 0.26)), 0);     // head
        // shoulders: top cap of a large circle
        var sh = sdCircle(px, py, 0, 0.95, 0.62);
        if (py > 0.16) add(r, cov(sh), 0);
        return r;
      }
    },

    // ---------- ACTIONS ----------
    {
      key: "copy", label: "Copy", group: "actions", tag: "interactive", click: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        var m = S.morph;                          // 0 = two squares, 1 = check
        if (m < 0.999) {
          var sq = Math.min(
            outline(sdBox(px, py, 0.15, -0.15, 0.30, 0.30), 0.055),
            outline(sdBox(px, py, -0.15, 0.15, 0.30, 0.30), 0.055));
          add(r, sq * (1 - m), 0);
        }
        if (m > 0.001) {                          // checkmark (orange)
          var ck = Math.min(dSeg(px, py, -0.34, 0.04, -0.08, 0.32), dSeg(px, py, -0.08, 0.32, 0.38, -0.28));
          var cb = line(ck, 0.095) * m;
          add(r, cb, cb);
        }
        return r;
      }
    },
    {
      key: "search", label: "Search", group: "actions", tag: "animated", hoverAccent: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        add(r, outline(sdCircle(px, py, -0.12, -0.12, 0.30), 0.06), 0);   // lens ring
        add(r, line(dSeg(px, py, 0.12, 0.12, 0.46, 0.46), 0.07), 0);      // handle
        // scan line sweeping inside the lens (orange)
        var sy = -0.12 + Math.sin(S.t * 2.2) * 0.22;
        var inLens = sdCircle(px, py, -0.12, -0.12, 0.24);
        if (inLens < 0) {
          var scan = clamp(1 - Math.abs(py - sy) / 0.05, 0, 1);
          if (scan > 0) add(r, scan, scan);
        }
        return r;
      }
    },
    {
      key: "subscribe", label: "Subscribe", group: "actions", tag: "interactive", hoverAccent: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        add(r, outline(sdBox(px, py, 0, 0.06, 0.5, 0.30), 0.05), 0);      // envelope body
        var lift = S.hv * 0.34;                                          // flap opens on hover
        var apex = 0.06 - lift;
        add(r, line(Math.min(dSeg(px, py, -0.5, -0.24, 0, apex), dSeg(px, py, 0, apex, 0.5, -0.24)), 0.055), 0);
        return r;
      }
    },
    {
      key: "arrow", label: "Arrow", group: "actions", tag: "interactive", hoverAccent: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        var s = S.hv * 0.14;                       // nudges right on hover
        add(r, line(dSeg(px, py, -0.52 + s * 0.3, 0, 0.36 + s, 0), 0.07), 0);
        add(r, line(dSeg(px, py, 0.14 + s, -0.24, 0.42 + s, 0), 0.07), 0);
        add(r, line(dSeg(px, py, 0.14 + s, 0.24, 0.42 + s, 0), 0.07), 0);
        return r;
      }
    },
    {
      key: "external", label: "External", group: "actions", tag: "static", hoverAccent: true,
      cell: function (px, py, S) {
        var r = [0, 0];
        // little card, open at the top-right
        var box = outline(sdBox(px, py, -0.16, 0.18, 0.30, 0.30), 0.05);
        if (!(px > 0.02 && py < -0.02)) add(r, box, 0);
        // arrow up-right
        add(r, line(dSeg(px, py, -0.02, 0.02, 0.42, -0.42), 0.06), 0);
        add(r, line(dSeg(px, py, 0.14, -0.42, 0.42, -0.42), 0.06), 0);
        add(r, line(dSeg(px, py, 0.42, -0.14, 0.42, -0.42), 0.06), 0);
        return r;
      }
    },

    // ---------- BRAND DEVICES ----------
    {
      key: "bar", label: "Honest Bar", group: "devices", tag: "animated",
      cell: function (px, py, S) {
        var r = [0, 0];
        var inBar = sdBox(px, py, 0, 0, 0.82, 0.20);
        var fill = (S.t < 1.5 ? smooth(0, 1, S.t / 1.4) : 1) * 0.78;   // fills once on load
        var split = -0.82 + fill * 1.64;
        if (inBar < 0) {
          if (px < split) add(r, cov(inBar), 0);                       // filled 78% (ink)
          else add(r, cov(inBar) * 0.4, 0);                            // open 22% (faint)
        }
        add(r, outline(inBar, 0.02), 0);                               // hairline frame
        var div = line(Math.abs(px - split), 0.03);                    // divider (orange)
        if (div > 0 && Math.abs(py) < 0.22) add(r, div, div);
        return r;
      }
    },
    {
      key: "receipt", label: "Receipt", group: "devices", tag: "static",
      cell: function (px, py, S) {
        var r = [0, 0];
        // paper body, open (perforated) bottom edge
        var body = outline(sdBox(px, py, 0, -0.06, 0.40, 0.52), 0.05);
        if (py < 0.40) add(r, body, 0);
        // perforation: notches along the bottom
        if (py > 0.40 && py < 0.52) {
          var notch = clamp(1 - Math.abs(((px + 1.0) * 5 % 1) - 0.5) / 0.28, 0, 1);
          if (Math.abs(px) < 0.42) add(r, notch * 0.9, 0);
        }
        // text lines
        add(r, line(dSeg(px, py, -0.26, -0.20, 0.26, -0.20), 0.03), 0);
        add(r, line(dSeg(px, py, -0.26, -0.04, 0.10, -0.04), 0.03), 0);
        // the cost (orange)
        var cost = line(dSeg(px, py, 0.0, 0.16, 0.26, 0.16), 0.045);
        if (cost > 0) add(r, cost, cost);
        return r;
      }
    },
    {
      key: "globe", label: "Globe", group: "devices", tag: "animated",
      cell: function (px, py, S) {
        var r = [0, 0];
        var R = 0.82, u = px / R, w = py / R, d2 = u * u + w * w;
        if (d2 > 1) return r;
        var z = Math.sqrt(1 - d2);
        // lambert shading, light upper-left-front
        var lam = clamp((-u) * 0.45 + (-w) * 0.5 + z * 0.74, 0, 1);
        var lon = Math.atan2(u, z) + S.t * 0.6;
        var lat = Math.asin(clamp(-w, -1, 1));
        var merid = Math.abs(((lon / (Math.PI / 4)) % 1 + 1) % 1 - 0.5);  // every 45 deg
        var paral = Math.abs(((lat / (Math.PI / 6)) % 1 + 1) % 1 - 0.5);  // every 30 deg
        var grid = (merid > 0.42 || paral > 0.40) ? 1 : 0;
        var b = (0.18 + grid * 0.7) * lam + 0.08;
        add(r, clamp(b, 0, 1), 0);
        return r;
      }
    },
    {
      key: "pulse", label: "Pulse", group: "devices", tag: "animated",
      cell: function (px, py, S) {
        var r = [0, 0];
        var d = len(px, py);
        var phase = (S.t * 0.5) % 1;
        for (var k = 0; k < 3; k++) {
          var rr = ((phase + k / 3) % 1) * 0.92;
          var amp = (1 - rr) * 0.9;
          var ringb = clamp(1 - Math.abs(d - rr) / 0.12, 0, 1) * amp;
          if (ringb > r[0]) r[0] = ringb;
        }
        if (d < 0.12) { r[0] = 0.95; r[1] = 1; }   // orange core
        return r;
      }
    }
  ];

  // ----------------------------------------------------------------------
  //  RENDERER
  // ----------------------------------------------------------------------
  var instances = [];

  function DotIcon(canvas, def) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.def = def;
    this.size = +canvas.getAttribute("data-size") || 120;
    this.S = { t: 0, hv: 0, hvTarget: 0, snap: 1, playing: false, morph: 0, clickT: -10 };
    this.dirty = true;
    var self = this;

    this.resize();
    window.addEventListener("resize", function () { self.resize(); self.dirty = true; });

    if (def.hoverAccent || def.key === "corner" || def.key === "tools" ||
        def.key === "subscribe" || def.key === "arrow" || def.key === "search") {
      canvas.addEventListener("pointerenter", function () {
        self.S.hvTarget = 1;
        if (def.key === "corner") self.S.snap = 0;   // re-arm focus-snap
        self.dirty = true;
      });
      canvas.addEventListener("pointerleave", function () { self.S.hvTarget = 0; self.dirty = true; });
    }
    canvas.style.cursor = (def.click || def.hoverAccent || def.key === "corner") ? "pointer" : "default";
    if (def.click) {
      canvas.addEventListener("pointerdown", function () {
        if (def.key === "play") self.S.playing = !self.S.playing;
        if (def.key === "copy") self.S.clickT = self.S.t;
        self.dirty = true;
      });
    }
    instances.push(this);
  }

  DotIcon.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(this.size * dpr);
    this.canvas.height = Math.round(this.size * dpr);
    this.canvas.style.width = this.size + "px";
    this.canvas.style.height = this.size + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  DotIcon.prototype.live = function () {
    return this.def.tag === "animated" ||
      Math.abs(this.S.hv - this.S.hvTarget) > 0.001 ||
      this.S.snap < 0.999 ||
      (this.S.t - this.S.clickT) < 1.3 ||
      this.dirty;
  };

  DotIcon.prototype.step = function (t, dt) {
    var S = this.S;
    S.t = t;
    S.hv += (S.hvTarget - S.hv) * Math.min(1, dt * 12);
    S.snap += (1 - S.snap) * Math.min(1, dt * 9);
    if (this.def.key === "copy") {
      var e = t - S.clickT;
      S.morph = clamp(Math.min(e / 0.16, (1.2 - e) / 0.18), 0, 1);
    }
    if (!this.live()) return;
    this.dirty = false;
    this.draw();
  };

  DotIcon.prototype.draw = function () {
    var ctx = this.ctx, n = GRID, sp = this.size / n, S = this.S, def = this.def;
    ctx.clearRect(0, 0, this.size, this.size);
    for (var j = 0; j < n; j++) {
      for (var i = 0; i < n; i++) {
        var px = ((i + 0.5) / n) * 2 - 1, py = ((j + 0.5) / n) * 2 - 1;
        var res = def.cell(px, py, S);
        var b = res[0], o = res[1];
        if (def.hoverAccent) o = Math.max(o, b * S.hv);   // whole-icon orange on hover
        if (b <= 0.04) continue;
        if (b > 1) b = 1;
        ctx.fillStyle = mixc(INK, ORANGE, o);
        var rad = sp * (0.12 + b * 0.42);
        ctx.beginPath();
        ctx.arc((i + 0.5) * sp, (j + 0.5) * sp, rad, 0, 6.2832);
        ctx.fill();
      }
    }
  };

  var last = 0, started = false;
  function loop(ts) {
    var t = ts * 0.001, dt = last ? Math.min(0.05, t - last) : 0.016;
    last = t;
    if (instances.length && !(loop._n = ((loop._n || 0) + 1) % 120)) {
      instances = instances.filter(function (i) { return i.canvas.isConnected; });
    }
    for (var k = 0; k < instances.length; k++) { if (instances[k].canvas.isConnected) instances[k].step(t, dt); }
    requestAnimationFrame(loop);
  }
  function start() { if (started) return; started = true; requestAnimationFrame(loop); }

  // ----------------------------------------------------------------------
  //  MOUNT into a brand specimen sheet
  // ----------------------------------------------------------------------
  var GROUPS = [
    { key: "sections", title: "Sections", note: "nav and page marks" },
    { key: "actions", title: "Actions", note: "buttons and controls" },
    { key: "devices", title: "Brand devices", note: "the recurring motifs" }
  ];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function mount(root) {
    GROUPS.forEach(function (g) {
      var sec = el("section", "mc-group");
      sec.setAttribute("data-screen-label", g.title);
      var head = el("div", "mc-grouphead");
      head.appendChild(el("span", "mc-glabel", g.title));
      head.appendChild(el("span", "mc-gnote", g.note));
      head.appendChild(el("span", "mc-rule"));
      sec.appendChild(head);
      var grid = el("div", "mc-grid");
      ICONS.filter(function (d) { return d.group === g.key; }).forEach(function (def) {
        var card = el("div", "mc-card");
        card.setAttribute("data-screen-label", def.label);
        var cv = document.createElement("canvas");
        cv.className = "mc-canvas";
        card.appendChild(cv);
        var meta = el("div", "mc-meta");
        meta.appendChild(el("span", "mc-name", def.label));
        meta.appendChild(el("span", "mc-tag mc-" + def.tag, def.tag));
        card.appendChild(meta);
        grid.appendChild(card);
        new DotIcon(cv, def);
      });
      sec.appendChild(grid);
      root.appendChild(sec);
    });
    requestAnimationFrame(loop);
  }

  window.MCIcons = { mount: mount, DotIcon: DotIcon, icons: ICONS, instances: instances, start: start };
})();
