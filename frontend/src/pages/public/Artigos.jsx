import { Link } from 'react-router-dom'
import artigosData from '../../data/artigosData'
import './artigos.css'

/*
  PÁGINA DE ARTIGOS

  Esta página lista todos os artigos institucionais do site.
  Cada card direciona para uma página interna de leitura.

  Manutenção:
  - Os dados vêm de src/data/artigosData.js
  - Para adicionar/remover artigo, altere o array artigosData.
*/

function Artigos() {
  return (
    <main className="artigos-page">
      <section className="artigos-hero">
        <div>
          <span className="artigos-kicker">
            Conteúdo institucional
          </span>

          <h1>
            Artigos e Reflexões
          </h1>

          <p>
            Conteúdos sobre solidariedade, infância, tecnologia, comportamento
            humano e transformação social.
          </p>
        </div>
      </section>

      <section className="artigos-container">
        <div className="artigos-grid">
          {artigosData.map((artigo) => (
            <article
              key={artigo.slug}
              className="artigo-card-page"
            >
              <div className={`artigo-card-visual tema-${artigo.tema}`}>
                <span>{artigo.icone}</span>
              </div>

              <div className="artigo-card-body">
                <span className="artigo-categoria">
                  {artigo.categoria}
                </span>

                <h2>{artigo.titulo}</h2>

                <p>{artigo.resumo}</p>

                <div className="artigo-card-meta">
                  <span>{artigo.leitura}</span>
                  <span>{artigo.data}</span>
                </div>

                <Link to={`/artigos/${artigo.slug}`}>
                  Ler artigo →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Artigos