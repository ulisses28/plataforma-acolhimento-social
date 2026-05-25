import React from 'react'
import { Link } from 'react-router-dom'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function HeroNewsCarousel({ noticias = [] }) {
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
        {noticias.map((item) => (
          <SwiperSlide key={item._id}>
            <article className="hero-news-card">
              {item.midia && (
                item.tipoMidia?.startsWith('video') ? (
                  <video
                    src={item.midia}
                    controls
                    className="hero-news-image"
                  />
                ) : (
                  <img
                    src={item.midia}
                    alt={item.titulo}
                    className="hero-news-image"
                  />
                )
              )}

              <div className="hero-news-overlay">
                <span className="hero-news-category">
                  {item.categoria || 'Notícia'}
                </span>

                <h2>{item.titulo}</h2>

                <p>
                  {item.resumo || item.descricao}
                </p>

                <Link to={`/noticias/${item._id}`}>
                  Ler matéria completa →
                </Link>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default HeroNewsCarousel