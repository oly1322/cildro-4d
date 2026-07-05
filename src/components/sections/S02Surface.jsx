import { useState } from 'react'
import { xp } from '../../lib/xp.js'
import { useMotion } from '../../lib/motion.jsx'
import copy from '../../content/copy.js'

const GRADES = [
  { id: 'e', label: 'E' },
  ...copy.showroom.grades.map((g) => ({ id: g.id, label: g.label })),
]

/**
 * 02 / THE SURFACE — the camera hangs above the panel; picking a grade
 * swaps the real face texture on the 3D sheet, live.
 */
export default function S02Surface() {
  const { fx, webgl } = useMotion()
  const [gradeId, setGradeId] = useState('e')
  const use3d = fx && webgl

  const grade = copy.showroom.grades.find((g) => g.id === gradeId)

  const pick = (id) => {
    setGradeId(id)
    xp.grade = id
  }

  return (
    <section id="surface" data-section="surface" className={fx ? 'h-[260vh]' : ''}>
      <div className={`relative h-viewport overflow-hidden ${fx ? 'sticky top-0' : ''} pointer-events-none`}>
        {/* headline (soft scrim keeps it readable over the pale wood) */}
        <div
          className="absolute top-20 md:top-24 inset-x-5 md:inset-x-8 flex items-start justify-between"
          style={{ textShadow: '0 2px 24px rgba(23,18,13,0.85), 0 0 6px rgba(23,18,13,0.5)' }}
        >
          <div>
            <p className="mlabel text-accent mb-3">02 / The surface — virtual showroom</p>
            <h2 className="h-display text-3xl md:text-6xl max-w-[15ch] text-bone">
              See exactly what arrives <span className="outline-text">on your truck.</span>
            </h2>
            <p className="font-body text-sm md:text-base text-bone/65 mt-4 max-w-[42ch]">{copy.showroom.sub}</p>
          </div>
          <span className="mlabel text-bone/40 hidden md:block pt-2">FIG. 02 — face inspection</span>
        </div>

        {/* static fallback */}
        {!use3d && grade && (
          <img
            src={grade.photo}
            alt={`Beech plywood quality grade ${grade.label} — mill photo`}
            className="absolute inset-x-5 bottom-40 md:left-auto md:right-8 md:w-[55%] aspect-video object-cover border border-bone/20"
          />
        )}

        {/* grade picker — phones: full-width thumb row with the info card above */}
        <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-10 inset-x-5 md:inset-x-8 pointer-events-auto">
          <div className="flex flex-col-reverse gap-3 md:flex-row md:items-end md:justify-between md:flex-wrap md:gap-4">
            <div>
              <p
                className="mlabel text-bone/60 mb-2 md:mb-3"
                style={{ textShadow: '0 1px 12px rgba(23,18,13,0.9), 0 0 4px rgba(23,18,13,0.6)' }}
              >
                Quality grade <span className="text-accent ml-2">{copy.showroom.hint}</span>
              </p>
              <div className="flex gap-px bg-bone/20 border border-bone/20 w-full md:w-max">
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => pick(g.id)}
                    aria-pressed={gradeId === g.id}
                    data-cursor="view"
                    className={`flex-1 md:flex-none md:w-16 py-3.5 md:py-4 font-display text-lg md:text-xl transition-colors ${
                      gradeId === g.id ? 'bg-accent text-ink' : 'bg-ink/80 text-bone hover:bg-ink3'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-auto md:max-w-xs bg-ink/85 md:bg-ink/70 md:backdrop-blur-sm border border-bone/15 px-4 py-2.5 md:py-3">
              <p className="mlabel text-bone/50 mb-1">Grade {gradeId.toUpperCase()} — raw beech</p>
              <p className="font-body text-xs text-bone/80 leading-relaxed min-h-[3em]">
                {gradeId === 'i'
                  ? copy.showroom.grades[0].desc
                  : 'Real mill-floor face — request the full grade catalogue with your quote.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
