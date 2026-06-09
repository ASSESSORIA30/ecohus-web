import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Casa AAC procedural inspirada en el logotip d'EkoHus.
 *
 * Característiques:
 * - Construcció pis a pis seguint el scroll (progress 0..1):
 *     0.00–0.15: fonaments
 *     0.15–0.40: planta baixa (parets, porta, finestra gran)
 *     0.40–0.65: planta superior i mur lateral
 *     0.65–0.85: teulada inclinada (estil nòrdic)
 *     0.85–1.00: detalls (arbre, terra)
 * - Mouse parallax = càmera (no rotació del model).
 * - Materials: AAC blanc trencat, fusta càlida, vidre suau, antracita.
 */

// Material AAC (formigó cel·lular) — blanc trencat amb micro-rugositat
function useMaterials() {
  return useMemo(() => {
    const aac = new THREE.MeshStandardMaterial({
      color: '#F0EDE5',
      roughness: 0.92,
      metalness: 0.02,
    })
    const aacJoint = new THREE.MeshStandardMaterial({
      color: '#DDD7CB',
      roughness: 0.95,
      metalness: 0.0,
    })
    const wood = new THREE.MeshStandardMaterial({
      color: '#A98A5E',
      roughness: 0.55,
      metalness: 0.0,
    })
    const woodDark = new THREE.MeshStandardMaterial({
      color: '#7C6342',
      roughness: 0.6,
      metalness: 0.0,
    })
    const glass = new THREE.MeshStandardMaterial({
      color: '#3A4448',
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.78,
    })
    const anthracite = new THREE.MeshStandardMaterial({
      color: '#2C2E2D',
      roughness: 0.7,
      metalness: 0.15,
    })
    const sage = new THREE.MeshStandardMaterial({
      color: '#8FA68E',
      roughness: 0.85,
      metalness: 0.0,
    })
    const sageDark = new THREE.MeshStandardMaterial({
      color: '#5F7A5C',
      roughness: 0.9,
      metalness: 0.0,
    })
    const ground = new THREE.MeshStandardMaterial({
      color: '#E8E3D7',
      roughness: 1.0,
      metalness: 0.0,
    })
    return { aac, aacJoint, wood, woodDark, glass, anthracite, sage, sageDark, ground }
  }, [])
}

/**
 * Bloc AAC amb les juntes visibles (com el logo).
 * Es composa de diversos blocs lleugerament separats per crear el patró d'aparellament.
 */
function AACWall({ width, height, depth, position, material, jointMaterial, blockRows = 4, blockCols = 5 }) {
  const blocks = useMemo(() => {
    const arr = []
    const bw = width / blockCols
    const bh = height / blockRows
    const gap = 0.02
    for (let r = 0; r < blockRows; r++) {
      for (let c = 0; c < blockCols; c++) {
        // Offset alternat com en una paret de maons
        const offsetX = r % 2 === 0 ? 0 : bw / 2
        const x = -width / 2 + bw / 2 + c * bw + offsetX
        // Saltar el bloc parcial dels costats quan hi ha offset
        if (Math.abs(x) > width / 2) continue
        const y = -height / 2 + bh / 2 + r * bh
        arr.push({ x, y, w: bw - gap, h: bh - gap })
      }
    }
    return arr
  }, [width, height, blockRows, blockCols])

  return (
    <group position={position}>
      {/* Mur de fons (per cobrir gaps) */}
      <mesh material={jointMaterial}>
        <boxGeometry args={[width, height, depth * 0.9]} />
      </mesh>
      {/* Blocs visibles sobre el mur */}
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, depth / 2]} material={material}>
          <boxGeometry args={[b.w, b.h, depth * 0.15]} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Component animable: visible només quan el scroll progress supera un llindar.
 * Anima opacity + y position des de sota.
 */
function StageGroup({ from, to, children, scrollRef, offsetY = -0.4 }) {
  const groupRef = useRef()
  const targetState = useRef({ opacity: 0, y: offsetY })

  useFrame(() => {
    if (!groupRef.current) return
    const progress = scrollRef.current
    // Activar entre 'from' i 'to' del scroll
    const local = THREE.MathUtils.clamp((progress - from) / (to - from), 0, 1)
    // Easing exponencial out
    const eased = 1 - Math.pow(1 - local, 3)
    targetState.current.opacity = eased
    targetState.current.y = offsetY * (1 - eased)

    groupRef.current.position.y = targetState.current.y
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity
        }
        mat.transparent = true
        mat.opacity = mat.userData.baseOpacity * eased
        // També escala l'escala global
      }
    })
    groupRef.current.scale.setScalar(0.95 + 0.05 * eased)
    groupRef.current.visible = eased > 0.001
  })

  return <group ref={groupRef}>{children}</group>
}

function HouseScene({ scrollRef, mouseRef }) {
  const mats = useMaterials()
  const { camera } = useThree()

  // Mouse parallax: la càmera es desplaça subtilment, no la casa
  // A més: durant la construcció (scrollRef baixa) la càmera està més a prop
  //        (sensació d'estar mirant els fonaments). Quan la casa està feta,
  //        la càmera retrocedeix a la posició final.
  useFrame(() => {
    if (!mouseRef.current) return
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    // Progress combinat (0..1): 0 = casa invisible, 1 = casa al màxim
    const progress = scrollRef.current ?? 0

    // Posició base de càmera (quan progress = 1)
    const baseX = 4.5
    const baseY = 2.4
    const baseZ = 5.5

    // Offset durant la intro: càmera més baixa i a prop al començament
    const pullback = 1 - progress // 1 quan invisible, 0 quan al màxim
    const introX = baseX - pullback * 1.2
    const introY = baseY - pullback * 0.8
    const introZ = baseZ - pullback * 1.5

    // Mouse parallax (subtil, només camera shift)
    const targetX = introX + mx * 0.5
    const targetY = introY + my * 0.3
    const targetZ = introZ

    // Suau interpolació
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.lookAt(0, 0.9, 0)
  })

  return (
    <>
      {/* ESCENA: posicionada lleugerament a l'esquerra perquè la càmera vegi bé */}
      <group position={[0, -0.5, 0]}>
        {/* ETAPA 1: Fonaments (0-15%) */}
        <StageGroup from={0} to={0.15} scrollRef={scrollRef}>
          {/* Solera de formigó */}
          <mesh position={[0, -0.05, 0]} material={mats.anthracite}>
            <boxGeometry args={[4.4, 0.08, 3.0]} />
          </mesh>
          {/* Plinto fi */}
          <mesh position={[0, 0.02, 0]} material={mats.aacJoint}>
            <boxGeometry args={[4.2, 0.06, 2.8]} />
          </mesh>
        </StageGroup>

        {/* ETAPA 2: Planta baixa (15-45%) */}
        <StageGroup from={0.15} to={0.45} scrollRef={scrollRef}>
          {/* Mur posterior */}
          <AACWall
            width={4}
            height={1.5}
            depth={0.18}
            position={[0, 0.85, -1.3]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={3}
            blockCols={6}
          />
          {/* Mur lateral esquerre */}
          <AACWall
            width={2.6}
            height={1.5}
            depth={0.18}
            position={[-2.0, 0.85, 0]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={3}
            blockCols={4}
          />
          {/* Mur lateral dret amb panell de fusta */}
          <group position={[2.0, 0.85, 0]}>
            <mesh material={mats.aacJoint}>
              <boxGeometry args={[0.18, 1.5, 2.6]} />
            </mesh>
            <mesh position={[0.12, 0, 0]} material={mats.wood}>
              <boxGeometry args={[0.02, 1.4, 2.4]} />
            </mesh>
          </group>

          {/* Mur frontal — porció lateral (al costat de la finestra gran) */}
          <AACWall
            width={1.3}
            height={1.5}
            depth={0.18}
            position={[-1.35, 0.85, 1.3]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={3}
            blockCols={2}
          />
          {/* Porta de fusta */}
          <mesh position={[-1.95, 0.7, 1.4]} material={mats.woodDark}>
            <boxGeometry args={[0.5, 1.2, 0.04]} />
          </mesh>
          <mesh position={[-1.75, 0.7, 1.42]} material={mats.anthracite}>
            <boxGeometry args={[0.04, 0.1, 0.02]} />
          </mesh>

          {/* Finestra gran central */}
          <mesh position={[0.3, 0.85, 1.31]} material={mats.glass}>
            <boxGeometry args={[2.0, 1.2, 0.04]} />
          </mesh>
          {/* Marc de la finestra */}
          <mesh position={[0.3, 0.27, 1.32]} material={mats.anthracite}>
            <boxGeometry args={[2.05, 0.04, 0.02]} />
          </mesh>
          <mesh position={[0.3, 1.45, 1.32]} material={mats.anthracite}>
            <boxGeometry args={[2.05, 0.04, 0.02]} />
          </mesh>
          <mesh position={[-0.71, 0.85, 1.32]} material={mats.anthracite}>
            <boxGeometry args={[0.04, 1.2, 0.02]} />
          </mesh>
          <mesh position={[1.31, 0.85, 1.32]} material={mats.anthracite}>
            <boxGeometry args={[0.04, 1.2, 0.02]} />
          </mesh>
          {/* Divisor central de la finestra */}
          <mesh position={[0.3, 0.85, 1.33]} material={mats.anthracite}>
            <boxGeometry args={[0.03, 1.2, 0.02]} />
          </mesh>
        </StageGroup>

        {/* ETAPA 3: Planta superior (45-70%) */}
        <StageGroup from={0.45} to={0.70} scrollRef={scrollRef} offsetY={0.5}>
          {/* Forjat intermedi (línia) */}
          <mesh position={[0, 1.62, 0]} material={mats.anthracite}>
            <boxGeometry args={[4.05, 0.04, 2.85]} />
          </mesh>

          {/* Murs superiors — més compactes, forma asimètrica que segueix el sostre */}
          <AACWall
            width={4}
            height={1.0}
            depth={0.18}
            position={[0, 2.15, -1.3]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={2}
            blockCols={6}
          />
          {/* Mur lateral E (planta superior) */}
          <AACWall
            width={2.6}
            height={1.0}
            depth={0.18}
            position={[-2.0, 2.15, 0]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={2}
            blockCols={4}
          />
          {/* Mur lateral D (planta superior) */}
          <AACWall
            width={2.6}
            height={1.0}
            depth={0.18}
            position={[2.0, 2.15, 0]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={2}
            blockCols={4}
          />
          {/* Façana frontal superior: AAC + finestra horitzontal */}
          <AACWall
            width={4}
            height={1.0}
            depth={0.18}
            position={[0, 2.4, 1.3]}
            material={mats.aac}
            jointMaterial={mats.aacJoint}
            blockRows={1}
            blockCols={6}
          />
          {/* Finestra horitzontal superior */}
          <mesh position={[0, 1.95, 1.31]} material={mats.glass}>
            <boxGeometry args={[3.0, 0.45, 0.04]} />
          </mesh>
          <mesh position={[0, 1.71, 1.32]} material={mats.anthracite}>
            <boxGeometry args={[3.05, 0.03, 0.02]} />
          </mesh>
          <mesh position={[0, 2.19, 1.32]} material={mats.anthracite}>
            <boxGeometry args={[3.05, 0.03, 0.02]} />
          </mesh>
        </StageGroup>

        {/* ETAPA 4: Teulada inclinada (estil nòrdic, com el logo) (70-90%) */}
        <StageGroup from={0.70} to={0.90} scrollRef={scrollRef} offsetY={0.6}>
          {/* Aler horitzontal sota la teulada */}
          <mesh position={[0, 2.95, 0]} material={mats.anthracite}>
            <boxGeometry args={[4.3, 0.06, 3.1]} />
          </mesh>
          {/* Plans inclinats del sostre */}
          <mesh
            position={[0, 3.5, 0.85]}
            rotation={[-0.55, 0, 0]}
            material={mats.anthracite}
          >
            <boxGeometry args={[4.3, 0.08, 2.0]} />
          </mesh>
          <mesh
            position={[0, 3.5, -0.85]}
            rotation={[0.55, 0, 0]}
            material={mats.anthracite}
          >
            <boxGeometry args={[4.3, 0.08, 2.0]} />
          </mesh>
          {/* Carener (línia de cim del sostre) */}
          <mesh position={[0, 3.85, 0]} material={mats.anthracite}>
            <boxGeometry args={[4.32, 0.05, 0.05]} />
          </mesh>
          {/* Gable lateral esquerre (AAC triangular sota el sostre) */}
          <mesh position={[-2.13, 3.4, 0]} material={mats.aac} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.6, 0.5, 0.08]} />
          </mesh>
          {/* Gable lateral dret */}
          <mesh position={[2.13, 3.4, 0]} material={mats.aac} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.6, 0.5, 0.08]} />
          </mesh>
          {/* Línia sàlvia decorativa al sostre (signatura del logo) */}
          <mesh position={[2.17, 3.45, 0]} material={mats.sage}>
            <boxGeometry args={[0.04, 0.06, 2.6]} />
          </mesh>
        </StageGroup>

        {/* ETAPA 5: Detalls (arbre, terra) (85-100%) */}
        <StageGroup from={0.85} to={1.0} scrollRef={scrollRef} offsetY={0.3}>
          {/* Sòl extens */}
          <mesh position={[0, -0.12, 0.5]} material={mats.ground}>
            <boxGeometry args={[12, 0.04, 6]} />
          </mesh>
          {/* Arbre — tronc */}
          <group position={[-3.5, 0, 1.0]}>
            <mesh position={[0, 0.8, 0]} material={mats.woodDark}>
              <cylinderGeometry args={[0.05, 0.07, 1.6, 6]} />
            </mesh>
            {/* Fulla estilitzada del logo (ovoide allargat sàlvia) */}
            <mesh position={[0, 2.0, 0]} material={mats.sage}>
              <sphereGeometry args={[0.55, 8, 12]} />
            </mesh>
            <mesh
              position={[0, 1.95, 0]}
              material={mats.sageDark}
              scale={[1, 1.15, 0.4]}
            >
              <sphereGeometry args={[0.45, 8, 12]} />
            </mesh>
          </group>
          {/* Petita ombra/línia sota la casa */}
          <mesh position={[0, -0.1, 1.45]} material={mats.anthracite}>
            <boxGeometry args={[4.0, 0.01, 0.06]} />
          </mesh>
        </StageGroup>
      </group>
    </>
  )
}

// Detecció de mòbil / baixa potència
function useIsLowPower() {
  const [low, setLow] = useState(() => {
    if (typeof window === 'undefined') return false
    const coarse = window.matchMedia('(hover: none)').matches
    const small = window.innerWidth < 900
    return coarse || small
  })
  useEffect(() => {
    const onResize = () => {
      const coarse = window.matchMedia('(hover: none)').matches
      const small = window.innerWidth < 900
      setLow(coarse || small)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return low
}

function useInView(ref) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref])
  return inView
}

/**
 * Fallback SVG refinat per a mòbil / baixa potència.
 * Mantén l'esperit del 3D però sense cost de GPU.
 */
function StaticHouseFallback({ scrollProgress }) {
  // Calcula opacitats progressives basades en scroll
  const stages = [
    { from: 0.0, to: 0.15 },
    { from: 0.15, to: 0.45 },
    { from: 0.45, to: 0.70 },
    { from: 0.70, to: 0.90 },
    { from: 0.85, to: 1.0 },
  ]
  const opacities = stages.map(({ from, to }) => {
    const p = Math.max(0, Math.min(1, (scrollProgress - from) / (to - from)))
    return 1 - Math.pow(1 - p, 3)
  })

  return (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Etapa 5: terra */}
      <g opacity={opacities[4]}>
        <rect x="40" y="500" width="520" height="60" fill="#E8E3D7" />
        <line x1="40" y1="500" x2="560" y2="500" stroke="#2C2E2D" strokeWidth="0.5" />
      </g>

      {/* Etapa 1: fonaments */}
      <g opacity={opacities[0]}>
        <rect x="120" y="485" width="360" height="14" fill="#2C2E2D" />
        <rect x="115" y="478" width="370" height="6" fill="#DDD7CB" />
      </g>

      {/* Etapa 2: planta baixa */}
      <g opacity={opacities[1]}>
        <rect x="125" y="340" width="350" height="140" fill="#DDD7CB" />
        {/* Blocs AAC */}
        {[0, 1, 2, 3, 4, 5].map((c) =>
          [0, 1, 2].map((r) => (
            <rect
              key={`b1-${r}-${c}`}
              x={125 + c * 58 + (r % 2 ? 29 : 0)}
              y={340 + r * 47 + 2}
              width="55"
              height="43"
              fill="#F0EDE5"
              stroke="#DDD7CB"
              strokeWidth="0.5"
            />
          ))
        )}
        {/* Panell de fusta lateral */}
        <rect x="460" y="345" width="15" height="130" fill="#A98A5E" />
        {/* Finestra gran */}
        <rect x="200" y="365" width="200" height="100" fill="#3A4448" />
        <line x1="300" y1="365" x2="300" y2="465" stroke="#2C2E2D" strokeWidth="1" />
        <rect x="200" y="365" width="200" height="100" fill="none" stroke="#2C2E2D" strokeWidth="1.5" />
        {/* Porta */}
        <rect x="140" y="395" width="50" height="85" fill="#7C6342" />
        <circle cx="180" cy="438" r="1.5" fill="#2C2E2D" />
      </g>

      {/* Etapa 3: planta superior */}
      <g opacity={opacities[2]}>
        <line x1="120" y1="335" x2="480" y2="335" stroke="#2C2E2D" strokeWidth="2" />
        <rect x="125" y="260" width="350" height="75" fill="#DDD7CB" />
        {[0, 1, 2, 3, 4, 5].map((c) => (
          <rect
            key={`b2-${c}`}
            x={125 + c * 58 + 2}
            y={262}
            width="55"
            height="32"
            fill="#F0EDE5"
            stroke="#DDD7CB"
            strokeWidth="0.5"
          />
        ))}
        {/* Finestra horitzontal */}
        <rect x="155" y="295" width="290" height="38" fill="#3A4448" />
        <rect x="155" y="295" width="290" height="38" fill="none" stroke="#2C2E2D" strokeWidth="1" />
      </g>

      {/* Etapa 4: teulada inclinada nòrdica */}
      <g opacity={opacities[3]}>
        <polygon points="120,260 300,150 480,260" fill="#2C2E2D" />
        <polygon points="120,260 300,150 480,260" fill="none" stroke="#2C2E2D" strokeWidth="1" />
        {/* Línia sàlvia al sostre */}
        <line x1="300" y1="150" x2="480" y2="260" stroke="#8FA68E" strokeWidth="2" />
        {/* Gable */}
        <polygon points="120,260 300,150 300,260" fill="#F0EDE5" opacity="0.3" />
      </g>

      {/* Etapa 5: arbre */}
      <g opacity={opacities[4]}>
        <line x1="80" y1="500" x2="80" y2="430" stroke="#7C6342" strokeWidth="3" />
        <ellipse cx="80" cy="415" rx="22" ry="35" fill="#8FA68E" />
        <line x1="80" y1="430" x2="80" y2="395" stroke="#5F7A5C" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

export default function HouseModel3D({ scrollRef, className = '' }) {
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef)
  const isLowPower = useIsLowPower()
  const mouseRef = useRef({ x: 0, y: 0 })
  const [scrollDisplay, setScrollDisplay] = useState(0)

  // Mouse tracking
  useEffect(() => {
    if (isLowPower) return
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isLowPower])

  // Per al fallback estàtic: necessitem llegir el scroll progress per al fade-in
  useEffect(() => {
    if (!isLowPower) return
    let raf = 0
    const tick = () => {
      setScrollDisplay(scrollRef.current ?? 0)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isLowPower, scrollRef])

  if (isLowPower) {
    return (
      <div ref={wrapRef} className={className}>
        <StaticHouseFallback scrollProgress={scrollDisplay} />
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [4.5, 2.4, 5.5], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        shadows={false}
      >
        <Suspense fallback={null}>
          {/* Llum: principal càlida + rebot fred per profunditat escandinava */}
          <ambientLight intensity={0.55} />
          <directionalLight position={[6, 8, 4]} intensity={1.4} color="#FFF8EC" />
          <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#B8C7C8" />
          <pointLight position={[1, 2, 3]} intensity={0.25} color="#E8D5A8" />

          <HouseScene scrollRef={scrollRef} mouseRef={mouseRef} />

          {/* Ombra de contacte suau (no shadow map = barat) */}
          <ContactShadows
            position={[0, -0.62, 0]}
            opacity={0.32}
            scale={14}
            blur={2.4}
            far={4}
            resolution={256}
            color="#2C2E2D"
          />

          {/* HDRI environment subtil */}
          <Environment preset="apartment" resolution={64} />
        </Suspense>
      </Canvas>
    </div>
  )
}
