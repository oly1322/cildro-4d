import { useEffect, useRef } from 'react'
import { useMotion } from '../../lib/motion.jsx'
import copy from '../../content/copy.js'

/**
 * 06 / GRAIN INSPECTOR — cursor is a flashlight over a macro of the real
 * beech face (cropped from the site's plywood-cutout photography).
 */
export default function S06Grain() {
  const { fx } = useMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (!fx) return
    const el = ref.current
    const lit = el.querySelector('.flashlight-lit')
    const set = (x, y) => {
      const r = el.getBoundingClientRect()
      lit.style.setProperty('--mx', `${((x - r.left) / r.width) * 100}%`)
      lit.style.setProperty('--my', `${((y - r.top) / r.height) * 100}%`)
    }
    const onMove = (e) => set(e.clientX, e.clientY)
    const onTouch = (e) => e.touches[0] && set(e.touches[0].clientX, e.touches[0].clientY)
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('touchmove', onTouch)
    }
  }, [fx])

  return (
    <section
      id="grain"
      data-section="grain"
      ref={ref}
      className="relative bg-ink rule-t h-[90vh] md:h-screen overflow-hidden"
      data-cursor="inspect"
    >
      {/* dim base layer */}
      <img
        src="/images/textures/grain-macro.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover ${fx ? 'brightness-[0.22] saturate-[0.6]' : 'brightness-90'}`}
      />
      {/* lit layer revealed by the flashlight */}
      {fx && (
        <img
          src="/images/textures/grain-macro.jpg"
          alt="Macro of real Cildro beech grain — fine, dense fiber with warm honey tone"
          loading="lazy"
          className="flashlight-lit absolute inset-0 h-full w-full object-cover scale-[1.02]"
        />
      )}

      <div className="absolute top-16 md:top-20 inset-x-5 md:inset-x-8 flex items-start justify-between pointer-events-none">
        <div>
          <p className="mlabel text-accent mb-3">06 / Grain inspector — the vault</p>
          <h2 className="h-display text-4xl md:text-7xl text-bone mix-blend-difference">
            Read the <span className="outline-text">fiber.</span>
          </h2>
        </div>
        <span className="mlabel text-bone/50 hidden md:block pt-2">FIG. 06 — macro, real panel</span>
      </div>

      <div className="absolute bottom-8 inset-x-5 md:inset-x-8 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {copy.grain.labels.map((l) => (
            <span key={l} className="mlabel text-bone/60 flex items-center gap-2">
              <span className="w-1 h-1 bg-accent" aria-hidden="true" />{l}
            </span>
          ))}
        </div>
        <span className="mlabel text-bone/70 animate-pulse">{copy.grain.hint}</span>
      </div>
    </section>
  )
}
