# Michael's Corner — Design System

The single source of truth for how this site is built. Derived from the Brand Canvas V2, the
workspace `DESIGN.md` anti-slop manual, and researched best practice (Stripe, Linear, Family.co,
Emil Kowalski / animations.dev). If a page disagrees with this file, the page is wrong.

Maxim: **orange acts, green speaks, everything else is surface.**

---

## 1. Colour — roles, not a swatch pile

| Role | Token | Job | Share of page |
|---|---|---|---|
| Neutral / surface | `--cream #FAF7F2` (+ `--sage #EFE5C8` tint, `--deep-green #183A32` band) | page + most section backgrounds | ~60% |
| Primary structure + text | `--ink #15130F` | body, headings, hairlines, borders | part of the 30% |
| **Secondary (the voice)** | `--green #1E5244` / `--deep-green #183A32` | full section bands, eyebrows/labels, pull-quotes, footer, numbered markers | part of the 30% |
| Accent-1 (action) | `--orange #F2541B` (on dark: `--soft #F08A4B`) | the ONE CTA per screen, active/selected, money numbers | ~10% |
| Accent-2 (hover) | `--brick #B23708` | every link + nav hover | trace |

**The fix for "barely any green":** green is a SECONDARY, not an accent. A secondary carries the
structural 30% as *surface and structure*, not as a lone button. Green must appear in **at least three
distinct roles on every page**: (1) a full deep-green band, (2) labels/eyebrows/markers, (3) one
pull-quote or large-type voice moment. If green shows up in fewer than 3 places, it is under-used.

**Money numbers stay orange** on this site (brand canvas assigns orange to money). Never green.

**Section cadence** (rhythm without a rainbow): mostly cream; `--sage` as a *quiet* break between two
light sections; exactly **one** deep-green band in the body (footer doesn't count) as the loud moment.
Never two same-coloured sections adjacent; never three colored sections in a row. On deep-green, the
only accent is `--soft` (orange `#F2541B` goes muddy on green).

---

## 2. Layout — ONE shell, nested measure

- `--shell: 1200px` — the single outer content max-width. Every page. No page sets its own width.
- `--measure: 68ch` — reading line-length, applied as a **nested** constraint on prose, never as a page width.
- `--rail: 290px` — meta side-rail on reading pages.
- `--gutter` (= `--pad`) — one responsive side padding, identical on every page.
- `--section-pad` — one section-to-section vertical value, every section, every page.

**The fix for "different widths / squished / empty Real Bill":** a reading page (Bill, prompt, Start)
never centers a narrow column in dead space. It fills the shell with an **asymmetric grid**: body at
`--measure` + a **sticky meta rail** (`.reading` / `.reading__body` / `.reading__rail`). The leftover
space becomes a summary/nav rail, used on purpose. Full-bleed is only for hero/band/footer backgrounds.

---

## 3. Buttons & links — four ranks, one grammar

**Fills darken. Outlines fill. Links underline + shift colour. Non-clickable text does nothing.**

| Rank | Class | Default | Hover |
|---|---|---|---|
| Primary (one commit per view) | `.btn-orange` | orange fill, cream text | fill darkens to brick |
| Secondary | `.btn-ghost` | green outline, green text | fills green, text cream |
| Dark primary | `.btn` | ink fill | darkens to ink-2 |
| Tertiary text-link | `.link` / prose `a` | ink text, underline | brick + underline |
| Non-clickable | (none) | plain body/muted text | nothing — no border, no pointer, no hover |

Hard rules: one primary per view; never a bare text-link shoulder-to-shoulder with a filled button
(pair fill + outline instead); `→` for internal "leads", `↗` for external/new-tab; chevron only for
disclosure. Every clickable thing has a visible `:focus-visible` ring. Difference is shape (fill vs
outline vs underline), not only hue.

---

## 4. Typography — three faces, strict roles

- **Clash Display** — display headings + wordmark. One orange full-stop accent per big headline, max.
- **General Sans** — all body copy and most UI text. This carries the page.
- **Space Mono** — DATA ONLY: receipts, numbers, code/prompt specimens, small eyebrows/labels. It was
  over-used (45x); mono is a seasoning, not a body voice. Cut it back so the page reads as 1 body voice
  + display + rare mono, not "four fonts fighting".

Scale 1.25–1.5, two weights max per face, real cuts (no faux italic/bold).

---

## 5. Motion — restore it, with restraint

Permitted (the whole list): (1) a **brand loader** once per visit — the signature wave — then out;
(2) a **first-paint entrance**, once, 8–16px translate + opacity, staggered 40–60ms across 2–4 hero
elements; (3) **one signature micro-interaction** (the dot-matrix globe; the nav/pill gesture);
(4) hover/press feedback (150–250ms; `scale(0.97)` on `:active`).

Rules: animate **only `transform`/`opacity`** (+ optional `blur`); **two easing curves total**
(`--ease` for entrances, one exit curve); micro 150–250ms, entrances <300ms, loader/signature ~0.8s
once. No fade-up on every section, no counters, no magnetic buttons, no library for a fade. Under
`prefers-reduced-motion`, everything falls to a static final frame (globe shown not spinning, no loader).

---

## The 10-point design checklist (run on EVERY page before shipping)

1. **One shell.** Outermost content wrapper is the shared shell at `--shell`; the page defines no width of its own.
2. **Measure nested.** Any narrow text is `--measure` on a child prose block; no reading page is a lonely centered column in dead space (leftover width is a sticky rail, sidenotes, or a full-bleed band).
3. **Spacing on scale.** Every vertical gap is a `--space-*`/`--section-pad` token; sections breathe identically to every other page.
4. **Green is present in ≥3 roles** (band + labels + quote), never just a button; the page squints to 60 cream / 30 ink+green / 10 orange.
5. **Section cadence legal.** Exactly one deep-green body band; no two same-coloured sections adjacent; no three colored in a row; `--soft` (not orange) accents on dark.
6. **One orange CTA per view.** Orange only on the commit action, active state, and money; nowhere decorative.
7. **Affordance is honest.** Everything with a border/fill/pointer/hover is actually clickable; every label/caption is plain text. No fake buttons; no bare link competing beside a filled button.
8. **Button grammar holds.** Each interactive element does exactly one of fill-darkens / outline-fills / link-underlines-shifts; `→` internal, `↗` external.
9. **Type discipline.** One body voice (General Sans) + display (Clash) + rare mono (data only, not paragraphs/labels-everywhere); ≤2 weights per face.
10. **Motion + focus.** A brand loader/entrance and exactly one signature gesture exist; only transform/opacity animate, <300ms, two curves; every clickable has a `:focus-visible` ring; `prefers-reduced-motion` leaves the page fully usable with no movement.
