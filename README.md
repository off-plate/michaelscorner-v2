# Michael's Corner, website v2

Static multi-page site. Cream / ink / one orange accent, Clash Display + General Sans + Space Mono, self-hosted. No framework, no build step to serve (build.mjs only regenerates the prompt library pages).

Live: https://off-plate.github.io/michaelscorner-v2/

- `index.html` home (broadsheet), `about`, `start`, `library` + `packs/` + `prompts/`, `tools` + `tools/`, `bill`, `channel`, `kit`, `404`
- `styles.css` tokens + chrome + shared components; `shared.js` device mounting + helpers
- `icons.js` dot-matrix icons; `signature.js` signature wave; `photo.js` halftone portrait
- `data/prompts.mjs` the library source; `node build.mjs` regenerates packs/ + prompts/
- v1 stays live and untouched at off-plate.github.io/michaelscorner (tagged `v1`)
