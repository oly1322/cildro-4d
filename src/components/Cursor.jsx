import { useEffect, useRef } from 'react'
import { useMotion } from '../lib/motion.jsx'

const LABELS = { view: '(view)', drag: '(drag)', link: '(open)', inspect: '(inspect)' }

export default function Cursor() {
  const { touch, reduced } = useMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (touch || reduced) return
    document.body.classList.add('has-cursor')
    const el = ref.current
    const label = el.querySelector('.clabel')
    let x = -100
    let y = -100
    let cx = x
    let cy = y
    let raf

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
    }
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor], a, button, summary, input, select')
      if (!t) {
        el.classList.remove('is-active')
        return
      }
      const kind = t.getAttribute('data-cursor') || 'view'
      label.textContent = LABELS[kind] || LABELS.view
      el.classList.add('is-active')
    }
    const tick = () => {
      cx += (x - cx) * 0.35
      cy += (y - cy) * 0.35
      el.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [touch, reduced])

  if (touch || reduced) return null
  return (
    <div id="cursor" ref={ref} aria-hidden="true">
      <span className="cx" />
      <span className="cy" />
      <span className="cring" />
      <span className="clabel" />
    </div>
  )
}
