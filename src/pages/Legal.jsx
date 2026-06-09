import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useT } from '../lib/i18n'

export default function Legal() {
  const { t } = useT()
  const location = useLocation()

  // Scroll to hash on mount
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const target = document.getElementById(id)
      if (target) {
        setTimeout(() => {
          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: -80, duration: 1.4 })
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 200)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.hash])

  return (
    <article className="bg-bone-100 pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-anthracite-500 hover:text-sage-700 mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          {t.legal.back}
        </Link>

        {/* Header */}
        <header className="mb-16 md:mb-20">
          <div className="section-label text-anthracite-500 mb-4">— LEGAL</div>
          <h1 className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium">
            {t.legal.title}
          </h1>
          <p className="mt-5 text-lg text-anthracite-600">
            {t.legal.subtitle}
          </p>
        </header>

        {/* TOC */}
        <nav className="mb-16 p-6 bg-bone-200 border border-anthracite-700/5" aria-label="Índex">
          <div className="section-label text-sage-700 mb-3">ÍNDEX</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#aviso-legal" className="text-anthracite-700 link-underline">1. Aviso Legal</a></li>
            <li><a href="#privacidad" className="text-anthracite-700 link-underline">2. Política de Privacidad</a></li>
            <li><a href="#cookies" className="text-anthracite-700 link-underline">3. Política de Cookies</a></li>
          </ul>
        </nav>

        {/* ====== AVISO LEGAL ====== */}
        <section id="aviso-legal" className="mb-20 scroll-mt-32">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono text-xs text-sage-700">01</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-anthracite-700 tracking-tight">
              📄 Aviso Legal
            </h2>
          </div>

          <div className="prose-content space-y-7 text-anthracite-700">
            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">1. Datos identificativos</h3>
              <ul className="space-y-1.5 text-anthracite-600 list-disc pl-5">
                <li><strong className="text-anthracite-700">Titular:</strong> MODULARDOM OBRAS Y REFORMAS, S.L.</li>
                <li><strong className="text-anthracite-700">CIF:</strong> B26624072</li>
                <li><strong className="text-anthracite-700">Correo:</strong> info@modulardom.com</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">2. Objeto</h3>
              <p className="text-anthracite-600 leading-relaxed">
                El presente Aviso Legal regula el acceso, navegación y uso del sitio web. El acceso implica la aceptación plena de todas sus disposiciones.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">3. Condiciones de uso</h3>
              <p className="text-anthracite-600 leading-relaxed">
                El usuario se compromete a no emplear los contenidos para actividades ilícitas ni difundir virus. MODULARDOM se reserva el derecho a retirar contenidos inapropiados.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">4. Propiedad intelectual</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Todos los contenidos son titularidad de MODULARDOM OBRAS Y REFORMAS, S.L. Queda prohibida su reproducción sin autorización expresa.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">5. Legislación aplicable</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Este Aviso Legal se rige íntegramente por la legislación española.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-anthracite-700/10 my-16" />

        {/* ====== PRIVACIDAD ====== */}
        <section id="privacidad" className="mb-20 scroll-mt-32">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono text-xs text-sage-700">02</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-anthracite-700 tracking-tight">
              🔐 Política de Privacidad
            </h2>
          </div>

          <div className="space-y-7 text-anthracite-700">
            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">1. Responsable del tratamiento</h3>
              <ul className="space-y-1.5 text-anthracite-600 list-disc pl-5">
                <li><strong className="text-anthracite-700">Titular:</strong> MODULARDOM OBRAS Y REFORMAS, S.L.</li>
                <li><strong className="text-anthracite-700">CIF:</strong> B26624072</li>
                <li><strong className="text-anthracite-700">Correo:</strong> info@modulardom.com</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">2. Finalidad</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Atender consultas, prestar servicios, gestionar la relación comercial y enviar comunicaciones comerciales cuando exista consentimiento.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">3. Legitimación</h3>
              <ul className="space-y-1.5 text-anthracite-600 list-disc pl-5">
                <li>Consentimiento expreso del interesado.</li>
                <li>Ejecución de un contrato o precontrato.</li>
                <li>Cumplimiento de obligaciones legales.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">4. Conservación</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Los datos se conservarán mientras se mantenga la relación comercial y durante los plazos legalmente establecidos.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">5. Derechos del usuario</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Puede ejercer los derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad mediante solicitud a{' '}
                <a href="mailto:info@modulardom.com" className="text-sage-700 link-underline">info@modulardom.com</a>. También puede reclamar ante la AEPD.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">6. Medidas de seguridad</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Ekohus aplica las medidas técnicas y organizativas necesarias para garantizar la seguridad e integridad de los datos.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-anthracite-700/10 my-16" />

        {/* ====== COOKIES ====== */}
        <section id="cookies" className="scroll-mt-32">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono text-xs text-sage-700">03</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-anthracite-700 tracking-tight">
              🍪 Política de Cookies
            </h2>
          </div>

          <div className="space-y-7 text-anthracite-700">
            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">¿Qué son las cookies?</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Las cookies son archivos de texto que se almacenan en su dispositivo para mejorar la experiencia del usuario.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">Tipos de cookies</h3>
              <ul className="space-y-3 text-anthracite-600 list-disc pl-5">
                <li><strong className="text-anthracite-700">Técnicas (necesarias):</strong> Permiten la navegación básica. No requieren consentimiento.</li>
                <li><strong className="text-anthracite-700">Analíticas:</strong> Google Analytics. Requieren consentimiento.</li>
                <li><strong className="text-anthracite-700">Publicitarias:</strong> Anuncios según hábitos de navegación.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">Gestión</h3>
              <p className="text-anthracite-600 leading-relaxed">
                Puede gestionar las cookies desde la configuración de su navegador. La desactivación puede afectar al funcionamiento del sitio.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-anthracite-700 mb-3">Responsable</h3>
              <p className="text-anthracite-600 leading-relaxed">
                MODULARDOM OBRAS Y REFORMAS, S.L. — CIF: B26624072 — <a href="mailto:info@modulardom.com" className="text-sage-700 link-underline">info@modulardom.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer of legal */}
        <div className="mt-20 pt-10 border-t border-anthracite-700/10 text-center">
          <p className="text-xs text-anthracite-400 mb-4">
            Última actualización: Junio 2026
          </p>
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={14} />
            {t.legal.back}
          </Link>
        </div>
      </div>
    </article>
  )
}
