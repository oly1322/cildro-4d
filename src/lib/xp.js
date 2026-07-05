/**
 * Shared mutable state for the scroll-driven 4D experience.
 * DOM/UI writes into it (scroll progress, user selections); the R3F scene
 * reads it every frame. Plain refs — no re-renders on the hot path.
 */
export const xp = window.__xp || {
  /** global progress 0..1 across the experience wrapper (sections 01–05) */
  p: 0,
  /** phase ranges within global p — measured from the DOM after layout */
  ranges: {
    hero: [0, 0.2],
    surface: [0.2, 0.4],
    material: [0.4, 0.6],
    shield: [0.6, 0.8],
    impact: [0.8, 1],
  },
  /** user selections */
  grade: 'e',
  glue: 'phenolic',
  filmColor: 'dark',
  filmWeight: '120',
}
if (import.meta.env.DEV) window.__xp = xp

/** phase + local progress (0..1 inside that phase) for the current xp.p */
export function phaseLocal() {
  const entries = Object.entries(xp.ranges)
  for (const [name, [a, b]] of entries) {
    if (xp.p < b || name === 'impact') {
      return { name, local: Math.min(1, Math.max(0, (xp.p - a) / (b - a || 1))) }
    }
  }
  return { name: 'impact', local: 1 }
}

/** local progress of one named phase regardless of current phase (clamped) */
export function localOf(name) {
  const [a, b] = xp.ranges[name]
  return Math.min(1, Math.max(0, (xp.p - a) / (b - a || 1)))
}

/** measure phase section positions inside the wrapper and update ranges */
export function measureRanges(wrapper) {
  const total = wrapper.scrollHeight - window.innerHeight
  if (total <= 0) return
  const ids = ['hero', 'surface', 'material', 'shield', 'impact']
  const next = {}
  ids.forEach((id, i) => {
    const el = wrapper.querySelector(`#${id}`)
    if (!el) return
    const start = el.offsetTop / total
    const end = (el.offsetTop + el.offsetHeight - (i === ids.length - 1 ? window.innerHeight : window.innerHeight)) / total
    next[id] = [Math.max(0, Math.min(1, start)), Math.max(0, Math.min(1, i === ids.length - 1 ? 1 : end))]
  })
  // make ranges contiguous: each phase ends where the next begins
  ids.forEach((id, i) => {
    if (next[id] && next[ids[i + 1]]) next[id][1] = next[ids[i + 1]][0]
  })
  if (next.hero) next.hero[0] = 0
  Object.assign(xp.ranges, next)
}
