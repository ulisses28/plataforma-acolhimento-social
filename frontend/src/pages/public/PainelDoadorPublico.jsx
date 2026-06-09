import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'
import { listarDoacoes } from '../../services/doacoesService'
import logoLar from '../../assets/logo-lar.jpg'
import { registrarInteracao } from '../../services/analyticsService'

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
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [codigoRecuperacao, setCodigoRecuperacao] = useState('')
  const [codigoDigitado, setCodigoDigitado] = useState('')

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
    setCidade(dados.cidade || dados.municipio || '')
    setEstado(dados.estado || '')
  }, [navigate])

  function salvarAtualizacao(e) {
    e.preventDefault()
    registrarInteracao()

    const atualizado = {
      ...doador,
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      documento: documento.trim(),
      cidade: cidade.trim(),
      municipio: cidade.trim(),
      estado: estado.trim()
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

  function gerarCodigoRecuperacao() {
    registrarInteracao()

    const codigo = String(Math.floor(100000 + Math.random() * 900000))
    setCodigoRecuperacao(codigo)
    setMensagem(
      `Código de recuperação gerado: ${codigo}. Em produção real, ele seria enviado para ${email || telefone}.`
    )
  }

  function alterarSenha(e) {
    e.preventDefault()
    registrarInteracao()

    if (!senhaAtual.trim()) {
      setMensagem('Informe a senha atual.')
      return
    }

    if (!codigoDigitado.trim()) {
      setMensagem('Informe o código de recuperação.')
      return
    }

    if (codigoDigitado !== codigoRecuperacao) {
      setMensagem('Código de recuperação inválido.')
      return
    }

    if (novaSenha.length < 6) {
      setMensagem('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem('A confirmação da senha não confere.')
      return
    }

    const atualizado = {
      ...doador,
      senha: novaSenha
    }

    const lista = JSON.parse(localStorage.getItem(DOADORES_KEY)) || []
    const novaLista = lista.map((item) =>
      item.id === atualizado.id ? atualizado : item
    )

    localStorage.setItem(DOADORES_KEY, JSON.stringify(novaLista))
    localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(atualizado))

    setDoador(atualizado)
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
    setCodigoDigitado('')
    setCodigoRecuperacao('')
    setMensagem('Senha alterada com sucesso.')
  }

  function gerarComprovante(doacao, doadorLogado) {
    registrarInteracao()

    const janela = window.open('', '_blank')
    const municipioDoador = doadorLogado.cidade || doadorLogado.municipio || '-'

    janela.document.write(`
      <html>
        <head>
          <title>Comprovante de Doação</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #111827;
              background:
                linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)),
                radial-gradient(circle at center, #ffe4e6 0%, #f8fbff 45%, #dbeafe 100%);
            }

            .comprovante {
              max-width: 820px;
              margin: auto;
              border: 2px solid #0B3D91;
              border-radius: 18px;
              padding: 34px;
              background: rgba(255,255,255,0.96);
              box-shadow: 0 12px 35px rgba(0,0,0,0.14);
              position: relative;
              overflow: hidden;
            }

            .watermark {
              position: absolute;
              right: -20px;
              bottom: -20px;
              font-size: 150px;
              opacity: 0.08;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #0B3D91;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            .logo {
              width: 120px;
              height: 120px;
              object-fit: contain;
              margin-bottom: 8px;
            }

            h1 {
              color: #0B3D91;
              margin-bottom: 5px;
            }

            h2, h3 {
              color: #111827;
            }

            .frase {
              color: #475569;
              font-style: italic;
            }

            .section {
              margin-top: 20px;
            }

            .label {
              font-weight: bold;
              color: #0B3D91;
            }

            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 13px;
              color: #64748b;
            }

            button {
              margin-top: 25px;
              padding: 12px 18px;
              background: #0B3D91;
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
            }

            @media print {
              button { display: none; }
              body { background: #fff; }
              .comprovante { box-shadow: none; }
            }
          </style>
        </head>

        <body>
          <div class="comprovante">
            <div class="watermark">❤️</div>

            <div class="header">
              <img class="logo" src="${logoLar}" />
              <h1>Lar Batista Albertine Meador</h1>
              <p class="frase">Sua solidariedade ajuda a transformar vidas com amor, cuidado e esperança.</p>
            </div>

            <div class="section">
              <h2>Comprovante de Doação</h2>
              <p><span class="label">Recebedor:</span> Lar Batista Albertine Meador</p>
              <p><span class="label">CNPJ:</span> 27.363.944/0001-80</p>
              <p><span class="label">Estado da Instituição:</span> Espírito Santo - ES</p>
              <p><span class="label">Data:</span> ${doacao.data || '-'}</p>
            </div>

            <div class="section">
              <h3>Dados do Doador</h3>
              <p><span class="label">Nome/Razão Social:</span> ${doadorLogado.nome || '-'}</p>
              <p><span class="label">CPF/CNPJ:</span> ${doadorLogado.documento || '-'}</p>
              <p><span class="label">E-mail:</span> ${doadorLogado.email || '-'}</p>
              <p><span class="label">Telefone:</span> ${doadorLogado.telefone || '-'}</p>
              <p><span class="label">Município:</span> ${municipioDoador}</p>
              <p><span class="label">Estado:</span> ${doadorLogado.estado || '-'}</p>
            </div>

            <div class="section">
              <h3>Dados da Doação</h3>
              <p><span class="label">Valor:</span> ${doacao.valor || 'Valor informado no banco'}</p>
              <p><span class="label">Forma:</span> ${doacao.forma || '-'}</p>
              <p><span class="label">Banco de origem:</span> ${doacao.bancoOrigem || doacao.banco || 'Não informado'}</p>
              <p><span class="label">Status:</span> ${doacao.status || '-'}</p>
              <p><span class="label">Código:</span> ${doacao.id || '-'}</p>
            </div>

            <div class="footer">
              <p>Este comprovante foi gerado automaticamente pelo sistema.</p>
              <p>Obrigado por contribuir com esta missão.</p>
            </div>

            <button onclick="window.print()">Imprimir / Salvar em PDF</button>
          </div>
        </body>
      </html>
    `)

    janela.document.close()
  }

  function sair() {
    registrarInteracao()
    localStorage.removeItem(DOADOR_LOGADO_KEY)
    navigate('/doador/login')
  }

  if (!doador) return null

  const minhasDoacoes = listarDoacoes().filter(
  (doacao) =>
    doacao.doadorId === doador.id ||
    doacao.email === doador.email ||
    doacao.documento === doador.documento
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
              onClick={() => {
                registrarInteracao()
                navigate('/doador/doar')
              }}
            >
              Doar agora
            </button>

            <button
              style={styles.botao}
              onClick={() => {
                registrarInteracao()
                setAba('cadastro')
                setMensagem('')
              }}
            >
              Atualizar cadastro
            </button>

            <button
              style={styles.botao}
              onClick={() => {
                registrarInteracao()
                setAba('historico')
                setMensagem('')
              }}
            >
              Histórico de doações
            </button>

            <button
              style={styles.botao}
              onClick={() => {
                registrarInteracao()
                localStorage.setItem('email_recuperacao_doador', doador.email || '')
                localStorage.removeItem(DOADOR_LOGADO_KEY)
                navigate('/doador/login')
              }}
            >
              Alterar senha
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
                >
                  ✏️ Editar
                </button>
              </div>

              <form onSubmit={salvarAtualizacao} style={styles.form}>
                <label style={styles.label}>Nome ou razão social</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} disabled={!editando} style={editando ? styles.input : styles.inputDisabled} />

                <label style={styles.label}>Documento</label>
                <input value={documento} onChange={(e) => setDocumento(e.target.value)} disabled={!editando} style={editando ? styles.input : styles.inputDisabled} />

                <label style={styles.label}>Telefone</label>
                <input value={telefone} onChange={(e) => setTelefone(e.target.value)} disabled={!editando} style={editando ? styles.input : styles.inputDisabled} />

                <label style={styles.label}>E-mail</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editando} style={editando ? styles.input : styles.inputDisabled} />

                <label style={styles.label}>Município</label>
                <input value={cidade} onChange={(e) => setCidade(e.target.value)} disabled={!editando} style={editando ? styles.input : styles.inputDisabled} />

                <label style={styles.label}>Estado / UF</label>
                <input value={estado} onChange={(e) => setEstado(e.target.value)} disabled={!editando} style={editando ? styles.input : styles.inputDisabled} />

                {editando && (
                  <button type="submit" style={styles.saveButton}>
                    Salvar alterações
                  </button>
                )}
              </form>
            </section>
          )}

          {aba === 'senha' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Alterar senha</h2>

              <p style={styles.infoText}>
                Para segurança, gere um código de recuperação pelo e-mail ou telefone cadastrado.
              </p>

              <button type="button" style={styles.recoveryButton} onClick={gerarCodigoRecuperacao}>
                Gerar código por e-mail/telefone
              </button>

              <form onSubmit={alterarSenha} style={styles.form}>
                <label style={styles.label}>Senha atual</label>
                <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} style={styles.input} />

                <label style={styles.label}>Código de recuperação</label>
                <input value={codigoDigitado} onChange={(e) => setCodigoDigitado(e.target.value)} style={styles.input} />

                <label style={styles.label}>Nova senha</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} style={styles.input} />

                <label style={styles.label}>Confirmar nova senha</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} style={styles.input} />

                <button type="submit" style={styles.saveButton}>
                  Confirmar alteração de senha
                </button>
              </form>
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
                        <th style={styles.th}>Banco</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Comprovante</th>
                      </tr>
                    </thead>

                    <tbody>
                      {minhasDoacoes.map((d) => (
                        <tr key={d.id}>
                          <td style={styles.td}>{d.data}</td>
                          <td style={styles.td}>{d.valor}</td>
                          <td style={styles.td}>{d.forma}</td>
                          <td style={styles.td}>{d.bancoOrigem || d.banco || 'Não informado'}</td>
                          <td style={styles.td}>{d.status}</td>
                          <td style={styles.td}>
                            <button
                              type="button"
                              style={styles.receiptButton}
                              onClick={() => gerarComprovante(d, doador)}
                            >
                              Baixar comprovante
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {mensagem && <p style={styles.success}>{mensagem}</p>}

          <button onClick={sair} style={styles.sair}>Sair</button>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f4f8ff', padding: '40px 20px' },
  container: { maxWidth: '900px', margin: '0 auto' },
  card: { background: '#ffffff', padding: '34px', borderRadius: '20px', boxShadow: '0 4px 18px rgba(0,0,0,0.08)' },
  title: { color: '#0B3D91', margin: 0, fontSize: '2rem' },
  welcome: { marginTop: '18px', color: '#111827' },
  botoes: { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' },
  botao: { padding: '14px', background: '#0B3D91', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
  section: { marginTop: '28px', background: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '16px', padding: '22px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  sectionTitle: { color: '#0B3D91', margin: 0 },
  editButton: { background: '#ffffff', color: '#0B3D91', border: '1px solid #0B3D91', padding: '8px 12px', borderRadius: '999px', cursor: 'pointer', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', marginTop: '14px' },
  label: { marginTop: '12px', marginBottom: '6px', color: '#374151', fontWeight: '700' },
  input: { minHeight: '44px', borderRadius: '10px', border: '1px solid #bfdbfe', padding: '0 12px', background: '#f8fbff' },
  inputDisabled: { minHeight: '44px', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '0 12px', background: '#f3f4f6', color: '#6b7280' },
  saveButton: { marginTop: '20px', background: '#166534', color: '#ffffff', border: 'none', padding: '13px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' },
  recoveryButton: { marginTop: '14px', background: '#ffc928', color: '#002855', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' },
  infoText: { color: '#475569', lineHeight: '1.6' },
  success: { color: '#166534', fontWeight: '700', marginTop: '12px' },
  empty: { color: '#6b7280' },
  tableWrapper: { overflowX: 'auto', marginTop: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#ffffff', borderRadius: '12px', overflow: 'hidden' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#374151' },
  td: { padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#1f2937' },
  receiptButton: { background: '#0B3D91', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  sair: { marginTop: '28px', padding: '12px 22px', background: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }
}

export default PainelDoadorPublico