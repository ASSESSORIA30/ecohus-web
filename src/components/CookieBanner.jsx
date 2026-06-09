import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useT } from '../lib/i18n'

const STORAGE_KEY = 'ekohus-cookies-consent'

export default function CookieBanner() {
  const { t } = useT()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      // Show after a short delay so it doesn't fight with the page reveal
      const timer = setTimeout(() => setShow(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ technical: true, analytics: true, marketing: true, date: new Date().toISOString() }))
    setShow(false)
  }
  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ technical: true, analytics: false, marketing: false, date: new Date().toISOString() }))
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-[1100px] mx-auto bg-anthracite-700 text-bone-100 rounded-sm shadow-2xl p-5 md:p-7 pointer-events-auto border border-anthracite-600">
            <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
              <div className="col-span-12 lg:col-span-8">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">🍪</span>
                  <div>
                    <h3 className="font-display text-base md:text-lg font-medium mb-1">
                      {t.cookies.title}
                    </h3>
                    <p className="text-xs md:text-sm text-bone-100/70 leading-relaxed">
                      {t.cookies.text}{' '}
                      <Link to="/legal#cookies" className="text-sage-300 link-underline">
                        {t.cookies.moreInfo}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 flex flex-col sm:flex-row gap-2 lg:justify-end">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-full border border-bone-100/20 text-bone-100/80 text-sm hover:border-sage-300 hover:text-sage-300 transition-colors"
                >
                  {t.cookies.reject}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-full bg-sage-500 text-bone-100 text-sm font-medium hover:bg-sage-400 transition-colors"
                >
                  {t.cookies.accept}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
