import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Facebook } from 'lucide-react'
import { useT } from '../lib/i18n'

export default function Footer() {
  const { t } = useT()

  return (
    <footer className="bg-anthracite-700 text-bone-100 pt-16 md:pt-24">
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        {/* Top */}
        <div className="grid grid-cols-12 gap-8 md:gap-12 pb-12 md:pb-16">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <svg viewBox="0 0 40 40" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 32 L6 16 L20 6 L34 16 L34 32 Z" fill="none" stroke="#FAFAF7" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M20 6 L34 16" stroke="#FAFAF7" strokeWidth="1.5"/>
                <rect x="22" y="20" width="8" height="9" fill="#FAFAF7"/>
                <path d="M11 28 C 9 24, 11 19, 14 19 C 14 23, 13 27, 11 28 Z" fill="#8FA68E"/>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-medium tracking-tight">
                  <span className="text-sage-300">eko</span>hus
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-bone-100/60 mt-0.5">Habitat</span>
              </div>
            </div>
            <p className="text-bone-100/70 max-w-md leading-relaxed text-sm md:text-base">
              {t.footer.tagline}
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="section-label text-sage-300 mb-4">{t.footer.navTitle}</div>
            <ul className="space-y-2 text-sm text-bone-100/80">
              <li><a href="#about" className="link-underline">{t.nav.about}</a></li>
              <li><a href="#aac" className="link-underline">{t.nav.aac}</a></li>
              <li><a href="#projects" className="link-underline">{t.nav.projects}</a></li>
              <li><a href="#process" className="link-underline">{t.nav.process}</a></li>
              <li><a href="#contact" className="link-underline">{t.nav.contact}</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="section-label text-sage-300 mb-4">{t.footer.contactTitle}</div>
            <ul className="space-y-2 text-sm text-bone-100/80">
              <li><a href="mailto:hola@ekohushabitat.com" className="link-underline">hola@ekohushabitat.com</a></li>
              <li><a href="tel:+34684784887" className="link-underline">+34 684 784 887</a></li>
              <li>www.ekohushabitat.com</li>
              <li className="pt-3 text-bone-100/60">Catalunya · Espanya</li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <div className="section-label text-sage-300 mb-4">{t.footer.followTitle}</div>
            <div className="flex gap-2">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-bone-100/20 flex items-center justify-center hover:border-sage-300 hover:text-sage-300 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-bone-100/20 flex items-center justify-center hover:border-sage-300 hover:text-sage-300 transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-bone-100/20 flex items-center justify-center hover:border-sage-300 hover:text-sage-300 transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-bone-100/10 text-xs text-bone-100/50 section-label">
          <span>{t.footer.copy}</span>
          <div className="flex gap-6">
            <Link to="/legal#aviso-legal" className="hover:text-sage-300 transition-colors">{t.footer.legalLinks.legal}</Link>
            <Link to="/legal#privacidad" className="hover:text-sage-300 transition-colors">{t.footer.legalLinks.privacy}</Link>
            <Link to="/legal#cookies" className="hover:text-sage-300 transition-colors">{t.footer.legalLinks.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
