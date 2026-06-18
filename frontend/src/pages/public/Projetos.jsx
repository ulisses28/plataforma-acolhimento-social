/*
  PÁGINA: PROJETOS

  Objetivo desta versão:
  - Remover todas as imagens do corpo da página
  - Apresentar os serviços, casas lares, república, sustentação e rotinas
  - Manter cabeçalho e rodapé atuais do site
  - Organizar o conteúdo institucional em cards
*/

function Projetos() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* ===================== CABEÇALHO DA PÁGINA ===================== */}
        <header style={styles.header}>
          <span style={styles.badge}>Projetos e Serviços</span>

          <h1 style={styles.pageTitle}>Nossos Projetos</h1>

          <p style={styles.subtitle}>
            Conheça os serviços, ações e formas de sustentação que ajudam o Lar
            Batista Albertine Meador a acolher, cuidar e transformar vidas.
          </p>
        </header>

        {/* ===================== SERVIÇOS ===================== */}
        <section style={styles.heroCard}>
          <div style={styles.iconCircle}>🤲</div>

          <div>
            <h2 style={styles.sectionTitle}>Serviços</h2>

            <p style={styles.text}>
              Dentro da Política Municipal de Assistência Social, o Lar Batista
              está inserido na Proteção Social Especial de Alta Complexidade,
              sendo um serviço de acolhimento institucional na modalidade de
              casas lares e república.
            </p>

            <p style={styles.text}>
              Por isso, mantém parceria com a Prefeitura Municipal de Serra e
              conta com duas casas lares com acessibilidade e estrutura voltada
              à humanização, para melhor atendimento das residentes.
            </p>
          </div>
        </section>

        {/* ===================== ACOLHIMENTO E MORADIA ===================== */}
        <section style={styles.section}>
          <h2 style={styles.groupTitle}>Acolhimento e Moradia</h2>

          <div style={styles.grid}>
            <article style={styles.card}>
              <span style={styles.cardIcon}>🏠</span>
              <h3 style={styles.cardTitle}>Casas Lares</h3>

              <p style={styles.text}>
                A proposta é manter um ambiente familiar, com direitos e deveres
                semelhantes aos de uma família. Atualmente, o Lar Batista conta
                com duas casas lares.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>🧒</span>
              <h3 style={styles.cardTitle}>Casa Mirim</h3>

              <p style={styles.text}>
                Uma casa lar que recebe até 10 crianças de 0 a 11 anos e conta
                com quatro educadores sociais residentes que se revezam a cada
                48 horas nos cuidados diários para o desenvolvimento das
                residentes.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>👧</span>
              <h3 style={styles.cardTitle}>Casa Adolescentes</h3>

              <p style={styles.text}>
                Uma casa lar que recebe até 10 adolescentes de 12 a 17 anos e 11
                meses e conta com educadores sociais residentes que se revezam
                nos cuidados diários para o desenvolvimento das residentes.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>🌱</span>
              <h3 style={styles.cardTitle}>República de Jovens</h3>

              <p style={styles.text}>
                A proposta é oferecer subsídio para moradia e desenvolvimento da
                autonomia, especialmente profissional, por pelo menos dois anos
                para adolescentes que completam a maioridade dentro das casas
                lares e não possuem retaguarda familiar.
              </p>

              <p style={styles.text}>
                A república funciona em apartamento alugado e mobiliado, com
                apoio para despesas básicas e rotineiras, garantindo dignidade a
                até 6 jovens de 18 a 21 anos.
              </p>
            </article>
          </div>
        </section>

        {/* ===================== SUSTENTAÇÃO ===================== */}
        <section style={styles.section}>
          <h2 style={styles.groupTitle}>Sustentação</h2>

          <p style={styles.text}>
            O Lar Batista busca a diversificação das fontes de sustentação para
            manter suas atividades e ampliar o cuidado oferecido às residentes.
          </p>

          <div style={styles.grid}>
            <article style={styles.card}>
              <span style={styles.cardIcon}>🛍️</span>
              <h3 style={styles.cardTitle}>Bazar Solidário</h3>

              <p style={styles.text}>
                O Lar Batista possui um bazar solidário que funciona com o
                trabalho de voluntárias. A lojinha funciona nas terças-feiras,
                das 09h às 12h.
              </p>

              <p style={styles.text}>
                A instituição recebe diversos tipos de doações. Roupas e
                calçados que não são utilizados pelas residentes são vendidos no
                bazar, e todos os recursos arrecadados são revertidos para as
                demandas das residentes.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>📄</span>
              <h3 style={styles.cardTitle}>Termo de Colaboração</h3>

              <p style={styles.text}>
                O Lar Batista conta com parceria da Prefeitura por meio de
                convênio, o que possibilita o pagamento das principais despesas
                regulares da instituição.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>🤝</span>
              <h3 style={styles.cardTitle}>Parceiros</h3>

              <p style={styles.text}>
                Empresas e Igrejas Batistas colaboram regularmente para o
                sustento da instituição por meio de bens, alimentos ou
                contribuições financeiras.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>🧰</span>
              <h3 style={styles.cardTitle}>Padrinhos Prestadores de Serviços</h3>

              <p style={styles.text}>
                Pessoas físicas colaboram regularmente com ações de
                responsabilidade social, utilizando suas habilidades, ou ainda
                com doação regular de bens, alimentos ou recursos financeiros.
              </p>

              <p style={styles.text}>
                Alguns desses padrinhos se tornam mobilizadores, estimulando sua
                rede de amigos, grupo de trabalho e familiares a realizarem
                doações em campanhas específicas.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>💙</span>
              <h3 style={styles.cardTitle}>Padrinhos Afetivos</h3>

              <p style={styles.text}>
                São pessoas que se dispõem regularmente a proporcionar vivências
                e referências afetivas, tanto familiares quanto comunitárias, às
                residentes.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>🎁</span>
              <h3 style={styles.cardTitle}>Padrinhos Provedores</h3>

              <p style={styles.text}>
                São pessoas que oferecem suporte material ou financeiro a uma
                criança ou adolescente residente, com doação regular de
                vestuário, brinquedos, cursos, idiomas, reforço escolar ou
                outras necessidades específicas.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>⭐</span>
              <h3 style={styles.cardTitle}>Apoiadores</h3>

              <p style={styles.text}>
                O Lar Batista conta com o apoio de empresas, igrejas e escolas
                que realizam campanhas específicas ou doações de bens e
                serviços.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>🙌</span>
              <h3 style={styles.cardTitle}>Doadores</h3>

              <p style={styles.text}>
                A comunidade em geral participa por meio de doações pontuais de
                alimentos, roupas, calçados, bens e dinheiro.
              </p>
            </article>
          </div>
        </section>

        {/* ===================== PROFISSIONAIS E ROTINAS ===================== */}
        <section style={styles.section}>
          <h2 style={styles.groupTitle}>Profissionais e Rotinas</h2>

          <div style={styles.twoColumns}>
            <article style={styles.card}>
              <span style={styles.cardIcon}>👩‍⚕️</span>
              <h3 style={styles.cardTitle}>Profissionais</h3>

              <p style={styles.text}>
                Por permanecerem 24 horas no Lar, as crianças são atendidas por
                assistentes sociais, psicólogas, pedagoga, educadoras sociais,
                cozinheira e demais funcionários necessários para manter a
                instituição ativa e em funcionamento.
              </p>
            </article>

            <article style={styles.card}>
              <span style={styles.cardIcon}>📚</span>
              <h3 style={styles.cardTitle}>Rotinas</h3>

              <p style={styles.text}>
                Todas as crianças estudam em escolas da rede pública ou como
                bolsistas em escolas particulares da região de Laranjeiras e
                Valparaíso.
              </p>

              <p style={styles.text}>
                As residentes contam com atividades cognitivas, atendimento
                psicológico, acompanhamento escolar com pedagogo, acompanhamento
                médico e atividades esportivas na Estação Conhecimento,
                pertencente à Vale do Rio Doce.
              </p>
            </article>
          </div>
        </section>

        {/* ===================== REGISTROS E DADOS BANCÁRIOS ===================== */}
        <section style={styles.finalGrid}>
          <article style={styles.section}>
            <h2 style={styles.groupTitle}>Registro nos Conselhos</h2>

            <ul style={styles.list}>
              <li>
                CONCASE – Conselho Municipal dos Direitos da Criança e do
                Adolescente nº 002/99.
              </li>
              <li>
                COMASSE – Conselho Municipal da Assistência Social de Serra nº
                013/FL 14.
              </li>
            </ul>
          </article>

          <article style={styles.sectionYellow}>
            <h2 style={styles.groupTitle}>Nossa Gratidão</h2>

            <p style={styles.text}>
              Se você deseja colaborar com o Lar Batista, além das formas
              apresentadas acima, seguem os dados bancários:
            </p>

            <div style={styles.bankBox}>
              <p>
                <strong>Banco:</strong> Banestes
              </p>

              <p>
                <strong>Agência:</strong> 059
              </p>

              <p>
                <strong>Conta Corrente:</strong> 6.948.103
              </p>

              <p>
                <strong>Razão Social:</strong> Lar Batista Albertine Meador
              </p>

              <p>
                <strong>CNPJ:</strong> 27.363.944/0001-80
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}

/* ===================== ESTILOS ===================== */

const styles = {
  page: {
    background: 'linear-gradient(180deg, #f7fbff 0%, #eef5fb 100%)',
    padding: '48px 20px 70px'
  },

  container: {
    maxWidth: '1180px',
    margin: '0 auto'
  },

  header: {
    textAlign: 'center',
    marginBottom: '34px'
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '999px',
    background: '#e8f2ff',
    color: '#0B3D91',
    fontWeight: 900,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
  },

  pageTitle: {
    margin: 0,
    color: '#0B3D91',
    fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
    fontWeight: 900
  },

  subtitle: {
    maxWidth: '820px',
    margin: '14px auto 0',
    color: '#526174',
    lineHeight: 1.8,
    fontSize: '17px'
  },

  heroCard: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '28px',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: '28px',
    padding: '34px',
    marginBottom: '26px',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5edf7'
  },

  iconCircle: {
    width: '110px',
    height: '110px',
    borderRadius: '999px',
    background: '#e8f2ff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '48px'
  },

  section: {
    background: '#ffffff',
    borderRadius: '26px',
    padding: '30px',
    marginBottom: '26px',
    border: '1px solid #e5edf7',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.07)'
  },

  sectionYellow: {
    background: 'linear-gradient(135deg, #ffffff, #fff7dc)',
    borderRadius: '26px',
    padding: '30px',
    marginBottom: '26px',
    border: '1px solid #ffe08a',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.07)'
  },

  sectionTitle: {
    color: '#0B3D91',
    margin: '0 0 16px',
    fontSize: '28px'
  },

  groupTitle: {
    color: '#0B3D91',
    margin: '0 0 18px',
    fontSize: '26px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '18px',
    marginTop: '20px'
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px'
  },

  finalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '18px'
  },

  card: {
    background: '#f8fbff',
    borderRadius: '20px',
    padding: '22px',
    border: '1px solid #dbeafe'
  },

  cardIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '999px',
    background: '#0B5FC3',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '26px',
    marginBottom: '14px'
  },

  cardTitle: {
    color: '#0B3D91',
    margin: '0 0 12px',
    fontSize: '21px'
  },

  text: {
    color: '#374151',
    lineHeight: 1.8,
    fontSize: '16px',
    margin: '0 0 14px'
  },

  list: {
    color: '#374151',
    lineHeight: 1.8,
    paddingLeft: '20px',
    margin: '10px 0 0'
  },

  bankBox: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    border: '1px solid #ffe08a',
    color: '#374151',
    lineHeight: 1.7
  }
}

export default Projetos