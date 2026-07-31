/**
 * Rig texture manifest, shared by the Experience rig and the Preloader.
 * Both device classes get web-optimized WebP sets generated from the
 * owner's masters (which stay untouched in grades/ and textures/):
 *   phones (≤820px)  → /images/m  (~0.5 MB, 1024px, damage 512, webp q80)
 *   everything else  → /images/d  (~0.9 MB, 1792px, damage 512, webp q75)
 * The .jpg twins remain on disk as regeneration intermediates only —
 * nothing loads them. Order is load-bearing: the rig destructures
 * positionally. Regenerate after swapping a master: sips to resized jpg
 * (see public/images/README.md), then sharp .webp({quality: 80|75}).
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
  NAMES.map((n) => `/images/${light ? 'm' : 'd'}/${n}.webp`)
