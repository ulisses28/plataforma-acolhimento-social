import { Link } from 'react-router-dom'
import './home.css'

import logoLar from '../../assets/logo-lar.jpg'
import heroImg from '../../assets/quemSomos.jpg'
import missao1 from '../../assets/Missao1.jpg'
import missao2 from '../../assets/Missao2.jpg'
import quemSomos from '../../assets/quemSomos.jpg'

function Home() {
  return (
    <main className="home-page" id="top">
      <section
        className="hero-premium"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <header className="home-navbar">
            <Link to="/" className="logo-heart">
              <span className="heart-bg" />
              <img src={logoLar} alt="Lar Batista Albertine Meador" />
            </Link>

            <nav>
              <Link to="/">Home</Link>
              <Link to="/quem-somos">Quem Somos</Link>
              <Link to="/projetos">Projetos</Link>
              <Link to="/transparencia">Transparência</Link>
              <Link to="/voluntario">Seja um Voluntário</Link>
              <Link to="/parceiros">Parceiros</Link>
            </nav>

            <Link to="/login" className="login-top">
              Entrar
            </Link>
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

      <section className="impact-section">
        <h2>Juntos, fazemos a diferença</h2>

        <p>
          Todo apoio recebido se transforma em cuidado, acolhimento,
          alimentação, educação e oportunidades.
        </p>

        <div className="impact-cards">
          {/* Card atualizado: agora leva para a página pública de necessidades */}
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

          <div className="impact-card">
            <div className="icon blue">👥</div>

            <div>
              <h3>Recebemos voluntários</h3>

              <p>
                Pessoas que doam tempo, talento e amor para transformar vidas.
              </p>
            </div>
          </div>

          <div className="impact-card">
            <div className="icon green">🤝</div>

            <div>
              <h3>Apoio institucional</h3>

              <p>
                Empresas e parceiros que fortalecem o impacto social da
                instituição.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="navigation-section">
        <HomeCard
          image={missao1}
          title="Nossos projetos"
          text="Conheça as ações que transformam vidas todos os dias."
          link="/projetos"
          button="Saiba mais"
        />

        <HomeCard
          image={missao2}
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
          image={heroImg}
          title="Como ajudar"
          text="Existem muitas formas de fazer parte dessa missão de amor."
          link="/voluntario"
          button="Fazer parte"
        />
      </section>

      <section className="numbers-section">
        <div>
          <strong>+250</strong>
          <span>Vidas impactadas</span>
        </div>

        <div>
          <strong>+10</strong>
          <span>Anos de história</span>
        </div>

        <div>
          <strong>+50</strong>
          <span>Parceiros</span>
        </div>

        <div>
          <strong>+5</strong>
          <span>Cidades atendidas</span>
        </div>
      </section>

      <section className="news-section">
        <div className="section-header">
          <h2>Últimas notícias</h2>
          <Link to="/projetos">Ver todas →</Link>
        </div>

        <div className="news-grid">
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
            image={missao1}
            date="05 Mai 2025"
            title="Atividades educativas"
            text="Ações que estimulam o aprendizado, a convivência e o desenvolvimento humano."
          />
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

      <Link to="/doar-agora" className="float-donate">
        ❤
      </Link>

      <a href="#top" className="float-top">
        ↑
      </a>
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

function NewsCard({ image, date, title, text }) {
  return (
    <article className="news-card">
      <img src={image} alt={title} />

      <span>{date}</span>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        <Link to="/projetos">Leia mais →</Link>
      </div>
    </article>
  )
}

export default Home