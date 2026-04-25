import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obterTopDoadores } from '../../services/rankingService'

function Transparencia() {
  const hoje = new Date()
  const [topDoadores, setTopDoadores] = useState([])
  const [mes, setMes] = useState(String(hoje.getMonth() + 1).padStart(2, '0'))
  const [ano, setAno] = useState(String(hoje.getFullYear()))

  useEffect(() => {
    setTopDoadores(obterTopDoadores(3, mes, ano))
  }, [mes, ano])

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Transparência</h1>
          <p style={styles.subtitle}>
            Acompanhe como os recursos são utilizados e reconheça quem contribui para transformar vidas.
          </p>
        </header>

        <section style={styles.infoCard}>
          <h2 style={styles.sectionTitle}>Compromisso com a transparência</h2>
          <p style={styles.text}>
            Nossa instituição valoriza a clareza na gestão dos recursos e reconhece a importância dos doadores que apoiam nossa missão social.
          </p>
        </section>

        <section style={styles.rankingSection}>
          <div style={styles.rankingHeader}>
            <div>
              <h2 style={styles.rankingTitle}>Destaques de Solidariedade</h2>
              <p style={styles.rankingSubtitle}>
                Top 3 doadores com base nas doações confirmadas.
              </p>
            </div>

            <div style={styles.filters}>
              <select value={mes} onChange={(e) => setMes(e.target.value)} style={styles.input}>
                <option value="01">Janeiro</option>
                <option value="02">Fevereiro</option>
                <option value="03">Março</option>
                <option value="04">Abril</option>
                <option value="05">Maio</option>
                <option value="06">Junho</option>
                <option value="07">Julho</option>
                <option value="08">Agosto</option>
                <option value="09">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>

              <input
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                style={styles.input}
                placeholder="Ano"
              />
            </div>
          </div>

          <div style={styles.rankingGrid}>
            {topDoadores.length === 0 ? (
              <p style={styles.rankingText}>Ainda não há doadores destacados neste período.</p>
            ) : (
              topDoadores.map((doador, index) => (
                <div key={doador.nome} style={styles.rankingCard}>
                  <div style={styles.medal}>{getMedalha(index)}</div>

                  <h3 style={styles.rankingPosition}>{index + 1}º lugar</h3>

                  <p style={styles.rankingName}>{doador.nome}</p>

                  <p style={styles.rankingText}>
                    Total contribuído:{' '}
                    {doador.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>

                  <p style={styles.rankingText}>
                    Doações confirmadas: {doador.quantidade}
                  </p>
                </div>
              ))
            )}
          </div>

          <div style={styles.ctaBox}>
            <h3 style={styles.ctaTitle}>Quer aparecer entre os destaques?</h3>
            <p style={styles.ctaText}>
              Sua doação ajuda a manter projetos sociais e pode inspirar outras pessoas a contribuírem também.
            </p>

            <Link to="/doador/painel" style={styles.ctaButton}>
              Quero ser um doador destaque
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function getMedalha(index) {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return '🏅'
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f0f6ff 0%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.2rem',
    margin: 0
  },
  subtitle: {
    color: '#4b5563',
    marginTop: '10px',
    lineHeight: '1.6'
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    margin: 0,
    color: '#0B3D91'
  },
  text: {
    marginTop: '12px',
    color: '#374151',
    lineHeight: '1.7'
  },
  rankingSection: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  rankingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  rankingTitle: {
    margin: 0,
    color: '#0B3D91'
  },
  rankingSubtitle: {
    marginTop: '10px',
    color: '#6b7280'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  input: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff'
  },
  rankingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginTop: '25px'
  },
  rankingCard: {
    backgroundColor: '#f8fbff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid #dbeafe',
    textAlign: 'center'
  },
  medal: {
    fontSize: '2.4rem',
    marginBottom: '8px'
  },
  rankingPosition: {
    color: '#0B3D91',
    margin: 0
  },
  rankingName: {
    fontWeight: '700',
    fontSize: '1.15rem',
    color: '#111827',
    marginTop: '8px'
  },
  rankingText: {
    color: '#4b5563',
    marginTop: '6px'
  },
  ctaBox: {
    marginTop: '30px',
    background: 'linear-gradient(135deg, #0B3D91, #1d4ed8)',
    borderRadius: '18px',
    padding: '26px',
    color: '#ffffff',
    textAlign: 'center'
  },
  ctaTitle: {
    margin: 0,
    fontSize: '1.4rem'
  },
  ctaText: {
    marginTop: '10px',
    lineHeight: '1.6'
  },
  ctaButton: {
    display: 'inline-block',
    marginTop: '16px',
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    color: '#0B3D91',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '700'
  }
}

export default Transparencia