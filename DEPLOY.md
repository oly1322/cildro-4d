# Cildro Plywood — 4D site

Immersive one-page dossier site. Vite + React + Tailwind, Three.js via
@react-three/fiber, GSAP ScrollTrigger + Lenis. Fully static output.

## Install

```bash
npm install
```

## Develop

```bash
npm run dev        # http://localhost:5173
```

## Build (static export)

```bash
npm run build      # emits dist/
npm run preview    # serve the production build locally
```

`dist/` is a plain static bundle — no server runtime needed.

## Deploy

**Vercel** — framework preset "Vite", build `npm run build`, output `dist`.

**Netlify** — build `npm run build`, publish directory `dist`.

**Cloudflare Pages** — build `npm run build`, output `dist`.

## Notes

- Copy source of truth: `src/content/copy.js` (verbatim from b2b.cildroplywood.ro;
  i18n-ready — add `de`/`ro` objects with the same shape).
- Asset provenance and missing-photo slots: `public/images/README.md`.
- `prefers-reduced-motion` and non-WebGL devices get a static, fully readable
  version automatically (no pins, no canvases, photo fallbacks).
- QA switch: append `?static=1` to any URL to force that static experience
  in a normal browser.
- Quote form is static-friendly: it opens a pre-filled `mailto:` to
  andrei.olaru@cildro.ro. Swap `onSubmit` in
  `src/components/sections/S09Quote.jsx` for a form endpoint when available.
