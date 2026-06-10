import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Check } from 'lucide-react'
import { useT } from '../lib/i18n'
import AnimatedCounter from './AnimatedCounter'

gsap.registerPlugin(ScrollTrigger)

/**
 * Secció AAC PINNED:
 * - Es queda fixada al top durant 3 viewports de scroll
 * - Mentre l'usuari scrolleja, el contingut evoluciona en 4 etapes:
 *   Stage 1 (0-25%): introducció + un bloc apareix al centre
 *   Stage 2 (25-50%): 4 blocs es multipliquen formant un mur, propietats apareixen
 *   Stage 3 (50-75%): es revela el comparatiu (números canvien)
 *   Stage 4 (75-100%): conclusió i transició a la següent secció
 */
export default function AAC() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const headingRef = useRef(null)
  const blocksRef = useRef(null)
  const propsRef = useRef(null)
  const compareRef = useRef(null)
  const stageIndicatorRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animació del títol
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

      // ============================================================
      //  TIMELINE PRINCIPAL — pinned scrolljacking
      //  Distribució dels 4 stages dins del pin:
      //  0.00 – 0.25  Stage 1: intro + 1 bloc
      //  0.25 – 0.50  Stage 2: mur de blocs + propietats
      //  0.50 – 0.75  Stage 3: comparativa AAC vs maó
      //  0.75 – 1.00  Stage 4: outro + scroll signal
      // ============================================================
      const blocks = blocksRef.current.querySelectorAll('[data-block]')
      const props = propsRef.current.querySelectorAll('[data-prop]')
      const compareRows = compareRef.current.querySelectorAll('[data-comp-row]')
      const compareHeader = compareRef.current.querySelector('[data-comp-header]')

      // Estats inicials
      gsap.set(blocks, { opacity: 0, scale: 0.7, y: 30 })
      gsap.set(props, { opacity: 0, x: 30 })
      gsap.set(compareRef.current, { opacity: 0 })
      gsap.set(compareRows, { opacity: 0, x: -20 })
      gsap.set(compareHeader, { opacity: 0, y: 20 })

      // Pin master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%', // pin durant 3 viewports
          pin: stageRef.current,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // --- Stage 1: aparició del primer bloc i blocs auxiliars ---
      tl.to(blocks[0], {
        opacity: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out',
      }, 0)
        .to(stageIndicatorRef.current, { text: '01', duration: 0.01 }, 0)

      // --- Stage 2: muralla i propietats ---
      tl.to(stageIndicatorRef.current, { text: '02', duration: 0.01 }, 1)
        .to(blocks, {
          opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'expo.out',
          stagger: { each: 0.06, from: 'center' },
        }, 1)
        .to(props, {
          opacity: 1, x: 0, duration: 1, ease: 'expo.out',
          stagger: 0.12,
        }, 1.3)

      // --- Stage 3: comparativa ---
      tl.to(stageIndicatorRef.current, { text: '03', duration: 0.01 }, 2)
        .to(blocksRef.current, {
          opacity: 0.15, scale: 0.85, duration: 0.8, ease: 'power2.inOut',
        }, 2)
        .to(propsRef.current, {
          opacity: 0, x: -20, duration: 0.6, ease: 'power2.in',
        }, 2)
        .to(compareRef.current, {
          opacity: 1, duration: 0.5, ease: 'power2.out',
        }, 2.2)
        .to(compareHeader, {
          opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        }, 2.3)
        .to(compareRows, {
          opacity: 1, x: 0, duration: 0.5, ease: 'expo.out',
          stagger: 0.06,
        }, 2.4)

      // --- Stage 4: signal de scroll cap a la següent secció ---
      tl.to(stageIndicatorRef.current, { text: '04', duration: 0.01 }, 3)
    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="aac"
      ref={sectionRef}
      className="relative bg-stone-100"
    >
      {/* Aquest div és el que es pina */}
      <div
        ref={stageRef}
        className="relative min-h-screen overflow-hidden flex flex-col justify-center py-20 md:py-24"
      >
        <div className="max-w-[1600px] mx-auto px-5 md:px-10 w-full">
          {/* Capçalera amb stage indicator */}
          <div className="grid grid-cols-12 gap-4 md:gap-8 mb-10 md:mb-14">
            <div className="col-span-12 md:col-span-4 flex items-baseline gap-4">
              <div className="section-label text-anthracite-500">{t.aac.label}</div>
              <div className="hidden md:flex items-baseline gap-2">
                <span className="section-label text-sage-700">STAGE</span>
                <span
                  ref={stageIndicatorRef}
                  className="font-display text-3xl text-sage-700 font-light tracking-tight num-tabular"
                >
                  01
                </span>
                <span className="section-label text-anthracite-400">/ 04</span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2
                ref={headingRef}
                className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700"
              >
                <span className="font-extralight">{t.aac.title}</span>
                <br />
                <span className="text-sage-600 italic-feature font-semibold">{t.aac.titleEm}</span>
              </h2>
            </div>
          </div>

          {/* Layout central: blocs visuals + contingut canviant */}
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
            {/* COLUMNA ESQUERRA: visualització de blocs AAC */}
            <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
              <div
                ref={blocksRef}
                className="relative aspect-[5/4] bg-stone-200 p-6 md:p-10 flex items-center justify-center"
              >
                {/* Mur de blocs AAC */}
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const row = Math.floor(i / 5)
                    const col = i % 5
                    // Alternem alguns blocs per dimensions diferents (com en una paret real)
                    const isLong = (row === 1 && col === 2)
                    return (
                      <div
                        key={i}
                        data-block
                        className="bg-bone-100 border border-anthracite-700/8 shadow-sm relative overflow-hidden"
                        style={{
                          aspectRatio: isLong ? '2/1' : '1/1',
                          gridColumn: isLong ? 'span 2' : 'span 1',
                        }}
                      >
                        {/* Textura subtil al bloc */}
                        <div className="absolute inset-0 opacity-30" style={{
                          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(44,46,45,0.04) 1px, transparent 1px),
                                            radial-gradient(circle at 70% 80%, rgba(44,46,45,0.04) 1px, transparent 1px)`,
                          backgroundSize: '8px 8px, 12px 12px',
                        }} />
                      </div>
                    )
                  })}
                </div>
                {/* Etiqueta cantonada */}
                <div className="absolute top-4 left-4 section-label text-anthracite-500">
                  AAC · 500 KG/M³
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-xs text-sage-700 tracking-widest">
                  λ = 0,10 W/m·K
                </div>
              </div>
            </div>

            {/* COLUMNA DRETA: contingut canviant amb scroll */}
            <div className="col-span-12 lg:col-span-7 order-1 lg:order-2 lg:pl-6 relative" style={{ minHeight: '460px' }}>
              {/* Capa 1: lead + propietats */}
              <div className="absolute inset-0">
                <p className="text-anthracite-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                  {t.aac.lead}
                </p>

                <div ref={propsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                  {t.aac.properties.map((prop, i) => (
                    <div
                      key={i}
                      data-prop
                      className="bg-bone-100 p-5 md:p-6 border border-anthracite-700/5"
                    >
                      <div className="font-mono text-xs text-sage-700 mb-2 tracking-widest">
                        0{i + 1}
                      </div>
                      <h3 className="font-display text-base md:text-lg font-medium text-anthracite-700 tracking-tight mb-1.5">
                        {prop.title}
                      </h3>
                      <p className="text-xs md:text-sm text-anthracite-600 leading-relaxed">
                        {prop.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capa 2: comparativa (apareix al stage 3) */}
              <div
                ref={compareRef}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <div data-comp-header>
                  <h3 className="font-display text-2xl md:text-3xl font-medium text-anthracite-700 tracking-tight mb-2">
                    {t.aac.comparisonTitle}
                  </h3>
                  <p className="text-sm md:text-base text-anthracite-500 mb-6 md:mb-8">
                    {t.aac.comparisonSubtitle}
                  </p>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  {t.aac.compare.rows.slice(0, 5).map((row, i) => (
                    <div
                      key={i}
                      data-comp-row
                      className="grid grid-cols-12 gap-2 md:gap-4 py-2.5 md:py-3 border-b border-anthracite-700/8 items-baseline"
                    >
                      <div className="col-span-12 md:col-span-5 text-xs md:text-sm text-anthracite-700 font-medium">
                        {row.feature}
                      </div>
                      <div className="col-span-6 md:col-span-4 text-sm md:text-base text-sage-700 font-medium num-tabular flex items-center gap-1.5">
                        <Check size={12} strokeWidth={2.5} className="text-sage-600 flex-shrink-0" />
                        {row.aac}
                      </div>
                      <div className="col-span-6 md:col-span-3 text-xs md:text-sm text-anthracite-400 num-tabular">
                        {row.brick}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Indicador inferior */}
          <div className="mt-12 md:mt-16 flex items-center justify-center gap-3 text-anthracite-500 section-label">
            <span className="inline-block w-8 h-px bg-anthracite-500/30" />
            <span>{lang === 'ca' ? 'SCROLLEJA PER VEURE EL PROCÉS' : 'DESPLAZA PARA VER EL PROCESO'}</span>
            <span className="inline-block w-8 h-px bg-anthracite-500/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
