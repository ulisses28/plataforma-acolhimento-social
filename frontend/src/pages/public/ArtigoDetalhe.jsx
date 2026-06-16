import { Link, useParams } from 'react-router-dom'
import artigosData from '../../data/artigosData'
import './artigos.css'

/*
  PÁGINA DE DETALHE DO ARTIGO

  Esta página abre um artigo com base no "slug" da URL.
  Exemplo:
  /artigos/caridade-transforma-vidas

  Manutenção:
  - O slug precisa existir no arquivo artigosData.js.
  - Se o slug não existir, exibimos mensagem de artigo não encontrado.
*/

function ArtigoDetalhe() {
  const { slug } = useParams()

  const artigo = artigosData.find((item) => item.slug === slug)

  if (!artigo) {
    return (
      <main className="artigo-detalhe-page">
        <section className="artigo-not-found">
          <h1>Artigo não encontrado</h1>

          <p>
            O conteúdo solicitado não foi localizado ou pode ter sido removido.
          </p>

          <Link to="/artigos">
            Voltar para artigos
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="artigo-detalhe-page">
      <article className="artigo-detalhe-container">
        <Link to="/artigos" className="artigo-voltar">
          ← Voltar para artigos
        </Link>

        <header className="artigo-detalhe-header">
          <div className={`artigo-detalhe-visual tema-${artigo.tema}`}>
            <span>{artigo.icone}</span>
          </div>

          <div>
            <span className="artigo-categoria">
              {artigo.categoria}
            </span>

            <h1>{artigo.titulo}</h1>

            <p className="artigo-subtitulo">
              {artigo.subtitulo}
            </p>

            <div className="artigo-meta">
              <span>{artigo.autor}</span>
              <span>{artigo.leitura}</span>
              <span>{artigo.data}</span>
            </div>
          </div>
        </header>

        <section className="artigo-texto">
          {artigo.paragrafos.map((paragrafo, index) => (
            <p key={`${artigo.slug}-paragrafo-${index}`}>
              {paragrafo}
            </p>
          ))}
        </section>

        <aside className="artigo-destaque">
          <strong>Reflexão</strong>
          <p>{artigo.destaque}</p>
        </aside>

        <section className="artigo-fontes">
          <h2>Fontes e referências</h2>

          <p>
            As fontes abaixo servem como base de consulta e revisão para o
            conteúdo publicado.
          </p>

          <div className="artigo-fontes-lista">
            {artigo.fontes.map((fonte) => (
              <a
                key={fonte.nome}
                href={fonte.url}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{fonte.nome}</strong>
                <span>{fonte.descricao}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="artigo-cta">
          <div>
            <h2>Informação também é acolhimento.</h2>

            <p>
              Compartilhe conhecimento, apoie projetos sociais e fortaleça
              ações que transformam vidas.
            </p>
          </div>

          <Link to="/doar-agora">
            Quero ajudar →
          </Link>
        </section>
      </article>
    </main>
  )
}

export default ArtigoDetalhe