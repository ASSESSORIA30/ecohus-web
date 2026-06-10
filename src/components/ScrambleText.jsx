import { useEffect, useRef, useState } from 'react'

/**
 * ScrambleText: text que mostra caràcters aleatoris i es "resol" al text real.
 *
 * Es pot disparar amb:
 * - trigger="hover" (per defecte): scrambla en hover sobre el contingut pare
 * - trigger="mount": scrambla en muntar (un cop)
 * - trigger="manual": exposat via prop `active`
 *
 * Sense scramble si reduced-motion està activat.
 */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#'

export default function ScrambleText({
  children,
  trigger = 'hover',
  speed = 28, // ms entre actualitzacions
  revealDuration = 540, // ms total de la transició
  className = '',
}) {
  const target = String(children)
  const [display, setDisplay] = useState(target)
  const intervalRef = useRef(null)
  const wrapRef = useRef(null)

  const scramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(target)
      return
    }

    const len = target.length
    const totalSteps = Math.ceil(revealDuration / speed)
    let step = 0

    intervalRef.current = setInterval(() => {
      step++
      const revealedCount = Math.min(len, Math.floor((step / totalSteps) * len))
      const out = target
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < revealedCount) return ch
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join('')
      setDisplay(out)
      if (step >= totalSteps) {
        clearInterval(intervalRef.current)
        setDisplay(target)
      }
    }, speed)
  }

  useEffect(() => {
    if (trigger !== 'hover') return
    // Detect el parent més proper interactiu
    const wrap = wrapRef.current
    if (!wrap) return
    // Pugem fins a trobar el primer element interactiu (button, a, etc.)
    let parent = wrap.parentElement
    while (parent && !['BUTTON', 'A'].includes(parent.tagName) && parent !== document.body) {
      parent = parent.parentElement
    }
    const hoverTarget = parent && parent !== document.body ? parent : wrap

    hoverTarget.addEventListener('mouseenter', scramble)
    return () => {
      hoverTarget.removeEventListener('mouseenter', scramble)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [target, trigger])

  useEffect(() => {
    if (trigger === 'mount') {
      scramble()
    }
  }, [trigger])

  // Quan canvia el text font (canvi d'idioma), actualitzem
  useEffect(() => {
    setDisplay(target)
  }, [target])

  return (
    <span ref={wrapRef} className={`inline-block ${className}`} aria-label={target}>
      {display}
    </span>
  )
}
