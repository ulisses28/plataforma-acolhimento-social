import { useNavigate } from 'react-router-dom'

/*
  Botão de voltar padrão UX moderno
  - Estilo minimalista
  - Usado dentro do header
*/

function BackButton({ label = 'Voltar' }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      style={styles.button}
      title="Voltar"
    >
      <span style={styles.icon}>←</span>
      <span style={styles.text}>{label}</span>
    </button>
  )
}

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0
  },
  icon: {
    fontSize: '18px'
  },
  text: {
    fontWeight: '500'
  }
}

export default BackButton