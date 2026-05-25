import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarNoticias } from '../../services/noticiasService'

function Noticias() {
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarNoticias()

        const publicadas = dados.filter(
          (item) => String(item.status).toLowerCase() === 'publicado'
        )

        setNoticias(publicadas)
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <h1 style={styles.title}>Notícias e Publicações</h1>

        <p style={styles.subtitle}>
          Acompanhe notícias, avisos, histórias de vida, eventos e ações institucionais.
        </p>

        {carregando ? (
          <p style={styles.empty}>Carregando notícias...</p>
        ) : (
          <div style={styles.grid}>
            {noticias.length === 0 ? (
              <p style={styles.empty}>Nenhuma publicação disponível no momento.</p>
            ) : (
              noticias.map((item) => (
                <article key={item._id} style={styles.card}>
                  {item.midia && (
                    item.tipoMidia?.startsWith('video') ? (
                      <video src={item.midia} controls style={styles.media} />
                    ) : (
                      <img src={item.midia} alt={item.titulo} style={styles.media} />
                    )
                  )}

                  <div style={styles.content}>
                    <span style={styles.badge}>{item.categoria}</span>

                    <h2 style={styles.cardTitle}>{item.titulo}</h2>

                    <p style={styles.date}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('pt-BR')
                        : 'Publicação'}
                    </p>

                    <p style={styles.text}>
                      {item.resumo || item.descricao || 'Sem descrição disponível.'}
                    </p>

                    <Link to={`/noticias/${item._id}`} style={styles.link}>
                      Leia mais →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f1f7ff', padding: '50px 20px' },
  container: { maxWidth: '1180px', margin: '0 auto' },
  title: { color: '#0B3D91', fontSize: '2.5rem', margin: 0 },
  subtitle: { color: '#475569', marginTop: '10px', marginBottom: '30px', lineHeight: '1.6' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' },
  card: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 28px rgba(0,0,0,0.08)' },
  media: {width: '100%', height: '260px', objectFit: 'contain', background: '#f8fbff', padding: '10px' },
  content: { padding: '18px' },
  badge: { display: 'inline-block', background: '#ffc928', color: '#002855', padding: '7px 12px', borderRadius: '999px', fontWeight: '900' },
  cardTitle: { color: '#0B3D91', marginTop: '14px' },
  date: { color: '#64748b', fontSize: '14px' },
  text: { color: '#334155', lineHeight: '1.7' },
  link: { display: 'inline-block', marginTop: '10px', color: '#0B3D91', fontWeight: '900', textDecoration: 'none' },
  empty: { color: '#64748b' }
}

export default Noticias