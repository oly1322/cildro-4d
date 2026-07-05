import { useEffect, useState } from 'react'
import copy from '../content/copy.js'

/** Sticky corner HUD: current dossier section + scroll progress rule. */
export default function HUD({ onOpenDirectory }) {
  const [current, setCurrent] = useState(copy.directory[0])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-section]')]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = e.target.getAttribute('data-section')
            const entry = copy.directory.find((d) => d.id === idx)
            if (entry) setCurrent(entry)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    sections.forEach((s) => io.observe(s))

    // rAF-coalesced: at most one React commit per frame while scrolling
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = document.documentElement.scrollHeight - window.innerHeight
        setProgress(h > 0 ? window.scrollY / h : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* top bar */}
      <header className="fixed top-0 inset-x-0 z-[80] flex items-center justify-between px-5 md:px-8 h-16 mix-blend-difference text-white">
        <a href="#hero" className="flex items-center gap-3" data-cursor="link" aria-label="Cildro Plywood — top">
          <span className="regmark opacity-60" />
          <span className="font-display text-lg tracking-wide uppercase">Cildro</span>
          <span className="mlabel opacity-60 hidden md:inline">Plywood — est. 2013</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="#quote" className="mlabel opacity-80 hover:opacity-100 hidden md:inline" data-cursor="link">
            Get a price ↗
          </a>
          <button onClick={onOpenDirectory} className="mlabel flex items-center gap-2" data-cursor="view" aria-haspopup="dialog">
            <span className="w-4 h-[9px] flex flex-col justify-between" aria-hidden="true">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
            Directory
          </button>
        </div>
      </header>

      {/* left edge: section index */}
      <div
        className="fixed left-1.5 md:left-2.5 top-1/2 -translate-y-1/2 z-[80] mix-blend-difference text-white pointer-events-none hidden sm:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="font-display text-xl leading-none">{current.n}</span>
        <span className="w-px h-10 bg-white/40" />
        <span className="mlabel opacity-70 [writing-mode:vertical-rl]">{current.title}</span>
      </div>

      {/* mobile: hairline progress under the header (side rules are hidden) */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-[85] md:hidden pointer-events-none" aria-hidden="true">
        <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* right: progress rule */}
      <div className="fixed top-0 right-0 bottom-0 w-8 z-[80] hidden md:flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-white" aria-hidden="true">
        <div className="relative h-40 w-px bg-white/25">
          <div className="absolute top-0 left-0 w-px bg-white" style={{ height: `${progress * 100}%` }} />
        </div>
        <span className="mlabel opacity-60 mt-4 [writing-mode:vertical-rl]">
          {Math.round(progress * 100).toString().padStart(3, '0')} / 100
        </span>
      </div>
    </>
  )
}
