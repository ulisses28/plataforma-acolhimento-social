import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      style={styles.button}
    >
      ← Voltar
    </button>
  )
}

const styles = {
  button: {
    background: 'transparent',
    border: 'none',
    color: '#0B3D91',
    fontWeight: '900',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginBottom: '24px'
  }
}

export default BackButton