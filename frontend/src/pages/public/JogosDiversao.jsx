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
  limparRankingJogos,
  listarRankingJogos
} from '../../services/rankingJogosService'

/*
  PÁGINA: JOGUE E DIVIRTA-SE

  Ajuste desta versão:
  - Remove a abertura do jogo antigo AventuraBlocos dentro desta página.
  - O botão "Jogar agora" da Aventura dos Blocos agora navega para:
    /jogos/aventura-blocos
  - Isso garante que sempre será aberta a versão nova do jogo 3D.
  - Mantém o perfil local do jogador.
  - Mantém o ranking local exibido na página.
*/

function JogosDiversao() {
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [apelido, setApelido] = useState('')
  const [estiloAvatar, setEstiloAvatar] = useState('adventurer')
  const [avatarSeed, setAvatarSeed] = useState(gerarSeedAleatoria())
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [rankingAventura, setRankingAventura] = useState([])

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
      status: 'em-breve'
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
      status: 'em-breve'
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
      status: 'em-breve'
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
      status: 'em-breve'
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
      status: 'em-breve'
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
      status: 'em-breve'
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
  }

  /*
    Abre o jogo selecionado.

    Importante:
    - Aventura dos Blocos agora vai para a rota nova.
    - Não renderizamos mais o componente antigo AventuraBlocos aqui.
  */
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

    if (jogo.status !== 'ativo') {
      alert('Este jogo será ativado em uma próxima etapa.')
      return
    }

    if (jogo.id === 'aventura-blocos') {
      navigate('/jogos/aventura-blocos')
    }
  }

  function apagarRankingAventura() {
    const confirmar = confirm('Deseja limpar o ranking local deste jogo?')

    if (!confirmar) return

    const rankingLimpo = limparRankingJogos('aventura-blocos')
    setRankingAventura(rankingLimpo)
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

            <h2>
              Monte seu perfil para jogar
            </h2>

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

      <section className="games-ranking-section">
        <div className="games-ranking-header">
          <div>
            <span className="games-kicker">Ranking local</span>

            <h2>
              Ranking da Aventura dos Blocos
            </h2>

            <p>
              Este ranking fica salvo no navegador. Depois podemos transformar
              em ranking geral online com banco de dados.
            </p>
          </div>

          {rankingAventura.length > 0 && (
            <button type="button" onClick={apagarRankingAventura}>
              Limpar ranking
            </button>
          )}
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
                <div className="ranking-position">
                  {index + 1}
                </div>

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

          <h2>
            Descubra seu perfil de doador
          </h2>

          <p>
            Em breve, você responderá 10 perguntas rápidas e verá sua
            compatibilidade com a causa do Lar Batista.
          </p>
        </div>

        <div className="games-percent-preview">
          <strong>87%</strong>
          <span>Doador Solidário</span>
        </div>

        <Link to="/doar-agora">
          Ir para Doação
        </Link>
      </section>
    </main>
  )
}

function GameCard({ jogo, destaque = false, perfilCriado, onAbrir }) {
  const jogoAtivo = jogo.status === 'ativo'

  return (
    <article className={destaque ? 'game-card featured' : 'game-card'}>
      <div className="game-card-cover">
        <span className="game-card-icon">
          {jogo.icone}
        </span>

        <small>
          {jogo.pontos}
        </small>
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

export default JogosDiversao