import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'
import { listarDoacoes } from '../../services/doacoesService'
import logoLar from '../../assets/logo-lar.jpg'
import { registrarInteracao } from '../../services/analyticsService'

import {
  solicitarCodigoRecuperacao,
  redefinirSenhaDoador
} from '../../services/doadorAuthService'

/*
  PÁGINA: PAINEL DO DOADOR

  Objetivo desta versão:
  - Manter ações principais do painel.
  - Manter atualização de cadastro.
  - Manter histórico de doações.
  - Manter comprovante.
  - Alterar senha dentro do próprio painel.
  - Enviar código de verificação por e-mail.
  - Bloquear reenvio por 3 minutos e 20 segundos.
  - Depois liberar como "Reenviar código de verificação".
*/

const DOADORES_KEY = 'doadores_lar_batista'
const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'

const TEMPO_REENVIO_CODIGO = 200
const BASE_COOLDOWN_SENHA_PAINEL_KEY = 'painel_doador_senha_ultimo_envio'

const OPCOES_GENERO = [
  'Prefiro não dizer',
  'Feminino',
  'Masculino',
  'Mulher trans',
  'Homem trans',
  'Pessoa não binária',
  'Agênero',
  'Gênero fluido',
  'Outro'
]

function PainelDoadorPublico() {
  const navigate = useNavigate()

  const [doador, setDoador] = useState(null)
  const [aba, setAba] = useState('')
  const [editando, setEditando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('sucesso')

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [documento, setDocumento] = useState('')
  const [genero, setGenero] = useState('Prefiro não dizer')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [codigoDigitado, setCodigoDigitado] = useState('')

  const [segundosReenvio, setSegundosReenvio] = useState(0)
  const [carregandoCodigo, setCarregandoCodigo] = useState(false)
  const [carregandoSenha, setCarregandoSenha] = useState(false)

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
    setGenero(dados.genero || 'Prefiro não dizer')
    setCidade(dados.cidade || dados.municipio || '')
    setEstado(dados.estado || '')
  }, [navigate])

  /*
    Contador do botão de reenvio do código.
    Mesmo se atualizar a página, o tempo continua porque fica salvo no localStorage.
  */
  useEffect(() => {
    function atualizarContador() {
      setSegundosReenvio(calcularSegundosRestantesSenha(email))
    }

    atualizarContador()

    const intervalo = setInterval(atualizarContador, 1000)

    return () => clearInterval(intervalo)
  }, [email, aba])

  function registrarAcao() {
    try {
      registrarInteracao()
    } catch {
      /*
        Não interrompe o painel se o analytics falhar.
      */
    }
  }

  function mostrarSucesso(texto) {
    setTipoMensagem('sucesso')
    setMensagem(texto)
  }

  function mostrarErro(texto) {
    setTipoMensagem('erro')
    setMensagem(texto)
  }

  /*
    Atualiza o cadastro no localStorage.
    Em uma próxima etapa, se houver endpoint de atualização no backend,
    podemos trocar essa parte por uma chamada API.
  */
  function salvarAtualizacao(e) {
    e.preventDefault()
    registrarAcao()

    if (!nome.trim()) {
      mostrarErro('Informe o nome ou razão social.')
      return
    }

    if (!email.trim()) {
      mostrarErro('Informe o e-mail.')
      return
    }

    if (!genero.trim()) {
      mostrarErro('Selecione o gênero ou marque Prefiro não dizer.')
      return
    }

    const atualizado = {
      ...doador,
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      documento: documento.trim(),
      genero,
      cidade: cidade.trim(),
      municipio: cidade.trim(),
      estado: estado.trim()
    }

    const lista = JSON.parse(localStorage.getItem(DOADORES_KEY)) || []

    const existeNaLista = lista.some((item) => item.id === atualizado.id)

    const novaLista = existeNaLista
      ? lista.map((item) => (item.id === atualizado.id ? atualizado : item))
      : [atualizado, ...lista]

    localStorage.setItem(DOADORES_KEY, JSON.stringify(novaLista))
    localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(atualizado))

    setDoador(atualizado)
    setEditando(false)
    mostrarSucesso('Cadastro atualizado com sucesso.')
  }

  /*
    Envia o código de verificação por e-mail usando o backend.
    Este é o mesmo fluxo usado na tela de recuperação de senha.
  */
  async function enviarCodigoSenhaPainel() {
    registrarAcao()
    setMensagem('')

    const emailDoador = email.trim().toLowerCase()

    if (!emailDoador) {
      mostrarErro('E-mail do doador não encontrado.')
      return
    }

    const restante = calcularSegundosRestantesSenha(emailDoador)

    if (restante > 0) {
      mostrarErro(
        `Aguarde ${formatarTempoReenvioSenha(restante)} para reenviar o código.`
      )
      return
    }

    try {
      setCarregandoCodigo(true)

      await solicitarCodigoRecuperacao(emailDoador)

      registrarEnvioCodigoSenha(emailDoador)
      setSegundosReenvio(TEMPO_REENVIO_CODIGO)

      mostrarSucesso(
        'Código de verificação enviado para o e-mail cadastrado. Confira sua caixa de entrada e spam.'
      )
    } catch (error) {
      mostrarErro(
        error?.response?.data?.mensagem ||
          error?.data?.mensagem ||
          error?.mensagem ||
          error?.message ||
          'Não foi possível enviar o código de verificação.'
      )
    } finally {
      setCarregandoCodigo(false)
    }
  }

  /*
    Altera a senha usando:
    - e-mail do doador;
    - código recebido por e-mail;
    - nova senha.

    Não usamos mais senha atual aqui, porque a validação segura é feita
    pelo código enviado por e-mail.
  */
  async function alterarSenha(e) {
    e.preventDefault()
    registrarAcao()
    setMensagem('')

    const emailDoador = email.trim().toLowerCase()

    if (!emailDoador) {
      mostrarErro('E-mail do doador não encontrado.')
      return
    }

    if (!codigoDigitado.trim()) {
      mostrarErro('Informe o código enviado por e-mail.')
      return
    }

    if (!novaSenha.trim()) {
      mostrarErro('Informe a nova senha.')
      return
    }

    if (!senhaFortePainel(novaSenha.trim())) {
      mostrarErro(
        'A nova senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      )
      return
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      mostrarErro('A confirmação da senha não confere.')
      return
    }

    try {
      setCarregandoSenha(true)

      await redefinirSenhaDoador({
        email: emailDoador,
        codigo: codigoDigitado.trim(),
        novaSenha: novaSenha.trim()
      })

      removerCooldownSenha(emailDoador)

      setNovaSenha('')
      setConfirmarSenha('')
      setCodigoDigitado('')
      setSegundosReenvio(0)

      mostrarSucesso('Senha alterada com sucesso.')
    } catch (error) {
      mostrarErro(
        error?.response?.data?.mensagem ||
          error?.data?.mensagem ||
          error?.mensagem ||
          error?.message ||
          'Não foi possível alterar a senha. Verifique o código recebido.'
      )
    } finally {
      setCarregandoSenha(false)
    }
  }

  /*
    Gera comprovante visual em uma nova janela.
    O comprovante pode ser impresso ou salvo em PDF.
  */
  function gerarComprovante(doacao, doadorLogado) {
    registrarAcao()

    const janela = window.open('', '_blank')
    const municipioDoador = doadorLogado.cidade || doadorLogado.municipio || '-'

    if (!janela) {
      mostrarErro('Não foi possível abrir a janela do comprovante.')
      return
    }

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
              <p><span class="label">Gênero:</span> ${doadorLogado.genero || 'Prefiro não dizer'}</p>
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
    registrarAcao()
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
              type="button"
              style={styles.botao}
              onClick={() => {
                registrarAcao()
                navigate('/doador/doar')
              }}
            >
              Doar agora
            </button>

            <button
              type="button"
              style={styles.botao}
              onClick={() => {
                registrarAcao()
                setAba('cadastro')
                setMensagem('')
              }}
            >
              Atualizar cadastro
            </button>

            <button
              type="button"
              style={styles.botao}
              onClick={() => {
                registrarAcao()
                setAba('historico')
                setMensagem('')
              }}
            >
              Histórico de doações
            </button>

            <button
              type="button"
              style={styles.botao}
              onClick={() => {
                registrarAcao()
                setAba('senha')
                setMensagem('')
              }}
            >
              Alterar senha
            </button>

            <button
              type="button"
              style={styles.sairButton}
              onClick={sair}
            >
              Sair
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

                <label style={styles.label}>Gênero</label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                >
                  {OPCOES_GENERO.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>

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

                <label style={styles.label}>Município</label>
                <input
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                />

                <label style={styles.label}>Estado / UF</label>
                <input
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  disabled={!editando}
                  style={editando ? styles.input : styles.inputDisabled}
                />

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
                Por segurança, enviaremos um código de verificação para o
                e-mail cadastrado no painel.
              </p>

              <form onSubmit={alterarSenha} style={styles.form}>
                <label style={styles.label}>E-mail cadastrado</label>
                <input
                  value={email}
                  disabled
                  style={styles.inputDisabled}
                />

                <label style={styles.label}>Código recebido por e-mail</label>
                <input
                  value={codigoDigitado}
                  onChange={(e) => setCodigoDigitado(e.target.value)}
                  style={styles.input}
                  placeholder="Ex: 123456"
                />

                <button
                  type="button"
                  style={
                    segundosReenvio > 0 || carregandoCodigo
                      ? styles.recoveryButtonDisabled
                      : styles.recoveryButton
                  }
                  onClick={enviarCodigoSenhaPainel}
                  disabled={segundosReenvio > 0 || carregandoCodigo}
                >
                  {textoBotaoCodigoSenha({
                    carregandoCodigo,
                    segundosReenvio,
                    email
                  })}
                </button>

                <p style={styles.infoTextSmall}>
                  O código será enviado para o e-mail cadastrado. Depois do
                  envio, aguarde 3 minutos e 20 segundos para solicitar outro
                  código.
                </p>

                <label style={styles.label}>Nova senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={styles.input}
                  placeholder="Nova senha forte"
                />

                <label style={styles.label}>Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  style={styles.input}
                  placeholder="Confirme a nova senha"
                />

                <button
                  type="submit"
                  style={
                    carregandoSenha
                      ? styles.saveButtonDisabled
                      : styles.saveButton
                  }
                  disabled={carregandoSenha}
                >
                  {carregandoSenha ? 'Alterando senha...' : 'Confirmar nova senha'}
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
                          <td style={styles.td}>
                            {d.bancoOrigem || d.banco || 'Não informado'}
                          </td>
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

          {mensagem && (
            <p
              style={
                tipoMensagem === 'erro'
                  ? styles.errorMessage
                  : styles.successMessage
              }
            >
              {mensagem}
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

/*
  Funções auxiliares da recuperação de senha no painel.
*/

function obterChaveCooldownSenha(email) {
  const emailSeguro = String(email || 'geral')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, '-')

  return `${BASE_COOLDOWN_SENHA_PAINEL_KEY}_${emailSeguro}`
}

function calcularSegundosRestantesSenha(email) {
  const chave = obterChaveCooldownSenha(email)
  const ultimoEnvio = Number(localStorage.getItem(chave))

  if (!ultimoEnvio) return 0

  const segundosPassados = Math.floor((Date.now() - ultimoEnvio) / 1000)
  const restante = TEMPO_REENVIO_CODIGO - segundosPassados

  return Math.max(0, restante)
}

function registrarEnvioCodigoSenha(email) {
  localStorage.setItem(obterChaveCooldownSenha(email), String(Date.now()))
}

function removerCooldownSenha(email) {
  localStorage.removeItem(obterChaveCooldownSenha(email))
}

function existeEnvioAnteriorSenha(email) {
  return Boolean(localStorage.getItem(obterChaveCooldownSenha(email)))
}

function formatarTempoReenvioSenha(segundos) {
  const minutos = Math.floor(segundos / 60)
  const resto = segundos % 60

  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`
}

function textoBotaoCodigoSenha({ carregandoCodigo, segundosReenvio, email }) {
  if (carregandoCodigo) return 'Enviando código...'

  if (segundosReenvio > 0) {
    return `Aguarde ${formatarTempoReenvioSenha(segundosReenvio)} para reenviar`
  }

  if (existeEnvioAnteriorSenha(email)) {
    return 'Reenviar código de verificação'
  }

  return 'Enviar código por e-mail'
}

function senhaFortePainel(valor) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(
    valor
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '34px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },
  title: {
    color: '#0B3D91',
    margin: 0,
    fontSize: '2.3rem'
  },
  welcome: {
    color: '#475569',
    fontSize: '17px',
    lineHeight: '1.6'
  },
  botoes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    margin: '24px 0'
  },
  botao: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  sairButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  section: {
    marginTop: '24px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '22px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  editButton: {
    background: '#FACC15',
    color: '#001B44',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '999px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginTop: '14px',
    marginBottom: '6px',
    color: '#374151',
    fontWeight: '800'
  },
  input: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#fff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  inputDisabled: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    background: '#f3f4f6',
    color: '#6b7280',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  saveButton: {
    marginTop: '20px',
    background: '#16A34A',
    color: '#fff',
    border: 'none',
    padding: '13px',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  saveButtonDisabled: {
    marginTop: '20px',
    background: '#94a3b8',
    color: '#fff',
    border: 'none',
    padding: '13px',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'not-allowed'
  },
  recoveryButton: {
    background: '#0B5FC3',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '900',
    cursor: 'pointer',
    marginTop: '12px'
  },
  recoveryButtonDisabled: {
    background: '#94a3b8',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '900',
    cursor: 'not-allowed',
    marginTop: '12px'
  },
  infoText: {
    color: '#475569',
    lineHeight: '1.6'
  },
  infoTextSmall: {
    color: '#64748b',
    lineHeight: '1.5',
    fontSize: '13px',
    fontWeight: '700',
    marginTop: '10px'
  },
  empty: {
    color: '#64748b',
    fontWeight: '700'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '14px',
    overflow: 'hidden'
  },
  th: {
    background: '#0B3D91',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px'
  },
  td: {
    borderBottom: '1px solid #e5e7eb',
    padding: '12px',
    color: '#374151',
    fontSize: '14px'
  },
  receiptButton: {
    background: '#FACC15',
    color: '#001B44',
    border: 'none',
    padding: '9px 12px',
    borderRadius: '999px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  successMessage: {
    marginTop: '18px',
    padding: '12px',
    borderRadius: '10px',
    background: '#dcfce7',
    color: '#166534',
    fontWeight: '900'
  },
  errorMessage: {
    marginTop: '18px',
    padding: '12px',
    borderRadius: '10px',
    background: '#fee2e2',
    color: '#991b1b',
    fontWeight: '900'
  }
}

export default PainelDoadorPublico