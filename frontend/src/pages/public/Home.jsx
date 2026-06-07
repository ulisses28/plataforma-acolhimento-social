import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './home.css'

import logoLar from '../../assets/logo-lar.jpg'
import heroImg from '../../assets/banerHome.png'
import nossosProjetosImg from '../../assets/nossosProjetos1.png'
import transparenciaImg from '../../assets/transparencia1.png'
import quemSomos from '../../assets/quemSomos1.png'
import doeAgoraImg from '../../assets/doeAgora.png'
import HeroNewsCarousel from '../../components/news/HeroNewsCarousel'

import { listarNoticias } from '../../services/noticiasService'

function Home() {
  const [noticias, setNoticias] = useState([])
  const [mensagemAberta, setMensagemAberta] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    async function carregarNoticias() {
      try {
        const dados = await listarNoticias()
        setNoticias(Array.isArray(dados) ? dados : [])
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
        setNoticias([])
      }
    }

    carregarNoticias()
  }, [])

  const noticiasPublicadas = noticias.filter(
  (item) =>
    String(item.status || '')
      .trim()
      .toLowerCase() === 'publicado'
  )

  const noticiaDestaque =
    noticiasPublicadas.find(
      (item) =>
        item.areaPublicacao === 'Mensagem do Dia' ||
        item.areaPublicacao === 'Ambos'
    ) || null

  const noticiasHome = noticiasPublicadas.filter(
    (item) =>
      item.areaPublicacao === 'Últimas Notícias' ||
      item.areaPublicacao === 'Ambos'
  )

  const textoMensagem =
    noticiaDestaque?.conteudo?.replace(/<[^>]+>/g, '') ||
    noticiaDestaque?.resumo ||
    'Pequenas atitudes podem transformar vidas. Cada gesto de cuidado, apoio e solidariedade ajuda a construir um futuro melhor.'

  const textoCurto =
    textoMensagem.length > 360 && !mensagemAberta
      ? `${textoMensagem.slice(0, 360)}...`
      : textoMensagem

  return (
    <main className="home-page" id="top">
      <section
        className="hero-premium"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <header className="home-navbar">
            <Link to="/" className="home-logo-link">
              <img
                src={logoLar}
                alt="Lar Batista Albertine Meador"
                className="home-logo-img"
              />
            </Link>

            <button
              type="button"
              className="home-menu-button"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              ☰
            </button>

            <nav className={`home-menu ${menuAberto ? 'home-menu-open' : ''}`}>
              <Link to="/" onClick={() => setMenuAberto(false)}>Home</Link>
              <Link to="/quem-somos" onClick={() => setMenuAberto(false)}>Quem Somos</Link>
              <Link to="/projetos" onClick={() => setMenuAberto(false)}>Projetos</Link>
              <Link to="/transparencia" onClick={() => setMenuAberto(false)}>Transparência</Link>
              <Link to="/voluntario" onClick={() => setMenuAberto(false)}>Seja um Voluntário</Link>
              <Link to="/parceiros" onClick={() => setMenuAberto(false)}>Parceiros</Link>
              <Link to="/governanca-institucional" onClick={() => setMenuAberto(false)}>Governança</Link>
              <Link to="/tutorial" onClick={() => setMenuAberto(false)}>Tutorial</Link>
              <Link to="/login" className="login-top-mobile" onClick={() => setMenuAberto(false)}>Entrar</Link>
            </nav>

            <Link to="/login" className="login-top">Entrar</Link>
          </header>

          <div className="hero-content">
            <h1>
              Transformando vidas,
              <span> construindo um futuro melhor</span>
            </h1>

            <p>
              O Lar Batista Albertine Meador acolhe, cuida e transforma vidas
              por meio do amor, da fé, da solidariedade e da participação da
              sociedade.
            </p>

            <div className="hero-buttons">
              <Link to="/quem-somos" className="btn-yellow">
                Conheça nossa história
              </Link>

              <Link to="/doar-agora" className="btn-outline">
                Fazer doação
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.messageSection}>
        <div
          style={{
            ...styles.messageCard,
            gridTemplateColumns:
              noticiaDestaque?.midia || noticiaDestaque?.youtubeUrl
                ? '1fr 0.82fr'
                : '1fr'
          }}
        >
          <div style={styles.messageText}>
            <div style={styles.messageTop}>
              <span style={styles.messageTag}>Mensagem do Dia</span>
              <span style={styles.messageIcon}>✨</span>
            </div>

            <h2 style={styles.messageTitle}>
              {noticiaDestaque?.titulo || 'Amor, acolhimento e esperança'}
            </h2>

            <p style={styles.messageParagraph}>{textoCurto}</p>

            {textoMensagem.length > 360 && (
              <button
                type="button"
                style={styles.messageButton}
                onClick={() => setMensagemAberta(!mensagemAberta)}
              >
                {mensagemAberta ? 'Mostrar menos ↑' : 'Ler mais →'}
              </button>
            )}
          </div>

          {(noticiaDestaque?.youtubeUrl || noticiaDestaque?.midia) && (
            <div style={styles.messageMediaBox}>
              {noticiaDestaque?.youtubeUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={converterYoutubeEmbed(noticiaDestaque.youtubeUrl)}
                  title={noticiaDestaque.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={styles.messageIframe}
                />
              ) : noticiaDestaque?.tipoMidia?.startsWith('video') ? (
                <video
                  src={noticiaDestaque.midia}
                  controls
                  style={styles.messageVideo}
                />
              ) : (
                <img
                  src={noticiaDestaque.midia}
                  alt={noticiaDestaque.titulo}
                  style={styles.messageImage}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <section className="impact-section">
        <h2>Juntos, fazemos a diferença</h2>

        <p>
          Todo apoio recebido se transforma em cuidado, acolhimento,
          alimentação, educação e oportunidades.
        </p>

        <div className="impact-cards">
          <Link to="/necessidades" className="impact-card impact-card-link">
            <div className="icon yellow">♡</div>
            <div>
              <h3>Necessidades Atuais</h3>
              <p>
                Veja alimentos, roupas, utensílios e itens prioritários que a
                instituição precisa neste momento.
              </p>
            </div>
          </Link>

          <Link to="/voluntario" className="impact-card impact-card-link">
            <div className="icon blue">👥</div>
            <div>
              <h3>Recebemos voluntários</h3>
              <p>Pessoas que doam tempo, talento e amor para transformar vidas.</p>
            </div>
          </Link>

          <Link to="/parceiros" className="impact-card impact-card-link">
            <div className="icon green">🤝</div>
            <div>
              <h3>Apoio institucional</h3>
              <p>Empresas e parceiros que fortalecem o impacto social.</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="navigation-section">
        <HomeCard
          image={nossosProjetosImg}
          title="Nossos projetos"
          text="Conheça as ações que transformam vidas todos os dias."
          link="/projetos"
          button="Saiba mais"
        />

        <HomeCard
          image={transparenciaImg}
          title="Transparência"
          text="Acesse relatórios, prestação de contas e veja como as doações são utilizadas."
          link="/transparencia"
          button="Acessar"
        />

        <HomeCard
          image={quemSomos}
          title="Quem somos"
          text="Conheça a história, missão, visão e valores da instituição."
          link="/quem-somos"
          button="Conhecer"
        />

        <HomeCard
          image={doeAgoraImg}
          title="Como ajudar"
          text="Existem muitas formas de fazer parte dessa missão de amor."
          link="/voluntario"
          button="Fazer parte"
        />
      </section>

      <section className="numbers-section">
        <div><strong>+70</strong><span>Vidas impactadas por ano</span></div>
        <div><strong>+70</strong><span>Anos de história</span></div>
        <div><strong>+50</strong><span>Parceiros</span></div>
        <div><strong>+5</strong><span>Cidades atendidas</span></div>
      </section>

      <section className="news-section">
        <div className="section-header">
          <h2>Últimas notícias</h2>
          <Link to="/noticias">Ver todas →</Link>
        </div>

      <HeroNewsCarousel noticias={noticiasHome.slice(0, 5)} />

        <div className="news-grid">
          {noticiasHome.length > 0 ? (
            noticiasHome.slice(0, 3).map((item) => (
              <NewsCard
                key={item._id || item.id}
                id={item._id || item.id}
                image={item.midia || quemSomos}
                date={
                  item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('pt-BR')
                    : item.criadoEm || 'Publicação'
                }
                title={item.titulo}
                text={
                  item.resumo ||
                  item.descricao ||
                  item.conteudo?.replace(/<[^>]+>/g, '').slice(0, 140) ||
                  'Leia a publicação completa.'
                }
                categoria={item.categoria}
              />
            ))
          ) : (
            <>
              <NewsCard
                image={quemSomos}
                date="12 Mai 2025"
                title="Ações que acolhem"
                text="Momentos de cuidado, escuta e apoio às pessoas acolhidas pela instituição."
              />

              <NewsCard
                image={heroImg}
                date="10 Mai 2025"
                title="Doações que transformam"
                text="Cada contribuição ajuda a manter o acolhimento e ampliar nosso impacto social."
              />

              <NewsCard
                image={quemSomos}
                date="05 Mai 2025"
                title="Atividades educativas"
                text="Ações que estimulam o aprendizado, a convivência e o desenvolvimento humano."
              />
            </>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <div className="footer-logo-box">
            <img src={logoLar} alt="Logo Lar Batista" />
          </div>

          <p>
            O Lar Batista Albertine Meador é uma instituição cristã sem fins
            lucrativos que acolhe, cuida e transforma vidas com amor, fé e
            solidariedade.
          </p>
        </div>

        <div>
          <h4>Navegação</h4>
          <Link to="/">Home</Link>
          <Link to="/quem-somos">Quem Somos</Link>
          <Link to="/projetos">Projetos</Link>
          <Link to="/transparencia">Transparência</Link>
          <Link to="/voluntario">Seja um Voluntário</Link>
          <Link to="/parceiros">Parceiros</Link>
        </div>

        <div>
          <h4>Institucional</h4>
          <Link to="/quem-somos">Missão, visão e valores</Link>
          <Link to="/transparencia">Prestação de contas</Link>
          <Link to="/doar-agora">Doe agora</Link>
          <Link to="/admin/login">Área administrativa</Link>
        </div>

        <div>
          <h4>Contato</h4>
          <p>(27) 3328-5165</p>
          <p>visitas@larbatista.org.br</p>
          <p>Rua Santos Dumont, 120, Laranjeiras, Serra - ES</p>
          <p>CEP: 29.165-048</p>
        </div>
      </footer>

      <Link to="/doar-agora" className="float-donate">❤</Link>
      <a href="#top" className="float-top">↑</a>
    </main>
  )
}

function HomeCard({ image, title, text, link, button }) {
  return (
    <article className="home-card">
      <img src={image} alt={title} />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        <Link to={link}>{button} →</Link>
      </div>
    </article>
  )
}

function NewsCard({ image, date, title, text, categoria, id }) {
  const resumo =
    text?.length > 115
      ? `${text.slice(0, 115)}...`
      : text

  return (
    <article className="news-card">
      <img src={image} alt={title} />

      <span>{date}</span>

      <div className="news-content">
        <h3>{title}</h3>

        <p className="news-resumo">
          {resumo}
        </p>

        <div className="news-card-links">
          <Link to={`/noticias/${id}`} className="news-read-link">
            Ler mais →
          </Link>

          {(categoria === 'Vagas' || categoria === 'Oportunidade') && (
            <Link to="/vagas" className="news-job-link">
              Enviar currículo →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

function converterYoutubeEmbed(url) {
  if (!url) return ''

  if (url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/')
  }

  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }

  if (url.includes('/shorts/')) {
    const id = url.split('/shorts/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }

  return url
}

const styles = {
  messageSection: {
    background: 'linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)',
    padding: '44px 20px'
  },

  messageCard: {
    maxWidth: '1180px',
    margin: '0 auto',
    display: 'grid',
    gap: '24px',
    alignItems: 'center',
    background:
      'linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)',
    border: '1px solid #dbeafe',
    borderRadius: '24px',
    padding: '26px',
    boxShadow:
      '0 14px 34px rgba(11, 61, 145, 0.10)'
  },

  messageText: {
    position: 'relative'
  },

  messageTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  },

  messageTag: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: '12px'
  },

  messageIcon: {
    fontSize: '22px'
  },

  messageTitle: {
    color: '#0B3D91',
    fontSize: 'clamp(1.7rem, 3vw, 2.5rem)',
    lineHeight: '1.12',
    margin: '0 0 12px'
  },

  messageParagraph: {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: '1.8',
    marginBottom: '16px',
    maxWidth: '720px'
  },

  messageButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  messageMediaBox: {
    background: '#0B3D91',
    borderRadius: '22px',
    padding: '10px',
    minHeight: '270px',
    boxShadow: '0 12px 26px rgba(0,0,0,0.14)'
  },

  messageIframe: {
    width: '100%',
    height: '100%',
    minHeight: '270px',
    border: 'none',
    borderRadius: '16px'
  },

  messageVideo: {
    width: '100%',
    minHeight: '270px',
    maxHeight: '340px',
    objectFit: 'cover',
    borderRadius: '16px'
  },

  messageImage: {
    width: '100%',
    minHeight: '270px',
    maxHeight: '340px',
    objectFit: 'cover',
    borderRadius: '16px'
  }

}

export default Home