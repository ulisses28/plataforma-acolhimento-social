import React from 'react'
import { Link } from 'react-router-dom'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function HeroNewsCarousel({ noticias = [], fallbackImage = '' }) {
  if (!noticias.length) {
    return null
  }

  return (
    <section className="hero-news-section">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        loop
        className="hero-news-swiper"
      >
        {noticias.map((item) => {
          const id = item._id || item.id
          const midia = obterMidiaPrincipal(item) || fallbackImage
          const tipoMidia = obterTipoMidia(item)
          const youtubeEmbed = converterYoutubeEmbed(item.youtubeUrl)

          return (
            <SwiperSlide key={id || item.titulo}>
              <article className="hero-news-card">
                {youtubeEmbed ? (
                  <iframe
                    src={youtubeEmbed}
                    title={item.titulo}
                    className="hero-news-image hero-news-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : midia ? (
                  tipoMidia?.startsWith('video') ? (
                    <video
                      src={midia}
                      controls
                      className="hero-news-image"
                    />
                  ) : (
                    <img
                      src={midia}
                      alt={item.titulo}
                      className="hero-news-image"
                    />
                  )
                ) : null}

                <div className="hero-news-overlay">
                  <span className="hero-news-category">
                    {item.categoria || 'Notícia'}
                  </span>

                  <h2>{item.titulo}</h2>

                  <p>
                    {item.resumo || item.descricao || 'Leia a publicação completa.'}
                  </p>

                  <Link to={id ? `/noticias/${id}` : '/noticias'}>
                    Ler matéria completa →
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}

/*
  Compatibilidade com os modelos antigo e novo.

  Modelo antigo:
  - midia
  - midias[0].base64

  Modelo novo:
  - imagemUrl
  - midias[0].imagemUrl

  Assim o carrossel continua funcionando com notícias antigas
  e também com imagens vindas da Cloudinary.
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

/*
  Converte links comuns do YouTube para formato embed.

  Aceita:
  - youtube.com/watch?v=
  - youtu.be/
  - youtube.com/shorts/
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

export default HeroNewsCarousel