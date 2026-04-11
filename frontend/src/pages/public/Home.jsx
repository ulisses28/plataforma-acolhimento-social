import '../../styles/home.css'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Cuidando de vidas com responsabilidade, acolhimento e dignidade</h1>
            <p>
              O Lar Batista Albertine Meador acolhe meninas em situação de
              vulnerabilidade, oferecendo cuidado, amor e oportunidades para um novo futuro.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary">Conheça nosso trabalho</button>
              <button className="btn-secondary">Saiba como colaborar</button>
            </div>
          </div>
        </div>
      </section>

      <section className="indicators">
        <div className="indicator-card">
          <h3>40</h3>
          <p>Meninas atendidas</p>
        </div>
        <div className="indicator-card">
          <h3>55</h3>
          <p>Voluntários</p>
        </div>
        <div className="indicator-card">
          <h3>20</h3>
          <p>Anos de história</p>
        </div>
        <div className="indicator-card">
          <h3>15</h3>
          <p>Parceiros</p>
        </div>
      </section>

      <section className="about-preview">
        <div className="about-text">
          <h2>Quem Somos</h2>
          <p>
            O Lar Batista Albertine Meador acolhe meninas em situação de
            vulnerabilidade social, oferecendo um ambiente seguro e acolhedor.
            Nossa missão é proporcionar cuidado, amor e educação, promovendo
            desenvolvimento e esperança.
          </p>
          <button className="btn-primary">Saiba mais</button>
        </div>

        <div className="needs-card">
          <h2>Necessidades Atuais</h2>
          <p>
            A instituição possui necessidades recorrentes de alimentos,
            produtos de higiene, fraldas, roupas e apoio financeiro para manutenção.
          </p>
          <button className="btn-secondary">Ver necessidades</button>
        </div>
      </section>

      <section className="news-section">
        <h2>Notícias & Eventos</h2>

        <div className="news-grid">
          <div className="news-card">
            <div className="news-image placeholder"></div>
            <h3>Bazar Solidário</h3>
            <p>Confira as ações sociais e os eventos promovidos pela instituição.</p>
          </div>

          <div className="news-card">
            <div className="news-image placeholder"></div>
            <h3>Campanhas de Apoio</h3>
            <p>Veja as iniciativas voltadas para apoio institucional e comunitário.</p>
          </div>

          <div className="news-card transparency-card">
            <h3>Transparência</h3>
            <p>
              Acompanhe informações institucionais, necessidades e futuras
              prestações de contas publicadas pela instituição.
            </p>
            <button className="btn-primary">Ver transparência</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home 