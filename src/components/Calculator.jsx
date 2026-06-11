import { useMemo, useState } from 'react'
import { Calculator as CalculatorIcon, FileDown } from 'lucide-react'
import { useT } from '../lib/i18n'

const CP_PRICES = {
  '08001': 1860, '08002': 1860, '08003': 1860, '08004': 1845, '08005': 1880,
  '08960': 1715, '08172': 1780, '17001': 1585, '25001': 1409.4, '25142': 1325,
  '25996': 1749.6, '43001': 1485, '28001': 1910, '46001': 1575, '50001': 1465,
}
const CP_PLACES = {
  '08001': 'Barcelona', '08002': 'Barcelona', '08003': 'Barcelona', '08004': 'Barcelona', '08005': 'Barcelona',
  '08960': 'Sant Just Desvern', '08172': 'Sant Cugat del Valles', '17001': 'Girona', '25001': 'Lleida', '25142': 'Bellvis',
  '25996': 'Lleida', '43001': 'Tarragona', '28001': 'Madrid', '46001': 'Valencia', '50001': 'Zaragoza',
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
  const ops = []
  const pages = []
  let y = 780
  const pageW = 595
  const left = 54
  const right = 54
  const width = pageW - left - right
  const clean = (text) => String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/€/g, 'EUR').replace(/²/g, '2')
    .replace(/[•]/g, '-').replace(/[≤]/g, '<=').replace(/[≈]/g, '~')
    .replace(/[×]/g, 'x').replace(/[–—]/g, '-')
  const esc = (text) => clean(text).replace(/[\\()]/g, '\\$&')
  const add = (x, yy, size, text, font = 'F1') => ops.push(`BT /${font} ${size} Tf ${x} ${yy} Td (${esc(text)}) Tj ET`)
  const line = (x1, yy, x2) => ops.push(`0.84 0.84 0.80 RG ${x1} ${yy} ${x2 - x1} 0.6 re S`)
  const newPage = () => {
    add(left, 810, 8, 'EKOHUS HABITAT | Dossier Tecnico', 'F2')
    add(500, 810, 8, `${pages.length + 1}`)
    pages.push(ops.splice(0, ops.length).join('\n'))
    y = 780
  }
  const ensure = (h) => { if (y - h < 60) newPage() }
  const heading = (text) => { ensure(50); y -= 18; add(left, y, 18, text, 'F2'); y -= 24 }
  const subheading = (text) => { ensure(34); add(left, y, 13, text, 'F2'); y -= 18 }
  const para = (text, size = 10) => {
    const words = clean(text).split(/\s+/).filter(Boolean)
    let lineTxt = ''
    const max = size <= 9 ? 92 : 82
    for (const w of words) {
      if ((lineTxt + ' ' + w).trim().length > max) { ensure(16); add(left, y, size, lineTxt); y -= size + 5; lineTxt = w }
      else lineTxt = (lineTxt + ' ' + w).trim()
    }
    if (lineTxt) { ensure(16); add(left, y, size, lineTxt); y -= size + 5 }
    y -= 4
  }
  const bullet = (text) => para('- ' + text, 9)
  const table = (rows, cols = [260, 160, 70]) => {
    ensure(24 + rows.length * 20)
    let x = left
    ops.push(`0.89 0.91 0.86 rg ${left} ${y-8} ${width} 22 re f`)
    rows.forEach((r, idx) => {
      x = left + 8
      r.forEach((cell, i) => { add(x, y, idx === 0 ? 9 : 8.5, cell, idx === 0 ? 'F2' : 'F1'); x += cols[i] || 100 })
      line(left, y - 10, left + width)
      y -= 22
    })
    y -= 10
  }

  // Cover / resumen dinamico
  ops.push('0.23 0.31 0.24 rg 0 0 595 842 re f')
  add(160, 600, 28, 'EKOHUS HABITAT', 'F2')
  add(165, 565, 12, isCa ? 'CONSTRUIM CONFORT. CREEM FUTUR.' : 'CONSTRUIMOS CONFORT. CREAMOS FUTURO.')
  add(196, 505, 20, 'DOSSIER TECNICO', 'F2')
  add(210, 475, 14, `${isCa ? 'Habitatge' : 'Vivienda'} de ${result.surface} m2`)
  add(202, 445, 12, isCa ? 'Pressupost CLAU EN MA' : 'Presupuesto LLAVE EN MANO')
  add(205, 95, 10, 'www.ekohushabitat.com')
  pages.push(ops.splice(0, ops.length).join('\n')); y = 780

  heading('Resumen de Inversion')
  para(`A continuacion, presentamos el desglose detallado de la inversion necesaria para la construccion de su vivienda de ${result.surface} m2 en regimen de llave en mano.`)
  table([
    ['Concepto', 'Detalle', 'Precio (EUR)'],
    ['Construccion', `${result.surface} m2 x ${fmtM2(result.ref.price)}`, fmt(result.construction)],
    ['Cimentacion', '', fmt(result.foundation)],
    ['Acometidas (agua, luz y saneamiento hasta 10 m)', '', fmt(result.connections)],
    ['Direccion y final de obra', '', fmt(result.architect)],
    ['TOTAL LLAVE EN MANO', '', `${fmt(result.total)} + IVA`],
  ], [250, 150, 90])
  para(`Codigo postal: ${cp || '-'}${result.ref.place ? ' - ' + result.ref.place : ''}. El precio por metro cuadrado de construccion aplicado es de ${fmtM2(result.ref.price)}, un valor competitivo que incluye mano de obra, materiales de primera calidad y gestion integral del proyecto.`)

  const sections = [
    ['Por Que EkoHus', [
      'EkoHus es mucho mas que una casa. Es la libertad de disenar tu vida, la tranquilidad de construir sin sorpresas y la emocion de estrenar el hogar con el que siempre sonaste. Nuestro compromiso es ofrecerte una vivienda de alta calidad con tecnologia de vanguardia y un proceso constructivo transparente.',
      'Diseno exclusivo adaptado a tu estilo | Construccion rapida y precisa | Materiales de primera | Eficiencia energetica superior | La mejor calidad al mejor precio | Tranquilidad y confianza',
      'Nuestras viviendas mantienen un nivel de alta gama gracias a su proteccion termica superior, incluso por encima de las exigencias de una casa clase A o Passive House. Te acompanamos en cada paso, desde la idea inicial hasta el dia en que giras la llave.'
    ]],
    ['Sistema Constructivo Hormigon Celular AAC', [
      'Las viviendas EkoHus Habitat se ejecutan mediante el sistema de hormigon celular estructural AAC, un sistema mineral de altas prestaciones que integra en un solo elemento estructura, cerramiento y aislamiento termico, permitiendo construir muros de una sola hoja, sin camaras ni trasdosados.',
      'Este sistema constructivo proporciona una envolvente termica continua, homogenea y sin puentes termicos, garantizando un elevado confort interior, bajo consumo energetico y una durabilidad superior frente a los sistemas tradicionales.'
    ]],
    ['Estructura y Cerramiento Exterior', [
      'Bloque estructural HORMIGON CELULAR AAC de densidad 350 kg/m3. Espesor del muro exterior: 42 cm. Colocacion con junta fina de 2 mm. Enlucido interior de yeso. Acabado exterior con mortero monocapa hidrofugo.'
    ]],
    ['Prestaciones Termicas', ['Transmitancia termica U = 0,17 W/m2K. Desfase termico hasta 21 horas. Amortiguacion onda termica superior al 99%. Clasificacion al fuego Euroclase A1. Resistencia al fuego EI240 (4 horas).']],
    ['Cumplimiento Normativo y Comparativa Tecnica', [
      'La solucion de fachada utilizada por EkoHus Habitat con muro de hormigon celular de 42 cm esta disenada para cumplir y superar las exigencias del CTE en todas las zonas climaticas.',
      'Cumplimiento CTE: limite CTE U <= 0,29 W/m2K; muro AAC 42 cm U = 0,17 W/m2K. Aislamiento termico: AAC 42 cm 0,17 W/m2K frente a fachada tradicional ~0,22 W/m2K. Inercia termica: AAC 21,3 h frente a tradicional ~12,7 h. Seguridad contra incendios: AAC EI 240 (4h) frente a tradicional EI 120 (2h). Comportamiento frente al agua: menor absorcion implica menos patologias, menos humedades y mayor durabilidad. Simplicidad constructiva: una sola hoja, sin camaras, junta fina y material homogeneo.'
    ]],
    ['Descripcion de Estructura y Cerramientos', [
      'Tabiqueria exterior en bloque de hormigon celular. Bloque HORMIGON CELULAR AAC de 42,5 cm de espesor, densidad 350 kg/m3, junta fina de 2 mm, acabado exterior mortero monocapa hidrofugo y acabado interior enlucido de yeso.',
      'Tabiqueria interior: paredes estructurales interiores con bloques de 20 cm y paredes interiores no estructurales con bloques de 10 cm. Acabado en pintura plastica lisa blanca y pintura plastica antimoho en zonas humedas.',
      'Cubierta plana: pendiente 2-3%, grava 5-10 cm, geotextil Danofelt PY 150, aislamiento XPS/EPS 50 mm, impermeabilizacion bicapa LBM (SBS), mortero de pendientes, forjado placas AAC armado, aislamiento adicional bajo forjado, camara tecnica para instalaciones y acabado enlucido yeso / placa yeso laminado. Incluye remate perimetral de cubierta en acero galvanizado blanco o gris antracita.'
    ]],
    ['Acabados y Carpinterias', [
      'Carpinteria exterior: ventanas de PVC marca Strugal o equivalentes, hasta un 15% de la superficie de la vivienda, perfileria de PVC de alta calidad con camara de aire, doble vidrio bajo emisivo y cierre perimetral con doble junta de estanqueidad.',
      'Puerta de entrada blindada de alta seguridad con cerradura multipunto y bisagras reforzadas. Suelos ceramicos Navarti hasta 120x60 en acabado mate; otros modelos con extra de 30 EUR/m2. Puertas interiores lacadas en blanco, lisas o con 4 fresados horizontales. Pintura interior blanca con masilla y lijado previo.'
    ]],
    ['Instalaciones', [
      'Instalacion electrica estandar por estancias conforme a normativa y proyecto tecnico: dormitorios, banos, cocina y lavadero, salon-comedor, vestidor, sala de maquinas y porches. No incluidos portalámparas, focos ni luminarias decorativas.',
      'Telecomunicaciones y TV: punto de datos en salon, instalacion de antena de TV, toma de TV por dormitorio y toma de TV en salon-comedor-cocina. Mecanismos en color blanco marca SIMON 27 o equivalente. Cuadro con caja de proteccion y medida tipo CPM-1ME-UF, mano de obra y boletin electrico incluidos.',
      'Extras electricos orientativos: punto de luz adicional 35 EUR, enchufe adicional interior 35 EUR, enchufe exterior IP65 67 EUR, mecanismo adicional 37,50 EUR, conmutado 50 EUR, cruce 59 EUR, punto TV 72 EUR, punto red 72 EUR, circuito aerotermia 250 EUR. Instalaciones exteriores extra por metro: electricidad 25 EUR/ml, saneamiento 28 EUR/ml, agua 18 EUR/ml.'
    ]],
    ['Banos - Sanitarios', [
      'Las viviendas se entregan con los banos terminados. El cliente podra elegir diferentes gamas de sanitarios dentro del limite de 600 EUR + IVA por bano incluyendo griferias.',
      'Sanitarios instalados: WC Roca The Gap o equivalente, plato de ducha Duplach excepto 3D o equivalente, griferia Duplach o equivalente, mampara GME frontal fijo + corredera o equivalente, columna de ducha y muebles de bano melamina Duplach o equivalentes.',
      'Alicatado de banos y cocina: azulejos ceramicos estandar incluidos, material 10 EUR/m2 + IVA con mano de obra incluida, formato 60x30 cm, superficie maxima estimada 50 m2 y 10% de desperdicio. Otros formatos con suplemento de 25 EUR/m2 + IVA. No incluidos sanitarios suspendidos, griferias empotradas, platos de ducha de albanileria ni baneras.'
    ]],
    ['Cocina Eco Premium con Iluminacion LED Integrada', [
      'Cocinas Eco Premium disenadas para equilibrar estetica contemporanea, funcionalidad y eficiencia. Mobiliario moderno con acabados lacados, laminados de alta resistencia o efecto madera natural; cierres amortiguados, encimeras resistentes, almacenamiento con cajones y organizadores, iluminacion LED integrada y preparacion para electrodomesticos panelables.',
      'La vivienda contara con una Cocina Eco Premium equipada con mobiliario de diseno contemporaneo, sistemas de cierre amortiguado, encimera de altas prestaciones, iluminacion LED integrada y soluciones funcionales. Se incluye una cocina valorada en 2.500 EUR.'
    ]],
    ['No Incluido en Presupuesto Inicial', [
      'Excavacion, escaleras y barandilla, acondicionamiento exterior, cocina (muebles y electrodomesticos), piscina, armarios empotrados, puerta del portal y acceso peatonal, cierres de finca, bajantes y canalones de chapa, vigas vistas decorativas.'
    ]],
    ['Transporte y Mano de Obra', ['El presupuesto incluye el transporte de materiales en parcela y la ejecucion de la mano de obra necesaria para el montaje, construccion e instalacion de todos los kits y materiales incluidos.']],
    ['Condiciones Generales y Personalizacion', [
      'Todas las calidades pueden ser personalizadas. El cliente puede elegir materiales, modelos o marcas diferentes a las ofertadas de serie abonando unicamente la diferencia de precio respecto al valor incluido en el presupuesto inicial.',
      'Validez del presupuesto: 1 mes desde la fecha de emision. El precio no incluye IVA, licencia de obra ni tasas municipales, estudio geotecnico ni topografico. El precio puede variar segun ubicacion y accesibilidad. Se requiere firma de contrato y pago de entrada.'
    ]],
    ['Nivel de Proteccion Termica', ['Las casas EkoHus Habitat ofrecen un nivel de aislamiento muy cercano al estandar Passive House. Nuestros cierres en HORMIGON CELULAR AAC de 42 cm alcanzan una transmitancia de 0,17 W/m2K, con desfases termicos superiores a 21 horas y resistencia al fuego EI240.']],
  ]
  sections.forEach(([h, ps]) => { heading(h); ps.forEach(t => para(t)) })
  heading('Preparado para construir tu hogar?')
  para('A EkoHus Habitat te acompanamos en cada paso desde el diseno hasta la entrega final. EKOHUS HABITAT - www.ekohushabitat.com - 2026 EkoHus Habitat. Construimos confort. Creamos futuro.')
  newPage()

  const objects = ['<< /Type /Catalog /Pages 2 0 R >>']
  const kids = []
  pages.forEach((stream, i) => kids.push(`${3 + i * 2} 0 R`))
  objects.push(`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`)
  pages.forEach((stream, i) => {
    const contentId = 4 + i * 2
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R /F2 ${4 + pages.length * 2} 0 R >> >> /Contents ${contentId} 0 R >>`)
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  })
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((obj, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${obj}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach(o => { pdf += `${String(o).padStart(10, '0')} 00000 n \n` })
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

function findReference(cp) {
  if (CP_PRICES[cp]) return { cp, price: CP_PRICES[cp], exact: true, place: CP_PLACES[cp] || cp }
  const numeric = Number(cp)
  if (!Number.isFinite(numeric)) return { cp: 'referencia estatal', price: DEFAULT_PRICE, exact: false, place: 'Referencia estatal' }
  const nearest = Object.keys(CP_PRICES).reduce((best, key) => {
    const d = Math.abs(Number(key) - numeric)
    return d < best.d ? { key, d } : best
  }, { key: '25001', d: Infinity }).key
  return { cp: nearest, price: CP_PRICES[nearest], exact: false, place: CP_PLACES[nearest] || nearest }
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
                  ? <><strong className="text-sage-300">{isCa ? 'Codi postal localitzat.' : 'Código postal localizado.'}</strong> {result.ref.place}. {isCa ? 'Base de construcció aplicada:' : 'Base de construcción aplicada:'} {fmtM2(result.ref.price)}</>
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
