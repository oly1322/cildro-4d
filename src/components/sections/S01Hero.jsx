import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, splitChars } from '../../lib/fx.js'
import { useMotion } from '../../lib/motion.jsx'
import copy from '../../content/copy.js'

/* ── live clocks ticker ───────────────────────────────────────────────── */

function useClocks() {
  const [times, setTimes] = useState({})
  useEffect(() => {
    const fmt = () => {
      const next = {}
      copy.hero.ticker.forEach(({ city, tz }) => {
        next[city] = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: tz,
        }).format(new Date())
      })
      setTimes(next)
    }
    fmt()
    const iv = setInterval(fmt, 1000)
    return () => clearInterval(iv)
  }, [])
  return times
}

function Ticker() {
  const times = useClocks()
  const cells = copy.hero.ticker.map(({ city }) => (
    <span key={city} className="mlabel text-bone/60 flex items-center gap-3 px-8 whitespace-nowrap">
      <span className="w-1.5 h-1.5 bg-accent inline-block" aria-hidden="true" />
      {city} <span className="text-bone tabular-nums">{times[city] || '--:--:--'}</span>
    </span>
  ))
  return (
    <div
      className="marquee border-t border-bone/10 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-ink/60 md:bg-ink/40 md:backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="marquee-track">{cells}{cells}{cells}</div>
      <div className="marquee-track" aria-hidden="true">{cells}{cells}{cells}</div>
    </div>
  )
}

/* ── section 01: copy overlay above the shared 4D canvas ─────────────── */

export default function S01Hero({ started }) {
  const { fx, webgl } = useMotion()
  const sectionRef = useRef(null)
  const copyRef = useRef(null)
  const h1Ref = useRef(null)
  const use3d = fx && webgl

  useEffect(() => {
    if (!started) return
    const chars = splitChars(h1Ref.current)
    if (!fx) {
      gsap.set(chars, { y: 0 })
      return
    }
    gsap.to(chars, { y: 0, duration: 0.9, stagger: 0.016, ease: 'power4.out', delay: 0.15 })
    gsap.fromTo(
      copyRef.current.querySelectorAll('.hero-fade'),
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.09, duration: 0.8, delay: 0.5, ease: 'power3.out' }
    )
  }, [started, fx])

  // copy falls away as the camera starts moving
  useEffect(() => {
    if (!fx) return
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const fade = Math.max(0, 1 - self.progress * 2.2)
        copyRef.current.style.opacity = fade
        copyRef.current.style.transform = `translateY(${self.progress * -70}px)`
        copyRef.current.style.pointerEvents = self.progress > 0.2 ? 'none' : ''
      },
    })
    return () => st.kill()
  }, [fx])

  const wa = `https://wa.me/${copy.contact.phoneRaw}`

  return (
    <section id="hero" data-section="hero" ref={sectionRef} className={fx ? 'h-[220vh]' : ''}>
      <div className={`relative h-viewport overflow-hidden ${fx ? 'sticky top-0' : ''}`}>
        {/* static fallback */}
        {!use3d && (
          <img
            src="/images/plywood-cutout-1x.png"
            srcSet="/images/plywood-cutout-1x.png 1x, /images/plywood-cutout-2x.png 2x"
            alt="Stack of Cildro 100% beech plywood sheets with layered ply edges"
            className="absolute right-0 bottom-[12%] w-[92%] max-w-[720px] object-contain opacity-90 md:left-auto md:right-6"
          />
        )}
        {/* scrim: vertical on phones (copy top + CTAs bottom, panel visible
            through the clear middle), side gradient on desktop */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-ink/90 via-ink/5 to-ink/85 md:bg-gradient-to-r md:from-ink md:via-ink/55 md:to-transparent md:w-[72%]"
          aria-hidden="true"
        />

        {/* copy */}
        <div
          ref={copyRef}
          className="relative z-10 h-full flex flex-col justify-start md:justify-center px-5 md:px-16 max-w-[920px] pt-24 md:pt-16 pb-28"
        >
          <p className="hero-fade mlabel text-accent mb-4 flex items-center gap-3">
            <span className="regmark" aria-hidden="true" />
            {copy.hero.banner}
          </p>
          <h1
            ref={h1Ref}
            className="h-display text-[10.5vw] md:text-[min(4.4rem,7vh)] lg:text-[min(5rem,7.2vh)] xl:text-[min(5.6rem,7.4vh)] max-w-[16ch]"
          >
            {copy.hero.headline}
          </h1>
          <p className="hero-fade font-body text-[13px] md:text-[15px] text-bone/70 max-w-[58ch] mt-4 leading-relaxed">
            {copy.hero.sub}
          </p>

          {/* phones: the standing panel gets the middle of the screen */}
          <div className="flex-1 md:hidden" aria-hidden="true" />

          <div className="hero-fade grid grid-cols-2 gap-3 mt-6 sm:flex sm:flex-wrap">
            <a href="#quote" className="btn btn-accent" data-cursor="link">{copy.hero.ctas.primary}</a>
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn-wa" data-cursor="link">{copy.hero.ctas.whatsapp}</a>
            <a
              href={`mailto:${copy.contact.email}?subject=${encodeURIComponent('Free sample box request')}`}
              className="btn btn-ghost col-span-2 sm:col-auto"
              data-cursor="link"
              title={copy.hero.ctas.samplesNote}
            >
              {copy.hero.ctas.samples}
            </a>
          </div>
          <p className="hero-fade font-mono text-[10px] text-bone/40 mt-3 max-w-[60ch] hidden sm:block">
            {copy.hero.ctas.samplesNote}
          </p>

          <div className="hero-fade grid grid-cols-3 gap-px bg-bone/10 border border-bone/10 mt-4 md:mt-7 max-w-xl">
            {copy.hero.stats.map((st) => (
              <div key={st.label} className="bg-ink/80 px-2.5 py-2 md:px-4 md:py-3">
                <div className="font-display text-lg md:text-2xl text-honey">
                  {st.value}
                  <span className="text-xs md:text-sm ml-1 text-bone/50 font-mono">{st.unit}</span>
                </div>
                <div className="mlabel text-bone/50 mt-1">{st.note}</div>
              </div>
            ))}
          </div>

          <div className="hero-fade hidden md:flex flex-wrap gap-x-6 gap-y-2 mt-5 mlabel text-bone/45">
            {copy.hero.badges.map((b) => (
              <span key={b} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-accent inline-block" aria-hidden="true" />
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10">
          <div className="flex justify-between px-5 md:px-8 pb-2">
            <span className="mlabel text-bone/40">FIG. 01 — product: 100% beech multiply</span>
            <span className="mlabel text-bone/40 animate-pulse">(scroll down)</span>
          </div>
          <Ticker />
        </div>
      </div>
    </section>
  )
}
