import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, initReveals } from './lib/fx.js'
import { xp, measureRanges } from './lib/xp.js'
import { useMotion } from './lib/motion.jsx'

import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import HUD from './components/HUD.jsx'
import DirectoryOverlay from './components/DirectoryOverlay.jsx'

import S01Hero from './components/sections/S01Hero.jsx'
import S02Surface from './components/sections/S02Surface.jsx'
import S03Material from './components/sections/S03Material.jsx'
import S04Shield from './components/sections/S04Shield.jsx'
import S05Impact from './components/sections/S05Impact.jsx'
import S06Grain from './components/sections/S06Grain.jsx'
import S07Work from './components/sections/S07Work.jsx'
import S08Process from './components/sections/S08Process.jsx'
import S09Quote from './components/sections/S09Quote.jsx'

const ExperienceCanvas = lazy(() => import('./components/Experience.jsx'))

// WebKit (Safari on Mac + every iPhone browser) composites blend-modes,
// backdrop-filter and animated overlays far slower than Blink — index.css
// swaps those for cheap equivalents under the .wk class. Lives here (not
// main.jsx) so it also runs when a host shell mounts <App/> via its own
// entry. vendor is the reliable engine check: all WebKit, never Blink.
if (typeof navigator !== 'undefined' && navigator.vendor === 'Apple Computer, Inc.') {
  document.documentElement.classList.add('wk')
}

export default function App() {
  const { fx, webgl } = useMotion()
  const [started, setStarted] = useState(false)
  const [dirOpen, setDirOpen] = useState(false)
  const lenisRef = useRef(null)
  const mainRef = useRef(null)
  const xpRef = useRef(null)
  const use3d = fx && webgl

  // smooth scroll + ScrollTrigger clock
  useEffect(() => {
    if (!fx) return
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
    lenisRef.current = lenis
    if (import.meta.env.DEV) window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [fx])

  // one master trigger drives the whole 4D experience (sections 01–05)
  useEffect(() => {
    if (!use3d) return
    const wrapper = xpRef.current
    const measure = () => measureRanges(wrapper)
    measure()
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        xp.p = self.progress
      },
      onRefresh: measure,
    })
    window.addEventListener('resize', measure)
    return () => {
      st.kill()
      window.removeEventListener('resize', measure)
    }
  }, [use3d])

  // scroll lock while the curtain is up — NEVER by toggling overflow on
  // <html>: WebKit rebuilds position:sticky constraints from the state at
  // release and a cold-load toggle leaves them stale (canvas stops pinning;
  // hero renders, every section after it is blank until a full reload).
  // Lenis owns wheel/touch scrolling, so stopping it IS the desktop lock;
  // scroll keys are swallowed separately and the curtain's touch-action:none
  // blocks touch gestures.
  useEffect(() => {
    const lenis = lenisRef.current
    if (started) {
      lenis?.start()
      return
    }
    lenis?.stop()
    const KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']
    const onKey = (e) => KEYS.includes(e.key) && e.preventDefault()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, fx])

  // JIT/pipeline warm-up behind the curtain: once the rig is ready, sweep
  // the page through the hero scroll range and back (~48 frames) so every
  // handler on the scroll path — ScrollTrigger scrub, the hero fade, HUD,
  // the scene's useFrame with real pose inputs — executes dozens of times
  // BEFORE the user's first gesture. JavaScriptCore only compiles hot code
  // after it has run; without this, the user's first scrolls execute
  // interpreted and read as "the hero lags, then it's fine". The sweep is
  // invisible (opaque curtain), stays inside the hero (never deep enough
  // to fire section reveals), and always restores scrollY 0. The preloader
  // gates on xp:warmed so the curtain can't lift mid-sweep.
  useEffect(() => {
    if (!use3d) return
    let raf = 0
    let timer = 0
    let done = false
    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(raf)
      window.scrollTo(0, 0)
      window.dispatchEvent(new Event('xp:warmed'))
    }
    const onReady = () => {
      const depth = window.innerHeight * 1.1
      const FRAMES = 48
      let k = 0
      const step = () => {
        if (done) return
        k++
        const tri = k <= FRAMES / 2 ? k / (FRAMES / 2) : 2 - k / (FRAMES / 2)
        window.scrollTo(0, Math.max(0, depth * tri))
        if (k < FRAMES) raf = requestAnimationFrame(step)
        else finish()
      }
      raf = requestAnimationFrame(step)
      // failsafe: never leave the page scrolled or the preloader gated
      // (hidden tabs suspend rAF; timers still fire)
      timer = setTimeout(finish, 2500)
    }
    window.addEventListener('xp:rig-ready', onReady, { once: true })
    return () => {
      window.removeEventListener('xp:rig-ready', onReady)
      clearTimeout(timer)
      finish()
    }
  }, [use3d])

  useEffect(() => {
    const cleanup = initReveals(mainRef.current, { reduced: !fx })
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      cleanup()
      clearTimeout(t)
    }
  }, [fx])

  // re-measure whenever the document can have changed height AFTER the
  // initial measurements: preloader lift, late webfonts (production shells
  // load them post-onload), and window load. Without this, first-load phase
  // positions are stale on iOS until something else triggers a refresh —
  // the "works after backgrounding the tab" bug.
  useEffect(() => {
    if (!started) return
    const refresh = () => ScrollTrigger.refresh()
    // WebKit can leave position:sticky constraints stale on a cold load —
    // invalidate them once (relative → reflow → sticky), then re-measure
    const nudge = () => {
      const stickies = document.querySelectorAll('.sticky')
      stickies.forEach((el) => (el.style.position = 'relative'))
      void document.body.offsetHeight
      stickies.forEach((el) => (el.style.position = ''))
      refresh()
    }
    const raf = requestAnimationFrame(nudge)
    // late re-measures (webfonts landing, window load) are heavy layout
    // passes — schedule them for a scroll-idle moment so they never eat
    // the user's first scrolled frames. Each scroll event pushes the
    // pending refresh back until ~200ms of quiet.
    let pending = false
    let idleTimer = 0
    let deadline = 0
    const flush = () => {
      pending = false
      refresh()
    }
    const attempt = () => {
      clearTimeout(idleTimer)
      if (!pending) return
      // a continuous scroll must never starve the re-measure forever —
      // past the deadline, take the one-frame refresh hit mid-scroll
      if (performance.now() >= deadline) {
        flush()
        return
      }
      idleTimer = setTimeout(() => pending && flush(), 200)
    }
    const schedule = () => {
      pending = true
      deadline = performance.now() + 4000
      attempt()
    }
    const onScroll = () => pending && attempt()
    window.addEventListener('scroll', onScroll, { passive: true })
    if (document.fonts?.ready) document.fonts.ready.then(schedule).catch(() => {})
    window.addEventListener('load', schedule)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      window.removeEventListener('load', schedule)
      window.removeEventListener('scroll', onScroll)
    }
  }, [started])

  useEffect(() => {
    // pre-start, the curtain lock owns Lenis — don't start it from here
    if (!lenisRef.current || !started) return
    dirOpen ? lenisRef.current.stop() : lenisRef.current.start()
  }, [dirOpen, started])

  const scrollTo = useCallback((target) => {
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.4 })
    else document.querySelector(target)?.scrollIntoView()
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      e.preventDefault()
      scrollTo(a.getAttribute('href'))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scrollTo])

  const onPreloadDone = useCallback(() => setStarted(true), [])

  return (
    <div className="grain">
      <Preloader onDone={onPreloadDone} />
      <Cursor />
      <HUD onOpenDirectory={() => setDirOpen(true)} />
      <DirectoryOverlay open={dirOpen} onClose={() => setDirOpen(false)} scrollTo={scrollTo} />

      <main ref={mainRef}>
        {/* the 4D experience: one persistent scene under sections 01–05 */}
        <div ref={xpRef} className="relative bg-ink">
          {use3d && (
            <div className="sticky top-0 h-viewport -mb-viewport z-0 pointer-events-none">
              <Suspense fallback={null}>
                <ExperienceCanvas />
              </Suspense>
            </div>
          )}
          <div className="relative z-10">
            <S01Hero started={started} />
            <S02Surface />
            <S03Material />
            <S04Shield />
            <S05Impact />
          </div>
        </div>

        <S06Grain />
        <S07Work />
        <S08Process />
        <S09Quote />
      </main>
    </div>
  )
}
