import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/fx.js'
import { useMotion } from '../../lib/motion.jsx'
import copy from '../../content/copy.js'

/* ── sticky scrubbed how-it-works panels ─────────────────────────────── */

function Steps() {
  const { fx } = useMotion()
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)

  useEffect(() => {
    if (!fx) return
    const panels = stickyRef.current.querySelectorAll('.step-panel')
    const nums = stickyRef.current.querySelectorAll('.step-num')
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
    const shift = window.matchMedia('(max-width: 767px)').matches ? 32 : 60
    const FADE = 0.18

    // one window [i, i+1] per step: fade in, hold, fade out — the out-ramp
    // completes before the next panel starts fading in, so no two steps are
    // legible at the same time.
    const apply = (progress) => {
      const seg = progress * panels.length
      panels.forEach((p, i) => {
        const local = seg - i
        const isLast = i === panels.length - 1
        const fadeIn = i === 0 ? 1 : clamp01(local / FADE)
        const fadeOut = isLast ? 1 : 1 - clamp01((local - (1 - FADE)) / FADE)
        const o = local < 0 ? 0 : Math.min(fadeIn, fadeOut)
        p.style.opacity = o
        p.style.transform = `translateY(${(1 - fadeIn) * shift}px)`
        if (nums[i]) nums[i].style.opacity = o
      })
    }

    apply(0)

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => apply(self.progress),
    })
    return () => st.kill()
  }, [fx])


  if (!fx) {
    return (
      <div className="px-5 md:px-8 grid md:grid-cols-3 gap-8 py-16">
        {copy.process.steps.map((s) => (
          <div key={s.n} className="border border-bone/15 p-6">
            <div className="font-display text-5xl text-accent">{s.n}</div>
            <h3 className="font-body font-semibold text-xl mt-4 text-bone">{s.title}</h3>
            <p className="text-bone/60 text-sm mt-3 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="h-[360vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 w-full px-5 md:px-16 items-center">
          {/* stacked giant numbers */}
          <div className="relative h-[30vh] md:h-[50vh] hidden md:block" aria-hidden="true">
            {copy.process.steps.map((s) => (
              <span
                key={s.n}
                className="step-num absolute inset-0 font-display text-[20rem] leading-none text-transparent"
                style={{ WebkitTextStroke: '2px rgba(244,239,230,0.55)' }}
              >
                {s.n}
              </span>
            ))}
          </div>
          {/* stacked panels */}
          <div className="relative min-h-[22rem] md:min-h-[18rem]">
            {copy.process.steps.map((s) => (
              <div key={s.n} className="step-panel absolute inset-0">
                <span className="mlabel text-accent">{copy.ui.step} {s.n} / 03</span>
                <h3 className="h-display text-4xl md:text-6xl mt-4 max-w-[14ch] text-bone">{s.title}</h3>
                <p className="font-body text-bone/65 mt-6 max-w-[42ch] text-base md:text-lg leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── stamped mill datasheet ──────────────────────────────────────────── */

function SpecSheet() {
  const [open, setOpen] = useState(false)
  return (
    <div className="section-light bg-bone text-ink rule-t px-5 md:px-8 py-20 md:py-28">
      <div className="max-w-4xl mx-auto border border-ink/25 bg-bone relative">
        <div className="absolute -top-5 right-6 stamp text-accent text-xs bg-bone">
          {copy.ui.stampApproved}
        </div>
        <div className="px-6 md:px-10 py-8 border-b border-ink/15 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="mlabel text-accent mb-2">{copy.ui.eyebrow08b}</p>
            <h3 className="h-display text-3xl md:text-5xl">{copy.specs.title}</h3>
          </div>
          <span className="mlabel opacity-40">{copy.ui.doc}</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          data-cursor="view"
          className="w-full flex items-center justify-between px-6 md:px-10 py-5 font-mono text-xs uppercase tracking-micro hover:text-accent"
        >
          {copy.specs.sub}
          <span className="text-lg">{open ? '−' : '+'}</span>
        </button>
        <div className={open ? 'acc-open' : ''}>
          <div className="acc-panel">
            <div>
              <table className="w-full border-t border-ink/15">
                <caption className="sr-only">Cildro beech plywood technical specifications</caption>
                <tbody>
                  {copy.specs.rows.map((r) => (
                    <tr key={r.k} className="border-b border-ink/10 last:border-b-0">
                      <th scope="row" className="text-left mlabel opacity-60 px-6 md:px-10 py-4 w-[38%] font-medium">
                        {r.k}
                      </th>
                      <td className="font-body font-semibold text-sm md:text-base px-4 py-4">{r.v}</td>
                      <td className="font-mono text-[11px] text-accent px-6 md:px-10 py-4 text-right whitespace-nowrap">
                        {r.std}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

function Faq() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <div className="section-light bg-bone text-ink px-5 md:px-8 pb-24 md:pb-32">
      <div className="max-w-4xl mx-auto">
        <h3 className="h-display text-3xl md:text-5xl mb-10" data-reveal>
          {copy.faq.titleA} <span className="outline-text">{copy.faq.titleB}</span>
        </h3>
        <div className="border-t border-ink/20">
          {copy.faq.items.map((f, i) => {
            const open = openIdx === i
            return (
              <div key={f.q} className={`border-b border-ink/20 ${open ? 'acc-open' : ''}`}>
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  aria-expanded={open}
                  data-cursor="view"
                  className="w-full flex items-baseline gap-5 py-5 text-left group"
                >
                  <span className="font-mono text-xs text-accent">Q{i + 1}</span>
                  <span className="font-body font-semibold text-base md:text-xl group-hover:text-accent transition-colors">
                    {f.q}
                  </span>
                  <span className="ml-auto font-mono text-lg">{open ? '−' : '+'}</span>
                </button>
                <div className="acc-panel">
                  <div>
                    <p className="font-body text-sm md:text-base opacity-75 leading-relaxed pb-6 pl-10 max-w-[62ch]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function S08Process() {
  return (
    <section id="process" data-section="process" className="bg-ink text-bone rule-t">
      <div className="px-5 md:px-8 pt-24 md:pt-32">
        <div className="flex items-baseline justify-between mb-4">
          <p className="mlabel text-accent">{copy.ui.eyebrow08}</p>
          <span className="mlabel text-bone/40 hidden md:block">{copy.ui.fig08}</span>
        </div>
        <h2 className="h-display text-[11vw] md:text-8xl" data-reveal>
          {copy.process.titleA} <span className="outline-text">{copy.process.titleB}</span>
        </h2>
      </div>
      <Steps />
      <SpecSheet />
      <Faq />
    </section>
  )
}
