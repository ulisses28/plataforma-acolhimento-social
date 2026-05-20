import React from 'react'
import { Link } from 'react-router-dom'
import { registrarInteracao } from '../../services/analyticsService'

function Tutorial() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.tag}>Chully Explica</span>

        <h1 style={styles.title}>Tutoriais do Site</h1>

        <p style={styles.subtitle}>
          Aprenda de forma simples como navegar, fazer doações, enviar currículo,
          acompanhar notícias e consultar a transparência da instituição.
        </p>
      </section>

      <section style={styles.grid}>
        <TutorialCard
          title="Como fazer uma doação"
          text="Veja como acessar a página de doações, escolher a forma de contribuição e realizar o apoio com segurança."
          link="/doar-agora"
        />

        <TutorialCard
          title="Como enviar currículo"
          text="Aprenda como preencher o formulário de vagas, anexar currículo e participar do banco de talentos."
          link="/vagas"
        />

        <TutorialCard
          title="Como ser voluntário"
          text="Entenda como acessar a página de voluntariado e conhecer as formas de apoio à instituição."
          link="/voluntario"
        />

        <TutorialCard
          title="Como consultar transparência"
          text="Veja onde encontrar relatórios, documentos e informações públicas sobre prestação de contas."
          link="/transparencia"
        />
      </section>

      <section style={styles.videoBox}>
        <div>
          <h2 style={styles.videoTitle}>Vídeo institucional da Chully</h2>

          <p style={styles.videoText}>
            Aqui ficará o vídeo explicativo da assistente virtual Chully,
            orientando os usuários sobre o funcionamento do site.
          </p>
        </div>

        <div style={styles.videoPlaceholder}>
          ▶ Vídeo tutorial
        </div>
      </section>
    </main>
  )
}

function TutorialCard({ title, text, link }) {
  return (
    <article style={styles.card}>
      <div style={styles.icon}>🤖</div>

      <h2 style={styles.cardTitle}>{title}</h2>

      <p style={styles.cardText}>{text}</p>

      <Link to={link} style={styles.cardLink}>
        Acessar →
      </Link>
    </article>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '60px 8%'
  },
  hero: {
    maxWidth: '900px',
    marginBottom: '34px'
  },
  tag: {
    background: '#ffc928',
    color: '#002855',
    padding: '9px 16px',
    borderRadius: '999px',
    fontWeight: '900'
  },
  title: {
    color: '#0B3D91',
    fontSize: '3rem',
    marginBottom: '12px'
  },
  subtitle: {
    color: '#475569',
    fontSize: '1.1rem',
    lineHeight: '1.7'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '22px'
  },
  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '26px',
    border: '1px solid #dbeafe',
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)'
  },
  icon: {
    fontSize: '34px',
    marginBottom: '14px'
  },
  cardTitle: {
    color: '#0B3D91'
  },
  cardText: {
    color: '#475569',
    lineHeight: '1.6'
  },
  cardLink: {
    color: '#0B3D91',
    fontWeight: '900',
    textDecoration: 'none'
  },
  videoBox: {
    marginTop: '36px',
    background: '#fff',
    borderRadius: '26px',
    padding: '30px',
    border: '1px solid #dbeafe',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'center'
  },
  videoTitle: {
    color: '#0B3D91'
  },
  videoText: {
    color: '#475569',
    lineHeight: '1.6'
  },
  videoPlaceholder: {
    minHeight: '260px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #002855, #0B3D91)',
    color: '#ffc928',
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.4rem',
    fontWeight: '900'
  }
}

export default Tutorial