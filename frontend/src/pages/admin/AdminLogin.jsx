import { Link } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'

/*
  Página de Login Administrativo
  - Tela de acesso ao painel interno
  - Mantém botão voltar no topo do card
*/

function AdminLogin() {
  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <BackButton />

        <div style={styles.card}>
          <h1 style={styles.title}>Login do Administrador</h1>

          <p style={styles.subtitle}>
            Acesso exclusivo da instituição para gerenciamento interno do sistema.
          </p>

          <form style={styles.form}>
            <input type="email" placeholder="E-mail" style={styles.input} />
            <input type="password" placeholder="Senha" style={styles.input} />

            {/* Futuramente substituir por autenticação real */}
            <Link to="/admin/dashboard" style={styles.button}>
              Entrar no painel
            </Link>
          </form>
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    padding: '20px'
  },
  wrapper: {
    width: '100%',
    maxWidth: '460px'
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  title: {
    marginTop: 0,
    color: '#0B3D91'
  },
  subtitle: {
    color: '#4b5563',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    height: '46px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    padding: '0 14px',
    outline: 'none',
    fontSize: '14px'
  },
  button: {
    textDecoration: 'none',
    textAlign: 'center',
    backgroundColor: '#0B3D91',
    color: '#ffffff',
    padding: '13px 18px',
    borderRadius: '12px',
    fontWeight: '600'
  }
}

export default AdminLogin