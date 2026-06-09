import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { useT } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const { t, lang } = useT()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '', plot: '', budget: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

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
            stagger: 0.05,
          })
        },
      })

      const fields = sectionRef.current.querySelectorAll('[data-field]')
      gsap.from(fields, {
        opacity: 0, y: 20, duration: 0.7, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: fields[0], start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [lang])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', form)
    // TODO: Connect to backend (Formspree, Resend, etc.)
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-bone-200"
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-4 md:gap-8 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-4">
            <div className="section-label text-anthracite-500">{t.contact.label}</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              ref={headingRef}
              className="font-display text-display leading-[1.0] tracking-tighter-2 text-anthracite-700 font-medium"
            >
              {t.contact.title}{' '}
              <span className="text-sage-600">{t.contact.titleEm}</span>.
            </h2>
            <p className="mt-7 max-w-2xl text-anthracite-600 text-lg leading-relaxed">
              {t.contact.lead}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <div className="col-span-12 lg:col-span-8">
            {submitted ? (
              <div className="py-16 border-t border-b border-anthracite-700/10">
                <div className="section-label text-sage-700 mb-4">— REBUT</div>
                <h3 className="font-display text-3xl md:text-5xl text-anthracite-700 tracking-tight font-medium leading-tight mb-3">
                  {t.contact.thanks.title}
                </h3>
                <p className="text-anthracite-600 max-w-md">
                  {t.contact.thanks.text}{' '}
                  <span className="text-sage-700">hola@ekohushabitat.com</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border-t border-anthracite-700/10">
                <Field data-field name="name" label={t.contact.fields.name} type="text" value={form.name} onChange={handleChange} required />
                <Field data-field name="email" label={t.contact.fields.email} type="email" value={form.email} onChange={handleChange} required />
                <Field data-field name="phone" label={t.contact.fields.phone} type="tel" value={form.phone} onChange={handleChange} />
                <Field data-field name="location" label={t.contact.fields.location} type="text" value={form.location} onChange={handleChange} />

                <ChipField
                  data-field
                  label={t.contact.fields.plot}
                  options={t.contact.fields.plotOptions}
                  value={form.plot}
                  onChange={(v) => setForm({ ...form, plot: v })}
                />
                <ChipField
                  data-field
                  label={t.contact.fields.budget}
                  options={t.contact.fields.budgetOptions}
                  value={form.budget}
                  onChange={(v) => setForm({ ...form, budget: v })}
                />

                <div data-field className="py-6 border-b border-anthracite-700/10 grid grid-cols-12 gap-4 items-start">
                  <label htmlFor="message" className="col-span-12 md:col-span-4 section-label text-anthracite-500 pt-2">
                    {t.contact.fields.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="col-span-12 md:col-span-8 bg-transparent text-anthracite-700 text-base md:text-lg placeholder:text-anthracite-400 focus:outline-none resize-none"
                  />
                </div>

                <div data-field className="pt-8">
                  <button type="submit" className="btn-primary group">
                    <span>{t.contact.fields.send}</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </button>
                  <p className="mt-4 text-xs text-anthracite-400 max-w-md">
                    {t.contact.fields.privacy}
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-anthracite-700/10 space-y-9 mt-10 lg:mt-0 pt-10 lg:pt-0 border-t lg:border-t-0 border-anthracite-700/10">
            <div>
              <div className="section-label text-sage-700 mb-3">{t.contact.info.emailLabel}</div>
              <a href="mailto:hola@ekohushabitat.com" className="font-display text-lg text-anthracite-700 link-underline">
                hola@ekohushabitat.com
              </a>
            </div>
            <div>
              <div className="section-label text-sage-700 mb-3">{t.contact.info.phoneLabel}</div>
              <a href="tel:+34684784887" className="font-display text-lg text-anthracite-700 link-underline">
                +34 684 784 887
              </a>
            </div>
            <div>
              <div className="section-label text-sage-700 mb-3">{t.contact.info.hoursLabel}</div>
              <p className="text-sm text-anthracite-600 leading-relaxed">
                {t.contact.info.hours}<br />
                {t.contact.info.visits}
              </p>
            </div>
            <div>
              <div className="section-label text-sage-700 mb-3">WEB</div>
              <p className="text-sm text-anthracite-600">www.ekohushabitat.com</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Field({ name, label, type, value, onChange, required, ...rest }) {
  return (
    <div {...rest} className="py-6 border-b border-anthracite-700/10 grid grid-cols-12 gap-4 items-center">
      <label htmlFor={name} className="col-span-12 md:col-span-4 section-label text-anthracite-500">
        {label}{required && <span className="text-sage-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={label}
        className="col-span-12 md:col-span-8 bg-transparent text-anthracite-700 text-base md:text-lg placeholder:text-anthracite-400 focus:outline-none focus:text-sage-700 transition-colors"
      />
    </div>
  )
}

function ChipField({ label, options, value, onChange, ...rest }) {
  return (
    <div {...rest} className="py-6 border-b border-anthracite-700/10 grid grid-cols-12 gap-4 items-start">
      <label className="col-span-12 md:col-span-4 section-label text-anthracite-500 pt-2">{label}</label>
      <div className="col-span-12 md:col-span-8 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
              value === opt
                ? 'bg-sage-500 border-sage-500 text-bone-100'
                : 'border-anthracite-700/20 text-anthracite-600 hover:border-sage-500'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
