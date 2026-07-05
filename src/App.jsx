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

  useEffect(() => {
    const cleanup = initReveals(mainRef.current, { reduced: !fx })
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      cleanup()
      clearTimeout(t)
    }
  }, [fx])

  useEffect(() => {
    if (!lenisRef.current) return
    dirOpen ? lenisRef.current.stop() : lenisRef.current.start()
  }, [dirOpen])

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
