import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarNoticiaPorId } from '../../services/noticiasService'
import { registrarInteracao } from '../../services/analyticsService'

function NoticiaDetalhe() {
  const { id } = useParams()
  const noticia = buscarNoticiaPorId(id)

  if (!noticia) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <h1 style={styles.title}>Publicação não encontrada</h1>

          <Link to="/noticias" style={styles.button}>
            Voltar para notícias
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <article style={styles.container}>
        <Link to="/noticias" style={styles.back}>
          ← Voltar para notícias
        </Link>

        <span style={styles.badge}>{noticia.categoria}</span>

        <h1 style={styles.title}>{noticia.titulo}</h1>

        <p style={styles.date}>{noticia.criadoEm}</p>

        {noticia.midia && (
          noticia.tipoMidia?.startsWith('video') ? (
            <video src={noticia.midia} controls style={styles.media} />
          ) : (
            <img src={noticia.midia} alt={noticia.titulo} style={styles.media} />
          )
        )}

        <p style={styles.resumo}>{noticia.resumo}</p>

        <div
          style={styles.content}
          dangerouslySetInnerHTML={{
            __html: noticia.conteudo || ''
          }}
        />

        {noticia.categoria === 'Vagas' && (
          <section style={styles.vagasBox}>
            <h2 style={styles.vagasTitle}>Envie seu currículo</h2>

            <p style={styles.vagasText}>
              Candidate-se para esta oportunidade ou registre seu currículo no
              banco de talentos da instituição.
            </p>

            <Link to="/vagas" style={styles.button}>
              Envie-nos seu currículo aqui →
            </Link>
          </section>
        )}
      </article>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '50px 20px'
  },

  container: {
    maxWidth: '920px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '24px',
    padding: '34px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },

  back: {
    display: 'inline-block',
    marginBottom: '18px',
    color: '#0B3D91',
    textDecoration: 'none',
    fontWeight: '900'
  },

  badge: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: '900',
    marginBottom: '12px'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: '10px 0'
  },

  date: {
    color: '#64748b',
    marginBottom: '18px'
  },

  media: {
    width: '100%',
    maxHeight: '420px',
    objectFit: 'cover',
    borderRadius: '18px',
    margin: '18px 0'
  },

  resumo: {
    color: '#334155',
    fontSize: '1.15rem',
    lineHeight: '1.7',
    fontWeight: '700',
    marginBottom: '20px'
  },

  content: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '22px',
    color: '#1f2937',
    fontSize: '1.02rem',
    lineHeight: '1.75'
  },

  vagasBox: {
    marginTop: '26px',
    background: '#eef6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '18px',
    padding: '22px'
  },

  vagasTitle: {
    color: '#0B3D91',
    margin: '0 0 10px'
  },

  vagasText: {
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '12px'
  },

  button: {
    display: 'inline-block',
    marginTop: '10px',
    background: '#0B3D91',
    color: '#fff',
    textDecoration: 'none',
    padding: '13px 18px',
    borderRadius: '12px',
    fontWeight: '900'
  }
}

export default NoticiaDetalhe