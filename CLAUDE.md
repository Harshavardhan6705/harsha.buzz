# CLAUDE.md

Portfolio of Harshavardhan J (AWS Cloud × DevOps) — a Framer-exported static
site served through **Next.js 15 App Router + TypeScript**.

## Architecture

- `app/` — App Router routes: `/`, `/about`, `/contact`, `/resume`, each a
  `force-static` `route.ts` returning the original Framer-export document
  (`index.html`, `about/index.html`, `contact/index.html`, `resume/index.html`)
  via `lib/framerPage.ts`. The documents carry their own title/meta tags.
- Not React pages on purpose: a Server Component wrapper re-embedded the whole
  markup in the RSC payload (2× HTML) and shipped Next's client runtime for
  nothing — the Framer runtime hydrates the page itself. Client-side
  `next/link` navigation is therefore not available between these routes.
- Page transitions: the `<head>` of each document opts out of the Framer
  shutter (`<html data-no-trans>`), uses a 200 ms cross-document
  `@view-transition` fade, and prefetches the four routes on hover
  (speculation rules). Keep the four documents' snippets in sync.
- `/textile` (AURA) and `/maxxwell` are hand-written case-study documents
  (`textile/index.html`, `maxxwell/index.html`, no Framer runtime) sharing
  `public/case-study/case.css` + `case.js`. Their header is the portfolio's
  own header copied as static markup (`.mvhd` + `#mvhd-drawer`), styled by
  `public/case-study/header.css` (CSS taken from `script_main`'s header
  component) and driven by `case.js` (breakpoints 810/1100, hide on scroll,
  Menu drawer); it always uses the boxed glass state. If the home header's
  links or CSS change, update these copies too. Each is one screen (`.cs-one`):
  a "← Back to projects" link, "Project" kicker, title, description, "What I learned" icon tags, a divider
  and a large "Visit live website" button — no website screenshots (owner's
  request). The old two-slide deck code (`[data-deck]`) is still in
  `case.js`/`case.css` but unused. The screenshots in
  `public/assets/case/` only feed the home project cards. Like `_fr/` and
  `assets/`, `case-study/`, `assets/case/` and the favicons are mirrored at the
  repo root for the plain file server on :5500 — keep both copies in sync. `case.js` re-creates the site's motion layer: Lenis
  from `/_fr/lenis@1.1.NJQGRwQU.mjs` (same options), the `hxc-dot`/`hxc-ring`
  cursor, and `mv-btn` markup built from `.cs-btn`/`.cs-back` (magnetic pull,
  W × H readout). Copies of the Framer CSS/JS: keep them in sync. Their content is evidence-based: don't claim features
  work (auth, checkout, payments, form delivery) without verifying them.
- Projects 3–4 come from hidden `data-mv-row="projects"` rows in
  `#mv-case-rows` before `</body>` of all four documents (outside Framer's
  React root). The BZFy MvWork button uses a row's `data-f12` (label) and
  `data-f13` (href) when set, and `data-f11` adds a short card description.
  All projects' info is rendered in one grid cell (`.mvwk-lay`, only `.is-cur`
  visible) so the info area is as tall as the tallest project and every frame
  (01A–04A) gets the same picture size and spacing. All four rows carry a
  `data-f11` description (projects 1–2's are in the Framer markup rows).
  The head link-fix script's `INT` map turns `/work/textile|maxxwell` into the
  internal routes and forces a full navigation (Framer's router can't).
- Certificates link to their credentials (URLs from harsha.buzz). Home
  "The credits" list (MvKit `mvcr`): `data-mv-row="experience"` rows with
  `data-f5="award"`; `data-f12` = credential URL makes the row an `<a>`. Rows
  1–2 are in the Framer markup, the rest in `#mv-case-rows`. The home page shows
  only AWS, Oracle and DevOps Complete Course (owner's request); the other
  three rows exist only in about/resume/contact. Résumé timeline
  (TSOp `mvrs-tl`): hard-coded `[title, issuer, url]` list in the module.
- Page titles are just "Harshavardhan J" (HTML `<title>`/og/twitter in all six
  pages and the `title:` of the four Framer route modules). The link-preview
  image is `assets/og-image.jpg` (1200×630, the owner's mandala portrait from
  `about-portrait.webp` on a blurred copy of itself), referenced absolutely as
  `https://www.harsha.buzz/assets/og-image.jpg` from every page.
- `next.config.ts` sets short cache lifetimes for `/_fr/*` and `/assets/*`.
- `public/_fr/` and `public/assets/` — Framer runtime modules and images,
  served at their original absolute paths `/_fr/*` and `/assets/*`.
- The Formspree contact form and all animations live inside the Framer
  runtime; app code does not own them.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also the typecheck gate; no tests/linter)
- `npm start` — production server

## Rules

- Structure conversion only. Do not redesign, restyle, or rewrite content.
- Keep the original HTML sources in place — they are read at render time.
- Don't convert the Framer markup to React components or reorganize `public/`.
- Header look (owner's design): a dark rounded pill in every state, logo text
  "Harsha J" in orange (hard-coded in the header component instead of the
  CMS name), mono uppercase links, light pill "LET'S TALK" without the arrow
  chip. The `/* pill header (owner's design) */` CSS block lives in three
  places — the header CSS string in `script_main.*.mjs`, the pre-rendered
  header `<style>` in each of the four Framer pages (that copy is the one the
  page actually uses), and `public/case-study/header.css` — keep them equal.
  The bar uses the original see-through `--glass` (light/dark by section) and
  hides the "Open to opportunities" dot (`.mvhd-av`).
- A refresh always starts at the top: Framer's router `scrollRestoration` is
  off in `script_main.*.mjs`, and the first `<head>` script of all six pages
  sets `history.scrollRestoration="manual"` and, on reload, clears the
  `mv-nav-to` section jump and any hash.
- `script_main.*.mjs` never loads Framer's on-page editor bar
  (`EditorBar:void 0&&…`): it imported `https://framer.com/edit/init.mjs`,
  which tied the site to the Framer project and could reload the page.
- Header drop-in (`<style data-hx-drop>` + script, in `<head>` of all four
  documents): React replaces the server header while hydrating, which used to
  replay the animation 2–3 times; new `.mvhd-in` nodes get a delay counted
  from the first one, so it plays once. Keep it in `<head>` (first paint).
- `script_main.*.mjs` skips Framer's badge mount when
  `#__framer-badge-container` is absent (it threw React #405 on every page).
- The server-rendered markup inside `#main` is still the Framer template
  (e.g. "MARA VOSS", "Work I'm proud of"); the runtime replaces it, logging
  React #418 hydration warnings. Only a fresh Framer export fixes that.
  Exception: the header menu (`.mvhd-links`) and footer "Pages" list in the
  saved HTML were updated by hand to the real links, so the old template menu
  (Work/Writing) no longer flashes before hydration.
- `/_fr/*` is cached 10 minutes: after editing a runtime module, hard-reload
  to see the change.
