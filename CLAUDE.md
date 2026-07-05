# Cildro 4D — immersive marketing site for Cildro Plywood

One-page scroll-driven "4D" dossier site for Cildro Plywood (Romanian beech
plywood mill). Owner: Andrei Olaru (andrei.olaru@cildro.ro, WhatsApp
+40 758 109 297). Design DNA: cula.tech / matcha-cartel.com / ferrstudio.ch.

## Hard rules

- **All copy, numbers, claims and product names are verbatim from
  https://b2b.cildroplywood.ro** and live only in `src/content/copy.js`
  (i18n-ready; en only so far). Never invent or edit a number/claim.
  Exceptions marked in copy.js comments: glue/film options were supplied
  directly by the owner in chat.
- Photoreal only — no fake-looking CG wood. Owner supplies texture masters
  (see `public/images/README.md` for the full provenance map).
- Palette: espresso `#17120D`, bone `#F4EFE6`, safety-orange `#FF5D1D`,
  WhatsApp green only on WhatsApp buttons. Type: Anton / Archivo / IBM Plex
  Mono (fontsource, self-hosted).

## Stack & commands

Vite + React 18 + Tailwind v3, three.js via @react-three/fiber v8 + drei,
GSAP ScrollTrigger + Lenis. Fully static output.

- `npm run dev` → localhost:5173 (launch config "cildro-4d" in
  `~/Downloads/.claude/launch.json`; the owner views the site here)
- `npm run build` → `dist/` (deploy-ready; owner chose **local only** for
  now — do not deploy without asking)

## Architecture — the 4D experience

Sections 01–05 share ONE persistent R3F scene
([src/components/Experience.jsx](src/components/Experience.jsx)) behind
transparent DOM overlays; the canvas is `sticky` inside the wrapper in
App.jsx. A master ScrollTrigger writes global progress into the mutable
store [src/lib/xp.js](src/lib/xp.js) (`xp.p`, phase `ranges` measured from
the DOM, plus UI selections `grade/glue/filmColor/filmWeight`). The scene
reads it every frame — no React re-renders on the hot path.

Story beats (one 9-veneer panel throughout):
1. **hero** — panel stands vertical in portrait facing camera (Q_STAND
   quaternion slerp), tips down into beauty pose. Copy overlay fades.
2. **surface** — top-down face inspection; grade picker (E/I–IV) hot-swaps
   the face texture. Past this section the panel auto-reverts to grade E.
3. **material** — explodes into thin veneers (long/cross grain alternating)
   with glue films between; phenolic/melamine toggle recolors them.
   Glue films are wet roller-spread coatings, not flat sheets: one neutral
   procedural spread map (`makeGlueSpreadMaps` in three-utils — streaks +
   stipple + coverage blotches, doubles as bump/roughness, MirroredRepeat)
   tinted live via `GLUE_COLORS` (colors are set brighter than target —
   the map is ~0.7 luma). Coverage is FULL to the ply edge (owner: glue
   always reaches the very end; no alpha border). Films sit ON the veneer
   face below (`+VT/2`), never mid-gap (mid-gap read as a shadow — owner
   feedback). Phenolic = glossier (roughness 0.3), melamine = satin and
   slightly translucent (opacity ×0.85) so grain ghosts through.
4. **shield** — reassembles, matte anti-slip film descends (color/weight
   toggles). Section has a non-pinned tail (product trio) — scene beats must
   finish by ~0.65 of the phase range (see comment in Experience.jsx).
5. **impact** — panel becomes the beech specimen; birch/softwood slide in;
   steel balls drop with real vertex-displacement craters (`displaceTop`,
   `DAMAGE` table) + feathered photo decals; |sin| decaying rebounds.

Sections 06–09 are normal DOM (grain flashlight, applications/network,
process/specs/FAQ, quote form → mailto). Static fallback for
reduced-motion/no-WebGL; force it with `?static=1`.

Tunables at the top of Experience.jsx: `POSES` (camera per phase, holds then
transitions in last 25% via `t = s(local, 0.75, 1)`), `HERO_FRONTAL/BEAUTY`,
`DAMAGE` (crater depth/radius/rim per material), `VT/GAP/PLIES`.

## Mobile (portrait) experience — July 2026 pass

Portrait (`camera.aspect < 0.9`) is a first-class framing, not a scaled-down
desktop. All branching lives in Experience.jsx's useFrame:

- Each POSES entry has optional `posM`/`lookM`/`rotYM` portrait framings
  (+ `HERO_FRONTAL_M/BEAUTY_M`), tuned at 375×812. Portrait fov 34,
  landscape 30; landscape keeps the old `ds` distance compensation (cap
  now 1.65 — the 2.9 leg is dead since portrait takes over below 0.9).
- Portrait shield film lands EARLY (`s(shield, 0.1, 0.36)` vs desktop
  0.24–0.58) — owner: it must be settled while the color/weight toggles
  are still pinned on screen, not arrive as the section scrolls away.
- **The board turns 90° in portrait** (`rotYM: π/2` on surface + shield)
  so its long axis runs down the 9:16 screen: surface = near-top-down
  full-face grade inspection (owner: must see whole board, esp. low
  grades), shield = face receding up-screen with the film landing on it.
  Material keeps horizontal slats but explodes wider (`GAP_M` 0.2 vs 0.12)
  with a lower frontal camera so the 9-veneer tower fills the height.
  Pose rotation reads go through `rotOf(pose)` — keep new uses on it.
- **Impact trio runs along Z in portrait** (`LANE_M`, specimens stacked
  down the tall screen, camera near-top-down `[0,5,3]` look `[0,0,0.32]`)
  vs X on desktop (`LANE`). Specimen/ball/dent lane coords are set per-frame
  via `laneX/laneZ(i)`; the panel parks at `-lane` on the active axis and
  z is reset in the non-impact pose branches (don't remove those resets).
- Parallax: touchmove feeds the same `mouse` ref; deviceorientation only
  where no permission prompt is needed (Android — iOS 13+ requestPermission
  is deliberately not called).
- Perf: phones (`wantsLightAssets()` = max-width 820px) load the ~1 MB
  `/images/m/` texture set (vs 5.6 MB masters) via `src/lib/textures.js`
  (order is load-bearing), dpr capped 1.6, anisotropy 4, grain overlay
  animation off on `hover:none`, HUD scroll setState rAF-coalesced.
  Regenerate mobile textures after swapping masters:
  `sips -Z 1024 -s format jpeg -s formatOptions 62 <src> --out public/images/m/<name>.jpg`
  (damage decals at 512).
- **Preloader gates on real 3D readiness** (production fix — on live
  hosting the lazy three chunk + textures arrive seconds after the DOM,
  and lifting early = scrolling into an empty scene): it tracks ALL 12
  rig textures + the Experience chunk + the rig's `xp:rig-ready` event,
  with a 12 s safety valve. Desktop rig loads the web-optimized
  `/images/d` set (~2.5 MB, 1792px) — masters in grades//textures/ are
  provenance + DOM-image use only, the rig never reads them directly.
- Pinned viewports use `.h-viewport` / `.-mb-viewport` (100dvh with 100vh
  fallback, index.css) — do NOT reintroduce `h-screen` there (iOS URL-bar).
  Bottom overlays use `bottom-[calc(…+env(safe-area-inset-bottom))]`;
  viewport meta has `viewport-fit=cover`.
- Mobile overlay layouts: hero = copy top / CTAs+stats bottom with a
  `flex-1` gap so the standing panel shows through a vertical scrim;
  S02/S03/S04 pickers are full-width `flex-1` buttons; S05 stats are a
  snap-x carousel (`no-scrollbar`, cards w-[78%], order matches the
  top→bottom specimen order); `backdrop-blur` is mobile-off everywhere
  (`bg-ink/85 md:bg-ink/70 md:backdrop-blur-*`).
- Dev handles: `window.__lenis` and `window.__cam` (DEV only, like `__xp`).
  To scroll the preview: `__lenis.scrollTo(y, {immediate:true})` — plain
  `window.scrollTo` gets overridden by Lenis. Phase-accurate position:
  `el.offsetTop + (el.offsetHeight - innerHeight) * frac`; wait ~1.8 s after
  a jump for the camera damp (λ=5) before screenshotting.

## Textures (owner masters in ~/Downloads, installed copies in public/images)

- Grade faces: `grades/surface-{e,i,ii,iii,iv}.*` (Class E/I–IV files;
  III/IV were portrait — rotated 90°).
- Ply edge: `textures/edge-macro.jpg` (image-3.webp) — one band sliced per
  veneer via texture repeat/offset (SMOOTH/ROUGH center tables in
  Experience.jsx); tinted `#e2d5bf` so pale bands don't blow out.
- Shield film: `textures/film-mesh.jpg` (image-4.webp), MirroredRepeat to
  hide seams, roughness 1 (owner demands zero specular).
- Comparison faces: `textures/face-birch.jpg`, `face-softwood.jpg`.
- Damage decals: `textures/damage-{beech,birch,softwood}.jpg` — currently
  Higgsfield nano-banana generations; **owner has real test photos and may
  supply them — swap files 1:1 when he does** (crop mark centered, no ball).

Higgsfield workflow (owner-approved): `media_upload` → presigned URL → curl
PUT → `media_confirm` → `generate_image` (nano_banana_pro) with his real
photo as `medias` reference.

## Dev/verification gotchas (hard-won)

- Textures load via `useLoadedTextures` (plain TextureLoader + state) — drei
  useTexture/suspense never painted on first mount. StrictMode is off for
  the same reason.
- Pinning is native CSS `sticky` (not ScrollTrigger pin). If a section needs
  content after its pinned viewport, wrap the sticky in its own
  `h-[XXXvh]` div (see S04Shield) or it slides over one viewport in.
- Hidden/background tabs suspend rAF → R3F never paints, GSAP freezes,
  screenshots go stale. To verify headless: `window.__xp` is exposed in dev;
  scroll to a real position, then dispatch `window.dispatchEvent(new
  Event('resize'))` TWICE (first render may race ScrollTrigger's debounced
  refresh, which recomputes p from real scroll — so prefer real scroll
  positions over forcing `__xp.p`).
- Phase-boundary snaps: any per-phase override (like the hero quaternion)
  must blend into the NEXT phase's values during the exit transition.

## State / where to pick up

Done & verified: full 01–09 flow, vertical hero opening, grade picker with
auto-reset, explode + glue toggle, matte shield film with options, impact
craters + photo decals + clean rebound cascade, equal specimen thickness,
production build green.

Jul 5 2026 — mobile pass done & verified in preview at 375×812 (see the
Mobile section above): portrait camera framings, vertical impact trio,
light texture set, dvh pinning, snap-carousel stats, touch/gyro parallax.
Desktop regression-checked at 1440×900 (identical poses/textures/dpr).
Still pending: QA on a real phone (only emulated so far).

Open items:
- Swap generated damage decals for the owner's real test photos when he
  drops them in ~/Downloads.
- `ImageSlot` placeholders still await real production photos (impact test
  photos, applications, cildro-sign, client logos) — map in
  `public/images/README.md`.
- Deployment: owner said local-only for now; Higgsfield publish_website or
  Netlify/Vercel (`DEPLOY.md`) when he's ready.
- Real-device mobile QA (iPhone/Android) — the portrait experience is
  built and verified in an emulated 375×812 viewport only.
- The dev server dies between sessions — restart with the "cildro-4d"
  launch config and confirm localhost:5173 responds.
