import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

// Images per projecte - cases nòrdiques modernes
const IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1400',
  'https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&q=85&w=1400',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=85&w=1400',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=85&w=1400',
]

export default function Projects() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

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
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-bone-100 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-anthracite-500">{t.projects.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.projects.title}{' '}
              <span className="text-sage-600">{t.projects.titleEm}</span>.
            </h2>
            <p className="mt-7 max-w-2xl text-anthracite-600 text-lg leading-relaxed">
              {t.projects.lead}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {t.projects.cards.map((card, i) => (
            <ProjectCard key={i} card={card} image={IMAGES[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ card, image, index }) {
  const cardRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: (index % 2) * 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 85%' },
        }
      )
      gsap.to(imgRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, cardRef)
    return () => ctx.revert()
  }, [index])

  // Alternating sizes for editorial layout
  const isLarge = index % 3 === 0
  const colSpan = isLarge ? 'col-span-12 lg:col-span-8' : 'col-span-12 md:col-span-6 lg:col-span-4'
  const aspect = isLarge ? 'aspect-[16/10]' : 'aspect-[4/5]'

  return (
    <article ref={cardRef} className={`group ${colSpan}`}>
      <div className={`relative ${aspect} overflow-hidden bg-stone-200 mb-4`}>
        <div ref={imgRef} className="absolute inset-0">
          <img
            src={image}
            alt={`Projecte ${card.name} d'EkoHus Habitat a ${card.location}`}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute top-4 left-4 section-label text-bone-100 bg-anthracite-700/80 backdrop-blur-sm px-2.5 py-1">
          {card.code}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-medium text-anthracite-700 tracking-tight">
            Casa {card.name}
          </h3>
          <p className="mt-1 text-sm text-anthracite-500">
            {card.location} · {card.size}
          </p>
        </div>
        <ArrowUpRight
          size={22}
          className="text-anthracite-400 group-hover:text-sage-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 flex-shrink-0"
        />
      </div>

      {isLarge && (
        <p className="mt-4 text-anthracite-600 max-w-xl leading-relaxed">
          {card.description}
        </p>
      )}
    </article>
  )
}
