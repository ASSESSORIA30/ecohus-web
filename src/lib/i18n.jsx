import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const dictionary = {
  ca: {
    // Nav
    nav: {
      about: 'Per què Ekohus',
      aac: 'Formigó cel·lular',
      projects: 'Projectes',
      process: 'Procés',
      sustainability: 'Sostenibilitat',
      contact: 'Contacte',
      cta: 'Estudi gratuït',
    },
    // Hero
    hero: {
      tagline: 'CASES NÒRDIQUES · ALTA EFICIÈNCIA · CONSTRUCCIÓ AAC',
      title: 'Cases eficients',
      titleEm: 'per a tota la vida',
      subtitle: 'Construïm habitatges d\'alta eficiència energètica amb sistema de formigó cel·lular AAC inspirats en els estàndards nòrdics. Confort estable, factures mínimes, durabilitat de més d\'un segle.',
      cta1: 'Sol·licita estudi gratuït',
      cta2: 'Veure projectes',
      stat1: { label: 'Eficiència energètica', value: 'A+' },
      stat2: { label: 'Anys de durabilitat', value: '100+' },
      stat3: { label: 'Temps de construcció', value: '6–9 mesos' },
    },
    // About / Why Ekohus
    about: {
      label: '01 / 06 — PER QUÈ EKOHUS',
      title: 'Cases pensades per durar.',
      titleEm: 'Construïdes amb honestedat.',
      lead: 'No fem cases per impressionar. Fem cases per habitar-les durant generacions. Cada projecte segueix els principis de l\'arquitectura nòrdica: eficient, funcional, sostenible i atemporal.',
      reasons: [
        {
          title: 'Eficiència energètica',
          desc: 'Consum reduït durant tota la vida útil de la casa. Aïllament continu i ponts tèrmics minimitzats.',
          metric: 'Fins a 70% menys',
          metricLabel: 'consum vs. construcció convencional',
        },
        {
          title: 'Formigó cel·lular AAC',
          desc: 'Material amb cel·les d\'aire microscòpiques. Aïllament tèrmic, acústic, resistència al foc i a la humitat superiors.',
          metric: 'λ = 0,10 W/m·K',
          metricLabel: 'conductivitat tèrmica',
        },
        {
          title: 'Construcció sostenible',
          desc: 'Menys CO₂ embotellat, residus controlats i materials d\'origen mineral reciclables al 100%.',
          metric: '−40% CO₂',
          metricLabel: 'emissions vs. ceràmica tradicional',
        },
        {
          title: 'Confort total',
          desc: 'Temperatura estable tot l\'any sense oscil·lacions. Inèrcia tèrmica que regula la casa per si mateixa.',
          metric: '±1,5 °C',
          metricLabel: 'oscil·lació interior anual',
        },
      ],
    },
    // AAC explanation
    aac: {
      label: '02 / 06 — TECNOLOGIA AAC',
      title: 'Què és el formigó cel·lular',
      titleEm: 'i per què el triem',
      lead: 'L\'AAC (Autoclaved Aerated Concrete) és un material mineral fabricat amb sorra silícia, ciment, calç i un agent expansor. Curat en autoclau, conté milions de cel·les d\'aire microscòpiques que el converteixen en el material constructiu més equilibrat del mercat.',
      properties: [
        { title: 'Aïllament tèrmic', desc: 'Conductivitat λ entre 0,09 i 0,14 W/m·K. Sense necessitat d\'aïllaments afegits per arribar al CTE.' },
        { title: 'Resistència al foc', desc: 'EI 240 (4 hores). El millor comportament estructural davant del foc disponible al mercat.' },
        { title: 'Lleuger i resistent', desc: 'Densitat de 400-700 kg/m³ amb resistència a compressió fins a 7 N/mm².' },
        { title: 'Sostenible', desc: 'Producció amb baix consum energètic. Reciclable al 100%. Sense compostos orgànics volàtils.' },
      ],
      comparisonTitle: 'AAC vs. construcció tradicional',
      comparisonSubtitle: 'Dades reals comparatives, mateixa secció constructiva.',
      compare: {
        headers: ['Característica', 'Formigó cel·lular AAC', 'Maó ceràmic tradicional'],
        rows: [
          { feature: 'Conductivitat tèrmica (λ)', aac: '0,10 W/m·K', brick: '0,60 W/m·K' },
          { feature: 'Densitat', aac: '500 kg/m³', brick: '1.700 kg/m³' },
          { feature: 'Resistència al foc', aac: 'EI 240 (4 h)', brick: 'EI 120 (2 h)' },
          { feature: 'Aïllament acústic', aac: '45 dB amb 30 cm', brick: '38 dB amb 30 cm' },
          { feature: 'Velocitat de construcció', aac: '3× més ràpida', brick: 'Estàndard' },
          { feature: 'Petjada CO₂', aac: 'Baixa', brick: 'Alta' },
          { feature: 'Vida útil estimada', aac: '+ de 100 anys', brick: '50–80 anys' },
        ],
      },
    },
    // Projects
    projects: {
      label: '03 / 06 — PROJECTES',
      title: 'Cases que ja són',
      titleEm: 'llar',
      lead: 'Una selecció dels nostres projectes recents. Cada casa s\'adapta a la parcel·la, al programa familiar i a l\'orientació solar.',
      cards: [
        { code: 'EK—01', name: 'Vallès', size: '142 m²', location: 'Sant Cugat', description: 'Volum compacte de dues plantes amb façana ventilada en fusta i AAC vist en zones tècniques.' },
        { code: 'EK—02', name: 'Empordà', size: '186 m²', location: 'Pals', description: 'Casa-pati en una planta amb cobertes inclinades i porxos perimetrals orientats al sud.' },
        { code: 'EK—03', name: 'Maresme', size: '210 m²', location: 'Cabrils', description: 'Habitatge en pendent amb tres terrasses esglaonades. Vistes al mar des de totes les estances.' },
        { code: 'EK—04', name: 'Garrotxa', size: '165 m²', location: 'Olot', description: 'Casa de muntanya amb gran inèrcia tèrmica. Estufa de biomassa i recuperació de calor centralitzada.' },
      ],
      seeAll: 'Veure tots els projectes',
    },
    // Process
    process: {
      label: '04 / 06 — PROCÉS',
      title: 'De la primera trucada',
      titleEm: 'a les claus',
      lead: 'Un procés clar, un interlocutor únic, sense sorpreses. Aquest és el nostre compromís amb cada client.',
      steps: [
        { title: 'Estudi inicial', duration: '1 setmana', desc: 'Visitem la parcel·la, escoltem la teva visió i analitzem viabilitat tècnica, urbanística i pressupostària. Sense compromís.' },
        { title: 'Disseny', duration: '4–8 setmanes', desc: 'Avantprojecte, plànols definitius, memòria de qualitats i renderitzats realistes. Iterem fins que cada metre quadrat sigui teu.' },
        { title: 'Pressupost transparent', duration: '1 setmana', desc: 'Partida per partida, sense lletra petita. Preu tancat amb garantia de no desviació. Saps exactament què pagues i per què.' },
        { title: 'Construcció', duration: '5–7 mesos', desc: 'Obra ràpida amb sistema AAC. Control de qualitat diari. Accés a un portal online amb fotos i avenços setmanals.' },
        { title: 'Entrega clau en mà', duration: '2 setmanes', desc: 'Recepció amb checklist exhaustiu, certificacions, garanties i acompanyament durant el primer any d\'ús.' },
      ],
    },
    // Sustainability
    sustainability: {
      label: '05 / 06 — SOSTENIBILITAT',
      title: 'Cases preparades',
      titleEm: 'per al futur',
      lead: 'Construïm pensant en els pròxims 100 anys, no en els pròxims 10. Cada decisió de projecte respon a aquest principi.',
      points: [
        { title: 'Menys consum energètic', desc: 'Demanda inferior a 30 kWh/m²·any. Una casa que pràcticament no necessita energia per mantenir-se confortable.' },
        { title: 'Menys emissions', desc: 'Fins a un 40% menys de CO₂ embotellat en comparació amb maó ceràmic tradicional.' },
        { title: 'Materials saludables', desc: 'AAC mineral, sense COV, sense formaldehids. Una casa que respira i no et fa malbé la salut.' },
        { title: 'Preparades per a renovables', desc: 'Tots els projectes contemplen fotovoltaica, aerotèrmia i recuperació d\'aigua de pluja com a opcions estàndard.' },
      ],
    },
    // Testimonials
    testimonials: {
      label: 'TESTIMONIS',
      title: 'El que diuen',
      titleEm: 'els nostres clients',
      items: [
        { quote: 'Vam triar EkoHus perquè ens van demostrar tècnicament per què el seu sistema era el millor. Dos anys després, la factura de la calefacció ha baixat un 70%.', name: 'Marc i Anna', project: 'Casa Vallès, Sant Cugat' },
        { quote: 'Transparència total des del primer dia. Pressupost tancat, terminis respectats i una qualitat constructiva que es nota a cada detall.', name: 'Família Puig', project: 'Casa Empordà, Pals' },
        { quote: 'L\'equip d\'EkoHus entén el que vol una família del nord d\'Europa. La casa és confortable, eficient i bonica. Exactament el que buscàvem.', name: 'Lars & Maria', project: 'Casa Maresme, Cabrils' },
      ],
    },
    // Final CTA
    finalCta: {
      title: 'Preparat per construir',
      titleEm: 'la teva casa definitiva?',
      subtitle: 'Sol·licita un estudi gratuït sense compromís. T\'expliquem què podem fer a la teva parcel·la i en quins terminis i pressupost.',
      cta: 'Demana informació',
    },
    // Contact
    contact: {
      label: '06 / 06 — CONTACTA',
      title: 'Comencem amb',
      titleEm: 'una conversa',
      lead: 'Explica\'ns la teva idea, la parcel·la i els teus terminis. Et responem en menys de 24 hores feiners.',
      fields: {
        name: 'Nom complet',
        email: 'Correu electrònic',
        phone: 'Telèfon',
        location: 'Localitat de la parcel·la',
        message: 'Explica\'ns el teu projecte',
        plot: 'Tens parcel·la?',
        plotOptions: ['Sí, ja tinc parcel·la', 'En procés de compra', 'Encara no'],
        budget: 'Pressupost orientatiu',
        budgetOptions: ['< 200.000 €', '200k — 350k €', '350k — 500k €', '> 500.000 €'],
        send: 'Enviar sol·licitud',
        privacy: 'En enviar acceptes la nostra política de privacitat. Tractament confidencial.',
      },
      thanks: {
        title: 'Gràcies, parlarem aviat.',
        text: 'Hem rebut la teva sol·licitud. Et contactarem des de',
      },
      info: {
        address: 'Catalunya',
        emailLabel: 'EMAIL',
        phoneLabel: 'TELÈFON',
        hoursLabel: 'HORARI',
        hours: 'Dilluns a divendres · 9:00 — 19:00',
        visits: 'Visites amb cita prèvia.',
      },
    },
    // Footer
    footer: {
      tagline: 'Cases d\'alta eficiència energètica amb sistema de formigó cel·lular AAC. Inspirats en l\'arquitectura nòrdica.',
      navTitle: 'NAVEGACIÓ',
      contactTitle: 'CONTACTE',
      followTitle: 'SEGUEIX-NOS',
      legalTitle: 'LEGAL',
      legalLinks: {
        legal: 'Avís legal',
        privacy: 'Privacitat',
        cookies: 'Cookies',
      },
      copy: '© 2026 EKOHUS HABITAT · MODULARDOM OBRAS Y REFORMAS, S.L. · CIF B26624072',
    },
    // WhatsApp
    whatsapp: {
      message: 'Hola! M\'agradaria informació sobre les vostres cases.',
      ariaLabel: 'Contactar per WhatsApp',
    },
    // Cookies banner
    cookies: {
      title: 'Aquest lloc utilitza cookies',
      text: 'Utilitzem cookies tècniques necessàries i, amb el teu consentiment, analítiques i publicitàries per millorar la teva experiència.',
      accept: 'Acceptar totes',
      reject: 'Només essencials',
      configure: 'Configurar',
      moreInfo: 'Més informació',
    },
    // Legal page
    legal: {
      title: 'Informació legal',
      subtitle: 'Avís legal, política de privacitat i política de cookies',
      back: '← Tornar a inici',
    },
  },
  es: {
    nav: {
      about: 'Por qué Ekohus',
      aac: 'Hormigón celular',
      projects: 'Proyectos',
      process: 'Proceso',
      sustainability: 'Sostenibilidad',
      contact: 'Contacto',
      cta: 'Estudio gratuito',
    },
    hero: {
      tagline: 'CASAS NÓRDICAS · ALTA EFICIENCIA · CONSTRUCCIÓN AAC',
      title: 'Casas eficientes',
      titleEm: 'para toda la vida',
      subtitle: 'Construimos viviendas de alta eficiencia energética con sistema de hormigón celular AAC inspirados en los estándares nórdicos. Confort estable, facturas mínimas, durabilidad de más de un siglo.',
      cta1: 'Solicita estudio gratuito',
      cta2: 'Ver proyectos',
      stat1: { label: 'Eficiencia energética', value: 'A+' },
      stat2: { label: 'Años de durabilidad', value: '100+' },
      stat3: { label: 'Tiempo de construcción', value: '6–9 meses' },
    },
    about: {
      label: '01 / 06 — POR QUÉ EKOHUS',
      title: 'Casas pensadas para durar.',
      titleEm: 'Construidas con honestidad.',
      lead: 'No hacemos casas para impresionar. Hacemos casas para habitarlas durante generaciones. Cada proyecto sigue los principios de la arquitectura nórdica: eficiente, funcional, sostenible y atemporal.',
      reasons: [
        {
          title: 'Eficiencia energética',
          desc: 'Consumo reducido durante toda la vida útil de la casa. Aislamiento continuo y puentes térmicos minimizados.',
          metric: 'Hasta 70% menos',
          metricLabel: 'consumo vs. construcción convencional',
        },
        {
          title: 'Hormigón celular AAC',
          desc: 'Material con celdas de aire microscópicas. Aislamiento térmico, acústico, resistencia al fuego y a la humedad superiores.',
          metric: 'λ = 0,10 W/m·K',
          metricLabel: 'conductividad térmica',
        },
        {
          title: 'Construcción sostenible',
          desc: 'Menos CO₂ embebido, residuos controlados y materiales de origen mineral reciclables al 100%.',
          metric: '−40% CO₂',
          metricLabel: 'emisiones vs. cerámica tradicional',
        },
        {
          title: 'Confort total',
          desc: 'Temperatura estable todo el año sin oscilaciones. Inercia térmica que regula la casa por sí misma.',
          metric: '±1,5 °C',
          metricLabel: 'oscilación interior anual',
        },
      ],
    },
    aac: {
      label: '02 / 06 — TECNOLOGÍA AAC',
      title: 'Qué es el hormigón celular',
      titleEm: 'y por qué lo elegimos',
      lead: 'El AAC (Autoclaved Aerated Concrete) es un material mineral fabricado con arena silícea, cemento, cal y un agente expansor. Curado en autoclave, contiene millones de celdas de aire microscópicas que lo convierten en el material constructivo más equilibrado del mercado.',
      properties: [
        { title: 'Aislamiento térmico', desc: 'Conductividad λ entre 0,09 y 0,14 W/m·K. Sin necesidad de aislamientos añadidos para cumplir el CTE.' },
        { title: 'Resistencia al fuego', desc: 'EI 240 (4 horas). El mejor comportamiento estructural ante el fuego disponible en el mercado.' },
        { title: 'Ligero y resistente', desc: 'Densidad de 400-700 kg/m³ con resistencia a compresión hasta 7 N/mm².' },
        { title: 'Sostenible', desc: 'Producción con bajo consumo energético. Reciclable al 100%. Sin compuestos orgánicos volátiles.' },
      ],
      comparisonTitle: 'AAC vs. construcción tradicional',
      comparisonSubtitle: 'Datos reales comparativos, misma sección constructiva.',
      compare: {
        headers: ['Característica', 'Hormigón celular AAC', 'Ladrillo cerámico tradicional'],
        rows: [
          { feature: 'Conductividad térmica (λ)', aac: '0,10 W/m·K', brick: '0,60 W/m·K' },
          { feature: 'Densidad', aac: '500 kg/m³', brick: '1.700 kg/m³' },
          { feature: 'Resistencia al fuego', aac: 'EI 240 (4 h)', brick: 'EI 120 (2 h)' },
          { feature: 'Aislamiento acústico', aac: '45 dB con 30 cm', brick: '38 dB con 30 cm' },
          { feature: 'Velocidad de construcción', aac: '3× más rápida', brick: 'Estándar' },
          { feature: 'Huella CO₂', aac: 'Baja', brick: 'Alta' },
          { feature: 'Vida útil estimada', aac: '+ de 100 años', brick: '50–80 años' },
        ],
      },
    },
    projects: {
      label: '03 / 06 — PROYECTOS',
      title: 'Casas que ya son',
      titleEm: 'hogar',
      lead: 'Una selección de nuestros proyectos recientes. Cada casa se adapta a la parcela, al programa familiar y a la orientación solar.',
      cards: [
        { code: 'EK—01', name: 'Vallès', size: '142 m²', location: 'Sant Cugat', description: 'Volumen compacto de dos plantas con fachada ventilada en madera y AAC visto en zonas técnicas.' },
        { code: 'EK—02', name: 'Empordà', size: '186 m²', location: 'Pals', description: 'Casa-patio en una planta con cubiertas inclinadas y porches perimetrales orientados al sur.' },
        { code: 'EK—03', name: 'Maresme', size: '210 m²', location: 'Cabrils', description: 'Vivienda en pendiente con tres terrazas escalonadas. Vistas al mar desde todas las estancias.' },
        { code: 'EK—04', name: 'Garrotxa', size: '165 m²', location: 'Olot', description: 'Casa de montaña con gran inercia térmica. Estufa de biomasa y recuperación de calor centralizada.' },
      ],
      seeAll: 'Ver todos los proyectos',
    },
    process: {
      label: '04 / 06 — PROCESO',
      title: 'De la primera llamada',
      titleEm: 'a las llaves',
      lead: 'Un proceso claro, un interlocutor único, sin sorpresas. Este es nuestro compromiso con cada cliente.',
      steps: [
        { title: 'Estudio inicial', duration: '1 semana', desc: 'Visitamos la parcela, escuchamos tu visión y analizamos viabilidad técnica, urbanística y presupuestaria. Sin compromiso.' },
        { title: 'Diseño', duration: '4–8 semanas', desc: 'Anteproyecto, planos definitivos, memoria de calidades y renders realistas. Iteramos hasta que cada metro cuadrado sea tuyo.' },
        { title: 'Presupuesto transparente', duration: '1 semana', desc: 'Partida por partida, sin letra pequeña. Precio cerrado con garantía de no desviación. Sabes exactamente qué pagas y por qué.' },
        { title: 'Construcción', duration: '5–7 meses', desc: 'Obra rápida con sistema AAC. Control de calidad diario. Acceso a un portal online con fotos y avances semanales.' },
        { title: 'Entrega llave en mano', duration: '2 semanas', desc: 'Recepción con checklist exhaustivo, certificaciones, garantías y acompañamiento durante el primer año de uso.' },
      ],
    },
    sustainability: {
      label: '05 / 06 — SOSTENIBILIDAD',
      title: 'Casas preparadas',
      titleEm: 'para el futuro',
      lead: 'Construimos pensando en los próximos 100 años, no en los próximos 10. Cada decisión de proyecto responde a este principio.',
      points: [
        { title: 'Menos consumo energético', desc: 'Demanda inferior a 30 kWh/m²·año. Una casa que prácticamente no necesita energía para mantenerse confortable.' },
        { title: 'Menos emisiones', desc: 'Hasta un 40% menos de CO₂ embebido en comparación con ladrillo cerámico tradicional.' },
        { title: 'Materiales saludables', desc: 'AAC mineral, sin COV, sin formaldehídos. Una casa que respira y no perjudica tu salud.' },
        { title: 'Preparadas para renovables', desc: 'Todos los proyectos contemplan fotovoltaica, aerotermia y recuperación de agua de lluvia como opciones estándar.' },
      ],
    },
    testimonials: {
      label: 'TESTIMONIOS',
      title: 'Lo que dicen',
      titleEm: 'nuestros clientes',
      items: [
        { quote: 'Elegimos EkoHus porque nos demostraron técnicamente por qué su sistema era el mejor. Dos años después, la factura de calefacción ha bajado un 70%.', name: 'Marc y Anna', project: 'Casa Vallès, Sant Cugat' },
        { quote: 'Transparencia total desde el primer día. Presupuesto cerrado, plazos respetados y una calidad constructiva que se nota en cada detalle.', name: 'Familia Puig', project: 'Casa Empordà, Pals' },
        { quote: 'El equipo de EkoHus entiende lo que quiere una familia del norte de Europa. La casa es confortable, eficiente y bonita. Exactamente lo que buscábamos.', name: 'Lars & Maria', project: 'Casa Maresme, Cabrils' },
      ],
    },
    finalCta: {
      title: '¿Preparado para construir',
      titleEm: 'tu casa definitiva?',
      subtitle: 'Solicita un estudio gratuito sin compromiso. Te explicamos qué podemos hacer en tu parcela y en qué plazos y presupuesto.',
      cta: 'Pide información',
    },
    contact: {
      label: '06 / 06 — CONTACTA',
      title: 'Empezamos con',
      titleEm: 'una conversación',
      lead: 'Cuéntanos tu idea, la parcela y tus plazos. Te respondemos en menos de 24 horas laborables.',
      fields: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        location: 'Localidad de la parcela',
        message: 'Cuéntanos tu proyecto',
        plot: '¿Tienes parcela?',
        plotOptions: ['Sí, ya tengo parcela', 'En proceso de compra', 'Aún no'],
        budget: 'Presupuesto orientativo',
        budgetOptions: ['< 200.000 €', '200k — 350k €', '350k — 500k €', '> 500.000 €'],
        send: 'Enviar solicitud',
        privacy: 'Al enviar aceptas nuestra política de privacidad. Tratamiento confidencial.',
      },
      thanks: {
        title: 'Gracias, hablaremos pronto.',
        text: 'Hemos recibido tu solicitud. Te contactaremos desde',
      },
      info: {
        address: 'Catalunya',
        emailLabel: 'EMAIL',
        phoneLabel: 'TELÉFONO',
        hoursLabel: 'HORARIO',
        hours: 'Lunes a viernes · 9:00 — 19:00',
        visits: 'Visitas con cita previa.',
      },
    },
    footer: {
      tagline: 'Casas de alta eficiencia energética con sistema de hormigón celular AAC. Inspirados en la arquitectura nórdica.',
      navTitle: 'NAVEGACIÓN',
      contactTitle: 'CONTACTO',
      followTitle: 'SÍGUENOS',
      legalTitle: 'LEGAL',
      legalLinks: {
        legal: 'Aviso legal',
        privacy: 'Privacidad',
        cookies: 'Cookies',
      },
      copy: '© 2026 EKOHUS HABITAT · MODULARDOM OBRAS Y REFORMAS, S.L. · CIF B26624072',
    },
    whatsapp: {
      message: '¡Hola! Me gustaría información sobre vuestras casas.',
      ariaLabel: 'Contactar por WhatsApp',
    },
    cookies: {
      title: 'Este sitio utiliza cookies',
      text: 'Utilizamos cookies técnicas necesarias y, con tu consentimiento, analíticas y publicitarias para mejorar tu experiencia.',
      accept: 'Aceptar todas',
      reject: 'Solo esenciales',
      configure: 'Configurar',
      moreInfo: 'Más información',
    },
    legal: {
      title: 'Información legal',
      subtitle: 'Aviso legal, política de privacidad y política de cookies',
      back: '← Volver al inicio',
    },
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'ca'
    const stored = localStorage.getItem('ekohus-lang')
    if (stored && ['ca', 'es'].includes(stored)) return stored
    const url = new URL(window.location.href)
    const urlLang = url.searchParams.get('lang')
    if (urlLang && ['ca', 'es'].includes(urlLang)) return urlLang
    // Detect browser language
    const browserLang = navigator.language?.toLowerCase() || ''
    if (browserLang.startsWith('es')) return 'es'
    return 'ca'
  })

  useEffect(() => {
    localStorage.setItem('ekohus-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = dictionary[lang]

  const toggleLang = () => setLang(prev => (prev === 'ca' ? 'es' : 'ca'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useT() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useT must be used within LanguageProvider')
  return ctx
}
