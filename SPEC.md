# Michael's Corner v2 — Build SPEC

_The single build contract. Read planning/DIRECTION.md first (it is law), then this file, then your assigned content file. Where SPEC and DIRECTION disagree, DIRECTION wins. Where anything disagrees with BRAND.md, BRAND.md wins._

## Architecture

Static multi-page site. Real URLs. No React, no CDN runtime, no build framework. Vanilla HTML/CSS/JS. Deployed on GitHub Pages at https://off-plate.github.io/michaelscorner-v2/ (repo root).

**IMPORTANT: all URLs in pages are RELATIVE** (`styles.css`, `assets/...`, `packs/founders.html`, and from inside packs/ back out: `../styles.css`). Never absolute `/...` paths (GitHub Pages serves under /michaelscorner-v2/).

```
website-v2/
  index.html            home (broadsheet front page)
  start.html            start here (guided path)
  library.html          library index (card catalog)
  packs/<id>.html       one page per pack (dossier)      [GENERATED]
  prompts/<id>.html     one page per prompt (spec sheet)  [GENERATED]
  tools.html            tools hub (instrument panel)
  tools/<id>.html       one page per tool (instrument face)
  bill.html             the Real Bill (printed receipt)
  channel.html          programme guide (kept from v1)
  about.html            magazine profile
  kit.html              starter kit (packing slip)
  404.html              terminal + dot globe
  styles.css            shared foundation (tokens + chrome + shared components)
  shared.js             device mounting + helpers (MC2.*)
  icons.js              the 14 dot-matrix icons (window.MCIcons)
  signature.js          the signature wave (window.MCSignature)
  data/prompts.mjs      the prompt library data (ESM, used by build.mjs + emitted index)
  data/prompts-index.js window.MC2DATA.promptIndex = [...] for client search [GENERATED]
  build.mjs             node build.mjs -> regenerates packs/ + prompts/ + prompts-index
  assets/               fonts/ (self-hosted), portrait.jpg, mark.svg, favicon.svg, signature-wave.png
```

## Shared head (copy exactly into every page, adjust title/description/paths)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PAGE TITLE · Michael's Corner</title>
<meta name="description" content="ONE PLAIN SENTENCE.">
<link rel="icon" href="assets/favicon.svg">
<link rel="preload" href="assets/fonts/clash-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="styles.css">
<style>/* page-scoped css here */</style>
</head>
<body>
```

From `packs/`, `prompts/`, `tools/` subfolders prefix shared paths with `../`.

## Shared chrome (exact markup; only data-nav stays literal)

Header:
```html
<header class="site-head">
  <div class="wrap">
    <div class="head-top">
      <span class="head-handle mono">@michaelflorian_ai</span>
      <a class="head-word no-fx" href="index.html"><img src="assets/mark.svg" alt="" class="head-mark">Michaels Corner</a>
      <a class="head-cta" href="kit.html" data-nav="kit">Free kit <span class="oa">&#8599;</span></a>
    </div>
    <nav class="head-nav" aria-label="Main">
      <a href="index.html" data-nav="home">Home</a>
      <a href="start.html" data-nav="start">Start here</a>
      <a href="library.html" data-nav="library">Library</a>
      <a href="tools.html" data-nav="tools">Tools</a>
      <a href="bill.html" data-nav="bill">The Real Bill</a>
      <a href="channel.html" data-nav="channel">Channel</a>
      <a href="about.html" data-nav="about">About</a>
    </nav>
  </div>
</header>
<main>
```

Footer (after `</main>`):
```html
<footer class="site-foot">
  <div class="wrap foot-grid">
    <div>
      <p class="foot-word">Michael&#8217;s Corner</p>
      <p class="foot-line">AI did not take my job. It made me faster.</p>
    </div>
    <div class="foot-col">
      <a href="library.html">Prompt library</a>
      <a href="tools.html">Tools</a>
      <a href="bill.html">The Real Bill</a>
    </div>
    <div class="foot-col">
      <a href="start.html">Start here</a>
      <a href="kit.html">The Starter Kit</a>
      <a href="about.html">About</a>
    </div>
    <div class="foot-meta mono">
      <span style="display:inline-flex;align-items:center;gap:8px;"><canvas data-dot="pulse" data-size="18" style="width:18px;height:18px;"></canvas> Updated 07/2026 · Prague</span>
    </div>
  </div>
</footer>
<script src="icons.js"></script>
<script src="signature.js"></script>
<script src="shared.js"></script>
<!-- page script here if needed -->
</body>
</html>
```

The handle is TEXT, not a link (no real social URLs exist yet; dead links are a persona dealbreaker). The Subscribe/CTA goes to kit.html, the only honest capture.

## Runtime contracts (shared.js gives you)

- `MC2.esc(s)`, `MC2.kc(n)` (formats `12 340 Kč`), `MC2.copy(text, btn, doneLabel)`
- `MC2.receipt({title, date, onInk, rows:[{k,v,big,orange}], verdict:{stamp,text,ink}})` -> receipt HTML string (classes already in styles.css)
- `MC2.waveWork(labelEl, resultEl, work, minMs)` — signature moment 5. Only around REAL computation.
- `MC2.wave(n, t)` -> one wave frame string; `MC2.reducedMotion`
- Dot icons: `<canvas data-dot="prompt" data-size="56" style="width:56px;height:56px;"></canvas>` mounts automatically. Icon keys: corner, prompt, tools, play, about, copy, search, subscribe, arrow, external, bar, receipt, globe, pulse.
- Signature wave element: `<span data-mc-signature data-chars="9"></span>` (state signal ONLY, never idle).
- Corner-bracket hover auto-tags every `button`/`a[href]`; add class `no-fx` to opt out.
- Active nav resolves from pathname automatically.

Styles.css already provides: tokens, header/footer, `.btn .btn-ghost .btn-orange .chip .backlink`, `.eyebrow .h-display .h-page .h-sec .h-item .lede .mono .data .small`, `.sec .sec-head`, `.receipt*`, `.honest-bar`, `.fx`, `.photo-frame .pc`, `.card`, `.grid-2 .grid-3 .row .spread .hairline .hairline-ink .updated .scroller`. Page-specific archetype CSS lives in each page's own `<style>` block.

## Hard laws (enforced at review)

1. DIRECTION.md section 6 forbidden list. Notables: no em dashes anywhere; no fake outputs, dead links or placeholder thumbs; perforation motif ONLY on bill.html and Real Bill embeds; wave = working state only; no fade-up-on-scroll; money never green; one accent.
2. Every page carries `Updated 07/2026` somewhere visible (footer covers it; detail pages also stamp their own).
3. All interactive elements keyboard-reachable; inputs have `<label>`s; `alt` on images; AA contrast.
4. Headlines under 8 words. Copy is B2 English per the content files, verbatim where provided.
5. `prefers-reduced-motion` resolves every animation to its final frame.

## Page assignments

Each builder owns whole files; nobody edits another builder's files. Shared files (styles.css, shared.js, icons.js, signature.js) are READ ONLY for builders; if a shared change is genuinely needed, note it in your final message instead of editing.

- **builder-home**: index.html (DIRECTION 3.1, content CONTENT-SITE.md section 1 + embeds: one mini Real Bill from CONTENT-SITE section 2, inline cost calculator per TOOLS.md tool 1 in compact form, 3 sample prompts from CONTENT-LIBRARY Top 10), about.html (3.9, CONTENT-SITE section 4).
- **builder-library**: data/prompts.mjs (transcribe ALL packs/prompts from CONTENT-LIBRARY.md verbatim), build.mjs, library.html (3.2), generated packs/*.html (3.3) + prompts/*.html (3.4) + data/prompts-index.js, start.html (guided path, 3.x editorial; content CONTENT-SITE section 5).
- **builder-tools**: tools.html (3.5), tools/<id>.html x7 (3.6, TOOLS.md specs implemented EXACTLY: formulas, rates tables, rule lists; localStorage-shared assumptions; hash-encoded state where specced).
- **builder-extra**: bill.html (3.7 + signature moment 1 print reveal; content CONTENT-SITE section 2 with [FILL] placeholders rendered as honest mono `to be filled` marks), kit.html (3.10; email = honest mailto capture to mihael.florian@gmail.com with subject "Starter Kit" + a plain line that a real list is coming; NO fake form submit), channel.html (3.8; port v1 layout + video titles from website/index.html lines 600-643, but NO dead hrefs: render rows without links + one honest mono line "Filming now. Links land as episodes publish."), 404.html (3.11; port the v1 404 globe canvas from website/404.html, restyle to spec).

## Verify before you finish

Render your pages headless and actually look at them:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --window-size=1400,1200 --virtual-time-budget=6000 --screenshot=/tmp/<name>.png --hide-scrollbars "file://<abs path to your page>"`
Fix what looks wrong before reporting. Also check the console: `--dump-dom` + grep for your key markers.
