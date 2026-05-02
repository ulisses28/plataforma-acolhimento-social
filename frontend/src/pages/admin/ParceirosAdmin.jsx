import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

const STORAGE_KEY = 'parceiros_lar_batista'

function ParceirosAdmin() {
  const [parceiros, setParceiros] = useState([])

  const [nomeFantasia, setNomeFantasia] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [tipoParceria, setTipoParceria] = useState('')
  const [area, setArea] = useState('')
  const [endereco, setEndereco] = useState('')
  const [status, setStatus] = useState('Ativo')
  const [obs, setObs] = useState('')

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  useEffect(() => {
    setParceiros(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])

    async function carregar() {
      setPaises(await listarPaises())
      setEstados(await listarEstadosBrasil())
    }

    carregar()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!estadoId) {
        setMunicipios([])
        return
      }

      setMunicipios(await listarMunicipiosPorEstado(estadoId))
    }

    carregarMunicipios()
  }, [estadoId])

  function salvar(e) {
    e.preventDefault()

    if (!nomeFantasia.trim() || !cnpj.trim()) {
      alert('Informe nome fantasia e CNPJ.')
      return
    }

    const paisNome = paises.find((p) => p.codigo === pais)?.nome || 'Brazil'

    const novo = {
      id: Date.now(),
      nomeFantasia,
      razaoSocial,
      cnpj,
      responsavel,
      telefone,
      email,
      tipoParceria,
      area,
      paisCodigo: pais,
      pais: paisNome,
      estadoId,
      estado: estadoNome,
      municipio,
      endereco,
      status,
      obs,
      criadoEm: new Date().toLocaleDateString('pt-BR')
    }

    const lista = [...parceiros, novo]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setParceiros(lista)

    setNomeFantasia('')
    setRazaoSocial('')
    setCnpj('')
    setResponsavel('')
    setTelefone('')
    setEmail('')
    setTipoParceria('')
    setArea('')
    setEndereco('')
    setObs('')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')

    alert('Parceiro cadastrado com sucesso!')
  }

  return (
    <main style={styles.page}>
      <BackButton />

      <section style={styles.header}>
        <h1 style={styles.title}>Cadastro de Parceiros</h1>
        <p style={styles.subtitle}>Cadastre empresas e instituições parceiras.</p>
      </section>

      <form onSubmit={salvar} style={styles.card}>
        <h2 style={styles.formTitle}>Novo Parceiro</h2>

        <input style={styles.input} placeholder="Nome Fantasia *" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />
        <input style={styles.input} placeholder="Razão Social" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
        <input style={styles.input} placeholder="CNPJ *" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
        <input style={styles.input} placeholder="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
        <input style={styles.input} placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input style={styles.input} placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />

        <select style={styles.input} value={tipoParceria} onChange={(e) => setTipoParceria(e.target.value)}>
          <option value="">Tipo de parceria</option>
          <option>Financeira</option>
          <option>Material</option>
          <option>Institucional</option>
          <option>Voluntariado</option>
        </select>

        <input style={styles.input} placeholder="Área de atuação" value={area} onChange={(e) => setArea(e.target.value)} />

        <h3 style={styles.sectionTitle}>Localização</h3>

        <select style={styles.input} value={pais} onChange={(e) => setPais(e.target.value)}>
          {paises.map((p) => (
            <option key={p.codigo} value={p.codigo}>{p.nome}</option>
          ))}
        </select>

        <select
          style={styles.input}
          value={estadoId}
          onChange={(e) => {
            const estado = estados.find((item) => String(item.id) === e.target.value)
            setEstadoId(e.target.value)
            setEstadoNome(estado?.nome || '')
          }}
        >
          <option value="">Selecione o estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>

        <select style={styles.input} value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
          <option value="">Selecione o município</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nome}>{m.nome}</option>
          ))}
        </select>

        <input style={styles.input} placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

        <select style={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>

        <textarea style={styles.textarea} placeholder="Observações" value={obs} onChange={(e) => setObs(e.target.value)} />

        <button style={styles.button}>Salvar Parceiro</button>
      </form>

      <section style={styles.listCard}>
        <h2 style={styles.formTitle}>Parceiros cadastrados</h2>

        {parceiros.map((p) => (
          <div key={p.id} style={styles.item}>
            <strong>{p.nomeFantasia}</strong>
            <span>{p.tipoParceria}</span>
            <span>{p.municipio} - {p.estado}</span>
            <span>{p.status}</span>
          </div>
        ))}
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '32px'
  },
  header: {
    maxWidth: '760px',
    margin: '0 auto 24px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: 0
  },
  subtitle: {
    color: '#475569'
  },
  card: {
    maxWidth: '760px',
    margin: '0 auto',
    background: '#ffffff',
    padding: '30px',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  listCard: {
    maxWidth: '900px',
    margin: '28px auto 0',
    background: '#ffffff',
    padding: '25px',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  formTitle: {
    color: '#002855'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: '18px'
  },
  input: {
    width: '100%',
    height: '46px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px'
  },
  textarea: {
    width: '100%',
    minHeight: '90px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px'
  },
  button: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  item: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid #e5e7eb'
  }
}

export default ParceirosAdmin