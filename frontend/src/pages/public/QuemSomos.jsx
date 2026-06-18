/*
  PÁGINA: QUEM SOMOS

  Objetivo desta versão:
  - Remover as imagens grandes do corpo da página
  - Manter uma apresentação institucional mais séria e completa
  - Organizar o conteúdo em cards e blocos de leitura
  - Preservar o cabeçalho e o rodapé atuais do site, que ficam fora deste arquivo
*/

function QuemSomos() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* ===================== TÍTULO DA PÁGINA ===================== */}
        <header style={styles.header}>
          <span style={styles.badge}>Institucional</span>

          <h1 style={styles.pageTitle}>Quem Somos</h1>

          <p style={styles.subtitle}>
            Conheça a missão, a estrutura e o trabalho desenvolvido pelo Lar
            Batista Albertine Meador no acolhimento de crianças, adolescentes e
            jovens em situação de vulnerabilidade social.
          </p>
        </header>

        {/* ===================== APRESENTAÇÃO PRINCIPAL ===================== */}
        <section style={styles.heroCard}>
          <div style={styles.iconCircle}>🏠</div>

          <div>
            <h2 style={styles.heroTitle}>Conhecendo o Lar Batista</h2>

            <p style={styles.text}>
              O <strong>Lar Batista Albertine Meador</strong> tem como missão:
            </p>

            <blockquote style={styles.quote}>
              “Investir na vida de meninas de 0 a 21 anos em situação de
              vulnerabilidade social, através do acolhimento e da educação, com
              dedicação e amor, promovendo a reintegração ou adoção”.
            </blockquote>

            <p style={styles.text}>
              A instituição tem como principal serviço o acolhimento
              institucional de crianças e adolescentes sob medida protetiva em
              casas lares.
            </p>
          </div>
        </section>

        {/* ===================== CARDS DE RESUMO ===================== */}
        <section style={styles.grid}>
          <article style={styles.card}>
            <span style={styles.cardIcon}>🤝</span>
            <h3 style={styles.cardTitle}>Acolhimento Institucional</h3>

            <p style={styles.text}>
              Atualmente, o Lar Batista possui duas casas lares em
              funcionamento, com capacidade total para 20 meninas.
            </p>

            <ul style={styles.list}>
              <li>Casa Lar Mirim: 10 crianças de 0 a 11 anos.</li>
              <li>Casa Lar Adolescentes: 10 adolescentes de 12 a 18 anos.</li>
            </ul>
          </article>

          <article style={styles.card}>
            <span style={styles.cardIcon}>🌱</span>
            <h3 style={styles.cardTitle}>República de Jovens</h3>

            <p style={styles.text}>
              A instituição também possui uma república para jovens de 18 a 23
              anos, com capacidade para 6 pessoas, contribuindo para a autonomia
              e o desenvolvimento das jovens acolhidas.
            </p>
          </article>

          <article style={styles.card}>
            <span style={styles.cardIcon}>⚖️</span>
            <h3 style={styles.cardTitle}>Base Legal</h3>

            <p style={styles.text}>
              As residentes foram retiradas temporariamente ou de forma
              definitiva do convívio familiar por medida protetiva prevista no
              artigo 101 do Estatuto da Criança e do Adolescente.
            </p>
          </article>

          <article style={styles.card}>
            <span style={styles.cardIcon}>🛡️</span>
            <h3 style={styles.cardTitle}>Alta Complexidade</h3>

            <p style={styles.text}>
              Esses serviços estão previstos na Política Nacional de Assistência
              Social, PNAS, e são tipificados pela Resolução nº 109, de
              11/11/2009 do CNAS, como serviço de alta complexidade.
            </p>
          </article>
        </section>

        {/* ===================== REDE DE PROTEÇÃO ===================== */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Rede de Proteção Social</h2>

          <p style={styles.text}>
            O Lar Batista integra a rede de serviços que atendem crianças e
            adolescentes que tiveram os vínculos familiares rompidos. Dentro
            dessa perspectiva, a instituição precisa seguir as Orientações
            Técnicas dos Serviços de Acolhimento para Crianças e Adolescentes.
          </p>

          <p style={styles.text}>
            O Manual dos Serviços de Acolhimento para Crianças e Adolescentes
            prevê regras de infraestrutura e espaços físicos para que a
            instituição ofereça segurança, apoio, proteção e cuidado a todas as
            crianças e adolescentes acolhidos.
          </p>
        </section>

        {/* ===================== DADOS INSTITUCIONAIS ===================== */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Dados Institucionais</h2>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Instituição</strong>
              <span>LAR BATISTA ALBERTINE MEADOR</span>
            </div>

            <div style={styles.infoItem}>
              <strong>CNPJ</strong>
              <span>27.363.944/0001-80</span>
            </div>

            <div style={styles.infoItem}>
              <strong>Endereço</strong>
              <span>
                Rua Santos Dumont, 120, Parque Residencial Laranjeiras,
                Serra/ES, CEP 29.165-048
              </span>
            </div>

            <div style={styles.infoItem}>
              <strong>Telefone</strong>
              <span>(27) 3328-5165</span>
            </div>

            <div style={styles.infoItem}>
              <strong>WhatsApp</strong>
              <span>Disponível pelo canal institucional de atendimento</span>
            </div>

            <div style={styles.infoItem}>
              <strong>E-mail</strong>
              <span>gri@larbatista.org.br / financeiro@larbatista.org.br</span>
            </div>
          </div>
        </section>

        {/* ===================== ESTRUTURA FÍSICA ===================== */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Estrutura Física e Acessibilidade</h2>

          <p style={styles.text}>
            O mesmo documento também cita a necessidade de todos os abrigos
            estarem adequados à NBR 9050/ABNT, que destaca as especificações de
            acessibilidade.
          </p>

          <p style={styles.text}>
            O terreno do Lar Batista possui aproximadamente 6.600 m². Nele estão
            instaladas três edificações: duas funcionando como casas lares e uma
            destinada a atividades diversas com as residentes e a comunidade.
            Somadas, essas edificações ultrapassam 900 m² de área construída.
          </p>

          <p style={styles.text}>
            As casas lares existentes são construções do final dos anos 80 que,
            ao longo dos anos, passaram por pequenas manutenções. Atualmente,
            necessitam de ampla reforma, com correções na rede hidráulica,
            predial e elétrica, além da ampliação de marcos, portas, vãos e
            estrutura dos banheiros para torná-los acessíveis.
          </p>

          <p style={styles.text}>
            Essas demandas também são exigidas pelas fiscalizações realizadas
            pelo Ministério Público nas inspeções trimestrais e pelo Juizado da
            Infância e Juventude da Serra, 1ª Vara, conforme documentação
            institucional.
          </p>
        </section>

        {/* ===================== MISSÃO ===================== */}
        <section style={styles.sectionHighlight}>
          <span style={styles.badge}>Nossa Missão</span>

          <h2 style={styles.sectionTitle}>Investir em vidas com amor e cuidado</h2>

          <p style={styles.text}>
            Investir na vida de meninas em situação de vulnerabilidade social,
            por meio do acolhimento e da educação, com dedicação e amor,
            promovendo a reintegração familiar ou adoção.
          </p>
        </section>

        {/* ===================== TRANSFORMANDO VIDAS ===================== */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Transformando Vidas</h2>

          <p style={styles.text}>
            O trabalho desenvolvido pelo Lar Batista busca oferecer um ambiente
            seguro, humanizado e acolhedor, promovendo cuidado, proteção,
            educação, acompanhamento e novas oportunidades.
          </p>

          <p style={styles.text}>
            Cada ação realizada tem como propósito fortalecer vínculos,
            contribuir para o desenvolvimento integral das acolhidas e construir
            caminhos de esperança, dignidade e autonomia.
          </p>
        </section>

        {/* ===================== VISÃO ===================== */}
        <section style={styles.section}>
          <h2 style={styles.centerTitle}>Visão</h2>

          <p style={styles.centerText}>
            Ser uma instituição restauradora de vidas, referência no cuidado de
            crianças, adolescentes e jovens em situação de vulnerabilidade.
          </p>
        </section>

        {/* ===================== VALORES ===================== */}
        <section style={styles.section}>
          <h2 style={styles.centerTitle}>Valores</h2>

          <div style={styles.valuesGrid}>
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Responsabilidade</h3>
              <p style={styles.valueText}>
                Atuar com compromisso, cuidado e seriedade na proteção das
                crianças, adolescentes e jovens acolhidas.
              </p>
            </div>

            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Excelência</h3>
              <p style={styles.valueText}>
                Buscar qualidade, organização e dedicação em todas as ações
                realizadas pela instituição.
              </p>
            </div>

            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Cooperação</h3>
              <p style={styles.valueText}>
                Trabalhar em união com equipe, voluntários, parceiros,
                apoiadores e comunidade.
              </p>
            </div>

            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Respeito</h3>
              <p style={styles.valueText}>
                Valorizar a história, a dignidade e a individualidade de cada
                acolhida.
              </p>
            </div>

            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Dedicação</h3>
              <p style={styles.valueText}>
                Servir com empenho diário, atenção e responsabilidade diante das
                necessidades das residentes.
              </p>
            </div>

            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Amor</h3>
              <p style={styles.valueText}>
                Acreditar que o cuidado com afeto transforma realidades e
                fortalece novos caminhos.
              </p>
            </div>
          </div>
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
    maxWidth: '780px',
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

  heroTitle: {
    margin: '0 0 14px',
    color: '#0B3D91',
    fontSize: '30px'
  },

  quote: {
    margin: '18px 0',
    padding: '18px 22px',
    borderLeft: '5px solid #FFD43B',
    background: '#fff9df',
    borderRadius: '12px',
    color: '#0B3D91',
    fontWeight: 800,
    lineHeight: 1.8
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '18px',
    marginBottom: '26px'
  },

  card: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    border: '1px solid #e5edf7',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.07)'
  },

  cardIcon: {
    width: '58px',
    height: '58px',
    borderRadius: '999px',
    background: '#e8f2ff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '28px',
    marginBottom: '14px'
  },

  cardTitle: {
    color: '#0B3D91',
    margin: '0 0 12px',
    fontSize: '21px'
  },

  section: {
    background: '#ffffff',
    borderRadius: '26px',
    padding: '32px',
    marginBottom: '26px',
    border: '1px solid #e5edf7',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.07)'
  },

  sectionHighlight: {
    background: 'linear-gradient(135deg, #ffffff, #fff7dc)',
    borderRadius: '26px',
    padding: '32px',
    marginBottom: '26px',
    border: '1px solid #ffe08a',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.07)'
  },

  sectionTitle: {
    color: '#0B3D91',
    margin: '0 0 16px',
    fontSize: '28px'
  },

  centerTitle: {
    color: '#0B3D91',
    margin: '0 0 16px',
    fontSize: '28px',
    textAlign: 'center'
  },

  text: {
    color: '#374151',
    lineHeight: 1.8,
    fontSize: '16px',
    margin: '0 0 14px'
  },

  centerText: {
    color: '#374151',
    lineHeight: 1.8,
    fontSize: '17px',
    maxWidth: '780px',
    margin: '0 auto',
    textAlign: 'center'
  },

  list: {
    color: '#374151',
    lineHeight: 1.8,
    paddingLeft: '20px',
    margin: '10px 0 0'
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '14px',
    marginTop: '20px'
  },

  infoItem: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '16px'
  },

  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginTop: '22px'
  },

  valueCard: {
    backgroundColor: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '20px'
  },

  valueTitle: {
    margin: '0 0 10px',
    color: '#0B3D91',
    fontSize: '19px'
  },

  valueText: {
    margin: 0,
    color: '#4b5563',
    lineHeight: 1.7,
    fontSize: '15px'
  }
}

export default QuemSomos