import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Leaf, Layers, Recycle, Thermometer } from 'lucide-react'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const ICONS = [Thermometer, Layers, Recycle, Leaf]

export default function About() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const reasonsWrapRef = useRef(null)

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

      const cards = reasonsWrapRef.current.querySelectorAll('[data-reason]')
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: reasonsWrapRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-bone-100"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-anthracite-500">{t.about.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.about.title}
              <br />
              <span className="text-sage-600">{t.about.titleEm}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-anthracite-600 text-lg leading-relaxed">
              {t.about.lead}
            </p>
          </div>
        </div>

        <div ref={reasonsWrapRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {t.about.reasons.map((reason, i) => {
            const Icon = ICONS[i]
            return (
              <article
                key={i}
                data-reason
                className="relative bg-bone-200 p-8 md:p-10 group transition-colors duration-500 hover:bg-sage-50 border border-anthracite-700/5"
              >
                <div className="flex items-start gap-5 md:gap-7">
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-bone-100 border border-sage-200 flex items-center justify-center text-sage-600 group-hover:bg-sage-500 group-hover:text-bone-100 group-hover:border-sage-500 transition-all duration-500">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl md:text-2xl font-medium text-anthracite-700 tracking-tight">
                      {reason.title}
                    </h3>
                    <p className="mt-3 text-anthracite-600 leading-relaxed text-sm md:text-base">
                      {reason.desc}
                    </p>
                    <div className="mt-5 pt-5 border-t border-anthracite-700/10 flex items-end justify-between gap-3">
                      <div>
                        <div className="font-display text-2xl md:text-3xl text-sage-700 tracking-tight font-medium num-tabular">
                          {reason.metric}
                        </div>
                        <div className="section-label text-anthracite-500 mt-1">
                          {reason.metricLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
