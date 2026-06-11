import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Sustainability() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const imageRef = useRef(null)
  const imageWrapRef = useRef(null)
  const pointsRef = useRef(null)

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

      const points = pointsRef.current.querySelectorAll('[data-point]')
      gsap.from(points, {
        opacity: 0,
        x: -20,
        duration: 0.8,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: pointsRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="sustainability"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-sage-50 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-sage-700">{t.sustainability.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              key={lang}
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.sustainability.title}
              <br />
              <span className="text-sage-600">{t.sustainability.titleEm}</span>
            </h2>
            <p className="mt-7 max-w-2xl text-anthracite-600 text-lg leading-relaxed">
              {t.sustainability.lead}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-32">
            <div
              ref={imageWrapRef}
              className="relative aspect-[4/5] overflow-hidden bg-sage-200"
            >
              <div ref={imageRef} className="absolute inset-0 scale-110">
                <img
                  src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=85&w=1200"
                  alt="Casa sostenible nòrdica al bosc"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div ref={pointsRef} className="col-span-12 lg:col-span-7 space-y-1">
            {t.sustainability.points.map((point, i) => (
              <article
                key={i}
                data-point
                className="py-8 border-t border-anthracite-700/15 grid grid-cols-12 gap-4 items-start"
              >
                <div className="col-span-12 md:col-span-1 font-mono text-sm text-sage-700">
                  0{i + 1}
                </div>
                <div className="col-span-12 md:col-span-11 md:pl-4">
                  <h3 className="font-display text-xl md:text-2xl font-medium text-anthracite-700 tracking-tight mb-3">
                    {point.title}
                  </h3>
                  <p className="text-anthracite-600 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
