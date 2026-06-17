import React, { useMemo, useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/*
  PLAYER 3D

  Este componente desenha o personagem em formato de blocos.

  Funções principais:
  - Mostrar o personagem escolhido/criado no menu.
  - Respeitar cores de roupa, cabelo e sapato.
  - Mostrar evolução visual conforme o nível.
  - Mostrar o bloco de letra na mão quando o jogador pegar um bloco.

  Manutenção futura:
  Para adicionar novos acessórios, edite a função obterEvolucaoVisual().
*/

function Player3D({
  personagem = {},
  position = [0, 0, 0],
  blocoNaMao = null,
  nivel = 1
}) {
  const corpoRef = useRef()

  const visual = useMemo(() => {
    return {
      roupa: obterCorRoupa(personagem.roupa),
      cabelo: obterCorCabelo(personagem.cabelo),
      sapato: obterCorSapato(personagem.sapato),
      olhos: obterCorOlhos(personagem.olhos),
      evolucao: obterEvolucaoVisual(nivel)
    }
  }, [personagem, nivel])

  /*
    Animação simples para o personagem parecer vivo.
    Depois podemos trocar por animação de caminhada.
  */
  useFrame((state) => {
    if (!corpoRef.current) return

    const tempo = state.clock.elapsedTime
    corpoRef.current.position.y = Math.sin(tempo * 4) * 0.035
  })

  return (
    <group position={position}>
      <group ref={corpoRef}>
        {/* Nome do jogador acima da cabeça */}
        <Text
          position={[0, 2.65, 0]}
          fontSize={0.28}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {personagem.nome || 'Jogador'}
        </Text>

        {/* Cabeça */}
        <mesh position={[0, 1.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshStandardMaterial color="#f1b27a" roughness={0.6} />
        </mesh>

        {/* Cabelo */}
        <mesh position={[0, 2.02, -0.04]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.26, 0.82]} />
          <meshStandardMaterial color={visual.cabelo} roughness={0.75} />
        </mesh>

        {/* Franja lateral para alguns tipos de cabelo */}
        {['castanho-longo', 'castanho-roxo', 'cacheado'].includes(personagem.cabelo) && (
          <mesh position={[-0.38, 1.72, 0.02]} castShadow>
            <boxGeometry args={[0.22, 0.48, 0.72]} />
            <meshStandardMaterial color={visual.cabelo} roughness={0.75} />
          </mesh>
        )}

        {/* Olhos */}
        <mesh position={[-0.18, 1.65, 0.37]} castShadow>
          <boxGeometry args={[0.09, 0.09, 0.035]} />
          <meshStandardMaterial color={visual.olhos} />
        </mesh>

        <mesh position={[0.18, 1.65, 0.37]} castShadow>
          <boxGeometry args={[0.09, 0.09, 0.035]} />
          <meshStandardMaterial color={visual.olhos} />
        </mesh>

        {/* Corpo */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.95, 0.46]} />
          <meshStandardMaterial color={visual.roupa} roughness={0.58} />
        </mesh>

        {/* Faixa de evolução na roupa */}
        {visual.evolucao.faixa && (
          <mesh position={[0, 1.1, 0.25]} castShadow>
            <boxGeometry args={[0.86, 0.14, 0.06]} />
            <meshStandardMaterial color={visual.evolucao.corDestaque} />
          </mesh>
        )}

        {/* Braço esquerdo */}
        <mesh position={[-0.58, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.82, 0.28]} />
          <meshStandardMaterial color={visual.roupa} roughness={0.58} />
        </mesh>

        {/* Braço direito */}
        <mesh position={[0.58, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.82, 0.28]} />
          <meshStandardMaterial color={visual.roupa} roughness={0.58} />
        </mesh>

        {/* Mãos */}
        <mesh position={[-0.58, 0.42, 0]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.26]} />
          <meshStandardMaterial color="#f1b27a" />
        </mesh>

        <mesh position={[0.58, 0.42, 0]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.26]} />
          <meshStandardMaterial color="#f1b27a" />
        </mesh>

        {/* Pernas */}
        <mesh position={[-0.23, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.56, 0.32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        <mesh position={[0.23, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.56, 0.32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Sapatos */}
        <mesh position={[-0.23, -0.1, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.18, 0.42]} />
          <meshStandardMaterial color={visual.sapato} roughness={0.65} />
        </mesh>

        <mesh position={[0.23, -0.1, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.18, 0.42]} />
          <meshStandardMaterial color={visual.sapato} roughness={0.65} />
        </mesh>

        {/* Mochila desbloqueada a partir de níveis maiores */}
        {visual.evolucao.mochila && (
          <mesh position={[0, 0.9, -0.34]} castShadow receiveShadow>
            <boxGeometry args={[0.64, 0.72, 0.22]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.75} />
          </mesh>
        )}

        {/* Capacete desbloqueado em níveis avançados */}
        {visual.evolucao.capacete && (
          <mesh position={[0, 2.18, 0]} castShadow>
            <boxGeometry args={[0.88, 0.2, 0.88]} />
            <meshStandardMaterial color={visual.evolucao.corDestaque} />
          </mesh>
        )}

        {/* Lanterna desbloqueada em níveis avançados */}
        {visual.evolucao.lanterna && (
          <group position={[-0.8, 0.68, 0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.18, 0.36]} />
              <meshStandardMaterial color="#111827" />
            </mesh>

            <pointLight
              position={[0, 0, 0.35]}
              color="#fef3c7"
              intensity={0.6}
              distance={3}
            />
          </group>
        )}

        {/* Bloco carregado na mão direita */}
        {blocoNaMao && (
          <group position={[0.88, 0.78, 0.18]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.46, 0.46, 0.46]} />
              <meshStandardMaterial
                color={blocoNaMao.correta ? '#ffc928' : '#7c3aed'}
                roughness={0.5}
              />
            </mesh>

            <Text
              position={[0, 0, 0.24]}
              fontSize={0.22}
              color={blocoNaMao.correta ? '#3b220d' : '#ffffff'}
              anchorX="center"
              anchorY="middle"
            >
              {blocoNaMao.letra}
            </Text>
          </group>
        )}
      </group>
    </group>
  )
}

/*
  Evolução visual do personagem.

  A ideia é o personagem parecer mais equipado conforme avança.
*/
function obterEvolucaoVisual(nivel) {
  if (nivel >= 13) {
    return {
      faixa: true,
      mochila: true,
      capacete: true,
      lanterna: true,
      corDestaque: '#facc15'
    }
  }

  if (nivel >= 9) {
    return {
      faixa: true,
      mochila: true,
      capacete: true,
      lanterna: false,
      corDestaque: '#38bdf8'
    }
  }

  if (nivel >= 5) {
    return {
      faixa: true,
      mochila: true,
      capacete: false,
      lanterna: false,
      corDestaque: '#22c55e'
    }
  }

  return {
    faixa: false,
    mochila: false,
    capacete: false,
    lanterna: false,
    corDestaque: '#ffffff'
  }
}

function obterCorRoupa(roupa) {
  const cores = {
    azul: '#2563eb',
    verde: '#16a34a',
    vermelho: '#dc2626',
    rosa: '#ec4899',
    roxo: '#7c3aed',
    turquesa: '#0891b2',
    laranja: '#ea580c',
    preto: '#111827'
  }

  return cores[roupa] || '#2563eb'
}

function obterCorCabelo(cabelo) {
  const cores = {
    castanho: '#5b3418',
    preto: '#111827',
    loiro: '#d99a19',
    ruivo: '#c2410c',
    'castanho-longo': '#5b3418',
    'castanho-roxo': '#7c3aed',
    cacheado: '#3b2213',
    adulto: '#1f2937'
  }

  return cores[cabelo] || '#5b3418'
}

function obterCorSapato(sapato) {
  const cores = {
    preto: '#111827',
    azul: '#1d4ed8',
    vermelho: '#b91c1c',
    marrom: '#7c2d12',
    rosa: '#db2777',
    dourado: '#ca8a04'
  }

  return cores[sapato] || '#111827'
}

function obterCorOlhos(olhos) {
  const cores = {
    castanho: '#3b220d',
    azul: '#2563eb',
    verde: '#16a34a',
    preto: '#111827'
  }

  return cores[olhos] || '#3b220d'
}

export default Player3D