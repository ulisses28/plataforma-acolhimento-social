import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/*
  HAZARD SYSTEM 3D

  Este componente controla os efeitos de clima e perigo.

  Ele renderiza:
  - neve
  - chuva
  - luzes musicais/neon
  - fogo aumentando
  - água subindo em fase de enchente

  Observação:
  A lógica de perder a fase ficará no VilaBlocos3D.jsx.
  Este componente cuida principalmente do visual do perigo.
*/

function HazardSystem3D({
  fase,
  tempoRestante = null,
  tempoTotal = null
}) {
  const progressoPerigo = useMemo(() => {
    if (!tempoTotal || tempoRestante === null) return 0

    const usado = tempoTotal - tempoRestante
    return Math.max(0, Math.min(1, usado / tempoTotal))
  }, [tempoRestante, tempoTotal])

  return (
    <group>
      <ClimaVisual fase={fase} />

      {fase.perigo === 'fogo' && (
        <FogoAumentando progresso={progressoPerigo} />
      )}

      {fase.perigo === 'enchente' && (
        <AguaSubindo progresso={progressoPerigo} />
      )}
    </group>
  )
}

/* =========================================================
   CLIMAS VISUAIS
========================================================= */

function ClimaVisual({ fase }) {
  if (fase.clima === 'neve') {
    return <NeveVisual />
  }

  if (fase.clima === 'chuva' || fase.clima === 'enchente') {
    return <ChuvaVisual forte={fase.clima === 'enchente'} />
  }

  if (fase.clima === 'neon' || fase.clima === 'musica') {
    return <LuzesMusicais />
  }

  if (fase.clima === 'noite') {
    return <CeuNoturno />
  }

  if (fase.clima === 'frio') {
    return <FrioVisual />
  }

  if (fase.clima === 'fogo') {
    return <FumacaLeve />
  }

  return null
}

function NeveVisual() {
  return (
    <group>
      {Array.from({ length: 48 }).map((_, index) => (
        <FlocoNeve key={`floco-neve-${index}`} index={index} />
      ))}
    </group>
  )
}

function FlocoNeve({ index }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return

    const tempo = state.clock.elapsedTime
    const velocidade = 0.35 + (index % 5) * 0.04

    ref.current.position.y =
      3.2 + Math.sin(tempo * velocidade + index) * 0.8

    ref.current.position.x += Math.sin(tempo + index) * 0.0008
  })

  return (
    <mesh
      ref={ref}
      position={[
        (index % 8) * 1.55 - 5.4,
        3 + (index % 6) * 0.35,
        Math.floor(index / 8) * 1.45 - 4.6
      ]}
    >
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )
}

function ChuvaVisual({ forte = false }) {
  const quantidade = forte ? 64 : 42

  return (
    <group>
      {Array.from({ length: quantidade }).map((_, index) => (
        <GotaChuva key={`gota-chuva-${index}`} index={index} forte={forte} />
      ))}
    </group>
  )
}

function GotaChuva({ index, forte }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return

    const tempo = state.clock.elapsedTime
    const base = 3.5 - ((tempo * (forte ? 1.8 : 1.1) + index * 0.25) % 3.2)

    ref.current.position.y = base
  })

  return (
    <mesh
      ref={ref}
      position={[
        (index % 8) * 1.6 - 5.5,
        3.2,
        Math.floor(index / 8) * 1.35 - 4.8
      ]}
      rotation={[0.45, 0, 0.18]}
    >
      <boxGeometry args={[0.035, forte ? 0.6 : 0.42, 0.035]} />
      <meshStandardMaterial color="#93c5fd" transparent opacity={0.8} />
    </mesh>
  )
}

function LuzesMusicais() {
  const grupoRef = useRef()

  useFrame((state) => {
    if (!grupoRef.current) return

    const tempo = state.clock.elapsedTime
    grupoRef.current.rotation.y = Math.sin(tempo * 0.7) * 0.08
  })

  return (
    <group ref={grupoRef}>
      <pointLight position={[-4, 4, -3]} color="#22d3ee" intensity={1.1} distance={10} />
      <pointLight position={[4, 4, -3]} color="#ec4899" intensity={1.1} distance={10} />
      <pointLight position={[0, 4, 4]} color="#facc15" intensity={0.9} distance={9} />

      <LuzCubo position={[-4, 2.5, -4]} cor="#22d3ee" />
      <LuzCubo position={[4, 2.5, -4]} cor="#ec4899" />
      <LuzCubo position={[-4, 2.5, 4]} cor="#a78bfa" />
      <LuzCubo position={[4, 2.5, 4]} cor="#facc15" />
    </group>
  )
}

function LuzCubo({ position, cor }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return

    const tempo = state.clock.elapsedTime
    const escala = 1 + Math.sin(tempo * 3 + position[0]) * 0.12

    ref.current.scale.setScalar(escala)
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.55, 0.55, 0.55]} />
      <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.8} />
    </mesh>
  )
}

function CeuNoturno() {
  return (
    <group>
      {Array.from({ length: 20 }).map((_, index) => (
        <mesh
          key={`estrela-${index}`}
          position={[
            (index % 5) * 2.4 - 4.8,
            3.6 + (index % 4) * 0.25,
            Math.floor(index / 5) * 2 - 4
          ]}
        >
          <boxGeometry args={[0.09, 0.09, 0.09]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
        </mesh>
      ))}

      <pointLight position={[0, 5, 0]} color="#dbeafe" intensity={0.7} distance={13} />
    </group>
  )
}

function FrioVisual() {
  return (
    <group>
      <mesh position={[-4.2, 0.12, 4.2]} castShadow>
        <boxGeometry args={[1.1, 0.35, 1.1]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.84} />
      </mesh>

      <mesh position={[4.2, 0.12, -3.8]} castShadow>
        <boxGeometry args={[1, 0.32, 1]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.84} />
      </mesh>

      <mesh position={[0, 0.1, -4.5]} castShadow>
        <boxGeometry args={[1.2, 0.28, 1.2]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.72} />
      </mesh>
    </group>
  )
}

function FumacaLeve() {
  return (
    <group>
      {Array.from({ length: 12 }).map((_, index) => (
        <mesh
          key={`fumaca-${index}`}
          position={[
            (index % 4) * 2.2 - 3.3,
            2 + (index % 3) * 0.45,
            Math.floor(index / 4) * 2.2 - 3
          ]}
        >
          <sphereGeometry args={[0.22, 10, 10]} />
          <meshStandardMaterial color="#475569" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

/* =========================================================
   PERIGOS
========================================================= */

function FogoAumentando({ progresso }) {
  const quantidade = Math.round(6 + progresso * 26)

  return (
    <group>
      {Array.from({ length: quantidade }).map((_, index) => {
        const anel = Math.floor(index / 8)
        const angulo = (index % 8) * (Math.PI / 4)
        const raio = 5.5 - anel * 0.75

        return (
          <ChamaBloco
            key={`fogo-${index}`}
            position={[
              Math.cos(angulo) * raio,
              0.35,
              Math.sin(angulo) * raio
            ]}
            index={index}
          />
        )
      })}
    </group>
  )
}

function ChamaBloco({ position, index }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return

    const tempo = state.clock.elapsedTime
    const altura = 0.7 + Math.sin(tempo * 4 + index) * 0.12

    ref.current.scale.y = altura
  })

  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={[0.42, 0.72, 0.42]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.55} />
      </mesh>

      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.24, 0.5, 0.24]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
      </mesh>

      <pointLight position={[0, 0.8, 0]} color="#f97316" intensity={0.25} distance={2.5} />
    </group>
  )
}

function AguaSubindo({ progresso }) {
  const alturaAgua = 0.05 + progresso * 1.75

  return (
    <group>
      <mesh position={[0, alturaAgua / 2 - 0.08, 0]} receiveShadow>
        <boxGeometry args={[24, alturaAgua, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.42}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      <pointLight
        position={[0, 2.4, 0]}
        color="#38bdf8"
        intensity={0.45 + progresso * 0.6}
        distance={12}
      />
    </group>
  )
}

/*
  Helper usado na Parte 3 para calcular quando o perigo
  já está alto demais.
*/
export function calcularProgressoPerigo(tempoRestante, tempoTotal) {
  if (!tempoTotal || tempoRestante === null) return 0

  const usado = tempoTotal - tempoRestante
  return Math.max(0, Math.min(1, usado / tempoTotal))
}

export default HazardSystem3D