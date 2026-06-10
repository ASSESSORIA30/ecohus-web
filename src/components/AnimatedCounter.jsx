import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * AnimatedCounter: anima un número de `from` a `to` quan entra al viewport.
 *
 * Suporta:
 * - Prefixos / sufixos (ex: "70%", "100+")
 * - Decimals (ex: 0,10 W/m·K — 'decimals' = 2, 'decimalSeparator' = ',')
 * - Easing exponencial (default expo.out)
 * - Stagger amb delay
 *
 * Respecta prefers-reduced-motion → salta directament al valor final.
 */
export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2.2,
  prefix = '',
  suffix = '',
  decimals = 0,
  decimalSeparator = ',',
  delay = 0,
  className = '',
  ease = 'expo.out',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const formatNumber = (val) => {
      if (decimals > 0) {
        return val.toFixed(decimals).replace('.', decimalSeparator)
      }
      // Format amb punts de milers per a números grans (ex: 1.000)
      return Math.floor(val).toLocaleString('es-ES')
    }

    if (reduced) {
      el.textContent = prefix + formatNumber(to) + suffix
      return
    }

    el.textContent = prefix + formatNumber(from) + suffix

    const obj = { val: from }
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: to,
          duration,
          delay,
          ease,
          onUpdate: () => {
            el.textContent = prefix + formatNumber(obj.val) + suffix
          },
        })
      },
    })

    return () => {
      trigger.kill()
      gsap.killTweensOf(obj)
    }
  }, [from, to, duration, prefix, suffix, decimals, decimalSeparator, delay, ease])

  return (
    <span ref={ref} className={`tabular-nums num-tabular inline-block ${className}`}>
      {prefix}{from}{suffix}
    </span>
  )
}
