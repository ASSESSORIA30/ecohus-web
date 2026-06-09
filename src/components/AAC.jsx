import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Check, X } from 'lucide-react'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function AAC() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const tableRef = useRef(null)
  const imageRef = useRef(null)
  const imageWrapRef = useRef(null)

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
            stagger: 0.04,
          })
        },
      })

      // Image reveal
      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.4,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: imageWrapRef.current, start: 'top 80%' },
        }
      )
      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: imageWrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Table rows
      const rows = tableRef.current?.querySelectorAll('[data-row]')
      if (rows) {
        gsap.from(rows, {
          opacity: 0,
          x: -20,
          duration: 0.6,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: tableRef.current, start: 'top 75%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="aac"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-stone-100 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-anthracite-500">{t.aac.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.aac.title}
              <br />
              <span className="text-sage-600">{t.aac.titleEm}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-anthracite-600 text-lg leading-relaxed">
              {t.aac.lead}
            </p>
          </div>
        </div>

        {/* AAC properties + image */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-24">
          <div className="col-span-12 lg:col-span-5">
            <div
              ref={imageWrapRef}
              className="relative aspect-[4/5] overflow-hidden bg-stone-300"
            >
              <div ref={imageRef} className="absolute inset-0 scale-110">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=1200"
                  alt="Blocs de formigó cel·lular AAC en obra"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-anthracite-700/10" />
              <div className="absolute bottom-5 left-5 right-5 text-bone-100">
                <div className="section-label text-bone-100/80 mb-1">MATERIAL</div>
                <div className="font-display text-2xl md:text-3xl tracking-tight font-medium">
                  Bloc AAC
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 self-center">
            {t.aac.properties.map((prop, i) => (
              <div
                key={i}
                className="bg-bone-100 p-6 md:p-7 border border-anthracite-700/5"
              >
                <div className="font-mono text-xs text-sage-700 mb-3 tracking-widest">
                  0{i + 1}
                </div>
                <h3 className="font-display text-lg md:text-xl font-medium text-anthracite-700 tracking-tight mb-2">
                  {prop.title}
                </h3>
                <p className="text-sm text-anthracite-600 leading-relaxed">
                  {prop.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div ref={tableRef} className="bg-bone-100 border border-anthracite-700/5 overflow-hidden">
          <div className="p-6 md:p-10 border-b border-anthracite-700/8">
            <h3 className="font-display text-2xl md:text-3xl font-medium text-anthracite-700 tracking-tight">
              {t.aac.comparisonTitle}
            </h3>
            <p className="mt-2 text-sm md:text-base text-anthracite-500">
              {t.aac.comparisonSubtitle}
            </p>
          </div>

          {/* Table - desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 px-10 py-5 bg-stone-100 border-b border-anthracite-700/8">
              <div className="col-span-5 section-label text-anthracite-500">{t.aac.compare.headers[0]}</div>
              <div className="col-span-4 section-label text-sage-700 flex items-center gap-2">
                <Check size={14} strokeWidth={2.5} />
                {t.aac.compare.headers[1]}
              </div>
              <div className="col-span-3 section-label text-anthracite-400 flex items-center gap-2">
                {t.aac.compare.headers[2]}
              </div>
            </div>
            {t.aac.compare.rows.map((row, i) => (
              <div
                key={i}
                data-row
                className="grid grid-cols-12 gap-4 px-10 py-5 border-b border-anthracite-700/5 hover:bg-stone-50 transition-colors"
              >
                <div className="col-span-5 text-sm md:text-base text-anthracite-700 font-medium">
                  {row.feature}
                </div>
                <div className="col-span-4 text-sm md:text-base text-sage-700 font-medium num-tabular">
                  {row.aac}
                </div>
                <div className="col-span-3 text-sm md:text-base text-anthracite-400 num-tabular">
                  {row.brick}
                </div>
              </div>
            ))}
          </div>

          {/* Table - mobile (cards) */}
          <div className="md:hidden divide-y divide-anthracite-700/5">
            {t.aac.compare.rows.map((row, i) => (
              <div key={i} data-row className="p-6">
                <div className="section-label text-anthracite-500 mb-3">{row.feature}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-sage-700 flex items-center gap-1 mb-1">
                      <Check size={12} /> AAC
                    </div>
                    <div className="text-base font-medium text-sage-700 num-tabular">{row.aac}</div>
                  </div>
                  <div>
                    <div className="text-xs text-anthracite-400 mb-1">
                      {lang === 'ca' ? 'Maó' : 'Ladrillo'}
                    </div>
                    <div className="text-base text-anthracite-400 num-tabular">{row.brick}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
