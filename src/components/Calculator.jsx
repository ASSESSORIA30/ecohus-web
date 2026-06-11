import { useMemo, useState } from 'react'
import { Calculator as CalculatorIcon, FileDown } from 'lucide-react'
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


const pdfEscape = (text) => String(text)
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013\u2014]/g, '-')
  .replace(/€/g, 'EUR')
  .replace(/²/g, '2')
  .replace(/[\\()]/g, '\\$&')

function buildPdf({ isCa, cp, result }) {
  const lines = []
  const add = (x, y, size, text, font = 'F1') => {
    lines.push(`BT /${font} ${size} Tf ${x} ${y} Td (${pdfEscape(text)}) Tj ET`)
  }
  const title = isCa ? 'Pressupost orientatiu EkoHus Habitat' : 'Presupuesto orientativo EkoHus Habitat'
  const subtitle = isCa ? 'Vivienda d alta eficiencia en hormigo cellular AAC' : 'Vivienda de alta eficiencia en hormigon celular AAC'
  const rows = [
    [isCa ? 'Construccio' : 'Construccion', `${result.surface} m2 x ${fmtM2(result.ref.price)}`, fmt(result.construction)],
    [isCa ? 'Direccio i final d obra' : 'Direccion y final de obra', '', fmt(result.architect)],
    [isCa ? 'Cimentacio' : 'Cimentacion', '', fmt(result.foundation)],
    [isCa ? 'Escomeses i sanejament' : 'Acometidas y saneamiento', '', fmt(result.connections)],
  ]

  add(54, 780, 22, title, 'F2')
  add(54, 755, 10, subtitle)
  add(54, 718, 11, `${isCa ? 'Codi postal' : 'Codigo postal'}: ${cp || '-'}`)
  add(54, 700, 11, `${isCa ? 'Superficie' : 'Superficie'}: ${result.surface} m2`)
  add(54, 682, 11, `${isCa ? 'Preu base construccio' : 'Precio base construccion'}: ${fmtM2(result.ref.price)}`)
  add(54, 660, 10, isCa ? 'Pressupost LLAVE EN MANO segons desglossament orientatiu.' : 'Presupuesto LLAVE EN MANO segun desglose orientativo.')

  lines.push('0.75 0.80 0.72 rg 54 620 488 34 re f')
  add(72, 631, 11, isCa ? 'Concepte' : 'Concepto', 'F2')
  add(300, 631, 11, isCa ? 'Detall' : 'Detalle', 'F2')
  add(455, 631, 11, 'Import', 'F2')

  let y = 588
  rows.forEach(([label, detail, value]) => {
    lines.push('0.88 0.88 0.84 RG 54 ' + (y - 10) + ' 488 0.6 re S')
    add(72, y, 10, label)
    add(300, y, 9, detail)
    add(455, y, 10, value)
    y -= 34
  })

  lines.push('0.18 0.19 0.19 rg 54 420 488 56 re f')
  add(72, 443, 13, isCa ? 'TOTAL CLAU EN MA' : 'TOTAL LLAVE EN MANO', 'F2')
  add(360, 443, 20, `${fmt(result.total)} + IVA`, 'F2')
  add(72, 402, 9, isCa ? 'IVA no inclos. Pressupost orientatiu pendent de projecte, parcela i memoria de qualitats.' : 'IVA no incluido. Presupuesto orientativo pendiente de proyecto, parcela y memoria de calidades.')
  add(54, 82, 9, 'www.ekohushabitat.com')

  const stream = lines.join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((obj, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach(o => { pdf += `${String(o).padStart(10, '0')} 00000 n \n` })
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

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
  const [cp, setCp] = useState('')
  const [m2, setM2] = useState('')

  const result = useMemo(() => {
    const surface = Number(m2) || 0
    const ref = findReference(cp.trim())
    const hasSurface = surface >= 100
    const construction = hasSurface ? surface * ref.price : 0
    const architect = hasSurface ? surface * ARCHITECT_PER_M2 + ARCHITECT_FIXED : 0
    const foundation = hasSurface ? surface * FOUNDATION_PER_M2 : 0
    const connections = hasSurface ? CONNECTIONS_FIXED : 0
    const total = construction + architect + foundation + connections
    return { surface, ref, construction, architect, foundation, connections, total, hasSurface }
  }, [cp, m2])

  const isCa = lang === 'ca'

  const generateBudget = () => {
    if (!result.hasSurface) return
    const blob = buildPdf({ isCa, cp: cp.trim(), result })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = isCa ? 'pressupost-ekohus.pdf' : 'presupuesto-ekohus.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section id="calculator" className="relative py-20 md:py-32 calculator-block-bg scroll-mt-32">
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
              {isCa ? 'Estimació orientativa per a habitatge unifamiliar d’alta eficiència. Mínim de càlcul: 100 m². Els imports finals depenen de parcel·la, normativa i memòria de qualitats.' : 'Estimación orientativa para vivienda unifamiliar de alta eficiencia. Mínimo de cálculo: 100 m². Los importes finales dependen de parcela, normativa y memoria de calidades.'}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-anthracite-700 text-bone-100 rounded-[2rem] p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-bone-100/12 pb-8">
              <div>
                <div className="section-label text-bone-100/45 mb-4">{isCa ? 'Total estimat' : 'Total estimado'}</div>
                <div className="font-display text-5xl md:text-7xl font-light tracking-tight num-tabular">{result.hasSurface ? fmt(result.total) : '—'}</div>
                <div className="mt-3 text-bone-100/55">{result.hasSurface ? `IVA ${isCa ? 'no inclòs' : 'no incluido'}` : (isCa ? 'Introdueix mínim 100 m²' : 'Introduce mínimo 100 m²')}</div>
              </div>
            </div>

            <div className="divide-y divide-bone-100/12">
              <Row label={isCa ? 'Construcció' : 'Construcción'} detail={result.hasSurface ? `${result.surface} m² x ${fmtM2(result.ref.price)}` : ''} value={result.hasSurface ? fmt(result.construction) : '—'} />
              <Row label={isCa ? 'Direcció i final d’obra' : 'Dirección y final de obra'} value={result.hasSurface ? fmt(result.architect) : '—'} />
              <Row label={isCa ? 'Cimentació' : 'Cimentación'} value={result.hasSurface ? fmt(result.foundation) : '—'} />
              <Row label={isCa ? 'Escomeses i sanejament' : 'Acometidas y saneamiento'} value={result.hasSurface ? fmt(result.connections) : '—'} />
            </div>

            <div className="mt-8 rounded-2xl border border-sage-500/30 bg-sage-500/10 px-5 py-4 text-sm text-bone-100/70">
              {!result.hasSurface
                ? <><strong className="text-sage-300">{isCa ? 'Mínim 100 m².' : 'Mínimo 100 m².'}</strong> {isCa ? 'La calculadora no mostrarà imports fins arribar a aquesta superfície.' : 'La calculadora no mostrará importes hasta alcanzar esta superficie.'}</>
                : result.ref.exact
                  ? <><strong className="text-sage-300">{isCa ? 'Codi postal localitzat.' : 'Código postal localizado.'}</strong> {isCa ? 'Base de construcció aplicada:' : 'Base de construcción aplicada:'} {fmtM2(result.ref.price)}</>
                  : <><strong className="text-sage-300">{isCa ? 'Codi postal no trobat.' : 'Código postal no encontrado.'}</strong> {isCa ? 'S’ha utilitzat una referència propera per fer l’estimació.' : 'Se ha utilizado una referencia cercana para hacer la estimación.'}</>}
            </div>

            {result.hasSurface && (
              <button onClick={generateBudget} className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-bone-100 px-7 py-4 text-sm font-semibold text-anthracite-700 shadow-lg transition hover:bg-sage-500 hover:text-bone-100">
                <FileDown size={18} />
                {isCa ? 'Generar pressupost' : 'Generar presupuesto'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, detail = '' }) {
  return (
    <div className="py-6 flex items-center justify-between gap-4">
      <div>
        <div className="font-medium text-lg text-bone-100/90">{label}</div>
        {detail && <div className="mt-1 text-sm text-bone-100/45 font-mono">{detail}</div>}
      </div>
      <div className="font-mono text-xl text-bone-100 num-tabular whitespace-nowrap">{value}</div>
    </div>
  )
}
