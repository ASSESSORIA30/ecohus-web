import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import WhatsAppButton from './components/WhatsAppButton'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import Preloader from './components/Preloader'

// Home sections
import Hero from './components/Hero'
import About from './components/About'
import AAC from './components/AAC'
import Projects from './components/Projects'
import Process from './components/Process'
import Sustainability from './components/Sustainability'
import Testimonials from './components/Testimonials'
import FinalCTA from './components/FinalCTA'
import Contact from './components/Contact'

// Legal page
import Legal from './pages/Legal'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <AAC />
      <Projects />
      <Process />
      <Sustainability />
      <Testimonials />
      <FinalCTA />
      <Contact />
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <Preloader
        onDone={() => {
          setLoaded(true)
          // Marca global per components que esperen el preloader (ex: Hero auto-build)
          window.__ekohusReady = true
          window.dispatchEvent(new Event('ekohus:ready'))
        }}
      />
      <SmoothScroll>
        <div data-loaded={loaded}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/legal/:section" element={<Legal />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
        </div>
      </SmoothScroll>
    </>
  )
}
