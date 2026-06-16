import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import videosEducativosData from '../../data/videosEducativosData'
import './videos-educativos.css'

/*
  PÁGINA: GALERIA DE VÍDEOS EDUCATIVOS

  Objetivo:
  - Exibir vídeos do YouTube organizados por temas sociais.
  - Manter uma aparência profissional e institucional.
  - Usar dados vindos de src/data/videosEducativosData.js.
  - Manter cabeçalho e rodapé globais do site, sem duplicar layout aqui.

  Observação:
  O cabeçalho e o rodapé aparecem automaticamente porque esta página
  é uma rota pública normal dentro do App.jsx.
*/

function VideosEducativos() {
  const [temaAtivo, setTemaAtivo] = useState('todos')

  /*
    Monta a lista de seções que serão exibidas.

    Se "todos" estiver selecionado, mostra todas as seções.
    Caso contrário, mostra apenas o tema selecionado no menu lateral.
  */
  const secoesFiltradas = useMemo(() => {
    if (temaAtivo === 'todos') {
      return videosEducativosData
    }

    return videosEducativosData.filter((secao) => secao.id === temaAtivo)
  }, [temaAtivo])

  const totalVideos = videosEducativosData.reduce(
    (total, secao) => total + secao.videos.length,
    0
  )

  return (
    <main className="videos-page">
      <section className="videos-hero">
        <div className="videos-hero-content">
          <span className="videos-kicker">
            Galeria educativa
          </span>

          <h1>
            Galeria de Vídeos Educativos
          </h1>

          <p>
            Uma curadoria de conteúdos sobre proteção social, infância,
            acolhimento, direitos humanos e temas fundamentais para uma
            sociedade mais justa, solidária e consciente.
          </p>

          <div className="videos-hero-actions">
            <a href="#videos-lista">
              Explorar vídeos
            </a>

            <Link to="/projetos">
              Conhecer projetos
            </Link>
          </div>
        </div>

        <div className="videos-hero-illustration" aria-hidden="true">
          <span>▶</span>
        </div>
      </section>

      <section className="videos-layout" id="videos-lista">
        <aside className="videos-sidebar">
          <h2>Explorar por tema</h2>

          <button
            type="button"
            className={temaAtivo === 'todos' ? 'video-filter active' : 'video-filter'}
            onClick={() => setTemaAtivo('todos')}
          >
            <span>🎬</span>
            Todos os vídeos
          </button>

          {videosEducativosData.map((secao) => (
            <button
              key={secao.id}
              type="button"
              className={temaAtivo === secao.id ? 'video-filter active' : 'video-filter'}
              onClick={() => setTemaAtivo(secao.id)}
            >
              <span>{secao.icone}</span>
              {secao.titulo}
            </button>
          ))}

          <div className="videos-sidebar-info">
            <strong>Sobre a galeria</strong>

            <p>
              Esta página reúne vídeos públicos do YouTube com finalidade
              educativa, informativa e institucional.
            </p>

            <small>
              {totalVideos} vídeos organizados por tema.
            </small>
          </div>
        </aside>

        <div className="videos-content">
          {secoesFiltradas.map((secao, index) => (
            <section key={secao.id} className="video-section">
              <header className="video-section-header">
                <div className="video-section-title">
                  <span>{secao.icone}</span>

                  <div>
                    <h2>
                      {index + 1}. {secao.titulo}
                    </h2>

                    <p>{secao.descricao}</p>
                  </div>
                </div>

                <span className="video-section-badge">
                  {secao.categoria}
                </span>
              </header>

              <div
                className={
                  secao.videos.length === 1
                    ? 'videos-grid videos-grid-single'
                    : 'videos-grid'
                }
              >
                {secao.videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    categoria={secao.categoria}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="videos-bottom-cta">
        <div>
          <span>♡</span>

          <div>
            <h2>
              Conheça também nossos projetos de acolhimento
            </h2>

            <p>
              Cada ação transforma vidas e fortalece o cuidado com crianças,
              adolescentes e famílias.
            </p>
          </div>
        </div>

        <Link to="/projetos">
          Ver projetos e ações →
        </Link>
      </section>
    </main>
  )
}

/*
  CARD DE VÍDEO

  Recebe um vídeo do arquivo videosEducativosData.js e exibe:
  - vídeo incorporado do YouTube
  - título
  - fonte/canal
  - resumo
  - categoria
  - link para abrir diretamente no YouTube
*/
function VideoCard({ video, categoria }) {
  return (
    <article className="video-card">
      <div className="video-frame">
        <iframe
          src={converterYoutubeParaEmbed(video.url)}
          title={video.titulo}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="video-card-body">
        <span className="video-category">
          {categoria}
        </span>

        <h3>{video.titulo}</h3>

        <p className="video-source">
          Fonte: {video.fonte}
        </p>

        <p className="video-summary">
          {video.resumo}
        </p>

        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
        >
          Abrir no YouTube →
        </a>
      </div>
    </article>
  )
}

/*
  Converte links comuns do YouTube para o formato embed.

  Aceita:
  - https://www.youtube.com/watch?v=ID
  - https://youtu.be/ID
  - https://www.youtube.com/embed/ID
*/
function converterYoutubeParaEmbed(url) {
  if (!url) return ''

  if (url.includes('/embed/')) {
    return url
  }

  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  const resultado = url.match(regex)

  if (!resultado?.[1]) {
    return url
  }

  return `https://www.youtube.com/embed/${resultado[1]}`
}

export default VideosEducativos