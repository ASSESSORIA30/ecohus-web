import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { useT } from '../lib/i18n'
import MagneticButton from './MagneticButton'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(titleRef.current, {
        types: 'lines,words',
        lineClass: 'reveal-line',
      })
      gsap.set(split.words, { yPercent: 110 })
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(split.words, {
            yPercent: 0,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.05,
          })
        },
      })

      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-44 overflow-hidden bg-anthracite-700"
    >
      <div ref={imageRef} className="absolute inset-0 scale-110">
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=2000"
          alt="Casa moderna escandinava EkoHus"
          className="w-full h-full object-cover opacity-40"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-anthracite-700/60 via-anthracite-700/70 to-anthracite-700/85" />

      <div className="relative max-w-[1600px] mx-auto px-5 md:px-10 text-center text-bone-100">
        <h2
          ref={titleRef}
          className="font-display text-display leading-[1.05] tracking-tighter-2 font-medium max-w-4xl mx-auto"
        >
          {t.finalCta.title}
          <br />
          <span className="text-sage-300">{t.finalCta.titleEm}</span>
        </h2>
        <p className="mt-7 max-w-xl mx-auto text-base md:text-lg text-bone-100/75 leading-relaxed">
          {t.finalCta.subtitle}
        </p>
        <MagneticButton strength={0.35}>
          <button
            onClick={() => {
              const target = document.querySelector('#contact')
              if (window.lenis) window.lenis.scrollTo(target, { offset: -40, duration: 1.6 })
            }}
            className="mt-10 group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-sage-500 text-bone-100 font-medium text-sm hover:bg-sage-400 transition-colors"
          >
            <ScrambleText trigger="hover">{t.finalCta.cta}</ScrambleText>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </button>
        </MagneticButton>
      </div>
    </section>
  )
}
