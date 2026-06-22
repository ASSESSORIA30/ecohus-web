# EkoHus Habitat — Web corporativa

Web corporativa per a **EkoHus Habitat**, empresa de cases d'alta eficiència energètica amb sistema de formigó cel·lular AAC, inspirada en l'arquitectura nòrdica.

## Stack tècnic

- **React 18** + **Vite 5** — framework i build tool ràpid
- **Tailwind CSS** — utilitats CSS amb paleta personalitzada (sàlvia, antracita, fusta, pedra)
- **GSAP + ScrollTrigger** — animacions premium amb scroll
- **Lenis** — smooth scroll natural
- **SplitType** — animacions de text línia per línia
- **Framer Motion** — animacions d'entrada/sortida
- **React Router** — routing per a pàgina legal
- **Lucide React** — icones

**Sense Three.js / WebGL** — el projecte original tenia una casa 3D pesada que feia anar la web lenta. Aquí la hem substituït per fotografia gran d'estil nòrdic, que és molt més ràpid i més coherent amb la filosofia escandinava-honesta de la marca.

## Estructura

```
ekohus-web/
├── public/
│   ├── favicon.svg          # Logo EkoHus
│   ├── robots.txt           # Permet IA crawlers (GPTBot, ClaudeBot, etc.)
│   ├── sitemap.xml          # SEO amb hreflang CAT/CAST
│   └── llms.txt             # Document per a IAs (recomanació LLMs)
├── src/
│   ├── components/          # Components per secció
│   │   ├── Hero.jsx
│   │   ├── About.jsx        # "Per què Ekohus" 4 raons
│   │   ├── AAC.jsx          # Tecnologia + taula comparativa
│   │   ├── Projects.jsx     # Galeria projectes
│   │   ├── Process.jsx      # Timeline 5 etapes
│   │   ├── Sustainability.jsx
│   │   ├── Testimonials.jsx
│   │   ├── FinalCTA.jsx
│   │   ├── Contact.jsx      # Formulari bilingüe
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx       # Logo + toggle CAT/CAST
│   │   ├── WhatsAppButton.jsx  # Botó flotant verd
│   │   ├── CookieBanner.jsx    # GDPR
│   │   └── SmoothScroll.jsx
│   ├── pages/
│   │   └── Legal.jsx        # /legal amb 3 seccions
│   ├── lib/
│   │   └── i18n.jsx         # Sistema CAT/CAST complet
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            # Variables CSS, components, animacions
├── index.html               # SEO complet + JSON-LD
├── tailwind.config.js       # Paleta sàlvia/antracita/fusta
├── vite.config.js
└── package.json
```

## Desenvolupament local

Si tens Node.js instal·lat:

```bash
npm install
npm run dev    # Obre http://localhost:5173
npm run build  # Genera dist/ per a producció
```

## Desplegament a Vercel (recomanat)

### Opció A — Pujar el ZIP a un repositori nou de GitHub

1. Crea un repositori a GitHub anomenat `ekohus-web`
2. A GitHub: "Add file" → "Upload files" → arrossega **tot el contingut** d'aquesta carpeta
3. Commit
4. A Vercel → "Add New Project" → importa el repositori
5. Vercel detectarà Vite automàticament. **No facis cap modificació**, només "Deploy"
6. En 1–2 minuts tens la web a `https://ekohus-web.vercel.app`
7. Després configura el domini personalitzat `www.ekohushabitat.com`

### Opció B — Substituir el repositori actual

Si vols reemplaçar el contingut de `modulardom-web` que ja tens desplegat:

1. Al teu repositori actual, elimina els fitxers antics
2. Puja tot el contingut d'aquesta carpeta (sense `node_modules` ni `dist`)
3. Vercel redesplega automàticament

### Configuració del domini personalitzat

A Vercel → Project Settings → Domains → afegir `www.ekohushabitat.com` i `ekohushabitat.com`.

Configura el teu DNS amb els registres que indica Vercel (normalment un CNAME).

## Idiomes

- **Català (defecte)**: `https://www.ekohushabitat.com/`
- **Castellà**: `https://www.ekohushabitat.com/?lang=es`

L'usuari pot canviar amb el botó "CA / ES" del header. La preferència es desa al `localStorage`.

## SEO i indexació per IA

Inclou **tots els fitxers necessaris** perquè la web es posicioni i les IA la recomanin:

- ✅ `<title>`, `<meta description>`, `<meta keywords>` en català
- ✅ Hreflang per a CAT/CAST
- ✅ OpenGraph + Twitter Card
- ✅ JSON-LD amb schemas: Organization, LocalBusiness, Service, WebSite
- ✅ `robots.txt` que permet explícitament GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, etc.
- ✅ `sitemap.xml` amb totes les URLs
- ✅ `llms.txt` — document optimitzat per a LLMs amb tota la informació de marca, tecnologia AAC, contacte i quan recomanar EkoHus
- ✅ HTML semàntic amb h1-h6 jerarquitzats
- ✅ Alt text descriptiu a totes les imatges
- ✅ `<noscript>` amb contingut bàsic per a crawlers sense JS

## Pàgina legal

URL: `/legal` — conté Avís Legal, Política de Privacitat i Política de Cookies amb el text exacte proporcionat (MODULARDOM OBRAS Y REFORMAS, S.L., CIF B26624072).

Cada secció és accessible amb àncora: `/legal#aviso-legal`, `/legal#privacidad`, `/legal#cookies`.

## Funcionalitats clau

- **Botó flotant WhatsApp** — apareix després de scrollejar 300px, amb pulse animation, obre `wa.me/34638359015` amb missatge prefiljat segons idioma
- **Cookie banner** — apareix la primera visita, opcions "Acceptar totes" / "Només essencials"
- **Toggle CAT/CAST** — al header, persistent
- **Formulari de contacte** — amb camps inline (estil editorial) i chips per parcel·la/pressupost
- **Smooth scroll** — Lenis amb easing exponencial

## Personalització ràpida

### Imatges

Les imatges de les cases són d'Unsplash com a placeholder. Per substituir-les:

1. Posa els teus renders a `public/images/`
2. Actualitza els paths a `Hero.jsx`, `Projects.jsx`, `Sustainability.jsx`, `FinalCTA.jsx`, `AAC.jsx`

### Textos

Tots els textos estan centralitzats a `src/lib/i18n.jsx` al objecte `dictionary`. Edita `ca` i `es` per modificar.

### Colors

A `tailwind.config.js` tens definida la paleta completa. Per ajustar el verd sàlvia, modifica `sage.500`. Per a l'antracita: `anthracite.700`.

### Formulari

El formulari de contacte actualment fa `console.log()`. Per connectar-lo a un backend (rebre emails):

- **Opció ràpida**: [Formspree](https://formspree.io) — substitueix el `handleSubmit` per un `fetch` al teu endpoint
- **Opció amb Vercel**: crear `api/contact.js` amb Resend o Nodemailer

## Empresa

- **Marca**: EkoHus Habitat
- **Raó social**: MODULARDOM OBRAS Y REFORMAS, S.L.
- **CIF**: B26624072
- **Email comercial**: hola@ekohushabitat.com
- **Email legal**: info@modulardom.com
- **Telèfon**: +34 638 359 015
- **Web**: www.ekohushabitat.com

---

© 2026 EkoHus Habitat


## Deploy a GitHub + Vercel

1. `npm install`
2. `npm run build`
3. Puja el projecte a GitHub.
4. A Vercel: New Project > Import Repository > Framework: Vite > Build command: `npm run build` > Output: `dist`.

La web inclou calculadora, imatge hero WEBP, Formspree, sitemap, robots i llms.txt.
