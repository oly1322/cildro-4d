import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/fx.js'
import { useMotion } from '../../lib/motion.jsx'
import ImageSlot from '../ImageSlot.jsx'
import copy from '../../content/copy.js'

function Bar({ pct, label }) {
  return (
    <div className="mt-2.5">
      <div className="mlabel opacity-60 mb-1">{label}</div>
      <div className="h-1.5 bg-bone/15 relative overflow-hidden">
        <div className="stat-bar absolute inset-y-0 left-0 bg-accent origin-left" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/**
 * 05 / THE IMPACT TEST — three panels, one steel ball each.
 * Softwood dents, birch holds, beech shrugs (live 3D, scroll-driven).
 */
export default function S05Impact() {
  const { fx, webgl } = useMotion()
  const sectionRef = useRef(null)
  const use3d = fx && webgl

  useEffect(() => {
    if (!fx) return
    const bars = sectionRef.current.querySelectorAll('.stat-bar')
    gsap.set(bars, { scaleX: 0 })
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate: (self) => {
        bars.forEach((b, i) => {
          const local = gsap.utils.clamp(0, 1, self.progress * 2.2 - 0.35 - i * 0.05)
          b.style.transform = `scaleX(${local})`
        })
      },
    })
    return () => st.kill()
  }, [fx])

  return (
    <section id="impact" data-section="impact" ref={sectionRef} className={fx ? 'h-[300vh]' : ''}>
      <div className={`relative h-viewport overflow-hidden ${fx ? 'sticky top-0' : ''} pointer-events-none`}>
        <div className="absolute top-20 md:top-24 inset-x-5 md:inset-x-8 flex items-start justify-between">
          <div>
            <p className="mlabel text-accent mb-3">05 / How beech stacks up — lab report</p>
            <h2 className="h-display text-3xl md:text-6xl text-bone max-w-[14ch]">
              The strongest <span className="outline-text">panel</span> in the room.
            </h2>
            <p className="font-body text-sm md:text-base text-bone/65 mt-4 max-w-[44ch]">{copy.impact.sub}</p>
          </div>
          <span className="mlabel text-bone/40 hidden md:block pt-2 text-right">
            FIG. 05 — ball-impact test<br />
            <span className="opacity-60">(illustrative 3D renders)</span>
          </span>
        </div>

        {/* static fallback: photo slots */}
        {!use3d && (
          <div className="absolute inset-x-5 md:inset-x-8 top-[38%] grid grid-cols-3 gap-4 text-bone/40">
            {copy.impact.rows.map((r) => (
              <ImageSlot key={r.id} name={r.img} caption={r.caption} ratio="4/3" />
            ))}
          </div>
        )}

        {/* stat columns over the three specimens — snap carousel on phones
            (cards in the same top→bottom order as the specimens on screen) */}
        <div className="absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] md:bottom-8 inset-x-0 md:inset-x-8">
          <p className="md:hidden mlabel text-bone/35 text-right px-5 mb-1.5">(swipe cards)</p>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 pointer-events-auto md:pointer-events-none md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
            {copy.impact.rows.map((r) => (
              <div
                key={r.id}
                className="snap-center shrink-0 w-[78%] md:w-auto md:shrink md:snap-align-none bg-ink/85 md:bg-ink/70 md:backdrop-blur-sm border border-bone/15 px-4 py-3 md:py-4"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className={`font-display uppercase text-lg md:text-xl ${r.id === 'beech' ? 'text-accent' : 'text-bone'}`}>
                    {r.name}
                  </h3>
                  <span className="font-display text-lg text-bone/70">
                    {r.density}
                    <span className="font-mono text-[9px] ml-1 opacity-60">kg/m³</span>
                  </span>
                </div>
                <Bar pct={(r.density / 750) * 100} label={`density — ${r.densityLabel}`} />
                <Bar pct={r.hardnessPct} label={`hardness — ${r.hardness}`} />
                <Bar pct={r.bendingPct} label={`bending — ${r.bending}`} />
                <p className={`mlabel mt-2.5 md:mt-3 ${r.id === 'beech' ? 'text-accent' : 'text-bone/50'}`}>
                  VERDICT: {r.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
