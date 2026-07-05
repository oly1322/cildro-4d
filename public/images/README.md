# /public/images — asset map

Source rule: every asset here either comes from **https://b2b.cildroplywood.ro**
(the only approved content source) or from Cildro's own local grade photo
archive supplied by the mill. Nothing is stock or generated.

## Fetched from b2b.cildroplywood.ro (`/__l5e/assets-v1/…`)

| File | Used in |
| --- | --- |
| `cildro-logo.webp` / `cildro-logo.avif` | HUD top bar, footer, favicon |
| `plywood-cutout-1x.png|webp|avif`, `plywood-cutout-2x.png|webp|avif` | 01 Hero (static fallback), OG image; source of the texture crops below |

## Derived crops (from `plywood-cutout-2x.png`, the site's own product photo)

| File | Used in |
| --- | --- |
| `textures/beech-face.jpg` | legacy crop (kept for fallbacks) |
| `textures/ply-edge.jpg` | static fallbacks, ply-edge macro |
| `textures/grain-macro.jpg` | 06 Grain Inspector flashlight macro |

## 3D experience textures (owner-supplied masters)

| File | Source | Used in |
| --- | --- | --- |
| `grades/surface-e.webp` | `Class E surface.webp` (owner) | main panel face + grade E |
| `grades/surface-i.webp`, `surface-ii.webp` | `Class I.webp`, `Class II.webp` (owner) | grade picker faces |
| `grades/surface-iii.jpg`, `surface-iv.jpg` | `Class III.webp`, `Class IV.webp` (owner, rotated 90°) | grade picker + inner veneer faces (long/cross) |
| `textures/edge-macro.jpg` | `image-3.webp` (owner) — hyper-real ply edge; one band sliced per 3D veneer (smooth side-grain for long plies, rough end-grain for cross plies) | all sheet edges + exploded veneers |
| `textures/film-mesh.jpg` | `Mesh2.png` (owner) — real anti-slip wire-mesh film | Cildro Shield film face |
| `textures/face-hero.jpg`, `face-e-alt.jpg` | Higgsfield nano-banana generations referenced on the real class E photo (spares, superseded by the owner masters) | — |
| glue films, dents | procedural canvas | 3D scene |

## Local mill archive (quality-class photos, `~/Downloads/class E…IV`)

| File | Used in |
| --- | --- |
| `grades/grade-i.jpg … grade-iv.jpg` (square crops) | 05 Virtual Showroom 3D panel face per grade |
| `grades/grade-i-full.jpg … grade-iv-full.jpg` | 05 Showroom mill-floor reference photo |
| `grades/grade-e.jpg`, `grades/grade-e-full.jpg` | reserve (grade E not exposed in the I–IV toggle) |

## Missing production photos → placeholder slots (`ImageSlot` component)

These exist in the approved copy inventory but are **not present in the current
b2b.cildroplywood.ro deployment** (its JS bundle ships only the logo + cutout).
Drop the real files here and replace the corresponding `<ImageSlot />`:

- `beech-impact-test.webp`, `birch-impact-test.webp`, `softwood-impact-test.webp` → 03 Impact
- `cildro-natural.webp`, `cildro-shield.webp`, `cildro-core.webp` → 04 Products
  (Natural/Core currently show real texture crops; Shield shows a clearly-labeled
  representative phenolic pattern)
- `furniture-cabinetry.webp`, `worktops.webp`, `shopfitting.webp`,
  `structural-decking.webp`, `packaging.webp`, `trailer-floors.webp` → 07 Applications
- `cildro-sign.webp` → 07 Factory-direct block
- client logo images → 07 network marquee (currently typographic)

## /m — mobile texture set (generated, do not hand-edit)

~1024px JPEG q62 copies of the 12 rig textures (damage decals at 512),
served to viewports ≤820px via `src/lib/textures.js`. Regenerate from the
masters after any swap:
`sips -Z 1024 -s format jpeg -s formatOptions 62 <master> --out public/images/m/<name>.jpg`
