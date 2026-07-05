import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// iOS: don't re-measure on URL-bar collapse (height-only resizes) — prevents
// mid-scroll jumps; rotation still refreshes because width changes
ScrollTrigger.config({ ignoreMobileResize: true })
export { gsap, ScrollTrigger }

if (import.meta.env.DEV) {
  window.gsap = gsap
  window.ScrollTrigger = ScrollTrigger
}

/** Split element text into masked line/char spans for staggered reveals. */
export function splitChars(el) {
  const text = el.textContent
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const frag = document.createDocumentFragment()
  text.split(/(\s+)/).forEach((word) => {
    if (/^\s+$/.test(word)) {
      frag.appendChild(document.createTextNode(' '))
      return
    }
    const w = document.createElement('span')
    w.className = 'split-word'
    w.setAttribute('aria-hidden', 'true')
    for (const ch of word) {
      const c = document.createElement('span')
      c.className = 'split-char'
      c.textContent = ch
      w.appendChild(c)
    }
    frag.appendChild(w)
  })
  el.appendChild(frag)
  return el.querySelectorAll('.split-char')
}

/** Wire up [data-reveal] masked reveals inside a root element. */
export function initReveals(root, { reduced } = {}) {
  const els = root.querySelectorAll('[data-reveal]')
  if (reduced) {
    els.forEach((el) => el.classList.add('is-revealed'))
    return () => {}
  }
  const triggers = []
  els.forEach((el) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-revealed'),
      })
    )
  })
  return () => triggers.forEach((t) => t.kill())
}
