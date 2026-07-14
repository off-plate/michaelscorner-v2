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
<meta property="og:type" content="website">
<meta property="og:site_name" content="Michael's Corner">
<meta property="og:title" content="${esc(title)} · Michael's Corner">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://off-plate.github.io/michaelscorner-v2/assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
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
/* ---- Library: a prominent prompt search + a clear grid of clickable pack cards. ---- */
.lib-top{ padding-block:clamp(28px,4vw,48px) 0; }
.lib-top .lede{ margin:14px 0 0; }

/* the search box: bordered, obvious, searches all prompts */
.lib-searchbox{ display:flex; align-items:center; gap:12px; border:1px solid var(--ink); border-radius:2px;
  padding:13px 16px; margin-top:clamp(24px,3vw,34px); max-width:600px; background:var(--cream); transition:border-color 150ms ease; }
.lib-searchbox:focus-within{ border-color:var(--orange); }
.lib-searchbox canvas{ display:block; flex:none; }
.lib-searchbox input{ flex:1; border:none; background:none; font-size:16px; padding:2px 0; color:var(--ink); }
.lib-searchbox input:focus, .lib-searchbox input:focus-visible{ outline:none; }

/* search results: a flat list of matching prompts */
.lib-results{ margin-top:clamp(26px,3vw,36px); }
.lib-results[hidden]{ display:none; }
.results-count{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.06em; color:var(--grey); margin:0 0 14px; }
.result-list{ list-style:none; margin:0; padding:0; border-top:1px solid var(--ink); }
.rlink{ display:grid; grid-template-columns:1fr auto; gap:4px 18px; align-items:center;
  border-bottom:1px solid var(--line); padding:15px 8px; text-decoration:none; color:var(--ink); transition:background 150ms ease; }
.rlink:hover, .rlink:focus-visible{ background:var(--cream-2); outline:none; }
.rlink .rt{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:18px; line-height:1.15; letter-spacing:-0.01em; grid-column:1; }
.rlink .rw{ grid-column:1; font-size:14px; line-height:1.45; color:var(--grey); margin-top:2px; }
.rlink .rpack{ grid-column:2; grid-row:1 / span 2; font-family:'Space Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--grey-2); white-space:nowrap; align-self:center; }
.rlink .rpack .oa{ color:var(--green); margin-left:8px; }

/* the pack grid: clear, clickable cards */
.lib-packs{ margin-top:clamp(30px,3.5vw,44px); }
.lib-packs[hidden]{ display:none; }
.lib-packs .ph{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:var(--grey); margin:0 0 16px; }
.pack-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr)); gap:16px; }
.pack-card{ border:1px solid var(--ink); border-radius:2px; padding:clamp(20px,2.2vw,26px);
  display:flex; flex-direction:column; gap:10px; text-decoration:none; color:var(--ink); background:none; transition:background 150ms ease; }
.pack-card:hover, .pack-card:focus-visible{ background:var(--cream-2); outline:none; }
.pc-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.pc-tag{ font-family:'Space Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--grey-2); }
.pc-n{ font-family:'Space Mono',ui-monospace,monospace; font-size:12px; color:var(--green); }
.pack-card h2{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:clamp(21px,2.2vw,25px); line-height:1.06; letter-spacing:-0.015em; margin:0; }
.pack-card p{ margin:0; font-size:14.5px; line-height:1.5; color:var(--ink-soft); flex:1; }
.pc-open{ font-family:'Space Mono',ui-monospace,monospace; font-size:13px; color:var(--ink); display:inline-flex; align-items:center; gap:8px; margin-top:4px; }
.pc-open .oa{ color:var(--green); }
.pack-card:hover .pc-open, .pack-card:focus-visible .pc-open{ color:var(--brick); }
.lib-empty{ padding:34px 8px; color:var(--grey); font-size:16px; }
.lib-empty[hidden]{ display:none; }
</style>`;

  const total = PACKS.reduce((n, p) => n + p.prompts.length, 0);

  const cards = PACKS.map((p) => `
      <a class="pack-card" href="packs/${esc(p.id)}.html">
        <div class="pc-top"><span class="pc-tag">${esc(p.chip)}</span><span class="pc-n">${p.prompts.length} prompts</span></div>
        <h2>${esc(p.name)}</h2>
        <p>${esc(p.blurb[0])} ${esc(p.blurb[1])}</p>
        <span class="pc-open">Open pack <span class="oa">&#8594;</span></span>
      </a>`).join("");

  const body = `
<div class="wrap lib-top">
  <p class="eyebrow">The prompt library</p>
  <h1 class="h-page">Steal these prompts</h1>
  <p class="lede">Eight packs, ${total} prompts, all free. Copy one, fill in the brackets, and paste it into ChatGPT, Claude, or Gemini. These are the ones I keep going back to, so take whatever helps.</p>

  <div class="lib-searchbox">
    <canvas data-dot="search" data-size="20" style="width:20px;height:20px;"></canvas>
    <input type="search" id="lib-q" placeholder="Search all ${total} prompts by name" autocomplete="off" aria-label="Search all prompts">
  </div>
</div>

<div class="wrap lib-results" id="lib-results" hidden aria-live="polite">
  <p class="results-count" id="results-count"></p>
  <ul class="result-list" id="result-list"></ul>
  <p class="lib-empty" id="lib-empty" hidden>No prompt matches that. Try a shorter or different word.</p>
</div>

<div class="wrap lib-packs" id="lib-packs">
  <p class="ph">${PACKS.length} packs, sorted by who they are for</p>
  <div class="pack-grid">
    ${cards}
  </div>
</div>

<section class="band band--green" id="lib-band" style="margin-top:clamp(48px,6vw,88px);">
  <div class="wrap">
    <p class="eyebrow">Free, all of it</p>
    <h2 class="h-sec">Take what helps<span class="orange">.</span></h2>
    <p class="lede" style="margin-top:12px; max-width:58ch;">Copy anything here, change the words, make it yours. If one prompt saves you an hour this week, that is the whole point.</p>
  </div>
</section>
`;

  const script = `
<script>
(function(){
  var input = document.getElementById('lib-q');
  var packs = document.getElementById('lib-packs');
  var results = document.getElementById('lib-results');
  var list = document.getElementById('result-list');
  var count = document.getElementById('results-count');
  var empty = document.getElementById('lib-empty');
  var IDX = (window.MC2DATA && MC2DATA.promptIndex) || [];
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function shortPack(n){ return n.replace(/^Best prompts for /,'').replace(/^Building software with AI$/,'Building'); }
  function render(raw){
    var q = raw.trim().toLowerCase();
    if(!q){ packs.hidden = false; results.hidden = true; list.innerHTML=''; return; }
    packs.hidden = true; results.hidden = false;
    var hits = IDX.filter(function(it){ return (it.title+' '+it.when+' '+it.packName).toLowerCase().indexOf(q) !== -1; });
    count.textContent = hits.length + (hits.length===1?' prompt matches ':' prompts match ') + '“' + raw.trim() + '”';
    if(!hits.length){ list.innerHTML=''; empty.hidden=false; return; }
    empty.hidden = true;
    list.innerHTML = hits.map(function(it){
      return '<a class="rlink" href="'+it.url+'"><span class="rt">'+esc(it.title)+'</span>'
        + '<span class="rw">'+esc(it.when)+'</span>'
        + '<span class="rpack">'+esc(shortPack(it.packName))+'<span class="oa">&#8594;</span></span></a>';
    }).join('');
  }
  if(input){ input.addEventListener('input', function(){ render(input.value); }); }
})();
</script>`;

  const html = head("Prompt library", "Eight packs of free, copy-ready prompts for ChatGPT, Claude, and Gemini.", prefix)
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
/* ---- Pack page: the opened dossier. Folder-tab header + ruled ledger, with an all-packs rail. ---- */
.dossier{ padding-block:clamp(28px,4vw,44px) 0; }
.d-back{ margin-bottom:clamp(20px,2.4vw,28px); }
.reading__rail .rail-here{ color:var(--orange); font-weight:600; }
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
.lrow .fno{ font-family:'Clash Display',sans-serif; font-weight:700; font-size:clamp(22px,2.4vw,30px); color:var(--ink); line-height:1; letter-spacing:-0.02em; }
.lrow .lt{ }
.lrow .lt h3{ font-family:'Clash Display',sans-serif; font-weight:600; font-size:clamp(18px,1.8vw,21px); line-height:1.15; letter-spacing:-0.01em; margin:0 0 4px; }
.lrow .lt p{ margin:0; font-size:14.5px; line-height:1.5; color:var(--grey); max-width:60ch; }
.lrow .open{ font-family:'Space Mono',monospace; font-size:20px; color:var(--ink); align-self:center; transition:color 150ms ease, transform 180ms var(--ease); }
.lrow:hover .open, .lrow:focus-visible .open{ color:var(--brick); transform:translateX(3px); }
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

  const packsNav = PACKS.map((p2, k) => k === i
    ? `<span class="rail-here">${esc(p2.name)}</span>`
    : `<a href="${esc(p2.id)}.html">${esc(p2.name)}</a>`).join("");

  const body = `
<div class="wrap dossier">
  <a class="backlink d-back" href="../library.html"><span aria-hidden="true">&#8592;</span> Back to all prompts</a>

  <div class="reading">
    <div class="reading__body">
      <div class="folder">
        <p class="folder-tab">PACK/${packNo(i)} &middot; ${esc(pack.chip)}</p>
        <div class="folder-body">
          <h1 class="h-page">${esc(pack.name)}</h1>
          <p class="folder-meta">${pack.prompts.length} prompts</p>
          <p class="folder-intro">${esc(pack.blurb[0])} ${esc(pack.blurb[1])}</p>
        </div>
      </div>

      <div class="ledger-list">
        ${rows}
      </div>
    </div>

    <aside class="reading__rail" aria-label="All packs">
      <div class="rail-block">
        <h3>All packs</h3>
        ${packsNav}
      </div>
    </aside>
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
/* ---- Prompt page: the spec sheet. Terminal specimen + Copy in the body, spec fields in the rail. ---- */
.spec{ padding-block:clamp(28px,4vw,44px) 0; }
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
.field{ border-bottom:1px solid var(--line); padding-block:clamp(16px,2vw,22px); display:grid; grid-template-columns:180px 1fr; gap:8px 28px; align-items:start; }
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

  <div class="reading">
    <div class="reading__body">
      <div class="spec-meta">
        <span><a class="link" href="../packs/${esc(pack.id)}.html">${esc(pack.chip)}</a></span>
        <span class="id">PROMPT/${packNo(packIndex)}.${promptNo(promptIndex)}</span>
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
          <button type="button" class="btn-orange copy-btn" id="copy-btn">
            <canvas data-dot="copy" data-size="18" data-tone="light" style="width:18px;height:18px;"></canvas>
            <span class="lbl">Copy prompt</span>
          </button>
          <span class="copy-stamp" id="copy-stamp" role="status" aria-live="polite"></span>
        </div>
      </div>
    </div>

    <aside class="reading__rail" aria-label="Prompt details">
      <div class="rail-block">
        <h3>What to fill in</h3>
        ${tokenList}
      </div>
      <div class="rail-block">
        <h3>The tip</h3>
        <p style="margin:0;">${esc(pr.tip)}</p>
      </div>
      <div class="rail-block">
        <h3>Works in</h3>
        <p style="margin:0;">ChatGPT / Claude / Gemini</p>
      </div>
      <div class="rail-block">
        <h3>This pack</h3>
        <a href="../packs/${esc(pack.id)}.html">${esc(pack.chip)}</a>
      </div>
    </aside>
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
