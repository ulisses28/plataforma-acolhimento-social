import React from 'react'
import { Text } from '@react-three/drei'

/*
  WORD PLATFORM 3D

  Plataforma maior e mais visível.
  Agora ela funciona como área de entrega das letras.

  O jogador precisa chegar perto dela e apertar Espaço ou Soltar.
*/

function WordPlatform3D({
  fase,
  letrasColocadas = [],
  position = [0, 0.35, 6]
}) {
  const letras = fase.palavra.split('')
  const inicioX = -((letras.length - 1) * 0.82)

  return (
    <group position={position}>
      <BaseDaPlataforma quantidade={letras.length} />

      {letras.map((letra, index) => {
        const letraColocada = letrasColocadas[index]
        const preenchido = Boolean(letraColocada)

        return (
          <group
            key={`${fase.id}-slot-${index}`}
            position={[inicioX + index * 1.64, 0.42, 0]}
          >
            <mesh receiveShadow>
              <boxGeometry args={[1.35, 0.6, 1.35]} />

              <meshStandardMaterial
                color={preenchido ? '#22c55e' : '#8b5a2b'}
                roughness={0.65}
              />
            </mesh>

            <Text
              position={[0, 0.37, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.52}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {preenchido ? letraColocada : '?'}
            </Text>
          </group>
        )
      })}

      <Text
        position={[0, 1.55, -1.15]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Plataforma da palavra
      </Text>

      <Text
        position={[0, 1.05, -1.15]}
        fontSize={0.28}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
      >
        Solte aqui para formar: {fase.palavra}
      </Text>

      <pointLight
        position={[0, 2.2, 0]}
        color="#facc15"
        intensity={0.65}
        distance={5}
      />
    </group>
  )
}

function BaseDaPlataforma({ quantidade }) {
  const largura = Math.max(6.2, quantidade * 1.78)

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[largura, 0.42, 2.55]} />
        <meshStandardMaterial
          color="#3b220d"
          roughness={0.8}
        />
      </mesh>

      <mesh
        position={[0, 0.25, 1.38]}
        receiveShadow
      >
        <boxGeometry args={[largura, 0.22, 0.22]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>

      <mesh
        position={[0, 0.25, -1.38]}
        receiveShadow
      >
        <boxGeometry args={[largura, 0.22, 0.22]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  )
}

export function obterPosicaoEntregaDaPlataforma(position = [0, 0.35, 6]) {
  return [position[0], position[1], position[2]]
}

export default WordPlatform3D