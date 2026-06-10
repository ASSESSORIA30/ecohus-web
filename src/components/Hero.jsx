import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { t, lang } = useT()
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(titleRef.current, { types: 'lines,words', lineClass: 'reveal-line' })
      gsap.set(split.words, { yPercent: 110 })
      gsap.set([subtitleRef.current, statsRef.current, ctaRef.current], { opacity: 0, y: 28 })
      gsap.timeline({ delay: 0.15 })
        .to(split.words, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.035 })
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.75')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.65')
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.65')

      gsap.to('.hero-bg', {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [lang])

  const scrollTo = (selector) => {
    const target = document.querySelector(selector)
    if (!target) return
    if (window.lenis) window.lenis.scrollTo(target, { offset: -40, duration: 1.4 })
    else target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" ref={heroRef} className="relative min-h-screen w-full overflow-hidden bg-anthracite-700 text-bone-100">
      <picture className="absolute inset-0 block h-full w-full">
        <source srcSet="/hero-ekohus.webp" type="image/webp" />
        <img
          src="/hero-ekohus.webp"
          alt="Casa moderna d'alta eficiència energètica construïda amb formigó cel·lular AAC per EkoHus Habitat"
          className="hero-bg h-full w-full object-cover object-center"
          width="1920"
          height="1080"
          fetchPriority="high"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-r from-anthracite-700/82 via-anthracite-700/42 to-anthracite-700/8" />
      <div className="absolute inset-0 bg-gradient-to-t from-anthracite-700/55 via-transparent to-anthracite-700/12" />

      <div className="relative z-10 min-h-screen w-full px-5 md:px-10 pt-36 pb-10 flex flex-col justify-end">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="max-w-4xl">
            <div className="section-label text-bone-100/75 mb-6">{t.hero.tagline}</div>
            <h1 ref={titleRef} className="font-display text-[clamp(3.25rem,9vw,9.5rem)] leading-[0.9] tracking-tightest font-light text-bone-100">
              {t.hero.title}<br />
              <span className="font-semibold text-bone-100">{t.hero.titleEm}</span>
            </h1>
            <p ref={subtitleRef} className="mt-8 max-w-2xl text-base md:text-xl text-bone-100/88 leading-relaxed font-light">
              {t.hero.subtitle}
            </p>
            <div ref={ctaRef} className="mt-9 flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollTo('#contact')} className="btn-primary group">
                <span>{t.hero.cta1}</span>
                <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <button onClick={() => scrollTo('#calculator')} className="btn-secondary border-bone-100/60 text-bone-100 hover:bg-bone-100 hover:text-anthracite-700">
                {lang === 'ca' ? 'Calcular pressupost' : 'Calcular presupuesto'}
                <ArrowDown size={14} />
              </button>
            </div>
          </div>

          <div ref={statsRef} className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl border-t border-bone-100/20 pt-6">
            {[t.hero.stat1, t.hero.stat2, t.hero.stat3].map((stat, i) => (
              <div key={i} className="pr-6">
                <div className="font-display text-3xl text-bone-100 tracking-tight font-light num-tabular">{stat.value}</div>
                <div className="section-label text-bone-100/65 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
