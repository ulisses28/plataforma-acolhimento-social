import {
  validarCPF,
  validarCNPJ,
  validarEmail,
  validarTelefone
} from '../../utils/validacoes'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'

import {
  registrarDoadorBackend,
  loginDoadorBackend,
  solicitarCodigoRecuperacao,
  redefinirSenhaDoador
} from '../../services/doadorAuthService'

import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

/*
  PÁGINA: ÁREA DO DOADOR

  Objetivo desta versão:
  - Manter login, cadastro e recuperação de senha.
  - Adicionar campo "Gênero" no cadastro.
  - Enviar o gênero para o backend no cadastro.
  - Salvar o gênero também no localStorage para compatibilidade com telas antigas.
  - Se o usuário quiser doar agora, após cadastrar será levado para /doador/doar.
  - Não registra Pix/TED automaticamente no cadastro, porque agora Pix/TED
    precisam ser gerados na tela própria de doação.
*/

const DOADORES_KEY = 'doadores_lar_batista'
const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'

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

function DoadorLogin() {
  const navigate = useNavigate()

  const [modo, setModo] = useState('login')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('erro')
  const [carregando, setCarregando] = useState(false)

  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')

  const [codigoRecuperacao, setCodigoRecuperacao] = useState('')
  const [novaSenhaRecuperacao, setNovaSenhaRecuperacao] = useState('')
  const [confirmarNovaSenhaRecuperacao, setConfirmarNovaSenhaRecuperacao] =
    useState('')

  const [nome, setNome] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('fisica')
  const [documento, setDocumento] = useState('')
  const [genero, setGenero] = useState('Prefiro não dizer')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [aceitouLGPD, setAceitouLGPD] = useState(false)

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  const [querDoar, setQuerDoar] = useState('')

  useEffect(() => {
    async function carregarLocalidades() {
      setPaises(await listarPaises())
      setEstados(await listarEstadosBrasil())
    }

    carregarLocalidades()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!estadoId) {
        setMunicipios([])
        setMunicipio('')
        return
      }

      const lista = await listarMunicipiosPorEstado(estadoId)

      setMunicipios(lista)
      setMunicipio('')
    }

    carregarMunicipios()
  }, [estadoId])

  /*
    Se alguma outra tela pedir recuperação de senha e salvar o e-mail
    no localStorage, abrimos direto a aba de recuperação.
  */
  useEffect(() => {
    const emailRecuperacao = localStorage.getItem('email_recuperacao_doador')

    if (emailRecuperacao) {
      setEmailLogin(emailRecuperacao)
      setModo('recuperar')
      localStorage.removeItem('email_recuperacao_doador')
    }
  }, [])

  function listarDoadoresLocais() {
    const dados = localStorage.getItem(DOADORES_KEY)
    return dados ? JSON.parse(dados) : []
  }

  function salvarDoadoresLocais(lista) {
    localStorage.setItem(DOADORES_KEY, JSON.stringify(lista))
  }

  function mostrarErro(texto) {
    setTipoMensagem('erro')
    setMensagem(texto)
  }

  function mostrarSucesso(texto) {
    setTipoMensagem('sucesso')
    setMensagem(texto)
  }

  function senhaForte(valor) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(
      valor
    )
  }

  function limparFormularioCadastro() {
    setNome('')
    setTipoPessoa('fisica')
    setDocumento('')
    setGenero('Prefiro não dizer')
    setTelefone('')
    setEmail('')
    setSenha('')
    setConfirmarSenha('')
    setAceitouLGPD(false)
    setPais('BR')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')
    setMunicipios([])
    setQuerDoar('')
  }

  /*
    LOGIN DO DOADOR
    Chama o backend, que valida senha criptografada.
  */
  async function entrarComoDoador(e) {
    e.preventDefault()
    setMensagem('')

    if (!emailLogin.trim() || !senhaLogin.trim()) {
      mostrarErro('Informe e-mail e senha.')
      return
    }

    try {
      setCarregando(true)

      const resposta = await loginDoadorBackend({
        email: emailLogin.trim().toLowerCase(),
        senha: senhaLogin.trim()
      })

      localStorage.setItem('doador-token', resposta.token)
      localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(resposta.doador))

      navigate('/doador/painel')
    } catch (error) {
      mostrarErro('E-mail ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  /*
    CADASTRO DO DOADOR
    Agora inclui o campo "genero".
    O cadastro vai para o backend e também é mantido localmente por compatibilidade.
  */
  async function cadastrarDoador(e) {
    e.preventDefault()
    setMensagem('')

    if (!nome.trim()) return mostrarErro('Informe o nome ou razão social.')
    if (!documento.trim()) return mostrarErro('Informe CPF ou CNPJ.')
    if (!genero.trim()) {
      return mostrarErro('Selecione o gênero ou marque Prefiro não dizer.')
    }
    if (!telefone.trim()) return mostrarErro('Informe o telefone.')
    if (!email.trim()) return mostrarErro('Informe o e-mail.')

    if (!validarEmail(email)) return mostrarErro('Informe um e-mail válido.')

    if (!validarTelefone(telefone)) {
      return mostrarErro('Informe um telefone válido com DDD.')
    }

    if (tipoPessoa === 'fisica' && !validarCPF(documento)) {
      return mostrarErro('CPF inválido.')
    }

    if (tipoPessoa === 'juridica' && !validarCNPJ(documento)) {
      return mostrarErro('CNPJ inválido.')
    }

    if (!pais) return mostrarErro('Selecione o país.')
    if (pais === 'BR' && !estadoId) return mostrarErro('Selecione o estado.')

    if (pais === 'BR' && !municipio) {
      return mostrarErro('Selecione o município.')
    }

    if (!senha.trim()) return mostrarErro('Crie uma senha.')
    if (!confirmarSenha.trim()) return mostrarErro('Confirme sua senha.')

    if (!senhaForte(senha.trim())) {
      return mostrarErro(
        'A senha deve conter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      )
    }

    if (senha.trim() !== confirmarSenha.trim()) {
      return mostrarErro('As senhas não conferem.')
    }

    if (!aceitouLGPD) {
      return mostrarErro('Você precisa aceitar os termos LGPD para continuar.')
    }

    if (!querDoar) {
      return mostrarErro('Informe se deseja fazer uma doação agora.')
    }

    const paisSelecionado =
      paises.find((p) => p.codigo === pais)?.nome || pais

    const novoDoador = {
      id: Date.now(),
      nome: nome.trim(),
      categoria: tipoPessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física',
      tipoPessoa,
      documento: documento.trim(),
      genero,
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      paisCodigo: pais,
      pais: paisSelecionado,
      estadoId,
      estado: estadoNome,
      municipio,
      lgpdAceito: true,
      lgpdAceitoEm: new Date().toLocaleString('pt-BR'),
      criadoEm: new Date().toLocaleDateString('pt-BR')
    }

    try {
      setCarregando(true)

      const resposta = await registrarDoadorBackend({
        nome: novoDoador.nome,
        email: novoDoador.email,
        senha: senha.trim(),
        telefone: novoDoador.telefone,
        documento: novoDoador.documento,
        genero: novoDoador.genero,
        tipoPessoa: novoDoador.tipoPessoa,
        pais: novoDoador.pais,
        estado: novoDoador.estado,
        municipio: novoDoador.municipio
      })

      const doadorSeguro = {
        ...novoDoador,
        id: resposta.doador?.id || novoDoador.id
      }

      const doadores = listarDoadoresLocais()

      const semDuplicado = doadores.filter(
        (d) => d.email !== doadorSeguro.email
      )

      salvarDoadoresLocais([doadorSeguro, ...semDuplicado])

      localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(doadorSeguro))

      mostrarSucesso(
        querDoar === 'sim'
          ? 'Usuário cadastrado com sucesso! Redirecionando para a doação...'
          : 'Usuário cadastrado com sucesso! Redirecionando para o painel...'
      )

      limparFormularioCadastro()

      setTimeout(() => {
        navigate(querDoar === 'sim' ? '/doador/doar' : '/doador/painel')
      }, 1600)
    } catch (error) {
      console.log('ERRO COMPLETO:', error)

      mostrarErro(
        error?.data?.mensagem ||
          error?.mensagem ||
          error?.message ||
          'Erro ao cadastrar doador.'
      )
    } finally {
      setCarregando(false)
    }
  }

  /*
    PRIMEIRA ETAPA DA RECUPERAÇÃO:
    Envia um código de 6 dígitos para o e-mail cadastrado.
  */
  async function solicitarRecuperacaoSenhaDoador() {
    if (!emailLogin.trim()) {
      mostrarErro(
        'Digite seu e-mail cadastrado antes de solicitar recuperação de senha.'
      )
      return
    }

    try {
      setCarregando(true)

      await solicitarCodigoRecuperacao(emailLogin.trim().toLowerCase())

      mostrarSucesso('Código de recuperação enviado para o e-mail cadastrado.')
      setModo('recuperar')
    } catch (error) {
      mostrarErro(
        error?.response?.data?.mensagem ||
          error?.data?.mensagem ||
          error?.mensagem ||
          error?.message ||
          'Não foi possível enviar o código de recuperação de senha.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function confirmarRedefinicaoSenha(e) {
    e.preventDefault()
    setMensagem('')

    if (!emailLogin.trim()) return mostrarErro('Informe o e-mail.')
    if (!codigoRecuperacao.trim()) {
      return mostrarErro('Informe o código recebido.')
    }
    if (!novaSenhaRecuperacao.trim()) {
      return mostrarErro('Informe a nova senha.')
    }

    if (!senhaForte(novaSenhaRecuperacao.trim())) {
      return mostrarErro(
        'A senha deve conter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      )
    }

    if (novaSenhaRecuperacao !== confirmarNovaSenhaRecuperacao) {
      return mostrarErro('As senhas não conferem.')
    }

    try {
      setCarregando(true)

      await redefinirSenhaDoador({
        email: emailLogin.trim().toLowerCase(),
        codigo: codigoRecuperacao.trim(),
        novaSenha: novaSenhaRecuperacao.trim()
      })

      mostrarSucesso('Senha redefinida com sucesso. Faça login novamente.')

      setCodigoRecuperacao('')
      setNovaSenhaRecuperacao('')
      setConfirmarNovaSenhaRecuperacao('')
      setModo('login')
    } catch (error) {
      mostrarErro(
        error?.response?.data?.mensagem ||
          error?.data?.mensagem ||
          error?.mensagem ||
          error?.message ||
          'Não foi possível redefinir a senha. Verifique o código.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <section style={styles.card}>
          <h1 style={styles.title}>Área do Doador</h1>

          <p style={styles.subtitle}>
            Acesse seu painel ou cadastre-se para acompanhar suas doações.
          </p>

          {modo !== 'recuperar' && (
            <div style={styles.tabs}>
              <button
                type="button"
                style={modo === 'login' ? styles.tabButtonActive : styles.tabButton}
                onClick={() => {
                  setModo('login')
                  setMensagem('')
                }}
              >
                Entrar como doador
              </button>

              <button
                type="button"
                style={modo === 'cadastro' ? styles.tabButtonActive : styles.tabButton}
                onClick={() => {
                  setModo('cadastro')
                  setMensagem('')
                }}
              >
                Cadastrar-se
              </button>
            </div>
          )}

          {modo === 'login' ? (
            <form onSubmit={entrarComoDoador} style={styles.form}>
              <label style={styles.label}>E-mail cadastrado</label>
              <input
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                style={styles.input}
                placeholder="Digite seu e-mail"
              />

              <label style={styles.label}>Senha</label>
              <input
                type="password"
                value={senhaLogin}
                onChange={(e) => setSenhaLogin(e.target.value)}
                style={styles.input}
                placeholder="Digite sua senha"
              />

              <button type="submit" style={styles.button} disabled={carregando}>
                {carregando ? 'Acessando...' : 'Acessar painel'}
              </button>

              <button
                type="button"
                style={styles.linkButton}
                onClick={solicitarRecuperacaoSenhaDoador}
                disabled={carregando}
              >
                Esqueci minha senha
              </button>
            </form>
          ) : modo === 'recuperar' ? (
            <form onSubmit={confirmarRedefinicaoSenha} style={styles.form}>
              <label style={styles.label}>E-mail cadastrado</label>
              <input
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                style={styles.input}
                placeholder="Digite seu e-mail"
              />

              <label style={styles.label}>Código recebido por e-mail</label>
              <input
                value={codigoRecuperacao}
                onChange={(e) => setCodigoRecuperacao(e.target.value)}
                style={styles.input}
                placeholder="Ex: 123456"
              />

              <label style={styles.label}>Nova senha</label>
              <input
                type="password"
                value={novaSenhaRecuperacao}
                onChange={(e) => setNovaSenhaRecuperacao(e.target.value)}
                style={styles.input}
                placeholder="Nova senha forte"
              />

              <label style={styles.label}>Confirmar nova senha</label>
              <input
                type="password"
                value={confirmarNovaSenhaRecuperacao}
                onChange={(e) => setConfirmarNovaSenhaRecuperacao(e.target.value)}
                style={styles.input}
                placeholder="Confirme a nova senha"
              />

              <button type="submit" style={styles.button} disabled={carregando}>
                {carregando ? 'Redefinindo...' : 'Redefinir senha'}
              </button>

              <button
                type="button"
                style={styles.linkButton}
                onClick={() => {
                  setModo('login')
                  setMensagem('')
                }}
              >
                Voltar para login
              </button>
            </form>
          ) : (
            <form onSubmit={cadastrarDoador} style={styles.form}>
              <label style={styles.label}>Nome ou razão social</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={styles.input}
                placeholder="Nome ou razão social"
              />

              <label style={styles.label}>Tipo de cadastro</label>
              <div style={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="tipoPessoa"
                    checked={tipoPessoa === 'fisica'}
                    onChange={() => {
                      setTipoPessoa('fisica')
                      setDocumento('')
                    }}
                  />
                  CPF
                </label>

                <label>
                  <input
                    type="radio"
                    name="tipoPessoa"
                    checked={tipoPessoa === 'juridica'}
                    onChange={() => {
                      setTipoPessoa('juridica')
                      setDocumento('')
                    }}
                  />
                  CNPJ
                </label>
              </div>

              <label style={styles.label}>
                {tipoPessoa === 'juridica' ? 'CNPJ obrigatório' : 'CPF obrigatório'}
              </label>
              <input
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                style={styles.input}
                placeholder={tipoPessoa === 'juridica' ? 'Digite o CNPJ' : 'Digite o CPF'}
              />

              <label style={styles.label}>Gênero</label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                style={styles.input}
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
                style={styles.input}
                placeholder="Telefone com DDD"
              />

              <label style={styles.label}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="E-mail"
              />

              <section style={styles.locationBox}>
                <h3 style={styles.smallTitle}>Localização do doador</h3>

                <label style={styles.label}>País</label>
                <select
                  value={pais}
                  onChange={(e) => {
                    setPais(e.target.value)
                    setEstadoId('')
                    setEstadoNome('')
                    setMunicipio('')
                  }}
                  style={styles.input}
                >
                  <option value="">Selecione o país</option>

                  {paises.map((item) => (
                    <option key={item.codigo} value={item.codigo}>
                      {item.nome}
                    </option>
                  ))}
                </select>

                {pais === 'BR' && (
                  <>
                    <label style={styles.label}>Estado</label>
                    <select
                      value={estadoId}
                      onChange={(e) => {
                        const novoEstadoId = e.target.value
                        const selecionado = estados.find(
                          (estado) =>
                            String(estado.id) === String(novoEstadoId)
                        )

                        setEstadoId(novoEstadoId)
                        setEstadoNome(selecionado?.nome || '')
                        setMunicipio('')
                      }}
                      style={styles.input}
                    >
                      <option value="">Selecione o estado</option>

                      {estados.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                          {estado.nome} - {estado.sigla}
                        </option>
                      ))}
                    </select>

                    <label style={styles.label}>Município</label>
                    <select
                      value={municipio}
                      onChange={(e) => setMunicipio(e.target.value)}
                      style={styles.input}
                      disabled={!estadoId}
                    >
                      <option value="">Selecione o município</option>

                      {municipios.map((cidade) => (
                        <option key={cidade.id} value={cidade.nome}>
                          {cidade.nome}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </section>

              <label style={styles.label}>Criar senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
                placeholder="Mínimo 8 caracteres, número e símbolo"
              />

              <label style={styles.label}>Confirmar senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={styles.input}
                placeholder="Confirme sua senha"
              />

              <label style={styles.label}>Deseja fazer uma doação agora?</label>
              <div style={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="querDoar"
                    checked={querDoar === 'sim'}
                    onChange={() => setQuerDoar('sim')}
                  />
                  Sim
                </label>

                <label>
                  <input
                    type="radio"
                    name="querDoar"
                    checked={querDoar === 'nao'}
                    onChange={() => setQuerDoar('nao')}
                  />
                  Não
                </label>
              </div>

              {querDoar === 'sim' && (
                <section style={styles.donationBox}>
                  <h3 style={styles.smallTitle}>Doação após cadastro</h3>

                  <p style={styles.note}>
                    Depois de finalizar o cadastro, você será direcionado para a
                    tela de doação, onde poderá escolher Pix ou TED, gerar QR Code
                    Pix ou dados bancários e registrar sua contribuição.
                  </p>
                </section>
              )}

              <section style={styles.lgpdBox}>
                <h3 style={styles.smallTitle}>Termo LGPD</h3>

                <p style={styles.note}>
                  Ao cadastrar-se, você autoriza o uso dos dados informados para
                  identificação do doador, histórico de doações, emissão de
                  comprovantes e prestação de contas institucional.
                </p>

                <label style={styles.lgpdCheck}>
                  <input
                    type="checkbox"
                    checked={aceitouLGPD}
                    onChange={(e) => setAceitouLGPD(e.target.checked)}
                  />
                  Li e aceito os termos LGPD.
                </label>
              </section>

              <button type="submit" style={styles.button} disabled={carregando}>
                {carregando ? 'Cadastrando...' : 'Finalizar cadastro'}
              </button>
            </form>
          )}

          {mensagem && (
            <p style={tipoMensagem === 'sucesso' ? styles.successMessage : styles.errorMessage}>
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
    background: '#f1f7ff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '760px',
    margin: '0 auto'
  },
  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '32px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  title: {
    color: '#0B3D91',
    margin: 0,
    fontSize: '2rem'
  },
  subtitle: {
    color: '#4b5563',
    lineHeight: '1.6'
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    margin: '24px 0',
    flexWrap: 'wrap'
  },
  tabButton: {
    border: '1px solid #bfdbfe',
    background: '#eef6ff',
    color: '#0B3D91',
    padding: '11px 18px',
    borderRadius: '999px',
    fontWeight: '800',
    cursor: 'pointer'
  },
  tabButtonActive: {
    border: 'none',
    background: '#0B3D91',
    color: '#fff',
    padding: '11px 18px',
    borderRadius: '999px',
    fontWeight: '800',
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
  radioGroup: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap',
    color: '#374151',
    fontWeight: '600'
  },
  locationBox: {
    marginTop: '16px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px'
  },
  donationBox: {
    marginTop: '16px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px'
  },
  lgpdBox: {
    marginTop: '18px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '16px'
  },
  lgpdCheck: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    color: '#374151',
    fontWeight: '700'
  },
  smallTitle: {
    color: '#0B3D91',
    marginBottom: '10px',
    marginTop: 0
  },
  note: {
    color: '#6b7280',
    lineHeight: '1.6',
    fontSize: '14px',
    margin: 0
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
  linkButton: {
    background: 'transparent',
    border: 'none',
    color: '#0B3D91',
    fontWeight: '800',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '12px',
    alignSelf: 'flex-start'
  },
  errorMessage: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '10px',
    background: '#fee2e2',
    color: '#991b1b',
    fontWeight: '800'
  },
  successMessage: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '10px',
    background: '#dcfce7',
    color: '#166534',
    fontWeight: '900'
  }
}

export default DoadorLogin