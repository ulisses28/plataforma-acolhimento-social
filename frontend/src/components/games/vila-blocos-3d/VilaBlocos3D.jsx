import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './vilaBlocos3D.css'

import {
  criarBlocosDaFase,
  obterFasePorIndice
} from './fasesVilaBlocos3D'

import Player3D from './components/Player3D'
import LetterBlock3D from './components/LetterBlock3D'
import WordPlatform3D from './components/WordPlatform3D'
import MapBuilder3D from './components/MapBuilder3D'
import HazardSystem3D, {
  calcularProgressoPerigo
} from './components/HazardSystem3D'

/*
  VILA DOS BLOCOS 3D — MOTOR PRINCIPAL

  Esta versão controla:
  - movimento 360 graus com analógico;
  - duas bolinhas amarelas no mobile;
  - primeira bolinha: pegar ou soltar bloco;
  - segunda bolinha: pular;
  - painel de configuração no topo esquerdo;
  - reiniciar e sair dentro das configurações;
  - remoção dos botões antigos amontoados.
*/

const PASSO_TECLADO = 0.82
const VELOCIDADE_ANALOGICO = 0.22
const INTERVALO_MOVIMENTO = 35

function VilaBlocos3D({ personagemExterno, onVoltarMenu, onNivelChange }) {
  /*
    Personagem padrão caso o jogador entre direto na rota do jogo.
  */
  const personagem = personagemExterno || {
    nome: 'Explorador',
    roupa: 'azul',
    cabelo: 'castanho',
    olhos: 'castanho',
    sapato: 'preto',
    acessorio: 'nenhum'
  }

  /*
    Fase atual.
    O índice começa em 0, mas a fase possui número próprio.
  */
  const [faseIndex, setFaseIndex] = useState(0)

  /*
    Dados da fase atual vindos do arquivo de fases.
  */
  const fase = useMemo(() => obterFasePorIndice(faseIndex), [faseIndex])

  /*
    Posição inicial do jogador e posição da plataforma.
    Ambas variam conforme o tamanho do mapa.
  */
  const posicaoInicialFase = useMemo(() => {
    return obterPosicaoInicialDaFase(fase)
  }, [fase])

  const posicaoPlataformaFase = useMemo(() => {
    return obterPosicaoPlataformaDaFase(fase)
  }, [fase])

  /*
    Estados principais do jogo.
  */
  const [posicaoJogador, setPosicaoJogador] = useState(() =>
    obterPosicaoInicialDaFase(fase)
  )
  const [blocos, setBlocos] = useState(() => criarBlocosDaFase(fase))
  const [blocoNaMao, setBlocoNaMao] = useState(null)
  const [letrasColocadas, setLetrasColocadas] = useState([])
  const [pontos, setPontos] = useState(0)
  const [mensagem, setMensagem] = useState(
    'No computador use WASD ou setas. No celular use o analógico e as bolinhas amarelas.'
  )
  const [status, setStatus] = useState('jogando')
  const [tempoRestante, setTempoRestante] = useState(fase.tempoLimite)

  /*
    Configurações do jogador.
  */
  const [sensibilidade, setSensibilidade] = useState(1)
  const [direcaoJogador, setDirecaoJogador] = useState(0)
  const [pulando, setPulando] = useState(false)
  const [settingsAberto, setSettingsAberto] = useState(false)

  /*
    Controle do analógico.
  */
  const [joystickVisual, setJoystickVisual] = useState({ x: 0, y: 0 })

  const joystickAreaRef = useRef(null)
  const joystickAtivoRef = useRef(false)
  const joystickVectorRef = useRef({ x: 0, z: 0 })
  const movimentoTimerRef = useRef(null)
  const puloTimerRef = useRef(null)

  /*
    Dados calculados da fase.
  */
  const nivelAtual = fase.numero
  const palavraAtual = fase.palavra
  const proximaLetra = palavraAtual[letrasColocadas.length]
  const faseConcluida = letrasColocadas.join('') === palavraAtual
  const temTempo = Boolean(fase.tempoLimite)

  const progressoPerigo = calcularProgressoPerigo(
    tempoRestante,
    fase.tempoLimite
  )

  /*
    Posição visual do jogador.
    Quando pula, o personagem sobe um pouco no eixo Y.
  */
  const posicaoVisualJogador = useMemo(() => {
    return [posicaoJogador[0], pulando ? 0.65 : 0, posicaoJogador[2]]
  }, [posicaoJogador, pulando])

  /*
    Ao mudar de fase, recria tudo da fase atual.
  */
  useEffect(() => {
    setBlocos(criarBlocosDaFase(fase))
    setPosicaoJogador(posicaoInicialFase)
    setBlocoNaMao(null)
    setLetrasColocadas([])
    setStatus('jogando')
    setTempoRestante(fase.tempoLimite)
    setSettingsAberto(false)
    setMensagem(`Fase ${fase.numero}: ${fase.nome}. ${fase.objetivo}`)

    if (onNivelChange) {
      onNivelChange(fase.numero)
    }
  }, [fase, posicaoInicialFase, onNivelChange])

  /*
    Timer das fases com perigo.
  */
  useEffect(() => {
    if (!temTempo || status !== 'jogando') return

    const intervalo = setInterval(() => {
      setTempoRestante((valorAtual) => {
        if (valorAtual === null) return valorAtual

        if (valorAtual <= 1) {
          clearInterval(intervalo)
          setStatus('perdeu')
          setBlocoNaMao(null)
          pararMovimentoContinuo()
          setMensagem(
            'O tempo acabou! Reinicie a fase e tente montar a palavra mais rápido.'
          )

          return 0
        }

        return valorAtual - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [temTempo, status, faseIndex])

  /*
    Controles de teclado para computador.

    WASD ou setas: mover.
    E: pegar ou soltar.
    Espaço: pular.
    R: reiniciar fase.
  */
  useEffect(() => {
    function aoPressionarTecla(event) {
      const tecla = event.key.toLowerCase()

      if (tecla === ' ' || tecla === 'spacebar') {
        event.preventDefault()
      }

      if (status !== 'jogando') return

      const passo = PASSO_TECLADO * sensibilidade

      if (['arrowup', 'w'].includes(tecla)) moverJogador(0, -passo)
      if (['arrowdown', 's'].includes(tecla)) moverJogador(0, passo)
      if (['arrowleft', 'a'].includes(tecla)) moverJogador(-passo, 0)
      if (['arrowright', 'd'].includes(tecla)) moverJogador(passo, 0)

      if (tecla === 'e') {
        acaoPrincipal()
      }

      if (tecla === ' ' || tecla === 'spacebar') {
        pular()
      }

      if (tecla === 'r') {
        reiniciarFase()
      }
    }

    window.addEventListener('keydown', aoPressionarTecla)

    return () => {
      window.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [
    status,
    posicaoJogador,
    blocoNaMao,
    blocos,
    letrasColocadas,
    faseIndex,
    sensibilidade
  ])

  /*
    Limpeza ao sair da tela.
  */
  useEffect(() => {
    return () => {
      pararMovimentoContinuo()

      if (puloTimerRef.current) {
        clearTimeout(puloTimerRef.current)
      }
    }
  }, [])

  /*
    Para o movimento caso vença ou perca.
  */
  useEffect(() => {
    if (status !== 'jogando') {
      pararMovimentoContinuo()
    }
  }, [status])

  /*
    Encontra o bloco mais próximo do jogador.
  */
  const blocoProximo = useMemo(() => {
    if (blocoNaMao || status !== 'jogando') return null

    const disponiveis = blocos.filter(
      (bloco) => !bloco.coletado && !bloco.colocado
    )

    let maisProximo = null
    let menorDistancia = Infinity

    disponiveis.forEach((bloco) => {
      const distancia = calcularDistanciaXZ(posicaoJogador, bloco.position)

      if (distancia < menorDistancia) {
        menorDistancia = distancia
        maisProximo = bloco
      }
    })

    if (menorDistancia <= 1.35) {
      return maisProximo
    }

    return null
  }, [blocos, blocoNaMao, posicaoJogador, status])

  /*
    Verifica se o jogador está perto da plataforma.
  */
  const pertoDaPlataforma = useMemo(() => {
    return calcularDistanciaXZ(posicaoJogador, posicaoPlataformaFase) <= 2.65
  }, [posicaoJogador, posicaoPlataformaFase])

  /*
    Movimento base do jogador.
  */
  function moverJogador(deltaX, deltaZ) {
    if (status !== 'jogando') return

    const limite = obterLimiteMapa(fase)

    if (deltaX !== 0 || deltaZ !== 0) {
      setDirecaoJogador(Math.atan2(deltaX, deltaZ))
    }

    setPosicaoJogador(([x, y, z]) => {
      const novoX = limitar(x + deltaX, -limite, limite)
      const novoZ = limitar(z + deltaZ, -limite, limite)

      return [novoX, y, novoZ]
    })
  }

  /*
    Movimento 360 graus usando o vetor do analógico.
  */
  function moverJogadorPorVetor(vetorX, vetorZ) {
    if (status !== 'jogando') return

    const intensidade = Math.sqrt(vetorX * vetorX + vetorZ * vetorZ)

    if (intensidade < 0.08) return

    const normalizadoX = vetorX / intensidade
    const normalizadoZ = vetorZ / intensidade
    const velocidade =
      VELOCIDADE_ANALOGICO * sensibilidade * Math.min(1, intensidade)

    moverJogador(normalizadoX * velocidade, normalizadoZ * velocidade)
  }

  /*
    Inicia o analógico.
  */
  function iniciarJoystick(event) {
    if (status !== 'jogando') return

    joystickAtivoRef.current = true

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    atualizarJoystick(event)
    pararMovimentoContinuo()

    movimentoTimerRef.current = setInterval(() => {
      const vetor = joystickVectorRef.current
      moverJogadorPorVetor(vetor.x, vetor.z)
    }, INTERVALO_MOVIMENTO)
  }

  /*
    Atualiza a posição visual e o vetor real do analógico.
  */
  function atualizarJoystick(event) {
    if (!joystickAtivoRef.current || !joystickAreaRef.current) return

    event.preventDefault()

    const rect = joystickAreaRef.current.getBoundingClientRect()
    const centroX = rect.left + rect.width / 2
    const centroY = rect.top + rect.height / 2

    let x = (event.clientX - centroX) / (rect.width / 2)
    let y = (event.clientY - centroY) / (rect.height / 2)

    const distancia = Math.sqrt(x * x + y * y)

    if (distancia > 1) {
      x /= distancia
      y /= distancia
    }

    joystickVectorRef.current = {
      x,
      z: y
    }

    setJoystickVisual({ x, y })
  }

  /*
    Finaliza o analógico.
  */
  function finalizarJoystick() {
    joystickAtivoRef.current = false
    joystickVectorRef.current = { x: 0, z: 0 }
    setJoystickVisual({ x: 0, y: 0 })
    pararMovimentoContinuo()
  }

  function pararMovimentoContinuo() {
    if (movimentoTimerRef.current) {
      clearInterval(movimentoTimerRef.current)
      movimentoTimerRef.current = null
    }
  }

  /*
    Ação principal:
    - sem bloco na mão: pegar;
    - com bloco na mão: soltar.
  */
  function acaoPrincipal() {
    if (blocoNaMao) {
      soltarBloco()
      return
    }

    pegarBlocoProximo()
  }

  function pegarBlocoProximo() {
    if (blocoNaMao) {
      setMensagem(
        `Você já está carregando a letra ${blocoNaMao.letra}. Leve até a plataforma e toque na bolinha para soltar.`
      )
      return
    }

    if (!blocoProximo) {
      setMensagem('Chegue mais perto de um bloco de letra para pegar.')
      return
    }

    pegarBloco(blocoProximo)
  }

  function pegarBloco(bloco) {
    if (blocoNaMao || status !== 'jogando') return

    const distancia = calcularDistanciaXZ(posicaoJogador, bloco.position)

    if (distancia > 1.6) {
      setMensagem('Chegue mais perto desse bloco para pegar.')
      return
    }

    setBlocoNaMao(bloco)

    setBlocos((lista) =>
      lista.map((item) =>
        item.id === bloco.id ? { ...item, coletado: true } : item
      )
    )

    setMensagem(
      `Você pegou a letra ${bloco.letra}. Leve até a plataforma e toque na bolinha para soltar.`
    )
  }

  function soltarBloco() {
    if (!blocoNaMao) {
      setMensagem('Você precisa pegar um bloco antes de soltar.')
      return
    }

    if (!pertoDaPlataforma) {
      const letraSolta = blocoNaMao.letra

      devolverBlocoParaOCenario()

      setMensagem(
        `Você soltou a letra ${letraSolta} no cenário. Chegue perto da plataforma para encaixar.`
      )
      return
    }

    validarBlocoNaPlataforma()
  }

  function validarBlocoNaPlataforma() {
    if (!blocoNaMao) return

    const letraEsperada = palavraAtual[letrasColocadas.length]

    if (blocoNaMao.letra !== letraEsperada) {
      const letraErrada = blocoNaMao.letra

      devolverBlocoParaOCenario()

      setMensagem(
        `Essa letra não encaixa agora. Você trouxe ${letraErrada}, mas a próxima letra é ${letraEsperada}.`
      )
      return
    }

    const novasLetras = [...letrasColocadas, blocoNaMao.letra]
    const pontosGanhos = blocoNaMao.correta ? 15 : 8

    setLetrasColocadas(novasLetras)
    setPontos((valor) => valor + pontosGanhos)

    setBlocos((lista) =>
      lista.map((item) =>
        item.id === blocoNaMao.id
          ? { ...item, colocado: true, coletado: true }
          : item
      )
    )

    setBlocoNaMao(null)

    if (novasLetras.join('') === palavraAtual) {
      concluirFase()
      return
    }

    setMensagem(
      `Letra ${letraEsperada} encaixada! Agora procure a letra ${palavraAtual[novasLetras.length]}.`
    )
  }

  /*
    Devolve o bloco ao cenário quando ele é solto fora da plataforma
    ou quando a letra está errada.
  */
  function devolverBlocoParaOCenario() {
    if (!blocoNaMao) return

    const limite = obterLimiteMapa(fase)

    const novaPosicao = [
      limitar(posicaoJogador[0] + 1, -limite, limite),
      0.75,
      limitar(posicaoJogador[2] + 1, -limite, limite)
    ]

    setBlocos((lista) =>
      lista.map((item) =>
        item.id === blocoNaMao.id
          ? {
              ...item,
              coletado: false,
              colocado: false,
              position: novaPosicao
            }
          : item
      )
    )

    setBlocoNaMao(null)
  }

  /*
    Pulo visual simples.
  */
  function pular() {
    if (status !== 'jogando' || pulando) return

    setPulando(true)

    if (puloTimerRef.current) {
      clearTimeout(puloTimerRef.current)
    }

    puloTimerRef.current = setTimeout(() => {
      setPulando(false)
    }, 420)
  }

  function concluirFase() {
    setStatus('vitoria')
    setBlocoNaMao(null)
    pararMovimentoContinuo()

    const bonusTempo = tempoRestante ? Math.max(0, tempoRestante) : 0
    const bonusFase = fase.numero * 20

    setPontos((valor) => valor + bonusFase + bonusTempo)

    setMensagem(
      `Parabéns! Você completou ${fase.palavra}. ${fase.tema}: missão concluída!`
    )
  }

  function proximaFase() {
    setFaseIndex((indiceAtual) => indiceAtual + 1)
  }

  function reiniciarFase() {
    pararMovimentoContinuo()

    setBlocos(criarBlocosDaFase(fase))
    setPosicaoJogador(posicaoInicialFase)
    setBlocoNaMao(null)
    setLetrasColocadas([])
    setStatus('jogando')
    setTempoRestante(fase.tempoLimite)
    setMensagem(`Fase reiniciada. ${fase.objetivo}`)
    setSettingsAberto(false)
  }

  function voltarMenu() {
    pararMovimentoContinuo()

    if (onVoltarMenu) {
      onVoltarMenu()
    }
  }

  return (
    <main className={`vila-3d-page clima-${fase.clima}`}>
      <section className="vila-3d-hud">
        <button
          type="button"
          className="vila-3d-settings-main"
          onClick={() => setSettingsAberto((aberto) => !aberto)}
          aria-label="Abrir configurações"
        >
          ⚙
        </button>

        <div className="vila-3d-info">
          <span>
            {fase.icone} Fase {fase.numero}
          </span>
          <strong>{fase.nome}</strong>
          <small>{fase.tema}</small>
        </div>

        <div className="vila-3d-word">
          <span>Monte a palavra</span>

          <div>
            {palavraAtual.split('').map((letra, index) => (
              <strong
                key={`${fase.id}-hud-${letra}-${index}`}
                className={letrasColocadas[index] ? 'filled' : ''}
              >
                {letrasColocadas[index] || ''}
              </strong>
            ))}
          </div>
        </div>

        <div className="vila-3d-score">
          <span>Pontos</span>
          <strong>{pontos}</strong>
        </div>
      </section>

      {settingsAberto && (
        <section className="vila-3d-settings-panel">
          <strong>Configurações</strong>

          <label>
            Sensibilidade do jogador
            <input
              type="range"
              min="0.6"
              max="1.7"
              step="0.1"
              value={sensibilidade}
              onChange={(event) => setSensibilidade(Number(event.target.value))}
            />
            <span>{sensibilidade.toFixed(1)}x</span>
          </label>

          <div>
            <button type="button" onClick={reiniciarFase}>
              Reiniciar fase
            </button>

            <button type="button" onClick={voltarMenu}>
              Sair
            </button>
          </div>
        </section>
      )}

      <section className={`vila-3d-message ${status}`}>
        <strong>{fase.objetivo}</strong>

        <p>{mensagem}</p>

        <div className="vila-3d-mini-status">
          <span>
            Próxima letra: <b>{faseConcluida ? '✓' : proximaLetra}</b>
          </span>

          <span>
            Na mão: <b>{blocoNaMao ? blocoNaMao.letra : 'nenhum'}</b>
          </span>

          {temTempo && (
            <span>
              Tempo: <b>{formatarTempo(tempoRestante)}</b>
            </span>
          )}

          {fase.perigo && (
            <span>
              Perigo: <b>{Math.round(progressoPerigo * 100)}%</b>
            </span>
          )}
        </div>

        {status === 'vitoria' && (
          <button
            type="button"
            className="vila-3d-inline-action"
            onClick={proximaFase}
          >
            Próxima fase →
          </button>
        )}

        {status === 'perdeu' && (
          <button
            type="button"
            className="vila-3d-inline-action"
            onClick={reiniciarFase}
          >
            Tentar novamente
          </button>
        )}
      </section>

      <section className="vila-3d-canvas-wrap">
        <Canvas
          camera={{
            position: [8, 8, 10],
            fov: 46
          }}
          dpr={[1, 1.25]}
          shadows={false}
          gl={{
            antialias: false,
            powerPreference: 'high-performance'
          }}
        >
          <color attach="background" args={[fase.cores.ceu]} />

          <ambientLight intensity={fase.clima === 'noite' ? 0.42 : 0.72} />

          <directionalLight
            position={[6, 10, 6]}
            intensity={fase.clima === 'noite' ? 0.75 : 1.05}
          />

          <MapBuilder3D fase={fase} />

          <HazardSystem3D
            fase={fase}
            tempoRestante={tempoRestante}
            tempoTotal={fase.tempoLimite}
          />

          <WordPlatform3D
            fase={fase}
            letrasColocadas={letrasColocadas}
            position={posicaoPlataformaFase}
          />

          <group
            position={posicaoVisualJogador}
            rotation={[0, direcaoJogador, 0]}
          >
            <Player3D
              personagem={personagem}
              position={[0, 0, 0]}
              blocoNaMao={blocoNaMao}
              nivel={nivelAtual}
            />
          </group>

          {blocos.map((bloco) => (
            <LetterBlock3D
              key={bloco.id}
              bloco={bloco}
              ativo={bloco.letra === proximaLetra}
              selecionado={blocoProximo?.id === bloco.id}
              onPegar={() => pegarBloco(bloco)}
            />
          ))}

          <CameraFollow target={posicaoJogador} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate
            maxPolarAngle={Math.PI / 2.25}
            minPolarAngle={Math.PI / 4.2}
          />
        </Canvas>

        <div className="vila-3d-clean-controls">
          <div
            ref={joystickAreaRef}
            className="vila-3d-analog"
            onPointerDown={iniciarJoystick}
            onPointerMove={atualizarJoystick}
            onPointerUp={finalizarJoystick}
            onPointerCancel={finalizarJoystick}
            onPointerLeave={finalizarJoystick}
          >
            <div
              className="vila-3d-analog-stick"
              style={{
                transform: `translate(calc(-50% + ${
                  joystickVisual.x * 38
                }px), calc(-50% + ${joystickVisual.y * 38}px))`
              }}
            />
          </div>

          <div className="vila-3d-action-balls">
            <button
              type="button"
              className="vila-3d-ball action"
              onClick={acaoPrincipal}
              aria-label="Pegar ou soltar bloco"
              title="Pegar ou soltar"
            />

            <button
              type="button"
              className="vila-3d-ball jump"
              onClick={pular}
              aria-label="Pular"
              title="Pular"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

/*
  CÂMERA SEGUINDO O JOGADOR
*/
function CameraFollow({ target }) {
  const { camera } = useThree()

  useFrame(() => {
    const destinoX = target[0] + 7.5
    const destinoY = 8
    const destinoZ = target[2] + 9

    camera.position.x += (destinoX - camera.position.x) * 0.045
    camera.position.y += (destinoY - camera.position.y) * 0.045
    camera.position.z += (destinoZ - camera.position.z) * 0.045

    camera.lookAt(target[0], 0.8, target[2])
  })

  return null
}

/*
  HELPERS
*/

function calcularDistanciaXZ(posicaoA, posicaoB) {
  const dx = posicaoA[0] - posicaoB[0]
  const dz = posicaoA[2] - posicaoB[2]

  return Math.sqrt(dx * dx + dz * dz)
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor))
}

function formatarTempo(segundos) {
  if (segundos === null || segundos === undefined) return '--:--'

  const minutos = Math.floor(segundos / 60)
  const resto = segundos % 60

  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`
}

function obterLimiteMapa(fase) {
  return Math.floor((fase.tamanhoMapa || 17) / 2) - 1
}

function obterPosicaoInicialDaFase(fase) {
  const limite = obterLimiteMapa(fase)

  return [0, 0, limite - 1]
}

function obterPosicaoPlataformaDaFase(fase) {
  const limite = obterLimiteMapa(fase)

  return [0, 0.35, -limite + 1]
}

export default VilaBlocos3D