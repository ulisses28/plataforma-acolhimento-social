import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'
import { listarDoacoes } from '../../services/doacoesService'

const DOADORES_KEY = 'doadores_lar_batista'
const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'

function PainelDoadorPublico() {
  const navigate = useNavigate()

  const [doador, setDoador] = useState(null)
  const [aba, setAba] = useState('')
  const [editando, setEditando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [documento, setDocumento] = useState('')

  useEffect(() => {
    const logado = localStorage.getItem(DOADOR_LOGADO_KEY)

    if (!logado) {
      navigate('/doador/login')
      return
    }

    const dados = JSON.parse(logado)

    setDoador(dados)
    setNome(dados.nome || '')
    setTelefone(dados.telefone || '')
    setEmail(dados.email || '')
    setDocumento(dados.documento || '')
  }, [navigate])

  function salvarAtualizacao(e) {
    e.preventDefault()

    const atualizado = {
      ...doador,
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      documento: documento.trim()
    }

    const lista = JSON.parse(localStorage.getItem(DOADORES_KEY)) || []

    const novaLista = lista.map((item) =>
      item.id === atualizado.id ? atualizado : item
    )

    localStorage.setItem(DOADORES_KEY, JSON.stringify(novaLista))
    localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(atualizado))

    setDoador(atualizado)
    setEditando(false)
    setMensagem('Cadastro atualizado com sucesso.')
  }

  function sair() {
    localStorage.removeItem(DOADOR_LOGADO_KEY)
    navigate('/doador/login')
  }

  if (!doador) return null

  const minhasDoacoes = listarDoacoes().filter(
    (doacao) => doacao.doador === doador.nome
  )

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <section style={styles.card}>
          <h1 style={styles.title}>Área do Doador</h1>

          <p style={styles.welcome}>
            Bem-vindo, <strong>{doador.nome}</strong>
          </p>

          <div style={styles.botoes}>
            <button
              style={styles.botao}
              onClick={() => navigate('/doar-agora')}
            >
              Doar agora
            </button>

            <button
              style={styles.botao}
              onClick={() => {
                setAba('cadastro')
                setMensagem('')
              }}
            >
              Atualizar cadastro
            </button>

            <button
              style={styles.botao}
              onClick={() => {
                setAba('historico')
                setMensagem('')
              }}
            >
              Histórico de doações
            </button>
          </div>

          {aba === 'cadastro' && (
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Meu cadastro</h2>

                <button
                  type="button"
                  style={styles.editButton}
                  onClick={() => setEditando(true)}
                  title="Editar cadastro"
                >
                  ✏️ Editar
                </button>
              </div>

              <form onSubmit={salvarAtualizacao} style={styles.form}>
                <label style={styles.label}>Nome ou razão social</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                />

                <label style={styles.label}>Documento</label>
                <input
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                />

                <label style={styles.label}>Telefone</label>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                />

                <label style={styles.label}>E-mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                />

                {editando && (
                  <button type="submit" style={styles.saveButton}>
                    Salvar alterações
                  </button>
                )}
              </form>

              {mensagem && <p style={styles.success}>{mensagem}</p>}
            </section>
          )}

          {aba === 'historico' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Meu histórico de doações</h2>

              {minhasDoacoes.length === 0 ? (
                <p style={styles.empty}>Nenhuma doação encontrada.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Data</th>
                        <th style={styles.th}>Valor</th>
                        <th style={styles.th}>Forma</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {minhasDoacoes.map((d) => (
                        <tr key={d.id}>
                          <td style={styles.td}>{d.data}</td>
                          <td style={styles.td}>{d.valor}</td>
                          <td style={styles.td}>{d.forma}</td>
                          <td style={styles.td}>{d.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          <button onClick={sair} style={styles.sair}>
            Sair
          </button>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f8ff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '820px',
    margin: '0 auto'
  },
  card: {
    background: '#ffffff',
    padding: '34px',
    borderRadius: '20px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  title: {
    color: '#0B3D91',
    margin: 0,
    fontSize: '2rem'
  },
  welcome: {
    marginTop: '18px',
    color: '#111827'
  },
  botoes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '24px'
  },
  botao: {
    padding: '14px',
    background: '#0B3D91',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  section: {
    marginTop: '28px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '22px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  sectionTitle: {
    color: '#0B3D91',
    margin: 0
  },
  editButton: {
    background: '#ffffff',
    color: '#0B3D91',
    border: '1px solid #0B3D91',
    padding: '8px 12px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '14px'
  },
  label: {
    marginTop: '12px',
    marginBottom: '6px',
    color: '#374151',
    fontWeight: '700'
  },
  input: {
    minHeight: '44px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    padding: '0 12px'
  },
  inputDisabled: {
    minHeight: '44px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    padding: '0 12px',
    background: '#f3f4f6',
    color: '#6b7280'
  },
  saveButton: {
    marginTop: '20px',
    background: '#166534',
    color: '#ffffff',
    border: 'none',
    padding: '13px',
    borderRadius: '10px',
    fontWeight: '800',
    cursor: 'pointer'
  },
  success: {
    color: '#166534',
    fontWeight: '700',
    marginTop: '12px'
  },
  empty: {
    color: '#6b7280'
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1f2937'
  },
  sair: {
    marginTop: '28px',
    padding: '12px 22px',
    background: '#c0392b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '800'
  }
}

export default PainelDoadorPublico