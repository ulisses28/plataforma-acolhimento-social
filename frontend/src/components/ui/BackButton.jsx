import { useLocation, useNavigate } from 'react-router-dom'

function BackButton({ label = '← Voltar' }) {
  const navigate = useNavigate()
  const location = useLocation()

  function voltar() {
    const estaNoAdmin = location.pathname.startsWith('/admin')
    const estaNoDashboard = location.pathname === '/admin/dashboard'
    const estaNoLoginAdmin = location.pathname === '/admin/login'

    if (estaNoDashboard) {
      const confirmar = confirm('Tem certeza que deseja sair do sistema?')

      if (!confirmar) return

      localStorage.removeItem('admin-auth')
      navigate('/admin/login')
      return
    }

    if (estaNoAdmin && !estaNoLoginAdmin) {
      navigate('/admin/dashboard')
      return
    }

    navigate('/')
  }

  return (
    <button type="button" onClick={voltar} style={styles.button}>
      {label}
    </button>
  )
}

const styles = {
  button: {
    background: 'transparent',
    border: 'none',
    color: '#0B3D91',
    fontWeight: '900',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '1rem'
  }
}

export default BackButton