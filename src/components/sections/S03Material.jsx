import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/fx.js'
import { xp } from '../../lib/xp.js'
import { useIsMobile, useMotion } from '../../lib/motion.jsx'
import copy from '../../content/copy.js'

/**
 * 03 / THE MATERIAL — the panel explodes into its ~2.6 mm veneers
 * (long grain / cross grain) with the glue line made visible.
 */
export default function S03Material() {
  const { fx, webgl } = useMotion()
  const mobile = useIsMobile()
  const sectionRef = useRef(null)
  const calloutsRef = useRef(null)
  const [glue, setGlue] = useState('phenolic')
  const use3d = fx && webgl

  useEffect(() => {
    if (!fx) return
    const callouts = calloutsRef.current.querySelectorAll('.callout')
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        callouts.forEach((c, i) => {
          const at = 0.18 + i * 0.16
          const vis = gsap.utils.clamp(0, 1, (self.progress - at) * 9)
          c.style.opacity = vis
          c.style.transform = `translateY(${(1 - vis) * 14}px)`
        })
      },
    })
    return () => st.kill()
  }, [fx])

  const pick = (id) => {
    setGlue(id)
    xp.glue = id
  }

  return (
    <section id="material" data-section="material" ref={sectionRef} className={fx ? 'h-[280vh]' : ''}>
      <div className={`relative h-viewport overflow-hidden ${fx ? 'sticky top-0' : ''} pointer-events-none`}>
        <div className="absolute top-20 md:top-24 inset-x-5 md:inset-x-8 flex items-start justify-between">
          <div>
            <p className="mlabel text-accent mb-3">03 / {copy.material.eyebrow} — assembly protocol</p>
            <h2 className="h-display text-3xl md:text-6xl text-bone">
              One species.<br />
              <span className="outline-text">Every single ply.</span>
            </h2>
          </div>
          <span className="mlabel text-bone/40 hidden md:block pt-2">FIG. 03 — exploded view</span>
        </div>

        {/* static fallback: CSS layer stack */}
        {!use3d && (
          <div className="h-full flex items-center justify-center" aria-hidden="true">
            <div className="flex flex-col gap-2.5 w-[70%] max-w-md" style={{ transform: 'rotateX(55deg) rotateZ(-32deg)' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 border border-ink/40"
                  style={{ backgroundImage: 'url(/images/textures/ply-edge.jpg)', backgroundSize: 'cover' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* monospace callouts */}
        <div ref={calloutsRef}>
          {copy.material.callouts.map((c, i) => (
            <div
              key={c}
              className={`callout absolute mlabel text-bone flex items-center gap-2 md:gap-3 ${
                i % 2 ? 'right-5 md:right-16 text-right flex-row-reverse' : 'left-5 md:left-16'
              }`}
              style={{ top: mobile ? `${32 + i * 9}%` : `${42 + i * 12}%`, opacity: fx ? 0 : 1 }}
            >
              <span className="w-6 md:w-20 h-px bg-accent" aria-hidden="true" />
              <span className="border border-bone/25 bg-ink/85 md:bg-ink/70 md:backdrop-blur px-2.5 py-1.5 md:px-3 md:py-2">{c}</span>
            </div>
          ))}
        </div>

        {/* glue picker + veneer note */}
        <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-10 inset-x-5 md:inset-x-8 flex flex-col md:flex-row md:items-end md:justify-between md:flex-wrap gap-3 md:gap-4 pointer-events-auto">
          <div>
            <p className="mlabel text-bone/50 mb-2 md:mb-3">{copy.material.glue.label}</p>
            <div className="flex gap-px bg-bone/20 border border-bone/20 w-full md:w-max">
              {copy.material.glue.options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => pick(o.id)}
                  aria-pressed={glue === o.id}
                  data-cursor="view"
                  className={`flex-1 md:flex-none px-4 md:px-5 py-3.5 md:py-4 font-mono text-[11px] uppercase tracking-micro transition-colors ${
                    glue === o.id ? 'bg-accent text-ink' : 'bg-ink/80 text-bone hover:bg-ink3'
                  }`}
                >
                  {o.label}
                  <span className="block text-[9px] opacity-60 normal-case mt-0.5">{o.note}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mlabel text-bone/45 flex justify-between md:block md:text-right">
            <span className="block">{copy.material.veneerNote}</span>
            <span className="block md:mt-1 text-bone/30">(scroll to explode)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
