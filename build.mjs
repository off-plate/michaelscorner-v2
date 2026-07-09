/* Michael's Corner v2, library build script.
   Run: node build.mjs
   Reads data/prompts.mjs and writes, idempotently:
     library.html                 the card-catalog index (drawer rows)
     packs/<id>.html    x8         the opened dossier (ruled ledger)
     prompts/<id>.html  x64        the spec sheet (terminal specimen + copy)
     data/prompts-index.js         window.MC2DATA.promptIndex for client search
   Shared chrome is copied verbatim from SPEC.md. No em dashes. Relative paths only. */

import { PACKS, TOP10, UPDATED } from "./data/prompts.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));

/* ---------- helpers ---------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* pack file number, 1-based, zero padded: PACK/01 .. PACK/08 */
const packNo = (i) => String(i + 1).padStart(2, "0");
/* prompt file number within its pack, 1-based, zero padded */
const promptNo = (i) => String(i + 1).padStart(2, "0");

const findPack = (id) => PACKS.find((p) => p.prompts.some((x) => x.id === id));
const findPrompt = (id) => {
  for (const p of PACKS) { const x = p.prompts.find((q) => q.id === id); if (x) return { pack: p, prompt: x }; }
  return null;
};
/* list the [bracket] fill tokens in a prompt, de-duplicated, in order of first appearance */
function fillTokens(text) {
  const out = [], seen = new Set();
  const re = /\[([^\]]+)\]/g; let m;
  while ((m = re.exec(text))) { const t = m[1].trim(); if (!seen.has(t)) { seen.add(t); out.push(t); } }
  return out;
}

/* ---------- shared chrome (verbatim from SPEC, prefix = "" for root, "../" for subfolders) ---------- */
function head(title, desc, prefix) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Michael's Corner</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" href="${prefix}assets/favicon.svg">
<link rel="preload" href="${prefix}assets/fonts/clash-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/fonts/fonts.css">
<link rel="stylesheet" href="${prefix}styles.css">`;
}

function header(prefix) {
  return `<header class="site-head">
  <div class="wrap">
    <div class="head-top">
      <span class="head-handle mono">@michaelflorian_ai</span>
      <a class="head-word no-fx" href="${prefix}index.html"><img src="${prefix}assets/mark.svg" alt="" class="head-mark">Michaels Corner</a>
      <a class="head-cta" href="${prefix}kit.html" data-nav="kit">Free kit <span class="oa">&#8599;</span></a>
    </div>
    <nav class="head-nav" aria-label="Main">
      <a href="${prefix}index.html" data-nav="home">Home</a>
      <a href="${prefix}start.html" data-nav="start">Start here</a>
      <a href="${prefix}library.html" data-nav="library">Library</a>
      <a href="${prefix}tools.html" data-nav="tools">Tools</a>
      <a href="${prefix}bill.html" data-nav="bill">The Real Bill</a>
      <a href="${prefix}channel.html" data-nav="channel">Channel</a>
      <a href="${prefix}about.html" data-nav="about">About</a>
    </nav>
  </div>
</header>
<main>`;
}

function footer(prefix) {
  return `</main>
<footer class="site-foot">
  <div class="wrap foot-grid">
    <div>
      <p class="foot-word">Michael&#8217;s Corner</p>
      <p class="foot-line">AI did not take my job. It made me faster.</p>
    </div>
    <div class="foot-col">
      <a href="${prefix}library.html">Prompt library</a>
      <a href="${prefix}tools.html">Tools</a>
      <a href="${prefix}bill.html">The Real Bill</a>
    </div>
    <div class="foot-col">
      <a href="${prefix}start.html">Start here</a>
      <a href="${prefix}kit.html">The Starter Kit</a>
      <a href="${prefix}about.html">About</a>
    </div>
    <div class="foot-meta mono">
      <span style="display:inline-flex;align-items:center;gap:8px;"><canvas data-dot="pulse" data-size="18" style="width:18px;height:18px;"></canvas> Updated ${UPDATED} &middot; Prague</span>
    </div>
  </div>
</footer>
<script src="${prefix}icons.js"></script>
<script src="${prefix}signature.js"></script>
<script src="${prefix}data/prompts-index.js"></script>
<script src="${prefix}shared.js"></script>`;
}

/* ============================================================
   PAGE: library.html  (the card-catalog file system)
   ============================================================ */
function buildLibrary() {
  const prefix = "";
  const css = `
<style>
/* ---- Library: the card-catalog file system. Full-width drawer rows in a cabinet rail. ---- */
.lib-top{ padding:clamp(28px,4vw,48px) 0 0; }
.lib-mark{ display:block; margin:0 0 18px; }
.lib-lead{ display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.lib-lead .lede{ margin:14px 0 0; }
.lib-count{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.1em; color:var(--grey); white-space:nowrap; }

/* toolbar: search + role filters, one hairline strip */
.lib-bar{ margin-top:clamp(24px,3vw,36px); border-top:1px solid var(--ink); border-bottom:1px solid var(--ink); padding:14px 0; display:flex; align-items:center; justify-content:space-between; gap:16px 24px; flex-wrap:wrap; }
.lib-search{ display:flex; align-items:center; gap:10px; flex:1; min-width:240px; }
.lib-search label{ display:inline-flex; align-items:center; }
.lib-search canvas{ display:block; flex:none; }
.lib-search input{ flex:1; border:none; background:none; padding:8px 4px; font-size:16px; border-radius:0; }
.lib-search input:focus{ outline:none; }
.lib-search input:focus-visible{ outline:none; }
.lib-filters{ display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
.lib-filters .rl{ font-family:'Space Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--grey); margin-right:4px; }
.rolebtn{ background:none; border:none; font-family:'General Sans',sans-serif; font-size:14px; color:var(--grey); cursor:pointer; padding:4px 6px; border-bottom:2px solid transparent; transition:color 150ms ease, border-color 150ms ease; }
.rolebtn:hover{ color:var(--ink); }
.rolebtn.active{ color:var(--ink); border-bottom-color:var(--orange); }

/* the cabinet */
.cabinet{ border-top:1px solid var(--ink); }
.drawer{
  display:grid; grid-template-columns:1fr auto; gap:8px 24px; align-items:start;
  border-bottom:1px solid var(--ink); padding:clamp(22px,2.6vw,30px) clamp(4px,1vw,12px);
  text-decoration:none; color:var(--ink); position:relative;
  transition:transform 200ms var(--ease), background 150ms ease;
}
.drawer:hover, .drawer:focus-visible{ transform:translateY(-4px); background:var(--cream-2); outline:none; }
.drawer .tab{
  grid-column:1 / -1; display:inline-flex; align-items:center; width:max-content; gap:0;
  font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.12em; text-transform:uppercase;
  color:var(--grey); border-bottom:2px solid transparent; padding-bottom:4px; margin-bottom:10px;
  transition:color 150ms ease, border-color 150ms ease;
}
.drawer:hover .tab, .drawer:focus-visible .tab{ color:var(--ink); border-bottom-color:var(--orange); }
.drawer .d-body{ grid-column:1; grid-row:2; }
.drawer .d-name{ font-family:'Clash Display',sans-serif; font-weight:700; font-size:clamp(22px,2.6vw,30px); line-height:1.02; letter-spacing:-0.02em; margin:0 0 8px; }
.drawer .d-blurb{ margin:0; font-size:15.5px; line-height:1.55; color:var(--ink-soft); max-width:66ch; }
.drawer .d-blurb span{ display:block; }
.drawer .stamp{ grid-column:2; grid-row:2; font-family:'Space Mono',ui-monospace,monospace; font-size:12px; color:var(--grey-2); text-align:right; white-space:nowrap; padding-top:4px; transition:color 150ms ease; }
.drawer:hover .stamp, .drawer:focus-visible .stamp{ color:var(--ink); }
.drawer .arrow{ color:var(--orange); font-family:'Space Mono',monospace; }
.lib-empty{ padding:40px 8px; color:var(--grey); font-size:16px; display:none; }
@media (max-width:640px){
  .drawer{ grid-template-columns:1fr; }
  .drawer .d-body{ grid-column:1; grid-row:auto; }
  .drawer .stamp{ grid-column:1; grid-row:auto; text-align:left; }
}
@media (prefers-reduced-motion: reduce){ .drawer:hover, .drawer:focus-visible{ transform:none; } }
</style>`;

  const total = PACKS.reduce((n, p) => n + p.prompts.length, 0);

  let rows = "";
  PACKS.forEach((p, i) => {
    rows += `
    <a class="drawer" href="packs/${esc(p.id)}.html" data-role="${esc(p.id)}" data-search="${esc((p.name + " " + p.chip + " " + p.blurb.join(" ")).toLowerCase())}">
      <span class="tab">PACK/${packNo(i)} &middot; ${esc(p.chip)}</span>
      <div class="d-body">
        <h2 class="d-name">${esc(p.name)}</h2>
        <p class="d-blurb"><span>${esc(p.blurb[0])}</span><span>${esc(p.blurb[1])}</span></p>
      </div>
      <span class="stamp">${p.prompts.length} prompts &middot; updated ${esc(p.updated)} <span class="arrow">&#8594;</span></span>
    </a>`;
  });

  const roleBtns = PACKS.map((p) => `<button type="button" class="rolebtn" data-filter="${esc(p.id)}">${esc(p.chip)}</button>`).join("\n        ");

  const script = `
<script>
(function(){
  var input = document.getElementById('lib-q');
  var drawers = Array.prototype.slice.call(document.querySelectorAll('.drawer'));
  var empty = document.getElementById('lib-empty');
  var roleBtns = Array.prototype.slice.call(document.querySelectorAll('.rolebtn'));
  var role = 'all';
  function apply(){
    var q = (input.value || '').trim().toLowerCase();
    var shown = 0;
    drawers.forEach(function(d){
      var okRole = role === 'all' || d.getAttribute('data-role') === role;
      var okText = !q || d.getAttribute('data-search').indexOf(q) !== -1;
      // also search individual prompt titles via the shared index
      if (okRole && !okText && q && window.MC2DATA && MC2DATA.promptIndex){
        okText = MC2DATA.promptIndex.some(function(it){
          return it.pack === d.getAttribute('data-role') && (it.title.toLowerCase().indexOf(q) !== -1 || it.when.toLowerCase().indexOf(q) !== -1);
        });
      }
      var on = okRole && okText;
      d.style.display = on ? '' : 'none';
      if (on) shown++;
    });
    empty.style.display = shown ? 'none' : 'block';
  }
  if (input) input.addEventListener('input', apply);
  roleBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var f = b.getAttribute('data-filter');
      if (role === f){ role = 'all'; b.classList.remove('active'); }
      else { role = f; roleBtns.forEach(function(x){ x.classList.remove('active'); }); b.classList.add('active'); }
      apply();
    });
  });
})();
</script>`;

  const body = `
<div class="wrap lib-top">
  <canvas class="lib-mark" data-dot="prompt" data-size="52" style="width:52px;height:52px;"></canvas>
  <p class="eyebrow">The prompt library</p>
  <div class="lib-lead">
    <div>
      <h1 class="h-page">Steal these prompts</h1>
      <p class="lede">Eight folders, ${total} prompts, all free. Copy one, fill the brackets, paste it into ChatGPT, Claude, or Gemini. Every one is written to be used, not admired.</p>
    </div>
    <span class="lib-count">${PACKS.length} packs &middot; ${total} prompts &middot; updated ${esc(UPDATED)}</span>
  </div>

  <div class="lib-bar">
    <div class="lib-search">
      <label for="lib-q"><canvas data-dot="search" data-size="20" style="width:20px;height:20px;"></canvas><span class="sr-only">Search prompts</span></label>
      <input type="search" id="lib-q" placeholder="Search prompts" autocomplete="off" aria-label="Search prompts">
    </div>
    <div class="lib-filters" role="group" aria-label="Filter by role">
      <span class="rl">Filter</span>
      ${roleBtns}
    </div>
  </div>
</div>

<nav class="wrap cabinet" aria-label="Prompt packs">
  ${rows}
  <p class="lib-empty" id="lib-empty">No prompts match that. Try a shorter word or another folder.</p>
</nav>
`;

  const html = head("Prompt library", "Eight folders of free, copy-ready prompts for ChatGPT, Claude, and Gemini.", prefix)
    + `\n<style>.sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }</style>`
    + css + "\n</head>\n<body>\n"
    + header(prefix) + "\n" + body + "\n" + footer(prefix) + script + "\n</body>\n</html>\n";

  writeFileSync(join(ROOT, "library.html"), html);
  return total;
}

/* ============================================================
   PAGE: packs/<id>.html  (the opened dossier)
   ============================================================ */
function buildPack(pack, i) {
  const prefix = "../";
  const css = `
<style>
/* ---- Pack page: the opened dossier. Folder-tab header, then a ruled ledger of prompts. ---- */
.dossier{ max-width:900px; padding:clamp(28px,4vw,48px) 0 0; }
.d-back{ margin-bottom:clamp(20px,2.4vw,28px); }
.folder{ border:1px solid var(--ink); border-radius:2px; }
.folder-tab{
  display:inline-flex; align-items:center; gap:10px; background:var(--ink); color:var(--cream);
  font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.14em; text-transform:uppercase;
  padding:8px 16px; border-radius:2px 2px 0 0; margin:0; position:relative; top:1px;
}
.folder-body{ padding:clamp(22px,3vw,34px); }
.folder-body .h-page{ margin:0 0 6px; }
.folder-meta{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; color:var(--grey); margin:0 0 18px; }
.folder-intro{ font-size:16.5px; line-height:1.6; color:var(--ink-soft); max-width:64ch; margin:0 0 20px; }
.cover-note{ font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; letter-spacing:0.02em; color:var(--grey); margin:12px 0 8px; }
.cover-note .on{ color:var(--ink); }
.cover-note .rest{ color:var(--grey-2); }

/* the ledger of prompts */
.ledger-list{ margin-top:clamp(28px,3.5vw,40px); border-top:1px solid var(--ink); }
.lrow{
  display:grid; grid-template-columns:auto 1fr auto; gap:4px 20px; align-items:baseline;
  border-bottom:1px solid var(--line); padding:clamp(16px,2vw,22px) clamp(4px,1vw,10px);
  text-decoration:none; color:var(--ink); transition:background 150ms ease;
}
.lrow:hover, .lrow:focus-visible{ background:var(--cream-2); outline:none; }
.lrow .fno{ font-family:'Clash Display',sans-serif; font-weight:700; font-size:clamp(22px,2.4vw,30px); color:var(--orange); line-height:1; letter-spacing:-0.02em; }
.lrow .lt{ }
.lrow .lt h3{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:clamp(18px,1.8vw,21px); line-height:1.15; letter-spacing:-0.01em; margin:0 0 4px; }
.lrow .lt p{ margin:0; font-size:14.5px; line-height:1.5; color:var(--grey); max-width:60ch; }
.lrow .open{ font-family:'Space Mono',monospace; font-size:20px; color:var(--ink); align-self:center; transition:color 150ms ease, transform 180ms var(--ease); }
.lrow:hover .open, .lrow:focus-visible .open{ color:var(--orange); transform:translateX(3px); }
@media (max-width:560px){ .lrow{ grid-template-columns:auto 1fr; } .lrow .open{ display:none; } }
@media (prefers-reduced-motion: reduce){ .lrow:hover .open, .lrow:focus-visible .open{ transform:none; } }
</style>`;

  // coverage note as a factual mono line: what the pack covers, what stays on you.
  const coverText = {
    beginners: ["It gets you moving on real tasks from day one.", "It does not make you good at prompting. Repetition does that."],
    writing: ["It cuts filler and keeps your voice on the page.", "It does not decide what you actually mean. That stays yours."],
    building: ["It plans, briefs, and unblocks the build.", "It does not test your product with real users. You do."],
    founders: ["It drafts the messages and reads the numbers.", "It never decides. You send, you set the price, you own the call."],
    freelancers: ["It handles the briefs, proposals, and chasing.", "It does not win you the trust. Your work and your word do."],
    office: ["It clears the inbox, meetings, and reports faster.", "It does not know your office politics. Read before you send."],
    creators: ["It repurposes and scripts from your own material.", "It cannot fake your taste. The judgement stays yours."],
    students: ["It quizzes you and questions you until it sticks.", "It must not write the answers. That is the whole point."]
  }[pack.id] || ["It does the draft.", "The judgement stays yours."];

  let rows = "";
  pack.prompts.forEach((pr, j) => {
    rows += `
    <a class="lrow" href="../prompts/${esc(pr.id)}.html">
      <span class="fno">${promptNo(j)}</span>
      <span class="lt">
        <h3>${esc(pr.title)}</h3>
        <p>${esc(pr.when)}</p>
      </span>
      <span class="open" aria-hidden="true">&#8594;</span>
    </a>`;
  });

  const body = `
<div class="wrap dossier">
  <a class="backlink d-back" href="../library.html"><span aria-hidden="true">&#8592;</span> Back to all prompts</a>

  <div class="folder">
    <p class="folder-tab">PACK/${packNo(i)} &middot; ${esc(pack.chip)}</p>
    <div class="folder-body">
      <h1 class="h-page">${esc(pack.name)}</h1>
      <p class="folder-meta">${pack.prompts.length} prompts &middot; updated ${esc(pack.updated)}</p>
      <p class="folder-intro">${esc(pack.blurb[0])} ${esc(pack.blurb[1])}</p>

      <p class="cover-note">What this pack does, honestly:</p>
      <div class="honest-bar" style="max-width:340px;" aria-hidden="true"><span class="fill" style="width:80%"></span><span class="rest"></span></div>
      <p class="cover-note"><span class="on">${esc(coverText[0])}</span> <span class="rest">${esc(coverText[1])}</span></p>
    </div>
  </div>

  <div class="ledger-list">
    ${rows}
  </div>
</div>
`;

  const html = head(pack.name, pack.blurb[0], prefix)
    + css + "\n</head>\n<body>\n"
    + header(prefix) + "\n" + body + "\n" + footer(prefix) + "\n</body>\n</html>\n";

  writeFileSync(join(ROOT, "packs", `${pack.id}.html`), html);
}

/* ============================================================
   PAGE: prompts/<id>.html  (the spec sheet)
   ============================================================ */
function buildPrompt(pack, packIndex, pr, promptIndex) {
  const prefix = "../";
  const css = `
<style>
/* ---- Prompt page: the spec sheet. Mono header, ink terminal specimen, one Copy button. ---- */
.spec{ max-width:820px; padding:clamp(28px,4vw,48px) 0 0; }
.spec-back{ margin-bottom:clamp(20px,2.4vw,28px); }
.spec-meta{ display:flex; gap:8px 20px; flex-wrap:wrap; font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--grey); border-bottom:1px solid var(--ink); padding-bottom:12px; margin-bottom:clamp(18px,2.2vw,26px); }
.spec-meta .id{ color:var(--ink); font-weight:700; }
.spec h1{ margin:0 0 8px; }
.spec-when{ font-size:16.5px; line-height:1.6; color:var(--ink-soft); max-width:60ch; margin:0 0 clamp(22px,3vw,32px); }

/* the terminal specimen */
.term{ background:var(--ink); color:var(--ink-text); border:1px solid var(--ink); border-radius:2px; overflow:hidden; }
.term-bar{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:11px 16px; border-bottom:1px solid #34302a; font-family:'Space Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:#b9b2a4; }
.term-bar .dot{ display:inline-flex; align-items:center; gap:8px; }
.term-body{ padding:clamp(16px,2.4vw,24px); font-family:'Space Mono',ui-monospace,Menlo,monospace; font-size:13.5px; line-height:1.7; white-space:pre-wrap; word-break:break-word; margin:0; color:var(--ink-text); }
.term-body .cur{ display:inline-block; width:0.62em; height:1.05em; background:var(--orange); vertical-align:-0.16em; margin-left:2px; animation:mc-cur 1s steps(1) infinite; }
@keyframes mc-cur{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
.spec-body.selected .term-body{ background:transparent; }
.spec-body.selected .term-body .selwrap{ background:var(--orange); color:var(--cream); }

/* copy control */
.copyrow{ display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:16px; }
.copy-btn{ display:inline-flex; align-items:center; gap:10px; }
.copy-btn canvas{ display:block; }
.copy-stamp{ font-family:'Space Mono',ui-monospace,monospace; font-size:12.5px; color:var(--grey); min-height:1.2em; }
.copy-stamp .on{ color:var(--ink); }

/* spec fields */
.fields{ margin-top:clamp(30px,4vw,44px); border-top:1px solid var(--ink); }
.field{ border-bottom:1px solid var(--line); padding:clamp(16px,2vw,22px) 0; display:grid; grid-template-columns:180px 1fr; gap:8px 28px; align-items:start; }
.field .fl{ font-family:'Space Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--grey); padding-top:3px; }
.field .fv{ font-size:15.5px; line-height:1.6; color:var(--ink); }
.tokens{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
.tokens li{ font-family:'Space Mono',ui-monospace,monospace; font-size:13.5px; color:var(--ink); }
.tokens .tk{ color:var(--orange); }
.tokens .none{ color:var(--grey); font-family:'General Sans',sans-serif; }
.works{ display:inline-flex; gap:8px; flex-wrap:wrap; font-family:'Space Mono',monospace; font-size:13.5px; }
@media (max-width:560px){ .field{ grid-template-columns:1fr; gap:6px; } }
</style>`;

  const tokens = fillTokens(pr.prompt);
  // Split prompt text into HTML with a wrappable span for the selection sweep.
  const specimenHTML = `<span class="selwrap">${esc(pr.prompt)}</span><span class="cur" aria-hidden="true"></span>`;

  const tokenList = tokens.length
    ? `<ul class="tokens">` + tokens.map((t) => `<li><span class="tk">[</span>${esc(t)}<span class="tk">]</span></li>`).join("") + `</ul>`
    : `<span class="tokens none">Nothing to fill in. Copy and go.</span>`;

  const body = `
<div class="wrap spec">
  <a class="backlink spec-back" href="../library.html"><span aria-hidden="true">&#8592;</span> Back to all prompts</a>

  <div class="spec-meta">
    <span><a href="../packs/${esc(pack.id)}.html" style="text-decoration:none;color:inherit;">${esc(pack.chip)}</a></span>
    <span class="id">PROMPT/${packNo(packIndex)}.${promptNo(promptIndex)}</span>
    <span>updated ${esc(pack.updated)}</span>
  </div>

  <h1 class="h-page">${esc(pr.title)}</h1>
  <p class="spec-when">${esc(pr.when)}</p>

  <div class="spec-body" id="spec-body">
    <div class="term">
      <div class="term-bar">
        <span class="dot"><canvas data-dot="prompt" data-size="16" style="width:16px;height:16px;"></canvas> The prompt</span>
        <span>copy target</span>
      </div>
      <pre class="term-body" id="specimen">${specimenHTML}</pre>
    </div>

    <div class="copyrow">
      <button type="button" class="btn copy-btn" id="copy-btn">
        <canvas data-dot="copy" data-size="18" style="width:18px;height:18px;"></canvas>
        <span class="lbl">Copy prompt</span>
      </button>
      <span class="copy-stamp" id="copy-stamp" role="status" aria-live="polite"></span>
    </div>
  </div>

  <div class="fields">
    <div class="field">
      <span class="fl">What to fill in</span>
      <div class="fv">${tokenList}</div>
    </div>
    <div class="field">
      <span class="fl">When I use it</span>
      <div class="fv">${esc(pr.when)}</div>
    </div>
    <div class="field">
      <span class="fl">The tip</span>
      <div class="fv">${esc(pr.tip)}</div>
    </div>
    <div class="field">
      <span class="fl">Works in</span>
      <div class="fv"><span class="works">ChatGPT / Claude / Gemini</span></div>
    </div>
  </div>
</div>
`;

  // Inline script: copy the raw prompt only, sweep the selection, stamp the time.
  const rawJson = JSON.stringify(pr.prompt);
  const script = `
<script>
(function(){
  var RAW = ${rawJson};
  var btn = document.getElementById('copy-btn');
  var lbl = btn.querySelector('.lbl');
  var stamp = document.getElementById('copy-stamp');
  var specBody = document.getElementById('spec-body');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function pad(n){ return (n<10?'0':'')+n; }
  function fallback(){
    try{ var ta=document.createElement('textarea'); ta.value=RAW; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); return true;
    }catch(e){ return false; }
  }
  btn.addEventListener('click', function(){
    var ok = false;
    try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(RAW).catch(fallback); ok = true; } }catch(e){}
    if(!ok) ok = fallback();
    if(!ok){ lbl.textContent = 'Select and copy manually'; return; }
    // signature moment 2: the prompt selects itself
    specBody.classList.add('selected');
    if(reduce){ setTimeout(function(){ specBody.classList.remove('selected'); }, 700); }
    else { setTimeout(function(){ specBody.classList.remove('selected'); }, 700); }
    lbl.textContent = 'Copied';
    if(window.MC2 && MC2.mountDevices){ /* icon morph handled by copy dot-icon click state if present */ }
    var d = new Date();
    stamp.innerHTML = '<span class="on">copied ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</span> &middot; works in ChatGPT / Claude / Gemini';
    setTimeout(function(){ lbl.textContent = 'Copy prompt'; }, 1800);
  });
})();
</script>`;

  const html = head(pr.title, pr.when, prefix)
    + css + "\n</head>\n<body>\n"
    + header(prefix) + "\n" + body + "\n" + footer(prefix) + script + "\n</body>\n</html>\n";

  writeFileSync(join(ROOT, "prompts", `${pr.id}.html`), html);
}

/* ============================================================
   DATA: data/prompts-index.js  (client search index)
   ============================================================ */
function buildIndex() {
  const index = [];
  PACKS.forEach((p, i) => {
    p.prompts.forEach((pr) => {
      index.push({
        id: pr.id,
        title: pr.title,
        when: pr.when,
        pack: p.id,
        packName: p.name,
        url: `prompts/${pr.id}.html`
      });
    });
  });
  const js = `/* GENERATED by build.mjs. Client search index for the prompt library. Do not edit by hand. */
window.MC2DATA = window.MC2DATA || {};
window.MC2DATA.promptIndex = ${JSON.stringify(index, null, 0)};
`;
  writeFileSync(join(ROOT, "data", "prompts-index.js"), js);
  return index.length;
}

/* ============================================================
   RUN
   ============================================================ */
function run() {
  mkdirSync(join(ROOT, "packs"), { recursive: true });
  mkdirSync(join(ROOT, "prompts"), { recursive: true });
  mkdirSync(join(ROOT, "data"), { recursive: true });

  const total = buildLibrary();
  PACKS.forEach((p, i) => buildPack(p, i));
  PACKS.forEach((p, i) => p.prompts.forEach((pr, j) => buildPrompt(p, i, pr, j)));
  const n = buildIndex();

  console.log(`library.html written`);
  console.log(`packs/  written: ${PACKS.length}`);
  console.log(`prompts/ written: ${total}`);
  console.log(`data/prompts-index.js written: ${n} entries`);
}

run();
