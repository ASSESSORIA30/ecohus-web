import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const stepsRef = useRef(null)
  const progressRef = useRef(null)

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

      // Progress bar fills as steps scroll
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        }
      )

      const steps = stepsRef.current.querySelectorAll('[data-step]')
      steps.forEach((step) => {
        gsap.from(step, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 80%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-anthracite-700 text-bone-100 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-24">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-bone-100/50">{t.process.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 font-medium"
            >
              {t.process.title}
              <br />
              <span className="text-sage-300">{t.process.titleEm}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-bone-100/70 text-lg leading-relaxed">
              {t.process.lead}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div ref={stepsRef} className="relative pl-10 md:pl-16">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-bone-100/15" />
          <div
            ref={progressRef}
            className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-sage-300 origin-top"
          />

          {t.process.steps.map((step, i) => (
            <div
              key={i}
              data-step
              className="relative py-8 md:py-12 grid grid-cols-12 gap-4 md:gap-8 items-start"
            >
              {/* Dot */}
              <div className="absolute -left-[34px] md:-left-[40px] top-10 md:top-14 w-3 h-3 rounded-full bg-sage-300 ring-4 ring-anthracite-700" />

              <div className="col-span-12 md:col-span-3">
                <div className="font-mono text-xs text-sage-300 tracking-widest mb-2">
                  ETAPA 0{i + 1}
                </div>
                <h3 className="font-display text-3xl md:text-4xl tracking-tight font-medium leading-tight">
                  {step.title}
                </h3>
                <div className="mt-2 text-sm text-bone-100/60 font-mono">
                  {step.duration}
                </div>
              </div>

              <div className="col-span-12 md:col-span-9 md:pl-8">
                <p className="text-base md:text-lg text-bone-100/80 leading-relaxed max-w-2xl">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
