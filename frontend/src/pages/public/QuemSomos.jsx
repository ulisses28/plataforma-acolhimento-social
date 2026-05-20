import imgQuemSomos from '../../assets/quemSomos.jpg'
import imgMissao1 from '../../assets/missao1.jpg'
import imgMissao2 from '../../assets/missao2.jpg'
import { registrarInteracao } from '../../services/analyticsService'

/*
  PÁGINA: QUEM SOMOS

  Estrutura:
  1. Quem somos (imagem + texto)
  2. Missão (imagem + texto)
  3. Impacto (imagem + texto)
  4. Visão
  5. Valores (cards com descrição)

  OBS:
  - Layout em blocos (UX moderno)
  - Imagens intercaladas para dar dinâmica visual
*/

function QuemSomos() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* ===================== QUEM SOMOS ===================== */}
        <section style={styles.section}>
          
          {/* IMAGEM */}
          <div style={styles.imageBox}>
            <img src={imgQuemSomos} alt="Equipe e doações" style={styles.image} />
          </div>

          {/* TEXTO */}
          <div style={styles.textBox}>
            <h2 style={styles.title}>Quem Somos</h2>

            <p style={styles.text}>
              O <strong>Lar Batista Albertine Meador</strong> é uma instituição fundada em 1949
              que atua no acolhimento de crianças, adolescentes e jovens em situação de vulnerabilidade social.
            </p>

            <p style={styles.text}>
              Oferecemos moradia, educação, cuidado e acompanhamento completo para o desenvolvimento
              físico, emocional e social das acolhidas.
            </p>

            <p style={styles.text}>
              Nosso propósito é transformar vidas através do amor, da dignidade e de novas oportunidades.
            </p>
          </div>

        </section>

        {/* ===================== MISSÃO ===================== */}
        <section style={styles.sectionReverse}>
          
          <div style={styles.textBox}>
            <h2 style={styles.title}>Nossa Missão</h2>

            <p style={styles.text}>
              Investir na vida de crianças e adolescentes de 0 a 21 anos em situação de vulnerabilidade,
              através do acolhimento e da educação com dedicação e amor.
            </p>

            <p style={styles.text}>
              Promovemos a reintegração familiar ou adoção, criando caminhos reais para um futuro melhor.
            </p>
          </div>

          <div style={styles.imageBox}>
            <img src={imgMissao1} alt="Crianças acolhidas" style={styles.image} />
          </div>

        </section>

        {/* ===================== IMPACTO ===================== */}
        <section style={styles.section}>
          
          <div style={styles.imageBox}>
            <img src={imgMissao2} alt="Impacto social" style={styles.image} />
          </div>

          <div style={styles.textBox}>
            <h2 style={styles.title}>Transformando Vidas</h2>

            <p style={styles.text}>
              Cada criança acolhida recebe cuidado, atenção e oportunidades de crescimento pessoal e social.
            </p>

            <p style={styles.text}>
              Trabalhamos diariamente para construir histórias de superação, esperança e autonomia.
            </p>
          </div>

        </section>

        {/* ===================== VISÃO ===================== */}
        <section style={styles.card}>
          <h2 style={styles.titleCenter}>Visão</h2>

          <p style={styles.textCenter}>
            Ser uma instituição restauradora de vidas, referência no cuidado de crianças,
            adolescentes e jovens em situação de vulnerabilidade.
          </p>
        </section>

        {/* ===================== VALORES ===================== */}
        <section style={styles.card}>
          <h2 style={styles.titleCenter}>Valores</h2>

          <div style={styles.valuesGrid}>

            {/* RESPONSABILIDADE */}
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Responsabilidade</h3>
              <p style={styles.valueText}>
                Atuamos com compromisso, cuidado e seriedade na proteção das crianças,
                adolescentes e jovens acolhidas.
              </p>
            </div>

            {/* EXCELÊNCIA */}
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Excelência</h3>
              <p style={styles.valueText}>
                Buscamos oferecer um acolhimento humanizado, seguro e de qualidade
                em todas as ações da instituição.
              </p>
            </div>

            {/* COOPERAÇÃO */}
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Cooperação</h3>
              <p style={styles.valueText}>
                Trabalhamos em união com equipe, voluntários, parceiros e comunidade
                para transformar vidas.
              </p>
            </div>

            {/* RESPEITO */}
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Respeito</h3>
              <p style={styles.valueText}>
                Valorizamos a história, a dignidade e a individualidade de cada acolhida.
              </p>
            </div>

            {/* DEDICAÇÃO */}
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Dedicação</h3>
              <p style={styles.valueText}>
                Servimos com empenho diário, amor e atenção às necessidades das residentes.
              </p>
            </div>

            {/* AMOR */}
            <div style={styles.valueCard}>
              <h3 style={styles.valueTitle}>Amor</h3>
              <p style={styles.valueText}>
                Acreditamos que o cuidado com afeto transforma realidades e fortalece novos caminhos.
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
    background: '#F1F5F9',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },

  /* Layout padrão */
  section: {
    display: 'flex',
    gap: '30px',
    marginBottom: '40px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  /* Layout invertido */
  sectionReverse: {
    display: 'flex',
    gap: '30px',
    marginBottom: '40px',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse'
  },

  imageBox: {
    flex: 1
  },

  textBox: {
    flex: 1
  },

  image: {
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
  },

  title: {
    color: '#0B3D91'
  },

  text: {
    color: '#374151',
    lineHeight: '1.7'
  },

  card: {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '20px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },

  titleCenter: {
    textAlign: 'center',
    color: '#0B3D91'
  },

  textCenter: {
    textAlign: 'center',
    color: '#374151'
  },

  /* GRID DE VALORES */
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    marginTop: '20px'
  },

  valueCard: {
    backgroundColor: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '18px'
  },

  valueTitle: {
    margin: '0 0 8px 0',
    color: '#0B3D91'
  },

  valueText: {
    margin: 0,
    color: '#4b5563',
    lineHeight: '1.6',
    fontSize: '14px'
  }
}

export default QuemSomos