import { Link } from 'react-router-dom'
import { registrarInteracao } from '../../services/analyticsService'

function Login() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Entrar no sistema</h1>
        <p style={styles.subtitle}>
          Escolha como deseja acessar a plataforma.
        </p>

        <div style={styles.cards}>
          

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Doador</h2>
            <p style={styles.cardText}>
              Acesse seu painel para acompanhar seu histórico de doações e seus
              dados de cadastro.
            </p>
            <Link to="/doador/login" style={styles.secondaryButton}>
              Entrar como doador
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    padding: '40px 20px'
  },
  container: {
    width: '100%',
    maxWidth: '1100px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.2rem',
    color: '#0B3D91',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#4b5563',
    fontSize: '1rem',
    marginBottom: '35px'
  },
  cards: {
  maxWidth: '620px',
  margin: '35px auto 0',
  display: 'flex',
  justifyContent: 'center'
  },

  card: {
    width: '100%',
    background: '#fff',
    borderRadius: '22px',
    padding: '34px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    color: '#0B3D91',
    marginBottom: '12px'
  },
  cardText: {
    color: '#374151',
    lineHeight: '1.7',
    marginBottom: '24px'
  },
  primaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    backgroundColor: '#0B3D91',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '600'
  },
  secondaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    backgroundColor: '#2D7FF9',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '600'
  }
}

export default Login