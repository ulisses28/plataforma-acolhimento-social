import React from 'react'
import BackButton from '../../components/ui/BackButton'

function BancoCurriculosAdmin() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <h1 style={styles.title}>Banco de Currículos</h1>

        <p style={styles.subtitle}>
          Gerencie candidaturas recebidas, currículos e candidatos cadastrados nas vagas.
        </p>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Currículos recebidos</h2>

          <p style={styles.empty}>
            Nenhuma candidatura encontrada no momento.
          </p>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.7rem',
    marginBottom: '10px'
  },

  subtitle: {
    color: '#475569',
    marginBottom: '28px'
  },

  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '30px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },

  cardTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  empty: {
    color: '#64748b'
  }
}

export default BancoCurriculosAdmin