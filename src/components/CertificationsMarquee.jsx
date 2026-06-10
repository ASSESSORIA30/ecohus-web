import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * CertificationsMarquee: banda infinita amb segells de certificacions.
 * - Es mou contínuament a velocitat base
 * - Accelera quan l'usuari fa scroll (llegeix velocitat de Lenis)
 * - Invertible amb la direcció del scroll
 *
 * Cada element es renderitza dues vegades per a un loop sense costures.
 */
const CERTIFICATIONS = [
  { code: 'CE', label: 'Conformitat Europea' },
  { code: 'EN-771', label: 'Norma blocs AAC' },
  { code: 'FSC®', label: 'Fusta sostenible' },
  { code: 'ISO 9001', label: 'Qualitat' },
  { code: 'EN-14081', label: 'Estructural' },
  { code: 'CTE', label: 'Codi tècnic edificació' },
  { code: 'A+', label: 'Eficiència energètica' },
  { code: 'ISO 14001', label: 'Medi ambient' },
  { code: 'EHE-08', label: 'Instrucció formigó' },
  { code: 'EUROCODE 6', label: 'Càlcul fàbrica' },
]

export default function CertificationsMarquee({ baseSpeed = 0.4, dark = false }) {
  const trackRef = useRef(null)
  const xRef = useRef(0)
  const velocityBoostRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    let lastTime = performance.now()

    // Llegeix la velocitat del scroll via Lenis (si està disponible)
    const getScrollVelocity = () => {
      if (typeof window !== 'undefined' && window.lenis) {
        return window.lenis.velocity || 0
      }
      return 0
    }

    // Calculem amplada d'una "passada" (mig track perquè dupliquem el contingut)
    const getCycleWidth = () => {
      return track.scrollWidth / 2
    }

    const tick = (now) => {
      const dt = (now - lastTime) / 16.667 // normalitzat a 60fps
      lastTime = now

      // Velocitat reactiva
      const scrollV = getScrollVelocity()
      // Suau interpolation cap al boost objectiu
      const targetBoost = scrollV * 0.012
      velocityBoostRef.current += (targetBoost - velocityBoostRef.current) * 0.08

      const totalSpeed = baseSpeed + velocityBoostRef.current
      xRef.current -= totalSpeed * dt

      const cycleWidth = getCycleWidth()
      if (cycleWidth > 0) {
        // Wrap infinit
        if (xRef.current <= -cycleWidth) xRef.current += cycleWidth
        if (xRef.current > 0) xRef.current -= cycleWidth
        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [baseSpeed])

  // Dupliquem el contingut per al loop sense costures
  const items = [...CERTIFICATIONS, ...CERTIFICATIONS]

  return (
    <div
      className={`relative overflow-hidden py-10 md:py-14 ${
        dark ? 'bg-anthracite-700 text-bone-100' : 'bg-bone-200 text-anthracite-700'
      } border-t border-b ${dark ? 'border-bone-100/10' : 'border-anthracite-700/10'}`}
      aria-label="Certificacions"
    >
      <div
        ref={trackRef}
        className="flex items-center gap-12 md:gap-20 whitespace-nowrap will-change-transform"
      >
        {items.map((cert, i) => (
          <div
            key={i}
            className="flex items-center gap-3 md:gap-5 flex-shrink-0"
          >
            <span className={`font-display text-xl md:text-3xl tracking-tight font-light ${dark ? 'text-sage-300' : 'text-sage-600'}`}>
              {cert.code}
            </span>
            <span className={`section-label ${dark ? 'text-bone-100/40' : 'text-anthracite-400'}`}>
              {cert.label}
            </span>
            <span className={`text-2xl md:text-3xl ${dark ? 'text-bone-100/15' : 'text-anthracite-700/15'} pl-12 md:pl-20`} aria-hidden="true">
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
