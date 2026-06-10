import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * MagneticButton: wrapper que fa que el seu contingut segueixi el cursor
 * dins d'una àrea de hover ampliada. Mouse leave → torna a la posició original
 * amb elastic.out per a un acabat orgànic.
 *
 * Detecta prefers-reduced-motion i (hover: none) → no aplica res.
 *
 * @param strength: 0..1 — quant segueix el cursor (default 0.35)
 * @param area: 0..2 — multiplicador de l'àrea de detecció (default 1.4)
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  area = 1.4,
  className = '',
  ...rest
}) {
  const wrapRef = useRef(null)
  const targetRef = useRef(null)

  useEffect(() => {
    // Skip si l'usuari prefereix moviment reduït o no té cursor fi
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(hover: none)').matches
    if (reduced || coarse) return

    const wrap = wrapRef.current
    const target = targetRef.current
    if (!wrap || !target) return

    let bounds = null
    const updateBounds = () => {
      bounds = wrap.getBoundingClientRect()
    }
    updateBounds()
    window.addEventListener('resize', updateBounds)
    window.addEventListener('scroll', updateBounds, { passive: true })

    const onMove = (e) => {
      if (!bounds) return
      const cx = bounds.left + bounds.width / 2
      const cy = bounds.top + bounds.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      // Distància màxima d'efecte
      const maxDist = Math.max(bounds.width, bounds.height) * area
      const dist = Math.hypot(dx, dy)
      if (dist > maxDist) return
      // Atenuació per distància — més lluny = menys efecte
      const factor = 1 - (dist / maxDist)
      gsap.to(target, {
        x: dx * strength * factor,
        y: dy * strength * factor,
        duration: 0.65,
        ease: 'expo.out',
        overwrite: true,
      })
    }

    const onLeave = () => {
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'elastic.out(1, 0.4)',
        overwrite: true,
      })
    }

    // Listener global perquè detecti des de fora del botó (àrea ampliada)
    window.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', updateBounds)
      window.removeEventListener('scroll', updateBounds)
      gsap.killTweensOf(target)
    }
  }, [strength, area])

  return (
    <div ref={wrapRef} className={`inline-block ${className}`} {...rest}>
      <div ref={targetRef} className="inline-block will-change-transform">
        {children}
      </div>
    </div>
  )
}
