import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../lib/fx.js'
import { useMotion } from '../lib/motion.jsx'
import { rigTextureUrls, wantsLightAssets } from '../lib/textures.js'

/* static-fallback assets (no-WebGL / reduced-motion path) */
const PRELOAD_STATIC = [
  '/images/plywood-cutout-1x.png',
  '/images/textures/beech-face.jpg',
  '/images/textures/ply-edge.jpg',
  '/images/cildro-logo.webp',
]

export default function Preloader({ onDone }) {
  const { reduced, webgl } = useMotion()
  const use3d = !reduced && webgl
  const rootRef = useRef(null)
  const [pct, setPct] = useState(0)
  const [stamped, setStamped] = useState(false)

  // 3D path: the curtain tracks EVERY rig texture (device-sized set), the
  // lazy three.js/Experience chunk, and the rig's own ready signal — on
  // production networks these arrive seconds after the DOM, and lifting
  // early means scrolling into an empty scene
  const preload = useMemo(
    () =>
      use3d
        ? [...rigTextureUrls(wantsLightAssets()), '/images/cildro-logo.webp']
        : PRELOAD_STATIC,
    [use3d]
  )

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }
    // scroll lock: desktop only. Toggling overflow on <html> leaves WebKit's
    // position:sticky constraints stale after release (broken pinning on iOS
    // until the tab is backgrounded) — on touch, the curtain itself blocks
    // scroll gestures via touch-action:none instead.
    const lockScroll = window.matchMedia('(pointer: fine)').matches
    if (lockScroll) document.documentElement.style.overflow = 'hidden'
    let loaded = 0
    let display = 0
    let done = false
    const start = performance.now()
    // +1 chunk, +1 rig-ready (3D only)
    const total = preload.length + (use3d ? 2 : 0)

    preload.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => (loaded += 1)
      img.src = src
    })
    let onRig = null
    if (use3d) {
      // same chunk App lazy-loads — Vite dedupes, this just starts it NOW
      import('./Experience.jsx').then(
        () => (loaded += 1),
        () => (loaded += 1)
      )
      onRig = () => (loaded += 1)
      window.addEventListener('xp:rig-ready', onRig, { once: true })
    }

    const iv = setInterval(() => {
      const elapsed = performance.now() - start
      // safety valve: a WebGL/network failure must never trap the visitor
      const real = elapsed > 12000 ? 100 : (loaded / total) * 100
      const minTime = Math.min((elapsed / 1400) * 100, 100)
      display = Math.min(real, minTime)
      setPct(Math.round(display))
      if (display >= 100 && !done) {
        done = true
        clearInterval(iv)
        setStamped(true)
        const finish = () => {
          document.documentElement.style.overflow = ''
          onDone()
        }
        if (document.hidden) {
          // background tab: rAF (and gsap) is suspended — skip straight to the site
          gsap.set(rootRef.current, { yPercent: -100 })
          finish()
        } else {
          gsap
            .timeline({ delay: 0.75 })
            .to(rootRef.current, {
              yPercent: -100,
              duration: 0.85,
              ease: 'power4.inOut',
            })
            .add(finish)
        }
      }
    }, 40)
    return () => {
      clearInterval(iv)
      if (onRig) window.removeEventListener('xp:rig-ready', onRig)
      document.documentElement.style.overflow = ''
    }
  }, [reduced, onDone, preload, use3d])

  if (reduced) return null
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[120] bg-ink text-bone flex flex-col items-center justify-center touch-none overscroll-contain"
      aria-hidden="true"
    >
      <div className="mlabel text-bone/50 mb-6">CILDRO PLYWOOD — MILL FILE 2013—2026</div>
      <div className="relative flex items-center justify-center h-32">
        <span
          className={`stamp text-accent text-lg md:text-2xl transition-transform duration-150 ${
            stamped ? 'scale-100 opacity-100' : 'scale-[2.2] opacity-0'
          }`}
        >
          Graded &amp; Approved
        </span>
      </div>
      <div className="font-display text-6xl md:text-8xl tabular-nums mt-6">{pct}%</div>
      <div className="w-56 h-px bg-bone/15 mt-6 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
