import React, { useEffect, useState } from 'react'

import {
  listarVagasAtivas
} from '../../services/vagasService'

function Vagas() {
  const [vagas, setVagas] = useState([])

  useEffect(() => {
    setVagas(listarVagasAtivas())
  }, [])

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Oportunidades
          </h1>

          <p style={styles.subtitle}>
            Faça parte da missão do
            Lar Batista Albertine Meador.
          </p>
        </div>

        <div style={styles.grid}>
          {vagas.map((vaga) => (
            <article
              key={vaga.id}
              style={styles.card}
            >
              {vaga.imagem && (
                <img
                  src={vaga.imagem}
                  alt={vaga.titulo}
                  style={styles.image}
                />
              )}

              <div style={styles.content}>
                <span style={styles.badge}>
                  {vaga.tipo}
                </span>

                <h2 style={styles.cardTitle}>
                  {vaga.titulo}
                </h2>

                <p style={styles.local}>
                  {vaga.local}
                </p>

                <p style={styles.text}>
                  {vaga.resumo}
                </p>

                <button style={styles.button}>
                  Enviar currículo
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    background: '#f1f7ff',
    minHeight: '100vh',
    padding: '60px 20px'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },

  header: {
    marginBottom: '40px'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.8rem'
  },

  subtitle: {
    color: '#64748b'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(320px,1fr))',
    gap: '24px'
  },

  card: {
    background: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow:
      '0 10px 25px rgba(0,0,0,0.08)'
  },

  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  },

  content: {
    padding: '22px'
  },

  badge: {
    background: '#ffc928',
    color: '#002855',
    padding: '7px 14px',
    borderRadius: '999px',
    fontWeight: '900'
  },

  cardTitle: {
    color: '#0B3D91',
    marginTop: '16px'
  },

  local: {
    color: '#64748b',
    fontWeight: '700'
  },

  text: {
    color: '#334155',
    lineHeight: '1.7'
  },

  button: {
    marginTop: '18px',
    width: '100%',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontWeight: '900'
  }
}

export default Vagas