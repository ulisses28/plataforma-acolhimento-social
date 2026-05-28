import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BackButton from '../../components/ui/BackButton'
import { apiPost } from '../../services/api'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function fazerLogin(e) {
    e.preventDefault()
    setMensagem('')

    if (!email.trim()) {
      setMensagem('Informe o e-mail.')
      return
    }

    if (!senha.trim()) {
      setMensagem('Informe a senha.')
      return
    }

    try {
      setCarregando(true)

      const resposta = await apiPost('/auth/login', {
        email: email.trim().toLowerCase(),
        senha
      })

      localStorage.setItem('admin-auth', 'true')
      localStorage.setItem('admin-token', resposta.token)
      localStorage.setItem('admin-data', JSON.stringify(resposta.admin))

      if (resposta.precisaTrocarSenha) {
        localStorage.setItem('admin-trocar-senha', 'true')
        navigate('/admin/alterar-senha')
        return
      }

      localStorage.removeItem('admin-trocar-senha')
      navigate('/admin/dashboard')
    } catch (error) {
      setMensagem('E-mail ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <BackButton />

        <div style={styles.card}>
          <h1 style={styles.title}>Login do Administrador</h1>

          <p style={styles.subtitle}>
            Acesso exclusivo da instituição para gerenciamento interno.
          </p>

          <form style={styles.form} onSubmit={fazerLogin}>
            <input
              type="email"
              placeholder="E-mail"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              style={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <button type="submit" style={styles.button} disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>
            <button
              type="button"
              style={styles.linkButton}
              onClick={() =>
                alert('Solicite a recuperação de senha ao responsável técnico do sistema.')
              }
            >
              Esqueci minha senha
            </button>

          {mensagem && <p style={styles.error}>{mensagem}</p>}
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
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: '#0B3D91',
    color: '#ffffff',
    padding: '13px 18px',
    borderRadius: '12px',
    fontWeight: '600'
  },

  error: {
    marginTop: '16px',
    color: '#991b1b',
    fontWeight: '700'
  },
  linkButton: {
  background: 'transparent',
  border: 'none',
  color: '#0B3D91',
  fontWeight: '800',
  cursor: 'pointer',
  textDecoration: 'underline'
  },
}

export default AdminLogin