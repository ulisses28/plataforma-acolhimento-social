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

  Este arquivo controla a lógica principal do jogo:
  - troca de fases;
  - movimento do jogador;
  - blocos de letras corretas e falsas;
  - pegar bloco na mão;
  - levar o bloco até a plataforma;
  - soltar e validar a palavra;
  - tempo das fases especiais;
  - perigos como fogo e enchente;
  - controle mobile estilo jogo.
*/

const PASSO = 0.82
const INTERVALO_MOVIMENTO = 85

function VilaBlocos3D({ personagemExterno, onVoltarMenu, onNivelChange }) {
  /*
    Personagem padrão caso o jogador entre direto no jogo
    sem escolher/criar um personagem antes.
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
    Controle da fase atual.
    O índice começa em 0, mas a fase tem número próprio: 1, 2, 3...
  */
  const [faseIndex, setFaseIndex] = useState(0)

  /*
    Busca a fase atual no arquivo fasesVilaBlocos3D.js.
  */
  const fase = useMemo(() => obterFasePorIndice(faseIndex), [faseIndex])

  /*
    Calcula onde o jogador começa e onde a plataforma fica.
    Isso varia conforme o tamanho do mapa de cada fase.
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
    'No computador use WASD ou setas. No celular use o controle e toque na bolinha para pegar.'
  )
  const [status, setStatus] = useState('jogando')
  const [tempoRestante, setTempoRestante] = useState(fase.tempoLimite)

  /*
    Referência usada para o movimento contínuo no mobile.
    Quando o jogador segura uma direção, o personagem continua andando.
  */
  const movimentoTimerRef = useRef(null)

  /*
    Informações calculadas da fase.
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
    Sempre que a fase muda, reiniciamos o estado da fase:
    - blocos voltam ao mapa;
    - jogador volta para o início;
    - palavra fica vazia;
    - timer volta ao início.
  */
  useEffect(() => {
    setBlocos(criarBlocosDaFase(fase))
    setPosicaoJogador(posicaoInicialFase)
    setBlocoNaMao(null)
    setLetrasColocadas([])
    setStatus('jogando')
    setTempoRestante(fase.tempoLimite)
    setMensagem(`Fase ${fase.numero}: ${fase.nome}. ${fase.objetivo}`)

    if (onNivelChange) {
      onNivelChange(fase.numero)
    }
  }, [fase, posicaoInicialFase, onNivelChange])

  /*
    Timer das fases especiais.

    Exemplo:
    - floresta com fogo;
    - cidade com enchente.
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
    Teclado para computador.

    WASD ou setas: andar.
    E: pegar bloco.
    Espaço: soltar bloco.
    R: reiniciar fase.
  */
  useEffect(() => {
    function aoPressionarTecla(event) {
      const tecla = event.key.toLowerCase()

      if (tecla === ' ' || tecla === 'spacebar') {
        event.preventDefault()
      }

      if (status !== 'jogando') return

      if (['arrowup', 'w'].includes(tecla)) moverJogador(0, -PASSO)
      if (['arrowdown', 's'].includes(tecla)) moverJogador(0, PASSO)
      if (['arrowleft', 'a'].includes(tecla)) moverJogador(-PASSO, 0)
      if (['arrowright', 'd'].includes(tecla)) moverJogador(PASSO, 0)

      if (tecla === 'e') {
        pegarBlocoProximo()
      }

      if (tecla === ' ' || tecla === 'spacebar') {
        soltarBloco()
      }

      if (tecla === 'r') {
        reiniciarFase()
      }
    }

    window.addEventListener('keydown', aoPressionarTecla)

    return () => {
      window.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [status, posicaoJogador, blocoNaMao, blocos, letrasColocadas, faseIndex])

  /*
    Segurança:
    quando sair da tela, parar qualquer movimento contínuo do mobile.
  */
  useEffect(() => {
    return () => {
      pararMovimentoContinuo()
    }
  }, [])

  /*
    Se o jogador venceu ou perdeu, interrompe movimento contínuo.
  */
  useEffect(() => {
    if (status !== 'jogando') {
      pararMovimentoContinuo()
    }
  }, [status])

  /*
    Descobre qual bloco está mais próximo do jogador.
    Isso permite pegar a letra com botão/tecla sem precisar clicar no bloco.
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
    Só perto da plataforma ele consegue encaixar a letra.
  */
  const pertoDaPlataforma = useMemo(() => {
    return calcularDistanciaXZ(posicaoJogador, posicaoPlataformaFase) <= 2.65
  }, [posicaoJogador, posicaoPlataformaFase])

  /*
    Move o personagem respeitando o limite do mapa.
  */
  function moverJogador(deltaX, deltaZ) {
    if (status !== 'jogando') return

    const limite = obterLimiteMapa(fase)

    setPosicaoJogador(([x, y, z]) => {
      const novoX = limitar(x + deltaX, -limite, limite)
      const novoZ = limitar(z + deltaZ, -limite, limite)

      return [novoX, y, novoZ]
    })
  }

  /*
    Movimento contínuo para mobile.

    O jogador segura o botão do controle e o personagem anda
    até soltar o dedo.
  */
  function iniciarMovimentoContinuo(deltaX, deltaZ) {
    if (status !== 'jogando') return

    pararMovimentoContinuo()
    moverJogador(deltaX, deltaZ)

    movimentoTimerRef.current = setInterval(() => {
      moverJogador(deltaX, deltaZ)
    }, INTERVALO_MOVIMENTO)
  }

  function pararMovimentoContinuo() {
    if (movimentoTimerRef.current) {
      clearInterval(movimentoTimerRef.current)
      movimentoTimerRef.current = null
    }
  }

  /*
    Cria os eventos do botão de movimento.
    Usamos pointer events porque funcionam com mouse e toque.
  */
  function criarControleMovimento(deltaX, deltaZ) {
    return {
      onPointerDown: () => iniciarMovimentoContinuo(deltaX, deltaZ),
      onPointerUp: pararMovimentoContinuo,
      onPointerLeave: pararMovimentoContinuo,
      onPointerCancel: pararMovimentoContinuo
    }
  }

  /*
    Pega automaticamente o bloco mais próximo.
  */
  function pegarBlocoProximo() {
    if (blocoNaMao) {
      setMensagem(
        `Você já está carregando a letra ${blocoNaMao.letra}. Leve até a plataforma e solte.`
      )
      return
    }

    if (!blocoProximo) {
      setMensagem('Chegue mais perto de um bloco de letra para pegar.')
      return
    }

    pegarBloco(blocoProximo)
  }

  /*
    Pega um bloco específico.
    Também é chamado quando o jogador clica direto no bloco 3D.
  */
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
      `Você pegou a letra ${bloco.letra}. Leve até a plataforma e solte.`
    )
  }

  /*
    Solta o bloco.

    Se estiver perto da plataforma, tenta encaixar.
    Se estiver longe, devolve o bloco ao cenário.
  */
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

  /*
    Valida se a letra carregada é a próxima letra correta da palavra.
  */
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
    Devolve o bloco para perto do jogador quando ele solta fora da plataforma
    ou quando erra a letra.
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
    Conclui a fase e libera o botão de próxima fase.
  */
  function concluirFase() {
    setStatus('vitoria')
    setBlocoNaMao(null)

    const bonusTempo = tempoRestante ? Math.max(0, tempoRestante) : 0
    const bonusFase = fase.numero * 20

    setPontos((valor) => valor + bonusFase + bonusTempo)

    setMensagem(
      `Parabéns! Você completou ${fase.palavra}. ${fase.tema}: missão concluída!`
    )
  }

  /*
    Vai para a próxima fase.
    Quando chegar ao fim, obterFasePorIndice faz o ciclo continuar.
  */
  function proximaFase() {
    setFaseIndex((indiceAtual) => indiceAtual + 1)
  }

  /*
    Reinicia somente a fase atual.
  */
  function reiniciarFase() {
    setBlocos(criarBlocosDaFase(fase))
    setPosicaoJogador(posicaoInicialFase)
    setBlocoNaMao(null)
    setLetrasColocadas([])
    setStatus('jogando')
    setTempoRestante(fase.tempoLimite)
    setMensagem(`Fase reiniciada. ${fase.objetivo}`)
  }

  /*
    Volta para o menu de seleção/criação do personagem.
  */
  function voltarMenu() {
    pararMovimentoContinuo()

    if (onVoltarMenu) {
      onVoltarMenu()
    }
  }

  return (
    <main className={`vila-3d-page clima-${fase.clima}`}>
      <section className="vila-3d-hud">
        <button type="button" className="vila-3d-back" onClick={voltarMenu}>
          ←
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

          <Player3D
            personagem={personagem}
            position={posicaoJogador}
            blocoNaMao={blocoNaMao}
            nivel={nivelAtual}
          />

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

        {/* 
          CONTROLE MOBILE / TOUCH

          Lado esquerdo:
          - controle circular de movimento.

          Lado direito:
          - bolinha amarela para pegar;
          - botão verde para soltar;
          - botão cinza para reiniciar.

          No desktop, o teclado continua funcionando.
        */}
        <div className="vila-3d-gamepad">
          <div className="vila-3d-joystick">
            <button
              type="button"
              className="joy-btn joy-up"
              aria-label="Mover para cima"
              {...criarControleMovimento(0, -PASSO)}
            >
              ▲
            </button>

            <button
              type="button"
              className="joy-btn joy-left"
              aria-label="Mover para esquerda"
              {...criarControleMovimento(-PASSO, 0)}
            >
              ◀
            </button>

            <div className="joy-center" />

            <button
              type="button"
              className="joy-btn joy-right"
              aria-label="Mover para direita"
              {...criarControleMovimento(PASSO, 0)}
            >
              ▶
            </button>

            <button
              type="button"
              className="joy-btn joy-down"
              aria-label="Mover para baixo"
              {...criarControleMovimento(0, PASSO)}
            >
              ▼
            </button>
          </div>

          <div className="vila-3d-game-buttons">
            <button
              type="button"
              className="mobile-action-ball grab"
              aria-label="Pegar bloco"
              onClick={pegarBlocoProximo}
            >
              <span className="mobile-action-dot" />
            </button>

            <button type="button" className="drop" onClick={soltarBloco}>
              Soltar
            </button>

            <button type="button" className="restart" onClick={reiniciarFase}>
              Reiniciar
            </button>
          </div>
        </div>
      </section>

      <section className="vila-3d-actions">
        <button type="button" onClick={reiniciarFase}>
          Reiniciar fase
        </button>

        {status === 'perdeu' && (
          <button type="button" className="yellow" onClick={reiniciarFase}>
            Tentar novamente
          </button>
        )}

        {status === 'vitoria' && (
          <button type="button" className="yellow" onClick={proximaFase}>
            Próxima fase →
          </button>
        )}

        <button type="button" onClick={voltarMenu}>
          Voltar ao menu
        </button>
      </section>
    </main>
  )
}

/*
  CÂMERA SEGUINDO O JOGADOR

  Mantém uma visão superior inclinada.
  Isso ajuda nos mapas maiores.
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

/* =========================================================
   HELPERS
========================================================= */

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

/*
  Calcula o limite de movimento de acordo com o tamanho do mapa.
*/
function obterLimiteMapa(fase) {
  return Math.floor((fase.tamanhoMapa || 17) / 2) - 1
}

/*
  O jogador começa perto de uma ponta do mapa.
*/
function obterPosicaoInicialDaFase(fase) {
  const limite = obterLimiteMapa(fase)

  return [0, 0, limite - 1]
}

/*
  A plataforma fica do outro lado do mapa.
*/
function obterPosicaoPlataformaDaFase(fase) {
  const limite = obterLimiteMapa(fase)

  return [0, 0.35, -limite + 1]
}

export default VilaBlocos3D