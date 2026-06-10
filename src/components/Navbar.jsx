import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useT } from '../lib/i18n'

function Logo({ className = '' }) {
  // Logotip vectorial EkoHus: casa amb fulla, tipografia neta
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="EkoHus Habitat — inici">
      <svg viewBox="0 0 40 40" className="w-9 h-9 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Casa amb sostre asimètric (inspirat al logo del client) */}
        <path d="M6 32 L6 16 L20 6 L34 16 L34 32 Z" fill="#F5F2EC" stroke="#2C2E2D" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Sostre detall */}
        <path d="M20 6 L34 16" stroke="#2C2E2D" strokeWidth="1.5"/>
        {/* Finestra */}
        <rect x="22" y="20" width="8" height="9" fill="#2C2E2D"/>
        {/* Fulla sàlvia */}
        <path d="M11 28 C 9 24, 11 19, 14 19 C 14 23, 13 27, 11 28 Z" fill="#8FA68E"/>
        <path d="M12.5 23 L11 28" stroke="#5F7A5C" strokeWidth="0.5" strokeLinecap="round"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-base md:text-lg font-medium tracking-tight text-anthracite-700">
          <span className="text-sage-500">eko</span>hus
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-anthracite-500 mt-0.5">Habitat</span>
      </div>
    </Link>
  )
}

function LangToggle() {
  const { lang, toggleLang } = useT()
  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-anthracite-700/15 hover:border-sage-500 transition-colors text-xs font-mono uppercase tracking-widest"
      aria-label={`Cambiar idioma a ${lang === 'ca' ? 'castellano' : 'català'}`}
    >
      <span className={lang === 'ca' ? 'text-sage-600 font-medium' : 'text-anthracite-400'}>CA</span>
      <span className="text-anthracite-300">/</span>
      <span className={lang === 'es' ? 'text-sage-600 font-medium' : 'text-anthracite-400'}>ES</span>
    </button>
  )
}

export default function Navbar() {
  const { t } = useT()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const NAV_ITEMS = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.aac, href: '#aac' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.sustainability, href: '#sustainability' },
    { label: t.nav.calculator, href: '#calculator' },
    { label: t.nav.contact, href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (e, href) => {
    setMenuOpen(false)
    // Only intercept anchor scroll on home page
    if (location.pathname !== '/') return // let Link navigate
    e.preventDefault()
    const target = document.querySelector(href)
    if (!target) return
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: -40, duration: 1.4 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 bg-bone-100/95 backdrop-blur-md border-b border-anthracite-700/5 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-7" aria-label="Navegació principal">
            {NAV_ITEMS.map((item) => (
              location.pathname === '/' ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchor(e, item.href)}
                  className="text-sm text-anthracite-600 hover:text-sage-600 link-underline transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={`/${item.href}`}
                  className="text-sm text-anthracite-600 hover:text-sage-600 link-underline transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LangToggle />
            <a
              href={location.pathname === '/' ? '#contact' : '/#contact'}
              onClick={(e) => location.pathname === '/' && handleAnchor(e, '#contact')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-anthracite-700 text-bone-100 text-xs font-medium hover:bg-sage-700 transition-colors"
            >
              {t.nav.cta}
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-anthracite-700/15"
              aria-label="Obrir menú"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
            className="fixed inset-0 z-50 bg-bone-100 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-anthracite-700/10">
              <Logo />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-anthracite-700/15"
                aria-label="Tancar menú"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-6 gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={location.pathname === '/' ? item.href : `/${item.href}`}
                  onClick={(e) => location.pathname === '/' && handleAnchor(e, item.href)}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                  className="font-display text-4xl tracking-tight leading-tight py-2 text-anthracite-700"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="mt-6 pt-6 border-t border-anthracite-700/10">
                <LangToggle />
              </div>
            </div>
            <div className="p-5 border-t border-anthracite-700/10 section-label text-anthracite-500">
              hola@ekohushabitat.com · +34 684 784 887
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
