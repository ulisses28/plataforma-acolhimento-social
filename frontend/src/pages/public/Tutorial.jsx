import React from 'react'
import { Link } from 'react-router-dom'
import './tutorial.css'

function Tutorial() {
  return (
    <main className="jogos-page">
      <section className="jogos-hero">
        <div className="jogos-hero-texto">
          <span className="jogos-tag">Jogue e Divirta-se</span>

          <h1>
            Jogos educativos para aprender, brincar e ajudar
          </h1>

          <p>
            Um espaço interativo do Lar Batista com jogos, desafios, atividades
            educativas e experiências pensadas para crianças, visitantes,
            doadores e voluntários.
          </p>

          <div className="jogos-hero-botoes">
            <Link to="/jogos/aventura-blocos" className="jogos-btn-primary">
              Jogar Aventura dos Blocos
            </Link>

            <Link to="/doar-agora" className="jogos-btn-secondary">
              Doe Agora
            </Link>
          </div>
        </div>

        <div className="jogos-hero-card">
          <div className="jogos-hero-screen">
            <span>🧱</span>
            <strong>Aventura dos Blocos</strong>
            <p>
              Monte palavras, resolva continhas e avance por níveis infinitos.
            </p>
          </div>
        </div>
      </section>

      <section className="jogos-info-grid">
        <InfoCard
          icon="🧠"
          title="Aprendizado"
          text="Jogos com palavras, animais, objetos, materiais escolares e matemática."
        />

        <InfoCard
          icon="📱"
          title="Funciona no celular"
          text="A tela se adapta para computador, tablet e celular."
        />

        <InfoCard
          icon="🏆"
          title="Ranking local"
          text="A pontuação fica salva no navegador e mostra os melhores resultados."
        />

        <InfoCard
          icon="💛"
          title="Doação"
          text="Depois dos jogos, o visitante é convidado a conhecer a página de doação."
        />
      </section>

      <section className="jogos-tutorial-section">
        <div className="jogos-section-header">
          <span className="jogos-tag">Jogos disponíveis</span>

          <h2>
            Escolha uma experiência
          </h2>

          <p>
            Cada jogo abrirá em uma página própria, deixando a tela mais limpa
            e melhor para jogar no celular.
          </p>
        </div>

        <div className="jogos-tutorial-grid">
          <GamePortalCard
            icon="🧱"
            title="Aventura dos Blocos"
            text="Jogo educativo de palavras, matemática, animais, utensílios e materiais escolares."
            link="/jogos/aventura-blocos"
            status="Disponível"
          />

          <GamePortalCard
            icon="🏆"
            title="Show da Solidariedade"
            text="Quiz de perguntas com pontuação progressiva e temas sociais."
            link="#"
            status="Em breve"
            locked
          />

          <GamePortalCard
            icon="💛"
            title="Perfil do Doador"
            text="Perguntas para descobrir o perfil solidário do visitante e incentivar a doação."
            link="#"
            status="Em breve"
            locked
          />

          <GamePortalCard
            icon="🔎"
            title="Caça-palavras do Bem"
            text="Atividade educativa com palavras sobre cuidado, respeito e solidariedade."
            link="#"
            status="Em breve"
            locked
          />
        </div>
      </section>

      <section className="jogos-tutorial-section">
        <div className="jogos-section-header">
          <span className="jogos-tag">Como usar o site</span>

          <h2>
            Acesso rápido às principais áreas
          </h2>

          <p>
            Além dos jogos, o visitante pode aprender rapidamente como doar,
            enviar currículo, ser voluntário e acompanhar a transparência.
          </p>
        </div>

        <div className="jogos-tutorial-grid">
          <TutorialCard
            icon="💛"
            title="Como fazer uma doação"
            text="Acesse a página de doações, escolha a forma de contribuição e apoie a instituição com segurança."
            link="/doar-agora"
          />

          <TutorialCard
            icon="📄"
            title="Como enviar currículo"
            text="Preencha o formulário de vagas, anexe seu currículo e participe do banco de talentos."
            link="/vagas"
          />

          <TutorialCard
            icon="🤝"
            title="Como ser voluntário"
            text="Conheça as formas de apoio voluntário e veja como participar das ações da instituição."
            link="/voluntario"
          />

          <TutorialCard
            icon="📊"
            title="Como consultar transparência"
            text="Veja relatórios, documentos públicos e informações sobre prestação de contas."
            link="/transparencia"
          />
        </div>
      </section>
    </main>
  )
}

function InfoCard({ icon, title, text }) {
  return (
    <article className="jogos-info-card">
      <span>{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  )
}

function GamePortalCard({ icon, title, text, link, status, locked = false }) {
  if (locked) {
    return (
      <article className="jogos-tutorial-card jogos-card-bloqueado">
        <div className="jogos-card-icon">
          {icon}
        </div>

        <h3>{title}</h3>

        <p>{text}</p>

        <span className="jogos-status-badge">
          {status}
        </span>
      </article>
    )
  }

  return (
    <article className="jogos-tutorial-card">
      <div className="jogos-card-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <div className="jogos-card-footer">
        <Link to={link}>
          Jogar agora →
        </Link>

        <span className="jogos-status-badge ativo">
          {status}
        </span>
      </div>
    </article>
  )
}

function TutorialCard({ icon, title, text, link }) {
  return (
    <article className="jogos-tutorial-card">
      <div className="jogos-card-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <Link to={link}>
        Acessar →
      </Link>
    </article>
  )
}

export default Tutorial