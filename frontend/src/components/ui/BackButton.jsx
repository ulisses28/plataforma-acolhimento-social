import { useLocation, useNavigate } from 'react-router-dom'

function BackButton({ label = '← Voltar' }) {
  const navigate = useNavigate()
  const location = useLocation()

  function voltar() {
    const rota = location.pathname

    if (rota === '/admin/dashboard') {
      const ok = confirm('Tem certeza que deseja sair do sistema administrativo?')
      if (!ok) return

      localStorage.removeItem('admin-auth')
      navigate('/admin/login')
      return
    }

    if (rota.startsWith('/admin') && rota !== '/admin/login') {
      navigate('/admin/dashboard')
      return
    }

    if (rota === '/doador/painel') {
      const ok = confirm('Deseja sair da área do doador?')
      if (!ok) return

      localStorage.removeItem('doador_logado_lar_batista')
      navigate('/doador/login')
      return
    }

    if (rota.startsWith('/doador') && rota !== '/doador/login') {
      navigate('/doador/painel')
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