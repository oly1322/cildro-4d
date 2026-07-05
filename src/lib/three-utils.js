import { useEffect, useState } from 'react'
import * as THREE from 'three'

/**
 * Deterministic texture loading (no suspense): resolves via state once all
 * URLs are loaded. Avoids drei/useLoader suspense-cache pitfalls on first mount.
 */
export function useLoadedTextures(urls) {
  const [textures, setTextures] = useState(null)
  const key = urls.join('|')
  useEffect(() => {
    let alive = true
    const loader = new THREE.TextureLoader()
    Promise.all(key.split('|').map((u) => loader.loadAsync(u)))
      .then((ts) => alive && setTextures(ts))
      .catch(() => alive && setTextures(null))
    return () => {
      alive = false
    }
  }, [key])
  return textures
}

export function tuneColorTexture(t, { repeatX = 1, repeatY = 1, rotate = 0, aniso = 8 } = {}) {
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeatX, repeatY)
  t.anisotropy = aniso
  if (rotate) {
    t.center.set(0.5, 0.5)
    t.rotation = rotate
  }
  return t
}

/**
 * Ply-edge band drawn in canvas: straight, slightly wavy veneer stripes in the
 * palette sampled from the site's plywood photography. A rectangular photo crop
 * can't give straight plies (the shots are angled), so the 3D sheet edges use
 * this instead — real photos still texture every face.
 */
export function makePlyEdgeTexture(plies = 9, w = 2048, h = 128) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const veneers = ['#e2c69c', '#d9b98f', '#e6cda6', '#d4b083', '#dfc298']
  const glue = '#8a6644'
  ctx.fillStyle = '#d9b98f'
  ctx.fillRect(0, 0, w, h)
  const band = h / plies
  for (let i = 0; i < plies; i++) {
    const y0 = i * band
    const phase = Math.sin(i * 12.9898) * 43758.5453
    const amp = 1.2 + ((phase - Math.floor(phase)) % 1) * 1.6
    // veneer band with gentle waviness
    ctx.fillStyle = veneers[i % veneers.length]
    ctx.beginPath()
    ctx.moveTo(0, y0)
    for (let x = 0; x <= w; x += 32) {
      ctx.lineTo(x, y0 + Math.sin(x / 140 + i * 1.7) * amp)
    }
    ctx.lineTo(w, y0 + band)
    ctx.lineTo(0, y0 + band)
    ctx.closePath()
    ctx.fill()
    // glue line between plies
    ctx.strokeStyle = glue
    ctx.lineWidth = 1.6
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    for (let x = 0; x <= w; x += 32) {
      const y = y0 + Math.sin(x / 140 + i * 1.7) * amp
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
  }
  // fine end-grain streaks
  ctx.globalAlpha = 0.08
  for (let x = 0; x < w; x += 3) {
    const shade = Math.random()
    ctx.fillStyle = shade > 0.5 ? '#8a6644' : '#f2e2c4'
    ctx.fillRect(x, 0, 1.5, h)
  }
  ctx.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}

/** Procedural phenolic film face: dark resin brown + anti-slip wire-mesh emboss. */
export function makePhenolicTexture(size = 512) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#3a2418'
  ctx.fillRect(0, 0, size, size)
  // subtle resin mottling
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = Math.random() * 2.2
    ctx.fillStyle = `rgba(${20 + Math.random() * 30}, ${12 + Math.random() * 18}, 8, ${Math.random() * 0.25})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // anti-slip wire mesh
  const step = size / 14
  ctx.strokeStyle = 'rgba(88, 56, 34, 0.85)'
  ctx.lineWidth = 3
  for (let i = -size; i < size * 2; i += step) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + size, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(i + size, 0)
    ctx.lineTo(i, size)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(24, 14, 8, 0.6)'
  ctx.lineWidth = 1
  for (let i = -size; i < size * 2; i += step) {
    ctx.beginPath()
    ctx.moveTo(i + 2, 0)
    ctx.lineTo(i + size + 2, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(i + size + 2, 0)
    ctx.lineTo(i + 2, size)
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  t.anisotropy = 8
  return t
}

/**
 * Roller-spread glue map: one NEUTRAL grayscale spread pattern (directional
 * roller streaks along the grain + stipple + low-frequency coverage blotches)
 * that the glue material tints live via `color` (phenolic dark / melamine
 * light keep hot-swapping with zero texture churn). Doubles as bump +
 * roughness map so the wet film catches broken highlights instead of reading
 * as a flat shadow. Coverage is FULL to the ply edge — owner: glue always
 * reaches the very end of each ply, no bare border.
 */
export function makeGlueSpreadMaps(size = 512) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#e2e2e2'
  ctx.fillRect(0, 0, size, size)
  // coverage blotches — hand-spread, not laser-uniform
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 28 + Math.random() * 95
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, Math.random() > 0.5 ? 'rgba(255,255,255,0.10)' : 'rgba(80,80,80,0.13)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // roller streaks along the grain (X) — thin and crisp, not smeary
  for (let i = 0; i < 380; i++) {
    const y = Math.random() * size
    const w = 40 + Math.random() * 180
    const x = Math.random() * size - w / 2
    const h = 0.8 + Math.random() * 1.7
    ctx.fillStyle =
      Math.random() > 0.45
        ? `rgba(255,255,255,${0.06 + Math.random() * 0.13})`
        : `rgba(66,66,66,${0.06 + Math.random() * 0.13})`
    ctx.fillRect(x, y, w, h)
  }
  // stipple — dense, sells "spread" at close range
  for (let i = 0; i < 6500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.10)' : 'rgba(55,55,55,0.10)'
    ctx.fillRect(Math.random() * size, Math.random() * size, 1.2, 1.2)
  }
  const map = new THREE.CanvasTexture(c)
  map.colorSpace = THREE.SRGBColorSpace
  // mirrored: hides tile seams on the big near plies
  map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping
  map.repeat.set(2.2, 1.4)

  return { map }
}

/** Shared warm studio lighting rig. */
export const LIGHTS = {
  ambient: 0.85,
  key: { position: [4, 6, 5], intensity: 1.5, color: '#fff4e4' },
  rim: { position: [-5, 3, -4], intensity: 0.7, color: '#ffd9ae' },
}
