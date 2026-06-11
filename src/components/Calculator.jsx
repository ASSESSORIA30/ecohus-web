import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { useT } from '../lib/i18n'
import MagneticButton from './MagneticButton'
import ScrambleText from './ScrambleText'
import cpData from '../data/cpData.json'

gsap.registerPlugin(ScrollTrigger)

const ARCHITECT_PER_SQM = 130
const ARCHITECT_FIXED = 1800
const FOUNDATION_PER_SQM = 120
const CONNECTIONS_FIXED = 2800

export default function Calculator() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const [sqm, setSqm] = useState('')
  const [cp, setCp] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(headingRef.current, {
        types: 'lines,words',
        lineClass: 'reveal-line',
      })
      gsap.set(split.words, { yPercent: 110 })
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(split.words, {
            yPercent: 0,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.05,
          })
        },
      })

      const fields = sectionRef.current.querySelectorAll('[data-field]')
      gsap.from(fields, {
        opacity: 0, y: 20, duration: 0.7, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: fields[0], start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(false)

    const sqmNum = parseFloat(sqm)
    const cpKey = cp.trim().padStart(5, '0')

    if (!sqmNum || sqmNum <= 0 || !/^\d{4,5}$/.test(cp.trim())) {
      setError(true)
      setResult(null)
      return
    }

    const entry = cpData[cpKey]

    if (!entry) {
      setResult({ found: false })
      return
    }

    const construction = sqmNum * entry.preu
    const architect = sqmNum * ARCHITECT_PER_SQM + ARCHITECT_FIXED
    const foundation = sqmNum * FOUNDATION_PER_SQM
    const total = construction + architect + foundation + CONNECTIONS_FIXED

    setResult({
      found: true,
      location: `${entry.m} (${entry.p})`,
      construction,
      total,
    })
  }

  return (
    <section
      id="calculator"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-bone-100"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-anthracite-500">{t.calculator.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.calculator.title}{' '}
              <span className="text-sage-600">{t.calculator.titleEm}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-anthracite-600 text-lg leading-relaxed">
              {t.calculator.lead}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 lg:col-span-8">
            <form onSubmit={handleSubmit} className="border-t border-anthracite-700/10">
              <div data-field className="py-6 border-b border-anthracite-700/10 grid grid-cols-12 gap-4 items-center">
                <label htmlFor="calc-sqm" className="col-span-12 md:col-span-4 section-label text-anthracite-500">
                  {t.calculator.sqmLabel}
                </label>
                <input
                  id="calc-sqm"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={sqm}
                  onChange={(e) => setSqm(e.target.value)}
                  placeholder={t.calculator.sqmPlaceholder}
                  className="col-span-12 md:col-span-8 bg-transparent text-anthracite-700 text-base md:text-lg placeholder:text-anthracite-400 focus:outline-none focus:text-sage-700 transition-colors"
                />
              </div>

              <div data-field className="py-6 border-b border-anthracite-700/10 grid grid-cols-12 gap-4 items-center">
                <label htmlFor="calc-cp" className="col-span-12 md:col-span-4 section-label text-anthracite-500">
                  {t.calculator.cpLabel}
                </label>
                <input
                  id="calc-cp"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder={t.calculator.cpPlaceholder}
                  className="col-span-12 md:col-span-8 bg-transparent text-anthracite-700 text-base md:text-lg placeholder:text-anthracite-400 focus:outline-none focus:text-sage-700 transition-colors"
                />
              </div>

              <div data-field className="pt-8">
                <MagneticButton strength={0.3}>
                  <button type="submit" className="btn-primary group">
                    <ScrambleText trigger="hover">{t.calculator.submit}</ScrambleText>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </button>
                </MagneticButton>

                {error && (
                  <p className="mt-4 text-sm text-red-600">{t.calculator.errorFields}</p>
                )}

                {result && result.found === false && (
                  <div className="mt-8 py-8 border-t border-anthracite-700/10">
                    <h3 className="font-display text-2xl md:text-3xl text-anthracite-700 tracking-tight font-medium leading-tight mb-3">
                      {t.calculator.notFoundTitle}
                    </h3>
                    <p className="text-anthracite-600 max-w-md mb-6">
                      {t.calculator.notFoundText}
                    </p>
                    <MagneticButton strength={0.3}>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault()
                          const target = document.querySelector('#contact')
                          if (window.lenis) window.lenis.scrollTo(target, { offset: -40, duration: 1.6 })
                        }}
                        className="btn-primary group inline-flex"
                      >
                        <ScrambleText trigger="hover">{t.calculator.notFoundCta}</ScrambleText>
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </a>
                    </MagneticButton>
                  </div>
                )}

                {result && result.found && (
                  <div className="mt-8 py-8 border-t border-anthracite-700/10 space-y-5">
                    <div>
                      <div className="section-label text-sage-700 mb-2">{t.calculator.resultLocation}</div>
                      <p className="font-display text-xl md:text-2xl text-anthracite-700 font-medium">{result.location}</p>
                    </div>
                    <div>
                      <div className="section-label text-sage-700 mb-2">{t.calculator.resultConstruction}</div>
                      <p className="font-display text-xl md:text-2xl text-anthracite-700 font-medium">
                        {formatCurrency(result.construction)}
                      </p>
                    </div>
                    <div>
                      <div className="section-label text-sage-700 mb-2">{t.calculator.resultTotal}</div>
                      <p className="font-display text-3xl md:text-4xl text-sage-700 font-medium">
                        {formatCurrency(result.total)}
                      </p>
                    </div>
                    <p className="text-sm text-anthracite-500 max-w-xl pt-2">
                      {t.calculator.disclaimer}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('ca-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}
