# Harshavardhan J — Portfolio

AWS Cloud × DevOps portfolio, originally built and exported from Framer, now
served through **Next.js 15 (App Router, TypeScript)**.

## Commands

```bash
npm run dev     # development server (next dev)
npm run build   # production build (next build)
npm start       # serve the production build (next start)
```

## Structure

```text
app/                      # App Router routes: /, /about, /contact, /resume, /textile, /maxxwell
  route.ts, */route.ts    # static route handlers serving each Framer page
  layout.tsx              # root shell (used by the not-found page)
  globals.css             # intentionally empty (all styles ship in the pages)
lib/
  framerPage.ts           # returns an original Framer-export page as HTML
public/
  assets/                 # project images (securelink.webp, error-explainer.webp, …)
  assets/case/            # real screenshots used by the case studies
  case-study/             # shared CSS + JS for the case-study pages
  _fr/                    # Framer runtime modules (React, motion, script_main, …)
index.html                # original Framer export — source of the / page
about/index.html          # source of /about
contact/index.html        # source of /contact
resume/index.html         # source of /resume
textile/index.html        # AURA case study (hand-written, not Framer) — /textile
maxxwell/index.html       # Maxxwell Logistics case study — /maxxwell
```

## How the conversion works

The site is a Framer static export: each `*.html` file embeds its own fonts,
styles, inline scripts and loads `/_fr/*` runtime modules, and the Formspree
contact form is wired inside those runtime modules. To preserve appearance,
animations and behaviour **exactly**, each `app/<route>/route.ts` returns the
original page document unchanged (`lib/framerPage.ts`), prerendered as a static
file at build time. The documents carry their own title/description/OG/Twitter
tags. They are deliberately not React page components: that wrapper sent every
page's markup twice (HTML + RSC payload) plus Next's client runtime, while the
Framer runtime already hydrates the page.

Navigation between routes is a normal document load, smoothed by a 200 ms
cross-document view-transition fade and hover prefetching (see the snippet at
the top of each document's `<head>`).

- Runtime modules keep their original absolute paths (`/_fr/...`) and project
  images (`/assets/...`) — both are served from `public/`.
- The contact form on `/contact` still submits through Formspree (unchanged).

## Notes

- The server-rendered HTML of the Framer sections is from the original
  template; the runtime renders the real content over it. Re-exporting the
  site from Framer would make the two match (better SEO, no hydration
  warnings).
- `demo 2/` (empty), `.claude/` and `.freebuff/` are workspace artifacts, not
  part of the site.
