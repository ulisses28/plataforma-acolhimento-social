import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarNoticiaPorId } from '../../services/noticiasService'

function NoticiaDetalhe() {
  const { id } = useParams()

  const [noticia, setNoticia] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarNoticia() {
      try {
        const dados = await buscarNoticiaPorId(id)
        setNoticia(dados)
      } catch (error) {
        console.error('Erro ao carregar notícia:', error)
        setNoticia(null)
      } finally {
        setCarregando(false)
      }
    }

    carregarNoticia()
  }, [id])

  /*
    Converte links comuns do YouTube para formato embed.

    Isso permite exibir vídeos dentro da página de detalhe.
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

    Compatível com:
    - imagemUrl: novo campo da Cloudinary
    - midia: campo antigo
    - midias[0].imagemUrl: array de mídias novo
    - midias[0].base64: compatibilidade antiga
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

  if (carregando) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <p style={styles.resumo}>Carregando publicação...</p>
        </section>
      </main>
    )
  }

  if (!noticia || noticia.mensagem) {
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

  const midiaPrincipal = obterMidiaPrincipal(noticia)
  const tipoMidia = obterTipoMidia(noticia)

  return (
    <main style={styles.page}>
      <article style={styles.container}>
        <Link to="/noticias" style={styles.back}>
          ← Voltar para notícias
        </Link>

        <span style={styles.badge}>
          {noticia.categoria || 'Notícia institucional'}
        </span>

        <h1 style={styles.title}>{noticia.titulo}</h1>

        <p style={styles.date}>
          {formatarData(noticia)}
        </p>

        {noticia.youtubeUrl ? (
          <iframe
            src={converterYoutubeEmbed(noticia.youtubeUrl)}
            title={noticia.titulo}
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
              alt={noticia.titulo}
              style={styles.media}
            />
          )
        ) : null}

        <p style={styles.resumo}>
          {noticia.resumo || noticia.descricao}
        </p>

        <div
          style={styles.content}
          dangerouslySetInnerHTML={{
            __html: noticia.conteudo || ''
          }}
        />

        {(noticia.categoria === 'Vagas' || noticia.categoria === 'Oportunidade') && (
          <section style={styles.vagasBox}>
            <h2 style={styles.vagasTitle}>Envie seu currículo</h2>

            <p style={styles.vagasText}>
              Candidate-se para esta oportunidade ou registre seu currículo no
              banco de talentos da instituição.
            </p>

            <Link
              to={`/enviar-curriculo?vaga=${noticia._id || noticia.id}`}
              style={styles.button}
            >
              Envie seu currículo para esta vaga →
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
    maxWidth: '980px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '24px',
    padding: '38px',
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
    fontSize: '2.5rem',
    margin: '10px 0',
    lineHeight: '1.2'
  },

  date: {
    color: '#64748b',
    marginBottom: '18px'
  },

  media: {
    width: '100%',
    height: '520px',
    objectFit: 'contain',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    margin: '18px 0',
    padding: '10px',
    boxSizing: 'border-box'
  },

  resumo: {
    color: '#334155',
    fontSize: '1.15rem',
    lineHeight: '1.8',
    fontWeight: '700',
    marginBottom: '22px'
  },

  content: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '26px',
    color: '#1f2937',
    fontSize: '1.08rem',
    lineHeight: '1.9'
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