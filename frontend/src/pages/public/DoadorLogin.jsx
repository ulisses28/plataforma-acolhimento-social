import {
  validarCPF,
  validarCNPJ,
  validarEmail,
  validarTelefone
} from '../../utils/validacoes'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'
import { criarDoacao } from '../../services/doacoesService'
import { registrarInteracao } from '../../services/analyticsService'
import { registrarSolicitacaoRecuperacao } from '../../services/recuperacaoSenhaService'

import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

const DOADORES_KEY = 'doadores_lar_batista'
const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'

function DoadorLogin() {
  const navigate = useNavigate()

  const [modo, setModo] = useState('login')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('erro')

  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')

  const [nome, setNome] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('fisica')
  const [documento, setDocumento] = useState('')
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
  const [forma, setForma] = useState('')
  const [valorTED, setValorTED] = useState('')
  const [comprovante, setComprovante] = useState('')

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

  function listarDoadores() {
    const dados = localStorage.getItem(DOADORES_KEY)
    return dados ? JSON.parse(dados) : []
  }

  function salvarDoadores(lista) {
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

  function entrarComoDoador(e) {
    e.preventDefault()
    setMensagem('')

    if (!emailLogin.trim() || !senhaLogin.trim()) {
      mostrarErro('Informe e-mail e senha.')
      return
    }

    const doadores = listarDoadores()

    const encontrado = doadores.find(
      (d) =>
        d.email === emailLogin.trim().toLowerCase() &&
        d.senha === senhaLogin.trim()
    )

    if (!encontrado) {
      mostrarErro('E-mail ou senha inválidos.')
      return
    }

    localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(encontrado))
    navigate('/doador/painel')
  }

  function cadastrarDoador(e) {
    e.preventDefault()
    setMensagem('')

    if (!nome.trim()) return mostrarErro('Informe o nome ou razão social.')
    if (!documento.trim()) return mostrarErro('Informe CPF/RG ou CNPJ.')
    if (!telefone.trim()) return mostrarErro('Informe o telefone.')
    if (!email.trim()) return mostrarErro('Informe o e-mail.')
    if (!validarEmail(email)) {
      return mostrarErro('Informe um e-mail válido.')
    }

    if (!validarTelefone(telefone)) {
      return mostrarErro('Informe um telefone válido com DDD.')
    }

    if (
      tipoPessoa === 'fisica' &&
      !validarCPF(documento)
    ) {
      return mostrarErro('CPF inválido.')
    }

    if (
      tipoPessoa === 'juridica' &&
      !validarCNPJ(documento)
    ) {
      return mostrarErro('CNPJ inválido.')
    }

    if (!pais) return mostrarErro('Selecione o país.')

    if (pais === 'BR' && !estadoId) return mostrarErro('Selecione o estado.')
    if (pais === 'BR' && !municipio) return mostrarErro('Selecione o município.')

    if (!senha.trim()) return mostrarErro('Crie uma senha.')
    if (!confirmarSenha.trim()) return mostrarErro('Confirme sua senha.')

    const senhaForte =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/

    if (!senhaForte.test(senha.trim())) {
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

    if (querDoar === 'sim' && !forma) {
      return mostrarErro('Selecione Pix ou TED.')
    }

    if (querDoar === 'sim' && forma === 'TED' && !valorTED.trim()) {
      return mostrarErro('Informe o valor da TED.')
    }

    const doadores = listarDoadores()

    const existe = doadores.some(
      (d) => d.email === email.trim().toLowerCase()
    )

    if (existe) {
      return mostrarErro('Este e-mail já está cadastrado.')
    }

    const paisSelecionado = paises.find((p) => p.codigo === pais)?.nome || pais

    const novoDoador = {
      id: Date.now(),
      nome: nome.trim(),
      categoria: tipoPessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física',
      tipoPessoa,
      documento: documento.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      senha: senha.trim(),
      paisCodigo: pais,
      pais: paisSelecionado,
      estadoId,
      estado: estadoNome,
      municipio,
      lgpdAceito: true,
      lgpdAceitoEm: new Date().toLocaleString('pt-BR'),
      criadoEm: new Date().toLocaleDateString('pt-BR')
    }

    doadores.push(novoDoador)
    salvarDoadores(doadores)

    if (querDoar === 'sim') {
      criarDoacao({
        doador: novoDoador,
        tipoDoacao: 'Financeira',
        forma,
        valor: forma === 'TED' ? valorTED : '',
        comprovante,
        lgpdAceito: true,
        lgpdAceitoEm: new Date().toLocaleString('pt-BR')
      })
    }

    localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(novoDoador))

    mostrarSucesso('Usuário cadastrado com sucesso! Redirecionando para o painel...')

    setTimeout(() => {
      navigate('/doador/painel')
    }, 1800)
  }
  function solicitarRecuperacaoSenhaDoador() {
  if (!emailLogin.trim()) {
    mostrarErro('Digite seu e-mail cadastrado antes de solicitar recuperação de senha.')
    return
  }

  registrarSolicitacaoRecuperacao({
    email: emailLogin.trim().toLowerCase(),
    perfil: 'Doador',
    mensagem: 'Doador solicitou recuperação de senha pela tela de login.'
  })

  mostrarSucesso(
    'Solicitação registrada com sucesso. A instituição analisará seu pedido de recuperação de senha.'
  )
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

          <div style={styles.tabs}>
            <button type="button" style={styles.tabButton} onClick={() => setModo('login')}>
              Entrar como doador
            </button>

            <button type="button" style={styles.tabButton} onClick={() => setModo('cadastro')}>
              Cadastrar-se
            </button>
          </div>

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

              <button type="submit" style={styles.button}>Acessar painel</button>
              <button
                type="button"
                style={styles.linkButton}
                onClick={solicitarRecuperacaoSenhaDoador}
              >
                Esqueci minha senha
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
                    onChange={() => setTipoPessoa('fisica')}
                  />
                  CPF/RG
                </label>

                <label>
                  <input
                    type="radio"
                    name="tipoPessoa"
                    checked={tipoPessoa === 'juridica'}
                    onChange={() => setTipoPessoa('juridica')}
                  />
                  CNPJ
                </label>
              </div>

              <label style={styles.label}>
                {tipoPessoa === 'juridica' ? 'CNPJ obrigatório' : 'CPF ou RG obrigatório'}
              </label>
              <input
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                style={styles.input}
                placeholder={tipoPessoa === 'juridica' ? 'Digite o CNPJ' : 'Digite CPF/RG'}
              />

              <label style={styles.label}>Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                style={styles.input}
                placeholder="Telefone"
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
                          (estado) => String(estado.id) === String(novoEstadoId)
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
                placeholder="Senha forte"
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
                    onChange={() => {
                      setQuerDoar('nao')
                      setForma('')
                      setValorTED('')
                      setComprovante('')
                    }}
                  />
                  Não
                </label>
              </div>

              {querDoar === 'sim' && (
                <section style={styles.donationBox}>
                  <label style={styles.label}>Forma da doação</label>

                  <div style={styles.radioGroup}>
                    <label>
                      <input
                        type="radio"
                        name="forma"
                        checked={forma === 'Pix'}
                        onChange={() => {
                          setForma('Pix')
                          setValorTED('')
                          setComprovante('')
                        }}
                      />
                      Pix
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="forma"
                        checked={forma === 'TED'}
                        onChange={() => setForma('TED')}
                      />
                      TED
                    </label>
                  </div>

                  {forma === 'Pix' && (
                    <div style={styles.pixCard}>
                      <h3 style={styles.smallTitle}>Dados Pix</h3>
                      <div style={styles.pixBox}>
                        <strong>PIX / CNPJ</strong>
                        <span>27363944000180</span>
                      </div>
                      <p style={styles.note}>
                        O valor é informado diretamente no aplicativo do banco.
                      </p>
                    </div>
                  )}

                  {forma === 'TED' && (
                    <div style={styles.tedCard}>
                      <h3 style={styles.smallTitle}>Dados bancários para TED</h3>

                      <div style={styles.bankBox}>
                        <p><strong>Banco:</strong> Banestes</p>
                        <p><strong>Agência:</strong> 059</p>
                        <p><strong>Conta corrente:</strong> 6.948.103</p>
                        <p><strong>Razão Social:</strong> Lar Batista Albertine Meador</p>
                        <p><strong>CNPJ:</strong> 27.363.944/0001-80</p>
                      </div>

                      <label style={styles.label}>Valor da TED</label>
                      <input
                        value={valorTED}
                        onChange={(e) => setValorTED(e.target.value)}
                        style={styles.input}
                        placeholder="Ex: 50,00"
                      />

                      <label style={styles.label}>Anexar comprovante</label>
                      <input
                        type="file"
                        onChange={(e) => setComprovante(e.target.files?.[0]?.name || '')}
                        style={styles.input}
                      />
                    </div>
                  )}
                </section>
              )}

              <section style={styles.lgpdBox}>
                <h3 style={styles.smallTitle}>Termo LGPD</h3>

                <p style={styles.note}>
                  Ao continuar, você autoriza o Lar Batista Albertine Meador a armazenar seus
                  dados para fins de cadastro, histórico de doações, comunicação institucional
                  e prestação de contas, conforme a Lei Geral de Proteção de Dados.
                </p>

                <label style={styles.lgpdCheck}>
                  <input
                    type="checkbox"
                    checked={aceitouLGPD}
                    onChange={(e) => setAceitouLGPD(e.target.checked)}
                  />
                  Li e aceito os termos de uso e privacidade.
                </label>
              </section>

              <button type="submit" style={styles.button}>Criar cadastro</button>
            </form>
          )}

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
  page: { minHeight: '100vh', background: '#F1F5F9', padding: '40px 20px' },
  container: { maxWidth: '760px', margin: '0 auto' },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  title: { color: '#0B3D91', margin: 0, fontSize: '2rem' },
  subtitle: { color: '#4b5563', lineHeight: '1.6' },
  tabs: { display: 'flex', gap: '12px', margin: '24px 0', flexWrap: 'wrap' },
  tabButton: {
    border: 'none',
    background: '#0B3D91',
    color: '#fff',
    padding: '11px 18px',
    borderRadius: '999px',
    fontWeight: '800',
    cursor: 'pointer'
  },
  form: { display: 'flex', flexDirection: 'column' },
  label: { marginTop: '14px', marginBottom: '6px', color: '#374151', fontWeight: '700' },
  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  radioGroup: { display: 'flex', gap: '18px', flexWrap: 'wrap', color: '#374151', fontWeight: '600' },
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
  smallTitle: { color: '#0B3D91', marginBottom: '10px' },
  pixBox: {
    background: '#fff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px',
    color: '#0B3D91',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  bankBox: {
    background: '#fff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px',
    color: '#374151'
  },
  note: { color: '#6b7280', lineHeight: '1.6', fontSize: '14px' },
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

  message: {
    marginTop: '16px',
    fontWeight: '700'
  },
}

export default DoadorLogin