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

        /*
          Mostra apenas publicações com status Publicado.

          Mantemos String().toLowerCase() para evitar erro caso algum item
          venha sem status ou com diferença de maiúsculas/minúsculas.
        */
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

  /*
    Converte links comuns do YouTube para formato embed.

    Aceita:
    - https://www.youtube.com/watch?v=...
    - https://youtu.be/...
    - https://www.youtube.com/shorts/...
    - links embed já prontos
  */
  function converterYoutubeEmbed(url) {
    if (!url) return ''

    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/')
    }

    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }

    if (url.includes('/shorts/')) {
      const id = url.split('/shorts/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }

    return url
  }

  /*
    Obtém a mídia principal da notícia.

    Ordem de prioridade:
    1. imagemUrl: novo campo da Cloudinary
    2. midia: campo antigo usado pelo sistema
    3. midias[0].imagemUrl: primeira mídia salva no array
    4. midias[0].base64: compatibilidade com publicações antigas
  */
  function obterMidiaPrincipal(item) {
    return (
      item.imagemUrl ||
      item.midia ||
      item.midias?.[0]?.imagemUrl ||
      item.midias?.[0]?.base64 ||
      ''
    )
  }

  /*
    Obtém o tipo da mídia principal.

    Isso ajuda a diferenciar imagem de vídeo.
  */
  function obterTipoMidia(item) {
    return (
      item.tipoMidia ||
      item.midias?.[0]?.tipo ||
      ''
    )
  }

  function formatarData(item) {
    if (item.createdAt) {
      return new Date(item.createdAt).toLocaleDateString('pt-BR')
    }

    return item.criadoEm || 'Publicação'
  }

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
              noticias.map((item) => {
                const midiaPrincipal = obterMidiaPrincipal(item)
                const tipoMidia = obterTipoMidia(item)

                return (
                  <article key={item._id || item.id} style={styles.card}>
                    {item.youtubeUrl ? (
                      <iframe
                        src={converterYoutubeEmbed(item.youtubeUrl)}
                        title={item.titulo}
                        style={styles.media}
                        allowFullScreen
                      />
                    ) : midiaPrincipal ? (
                      tipoMidia?.startsWith('video') ? (
                        <video
                          src={midiaPrincipal}
                          controls
                          style={styles.media}
                        />
                      ) : (
                        <img
                          src={midiaPrincipal}
                          alt={item.titulo}
                          style={styles.media}
                        />
                      )
                    ) : null}

                    <div style={styles.content}>
                      <span style={styles.badge}>
                        {item.categoria || 'Notícia institucional'}
                      </span>

                      <h2 style={styles.cardTitle}>{item.titulo}</h2>

                      <p style={styles.date}>
                        {formatarData(item)}
                      </p>

                      <p style={styles.text}>
                        {item.resumo || item.descricao || 'Sem descrição disponível.'}
                      </p>

                      <Link
                        to={`/noticias/${item._id || item.id}`}
                        style={styles.link}
                      >
                        Leia mais →
                      </Link>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        )}
      </section>
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
    maxWidth: '1180px',
    margin: '0 auto'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.5rem',
    margin: 0
  },

  subtitle: {
    color: '#475569',
    marginTop: '10px',
    marginBottom: '30px',
    lineHeight: '1.6'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '22px'
  },

  card: {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)'
  },

  media: {
    width: '100%',
    height: '260px',
    objectFit: 'contain',
    background: '#f8fbff',
    border: 'none',
    padding: '10px',
    boxSizing: 'border-box'
  },

  content: {
    padding: '18px'
  },

  badge: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '7px 12px',
    borderRadius: '999px',
    fontWeight: '900'
  },

  cardTitle: {
    color: '#0B3D91',
    marginTop: '14px'
  },

  date: {
    color: '#64748b',
    fontSize: '14px'
  },

  text: {
    color: '#334155',
    lineHeight: '1.7'
  },

  link: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#0B3D91',
    fontWeight: '900',
    textDecoration: 'none'
  },

  empty: {
    color: '#64748b'
  }
}

export default Noticias