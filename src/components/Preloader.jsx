import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Preloader editorial d'EkoHus.
 *
 * Comportament:
 * - Es mostra mentre la pàgina carrega assets crítics.
 * - El logotip es dibuixa línia per línia (stroke-dasharray).
 * - Counter de % basat en càrrega real (window.load) amb mínim 1.4s perquè es vegi.
 * - Surt amb una màscara vertical (clip-path) revelant el hero.
 *
 * Respecta prefers-reduced-motion → desapareix en 200ms sense animacions de sortida.
 */
export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const startRef = useRef(performance.now())
  const minDuration = 1400 // ms — temps mínim perquè l'animació es vegi
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Bloqueja scroll mentre preloader és actiu
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let rafId = 0
    let realProgress = 0
    let displayedProgress = 0

    // Real progress basat en estat de la pàgina
    const updateRealProgress = () => {
      if (document.readyState === 'complete') {
        realProgress = 100
      } else if (document.readyState === 'interactive') {
        realProgress = Math.max(realProgress, 65)
      } else {
        realProgress = Math.max(realProgress, 25)
      }
    }

    document.addEventListener('readystatechange', updateRealProgress)
    window.addEventListener('load', updateRealProgress)
    updateRealProgress()

    // Tick smooth — el % visible s'aproxima al real
    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const timeProgress = Math.min(100, (elapsed / minDuration) * 100)

      // Combina temps mínim + càrrega real
      const target = Math.min(realProgress, timeProgress)
      displayedProgress += (target - displayedProgress) * 0.08
      const rounded = Math.floor(displayedProgress)
      setProgress(rounded)

      // Sortir quan tot està a 100 i el temps mínim ha passat
      if (rounded >= 99 && elapsed >= minDuration) {
        setProgress(100)
        // Petita pausa abans de la sortida
        setTimeout(() => setVisible(false), 280)
        return
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('readystatechange', updateRealProgress)
      window.removeEventListener('load', updateRealProgress)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Quan la sortida acaba, notificar al pare
  const handleExitComplete = () => {
    document.body.style.overflow = ''
    onDone?.()
  }

  // Animació de stroke del logotip
  const strokeAnimation = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-bone-100 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={
            reducedMotion.current
              ? { opacity: 0 }
              : { clipPath: 'inset(0 0 100% 0)' }
          }
          transition={{
            duration: reducedMotion.current ? 0.2 : 1.1,
            ease: [0.87, 0, 0.13, 1],
          }}
          aria-label="Carregant"
          role="status"
        >
          {/* Logo SVG dibuixat línia per línia */}
          <div className="relative">
            <motion.svg
              viewBox="0 0 200 140"
              className="w-32 md:w-48 h-auto"
              xmlns="http://www.w3.org/2000/svg"
              initial="initial"
              animate="animate"
              aria-hidden="true"
            >
              {/* Sostre triangular (esquerra) */}
              <motion.path
                d="M 60 95 L 60 50 L 100 20 L 140 50 L 140 95"
                fill="none"
                stroke="#2C2E2D"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                variants={strokeAnimation}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Línia diagonal del sostre */}
              <motion.path
                d="M 100 20 L 140 50"
                fill="none"
                stroke="#2C2E2D"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={strokeAnimation}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Línia base (terra) */}
              <motion.path
                d="M 40 95 L 160 95"
                fill="none"
                stroke="#2C2E2D"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={strokeAnimation}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Finestra negra */}
              <motion.rect
                x="105"
                y="65"
                width="22"
                height="22"
                fill="#2C2E2D"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'center bottom' }}
              />
              {/* Fulla sàlvia */}
              <motion.path
                d="M 70 80 C 64 70, 70 55, 78 55 C 78 67, 76 78, 70 80 Z"
                fill="#8FA68E"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '74px 70px' }}
              />
              {/* Tronc de la fulla */}
              <motion.line
                x1="74"
                y1="65"
                x2="70"
                y2="80"
                stroke="#5F7A5C"
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>

            {/* Wordmark "EKOHUS HABITAT" */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="font-display text-base md:text-lg tracking-[0.3em] text-anthracite-700 font-light">
                <span className="text-sage-600 font-medium">EKO</span>HUS
              </div>
              <div className="font-display text-[10px] md:text-xs tracking-[0.4em] text-anthracite-500 mt-1">
                HABITAT
              </div>
            </motion.div>
          </div>

          {/* Counter de percentatge */}
          <div className="absolute bottom-8 left-0 right-0 md:bottom-12">
            <div className="max-w-[1600px] mx-auto px-5 md:px-10 flex items-end justify-between text-anthracite-500">
              <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase">
                Carregant experiència
              </div>
              <div className="font-display text-3xl md:text-5xl text-anthracite-700 font-light tracking-tight num-tabular tabular-nums">
                {String(progress).padStart(3, '0')}
                <span className="text-sage-500">%</span>
              </div>
            </div>
            {/* Línia de progrés fina */}
            <div className="max-w-[1600px] mx-auto px-5 md:px-10 mt-3 md:mt-4">
              <div className="h-px bg-anthracite-700/10 overflow-hidden">
                <div
                  className="h-full bg-anthracite-700 transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
