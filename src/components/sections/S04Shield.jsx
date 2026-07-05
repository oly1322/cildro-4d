import { useState } from 'react'
import { xp } from '../../lib/xp.js'
import { useMotion } from '../../lib/motion.jsx'
import copy from '../../content/copy.js'

function Toggle({ label, options, value, onPick }) {
  return (
    <div className="flex-1 md:flex-none">
      <p className="mlabel text-bone/50 mb-2 md:mb-3">{label}</p>
      <div className="flex gap-px bg-bone/20 border border-bone/20 w-full md:w-max">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            aria-pressed={value === o.id}
            data-cursor="view"
            className={`flex-1 md:flex-none px-3 md:px-5 py-3.5 md:py-4 font-mono text-[11px] uppercase tracking-micro transition-colors ${
              value === o.id ? 'bg-accent text-ink' : 'bg-ink/80 text-bone hover:bg-ink3'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * 04 / CILDRO SHIELD — the veneers reassemble and the anti-slip phenolic
 * film descends onto the face. Film color + weight are live options.
 */
export default function S04Shield() {
  const { fx, webgl } = useMotion()
  const [filmColor, setFilmColor] = useState('dark')
  const [filmWeight, setFilmWeight] = useState('120')
  const use3d = fx && webgl

  return (
    <section id="shield" data-section="shield">
      {/* the sticky viewport pins for the full 280vh; the product trio follows after */}
      <div className={fx ? 'h-[280vh]' : ''}>
        <div className={`relative h-viewport overflow-hidden ${fx ? 'sticky top-0' : ''} pointer-events-none`}>
        <div className="absolute top-20 md:top-24 inset-x-5 md:inset-x-8 flex items-start justify-between">
          <div>
            <p className="mlabel text-accent mb-3">04 / {copy.shield.eyebrow} — film application</p>
            <h2 className="h-display text-3xl md:text-6xl text-bone max-w-[13ch]">
              Then we <span className="outline-text">armor it.</span>
            </h2>
            <p className="font-body text-sm md:text-base text-bone/65 mt-4 max-w-[40ch]">{copy.shield.desc}</p>
          </div>
          <span className="mlabel text-bone/40 hidden md:block pt-2">FIG. 04 — anti-slip film</span>
        </div>

        {/* static fallback: phenolic swatch */}
        {!use3d && (
          <div
            className="absolute inset-x-5 bottom-44 md:left-auto md:right-8 md:w-[50%] aspect-video border border-bone/20"
            style={{
              backgroundColor: '#2e1d12',
              background:
                'radial-gradient(120% 90% at 30% 0%, rgba(255,214,160,0.16), transparent 55%), repeating-linear-gradient(45deg, rgba(255,190,130,0.1) 0 1.5px, transparent 1.5px 7px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.4) 0 1.5px, transparent 1.5px 7px), linear-gradient(#33200f, #2a1a0e)',
            }}
            role="img"
            aria-label="Representative phenolic film anti-slip surface"
          />
        )}

        {/* film options */}
        <div className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-10 inset-x-5 md:inset-x-8 flex items-end justify-between flex-wrap gap-3 md:gap-6 pointer-events-auto">
          <div className="flex gap-3 md:gap-6 flex-wrap w-full md:w-auto">
            <Toggle
              label={copy.shield.films.label}
              options={copy.shield.films.options}
              value={filmColor}
              onPick={(id) => {
                setFilmColor(id)
                xp.filmColor = id
              }}
            />
            <Toggle
              label={copy.shield.weights.label}
              options={copy.shield.weights.options}
              value={filmWeight}
              onPick={(id) => {
                setFilmWeight(id)
                xp.filmWeight = id
              }}
            />
          </div>
          <span className="mlabel text-accent">{copy.shield.hint}</span>
        </div>
        </div>
      </div>

      {/* one beech, built three ways — approved product trio */}
      <div className="relative z-10 bg-ink px-5 md:px-8 py-20 md:py-28 rule-t">
        <h3 className="h-display text-[9vw] md:text-6xl text-bone" data-reveal>
          One beech. <span className="outline-text">Built three ways.</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-px bg-bone/10 border border-bone/10 mt-10">
          {copy.products.items.map((p, i) => (
            <article key={p.id} className="bg-ink2 p-6">
              <header className="flex items-baseline justify-between mb-4">
                <h4 className="font-display uppercase text-2xl text-bone">{p.name}</h4>
                {p.flag ? (
                  <span className="stamp text-accent text-[9px] !rotate-[4deg]">{p.flag}</span>
                ) : (
                  <span className="mlabel text-bone/40">REF. 0{i + 1}-B750</span>
                )}
              </header>
              <p className="font-body text-sm text-bone/70 leading-relaxed">{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
