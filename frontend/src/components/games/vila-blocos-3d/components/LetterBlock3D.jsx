import React, { useMemo, useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/*
  LETTER BLOCK 3D

  Este componente representa um bloco de letra dentro do mapa.

  Ele será usado para:
  - letras corretas
  - letras falsas
  - letras que confundem o jogador

  Props principais:
  - bloco: objeto vindo de criarBlocosDaFase()
  - ativo: destaca a próxima letra esperada
  - selecionado: indica que o jogador está perto
  - onPegar: função chamada quando o jogador pega o bloco
*/

function LetterBlock3D({ bloco, ativo = false, selecionado = false, onPegar }) {
  const grupoRef = useRef()

  /*
    Define a cor do bloco.
    Letras corretas têm uma base azul.
    A próxima letra esperada fica amarela.
    Letras falsas ficam roxas.
  */
  const corBloco = useMemo(() => {
    if (ativo) return '#ffc928'
    if (bloco.correta) return '#2563eb'
    return '#7c3aed'
  }, [ativo, bloco.correta])

  const corTexto = ativo ? '#3b220d' : '#ffffff'

  /*
    Animação leve de flutuação e rotação.
    Ajuda o jogador a perceber que o bloco é coletável.
  */
  useFrame((state) => {
    if (!grupoRef.current) return

    const tempo = state.clock.elapsedTime

    grupoRef.current.position.y =
      bloco.position[1] + Math.sin(tempo * 2 + bloco.position[0]) * 0.08

    grupoRef.current.rotation.y = tempo * 0.35
  })

  if (bloco.coletado || bloco.colocado) {
    return null
  }

  return (
    <group
      ref={grupoRef}
      position={bloco.position}
      onClick={onPegar}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={corBloco}
          emissive={selecionado || ativo ? corBloco : '#000000'}
          emissiveIntensity={selecionado || ativo ? 0.18 : 0}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      <Text
        position={[0, 0.03, 0.47]}
        fontSize={0.42}
        color={corTexto}
        anchorX="center"
        anchorY="middle"
      >
        {bloco.letra}
      </Text>

      <Text
        position={[0, 0.03, -0.47]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.42}
        color={corTexto}
        anchorX="center"
        anchorY="middle"
      >
        {bloco.letra}
      </Text>

      {selecionado && (
        <Text
          position={[0, 0.82, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          PEGAR
        </Text>
      )}
    </group>
  )
}

export default LetterBlock3D