import { useEffect, useRef } from 'react'
import { gsap } from '../lib/fx.js'
import copy from '../content/copy.js'
import { useMotion } from '../lib/motion.jsx'

export default function DirectoryOverlay({ open, onClose, scrollTo }) {
  const ref = useRef(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const el = ref.current
    if (reduced) {
      el.style.transform = open ? 'translateY(0%)' : 'translateY(-102%)'
      return
    }
    gsap.to(el, {
      yPercent: open ? 0 : -102,
      duration: 0.8,
      ease: 'power4.inOut',
    })
    if (open) {
      gsap.fromTo(
        el.querySelectorAll('.dir-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, delay: 0.35, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [open, reduced])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Site directory"
      className="fixed inset-0 z-[100] bg-ink text-bone -translate-y-[102%] flex flex-col"
    >
      <div className="flex items-center justify-between px-5 md:px-8 h-16 border-b border-bone/10">
        <span className="mlabel text-bone/60">Directory — dossier index</span>
        <button onClick={onClose} className="mlabel hover:text-accent" data-cursor="view">
          Close [×]
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto dir-scroll px-5 md:px-16 py-10">
        <ol>
          {copy.directory.map((d) => (
            <li key={d.id} className="dir-item border-b border-bone/10">
              <button
                data-cursor="link"
                onClick={() => {
                  onClose()
                  setTimeout(() => scrollTo(`#${d.id}`), reduced ? 0 : 500)
                }}
                className="group w-full flex items-baseline gap-6 md:gap-12 py-4 md:py-5 text-left"
              >
                <span className="font-mono text-xs md:text-sm text-accent w-8">{d.n}</span>
                <span className="h-display text-3xl md:text-6xl group-hover:text-accent group-hover:translate-x-3 transition-all duration-300">
                  {d.title}
                </span>
                <span className="mlabel text-bone/40 ml-auto hidden md:inline group-hover:text-accent">
                  (view)
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className="px-5 md:px-8 py-5 border-t border-bone/10 flex flex-wrap gap-x-8 gap-y-2 mlabel text-bone/50">
        <span>{copy.contact.email}</span>
        <span>{copy.contact.phone}</span>
        <span className="ml-auto">{copy.brand.claim}</span>
      </div>
    </div>
  )
}
