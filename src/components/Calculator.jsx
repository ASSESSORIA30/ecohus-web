import { useMemo, useState } from 'react'
import { Calculator as CalculatorIcon } from 'lucide-react'
import { useT } from '../lib/i18n'

const CP_PRICES = {
  '08001': 1860, '08002': 1860, '08003': 1860, '08004': 1845, '08005': 1880,
  '08960': 1715, '08172': 1780, '17001': 1585, '25001': 1409.4, '25142': 1325,
  '25996': 1749.6, '43001': 1485, '28001': 1910, '46001': 1575, '50001': 1465,
}
const DEFAULT_PRICE = 1450
const ARCHITECT_PER_M2 = 130
const ARCHITECT_FIXED = 1800
const FOUNDATION_PER_M2 = 120
const CONNECTIONS_FIXED = 2800

const fmt = (n) => new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' €'
const fmtM2 = (n) => new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 1 }).format(n) + ' €/m²'

function findReference(cp) {
  if (CP_PRICES[cp]) return { cp, price: CP_PRICES[cp], exact: true }
  const numeric = Number(cp)
  if (!Number.isFinite(numeric)) return { cp: 'referència estatal', price: DEFAULT_PRICE, exact: false }
  const nearest = Object.keys(CP_PRICES).reduce((best, key) => {
    const d = Math.abs(Number(key) - numeric)
    return d < best.d ? { key, d } : best
  }, { key: '25001', d: Infinity }).key
  return { cp: nearest, price: CP_PRICES[nearest], exact: false }
}

export default function Calculator() {
  const { lang } = useT()
  const [cp, setCp] = useState('25001')
  const [m2, setM2] = useState(150)

  const result = useMemo(() => {
    const surface = Math.max(1, Number(m2) || 1)
    const ref = findReference(cp.trim())
    const construction = surface * ref.price
    const architect = surface * ARCHITECT_PER_M2 + ARCHITECT_FIXED
    const foundation = surface * FOUNDATION_PER_M2
    const connections = CONNECTIONS_FIXED
    const total = construction + architect + foundation + connections
    return { surface, ref, construction, architect, foundation, connections, total }
  }, [cp, m2])

  const isCa = lang === 'ca'

  return (
    <section id="calculator" className="relative py-20 md:py-32 bg-bone-100 scroll-mt-32">
      <div className="max-w-[1600px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 lg:col-span-5 bg-white/70 border border-anthracite-700/10 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-sage-500/15 text-sage-700 flex items-center justify-center"><CalculatorIcon size={22} /></div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight text-anthracite-700">{isCa ? 'Pressupost orientatiu' : 'Presupuesto orientativo'}</h2>
                <p className="text-anthracite-500 mt-1">{isCa ? 'Codi postal + superfície' : 'Código postal + superficie'}</p>
              </div>
            </div>
            <label className="section-label text-anthracite-500 block mb-2">{isCa ? 'Codi postal' : 'Código postal'}</label>
            <input value={cp} onChange={e => setCp(e.target.value.replace(/[^0-9]/g, '').slice(0,5))} inputMode="numeric" className="w-full rounded-2xl border border-anthracite-700/15 bg-bone-100 px-5 py-4 text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-sage-500/40" />
            <label className="section-label text-anthracite-500 block mb-2 mt-6">{isCa ? 'Superfície total' : 'Superficie total'}</label>
            <div className="relative">
              <input value={m2} onChange={e => setM2(e.target.value.replace(/[^0-9]/g, '').slice(0,4))} inputMode="numeric" className="w-full rounded-2xl border border-anthracite-700/15 bg-bone-100 px-5 py-4 pr-14 text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-sage-500/40" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-anthracite-500">m²</span>
            </div>
            <p className="mt-6 text-sm md:text-base text-anthracite-500 leading-relaxed">
              {isCa ? 'Estimació orientativa per a habitatge unifamiliar d’alta eficiència. Els imports finals depenen de parcel·la, normativa i memòria de qualitats.' : 'Estimación orientativa para vivienda unifamiliar de alta eficiencia. Los importes finales dependen de parcela, normativa y memoria de calidades.'}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-anthracite-700 text-bone-100 rounded-[2rem] p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-bone-100/12 pb-8">
              <div>
                <div className="section-label text-bone-100/45 mb-4">{isCa ? 'Total estimat' : 'Total estimado'}</div>
                <div className="font-display text-5xl md:text-7xl font-light tracking-tight num-tabular">{fmt(result.total)}</div>
                <div className="mt-3 text-bone-100/55">IVA {isCa ? 'no inclòs' : 'no incluido'}</div>
              </div>
            </div>

            <div className="divide-y divide-bone-100/12">
              <Row label={isCa ? 'Construcció' : 'Construcción'} value={fmt(result.construction)} />
              <Row label={isCa ? 'Honoraris arquitecte' : 'Honorarios arquitecto'} value={fmt(result.architect)} />
              <Row label={isCa ? 'Cimentació' : 'Cimentación'} value={fmt(result.foundation)} />
              <Row label={isCa ? 'Escomeses i sanejament' : 'Acometidas y saneamiento'} value={fmt(result.connections)} />
            </div>

            <div className="mt-8 rounded-2xl border border-sage-500/30 bg-sage-500/10 px-5 py-4 text-sm text-bone-100/70">
              {result.ref.exact
                ? <><strong className="text-sage-300">{isCa ? 'Codi postal localitzat.' : 'Código postal localizado.'}</strong> {isCa ? 'Base de construcció aplicada:' : 'Base de construcción aplicada:'} {fmtM2(result.ref.price)}</>
                : <><strong className="text-sage-300">{isCa ? 'Codi postal no trobat.' : 'Código postal no encontrado.'}</strong> {isCa ? 'S’ha utilitzat una referència propera per fer l’estimació.' : 'Se ha utilizado una referencia cercana para hacer la estimación.'}</>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="py-6 flex items-center justify-between gap-4">
      <div className="font-medium text-lg text-bone-100/90">{label}</div>
      <div className="font-mono text-xl text-bone-100 num-tabular whitespace-nowrap">{value}</div>
    </div>
  )
}
