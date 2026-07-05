import { createContext, useContext, useEffect, useMemo, useState } from 'react'

function detectWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function detectLowPower() {
  const cores = navigator.hardwareConcurrency || 8
  const mem = navigator.deviceMemory || 8
  return cores <= 3 || mem <= 2
}

const MotionContext = createContext({ reduced: false, webgl: true, fx: true, touch: false })

export function MotionProvider({ children }) {
  const value = useMemo(() => {
    // ?static=1 — QA switch: preview the reduced-motion / no-WebGL experience
    const forceStatic = new URLSearchParams(window.location.search).has('static')
    const reduced = forceStatic || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const webgl = !forceStatic && detectWebGL() && !detectLowPower()
    const touch = window.matchMedia('(pointer: coarse)').matches
    return { reduced, webgl, fx: !reduced, touch }
  }, [])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export const useMotion = () => useContext(MotionContext)

/** reactive phone-breakpoint flag (matches Tailwind's `md` boundary) */
export function useIsMobile() {
  const [m, setM] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = (e) => setM(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}
