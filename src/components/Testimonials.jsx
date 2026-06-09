import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Quote } from 'lucide-react'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Testimonials() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef(null)

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

      const cards = cardsRef.current.querySelectorAll('[data-card]')
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-bone-100"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-anthracite-500">{t.testimonials.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.testimonials.title}{' '}
              <span className="text-sage-600">{t.testimonials.titleEm}</span>.
            </h2>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {t.testimonials.items.map((item, i) => (
            <article
              key={i}
              data-card
              className="bg-bone-200 p-7 md:p-9 border border-anthracite-700/5 flex flex-col"
            >
              <Quote size={24} className="text-sage-500 mb-5" strokeWidth={1.5} />
              <p className="text-base md:text-lg text-anthracite-700 leading-relaxed flex-1">
                {item.quote}
              </p>
              <div className="mt-7 pt-5 border-t border-anthracite-700/10">
                <div className="font-display text-base font-medium text-anthracite-700">
                  {item.name}
                </div>
                <div className="text-xs text-anthracite-500 mt-1 font-mono tracking-wide">
                  {item.project}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
