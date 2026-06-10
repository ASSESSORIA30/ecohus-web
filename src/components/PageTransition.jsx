import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PageTransition: panell de transició entre rutes amb mask reveal.
 *
 * Funcionament:
 * - Detecta canvis de location.pathname
 * - Anima un panell que cobreix → es retira amb cortina vertical
 * - Mentre el panell cobreix, el scroll va al top
 *
 * Mostra el logotip d'EkoHus subtilment mentre està la transició.
 */
export default function PageTransition() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [pathDisplayed, setPathDisplayed] = useState(location.pathname)

  useEffect(() => {
    // Ignora el primer mount (no fa transició al carregar la web)
    if (location.pathname === pathDisplayed) return

    // Detecta prefers-reduced-motion → no fa l'animació, només scroll top
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setPathDisplayed(location.pathname)
      window.scrollTo(0, 0)
      return
    }

    // Inicia la transició: panell entra
    setVisible(true)

    // Quan el panell cobreix completament, actualitza display path i scroll top
    const t1 = setTimeout(() => {
      setPathDisplayed(location.pathname)
      window.scrollTo(0, 0)
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    }, 600)

    // Després retira el panell
    const t2 = setTimeout(() => {
      setVisible(false)
    }, 680)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [location.pathname, pathDisplayed])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-transition"
          className="fixed inset-0 z-[90] pointer-events-none"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
        >
          <div className="absolute inset-0 bg-anthracite-700 flex items-center justify-center">
            {/* Logo subtil al centre */}
            <motion.svg
              viewBox="0 0 200 140"
              className="w-24 md:w-32 h-auto opacity-70"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              aria-hidden="true"
            >
              <path
                d="M 60 95 L 60 50 L 100 20 L 140 50 L 140 95"
                fill="none"
                stroke="#FAFAF7"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M 100 20 L 140 50" stroke="#FAFAF7" strokeWidth="1.5" />
              <path d="M 40 95 L 160 95" stroke="#FAFAF7" strokeWidth="1.5" />
              <rect x="105" y="65" width="22" height="22" fill="#FAFAF7" />
              <path
                d="M 70 80 C 64 70, 70 55, 78 55 C 78 67, 76 78, 70 80 Z"
                fill="#8FA68E"
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
