import { useEffect, useRef, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useT } from '../lib/i18n'

// Lazy import del 3D — només es carrega quan és necessari
const HouseModel3D = lazy(() => import('./HouseModel3D'))

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { t, lang } = useT()
  const heroRef = useRef(null)
  const sectionNumRef = useRef(null)
  const titleRef = useRef(null)
  const titleEmRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)
  const houseWrapRef = useRef(null)

  // Tres refs separats per al sistema de construcció:
  // - introProgressRef: 0→1 durant l'auto-build després del preloader (2.3s)
  // - rawScrollRef: 0→1 segons scroll dins del hero
  // - scrollRef: el progrés COMBINAT que rep el 3D = intro × (1 - rawScroll)
  // Així: build automàtic primer → scroll desfà la casa de dalt a baix
  const introProgressRef = useRef(0)
  const rawScrollRef = useRef(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    // ============================================================
    //  AUTO-BUILD INTRO: 0 → 1 en 2.3s amb easing exponencial
    //  Espera l'event 'ekohus:ready' (preloader acabat) abans de començar
    // ============================================================
    let introStart = null
    let introRaf = 0
    let introTimer = null
    const introDuration = 2300

    // Detecta prefers-reduced-motion → salta directament a 100%
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const introTick = (now) => {
      if (introStart === null) introStart = now
      const elapsed = now - introStart
      let p = Math.min(1, elapsed / introDuration)
      if (reduced) p = 1
      // Easing: ease-out-quart (cinematogràfic)
      const eased = 1 - Math.pow(1 - p, 4)
      introProgressRef.current = eased
      // Actualitza el progrés combinat: intro × (1 - scroll)
      scrollRef.current = eased * (1 - rawScrollRef.current)
      if (p < 1) {
        introRaf = requestAnimationFrame(introTick)
      }
    }

    const startIntro = () => {
      // Pausa de respir abans que la construcció comenci
      introTimer = setTimeout(() => {
        introRaf = requestAnimationFrame(introTick)
      }, 400)
    }

    // Si el preloader ja ha acabat (navegació entre rutes), comença ara
    if (window.__ekohusReady) {
      startIntro()
    } else {
      // Espera que el preloader desaparegui
      window.addEventListener('ekohus:ready', startIntro, { once: true })
    }
    const ctx = gsap.context(() => {
      // Splits per a animació línia a línia
      const splitMain = new SplitType(titleRef.current, {
        types: 'lines,words',
        lineClass: 'reveal-line',
      })
      const splitEm = new SplitType(titleEmRef.current, {
        types: 'lines,words',
        lineClass: 'reveal-line',
      })
      const allWords = [...splitMain.words, ...splitEm.words]

      gsap.set(allWords, { yPercent: 110 })
      gsap.set([subtitleRef.current, statsRef.current, ctaRef.current, sectionNumRef.current], {
        opacity: 0,
        y: 30,
      })
      gsap.set(houseWrapRef.current, { opacity: 0 })

      // Timeline d'entrada (després del preloader)
      const tl = gsap.timeline({ delay: 0.15 })
      tl.to(sectionNumRef.current, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out'
      })
        .to(allWords, {
          yPercent: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.04,
        }, '-=0.8')
        .to(houseWrapRef.current, {
          opacity: 1, duration: 1.6, ease: 'power2.out'
        }, '-=1.0')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, '-=1.2')
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.9')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.9')

      // ScrollTrigger: alimenta el rawScrollRef + actualitza combinat
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          rawScrollRef.current = self.progress
          // Recalcular progrés combinat: durant scroll, la casa es desfà capa per capa
          scrollRef.current = introProgressRef.current * (1 - self.progress)
        },
      })

      // Parallax subtil del títol
      gsap.to(titleRef.current, {
        yPercent: -15,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      // Numeració decorativa: efecte parallax oposat
      gsap.to(sectionNumRef.current, {
        yPercent: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, heroRef)

    return () => {
      if (introTimer) clearTimeout(introTimer)
      cancelAnimationFrame(introRaf)
      window.removeEventListener('ekohus:ready', startIntro)
      ctx.revert()
    }
  }, [lang])

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[110vh] w-full overflow-hidden bg-bone-100"
    >
      {/* Numeració editorial gran (decorativa, darrere) */}
      <div
        ref={sectionNumRef}
        className="absolute top-[14vh] right-[3vw] md:right-[5vw] pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="text-[18vw] md:text-[14vw] lg:text-[10vw] font-display font-extralight text-anthracite-700/[0.04] leading-none tracking-tightest">
          00
        </div>
      </div>

      {/* Layer del 3D — ocupa tot el viewport */}
      <div
        ref={houseWrapRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <HouseModel3D scrollRef={scrollRef} className="w-full h-full" />
        </Suspense>
      </div>

      {/* Top label */}
      <div className="absolute top-0 left-0 right-0 pt-28 md:pt-32 px-5 md:px-10 z-10 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex items-baseline justify-between gap-4">
          <div className="section-label text-anthracite-500">
            {t.hero.tagline}
          </div>
          <div className="hidden md:block section-label text-anthracite-400">
            ↓ {lang === 'ca' ? 'EXPLORA L\'EXPERIÈNCIA' : 'EXPLORA LA EXPERIENCIA'}
          </div>
        </div>
      </div>

      {/* Contingut principal */}
      <div className="relative z-10 min-h-[110vh] flex flex-col justify-end px-5 md:px-10 pb-20 md:pb-28 max-w-[1600px] mx-auto w-full pt-[40vh]">
        <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
          <div className="col-span-12 lg:col-span-8">
            {/* Títol amb tipografia editorial — mix de pesos */}
            <h1 className="font-display leading-[0.9] tracking-tightest text-anthracite-700">
              <span
                ref={titleRef}
                className="block text-hero font-extralight"
              >
                {t.hero.title}
              </span>
              <span
                ref={titleEmRef}
                className="block text-hero font-semibold text-sage-600 italic-feature"
              >
                {t.hero.titleEm}
                <span className="text-sage-600">.</span>
              </span>
            </h1>

            {/* Subtítol amb drop cap */}
            <p
              ref={subtitleRef}
              className="dropcap mt-8 md:mt-10 max-w-xl text-base md:text-lg text-anthracite-600 leading-relaxed font-light"
            >
              {t.hero.subtitle}
            </p>

            <div
              ref={ctaRef}
              className="mt-9 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <button
                onClick={() => {
                  const target = document.querySelector('#contact')
                  if (window.lenis) window.lenis.scrollTo(target, { offset: -40, duration: 1.6 })
                }}
                className="btn-primary group"
              >
                <span>{t.hero.cta1}</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>

              <button
                onClick={() => {
                  const target = document.querySelector('#projects')
                  if (window.lenis) window.lenis.scrollTo(target, { offset: -40, duration: 1.6 })
                }}
                className="btn-secondary"
              >
                {t.hero.cta2}
                <ArrowDown size={14} />
              </button>
            </div>
          </div>

          {/* Stats — formatats com a fitxa tècnica */}
          <div className="col-span-12 lg:col-span-4 lg:pb-2">
            <div ref={statsRef} className="space-y-5 lg:text-right">
              <div className="section-label text-anthracite-500 lg:text-right">
                — {lang === 'ca' ? 'FITXA TÈCNICA' : 'FICHA TÉCNICA'}
              </div>
              {[t.hero.stat1, t.hero.stat2, t.hero.stat3].map((stat, i) => (
                <div
                  key={i}
                  className="flex justify-between items-baseline lg:justify-end lg:gap-6 pb-3 border-b border-anthracite-700/10"
                >
                  <div className="section-label text-anthracite-500 lg:order-1 lg:text-right max-w-[55%]">
                    {stat.label}
                  </div>
                  <div className="font-display text-2xl md:text-3xl text-anthracite-700 tracking-tight font-light num-tabular">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Indicador scroll discret */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-3 text-anthracite-500 section-label">
        <span className="inline-block w-8 h-px bg-anthracite-500/30" />
        <span>{lang === 'ca' ? 'SCROLLEJA PER DESCOBRIR' : 'DESPLAZA PARA DESCUBRIR'}</span>
        <span className="inline-block w-8 h-px bg-anthracite-500/30" />
      </div>
    </section>
  )
}
