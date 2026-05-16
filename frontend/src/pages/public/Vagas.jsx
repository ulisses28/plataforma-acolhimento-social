import React, { useEffect, useState } from 'react'
import logoLar from '../../assets/logo-lar.jpg'
import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'
import {
  salvarCandidatura,
  lerArquivoBase64
} from '../../services/vagasService'

function Vagas() {
  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [form, setForm] = useState({
    tipo: 'Vaga',
    vaga: '',
    nome: '',
    cpf: '',
    email: '',
    sexo: '',
    pais: 'BR',
    estadoId: '',
    estado: '',
    municipio: '',
    observacoes: '',
    arquivos: [],
    aceiteLGPD: false,
    aceiteDados: false
  })

  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    async function carregar() {
      setPaises(await listarPaises())
      setEstados(await listarEstadosBrasil())
    }

    carregar()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!form.estadoId) {
        setMunicipios([])
        return
      }

      setMunicipios(await listarMunicipiosPorEstado(form.estadoId))
    }

    carregarMunicipios()
  }, [form.estadoId])

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  function alterarEstado(e) {
    const id = e.target.value
    const estadoSelecionado = estados.find((estado) => estado.id === id)

    setForm((atual) => ({
      ...atual,
      estadoId: id,
      estado: estadoSelecionado ? estadoSelecionado.nome : '',
      municipio: ''
    }))
  }

  async function selecionarArquivos(e) {
    const arquivos = Array.from(e.target.files || [])

    if (arquivos.length > 3) {
      alert('Você pode anexar no máximo 3 arquivos.')
      return
    }

    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg']

    const invalidos = arquivos.filter(
      (arquivo) => !tiposPermitidos.includes(arquivo.type)
    )

    if (invalidos.length > 0) {
      alert('Envie apenas arquivos PDF ou JPG.')
      return
    }

    const convertidos = await Promise.all(
      arquivos.map(async (arquivo) => ({
        nome: arquivo.name,
        tipo: arquivo.type,
        base64: await lerArquivoBase64(arquivo)
      }))
    )

    alterarCampo('arquivos', convertidos)
  }

  function enviarFormulario(e) {
    e.preventDefault()

    if (!form.vaga.trim()) return setMensagem('Informe a vaga ou área de interesse.')
    if (!form.nome.trim()) return setMensagem('Informe seu nome.')
    if (!form.cpf.trim()) return setMensagem('Informe seu CPF.')
    if (!form.email.trim()) return setMensagem('Informe seu e-mail.')
    if (!form.sexo.trim()) return setMensagem('Informe o campo sexo/gênero.')
    if (!form.estado.trim()) return setMensagem('Selecione o estado.')
    if (!form.municipio.trim()) return setMensagem('Selecione o município.')
    if (form.arquivos.length === 0) return setMensagem('Anexe pelo menos um currículo ou carta de apresentação.')
    if (!form.aceiteLGPD || !form.aceiteDados) return setMensagem('Aceite os termos de consentimento e LGPD.')

    salvarCandidatura(form)

    setMensagem('Cadastro enviado com sucesso! A instituição agradece seu interesse.')

    setForm({
      tipo: 'Vaga',
      vaga: '',
      nome: '',
      cpf: '',
      email: '',
      sexo: '',
      pais: 'BR',
      estadoId: '',
      estado: '',
      municipio: '',
      observacoes: '',
      arquivos: [],
      aceiteLGPD: false,
      aceiteDados: false
    })
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <header style={styles.header}>
          <img src={logoLar} alt="Lar Batista Albertine Meador" style={styles.logo} />

          <div>
            <h1 style={styles.title}>Lar Batista Albertine Meador</h1>
            <p style={styles.subtitle}>
              Formulário de candidatura, banco de talentos e envio de currículo.
            </p>
          </div>
        </header>

        <form onSubmit={enviarFormulario}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Tipo de envio</label>
              <select
                style={styles.input}
                value={form.tipo}
                onChange={(e) => alterarCampo('tipo', e.target.value)}
              >
                <option>Vaga</option>
                <option>Banco de Talentos</option>
                <option>Outros</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Vaga ou área de interesse</label>
              <input
                style={styles.input}
                value={form.vaga}
                onChange={(e) => alterarCampo('vaga', e.target.value)}
                placeholder="Ex: Auxiliar administrativo"
              />
            </div>
          </div>

          <label style={styles.label}>Nome completo</label>
          <input
            style={styles.input}
            value={form.nome}
            onChange={(e) => alterarCampo('nome', e.target.value)}
          />

          <div style={styles.grid}>
            <div>
              <label style={styles.label}>CPF</label>
              <input
                style={styles.input}
                value={form.cpf}
                onChange={(e) => alterarCampo('cpf', e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>E-mail</label>
              <input
                style={styles.input}
                value={form.email}
                onChange={(e) => alterarCampo('email', e.target.value)}
              />
            </div>
          </div>

          <label style={styles.label}>Sexo / Identificação de gênero</label>
          <select
            style={styles.input}
            value={form.sexo}
            onChange={(e) => alterarCampo('sexo', e.target.value)}
          >
            <option value="">Selecione</option>
            <option>Feminino</option>
            <option>Masculino</option>
            <option>Não binário</option>
            <option>Outro</option>
            <option>Prefiro não informar</option>
          </select>

          <section style={styles.locationBox}>
            <h2 style={styles.sectionTitle}>Localização</h2>

            <label style={styles.label}>País</label>
            <select
              style={styles.input}
              value={form.pais}
              onChange={(e) => alterarCampo('pais', e.target.value)}
            >
              {paises.map((pais) => (
                <option key={pais.codigo} value={pais.codigo}>
                  {pais.nome}
                </option>
              ))}
            </select>

            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Estado</label>
                <select
                  style={styles.input}
                  value={form.estadoId}
                  onChange={alterarEstado}
                >
                  <option value="">Selecione o estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nome} - {estado.sigla}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.label}>Município</label>
                <select
                  style={styles.input}
                  value={form.municipio}
                  onChange={(e) => alterarCampo('municipio', e.target.value)}
                >
                  <option value="">Selecione o município</option>
                  {municipios.map((cidade) => (
                    <option key={cidade.id} value={cidade.nome}>
                      {cidade.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <label style={styles.label}>
            Anexar currículo ou carta de apresentação
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            multiple
            style={styles.input}
            onChange={selecionarArquivos}
          />

          <p style={styles.helpText}>
            Envie até 3 arquivos em PDF ou JPG.
          </p>

          <label style={styles.label}>Observações</label>
          <textarea
            style={styles.textarea}
            value={form.observacoes}
            onChange={(e) => alterarCampo('observacoes', e.target.value)}
            placeholder="Conte brevemente sobre sua experiência, disponibilidade ou interesse."
          />

          <section style={styles.lgpdBox}>
            <h2 style={styles.sectionTitle}>Consentimento e LGPD</h2>

            <label style={styles.check}>
              <input
                type="checkbox"
                checked={form.aceiteDados}
                onChange={(e) => alterarCampo('aceiteDados', e.target.checked)}
              />
              Autorizo o uso dos dados informados para análise da candidatura.
            </label>

            <label style={styles.check}>
              <input
                type="checkbox"
                checked={form.aceiteLGPD}
                onChange={(e) => alterarCampo('aceiteLGPD', e.target.checked)}
              />
              Li e aceito os termos de proteção de dados conforme a LGPD.
            </label>
          </section>

          {mensagem && <p style={styles.message}>{mensagem}</p>}

          <button style={styles.button}>Enviar candidatura</button>
        </form>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eaf4ff 0%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  card: {
    maxWidth: '980px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '24px',
    padding: '34px',
    boxShadow: '0 14px 38px rgba(0,0,0,0.10)'
  },
  header: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '25px'
  },
  logo: {
    width: '105px',
    height: '105px',
    objectFit: 'contain'
  },
  title: {
    color: '#0B3D91',
    margin: 0,
    fontSize: '2rem'
  },
  subtitle: {
    color: '#475569'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  label: {
    display: 'block',
    marginTop: '14px',
    marginBottom: '6px',
    color: '#334155',
    fontWeight: '800'
  },
  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    minHeight: '115px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box'
  },
  locationBox: {
    marginTop: '22px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px'
  },
  lgpdBox: {
    marginTop: '22px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px'
  },
  check: {
    display: 'block',
    marginTop: '10px',
    color: '#334155',
    fontWeight: '700'
  },
  helpText: {
    color: '#64748b',
    fontSize: '14px'
  },
  message: {
    color: '#0B3D91',
    fontWeight: '900',
    marginTop: '16px'
  },
  button: {
    width: '100%',
    marginTop: '22px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '15px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  vagaDescricao: {
    marginTop: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    color: '#374151',
    lineHeight: '1.7',
    fontSize: '15px'
  },

  listaRequisitos: {
    paddingLeft: '20px',
    marginTop: '-4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
}

export default Vagas