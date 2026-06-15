import React, { useEffect, useMemo, useState } from 'react'
import './aventuraBlocos.css'

const RANKING_KEY = 'lar_batista_ranking_aventura_blocos'

const FASES = [
  {
    id: 'sol',
    nome: 'Sol',
    icone: '☀️',
    titulo: 'Fase do Sol',
    dica: 'Dia claro para aprender brincando.'
  },
  {
    id: 'frio',
    nome: 'Frio',
    icone: '🧊',
    titulo: 'Fase do Frio',
    dica: 'Atenção aos blocos gelados.'
  },
  {
    id: 'neve',
    nome: 'Neve',
    icone: '❄️',
    titulo: 'Fase da Neve',
    dica: 'Complete as palavras no mundo congelado.'
  },
  {
    id: 'chuva',
    nome: 'Chuva',
    icone: '🌧️',
    titulo: 'Fase da Chuva',
    dica: 'Mesmo com chuva, a aventura continua.'
  }
]

const PALAVRAS = {
  vogais: [
    { resposta: 'A', pergunta: 'Qual é a primeira vogal?', emoji: '🔤', dica: 'Vogal' },
    { resposta: 'E', pergunta: 'Qual vogal vem depois do A?', emoji: '🔤', dica: 'Vogal' },
    { resposta: 'I', pergunta: 'Encontre a vogal I.', emoji: '🔤', dica: 'Vogal' },
    { resposta: 'O', pergunta: 'Encontre a vogal O.', emoji: '🔤', dica: 'Vogal' },
    { resposta: 'U', pergunta: 'Encontre a vogal U.', emoji: '🔤', dica: 'Vogal' }
  ],
  objetos: [
    { resposta: 'BOLA', pergunta: 'O que aparece na imagem?', emoji: '⚽', dica: 'Objeto' },
    { resposta: 'CARRO', pergunta: 'O que aparece na imagem?', emoji: '🚗', dica: 'Transporte' },
    { resposta: 'CASA', pergunta: 'O que aparece na imagem?', emoji: '🏠', dica: 'Lugar' },
    { resposta: 'COPO', pergunta: 'O que usamos para beber?', emoji: '🥤', dica: 'Objeto' },
    { resposta: 'PRATO', pergunta: 'O que usamos para comer?', emoji: '🍽️', dica: 'Utensílio' },
    { resposta: 'GARFO', pergunta: 'O que usamos para comer?', emoji: '🍴', dica: 'Utensílio' }
  ],
  animais: [
    { resposta: 'GATO', pergunta: 'Que animal é esse?', emoji: '🐱', dica: 'Animal' },
    { resposta: 'PATO', pergunta: 'Que animal é esse?', emoji: '🦆', dica: 'Animal' },
    { resposta: 'SAPO', pergunta: 'Que animal é esse?', emoji: '🐸', dica: 'Animal' },
    { resposta: 'PEIXE', pergunta: 'Que animal vive na água?', emoji: '🐟', dica: 'Animal' },
    { resposta: 'CAVALO', pergunta: 'Que animal é esse?', emoji: '🐴', dica: 'Animal' }
  ],
  escola: [
    { resposta: 'LAPIS', pergunta: 'Material usado para escrever.', emoji: '✏️', dica: 'Escola' },
    { resposta: 'LIVRO', pergunta: 'Usamos para ler e aprender.', emoji: '📘', dica: 'Escola' },
    { resposta: 'REGUA', pergunta: 'Usamos para medir.', emoji: '📏', dica: 'Escola' },
    { resposta: 'CADERNO', pergunta: 'Onde escrevemos atividades.', emoji: '📒', dica: 'Escola' },
    { resposta: 'BORRACHA', pergunta: 'Usamos para apagar.', emoji: '◻️', dica: 'Escola' }
  ],
  bem: [
    { resposta: 'AMOR', pergunta: 'Palavra que representa carinho.', emoji: '💛', dica: 'Valor' },
    { resposta: 'PAZ', pergunta: 'Palavra que combina com tranquilidade.', emoji: '🕊️', dica: 'Valor' },
    { resposta: 'AJUDA', pergunta: 'Quando apoiamos alguém.', emoji: '🤝', dica: 'Valor' },
    { resposta: 'CUIDADO', pergunta: 'Atenção e carinho com o outro.', emoji: '💙', dica: 'Valor' }
  ]
}

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const NUMEROS = '0123456789'.split('')

function AventuraBlocos({ personagemExterno, onVoltarMenu, onNivelChange }) {
  const personagem = personagemExterno || {
    nome: 'Explorador',
    roupa: 'azul',
    cabelo: 'castanho',
    olhos: 'castanho',
    sapato: 'preto',
    acessorio: 'nenhum'
  }

  const [nivel, setNivel] = useState(1)
  const [xp, setXp] = useState(0)
  const [pontos, setPontos] = useState(0)
  const [estrelas, setEstrelas] = useState(0)
  const [acertos, setAcertos] = useState(0)
  const [dicas, setDicas] = useState(3)

  const [desafio, setDesafio] = useState(() => criarDesafio(1))
  const [blocos, setBlocos] = useState(() => criarBlocos(criarDesafio(1).resposta))
  const [respostaAtual, setRespostaAtual] = useState([])
  const [indiceSelecionado, setIndiceSelecionado] = useState(0)
  const [mensagem, setMensagem] = useState({
    tipo: 'neutro',
    texto: 'Complete a palavra e avance!'
  })
  const [ranking, setRanking] = useState([])

  const fase = useMemo(() => obterFasePorNivel(nivel), [nivel])

  const progresso = useMemo(() => {
    if (!desafio.resposta.length) return 0
    return Math.round((respostaAtual.length / desafio.resposta.length) * 100)
  }, [respostaAtual, desafio])

  const xpMeta = nivel * 150 + 250

  useEffect(() => {
    setRanking(carregarRanking())
  }, [])

  function iniciarNovoNivel(proximoNivel) {
    const novoDesafio = criarDesafio(proximoNivel)
    const novosBlocos = criarBlocos(novoDesafio.resposta)

    setNivel(proximoNivel)
    setDesafio(novoDesafio)
    setBlocos(novosBlocos)
    setRespostaAtual([])
    setIndiceSelecionado(0)
    setMensagem({
      tipo: 'neutro',
      texto: 'Novo desafio! Pegue os blocos na ordem certa.'
    })

    if (onNivelChange) {
      onNivelChange(proximoNivel)
    }
  }

  function selecionarBloco(bloco) {
    const esperado = desafio.resposta[respostaAtual.length]

    if (!esperado) return

    if (bloco.valor !== esperado) {
      setMensagem({
        tipo: 'erro',
        texto: `Bloco errado! Você pegou "${bloco.valor}", mas precisava de "${esperado}".`
      })

      return
    }

    const novaResposta = [...respostaAtual, bloco.valor]
    const novosBlocos = blocos.filter((item) => item.id !== bloco.id)

    setRespostaAtual(novaResposta)
    setBlocos(novosBlocos)
    setIndiceSelecionado((valor) => Math.max(0, Math.min(valor, novosBlocos.length - 1)))

    if (novaResposta.join('') === desafio.resposta) {
      concluirNivel(novaResposta.join(''))
      return
    }

    setMensagem({
      tipo: 'acerto',
      texto: 'Bloco certo! Continue assim.'
    })
  }

  function concluirNivel(respostaFinal) {
    const ganhoPontos = desafio.resposta.length * 10 + nivel * 8
    const ganhoXp = desafio.resposta.length * 35 + nivel * 12
    const novasEstrelas = estrelas + 1
    const novosAcertos = acertos + 1
    const novosPontos = pontos + ganhoPontos
    const novoXp = xp + ganhoXp
    const proximoNivel = nivel + 1

    setPontos(novosPontos)
    setXp(novoXp)
    setEstrelas(novasEstrelas)
    setAcertos(novosAcertos)

    setMensagem({
      tipo: 'vitoria',
      texto: `Nível concluído! Você montou: ${respostaFinal}`
    })

    const rankingAtualizado = salvarRanking({
      nome: personagem.nome || 'Jogador',
      pontos: novosPontos,
      nivel: proximoNivel,
      estrelas: novasEstrelas,
      acertos: novosAcertos
    })

    setRanking(rankingAtualizado)

    setTimeout(() => {
      iniciarNovoNivel(proximoNivel)
    }, 1300)
  }

  function mover(direcao) {
    if (!blocos.length) return

    setIndiceSelecionado((atual) => {
      if (direcao === 'esquerda') {
        return atual <= 0 ? blocos.length - 1 : atual - 1
      }

      return atual >= blocos.length - 1 ? 0 : atual + 1
    })
  }

  function pegarSelecionado() {
    const bloco = blocos[indiceSelecionado]

    if (!bloco) return

    selecionarBloco(bloco)
  }

  function desfazer() {
    if (!respostaAtual.length) return

    const ultima = respostaAtual[respostaAtual.length - 1]

    setRespostaAtual((lista) => lista.slice(0, -1))
    setBlocos((lista) =>
      embaralhar([
        ...lista,
        {
          id: `volta-${ultima}-${Date.now()}`,
          valor: ultima,
          cor: 'amarelo'
        }
      ])
    )

    setMensagem({
      tipo: 'neutro',
      texto: 'Último bloco voltou para o campo.'
    })
  }

  function mostrarDica() {
    if (dicas <= 0) {
      setMensagem({
        tipo: 'erro',
        texto: 'Você não tem mais dicas neste momento.'
      })
      return
    }

    const esperado = desafio.resposta[respostaAtual.length]

    if (!esperado) return

    setDicas((valor) => valor - 1)
    setMensagem({
      tipo: 'neutro',
      texto: `Dica: procure o bloco "${esperado}".`
    })
  }

  function reiniciar() {
    const confirmar = confirm('Deseja reiniciar a aventura?')

    if (!confirmar) return

    setNivel(1)
    setXp(0)
    setPontos(0)
    setEstrelas(0)
    setAcertos(0)
    setDicas(3)
    iniciarNovoNivel(1)
  }

  return (
    <main className={`ab-game ${fase.id}`}>
      <div className="ab-weather-layer" />

      <header className="ab-hud">
        <button type="button" className="ab-back" onClick={onVoltarMenu}>
          ←
        </button>

        <div className="ab-level-card">
          <span>Nível</span>
          <strong>{nivel}</strong>
        </div>

        <div className="ab-xp">
          <div className="ab-xp-label">
            <span>{xp}</span>
            <span>/ {xpMeta} XP</span>
          </div>

          <div className="ab-xp-bar">
            <span style={{ width: `${Math.min(100, (xp / xpMeta) * 100)}%` }} />
          </div>
        </div>

        <div className="ab-phase">
          <span>{fase.icone}</span>
          <strong>{fase.titulo}</strong>
        </div>

        <div className="ab-score-card">
          <span>⭐ Pontos</span>
          <strong>{pontos}</strong>
        </div>

        <div className="ab-score-card">
          <span>✅ Acertos</span>
          <strong>{acertos}</strong>
        </div>
      </header>

      <section className="ab-board">
        <div className="ab-word-panel">
          <h2>Monte a palavra</h2>

          <div className="ab-slots">
            {desafio.resposta.split('').map((_, index) => (
              <div
                key={`slot-${index}`}
                className={respostaAtual[index] ? 'ab-slot filled' : 'ab-slot'}
              >
                {respostaAtual[index] || ''}
              </div>
            ))}
          </div>

          <p>
            <strong>Dica:</strong> {desafio.pergunta}
          </p>

          <small>
            Categoria: {desafio.categoria}
          </small>
        </div>

        <div className={`ab-message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      </section>

      <section className="ab-world">
        <div className="ab-sky-elements">
          <span className="ab-sun" />
          <span className="ab-cloud one" />
          <span className="ab-cloud two" />
          <span className="ab-mountain one" />
          <span className="ab-mountain two" />
        </div>

        <div className="ab-player">
          <BonecoPixel personagem={personagem} />
        </div>

        <div className="ab-object">
          {desafio.emoji}
        </div>

        <div className="ab-blocks-line">
          {blocos.map((bloco, index) => (
            <button
              key={bloco.id}
              type="button"
              className={
                index === indiceSelecionado
                  ? `ab-block selected ${bloco.cor}`
                  : `ab-block ${bloco.cor}`
              }
              onClick={() => selecionarBloco(bloco)}
            >
              {index === indiceSelecionado && <span className="ab-pointer">▼</span>}
              {bloco.valor}
            </button>
          ))}
        </div>
      </section>

      <section className="ab-controls">
        <button type="button" onClick={() => mover('esquerda')}>
          ◀
        </button>

        <button type="button" onClick={pegarSelecionado} className="main">
          ⛏ Pegar bloco
        </button>

        <button type="button" onClick={() => mover('direita')}>
          ▶
        </button>

        <button type="button" onClick={mostrarDica}>
          💡 Dica {dicas}
        </button>

        <button type="button" onClick={desfazer}>
          ↩ Desfazer
        </button>

        <button type="button" onClick={reiniciar}>
          🔄 Reiniciar
        </button>
      </section>

      <section className="ab-phase-cards">
        {FASES.map((item) => (
          <article
            key={item.id}
            className={item.id === fase.id ? `active ${item.id}` : item.id}
          >
            <span>{item.icone}</span>
            <strong>{item.nome}</strong>
            <small>⭐ {calcularEstrelasDaFase(item.id, estrelas)} / 15</small>
          </article>
        ))}
      </section>

      <aside className="ab-ranking">
        <h3>Ranking</h3>

        {ranking.length === 0 ? (
          <p>Nenhuma pontuação ainda.</p>
        ) : (
          ranking.slice(0, 5).map((item, index) => (
            <div key={`${item.nome}-${index}`}>
              <strong>{index + 1}. {item.nome}</strong>
              <span>Nv. {item.nivel} • {item.pontos} pts</span>
            </div>
          ))
        )}
      </aside>
    </main>
  )
}

function criarDesafio(nivel) {
  const matematica = nivel % 4 === 0 || nivel % 7 === 0

  if (matematica) {
    return criarMatematica(nivel)
  }

  let grupo = 'vogais'

  if (nivel >= 3 && nivel <= 5) grupo = 'objetos'
  if (nivel >= 6 && nivel <= 8) grupo = 'animais'
  if (nivel >= 9 && nivel <= 12) grupo = 'escola'
  if (nivel >= 13) {
    const grupos = ['objetos', 'animais', 'escola', 'bem']
    grupo = grupos[Math.floor(Math.random() * grupos.length)]
  }

  const lista = PALAVRAS[grupo]
  const item = lista[Math.floor(Math.random() * lista.length)]

  return {
    tipo: 'palavra',
    categoria: grupo,
    pergunta: item.pergunta,
    resposta: normalizar(item.resposta),
    emoji: item.emoji
  }
}

function criarMatematica(nivel) {
  const operacoes = nivel >= 12 ? ['+', '-', 'x', '÷'] : ['+', '-']
  const op = operacoes[Math.floor(Math.random() * operacoes.length)]

  let a = 0
  let b = 0
  let resultado = 0

  if (op === '+') {
    a = sortear(1, nivel + 8)
    b = sortear(1, nivel + 8)
    resultado = a + b
  }

  if (op === '-') {
    a = sortear(5, nivel + 12)
    b = sortear(1, a)
    resultado = a - b
  }

  if (op === 'x') {
    a = sortear(2, 9)
    b = sortear(2, 9)
    resultado = a * b
  }

  if (op === '÷') {
    b = sortear(2, 8)
    resultado = sortear(2, 9)
    a = b * resultado
  }

  return {
    tipo: 'matematica',
    categoria: 'matemática',
    pergunta: `Quanto é ${a} ${op} ${b}?`,
    resposta: String(resultado),
    emoji: '🧮'
  }
}

function criarBlocos(resposta) {
  const chars = resposta.split('')
  const universo = /\d/.test(resposta) ? NUMEROS : LETRAS
  const extras = []

  while (extras.length < Math.max(5, 12 - chars.length)) {
    extras.push(universo[Math.floor(Math.random() * universo.length)])
  }

  return embaralhar([...chars, ...extras]).map((valor, index) => ({
    id: `${valor}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    valor,
    cor: ['blue', 'green', 'yellow', 'purple', 'red', 'cyan'][index % 6]
  }))
}

function obterFasePorNivel(nivel) {
  const index = Math.floor((nivel - 1) / 4) % FASES.length
  return FASES[index]
}

function calcularEstrelasDaFase(faseId, estrelas) {
  const indice = FASES.findIndex((fase) => fase.id === faseId)
  const minimo = indice * 4

  return Math.max(0, Math.min(15, estrelas - minimo))
}

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '')
    .toUpperCase()
}

function sortear(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function embaralhar(lista) {
  const copia = [...lista]

  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }

  return copia
}

function carregarRanking() {
  try {
    return JSON.parse(localStorage.getItem(RANKING_KEY)) || []
  } catch {
    return []
  }
}

function salvarRanking(item) {
  const ranking = carregarRanking()

  const novo = [...ranking, item]
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos
      return b.nivel - a.nivel
    })
    .slice(0, 10)

  localStorage.setItem(RANKING_KEY, JSON.stringify(novo))

  return novo
}

function BonecoPixel({ personagem }) {
  return (
    <div
      className={[
        'ab-character',
        personagem.roupa,
        personagem.cabelo,
        personagem.olhos,
        personagem.sapato,
        personagem.acessorio
      ].join(' ')}
    >
      <div className="ab-hair" />
      <div className="ab-head">
        <span className="eye left" />
        <span className="eye right" />
        <span className="mouth" />
      </div>

      <div className="ab-body">
        <span className="arm left" />
        <span className="torso" />
        <span className="arm right" />
      </div>

      <div className="ab-legs">
        <span />
        <span />
      </div>
    </div>
  )
}

export default AventuraBlocos