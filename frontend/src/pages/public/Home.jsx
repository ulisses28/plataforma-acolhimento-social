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

const INSTAGRAM_URL =
  'https://www.instagram.com/larbatistaalbertinemeador?igsh=aXludWIycTE0amlw'

const FACEBOOK_URL =
  'https://www.facebook.com/larbatistaam'

function Home() {
  const [noticias, setNoticias] = useState([])
  const [mensagemAberta, setMensagemAberta] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [perfilUsuario, setPerfilUsuario] = useState(null)

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
    setPerfilUsuario(obterUsuarioLogado())
  }, [])

  /*
    Filtra apenas notícias publicadas.

    Mantemos essa lógica para evitar exibir rascunhos ou notícias em revisão
    na página inicial.
  */
  const noticiasPublicadas = noticias.filter(
    (item) =>
      String(item.status || '')
        .trim()
        .toLowerCase() === 'publicado'
  )

  /*
    Notícia usada como mensagem do dia.

    O admin pode escolher:
    - Mensagem do Dia
    - Ambos
  */
  const noticiaDestaque =
    noticiasPublicadas.find(
      (item) =>
        item.areaPublicacao === 'Mensagem do Dia' ||
        item.areaPublicacao === 'Ambos'
    ) || null

  /*
    Notícias exibidas na Home.

    O admin pode escolher:
    - Últimas Notícias
    - Ambos
  */
  const noticiasHome = noticiasPublicadas.filter(
    (item) =>
      item.areaPublicacao === 'Últimas Notícias' ||
      item.areaPublicacao === 'Ambos'
  )

  const textoMensagem =
    noticiaDestaque?.conteudo?.replace(/<[^>]+>/g, '') ||
    noticiaDestaque?.resumo ||
    'E todos os teus filhos serão ensinados do Senhor; e a paz de teus filhos será em grande abundância.'

  const textoCurto =
    textoMensagem.length > 300 && !mensagemAberta
      ? `${textoMensagem.slice(0, 300)}...`
      : textoMensagem

  const quickLinks = [
    {
      icon: '👥',
      title: 'Nossos Projetos',
      to: '/projetos'
    },
    {
      icon: '♡',
      title: 'Como Ajudar',
      to: '/voluntario'
    },
    {
      icon: '📄',
      title: 'Prestação de Contas',
      to: '/transparencia'
    },
    {
      icon: '📰',
      title: 'Notícias',
      to: '/noticias'
    },
    {
      icon: '🖼️',
      title: 'Galeria de Fotos',
      to: '/projetos'
    },
    {
      icon: '💬',
      title: 'Fale Conosco',
      href: 'mailto:visitas@larbatista.org.br'
    },
    {
      icon: '🎮',
      title: 'Jogue e Divirta-se',
      to: '/jogos-diversao'
    }
  ]

  const projetos = [
    {
      image: quemSomos,
      title: 'Acolhimento Institucional',
      text: 'Casa, cuidado e proteção para crianças e adolescentes em situação de vulnerabilidade.',
      link: '/quem-somos'
    },
    {
      image: nossosProjetosImg,
      title: 'Educação e Apoio Escolar',
      text: 'Reforço escolar, formação e incentivo para um futuro com mais oportunidades.',
      link: '/projetos'
    },
    {
      image: doeAgoraImg,
      title: 'Assistência e Bem-estar',
      text: 'Alimentação, saúde, cuidado diário e apoio integral ao desenvolvimento humano.',
      link: '/doar-agora'
    },
    {
      image: transparenciaImg,
      title: 'Transparência e Governança',
      text: 'Relatórios, prestação de contas e documentos públicos da instituição.',
      link: '/transparencia'
    }
  ]

  const noticiasFallback = [
    {
      id: 'fallback-1',
      image: quemSomos,
      date: '06 de junho de 2025',
      title: 'Festa das Cores leva alegria e esperança às crianças',
      text: 'Um dia especial repleto de brincadeiras, sorrisos e momentos inesquecíveis.',
      link: '/noticias'
    },
    {
      id: 'fallback-2',
      image: doeAgoraImg,
      date: '02 de junho de 2025',
      title: 'Campanha do Agasalho 2025 já começou',
      text: 'Doe amor, doe calor. Sua doação pode transformar o inverno de alguém.',
      link: '/doar-agora'
    },
    {
      id: 'fallback-3',
      image: nossosProjetosImg,
      date: '28 de maio de 2025',
      title: 'Voluntariado que transforma: seja parte dessa missão',
      text: 'Conheça as formas de participar e fazer a diferença na vida de quem acolhemos.',
      link: '/voluntario'
    },
    {
      id: 'fallback-4',
      image: heroImg,
      date: '20 de maio de 2025',
      title: 'Novo espaço para mais acolhimento e cuidado',
      text: 'Estamos ampliando nossa estrutura para acolher ainda mais vidas.',
      link: '/quem-somos'
    }
  ]

  const noticiasCards =
    noticiasHome.length > 0
      ? noticiasHome.slice(0, 4).map((item) => ({
          id: item._id || item.id,
          image: obterMidiaPrincipal(item) || quemSomos,
          date: formatarDataNoticia(item),
          title: item.titulo,
          text:
            item.resumo ||
            item.descricao ||
            item.conteudo?.replace(/<[^>]+>/g, '').slice(0, 140) ||
            'Leia a publicação completa.',
          categoria: item.categoria,
          link: `/noticias/${item._id || item.id}`
        }))
      : noticiasFallback

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
              aria-label="Abrir menu"
            >
              ☰
            </button>

            <nav className={`home-menu ${menuAberto ? 'home-menu-open' : ''}`}>
              <Link to="/" onClick={() => setMenuAberto(false)}>
                Home
              </Link>

              <Link to="/quem-somos" onClick={() => setMenuAberto(false)}>
                Quem Somos
              </Link>

              <Link to="/projetos" onClick={() => setMenuAberto(false)}>
                Projetos
              </Link>

              <Link to="/transparencia" onClick={() => setMenuAberto(false)}>
                Transparência
              </Link>

              <Link to="/voluntario" onClick={() => setMenuAberto(false)}>
                Seja um Voluntário
              </Link>

              <Link to="/parceiros" onClick={() => setMenuAberto(false)}>
                Parceiros
              </Link>

              <Link to="/governanca-institucional" onClick={() => setMenuAberto(false)}>
                Governança
              </Link>

              <Link to="/tutorial" onClick={() => setMenuAberto(false)}>
                Tutorial
              </Link>

              <Link
                to={perfilUsuario ? '/doador/painel' : '/doador/login'}
                className="login-top-mobile"
                onClick={() => setMenuAberto(false)}
              >
                Painel do Doador
              </Link>
            </nav>

            <Link
              to={perfilUsuario ? '/doador/painel' : '/doador/login'}
              className="login-top"
            >
              Painel do Doador
            </Link>
          </header>

          <div className="hero-content">
            <h1>
              Transformando vidas,
              <span>construindo um futuro melhor</span>
            </h1>

            <p>
              O Lar Batista acolhe, transforma e devolve a esperança para
              crianças e jovens em situação de vulnerabilidade social.
            </p>

            <div className="hero-buttons">
              <Link to="/projetos" className="btn-yellow">
                Conheça nossos projetos
              </Link>

              <Link to="/voluntario" className="btn-outline">
                Como ajudar
              </Link>
            </div>
          </div>

          <div className="hero-dots" aria-hidden="true">
            <span className="dot-blue" />
            <span className="dot-green" />
            <span className="dot-yellow" />
          </div>
        </div>
      </section>

      <section className="quick-actions-section">
        <div className="quick-actions-card">
          {quickLinks.map((item) => (
            <QuickAction
              key={item.title}
              icon={item.icon}
              title={item.title}
              to={item.to}
              href={item.href}
            />
          ))}
        </div>
      </section>

      <section className="news-feature-section">
        <div className="section-header compact">
          <h2>Notícias</h2>

          <Link to="/noticias">
            Ver todas →
          </Link>
        </div>

        <HeroNewsCarousel
          noticias={noticiasHome.slice(0, 5)}
          fallbackImage={quemSomos}
        />
      </section>

      <section className="latest-news-section">
        <div className="section-header">
          <h2>Últimas notícias</h2>

          <Link to="/noticias">
            Ver todas as notícias →
          </Link>
        </div>

        <div className="news-grid">
          {noticiasCards.map((item) => (
            <NewsCard
              key={item.id || item.title}
              id={item.id}
              image={item.image}
              date={item.date}
              title={item.title}
              text={item.text}
              categoria={item.categoria}
              link={item.link}
            />
          ))}
        </div>
      </section>

      <section className="message-day-section">
        <div className="message-day-content">
          <div className="message-day-title">
            <h2>Mensagem do dia</h2>
          </div>

          <div className="message-day-quote">
            <span>“</span>

            <div>
              <p>
                {textoCurto}
              </p>

              <small>
                {noticiaDestaque?.titulo || 'Isaías 54:13'}
              </small>

              {textoMensagem.length > 300 && (
                <button
                  type="button"
                  className="message-read-button"
                  onClick={() => setMensagemAberta(!mensagemAberta)}
                >
                  {mensagemAberta ? 'Mostrar menos ↑' : 'Ler mais →'}
                </button>
              )}
            </div>
          </div>

          <div className="message-day-icon" aria-hidden="true">
            📖
          </div>
        </div>
      </section>

      <section className="projects-showcase-section">
        <div className="section-header">
          <h2>Nossos projetos</h2>

          <Link to="/projetos">
            Conheça todos os projetos →
          </Link>
        </div>

        <div className="projects-showcase-grid">
          {projetos.map((item) => (
            <ProjectCard
              key={item.title}
              image={item.image}
              title={item.title}
              text={item.text}
              link={item.link}
            />
          ))}
        </div>
      </section>

      <section className="help-banner-section">
        <div className="help-banner-card">
          <div className="help-banner-main">
            <span>♡</span>

            <div>
              <h2>Como você pode ajudar</h2>

              <p>
                Sua doação, seu tempo ou sua parceria ajudam a construir um
                futuro melhor para muitas crianças e adolescentes.
              </p>
            </div>
          </div>

          <div className="help-banner-actions">
            <Link to="/doar-agora">
              Faça uma doação
            </Link>

            <Link to="/voluntario">
              Seja voluntário
            </Link>

            <Link to="/necessidades">
              Doe roupas e alimentos
            </Link>

            <Link to="/parceiros">
              Empresas parceiras
            </Link>
          </div>
        </div>
      </section>

      <section className="impact-wide-section">
        <div className="impact-wide-image">
          <img
            src={quemSomos}
            alt="Acolhimento e cuidado"
          />
        </div>

        <div className="impact-wide-content">
          <span className="section-kicker">
            Impacto social
          </span>

          <h2>
            Nosso impacto em números
          </h2>

          <p>
            Cada número representa cuidado, presença, compromisso e esperança
            renovada na vida de crianças, adolescentes, famílias e comunidades.
          </p>

          <div className="numbers-section">
            <div>
              <strong>350+</strong>
              <span>Crianças e jovens acolhidos</span>
            </div>

            <div>
              <strong>40+</strong>
              <span>Profissionais dedicados</span>
            </div>

            <div>
              <strong>20+</strong>
              <span>Projetos em atividade</span>
            </div>

            <div>
              <strong>15+</strong>
              <span>Anos de história e transformação</span>
            </div>
          </div>
        </div>

        <aside className="volunteer-card">
          <h3>Seja voluntário</h3>

          <p>
            Doe seu tempo, talentos e amor. Juntos, podemos transformar muitas vidas.
          </p>

          <Link to="/voluntario">
            Quero ser voluntário →
          </Link>
        </aside>
      </section>

      <section className="social-section">
        <div className="section-header">
          <h2>Acompanhe nossas redes</h2>

          <span>
            Siga-nos nas redes sociais →
          </span>
        </div>

        <div className="social-grid">
          <SocialCard
            type="Instagram"
            handle="@larbatistaalbertinemeador"
            href={INSTAGRAM_URL}
            imageOne={quemSomos}
            imageTwo={nossosProjetosImg}
            imageThree={doeAgoraImg}
            button="Ver no Instagram →"
          />

          <SocialCard
            type="Facebook"
            handle="/larbatistaam"
            href={FACEBOOK_URL}
            imageOne={heroImg}
            imageTwo={transparenciaImg}
            imageThree={quemSomos}
            button="Ver no Facebook →"
          />
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <div className="footer-logo-box">
            <img src={logoLar} alt="Logo Lar Batista" />
          </div>

          <p>
            O Lar Batista acolhe, transforma e devolve a esperança para crianças
            e jovens em situação de vulnerabilidade social.
          </p>
        </div>

        <div>
          <h4>Links rápidos</h4>
          <Link to="/">Início</Link>
          <Link to="/quem-somos">Sobre nós</Link>
          <Link to="/projetos">Projetos</Link>
          <Link to="/transparencia">Transparência</Link>
          <Link to="/noticias">Notícias</Link>
        </div>

        <div>
          <h4>Como ajudar</h4>
          <Link to="/doar-agora">Doação</Link>
          <Link to="/voluntario">Voluntariado</Link>
          <Link to="/necessidades">Necessidades atuais</Link>
          <Link to="/parceiros">Empresas parceiras</Link>
          <Link to="/admin/login">Área administrativa</Link>
        </div>

        <div>
          <h4>Fale conosco</h4>
          <p>(27) 3328-5165</p>
          <p>visitas@larbatista.org.br</p>
          <p>Rua Santos Dumont, 120, Laranjeiras, Serra - ES</p>
          <p>CEP: 29.165-048</p>
        </div>

        <div>
          <h4>Siga-nos</h4>

          <div className="footer-social-links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>

            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </div>
      </footer>

      <Link to="/doar-agora" className="float-donate">
        ❤
      </Link>

      <a href="#top" className="float-top">
        ↑
      </a>
    </main>
  )
}

function QuickAction({ icon, title, to, href }) {
  const content = (
    <>
      <span>{icon}</span>
      <strong>{title}</strong>
    </>
  )

  if (href) {
    return (
      <a href={href} className="quick-action-item">
        {content}
      </a>
    )
  }

  return (
    <Link to={to} className="quick-action-item">
      {content}
    </Link>
  )
}

function ProjectCard({ image, title, text, link }) {
  return (
    <article className="project-card">
      <img src={image} alt={title} />

      <div>
        <h3>{title}</h3>
        <p>{text}</p>

        <Link to={link}>
          Saiba mais →
        </Link>
      </div>
    </article>
  )
}

function NewsCard({ image, date, title, text, categoria, id, link }) {
  const resumo =
    text?.length > 120
      ? `${text.slice(0, 120)}...`
      : text

  const destino = link || (id ? `/noticias/${id}` : '/noticias')

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
          <Link to={destino} className="news-read-link">
            Leia mais →
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

function SocialCard({
  type,
  handle,
  href,
  imageOne,
  imageTwo,
  imageThree,
  button
}) {
  return (
    <article className="social-card">
      <div className="social-card-header">
        <strong>{type}</strong>
        <span>{handle}</span>
      </div>

      <div className="social-card-images">
        <img src={imageOne} alt={`${type} 1`} />
        <img src={imageTwo} alt={`${type} 2`} />
        <img src={imageThree} alt={`${type} 3`} />
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="social-card-button"
      >
        {button}
      </a>
    </article>
  )
}

function obterMidiaPrincipal(item) {
  return (
    item.imagemUrl ||
    item.midia ||
    item.midias?.[0]?.imagemUrl ||
    item.midias?.[0]?.base64 ||
    ''
  )
}

function formatarDataNoticia(item) {
  if (item.createdAt) {
    return new Date(item.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return item.criadoEm || 'Publicação'
}

/*
  Procura usuário logado sem quebrar caso as chaves mudem.

  Isso permite exibir o botão como perfil quando houver algum dado salvo
  no localStorage por login de doador, usuário ou admin.
*/
function obterUsuarioLogado() {
  if (typeof window === 'undefined') return null

  const chavesPossiveis = [
    'doadorLogado',
    'doador',
    'usuarioLogado',
    'usuario',
    'adminLogado',
    'usuarioAdmin'
  ]

  for (const chave of chavesPossiveis) {
    const valor = localStorage.getItem(chave)

    if (!valor) continue

    try {
      const dados = JSON.parse(valor)

      const nome =
        dados.nome ||
        dados.nomeFantasia ||
        dados.name ||
        dados.email ||
        'Minha conta'

      const isAdmin =
        chave.toLowerCase().includes('admin') ||
        dados.tipo === 'admin' ||
        dados.perfil === 'admin'

      return {
        nome,
        link: isAdmin ? '/admin/dashboard' : '/doador/painel'
      }
    } catch {
      return null
    }
  }

  return null
}

export default Home