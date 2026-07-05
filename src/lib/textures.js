/**
 * Rig texture manifest, shared by the Experience rig and the Preloader.
 * Both device classes get web-optimized sets generated from the owner's
 * masters (which stay untouched in grades/ and textures/ for provenance):
 *   phones (≤820px)  → /images/m  (~1 MB,  1024px, damage 512)
 *   everything else  → /images/d  (~2.5 MB, 1792px, damage 512 — the
 *                       damage decals are consumed by a 512px canvas anyway)
 * Order is load-bearing: the rig destructures positionally.
 * Regenerate after swapping a master (see public/images/README.md):
 *   sips -Z 1792 -s format jpeg -s formatOptions 68 <master> --out public/images/d/<name>.jpg
 *   sips -Z 1024 -s format jpeg -s formatOptions 62 <master> --out public/images/m/<name>.jpg
 */
export const wantsLightAssets = () => window.matchMedia('(max-width: 820px)').matches

const NAMES = [
  'surface-e',
  'surface-i',
  'surface-ii',
  'surface-iii',
  'surface-iv',
  'edge-macro',
  'film-mesh',
  'face-birch',
  'face-softwood',
  'damage-beech',
  'damage-birch',
  'damage-softwood',
]

export const rigTextureUrls = (light) =>
  NAMES.map((n) => `/images/${light ? 'm' : 'd'}/${n}.jpg`)
