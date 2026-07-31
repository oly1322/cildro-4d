import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { xp, localOf } from '../lib/xp.js'
import { tuneColorTexture, useLoadedTextures, makeGlueSpreadMaps, LIGHTS } from '../lib/three-utils.js'
import { rigTextureUrls, wantsLightAssets } from '../lib/textures.js'

/* ── constants ────────────────────────────────────────────────────────── */

const PLIES = 9
const VT = 0.009 // veneer thickness (visual scale for ~2.6 mm plies)
const W = 2.5
const D = 1.56
const GAP = 0.12 // explode spacing

/* tint over the neutral spread map (~0.7 luma), so slightly brighter than target */
const GLUE_COLORS = { phenolic: '#5a3018', melamine: '#fff6e2' }

const s = (v, a, b) => THREE.MathUtils.smoothstep(v, a, b)
const lerp = THREE.MathUtils.lerp

/* impact damage per material: crater depth, radius, raised rim (world units) */
const DAMAGE = [
  { depth: 0.009, r: 0.11, rim: 0 }, // beech — small but visible mark
  { depth: 0.016, r: 0.15, rim: 0.0035 }, // birch — visible dent
  { depth: 0.034, r: 0.21, rim: 0.009 }, // softwood — deep crater
]

/**
 * Real dent, baked ONCE as a GPU morph target: the fully-formed crater
 * (radial profile + raised rim, with precomputed normals) becomes morph
 * slot 0 and the scroll drives `morphTargetInfluences[0]`. The old
 * approach (CPU vertex displacement + computeVertexNormals every frame
 * for 3 meshes) was the back-and-forth jank in the impact section on
 * phones. `scaleXZ`/`scaleY` map world-space crater size into local space
 * — craters only ever form after the beech panel reaches its final
 * specimen scale, so baking at that scale is exact.
 */
function bakeCrater(mesh, dmg, scaleXZ = 1, scaleY = 1) {
  const g = mesh.geometry
  if (g.userData.craterBaked) return
  g.userData.craterBaked = true
  const base = g.attributes.position.array
  const displaced = Float32Array.from(base)
  const r = dmg.r / scaleXZ
  const depth = dmg.depth / scaleY
  const rim = dmg.rim / scaleY
  let topY = -Infinity
  for (let i = 1; i < base.length; i += 3) if (base[i] > topY) topY = base[i]
  for (let vi = 0; vi < base.length / 3; vi++) {
    const bx = base[vi * 3]
    const by = base[vi * 3 + 1]
    const bz = base[vi * 3 + 2]
    if (by < topY - 1e-6) continue
    const d = Math.hypot(bx, bz)
    let disp = -depth * Math.exp(-(d * d) / (r * r))
    if (rim) disp += rim * Math.exp(-Math.pow((d - r * 1.35) / (r * 0.4), 2))
    displaced[vi * 3 + 1] = by + disp
  }
  // normals for the displaced shape via a throwaway clone
  const tmp = g.clone()
  tmp.attributes.position.array.set(displaced)
  tmp.computeVertexNormals()
  const baseNor = g.attributes.normal.array
  const dispNor = tmp.attributes.normal.array
  const dPos = new Float32Array(base.length)
  const dNor = new Float32Array(base.length)
  for (let i = 0; i < base.length; i++) {
    dPos[i] = displaced[i] - base[i]
    dNor[i] = dispNor[i] - baseNor[i]
  }
  tmp.dispose()
  g.morphTargetsRelative = true
  g.morphAttributes.position = [new THREE.BufferAttribute(dPos, 3)]
  g.morphAttributes.normal = [new THREE.BufferAttribute(dNor, 3)]
  mesh.updateMorphTargets()
  mesh.morphTargetInfluences[0] = 0
}

/* opening pose: the panel stands upright in portrait, face to the camera —
   local X (panel length) → world up, local Y (face normal) → toward camera */
const Q_STAND = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 0)
  )
)
const _qFlat = new THREE.Quaternion()
const _eFlat = new THREE.Euler()
const HERO_FRONTAL = [0.1, 0.1, 6.1]
const HERO_BEAUTY = [3.1, 1.9, 4.2]
/* portrait variants: the standing panel fills the phone screen edge to edge,
   later poses sit closer and let the sheet bleed off-frame (macro feel)
   instead of shrinking it to fit — tuned at 375×812 */
const HERO_FRONTAL_M = [0.2, 0.05, 7.0]
const HERO_BEAUTY_M = [2.7, 1.9, 5.2]

/* camera poses at phase boundaries — each holds, then transitions late in the
   phase. `posM`/`lookM`/`rotYM` are the portrait-phone framings (fall back to
   pos/look/rotY). In portrait the board turns 90° (`rotYM: π/2`) so its long
   axis runs DOWN the 9:16 screen — full face visible for grade evaluation. */
const POSES = [
  { at: 'hero0', pos: HERO_BEAUTY, posM: HERO_BEAUTY_M, look: [0, 0, 0], rotY: 0.35 },
  { at: 'surface0', pos: [0.05, 2.7, 1.15], posM: [0.03, 5.0, 0.55], look: [0, 0, 0], rotY: 0, rotYM: Math.PI / 2 },
  { at: 'material0', pos: [2.5, 1.9, 4.2], posM: [2.7, 0.3, 4.8], look: [0, 0, 0], rotY: 0.52 },
  { at: 'shield0', pos: [2.1, 1.0, 3.3], posM: [0.05, 2.5, 4.3], look: [0, 0.05, 0], lookM: [0, 0.1, 0], rotY: 0.35, rotYM: Math.PI / 2 },
  { at: 'impact0', pos: [0, 1.45, 3.9], posM: [0, 5.0, 3.0], look: [0, 0.05, 0], lookM: [0, 0, 0.32], rotY: 0 },
  { at: 'end', pos: [0, 1.6, 4.2], posM: [0, 5.2, 3.2], look: [0, 0.05, 0], lookM: [0, 0, 0.32], rotY: 0 },
]

/* explode spacing is wider in portrait so the veneer tower fills the tall screen */
const GAP_M = 0.2

/* impact-test lane axis: specimens spread along X on desktop (side by side),
   along Z in portrait so they stack down the tall screen instead of shrinking */
const LANE = 1.3
const LANE_M = 1.02

/* ── canvas textures ──────────────────────────────────────────────────── */

/**
 * Turn a real damage photo into a decal: keep the center, feather the edges
 * to transparent so it blends into the panel face it lands on.
 */
function makeFeatheredDecal(tex) {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const img = tex.image
  const side = Math.min(img.width, img.height)
  ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.22, size / 2, size / 2, size * 0.5)
  g.addColorStop(0, 'rgba(0,0,0,1)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/* ── scene rig ────────────────────────────────────────────────────────── */

function Rig() {
  const light = useMemo(() => wantsLightAssets(), [])
  const textures = useLoadedTextures(rigTextureUrls(light))
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  const built = useMemo(() => {
    if (!textures) return null
    const [ge, gi, gii, giii, giv, edgeMacro, filmMesh, birchF, softF, dmgBe, dmgBi, dmgSo] = textures
    // aniso 2 only where fillrate is truly scarce; iPhones keep 4 — the
    // aniso cut read as blurry faces at oblique angles (owner feedback)
    const lowTier = light && (navigator.deviceMemory || 8) <= 4
    textures.forEach((t) => tuneColorTexture(t, light ? { aniso: lowTier ? 2 : 4 } : {}))
    const cross = tuneColorTexture(giii.clone(), { rotate: Math.PI / 2 })
    const gradeMaps = { e: ge, i: gi, ii: gii, iii: giii, iv: giv }

    // slice one real ply band per veneer out of the edge macro (image-3.webp):
    // long-grain veneers get smooth side-grain bands, cross veneers the rough
    // end-grain bands — measured band centers, from the top of the image
    const SMOOTH = [0.058, 0.175, 0.285, 0.401, 0.521, 0.641, 0.761]
    const ROUGH = [0.12, 0.227, 0.343, 0.461, 0.581, 0.7, 0.82]
    const SLICE = 0.048
    // ONE clone per veneer (not per face) — every THREE.Texture.clone() is a
    // separate GPU upload of the same image; cloning per face meant 36 copies
    // of the edge macro (~100 MB of VRAM on a phone) and a long warm-up.
    const edgeMat = (i) => {
      const t = edgeMacro.clone()
      t.wrapS = THREE.RepeatWrapping
      t.wrapT = THREE.ClampToEdgeWrapping
      const centers = i % 2 === 0 ? SMOOTH : ROUGH
      const c = centers[(i * 3 + 1) % centers.length]
      t.repeat.set(1.4, SLICE)
      t.offset.set((i * 0.137) % 0.5, 1 - c - SLICE / 2)
      // slight tint keeps pale bands from blowing out under the key light
      return new THREE.MeshStandardMaterial({ map: t, color: '#e2d5bf', roughness: 1 })
    }
    // multi-band edge for the comparison specimens (whole macro compressed) —
    // all 8 specimen edges share ONE texture; only the tint differs
    const specimenEdgeTex = edgeMacro.clone()
    specimenEdgeTex.wrapS = THREE.RepeatWrapping
    specimenEdgeTex.wrapT = THREE.ClampToEdgeWrapping
    specimenEdgeTex.repeat.set(1.1, 0.55)
    specimenEdgeTex.offset.set(0, 0.22)
    const specimenEdge = (tint) =>
      new THREE.MeshStandardMaterial({ map: specimenEdgeTex, color: tint, roughness: 1 })
    const faceMat = (map, tint = '#ffffff') =>
      new THREE.MeshStandardMaterial({ map, color: tint, roughness: 0.62 })

    // 9 veneers — alternating long grain / cross grain
    const veneers = Array.from({ length: PLIES }, (_, i) => {
      const long = i % 2 === 0
      const top = i === PLIES - 1
      const bottom = i === 0
      const map = top || bottom ? ge : long ? giii : cross
      const em = edgeMat(i) // one texture per veneer, reused on all 4 edges
      const fm = faceMat(map, long ? '#ffffff' : '#f3e6d0')
      return [em, em, fm, fm, em, em]
    })

    // wet roller-spread glue film (see makeGlueSpreadMaps) — tinted live
    const glueMaps = makeGlueSpreadMaps()
    const glueMat = new THREE.MeshStandardMaterial({
      map: glueMaps.map,
      // bump uses screen-space derivatives — expensive per pixel on mobile
      // GPUs and invisible at phone scale; the spread still reads via the
      // color + roughness maps
      bumpMap: light ? null : glueMaps.map,
      bumpScale: 0.45,
      roughnessMap: glueMaps.map,
      color: GLUE_COLORS[xp.glue],
      roughness: 0.28,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
    })

    // real anti-slip wire-mesh film texture (image-4.webp, owner-supplied);
    // mirrored wrap hides tiling seams from the photo's lighting falloff
    filmMesh.wrapS = filmMesh.wrapT = THREE.MirroredRepeatWrapping
    filmMesh.repeat.set(2.4, 1.6)
    // fully matte — no specular wash on the film
    const filmMat = new THREE.MeshStandardMaterial({
      map: filmMesh,
      color: '#ffffff',
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity: 0,
    })

    // photoreal damage decals (feathered into the panel face)
    const damageDecals = [dmgBe, dmgBi, dmgSo].map((t) => makeFeatheredDecal(t))
    const steel = new THREE.MeshStandardMaterial({ color: '#c9c9cd', metalness: 0.92, roughness: 0.22 })

    // comparison specimens: real birch / softwood faces + layered plywood edges
    const birchMats = [
      specimenEdge('#f0e8d8'),
      specimenEdge('#f0e8d8'),
      faceMat(birchF),
      faceMat(birchF),
      specimenEdge('#f0e8d8'),
      specimenEdge('#f0e8d8'),
    ]
    const softMats = [
      specimenEdge('#e8d5a8'),
      specimenEdge('#e8d5a8'),
      faceMat(softF),
      faceMat(softF),
      specimenEdge('#e8d5a8'),
      specimenEdge('#e8d5a8'),
    ]

    return { gradeMaps, veneers, glueMat, filmMat, damageDecals, steel, birchMats, softMats }
  }, [textures, light])

  const panelRef = useRef()
  const specimenRefs = useRef([])
  const veneerRefs = useRef([])
  const glueRefs = useRef([])
  const filmRef = useRef()
  const trioRef = useRef()
  const ballRefs = useRef([])
  const dentRefs = useRef([])
  const gradeRef = useRef('e')
  const mouse = useRef({ x: 0, y: 0 })

  // behind-the-curtain GPU warm-up, THEN signal ready. Order matters:
  // craters must be baked (morph targets change the shader program) BEFORE
  // gl.compile, or the impact section pays a recompile hitch later. Also
  // uploads every rig texture (incl. grade faces not yet on a mesh — kills
  // the first grade-tap hitch) and the damage decals, then draws one frame.
  useEffect(() => {
    if (!built) return
    const topVeneer = veneerRefs.current[PLIES - 1]
    if (topVeneer) bakeCrater(topVeneer, DAMAGE[0], 0.44, 0.05 / (PLIES * VT))
    if (specimenRefs.current[1]) bakeCrater(specimenRefs.current[1], DAMAGE[1])
    if (specimenRefs.current[2]) bakeCrater(specimenRefs.current[2], DAMAGE[2])
    textures.forEach((t) => gl.initTexture(t))
    built.damageDecals.forEach((t) => gl.initTexture(t))
    // gl.compile only walks VISIBLE objects — the impact trio starts hidden,
    // so its programs (and the per-veneer edge textures) would compile/upload
    // on first entry and hitch. Force everything visible for the warm-up.
    const hidden = []
    scene.traverse((o) => {
      if (o.visible === false) {
        hidden.push(o)
        o.visible = true
      }
    })
    gl.compile(scene, camera)
    gl.render(scene, camera)
    hidden.forEach((o) => (o.visible = false))
    window.dispatchEvent(new Event('xp:rig-ready'))
  }, [built, textures, gl, scene, camera])

  useEffect(() => {
    const set = (cx, cy) => {
      mouse.current.x = (cx / window.innerWidth) * 2 - 1
      mouse.current.y = (cy / window.innerHeight) * 2 - 1
    }
    const onMove = (e) => set(e.clientX, e.clientY)
    const onTouch = (e) => e.touches[0] && set(e.touches[0].clientX, e.touches[0].clientY)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    // device-tilt parallax where it never triggers a permission prompt
    // (Android / older iOS — iOS 13+ requires a gesture-gated request, skip it)
    let onOri = null
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission !== 'function'
    ) {
      onOri = (e) => {
        if (e.gamma == null || e.beta == null) return
        mouse.current.x = THREE.MathUtils.clamp(e.gamma / 28, -1, 1)
        // 48° ≈ natural in-hand pitch — treat it as the resting midpoint
        mouse.current.y = THREE.MathUtils.clamp((e.beta - 48) / 32, -1, 1)
      }
      window.addEventListener('deviceorientation', onOri, { passive: true })
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      if (onOri) window.removeEventListener('deviceorientation', onOri)
    }
  }, [])

  useFrame((state, dt) => {
    if (!built || !panelRef.current) return

    // canvas scrolled out (sections 06–09): draw an empty scene — no
    // shading, no geometry, and none of the per-frame math below
    if (!xp.live) {
      panelRef.current.visible = false
      if (trioRef.current) trioRef.current.visible = false
      return
    }
    panelRef.current.visible = true
    const hero = localOf('hero')
    const surface = localOf('surface')
    const material = localOf('material')
    const shield = localOf('shield')
    const impact = localOf('impact')

    /* portrait phones get their own framing + the impact lane runs in depth */
    const portrait = (state.camera.aspect || 1.6) < 0.9
    const lane = portrait ? LANE_M : LANE

    /* ---- selections (hot-swap without re-render) ----
       past the surface section the panel reverts to the default face,
       so explode/shield/impact always show the flagship surface */
    const effGrade = xp.p > xp.ranges.surface[1] + 0.015 ? 'e' : xp.grade
    if (gradeRef.current !== effGrade) {
      gradeRef.current = effGrade
      const map = built.gradeMaps[effGrade] || built.gradeMaps.e
      const topVeneer = veneerRefs.current[PLIES - 1]
      if (topVeneer) {
        topVeneer.material[2].map = map
        topVeneer.material[2].needsUpdate = true
      }
    }
    // phenolic reads wet-glossy, melamine satin + faintly translucent
    built.glueMat.color.set(GLUE_COLORS[xp.glue])
    built.glueMat.roughness = xp.glue === 'phenolic' ? 0.3 : 0.62
    built.filmMat.color.set(xp.filmColor === 'dark' ? '#ffffff' : '#e59a5c')
    // heavier film reads slightly denser/darker — never glossy
    built.filmMat.roughness = 1
    if (xp.filmWeight === '240') built.filmMat.color.multiplyScalar(0.82)

    /* ---- explode / reassemble ---- */
    // shield's range includes its non-pinned tail (~1/3), so scene beats must
    // finish by ~0.65 of the range to stay inside the pinned viewport
    const explode = s(material, 0.04, 0.5) * (1 - s(shield, 0, 0.22))
    const gap = portrait ? GAP_M : GAP
    veneerRefs.current.forEach((m, i) => {
      if (!m) return
      m.position.y = (i - (PLIES - 1) / 2) * (VT + gap * explode)
    })
    glueRefs.current.forEach((g, i) => {
      if (!g) return
      // the film rides ON the face of the veneer below it (just rolled on),
      // not floating mid-gap — that's what kept it reading as a shadow
      const step = VT + gap * explode
      g.position.y = (i - (PLIES - 1) / 2) * step + VT / 2 + 0.001
      g.material.opacity = explode * (xp.glue === 'melamine' ? 0.85 : 0.97)
      // a fully transparent mesh still costs full fill rate — skip it
      g.visible = explode > 0.01
      g.scale.setScalar(0.995)
    })

    /* ---- shield film ----
       portrait lands the film early (by ~0.36) so there's still pinned
       scroll left to play with the color/weight toggles while it's on */
    const fl = (portrait ? s(shield, 0.1, 0.36) : s(shield, 0.24, 0.58)) * (1 - s(impact, 0, 0.1))
    if (filmRef.current) {
      const topY = ((PLIES - 1) / 2) * VT + VT / 2
      filmRef.current.position.y = topY + 0.006 + (1 - fl) * 0.85
      built.filmMat.opacity = Math.min(1, fl * fl * 1.6)
      filmRef.current.visible = fl > 0.01
      filmRef.current.scale.y = xp.filmWeight === '240' ? 1.8 : 1
    }

    /* ---- impact phase: main panel becomes the beech specimen ---- */
    const enter = s(impact, 0, 0.16)
    const panel = panelRef.current
    if (portrait) {
      panel.position.x = 0
      panel.position.z = lerp(0, -lane, enter)
    } else {
      panel.position.x = lerp(0, -lane, enter)
      panel.position.z = 0
    }
    const sc = lerp(1, 0.44, enter)
    // Y scale chosen so the beech specimen matches the 0.05 thickness of the others
    const scY = lerp(1, 0.05 / (PLIES * VT), enter)
    panel.scale.set(sc, scY, sc)

    /* panel idle rotation */
    const poseIdx =
      xp.p < xp.ranges.surface[0] ? 0
      : xp.p < xp.ranges.material[0] ? 1
      : xp.p < xp.ranges.shield[0] ? 2
      : xp.p < xp.ranges.impact[0] ? 3
      : 4
    const locals = [hero, surface, material, shield, impact]
    const local = locals[poseIdx]
    const a = POSES[poseIdx]
    const b = POSES[poseIdx + 1]
    // portrait-aware pose rotation (board turns 90° in portrait where set)
    const rotOf = (pose) => (portrait && pose.rotYM != null ? pose.rotYM : pose.rotY)
    // hold the phase pose, transition in the last stretch of the phase
    const t = s(local, 0.75, 1)
    const drift = poseIdx <= 1 ? Math.sin(state.clock.elapsedTime * 0.16) * 0.05 : 0
    panel.rotation.y = lerp(rotOf(a), rotOf(b), t) + drift * (1 - t)
    if (poseIdx === 4) panel.rotation.y = lerp(rotOf(a), 0, s(impact, 0, 0.16))

    /* ---- opening: portrait standing panel tips down into the beauty pose ----
       the flat-state Y rotation blends into the NEXT phase's rotY during the
       hero-exit transition so there is no snap at the phase boundary */
    const tip = poseIdx === 0 ? s(hero, 0.12, 0.68) : 1
    if (poseIdx === 0) {
      const yStand = lerp(0.02, POSES[0].rotY + drift, tip)
      _qFlat.setFromEuler(_eFlat.set(0, lerp(yStand, rotOf(POSES[1]), t), 0))
      panel.quaternion.slerpQuaternions(Q_STAND, _qFlat, tip)
      // portrait: keep the standing panel dead-center under the copy
      panel.position.x = (portrait ? 0 : 1.05) * (1 - tip)
      panel.position.y = 0.12 * (1 - tip)
      panel.position.z = 0
    } else if (poseIdx !== 4) {
      panel.position.x = 0
      panel.position.y = 0
      panel.position.z = 0
    }

    /* ---- camera ----
       portrait: hand-tuned per-pose framings (posM/lookM) + wider fov — the
       panel stays big and bleeds off-frame instead of shrinking to fit.
       landscape: mild distance compensation for narrow desktop windows. */
    const cam = state.camera
    const wantFov = portrait ? 34 : 30
    if (cam.fov !== wantFov) {
      cam.fov = wantFov
      cam.updateProjectionMatrix()
    }
    const ds = portrait ? 1 : THREE.MathUtils.clamp(1.45 / (cam.aspect || 1.6), 1, 1.65)
    const aP = (portrait && a.posM) || a.pos
    const bP = (portrait && b.posM) || b.pos
    const aL = (portrait && a.lookM) || a.look
    const bL = (portrait && b.lookM) || b.look
    const frontal = portrait ? HERO_FRONTAL_M : HERO_FRONTAL
    // hero pose morphs frontal → beauty while the panel tips down
    const aPos =
      poseIdx === 0
        ? [lerp(frontal[0], aP[0], tip), lerp(frontal[1], aP[1], tip), lerp(frontal[2], aP[2], tip)]
        : aP
    const px = lerp(aPos[0], bP[0], t) * ds
    const py = lerp(aPos[1], bP[1], t) * ds
    const pz = lerp(aPos[2], bP[2], t) * ds
    const mx = poseIdx <= 1 ? mouse.current.x * 0.12 : 0
    const my = poseIdx <= 1 ? mouse.current.y * 0.08 : 0
    cam.position.set(
      THREE.MathUtils.damp(cam.position.x, px + mx, 5, dt),
      THREE.MathUtils.damp(cam.position.y, py - my, 5, dt),
      THREE.MathUtils.damp(cam.position.z, pz, 5, dt)
    )
    cam.lookAt(lerp(aL[0], bL[0], t), lerp(aL[1], bL[1], t), lerp(aL[2], bL[2], t))

    /* ---- trio + balls ---- */
    if (trioRef.current) {
      trioRef.current.visible = impact > 0.01
      trioRef.current.position.y = -0.02
      // lane axis: X on desktop (side by side), Z in portrait (down the screen)
      const laneX = (i) => (portrait ? 0 : (i - 1) * lane)
      const laneZ = (i) => (portrait ? (i - 1) * lane : 0)
      const softSpec = specimenRefs.current[2]
      if (softSpec) softSpec.position.set(laneX(2), 0, laneZ(2))
      const show = s(impact, 0.04, 0.2)
      trioRef.current.children.forEach((ch) => {
        if (ch.material && ch.material.transparent) ch.material.opacity = show
      })
      const restY = 0.025 + 0.075
      const drops = [0.24, 0.42, 0.6]
      ballRefs.current.forEach((ball, i) => {
        if (!ball) return
        ball.position.x = laneX(i)
        ball.position.z = laneZ(i)
        const t0 = drops[i]
        const tHit = t0 + 0.1
        ball.visible = impact > t0 - 0.12 && impact > 0.2
        let y
        if (impact < t0) y = 1.6
        else if (impact < tHit) {
          const u = (impact - t0) / 0.1
          y = lerp(1.6, restY, u * u)
        } else {
          const u = Math.min(1, (impact - tHit) / Math.max(0.001, 1 - tHit))
          // beech shrugs, birch holds, softwood dents — rebounds start AT the
          // surface on contact (|sin|) and decay quickly, then the ball rests
          if (i === 0) {
            const ub = Math.min(1, u / 0.5)
            y = restY - DAMAGE[0].depth * ub + 0.2 * Math.pow(1 - ub, 1.6) * Math.abs(Math.sin(ub * Math.PI * 2.5))
          } else if (i === 1) {
            const ub = Math.min(1, u / 0.3)
            y = restY - DAMAGE[1].depth * ub + 0.05 * Math.pow(1 - ub, 2) * Math.abs(Math.sin(ub * Math.PI * 1.2))
          } else {
            y = restY - DAMAGE[2].depth * Math.min(1, u / 0.25)
          }
        }
        ball.position.y = y

        /* crater deformation (GPU morph, baked once) + bruise mark */
        const amt = impact > tHit ? s(impact, tHit, tHit + 0.08) : 0
        const cratered = i === 0 ? veneerRefs.current[PLIES - 1] : specimenRefs.current[i]
        if (cratered?.morphTargetInfluences) cratered.morphTargetInfluences[0] = amt
        const dent = dentRefs.current[i]
        if (dent) {
          dent.material.opacity = amt * [1, 0.95, 1][i]
          const r = [0.95, 1.1, 1.7][i]
          dent.scale.setScalar(0.2 + amt * r)
          dent.position.set(laneX(i), 0.027 - DAMAGE[i].depth * amt * 0.8, laneZ(i))
        }
      })
    }
  })

  if (!built) return null

  const topY = ((PLIES - 1) / 2) * VT

  return (
    <>
      {/* the one panel */}
      <group ref={panelRef}>
        {Array.from({ length: PLIES }).map((_, i) => (
          <mesh key={i} ref={(el) => (veneerRefs.current[i] = el)} material={built.veneers[i]}>
            {/* top veneer is segmented so the impact crater can deform it */}
            {i === PLIES - 1 ? (
              <boxGeometry args={[W, VT, D, 44, 1, 30]} />
            ) : (
              <boxGeometry args={[W, VT, D]} />
            )}
          </mesh>
        ))}
        {Array.from({ length: PLIES - 1 }).map((_, i) => (
          <mesh key={`g${i}`} ref={(el) => (glueRefs.current[i] = el)} material={built.glueMat}>
            <boxGeometry args={[W, 0.0015, D]} />
          </mesh>
        ))}
        <mesh ref={filmRef} material={built.filmMat} position={[0, topY + 0.006, 0]}>
          <boxGeometry args={[W, 0.005, D]} />
        </mesh>
      </group>

      {/* comparison specimens — illustrative renders */}
      <group ref={trioRef} visible={false}>
        <mesh position={[0, 0, 0]} material={built.birchMats} ref={(el) => (specimenRefs.current[1] = el)}>
          <boxGeometry args={[1.1, 0.05, 0.68, 44, 1, 30]} />
        </mesh>
        <mesh position={[1.3, 0, 0]} material={built.softMats} ref={(el) => (specimenRefs.current[2] = el)}>
          <boxGeometry args={[1.1, 0.05, 0.68, 44, 1, 30]} />
        </mesh>
        {[-1.3, 0, 1.3].map((x, i) => (
          <group key={i}>
            <mesh ref={(el) => (ballRefs.current[i] = el)} position={[x, 1.6, 0]} material={built.steel} visible={false}>
              <sphereGeometry args={[0.075, 32, 32]} />
            </mesh>
            <mesh
              ref={(el) => (dentRefs.current[i] = el)}
              position={[x, 0.027, 0]}
              rotation={[-Math.PI / 2, 0, i * 1.9]}
            >
              <circleGeometry args={[0.16, 32]} />
              <meshBasicMaterial map={built.damageDecals[i]} transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  )
}

/* ── canvas shell ─────────────────────────────────────────────────────── */

export default function ExperienceCanvas() {
  // phone GPU profile, learned the hard way:
  // - Apple GPUs are TBDR — MSAA is close to free there, and turning it off
  //   made iPhone edges visibly jagged (owner feedback). AA stays ON for
  //   WebKit; it is OFF only on non-WebKit phones (Mali/Adreno, where the
  //   fullscreen resolve genuinely costs a big slice of the frame).
  // - Budget Androids (deviceMemory <= 4 — Chrome-only signal, Safari never
  //   exposes it) render at 1× for a stable frame rate.
  const light = wantsLightAssets()
  const wk = navigator.vendor === 'Apple Computer, Inc.'
  const lowTier = light && (navigator.deviceMemory || 8) <= 4

  // sections 06–09 sit below the experience wrapper, so the canvas is fully
  // offscreen there — the rig then draws nothing (xp.live, read in useFrame)
  // instead of shading a fullscreen scene nobody sees. NOTE: deliberately
  // not R3F's frameloop="never" — that risks a frozen canvas on resume and
  // could not be verified headlessly; emptying the scene is reversible.
  const hostRef = useRef(null)
  useEffect(() => {
    const el = hostRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => (xp.live = e.isIntersecting), {
      rootMargin: '15% 0px',
    })
    io.observe(el)
    return () => {
      io.disconnect()
      xp.live = true
    }
  }, [])

  return (
    <div ref={hostRef} className="h-full w-full">
      <Canvas
        dpr={lowTier ? 1 : light ? [1, 1.5] : [1, 1.8]}
        camera={{ fov: 30, position: [2.7, 1.6, 3.6] }}
        gl={{ antialias: !light || wk, alpha: false, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ camera, gl }) => {
          // opaque canvas cleared to the exact page ink: identical look to the
          // old transparent canvas over the ink DOM, but the compositor no
          // longer alpha-blends a fullscreen 3D layer every frame (Safari!).
          // setClearColor bypasses tone mapping — <color attach="background">
          // would get ACES-shifted and seam against the DOM background.
          gl.setClearColor('#17120D', 1)
          if (import.meta.env.DEV) {
            window.__cam = camera
            window.__gl = gl
          }
        }}
      >
        <ambientLight intensity={LIGHTS.ambient} />
        <directionalLight {...LIGHTS.key} />
        <directionalLight {...LIGHTS.rim} />
        <Rig />
      </Canvas>
    </div>
  )
}
