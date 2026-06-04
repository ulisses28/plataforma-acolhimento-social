import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import BackButton from '../../components/ui/BackButton'
import { redefinirSenhaDoador } from '../../services/doadorAuthService'

function RedefinirSenha() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const token = params.get('token')

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('erro')
  const [carregando, setCarregando] = useState(false)

  function senhaForte(valor) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(
      valor
    )
  }

  async function salvarNovaSenha(e) {
    e.preventDefault()
    setMensagem('')

    if (!token) {
      setTipoMensagem('erro')
      setMensagem('Link inválido ou expirado.')
      return
    }

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setTipoMensagem('erro')
      setMensagem('Informe e confirme a nova senha.')
      return
    }

    if (!senhaForte(novaSenha.trim())) {
      setTipoMensagem('erro')
      setMensagem(
        'A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      )
      return
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      setTipoMensagem('erro')
      setMensagem('As senhas não conferem.')
      return
    }

    try {
      setCarregando(true)

      await redefinirSenhaDoador({
        token,
        novaSenha: novaSenha.trim()
      })

      setTipoMensagem('sucesso')
      setMensagem('Senha redefinida com sucesso. Redirecionando para o login...')

      setTimeout(() => {
        navigate('/doador/login')
      }, 1800)
    } catch (error) {
      setTipoMensagem('erro')
      setMensagem(error.message || 'Erro ao redefinir senha.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <section style={styles.card}>
          <h1 style={styles.title}>Redefinir senha</h1>

          <p style={styles.subtitle}>
            Crie uma nova senha para acessar sua área de doador.
          </p>

          <form onSubmit={salvarNovaSenha} style={styles.form}>
            <label style={styles.label}>Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={styles.input}
              placeholder="Digite a nova senha"
            />

            <label style={styles.label}>Confirmar nova senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
              placeholder="Confirme a nova senha"
            />

            <button type="submit" style={styles.button} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>

          {mensagem && (
            <p
              style={{
                ...styles.message,
                color: tipoMensagem === 'sucesso' ? '#166534' : '#991b1b'
              }}
            >
              {mensagem}
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F1F5F9',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '520px',
    margin: '0 auto'
  },

  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },

  title: {
    color: '#0B3D91',
    marginTop: 0
  },

  subtitle: {
    color: '#4b5563',
    lineHeight: '1.6'
  },

  form: {
    display: 'flex',
    flexDirection: 'column'
  },

  label: {
    marginTop: '14px',
    marginBottom: '6px',
    color: '#374151',
    fontWeight: '700'
  },

  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },

  button: {
    marginTop: '24px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  message: {
    marginTop: '16px',
    fontWeight: '700'
  }
}

export default RedefinirSenha