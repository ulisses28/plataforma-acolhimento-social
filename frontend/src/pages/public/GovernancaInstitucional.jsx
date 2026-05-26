import { useEffect, useState } from 'react'
import { listarDocumentosGovernanca } from '../../services/governancaService'

function GovernancaInstitucional() {
  const [documentos, setDocumentos] = useState([])

  useEffect(() => {
    const publicados = listarDocumentosGovernanca().filter(
      (item) => item.status === 'Publicado'
    )

    setDocumentos(publicados)
  }, [])

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.badge}>Governança Institucional</span>

        <h1 style={styles.title}>
          Transparência, equidade, responsabilidade e ética
        </h1>

        <p style={styles.subtitle}>
          A instituição disponibiliza documentos e diretrizes que fortalecem a
          confiança pública, a prestação de contas e o compromisso social.
        </p>
      </section>

      <section style={styles.principles}>
        <Card
          icon="⚖️"
          title="Transparência"
          text="Acesso claro às informações institucionais."
        />

        <Card
          icon="🤝"
          title="Equidade"
          text="Respeito, inclusão e tratamento justo."
        />

        <Card
          icon="🏛️"
          title="Responsabilidade"
          text="Gestão responsável dos recursos e ações."
        />

        <Card
          icon="🛡️"
          title="Ética"
          text="Atuação íntegra, legal e comprometida."
        />
      </section>

      <section style={styles.documents}>
        <h2 style={styles.sectionTitle}>Documentos publicados</h2>

        {documentos.length === 0 ? (
          <p style={styles.empty}>
            Nenhum documento publicado no momento.
          </p>
        ) : (
          <div style={styles.docGrid}>
            {documentos.map((item) => (
              <article key={item.id} style={styles.documentCard}>
                <span style={styles.docBadge}>{item.categoria}</span>

                <h3 style={styles.docTitle}>{item.titulo}</h3>

                <p style={styles.docText}>{item.descricao}</p>

                <p style={styles.meta}>
                  Publicado em {item.dataPublicacao}
                </p>

                {item.arquivo && (
                  <button style={styles.downloadButton}>
                    Visualizar documento
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function Card({ icon, title, text }) {
  return (
    <article style={styles.principleCard}>
      <div style={styles.icon}>{icon}</div>
      <h2 style={styles.cardTitle}>{title}</h2>
      <p style={styles.cardText}>{text}</p>
    </article>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '50px 20px'
  },
  hero: {
    maxWidth: '1180px',
    margin: '0 auto 34px',
    background: '#fff',
    borderRadius: '28px',
    padding: '44px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },
  badge: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: '900'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.8rem',
    maxWidth: '850px',
    lineHeight: '1.15'
  },
  subtitle: {
    color: '#475569',
    fontSize: '1.1rem',
    lineHeight: '1.7',
    maxWidth: '850px'
  },
  principles: {
    maxWidth: '1180px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '20px'
  },
  principleCard: {
    background: '#fff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.07)',
    borderTop: '5px solid #0B3D91'
  },
  icon: {
    fontSize: '34px'
  },
  cardTitle: {
    color: '#0B3D91'
  },
  cardText: {
    color: '#475569',
    lineHeight: '1.6'
  },
  documents: {
    maxWidth: '1180px',
    margin: '34px auto 0',
    background: '#fff',
    borderRadius: '28px',
    padding: '34px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  docGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  documentCard: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '20px'
  },
  docBadge: {
    background: '#dbeafe',
    color: '#0B3D91',
    padding: '7px 12px',
    borderRadius: '999px',
    fontWeight: '900'
  },
  docTitle: {
    color: '#0B3D91'
  },
  docText: {
    color: '#334155',
    lineHeight: '1.6'
  },
  meta: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  downloadButton: {
    marginTop: '12px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  empty: {
    color: '#64748b'
  }
}

export default GovernancaInstitucional