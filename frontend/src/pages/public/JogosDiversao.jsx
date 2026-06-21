import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './jogosDiversao.css'

import {
  apagarPerfilJogador,
  carregarPerfilJogador,
  estilosAvatar,
  gerarAvatarUrl,
  gerarSeedAleatoria,
  salvarPerfilJogador
} from '../../services/jogosPerfilService'

import {
  listarRankingJogos
} from '../../services/rankingJogosService'

/*
  PÁGINA: JOGUE E DIVIRTA-SE

  Versão atualizada:
  - Aventura dos Blocos abre na rota 3D: /jogos/aventura-blocos.
  - Perfil do Doador agora abre um jogo de perfil solidário.
  - Show da Solidariedade agora abre um quiz de pontos.
  - Quiz Educativo agora abre um quiz educativo.
  - Memória Solidária agora abre jogo de memória.
  - Caça-palavras do Bem agora abre jogo de caça-palavras.
  - Missão Voluntário agora abre quiz de missão.
*/

function JogosDiversao() {
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [apelido, setApelido] = useState('')
  const [estiloAvatar, setEstiloAvatar] = useState('adventurer')
  const [avatarSeed, setAvatarSeed] = useState(gerarSeedAleatoria())
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [rankingAventura, setRankingAventura] = useState([])
  const [jogoAberto, setJogoAberto] = useState(null)

  useEffect(() => {
    const perfilSalvo = carregarPerfilJogador()

    if (perfilSalvo) {
      setPerfil(perfilSalvo)
      setApelido(perfilSalvo.apelido)
      setEstiloAvatar(perfilSalvo.estiloAvatar)
      setAvatarSeed(perfilSalvo.avatarSeed)
    }

    setRankingAventura(listarRankingJogos('aventura-blocos'))
  }, [])

  const avatarPreview = useMemo(() => {
    return gerarAvatarUrl({
      estiloAvatar,
      avatarSeed
    })
  }, [estiloAvatar, avatarSeed])

  const jogos = [
    {
      id: 'aventura-blocos',
      categoria: 'criancas',
      destaque: true,
      pontos: 'Jogo infinito',
      icone: '🧱',
      titulo: 'Aventura dos Blocos',
      descricao:
        'Monte palavras, resolva desafios, avance níveis e explore fases educativas em 3D.',
      botao: 'Jogar agora',
      status: 'ativo'
    },
    {
      id: 'perfil-doador',
      categoria: 'perfil',
      destaque: true,
      pontos: 'Perfil',
      icone: '💛',
      titulo: 'Perfil do Doador',
      descricao:
        'Responda perguntas e descubra seu nível de compatibilidade solidária.',
      botao: 'Descobrir meu perfil',
      status: 'ativo'
    },
    {
      id: 'show-solidariedade',
      categoria: 'quiz',
      destaque: true,
      pontos: '1.520 pontos',
      icone: '🏆',
      titulo: 'Show da Solidariedade',
      descricao:
        'Responda perguntas, acumule pontos e aprenda sobre solidariedade.',
      botao: 'Jogar agora',
      status: 'ativo'
    },
    {
      id: 'quiz-educativo',
      categoria: 'educativo',
      destaque: false,
      pontos: '980 pontos',
      icone: '💡',
      titulo: 'Quiz Educativo',
      descricao:
        'Teste seus conhecimentos sobre educação, valores e cidadania.',
      botao: 'Responder quiz',
      status: 'ativo'
    },
    {
      id: 'memoria-solidaria',
      categoria: 'criancas',
      destaque: false,
      pontos: 'Jogo rápido',
      icone: '🧩',
      titulo: 'Memória Solidária',
      descricao:
        'Encontre os pares e exercite sua memória com propósito.',
      botao: 'Jogar agora',
      status: 'ativo'
    },
    {
      id: 'caca-palavras',
      categoria: 'criancas',
      destaque: false,
      pontos: 'Educativo',
      icone: '🔎',
      titulo: 'Caça-palavras do Bem',
      descricao:
        'Encontre palavras que espalham bondade, cuidado e solidariedade.',
      botao: 'Jogar agora',
      status: 'ativo'
    },
    {
      id: 'missao-voluntario',
      categoria: 'desafios',
      destaque: false,
      pontos: 'Missão',
      icone: '🙌',
      titulo: 'Missão Voluntário',
      descricao:
        'Aprenda, participe e veja como pequenas ações geram impacto.',
      botao: 'Começar missão',
      status: 'ativo'
    }
  ]

  const categorias = [
    { id: 'todos', nome: 'Todos', icone: '💙' },
    { id: 'criancas', nome: 'Jogos para Crianças', icone: '🧸' },
    { id: 'educativo', nome: 'Quiz Educativo', icone: '💡' },
    { id: 'quiz', nome: 'Show da Solidariedade', icone: '🏆' },
    { id: 'perfil', nome: 'Perfil Doador', icone: '💛' },
    { id: 'desafios', nome: 'Desafios Solidários', icone: '🙌' }
  ]

  const jogosFiltrados =
    categoriaAtiva === 'todos'
      ? jogos
      : jogos.filter((jogo) => jogo.categoria === categoriaAtiva)

  const destaques = jogosFiltrados.filter((jogo) => jogo.destaque)
  const jogosMenores = jogosFiltrados.filter((jogo) => !jogo.destaque)

  function salvarPerfil(e) {
    e.preventDefault()

    if (!apelido.trim()) {
      alert('Informe um apelido ou nome curto para continuar.')
      return
    }

    const novoPerfil = salvarPerfilJogador({
      apelido,
      estiloAvatar,
      avatarSeed
    })

    setPerfil(novoPerfil)
    setRankingAventura(listarRankingJogos('aventura-blocos'))
  }

  function trocarAvatar() {
    setAvatarSeed(gerarSeedAleatoria())
  }

  function limparPerfil() {
    const confirmar = confirm(
      'Deseja apagar seu perfil de jogador deste navegador?'
    )

    if (!confirmar) return

    apagarPerfilJogador()
    setPerfil(null)
    setApelido('')
    setEstiloAvatar('adventurer')
    setAvatarSeed(gerarSeedAleatoria())
    setJogoAberto(null)
  }

  function abrirJogo(jogo) {
    if (!perfil) {
      alert('Monte seu perfil de jogador antes de começar.')

      const perfilArea = document.getElementById('perfil-jogador')

      if (perfilArea) {
        perfilArea.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }

      return
    }

    if (jogo.id === 'aventura-blocos') {
      navigate('/jogos/aventura-blocos')
      return
    }

    setJogoAberto(jogo)

    setTimeout(() => {
      const areaJogo = document.getElementById('jogo-aberto')

      if (areaJogo) {
        areaJogo.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }

  function fecharJogo() {
    setJogoAberto(null)
  }

  return (
    <main className="games-page">
      <section className="games-hero">
        <div className="games-hero-content">
          <span className="games-kicker">Espaço interativo</span>

          <h1>
            Jogue e
            <strong> divirta-se</strong>
          </h1>

          <p>
            Aprenda, brinque, interaja e ajude a transformar vidas.
            Aqui você encontra jogos educativos, desafios solidários e
            experiências para toda a família.
          </p>

          <div className="games-hero-actions">
            <Link to="/doar-agora" className="games-primary-button">
              Doe Agora
            </Link>

            <a href="#jogos" className="games-secondary-button">
              Começar a jogar
            </a>
          </div>
        </div>

        <div className="games-hero-card">
          <div className="games-screen">
            <strong>LAR Batista</strong>
            <span>Jogar faz bem. Ajudar transforma.</span>
            <small>💛</small>
          </div>
        </div>
      </section>

      <section className="games-profile-section" id="perfil-jogador">
        <div className="games-profile-card">
          <div>
            <span className="games-kicker">Perfil do jogador</span>

            <h2>Monte seu perfil para jogar</h2>

            <p>
              Use um apelido e escolha um avatar. Por segurança e privacidade,
              não pedimos foto própria neste momento.
            </p>
          </div>

          <form className="games-profile-form" onSubmit={salvarPerfil}>
            <div className="games-avatar-preview">
              <img src={avatarPreview} alt="Avatar escolhido" />
            </div>

            <label>
              Nome, apelido ou nickname
              <input
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                placeholder="Ex: Jogador Solidário"
                maxLength={28}
              />
            </label>

            <label>
              Estilo do avatar
              <select
                value={estiloAvatar}
                onChange={(e) => setEstiloAvatar(e.target.value)}
              >
                {estilosAvatar.map((estilo) => (
                  <option key={estilo.id} value={estilo.id}>
                    {estilo.nome}
                  </option>
                ))}
              </select>
            </label>

            <div className="games-profile-actions">
              <button type="button" onClick={trocarAvatar}>
                Gerar outro avatar
              </button>

              <button type="submit">
                Salvar perfil
              </button>
            </div>
          </form>
        </div>

        {perfil && (
          <div className="games-current-profile">
            <img src={perfil.avatarUrl} alt={perfil.apelido} />

            <div>
              <strong>{perfil.apelido}</strong>
              <span>Perfil ativo neste navegador</span>
            </div>

            <button type="button" onClick={limparPerfil}>
              Trocar perfil
            </button>
          </div>
        )}
      </section>

      <section className="games-categories" id="jogos">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            className={
              categoriaAtiva === categoria.id
                ? 'games-category active'
                : 'games-category'
            }
            onClick={() => setCategoriaAtiva(categoria.id)}
          >
            <span>{categoria.icone}</span>
            {categoria.nome}
          </button>
        ))}
      </section>

      <section className="games-section">
        <div className="games-section-header">
          <h2>Destaques para você</h2>
          <p>Escolha uma experiência e comece a se divertir.</p>
        </div>

        <div className="games-feature-grid">
          {destaques.map((jogo) => (
            <GameCard
              key={jogo.id}
              jogo={jogo}
              destaque
              perfilCriado={Boolean(perfil)}
              onAbrir={abrirJogo}
            />
          ))}
        </div>
      </section>

      <section className="games-section">
        <div className="games-section-header">
          <h2>Mais jogos para você</h2>
          <p>Atividades rápidas, educativas e solidárias.</p>
        </div>

        <div className="games-small-grid">
          {jogosMenores.map((jogo) => (
            <GameCard
              key={jogo.id}
              jogo={jogo}
              perfilCriado={Boolean(perfil)}
              onAbrir={abrirJogo}
            />
          ))}
        </div>
      </section>

      {jogoAberto && (
        <section className="games-play-section" id="jogo-aberto">
          <div className="games-play-header">
            <div>
              <span className="games-kicker">Jogo ativo</span>
              <h2>
                {jogoAberto.icone} {jogoAberto.titulo}
              </h2>
              <p>{jogoAberto.descricao}</p>
            </div>

            <button type="button" onClick={fecharJogo}>
              Fechar jogo
            </button>
          </div>

          <JogoInterno jogo={jogoAberto} perfil={perfil} />
        </section>
      )}

      <section className="games-ranking-section">
        <div className="games-ranking-header">
          <div>
            <span className="games-kicker">Ranking local</span>

            <h2>Ranking da Aventura dos Blocos</h2>

            <p>
              Este ranking fica salvo no navegador. Depois podemos transformar
              em ranking geral online com banco de dados.
            </p>
          </div>

        </div>

        {rankingAventura.length === 0 ? (
          <div className="ranking-empty">
            <span>🏅</span>
            <strong>Ainda não há pontuação registrada.</strong>
            <p>Jogue a Aventura dos Blocos para aparecer no ranking.</p>
          </div>
        ) : (
          <div className="ranking-list">
            {rankingAventura.map((item, index) => (
              <article key={item.id} className="ranking-item">
                <div className="ranking-position">{index + 1}</div>

                <img src={item.avatarUrl} alt={item.apelido} />

                <div className="ranking-player">
                  <strong>{item.apelido}</strong>
                  <span>{item.personagem}</span>
                </div>

                <div className="ranking-score">
                  <strong>{item.pontos}</strong>
                  <span>Pontos</span>
                </div>

                <div className="ranking-score">
                  <strong>{item.nivel}</strong>
                  <span>Nível</span>
                </div>

                <div className="ranking-score">
                  <strong>{item.acertos}</strong>
                  <span>Acertos</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="games-donor-box">
        <div>
          <span className="games-kicker">Perfil Doador</span>

          <h2>Descubra seu perfil de doador</h2>

          <p>
            Responda perguntas rápidas, veja seu perfil solidário e descubra
            formas de ajudar o Lar Batista.
          </p>
        </div>

        <div className="games-percent-preview">
          <strong>87%</strong>
          <span>Doador Solidário</span>
        </div>

        <Link to="/doar-agora">Ir para Doação</Link>
      </section>
    </main>
  )
}

function GameCard({ jogo, destaque = false, perfilCriado, onAbrir }) {
  const jogoAtivo = jogo.status === 'ativo'

  return (
    <article className={destaque ? 'game-card featured' : 'game-card'}>
      <div className="game-card-cover">
        <span className="game-card-icon">{jogo.icone}</span>
        <small>{jogo.pontos}</small>
      </div>

      <div className="game-card-content">
        <h3>{jogo.titulo}</h3>

        <p>{jogo.descricao}</p>

        {!perfilCriado && jogoAtivo && (
          <span className="game-profile-required">
            Crie seu perfil antes de jogar
          </span>
        )}

        <button
          type="button"
          className={!jogoAtivo ? 'locked' : ''}
          onClick={() => onAbrir(jogo)}
        >
          {jogoAtivo ? jogo.botao : 'Em breve'} →
        </button>
      </div>
    </article>
  )
}

function JogoInterno({ jogo, perfil }) {
  if (jogo.id === 'perfil-doador') {
    return <PerfilDoadorGame perfil={perfil} />
  }

  if (jogo.id === 'memoria-solidaria') {
    return <MemoriaSolidariaGame perfil={perfil} />
  }

  if (jogo.id === 'caca-palavras') {
    return <CacaPalavrasGame perfil={perfil} />
  }

  return (
    <QuizSolidarioGame
      perfil={perfil}
      dados={dadosJogosPerguntas[jogo.id] || dadosJogosPerguntas['quiz-educativo']}
    />
  )
}

function QuizSolidarioGame({ perfil, dados }) {
  const [indice, setIndice] = useState(0)
  const [selecionada, setSelecionada] = useState(null)
  const [acertos, setAcertos] = useState(0)
  const [pontos, setPontos] = useState(0)
  const [finalizado, setFinalizado] = useState(false)

  const perguntaAtual = dados.perguntas[indice]
  const respondeu = selecionada !== null

  function responder(opcaoIndex) {
    if (respondeu) return

    setSelecionada(opcaoIndex)

    if (opcaoIndex === perguntaAtual.correta) {
      setAcertos((valor) => valor + 1)
      setPontos((valor) => valor + perguntaAtual.pontos)
    }
  }

  function proximaPergunta() {
    if (indice + 1 >= dados.perguntas.length) {
      setFinalizado(true)
      return
    }

    setIndice((valor) => valor + 1)
    setSelecionada(null)
  }

  function reiniciar() {
    setIndice(0)
    setSelecionada(null)
    setAcertos(0)
    setPontos(0)
    setFinalizado(false)
  }

  if (finalizado) {
    return (
      <div className="mini-game-card">
        <div className="mini-game-result">
          <span>{dados.icone}</span>

          <h3>Resultado final</h3>

          <p>
            {perfil.apelido}, você acertou <strong>{acertos}</strong> de{' '}
            <strong>{dados.perguntas.length}</strong> perguntas.
          </p>

          <strong className="mini-game-score">{pontos} pontos</strong>

          <p>{mensagemResultadoQuiz(acertos, dados.perguntas.length)}</p>

          <div className="mini-game-actions">
            <button type="button" onClick={reiniciar}>
              Jogar novamente
            </button>

            <Link to="/doar-agora">Quero ajudar</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mini-game-card">
      <div className="mini-game-top">
        <div>
          <span className="games-kicker">{dados.tipo}</span>
          <h3>{dados.titulo}</h3>
          <p>{dados.descricao}</p>
        </div>

        <div className="mini-game-progress">
          {indice + 1}/{dados.perguntas.length}
        </div>
      </div>

      <div className="quiz-question-box">
        <strong>{perguntaAtual.pergunta}</strong>

        <div className="quiz-options">
          {perguntaAtual.opcoes.map((opcao, opcaoIndex) => {
            const correta = opcaoIndex === perguntaAtual.correta
            const marcada = opcaoIndex === selecionada

            let classe = 'quiz-option'

            if (respondeu && correta) classe += ' correct'
            if (respondeu && marcada && !correta) classe += ' wrong'

            return (
              <button
                key={opcao}
                type="button"
                className={classe}
                onClick={() => responder(opcaoIndex)}
              >
                {opcao}
              </button>
            )
          })}
        </div>

        {respondeu && (
          <div className="quiz-feedback">
            <strong>
              {selecionada === perguntaAtual.correta
                ? 'Resposta correta!'
                : 'Quase! Veja a explicação:'}
            </strong>

            <p>{perguntaAtual.explicacao}</p>

            <button type="button" onClick={proximaPergunta}>
              {indice + 1 >= dados.perguntas.length
                ? 'Ver resultado'
                : 'Próxima pergunta'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function PerfilDoadorGame({ perfil }) {
  const [indice, setIndice] = useState(0)
  const [pontos, setPontos] = useState(0)
  const [finalizado, setFinalizado] = useState(false)

  const perguntaAtual = perguntasPerfilDoador[indice]

  function responder(opcao) {
    const novoTotal = pontos + opcao.pontos

    setPontos(novoTotal)

    if (indice + 1 >= perguntasPerfilDoador.length) {
      setFinalizado(true)
      return
    }

    setIndice((valor) => valor + 1)
  }

  function reiniciar() {
    setIndice(0)
    setPontos(0)
    setFinalizado(false)
  }

  if (finalizado) {
    const resultado = obterResultadoPerfil(pontos)

    return (
      <div className="mini-game-card">
        <div className="mini-game-result">
          <span>{resultado.icone}</span>

          <h3>{resultado.titulo}</h3>

          <p>
            {perfil.apelido}, seu perfil mostra uma conexão com ações de
            cuidado, generosidade e transformação social.
          </p>

          <strong className="mini-game-score">{pontos}% solidário</strong>

          <p>{resultado.descricao}</p>

          <div className="mini-game-actions">
            <button type="button" onClick={reiniciar}>
              Refazer perfil
            </button>

            <Link to="/doar-agora">Fazer uma doação</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mini-game-card">
      <div className="mini-game-top">
        <div>
          <span className="games-kicker">Perfil doador</span>
          <h3>Descubra seu perfil solidário</h3>
          <p>
            Responda com sinceridade. Não existe resposta errada, apenas
            formas diferentes de ajudar.
          </p>
        </div>

        <div className="mini-game-progress">
          {indice + 1}/{perguntasPerfilDoador.length}
        </div>
      </div>

      <div className="quiz-question-box">
        <strong>{perguntaAtual.pergunta}</strong>

        <div className="quiz-options">
          {perguntaAtual.opcoes.map((opcao) => (
            <button
              key={opcao.texto}
              type="button"
              className="quiz-option"
              onClick={() => responder(opcao)}
            >
              {opcao.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MemoriaSolidariaGame({ perfil }) {
  const [cartas, setCartas] = useState([])
  const [selecionadas, setSelecionadas] = useState([])
  const [movimentos, setMovimentos] = useState(0)

  useEffect(() => {
    setCartas(criarCartasMemoria())
    setSelecionadas([])
    setMovimentos(0)
  }, [])

  const finalizado = cartas.length > 0 && cartas.every((carta) => carta.encontrada)

  function clicarCarta(carta) {
    if (carta.virada || carta.encontrada || selecionadas.length === 2) return

    const novasCartas = cartas.map((item) =>
      item.uid === carta.uid ? { ...item, virada: true } : item
    )

    const novasSelecionadas = [...selecionadas, carta]

    setCartas(novasCartas)
    setSelecionadas(novasSelecionadas)

    if (novasSelecionadas.length === 2) {
      setMovimentos((valor) => valor + 1)

      const [primeira, segunda] = novasSelecionadas
      const acertou = primeira.id === segunda.id

      setTimeout(() => {
        setCartas((lista) =>
          lista.map((item) => {
            if (item.id !== primeira.id && item.id !== segunda.id) return item

            if (acertou) {
              return { ...item, encontrada: true, virada: true }
            }

            if (item.uid === primeira.uid || item.uid === segunda.uid) {
              return { ...item, virada: false }
            }

            return item
          })
        )

        setSelecionadas([])
      }, 650)
    }
  }

  function reiniciar() {
    setCartas(criarCartasMemoria())
    setSelecionadas([])
    setMovimentos(0)
  }

  return (
    <div className="mini-game-card">
      <div className="mini-game-top">
        <div>
          <span className="games-kicker">Memória</span>
          <h3>Memória Solidária</h3>
          <p>
            {perfil.apelido}, encontre os pares de valores e ações solidárias.
          </p>
        </div>

        <div className="mini-game-progress">
          {movimentos} jogadas
        </div>
      </div>

      <div className="memory-grid">
        {cartas.map((carta) => (
          <button
            key={carta.uid}
            type="button"
            className={
              carta.virada || carta.encontrada
                ? 'memory-card flipped'
                : 'memory-card'
            }
            onClick={() => clicarCarta(carta)}
          >
            <span>{carta.virada || carta.encontrada ? carta.icone : '❔'}</span>
            <small>{carta.virada || carta.encontrada ? carta.nome : 'Virar'}</small>
          </button>
        ))}
      </div>

      {finalizado && (
        <div className="mini-game-result compact">
          <h3>Parabéns!</h3>
          <p>Você encontrou todos os pares em {movimentos} jogadas.</p>

          <button type="button" onClick={reiniciar}>
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  )
}

function CacaPalavrasGame({ perfil }) {
  const palavras = ['AMOR', 'DOAR', 'CUIDADO', 'PAZ', 'LAR', 'EDUCAR']
  const [encontradas, setEncontradas] = useState([])

  const finalizado = encontradas.length === palavras.length

  function marcarPalavra(palavra) {
    if (encontradas.includes(palavra)) return
    setEncontradas((lista) => [...lista, palavra])
  }

  function reiniciar() {
    setEncontradas([])
  }

  return (
    <div className="mini-game-card">
      <div className="mini-game-top">
        <div>
          <span className="games-kicker">Caça-palavras</span>
          <h3>Caça-palavras do Bem</h3>
          <p>
            {perfil.apelido}, encontre no quadro as palavras de solidariedade
            e marque cada uma quando localizar.
          </p>
        </div>

        <div className="mini-game-progress">
          {encontradas.length}/{palavras.length}
        </div>
      </div>

      <div className="word-game-layout">
        <div className="word-board">
          {gradeCacaPalavras.map((linha, linhaIndex) => (
            <div key={`linha-${linhaIndex}`} className="word-row">
              {linha.split('').map((letra, colunaIndex) => (
                <span key={`${linhaIndex}-${colunaIndex}`}>
                  {letra}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="word-list">
          {palavras.map((palavra) => (
            <button
              key={palavra}
              type="button"
              className={encontradas.includes(palavra) ? 'found' : ''}
              onClick={() => marcarPalavra(palavra)}
            >
              {encontradas.includes(palavra) ? '✓ ' : ''}
              {palavra}
            </button>
          ))}
        </div>
      </div>

      {finalizado && (
        <div className="mini-game-result compact">
          <h3>Você encontrou todas!</h3>

          <p>
            Essas palavras representam valores importantes para uma comunidade
            mais acolhedora.
          </p>

          <button type="button" onClick={reiniciar}>
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  )
}

function criarCartasMemoria() {
  const pares = [
    { id: 'amor', icone: '💛', nome: 'Amor' },
    { id: 'doacao', icone: '🎁', nome: 'Doação' },
    { id: 'cuidado', icone: '🤝', nome: 'Cuidado' },
    { id: 'educacao', icone: '📚', nome: 'Educação' },
    { id: 'lar', icone: '🏠', nome: 'Lar' },
    { id: 'paz', icone: '🕊️', nome: 'Paz' }
  ]

  return [...pares, ...pares]
    .map((carta, index) => ({
      ...carta,
      uid: `${carta.id}-${index}-${Math.random()}`,
      virada: false,
      encontrada: false
    }))
    .sort(() => Math.random() - 0.5)
}

function mensagemResultadoQuiz(acertos, total) {
  const percentual = (acertos / total) * 100

  if (percentual >= 80) {
    return 'Excelente! Você demonstrou ótimo conhecimento sobre solidariedade, cidadania e cuidado.'
  }

  if (percentual >= 50) {
    return 'Muito bom! Você já sabe bastante e pode continuar aprendendo com os jogos.'
  }

  return 'Você começou sua jornada! Continue jogando para aprender mais sobre valores e solidariedade.'
}

function obterResultadoPerfil(pontos) {
  if (pontos >= 90) {
    return {
      icone: '🌟',
      titulo: 'Doador Embaixador',
      descricao:
        'Você tem perfil de quem gosta de se envolver, divulgar causas e mobilizar outras pessoas.'
    }
  }

  if (pontos >= 75) {
    return {
      icone: '💛',
      titulo: 'Doador Solidário',
      descricao:
        'Você demonstra sensibilidade social e vontade de contribuir de forma constante.'
    }
  }

  if (pontos >= 55) {
    return {
      icone: '🤝',
      titulo: 'Apoiador do Bem',
      descricao:
        'Você gosta de ajudar quando entende a necessidade e vê uma forma clara de participar.'
    }
  }

  return {
    icone: '🌱',
    titulo: 'Doador em Descoberta',
    descricao:
      'Você está começando a conhecer formas de contribuir e pode se aproximar aos poucos da causa.'
  }
}

const perguntasPerfilDoador = [
  {
    pergunta: 'Quando você conhece uma instituição social, o que mais te motiva a ajudar?',
    opcoes: [
      { texto: 'Ver transparência e prestação de contas', pontos: 25 },
      { texto: 'Conhecer histórias de transformação', pontos: 20 },
      { texto: 'Saber que qualquer valor já ajuda', pontos: 15 },
      { texto: 'Participar de campanhas e eventos', pontos: 25 }
    ]
  },
  {
    pergunta: 'Qual forma de contribuição combina mais com você?',
    opcoes: [
      { texto: 'Doação financeira mensal', pontos: 25 },
      { texto: 'Doação pontual quando posso', pontos: 18 },
      { texto: 'Voluntariado e divulgação', pontos: 25 },
      { texto: 'Doação de itens e alimentos', pontos: 20 }
    ]
  },
  {
    pergunta: 'O que você considera mais importante em um projeto social?',
    opcoes: [
      { texto: 'Cuidado com as pessoas atendidas', pontos: 25 },
      { texto: 'Organização e responsabilidade', pontos: 20 },
      { texto: 'Educação e desenvolvimento', pontos: 25 },
      { texto: 'Acolhimento e proteção', pontos: 25 }
    ]
  },
  {
    pergunta: 'Se você pudesse convidar alguém para ajudar, como faria?',
    opcoes: [
      { texto: 'Compartilharia nas redes sociais', pontos: 20 },
      { texto: 'Chamaria amigos e familiares', pontos: 25 },
      { texto: 'Explicaria a importância da causa', pontos: 25 },
      { texto: 'Participaria de um evento solidário', pontos: 22 }
    ]
  }
]

const dadosJogosPerguntas = {
  'show-solidariedade': {
    tipo: 'Quiz de pontos',
    icone: '🏆',
    titulo: 'Show da Solidariedade',
    descricao:
      'Responda perguntas e acumule pontos aprendendo sobre solidariedade.',
    perguntas: [
      {
        pergunta: 'Qual atitude representa solidariedade no dia a dia?',
        opcoes: [
          'Ajudar apenas quando há recompensa',
          'Compartilhar tempo, atenção ou recursos com quem precisa',
          'Ignorar problemas da comunidade',
          'Pensar somente nos próprios interesses'
        ],
        correta: 1,
        pontos: 100,
        explicacao:
          'Solidariedade envolve agir em favor do outro e da comunidade, mesmo com pequenas atitudes.'
      },
      {
        pergunta: 'Por que a prestação de contas é importante em uma instituição?',
        opcoes: [
          'Para mostrar transparência no uso dos recursos',
          'Para esconder informações',
          'Para dificultar a doação',
          'Para reduzir a confiança'
        ],
        correta: 0,
        pontos: 100,
        explicacao:
          'A prestação de contas aumenta a confiança e mostra como as doações são utilizadas.'
      },
      {
        pergunta: 'Uma doação recorrente ajuda porque:',
        opcoes: [
          'Não muda nada para a instituição',
          'Permite planejamento financeiro e continuidade dos projetos',
          'Só serve para grandes empresas',
          'Impede outras formas de ajuda'
        ],
        correta: 1,
        pontos: 100,
        explicacao:
          'Doações recorrentes ajudam a instituição a planejar melhor suas ações ao longo do tempo.'
      },
      {
        pergunta: 'Qual dessas ações também pode ser voluntariado?',
        opcoes: [
          'Divulgar uma campanha séria',
          'Espalhar informação falsa',
          'Desestimular outras pessoas',
          'Ignorar pedidos de ajuda'
        ],
        correta: 0,
        pontos: 100,
        explicacao:
          'Divulgar campanhas confiáveis também é uma forma de apoiar uma causa.'
      }
    ]
  },
  'quiz-educativo': {
    tipo: 'Educação e cidadania',
    icone: '💡',
    titulo: 'Quiz Educativo',
    descricao:
      'Teste seus conhecimentos sobre valores, cidadania e cuidado social.',
    perguntas: [
      {
        pergunta: 'O que significa cidadania?',
        opcoes: [
          'Ter direitos e deveres na sociedade',
          'Fazer apenas o que quiser',
          'Não participar da comunidade',
          'Evitar responsabilidades'
        ],
        correta: 0,
        pontos: 80,
        explicacao:
          'Cidadania envolve direitos, deveres, participação e responsabilidade social.'
      },
      {
        pergunta: 'Qual valor está ligado ao respeito pelas diferenças?',
        opcoes: ['Intolerância', 'Empatia', 'Indiferença', 'Preconceito'],
        correta: 1,
        pontos: 80,
        explicacao:
          'Empatia é a capacidade de tentar compreender o outro com respeito.'
      },
      {
        pergunta: 'Educação social ajuda porque:',
        opcoes: [
          'Fortalece autonomia e desenvolvimento',
          'Não muda a realidade',
          'Serve apenas para provas',
          'Afasta as pessoas'
        ],
        correta: 0,
        pontos: 80,
        explicacao:
          'A educação contribui para autonomia, consciência e melhores oportunidades.'
      },
      {
        pergunta: 'Uma comunidade acolhedora é aquela que:',
        opcoes: [
          'Cuida, respeita e apoia seus membros',
          'Exclui quem precisa',
          'Não escuta ninguém',
          'Evita cooperação'
        ],
        correta: 0,
        pontos: 80,
        explicacao:
          'Acolhimento envolve cuidado, respeito, escuta e apoio.'
      }
    ]
  },
  'missao-voluntario': {
    tipo: 'Missão',
    icone: '🙌',
    titulo: 'Missão Voluntário',
    descricao:
      'Tome decisões e veja como pequenas ações podem gerar impacto positivo.',
    perguntas: [
      {
        pergunta: 'Você quer ajudar, mas não tem dinheiro no momento. O que pode fazer?',
        opcoes: [
          'Nada, só dinheiro ajuda',
          'Divulgar campanhas confiáveis e incentivar outras pessoas',
          'Criticar quem ajuda',
          'Ignorar a causa'
        ],
        correta: 1,
        pontos: 90,
        explicacao:
          'Voluntariado também pode ser divulgação, participação, tempo, escuta e apoio.'
      },
      {
        pergunta: 'Antes de divulgar uma campanha, é importante:',
        opcoes: [
          'Verificar se a instituição é real e confiável',
          'Compartilhar sem ler',
          'Inventar informações',
          'Usar qualquer imagem'
        ],
        correta: 0,
        pontos: 90,
        explicacao:
          'Verificar a origem protege a instituição, os doadores e as pessoas atendidas.'
      },
      {
        pergunta: 'Uma boa ação voluntária deve ter:',
        opcoes: [
          'Respeito e responsabilidade',
          'Pressa e desorganização',
          'Exposição sem autorização',
          'Falta de compromisso'
        ],
        correta: 0,
        pontos: 90,
        explicacao:
          'Voluntariado exige respeito, compromisso e cuidado com as pessoas.'
      },
      {
        pergunta: 'Qual é uma forma simples de apoiar uma instituição?',
        opcoes: [
          'Participar de eventos solidários',
          'Ignorar campanhas',
          'Desinformar pessoas',
          'Desvalorizar o trabalho social'
        ],
        correta: 0,
        pontos: 90,
        explicacao:
          'Eventos solidários aproximam a comunidade e fortalecem o trabalho social.'
      }
    ]
  }
}

const gradeCacaPalavras = [
  'AMORXXPAZX',
  'QWECUIDADO',
  'LARXXTYYUZ',
  'DOARXXKLMN',
  'EDUCARXOPA',
  'ZXCVBNMASQ',
  'PAZXAMORQQ',
  'CUIDADOXXX',
  'LARDOARXXX',
  'EDUCARYYYY'
]

export default JogosDiversao