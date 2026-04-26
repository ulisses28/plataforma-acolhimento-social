import imgCasaLar from '../../assets/MoradiaAlimentacao.jpg'
import imgEducacao from '../../assets/educacaoCapacitacao.jpg'
import imgComunidade from '../../assets/EnvolvimentodaComunidade.jpg'
import imgBazar1 from '../../assets/bazarSolidario.jpg'
import imgBazar2 from '../../assets/bazarSolidario2.jpg'

function Projetos() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Nossos Projetos</h1>
          <p style={styles.subtitle}>
            Conheça as ações que impactam diretamente a vida das crianças, adolescentes e jovens acolhidas.
          </p>
        </header>

        <section style={styles.section}>
          <div style={styles.imageBox}>
            <img src={imgCasaLar} alt="Moradia e alimentação" style={styles.image} />
          </div>

          <div style={styles.textBox}>
            <h2 style={styles.sectionTitle}>Acolhimento, Moradia e Alimentação</h2>
            <p style={styles.text}>
              O Lar oferece um ambiente seguro, acolhedor e organizado para garantir cuidado,
              proteção, alimentação e dignidade às residentes.
            </p>
          </div>
        </section>

        <section style={styles.sectionReverse}>
          <div style={styles.textBox}>
            <h2 style={styles.sectionTitle}>Educação e Capacitação</h2>
            <p style={styles.text}>
              As atividades educativas e de capacitação contribuem para o desenvolvimento
              pessoal, social e profissional das acolhidas.
            </p>
          </div>

          <div style={styles.imageBox}>
            <img src={imgEducacao} alt="Educação e capacitação" style={styles.image} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.imageBox}>
            <img src={imgComunidade} alt="Envolvimento da comunidade" style={styles.image} />
          </div>

          <div style={styles.textBox}>
            <h2 style={styles.sectionTitle}>Envolvimento da Comunidade</h2>
            <p style={styles.text}>
              Voluntários, parceiros e apoiadores fortalecem as ações sociais e ajudam a
              ampliar o impacto da instituição.
            </p>
          </div>
        </section>

        <section style={styles.sectionReverse}>
          <div style={styles.textBox}>
            <h2 style={styles.sectionTitle}>Bazar Solidário</h2>
            <p style={styles.text}>
              O bazar solidário é uma das principais fontes de arrecadação da instituição.
              Com a venda de itens doados, conseguimos manter e expandir nossas atividades.
            </p>
          </div>

          <div style={styles.imageBox}>
            <img src={imgBazar1} alt="Bazar Solidário" style={styles.image} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.imageBox}>
            <img src={imgBazar2} alt="Itens do Bazar Solidário" style={styles.image} />
          </div>

          <div style={styles.textBox}>
            <h2 style={styles.sectionTitle}>Doações que Geram Recursos</h2>
            <p style={styles.text}>
              Roupas, calçados e objetos doados são organizados e vendidos no bazar,
              revertendo recursos para as necessidades das residentes.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    background: '#F1F5F9',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    margin: 0,
    color: '#0B3D91'
  },
  subtitle: {
    color: '#4b5563',
    marginTop: '10px',
    lineHeight: '1.6'
  },
  section: {
    display: 'flex',
    gap: '30px',
    marginBottom: '40px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  sectionReverse: {
    display: 'flex',
    gap: '30px',
    marginBottom: '40px',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse'
  },
  imageBox: {
    flex: 1,
    minWidth: '280px'
  },
  textBox: {
    flex: 1,
    minWidth: '280px'
  },
  image: {
    width: '100%',
    height: '320px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    color: '#0B3D91'
  },
  text: {
    color: '#374151',
    lineHeight: '1.7'
  }
}

export default Projetos