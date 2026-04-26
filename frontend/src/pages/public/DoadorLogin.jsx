import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'
import { criarDoacao } from '../../services/doacoesService'
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

  // Localização do doador
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
      const listaPaises = await listarPaises()
      const listaEstados = await listarEstadosBrasil()

      setPaises(listaPaises)
      setEstados(listaEstados)
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

      const listaMunicipios = await listarMunicipiosPorEstado(estadoId)
      setMunicipios(listaMunicipios)
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

    if (tipoPessoa === 'juridica' && !documento.trim()) {
      return mostrarErro('CNPJ obrigatório para pessoa jurídica.')
    }

    if (!telefone.trim()) return mostrarErro('Informe o telefone.')
    if (!email.trim()) return mostrarErro('Informe o e-mail.')

    if (!pais) return mostrarErro('Selecione o país.')

    if (pais === 'BR' && !estadoId) {
      return mostrarErro('Selecione o estado.')
    }

    if (pais === 'BR' && !municipio) {
      return mostrarErro('Selecione o município.')
    }

    if (!senha.trim()) return mostrarErro('Crie uma senha.')
    if (!confirmarSenha.trim()) return mostrarErro('Confirme sua senha.')

    if (senha.trim().length < 6) {
      return mostrarErro('A senha deve ter no mínimo 6 caracteres.')
    }

    if (senha.trim() !== confirmarSenha.trim()) {
      return mostrarErro('As senhas não conferem.')
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

    const paisSelecionado =
      paises.find((p) => p.codigo === pais)?.nome || pais

    const novoDoador = {
      id: Date.now(),
      nome: nome.trim(),
      categoria: tipoPessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física',
      tipoPessoa,
      documento: documento.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      senha: senha.trim(),

      // Dados para dashboard geográfico
      paisCodigo: pais,
      pais: paisSelecionado,
      estadoId,
      estado: estadoNome,
      municipio,

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
        comprovante
      })
    }

    localStorage.setItem(DOADOR_LOGADO_KEY, JSON.stringify(novoDoador))

    mostrarSucesso('Usuário cadastrado com sucesso! Redirecionando para o painel...')

    setTimeout(() => {
      navigate('/doador/painel')
    }, 1800)
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
                {tipoPessoa === 'juridica' ? 'CNPJ obrigatório' : 'CPF ou RG opcional'}
              </label>
              <input
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                style={styles.input}
                placeholder={tipoPessoa === 'juridica' ? 'Digite o CNPJ' : 'Digite CPF/RG se desejar'}
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

              {/* Localização para gráficos de impacto */}
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

                {pais === 'BR' ? (
                  <>
                    <label style={styles.label}>Estado</label>
                    <select
                      value={estadoId}
                      onChange={(e) => {
                        const selecionado = estados.find(
                          (estado) => String(estado.id) === e.target.value
                        )

                        setEstadoId(e.target.value)
                        setEstadoNome(selecionado?.nome || '')
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
                ) : (
                  <p style={styles.note}>
                    Para países fora do Brasil, o detalhamento por estado e município será tratado futuramente.
                  </p>
                )}
              </section>

              <label style={styles.label}>Criar senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
                placeholder="Mínimo de 6 caracteres"
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

                      <div style={styles.qrCode}>
                        <div style={styles.qrInner}>QR</div>
                      </div>

                      <p style={styles.note}>
                        Escaneie o QR Code ou use a chave Pix. O valor é informado diretamente no aplicativo do banco.
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
  page: {
    minHeight: '100vh',
    background: '#F1F5F9',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '760px',
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
    minHeight: '44px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    padding: '0 12px'
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
  smallTitle: {
    color: '#0B3D91',
    marginBottom: '10px'
  },
  pixCard: {
    marginTop: '12px'
  },
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
  qrCode: {
    width: '170px',
    height: '170px',
    margin: '20px auto',
    background: 'repeating-linear-gradient(45deg, #111827 0 8px, #ffffff 8px 16px)',
    border: '8px solid #ffffff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrInner: {
    background: '#fff',
    color: '#111827',
    fontWeight: '900',
    padding: '8px'
  },
  tedCard: {
    marginTop: '12px'
  },
  bankBox: {
    background: '#fff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px',
    color: '#374151'
  },
  note: {
    color: '#6b7280',
    lineHeight: '1.6',
    fontSize: '14px'
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

export default DoadorLogin