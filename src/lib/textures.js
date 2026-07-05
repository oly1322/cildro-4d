/**
 * Rig texture manifest, shared by the Experience rig and the Preloader.
 * Phones get the ~1024px set in /images/m (~1 MB total vs ~5.6 MB) —
 * same owner-supplied masters, resized + recompressed (sips, q62).
 * Order is load-bearing: the rig destructures positionally.
 */
export const wantsLightAssets = () => window.matchMedia('(max-width: 820px)').matches

const DESKTOP = [
  '/images/grades/surface-e.webp',
  '/images/grades/surface-i.webp',
  '/images/grades/surface-ii.webp',
  '/images/grades/surface-iii.jpg',
  '/images/grades/surface-iv.jpg',
  '/images/textures/edge-macro.jpg',
  '/images/textures/film-mesh.jpg',
  '/images/textures/face-birch.jpg',
  '/images/textures/face-softwood.jpg',
  '/images/textures/damage-beech.jpg',
  '/images/textures/damage-birch.jpg',
  '/images/textures/damage-softwood.jpg',
]

const MOBILE = [
  '/images/m/surface-e.jpg',
  '/images/m/surface-i.jpg',
  '/images/m/surface-ii.jpg',
  '/images/m/surface-iii.jpg',
  '/images/m/surface-iv.jpg',
  '/images/m/edge-macro.jpg',
  '/images/m/film-mesh.jpg',
  '/images/m/face-birch.jpg',
  '/images/m/face-softwood.jpg',
  '/images/m/damage-beech.jpg',
  '/images/m/damage-birch.jpg',
  '/images/m/damage-softwood.jpg',
]

export const rigTextureUrls = (light) => (light ? MOBILE : DESKTOP)

/** the first-paint subset the preloader warms so the canvas shows instantly */
export const criticalTextureUrls = (light) => rigTextureUrls(light).slice(0, 7)
