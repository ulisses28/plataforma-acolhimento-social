import React, { useMemo } from 'react'

/*
  MAP BUILDER 3D

  Este componente monta o cenário de cada fase.

  Ele recebe a fase atual e cria:
  - terreno em blocos
  - árvores
  - casas
  - prédios
  - montanhas
  - pedras
  - elementos de cidade, floresta, neve, deserto, ilha, neon e castelo

  Manutenção futura:
  Para criar um novo tipo de mapa, adicione um case dentro de DecoracoesPorTipoMapa.
*/

function MapBuilder3D({ fase }) {
  return (
    <group>
      <TerrenoOtimizado fase={fase} />
      <DecoracoesPorTipoMapa fase={fase} />
    </group>
  )
}
/*
  TERRENO OTIMIZADO

  Antes cada quadrado do chão era um cubo separado.
  Em mapas grandes isso pesa bastante no celular.

  Agora usamos:
  - uma base grande
  - linhas finas simulando blocos
  - uma camada lateral para manter o visual de bloco

  Resultado:
  visual parecido, mas com muito menos travamento.
*/
function TerrenoOtimizado({ fase }) {
  const tamanho = fase.tamanhoMapa || 17
  const linhas = criarLinhasTerreno(tamanho)

  return (
    <group>
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <boxGeometry args={[tamanho, 0.72, tamanho]} />
        <meshStandardMaterial
          color={fase.cores.chao}
          roughness={0.82}
        />
      </mesh>

      <mesh position={[0, -0.82, 0]} receiveShadow>
        <boxGeometry args={[tamanho, 0.18, tamanho]} />
        <meshStandardMaterial
          color={fase.cores.lateral}
          roughness={0.9}
        />
      </mesh>

      {linhas.map((linha) => (
        <mesh
          key={linha.id}
          position={linha.position}
          receiveShadow
        >
          <boxGeometry args={linha.args} />
          <meshStandardMaterial
            color={fase.cores.chaoAlternativo}
            transparent
            opacity={0.34}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}
/*
  Terreno principal em blocos.

  Cada bloco é um cubo baixo. Isso cria o visual de mundo voxel.
*/
function TerrenoEmBlocos({ fase, blocosTerreno }) {
  return (
    <group>
      {blocosTerreno.map(([x, z]) => {
        const alternado = (x + z) % 2 === 0
        const cor = alternado ? fase.cores.chao : fase.cores.chaoAlternativo

        return (
          <mesh
            key={`terreno-${fase.id}-${x}-${z}`}
            position={[x, -0.36, z]}
            receiveShadow
          >
            <boxGeometry args={[0.98, 0.72, 0.98]} />
            <meshStandardMaterial
              color={cor}
              roughness={0.78}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/*
  Escolhe as decorações conforme o tipo de mapa.
*/
function DecoracoesPorTipoMapa({ fase }) {
  switch (fase.tipoMapa) {
    case 'vila':
      return <MapaVila />

    case 'floresta':
      return <MapaFloresta />

    case 'cidade':
      return <MapaCidade clima={fase.clima} />

    case 'neve':
      return <MapaNeve />

    case 'jardim':
      return <MapaJardim />

    case 'noite':
      return <MapaNoite />

    case 'neon':
      return <MapaNeon />

    case 'floresta-fogo':
      return <MapaFlorestaFogo />

    case 'deserto':
      return <MapaDeserto />

    case 'ilha':
      return <MapaIlha />

    case 'festival':
      return <MapaFestival />

    case 'castelo':
      return <MapaCastelo />

    default:
      return <MapaVila />
  }
}

/* =========================================================
   MAPAS
========================================================= */

function MapaVila() {
  return (
    <group>
      <Casa position={[-5, 0, -4]} cor="#ef4444" />
      <Casa position={[5, 0, -4]} cor="#2563eb" />
      <Casa position={[-5, 0, 3]} cor="#f59e0b" />

      <Arvore position={[-6, 0, 5]} />
      <Arvore position={[6, 0, 4]} />
      <Arvore position={[0, 0, -6]} />

      <Cerca position={[0, 0, -5.8]} />
    </group>
  )
}

function MapaFloresta() {
  return (
    <group>
      <Arvore position={[-6, 0, -5]} grande />
      <Arvore position={[-4, 0, 4]} grande />
      <Arvore position={[5, 0, -4]} grande />
      <Arvore position={[6, 0, 5]} />
      <Arvore position={[-1, 0, -6]} />
      <Arvore position={[3, 0, 2]} />

      <Mato position={[-5, 0, 0]} />
      <Mato position={[4, 0, 1]} />
      <Mato position={[1, 0, -4]} />

      <Montanha position={[0, 0, -8]} />
    </group>
  )
}

function MapaCidade({ clima }) {
  return (
    <group>
      <Predio position={[-6, 0, -5]} altura={2.8} cor="#334155" />
      <Predio position={[-3.8, 0, -5.4]} altura={2.2} cor="#475569" />
      <Predio position={[5.8, 0, -5]} altura={3.2} cor="#1e293b" />
      <Predio position={[4, 0, 4.8]} altura={2.4} cor="#64748b" />

      <Rua position={[0, 0.02, 0]} />

      {clima === 'enchente' && (
        <group>
          <Barreira position={[-5, 0, 4.5]} />
          <Barreira position={[5, 0, 4.5]} />
        </group>
      )}
    </group>
  )
}

function MapaNeve() {
  return (
    <group>
      <ArvoreNeve position={[-6, 0, -5]} />
      <ArvoreNeve position={[6, 0, -4]} />
      <ArvoreNeve position={[-5, 0, 4]} />
      <ArvoreNeve position={[4, 0, 5]} />

      <MontanhaNeve position={[0, 0, -8]} />
      <Pedra position={[-2, 0, 3]} cor="#cbd5e1" />
      <Pedra position={[3, 0, -2]} cor="#bfdbfe" />
    </group>
  )
}

function MapaJardim() {
  return (
    <group>
      <Flor position={[-5, 0, -3]} cor="#facc15" />
      <Flor position={[-3, 0, 4]} cor="#ec4899" />
      <Flor position={[4, 0, -2]} cor="#a855f7" />
      <Flor position={[5, 0, 4]} cor="#f97316" />

      <Arvore position={[-6, 0, 5]} />
      <Arvore position={[6, 0, -5]} />

      <Fonte position={[0, 0, -4]} />
    </group>
  )
}

function MapaNoite() {
  return (
    <group>
      <PosteLuz position={[-5, 0, -4]} />
      <PosteLuz position={[5, 0, -4]} />
      <PosteLuz position={[-5, 0, 4]} />
      <PosteLuz position={[5, 0, 4]} />

      <Arvore position={[-6, 0, 0]} />
      <Arvore position={[6, 0, 1]} />

      <EstrelaDecorativa position={[0, 3.2, -5]} />
    </group>
  )
}

function MapaNeon() {
  return (
    <group>
      <TorreNeon position={[-6, 0, -5]} cor="#22d3ee" />
      <TorreNeon position={[6, 0, -5]} cor="#f0abfc" />
      <TorreNeon position={[-5, 0, 4]} cor="#a78bfa" />
      <TorreNeon position={[5, 0, 4]} cor="#facc15" />

      <PistaNeon position={[0, 0.04, 0]} />

      <pointLight position={[0, 4, 0]} color="#a78bfa" intensity={1.2} distance={12} />
    </group>
  )
}

function MapaFlorestaFogo() {
  return (
    <group>
      <ArvoreSeca position={[-6, 0, -5]} />
      <ArvoreSeca position={[6, 0, -4]} />
      <ArvoreSeca position={[-5, 0, 4]} />
      <Arvore position={[4, 0, 5]} />

      <MatoSeco position={[-3, 0, 0]} />
      <MatoSeco position={[3, 0, 1]} />

      <Montanha position={[0, 0, -8]} cor="#7c2d12" />
    </group>
  )
}

function MapaDeserto() {
  return (
    <group>
      <Cacto position={[-6, 0, -4]} />
      <Cacto position={[5, 0, -3]} />
      <Cacto position={[-4, 0, 5]} />

      <Pedra position={[3, 0, 4]} cor="#92400e" />
      <Pedra position={[-1, 0, -5]} cor="#78350f" />

      <Montanha position={[0, 0, -8]} cor="#92400e" />
    </group>
  )
}

function MapaIlha() {
  return (
    <group>
      <AguaAoRedor />
      <Coqueiro position={[-6, 0, -4]} />
      <Coqueiro position={[6, 0, -3]} />
      <Coqueiro position={[-5, 0, 4]} />

      <Pedra position={[4, 0, 4]} cor="#0e7490" />
    </group>
  )
}

function MapaFestival() {
  return (
    <group>
      <PistaNeon position={[0, 0.05, 0]} />

      <TorreNeon position={[-6, 0, -5]} cor="#facc15" />
      <TorreNeon position={[6, 0, -5]} cor="#ec4899" />
      <TorreNeon position={[-6, 0, 5]} cor="#22d3ee" />
      <TorreNeon position={[6, 0, 5]} cor="#a78bfa" />

      <Palco position={[0, 0, -6]} />

      <pointLight position={[-3, 4, 0]} color="#22d3ee" intensity={1.2} distance={12} />
      <pointLight position={[3, 4, 0]} color="#ec4899" intensity={1.2} distance={12} />
    </group>
  )
}

function MapaCastelo() {
  return (
    <group>
      <TorreCastelo position={[-6, 0, -5]} />
      <TorreCastelo position={[6, 0, -5]} />
      <TorreCastelo position={[-6, 0, 4]} />
      <TorreCastelo position={[6, 0, 4]} />

      <Muralha position={[0, 0, -5.8]} />
      <Muralha position={[0, 0, 4.8]} />

      <Bandeira position={[0, 2.4, -5.8]} />
    </group>
  )
}

/* =========================================================
   PEÇAS DO CENÁRIO
========================================================= */

function Casa({ position, cor = '#ef4444' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.1, 1.4]} />
        <meshStandardMaterial color={cor} roughness={0.72} />
      </mesh>

      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[1.15, 0.8, 4]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.75} />
      </mesh>
    </group>
  )
}

function Predio({ position, altura = 2.4, cor = '#475569' }) {
  return (
    <group position={position}>
      <mesh position={[0, altura / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, altura, 1.35]} />
        <meshStandardMaterial color={cor} roughness={0.72} />
      </mesh>

      {[0.45, 1.05, 1.65, 2.25].map((y, index) => (
        y < altura && (
          <mesh key={`janela-${index}`} position={[0, y, 0.69]}>
            <boxGeometry args={[0.24, 0.22, 0.04]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.2} />
          </mesh>
        )
      ))}
    </group>
  )
}

function Arvore({ position, grande = false }) {
  const escala = grande ? 1.25 : 1

  return (
    <group position={position} scale={[escala, escala, escala]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 1.1, 0.34]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.78} />
      </mesh>

      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
    </group>
  )
}

function ArvoreNeve({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 1.1, 0.34]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial color="#e0f2fe" />
      </mesh>
    </group>
  )
}

function ArvoreSeca({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 1.3, 0.34]} />
        <meshStandardMaterial color="#5b3418" />
      </mesh>

      <mesh position={[0, 1.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.5, 0.72]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  )
}

function Coqueiro({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.28, 1.55, 0.28]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[1.4, 0.22, 0.42]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.4, 0.22, 0.42]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </group>
  )
}

function Mato({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.75, 0.4, 0.75]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  )
}

function MatoSeco({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.75, 0.36, 0.75]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
    </group>
  )
}

function Flor({ position, cor }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.15, 0.36, 0.15]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.38]} />
        <meshStandardMaterial color={cor} />
      </mesh>
    </group>
  )
}

function Pedra({ position, cor = '#64748b' }) {
  return (
    <mesh position={[position[0], 0.25, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[0.95, 0.5, 0.95]} />
      <meshStandardMaterial color={cor} roughness={0.9} />
    </mesh>
  )
}

function Montanha({ position, cor = '#475569' }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.6, 2.2, 4]} />
        <meshStandardMaterial color={cor} roughness={0.8} />
      </mesh>
    </group>
  )
}

function MontanhaNeve({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.8, 2.4, 4]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      <mesh position={[0, 2.15, 0]} castShadow>
        <coneGeometry args={[1.15, 0.9, 4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Cacto({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.36, 1.5, 0.36]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      <mesh position={[-0.38, 0.95, 0]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      <mesh position={[0.38, 1.15, 0]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
    </group>
  )
}

function Rua({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 15]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.18, 0.04, 15]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  )
}

function Cerca({ position }) {
  return (
    <group position={position}>
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <mesh key={`cerca-${x}`} position={[x, 0.35, 0]} castShadow>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
      ))}

      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[6.5, 0.18, 0.18]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
    </group>
  )
}

function Barreira({ position }) {
  return (
    <mesh position={[position[0], 0.35, position[2]]} castShadow>
      <boxGeometry args={[1.5, 0.7, 0.38]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  )
}

function Fonte({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.36, 1.6]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.7, 0.35, 0.7]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.75} />
      </mesh>
    </group>
  )
}

function PosteLuz({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.18, 1.7, 0.18]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0, 1.78, 0]} castShadow>
        <boxGeometry args={[0.44, 0.32, 0.44]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.45} />
      </mesh>

      <pointLight position={[0, 1.8, 0]} color="#facc15" intensity={0.7} distance={4} />
    </group>
  )
}

function EstrelaDecorativa({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.5, 0.08]} />
      <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
    </mesh>
  )
}

function TorreNeon({ position, cor }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 2.6, 1.1]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>

      <mesh position={[0, 2.1, 0.58]}>
        <boxGeometry args={[0.72, 0.18, 0.04]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.7} />
      </mesh>

      <pointLight position={[0, 2.2, 0]} color={cor} intensity={0.8} distance={5} />
    </group>
  )
}

function PistaNeon({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[6, 0.08, 6]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.04, 0.12]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[0, 0.11, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.04, 0.12]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function Palco({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.6, 1.4]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[-1.4, 1.2, 0]} castShadow>
        <boxGeometry args={[0.3, 1.8, 0.3]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[1.4, 1.2, 0]} castShadow>
        <boxGeometry args={[0.3, 1.8, 0.3]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function AguaAoRedor() {
  return (
    <mesh position={[0, -0.08, 0]} receiveShadow>
      <boxGeometry args={[24, 0.12, 24]} />
      <meshStandardMaterial color="#0891b2" transparent opacity={0.42} />
    </mesh>
  )
}

function TorreCastelo({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 2.5, 1.25]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      <mesh position={[0, 2.75, 0]} castShadow>
        <coneGeometry args={[0.95, 0.8, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Muralha({ position }) {
  return (
    <mesh position={[position[0], 0.65, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[8, 1.3, 0.6]} />
      <meshStandardMaterial color="#64748b" roughness={0.82} />
    </mesh>
  )
}

function Bandeira({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.12, 1.4, 0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0.45, 1.08, 0]} castShadow>
        <boxGeometry args={[0.9, 0.48, 0.08]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  )
}

/* =========================================================
   HELPERS
========================================================= */

function criarBlocosTerreno(tamanhoMapa) {
  const limite = Math.floor(tamanhoMapa / 2)
  const blocos = []

  for (let x = -limite; x <= limite; x += 1) {
    for (let z = -limite; z <= limite; z += 1) {
      blocos.push([x, z])
    }
  }

  return blocos
}
function criarLinhasTerreno(tamanho) {
  const linhas = []
  const limite = Math.floor(tamanho / 2)

  for (let i = -limite; i <= limite; i += 1) {
    linhas.push({
      id: `linha-x-${i}`,
      position: [i, -0.02, 0],
      args: [0.035, 0.035, tamanho]
    })

    linhas.push({
      id: `linha-z-${i}`,
      position: [0, -0.015, i],
      args: [tamanho, 0.035, 0.035]
    })
  }

  return linhas
}
export default MapBuilder3D