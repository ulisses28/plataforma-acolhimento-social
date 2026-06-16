import React, { useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import './vilaBlocos3D.css'

import { FASES_VILA_BLOCOS_3D } from './fasesVilaBlocos3D'

/*
  VILA DOS BLOCOS 3D

  Primeira versão 3D do jogo educativo:
  - Mundo de blocos em 3D.
  - Personagem simples em formato cúbico.
  - Letras espalhadas pelo cenário.
  - Coleta automática ao chegar perto da letra correta.
  - Plataforma para montar a palavra.
  - Fases com clima diferente.

  Integração:
  Este componente recebe as mesmas props usadas no jogo antigo:
  - personagemExterno
  - onVoltarMenu
  - onNivelChange

  Assim podemos trocar o jogo 2D pelo 3D sem quebrar o menu atual.
*/

const PASSO = 0.8

function VilaBlocos3D({ personagemExterno, onVoltarMenu, onNivelChange }) {
  const personagem = personagemExterno || {
    nome: 'Explorador',
    roupa: 'azul',
    cabelo: 'castanho',
    olhos: 'castanho',
    sapato: 'preto',
    acessorio: 'nenhum'
  }

  const [faseIndex, setFaseIndex] = useState(0)
  const [posicaoJogador, setPosicaoJogador] = useState([0, 0, 4])
  const [letrasColetadas, setLetrasColetadas] = useState([])
  const [pontos, setPontos] = useState(0)
  const [mensagem, setMensagem] = useState('Use as setas ou WASD para andar e coletar as letras na ordem certa.')

  const fase = FASES_VILA_BLOCOS_3D[faseIndex]
  const proximaLetra = fase.palavra[letrasColetadas.length]
  const faseConcluida = letrasColetadas.join('') === fase.palavra

  /*
    Mapa de letras já coletadas.

    Usamos o índice porque algumas palavras podem repetir letras.
    Exemplo: AJUDA tem duas letras A.
  */
  const indicesColetados = useMemo(() => {
    return letrasColetadas.map((_, index) => index)
  }, [letrasColetadas])

  /*
    Movimento pelo teclado.

    Setas e WASD alteram a posição do jogador no plano X/Z.
  */
  useEffect(() => {
    function aoPressionarTecla(event) {
      const tecla = event.key.toLowerCase()

      if (['arrowup', 'w'].includes(tecla)) moverJogador(0, -PASSO)
      if (['arrowdown', 's'].includes(tecla)) moverJogador(0, PASSO)
      if (['arrowleft', 'a'].includes(tecla)) moverJogador(-PASSO, 0)
      if (['arrowright', 'd'].includes(tecla)) moverJogador(PASSO, 0)
    }

    window.addEventListener('keydown', aoPressionarTecla)

    return () => {
      window.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [faseIndex, letrasColetadas])

  /*
    Verifica automaticamente se o jogador chegou perto da próxima letra.
  */
  useEffect(() => {
    if (faseConcluida) return

    const indiceProximaLetra = letrasColetadas.length
    const letraAlvo = fase.letras[indiceProximaLetra]

    if (!letraAlvo) return

    const distancia = calcularDistanciaXZ(posicaoJogador, letraAlvo.posicao)

    if (distancia <= 1.15) {
      coletarLetra(letraAlvo.letra)
    }
  }, [posicaoJogador, faseIndex, letrasColetadas, faseConcluida])

  function moverJogador(deltaX, deltaZ) {
    setPosicaoJogador(([x, y, z]) => {
      const novoX = limitar(x + deltaX, -6, 6)
      const novoZ = limitar(z + deltaZ, -5, 5)

      return [novoX, y, novoZ]
    })
  }

  function coletarLetra(letra) {
    if (letra !== proximaLetra) {
      setMensagem(`Procure primeiro a letra ${proximaLetra}.`)
      return
    }

    const novasLetras = [...letrasColetadas, letra]

    setLetrasColetadas(novasLetras)
    setPontos((valor) => valor + 10)

    if (novasLetras.join('') === fase.palavra) {
      setMensagem(`Parabéns! Você formou ${fase.palavra}. ${fase.mensagemFinal}`)

      if (onNivelChange) {
        onNivelChange(faseIndex + 2)
      }

      return
    }

    setMensagem(`Boa! Você coletou a letra ${letra}. Agora procure ${fase.palavra[novasLetras.length]}.`)
  }

  function proximaFase() {
    const novoIndex = faseIndex + 1 >= FASES_VILA_BLOCOS_3D.length ? 0 : faseIndex + 1

    setFaseIndex(novoIndex)
    setPosicaoJogador([0, 0, 4])
    setLetrasColetadas([])
    setMensagem('Nova fase! Colete as letras na ordem certa.')
  }

  function reiniciarFase() {
    setPosicaoJogador([0, 0, 4])
    setLetrasColetadas([])
    setMensagem('Fase reiniciada. Tente novamente!')
  }

  return (
    <main className={`vila-3d-page clima-${fase.clima}`}>
      <section className="vila-3d-hud">
        <button type="button" className="vila-3d-back" onClick={onVoltarMenu}>
          ←
        </button>

        <div className="vila-3d-info">
          <span>{fase.icone} {fase.nome}</span>
          <strong>{fase.tema}</strong>
          <small>{fase.ambiente}</small>
        </div>

        <div className="vila-3d-word">
          <span>Palavra</span>

          <div>
            {fase.palavra.split('').map((letra, index) => (
              <strong
                key={`${fase.id}-${letra}-${index}`}
                className={letrasColetadas[index] ? 'filled' : ''}
              >
                {letrasColetadas[index] || ''}
              </strong>
            ))}
          </div>
        </div>

        <div className="vila-3d-score">
          <span>Pontos</span>
          <strong>{pontos}</strong>
        </div>
      </section>

      <section className="vila-3d-message">
        <strong>{fase.missao}</strong>
        <p>{mensagem}</p>
      </section>

      <section className="vila-3d-canvas-wrap">
        <Canvas
          camera={{
            position: [8, 8, 10],
            fov: 45
          }}
          shadows
        >
          <color attach="background" args={[fase.ceu]} />

          <ambientLight intensity={0.7} />

          <directionalLight
            position={[6, 10, 6]}
            intensity={1.15}
            castShadow
          />

          <MundoBlocos
            fase={fase}
            personagem={personagem}
            posicaoJogador={posicaoJogador}
            indicesColetados={indicesColetados}
            coletarLetra={coletarLetra}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>

        <div className="vila-3d-mobile-controls">
          <button type="button" onClick={() => moverJogador(0, -PASSO)}>↑</button>

          <div>
            <button type="button" onClick={() => moverJogador(-PASSO, 0)}>←</button>
            <button type="button" onClick={() => moverJogador(PASSO, 0)}>→</button>
          </div>

          <button type="button" onClick={() => moverJogador(0, PASSO)}>↓</button>
        </div>
      </section>

      <section className="vila-3d-actions">
        <button type="button" onClick={reiniciarFase}>
          Reiniciar fase
        </button>

        <button
          type="button"
          className="yellow"
          onClick={proximaFase}
          disabled={!faseConcluida}
        >
          Próxima fase →
        </button>
      </section>
    </main>
  )
}

/*
  MUNDO 3D

  Agrupa:
  - terreno
  - personagem
  - letras
  - plataforma da palavra
  - elementos decorativos
  - clima visual
*/
function MundoBlocos({
  fase,
  personagem,
  posicaoJogador,
  indicesColetados,
  coletarLetra
}) {
  return (
    <group>
      <Terreno fase={fase} />

      <ElementosDecorativos fase={fase} />

      <EfeitoClima fase={fase} />

      <Personagem3D
        personagem={personagem}
        position={posicaoJogador}
      />

      {fase.letras.map((item, index) => {
        const coletada = indicesColetados.includes(index)

        if (coletada) return null

        return (
          <Letra3D
            key={`${fase.id}-${item.letra}-${index}`}
            letra={item.letra}
            position={item.posicao}
            ativa={fase.palavra[indicesColetados.length] === item.letra}
            onClick={() => coletarLetra(item.letra)}
          />
        )
      })}

      <PlataformaPalavra
        palavra={fase.palavra}
        letrasColetadas={indicesColetados.length}
      />
    </group>
  )
}

/*
  TERRENO EM BLOCOS

  Cria um chão quadriculado com blocos.
  O visual lembra mundo voxel/blocos sem usar assets externos.
*/
function Terreno({ fase }) {
  const blocos = []

  for (let x = -6; x <= 6; x += 1) {
    for (let z = -5; z <= 5; z += 1) {
      blocos.push([x, z])
    }
  }

  return (
    <group>
      {blocos.map(([x, z]) => (
        <mesh
          key={`bloco-${x}-${z}`}
          position={[x, -0.35, z]}
          receiveShadow
        >
          <boxGeometry args={[0.98, 0.65, 0.98]} />
          <meshStandardMaterial
            color={(x + z) % 2 === 0 ? fase.chao : escurecerCor(fase.chao)}
          />
        </mesh>
      ))}
    </group>
  )
}

/*
  PERSONAGEM 3D

  Boneco formado por cubos.
  As cores respeitam a roupa escolhida no menu de criação.
*/
function Personagem3D({ personagem, position }) {
  const roupa = obterCorRoupa(personagem.roupa)
  const cabelo = obterCorCabelo(personagem.cabelo)
  const sapato = obterCorSapato(personagem.sapato)

  return (
    <group position={position}>
      <group position={[0, 0.25, 0]}>
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshStandardMaterial color="#f1b27a" />
        </mesh>

        <mesh position={[0, 1.86, -0.04]} castShadow>
          <boxGeometry args={[0.82, 0.24, 0.82]} />
          <meshStandardMaterial color={cabelo} />
        </mesh>

        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.78, 0.95, 0.42]} />
          <meshStandardMaterial color={roupa} />
        </mesh>

        <mesh position={[-0.55, 0.82, 0]} castShadow>
          <boxGeometry args={[0.25, 0.82, 0.28]} />
          <meshStandardMaterial color={roupa} />
        </mesh>

        <mesh position={[0.55, 0.82, 0]} castShadow>
          <boxGeometry args={[0.25, 0.82, 0.28]} />
          <meshStandardMaterial color={roupa} />
        </mesh>

        <mesh position={[-0.22, 0.15, 0]} castShadow>
          <boxGeometry args={[0.28, 0.58, 0.30]} />
          <meshStandardMaterial color={sapato} />
        </mesh>

        <mesh position={[0.22, 0.15, 0]} castShadow>
          <boxGeometry args={[0.28, 0.58, 0.30]} />
          <meshStandardMaterial color={sapato} />
        </mesh>
      </group>
    </group>
  )
}

/*
  LETRA 3D COLETÁVEL

  Cada letra é um cubo com texto.
  A letra correta da sequência fica destacada com cor amarela.
*/
function Letra3D({ letra, position, ativa, onClick }) {
  const [flutuacao, setFlutuacao] = useState(0)

  useFrame((state) => {
    setFlutuacao(Math.sin(state.clock.elapsedTime * 2) * 0.12)
  })

  return (
    <group
      position={[position[0], position[1] + flutuacao, position[2]]}
      onClick={onClick}
    >
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color={ativa ? '#ffc928' : '#2563eb'} />
      </mesh>

      <Text
        position={[0, 0.02, 0.47]}
        fontSize={0.45}
        color={ativa ? '#3b220d' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {letra}
      </Text>
    </group>
  )
}

/*
  PLATAFORMA DA PALAVRA

  Mostra a palavra a ser montada em blocos fixos no cenário.
*/
function PlataformaPalavra({ palavra, letrasColetadas }) {
  const letras = palavra.split('')
  const inicio = -(letras.length - 1) * 0.55

  return (
    <group position={[0, 0.45, 5.3]}>
      {letras.map((letra, index) => {
        const preenchida = index < letrasColetadas

        return (
          <group
            key={`slot-3d-${letra}-${index}`}
            position={[inicio + index * 1.1, 0, 0]}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.45, 0.92]} />
              <meshStandardMaterial color={preenchida ? '#22c55e' : '#8b5a2b'} />
            </mesh>

            <Text
              position={[0, 0.27, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.38}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {preenchida ? letra : ''}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

/*
  ELEMENTOS DECORATIVOS

  Árvores, pedras e blocos extras para dar aparência de mundo.
*/
function ElementosDecorativos({ fase }) {
  return (
    <group>
      <Arvore position={[-5.5, 0.2, 4]} />
      <Arvore position={[5.5, 0.2, -4]} />
      <Arvore position={[-5.2, 0.2, -4.2]} />

      <mesh position={[5, 0.05, 4]} castShadow>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color={fase.lateralBloco} />
      </mesh>

      <mesh position={[-2, 0.08, -4.6]} castShadow>
        <boxGeometry args={[1.2, 0.55, 1.2]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  )
}

function Arvore({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.35, 1.1, 0.35]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
    </group>
  )
}

/*
  EFEITOS DE CLIMA

  Simples e leve para navegador:
  - neve: pontinhos brancos
  - chuva: linhas azuis
  - frio: cubos claros simulando gelo
*/
function EfeitoClima({ fase }) {
  if (fase.clima === 'neve') {
    return (
      <group>
        {Array.from({ length: 28 }).map((_, index) => (
          <mesh
            key={`neve-${index}`}
            position={[
              (index % 7) * 1.8 - 5.4,
              3 + (index % 4) * 0.5,
              Math.floor(index / 7) * 2 - 4
            ]}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    )
  }

  if (fase.clima === 'chuva') {
    return (
      <group>
        {Array.from({ length: 32 }).map((_, index) => (
          <mesh
            key={`chuva-${index}`}
            position={[
              (index % 8) * 1.5 - 5.2,
              3.2 + (index % 4) * 0.42,
              Math.floor(index / 8) * 2 - 4
            ]}
            rotation={[0.4, 0, 0.2]}
          >
            <boxGeometry args={[0.035, 0.45, 0.035]} />
            <meshStandardMaterial color="#93c5fd" />
          </mesh>
        ))}
      </group>
    )
  }

  if (fase.clima === 'frio') {
    return (
      <group>
        <mesh position={[-4, 0.12, 4.2]} castShadow>
          <boxGeometry args={[1.1, 0.35, 1.1]} />
          <meshStandardMaterial color="#dbeafe" />
        </mesh>

        <mesh position={[4.2, 0.12, -3.8]} castShadow>
          <boxGeometry args={[1, 0.32, 1]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
      </group>
    )
  }

  return null
}

/* Utilitários */

function calcularDistanciaXZ(posicaoA, posicaoB) {
  const dx = posicaoA[0] - posicaoB[0]
  const dz = posicaoA[2] - posicaoB[2]

  return Math.sqrt(dx * dx + dz * dz)
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor))
}

function escurecerCor(cor) {
  const mapa = {
    '#4ade80': '#22c55e',
    '#e0f2fe': '#bae6fd',
    '#166534': '#14532d',
    '#bae6fd': '#7dd3fc',
    '#65a30d': '#4d7c0f'
  }

  return mapa[cor] || cor
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

export default VilaBlocos3D