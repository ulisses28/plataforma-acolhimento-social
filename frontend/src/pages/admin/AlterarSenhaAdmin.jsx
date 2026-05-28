import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BackButton from '../../components/ui/BackButton'
import { apiPut } from '../../services/api'

function AlterarSenhaAdmin() {
  const navigate = useNavigate()

  const admin =
    JSON.parse(localStorage.getItem('admin-data')) || {}

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function senhaForte(senha) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(
      senha
    )
  }

  async function alterarSenha(e) {
    e.preventDefault()

    setMensagem('')
    setErro('')

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro('Preencha todos os campos.')
      return
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (!senhaForte(novaSenha)) {
      setErro(
        'A nova senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      )

      return
    }

    try {
      setCarregando(true)

      const resposta = await apiPut('/auth/alterar-senha', {
        email: admin.email,
        senhaAtual,
        novaSenha
      })

      setMensagem(resposta.mensagem)

      localStorage.removeItem('admin-trocar-senha')

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1800)
    } catch (error) {
      setErro('Não foi possível alterar a senha.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <BackButton />

        <div style={styles.card}>
          <h1 style={styles.title}>
            Segurança da Conta
          </h1>

          <p style={styles.subtitle}>
            Atualize sua senha administrativa.
          </p>

          <form
            style={styles.form}
            onSubmit={alterarSenha}
          >
            <input
              type="password"
              placeholder="Senha atual"
              style={styles.input}
              value={senhaAtual}
              onChange={(e) =>
                setSenhaAtual(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Nova senha"
              style={styles.input}
              value={novaSenha}
              onChange={(e) =>
                setNovaSenha(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Confirmar nova senha"
              style={styles.input}
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(e.target.value)
              }
            />

            <button
              type="submit"
              style={styles.button}
              disabled={carregando}
            >
              {carregando
                ? 'Salvando...'
                : 'Alterar senha'}
            </button>
          </form>

          {erro && (
            <p style={styles.error}>
              {erro}
            </p>
          )}

          {mensagem && (
            <p style={styles.success}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    padding: '20px'
  },

  wrapper: {
    width: '100%',
    maxWidth: '500px'
  },

  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '32px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  title: {
    color: '#0B3D91'
  },

  subtitle: {
    color: '#475569',
    marginBottom: '24px'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  input: {
    height: '48px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '0 14px'
  },

  button: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  error: {
    marginTop: '18px',
    color: '#dc2626',
    fontWeight: '700'
  },

  success: {
    marginTop: '18px',
    color: '#16a34a',
    fontWeight: '700'
  }
}

export default AlterarSenhaAdmin