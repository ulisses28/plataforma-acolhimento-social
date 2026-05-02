import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { listarDoadores, salvarNovoDoador } from '../../services/doadoresService'
import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

function DoadoresAdmin() {
  const [doadores, setDoadores] = useState([])

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [categoria, setCategoria] = useState('Pessoa Física')
  const [obs, setObs] = useState('')

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!estadoId) {
        setMunicipios([])
        return
      }

      const lista = await listarMunicipiosPorEstado(estadoId)
      setMunicipios(lista)
    }

    carregarMunicipios()
  }, [estadoId])

  async function carregar() {
    setDoadores(listarDoadores())
    setPaises(await listarPaises())
    setEstados(await listarEstadosBrasil())
  }

  function cadastrar(e) {
    e.preventDefault()

    if (!nome.trim()) {
      alert('Informe o nome ou razão social.')
      return
    }

    const paisNome = paises.find((p) => p.codigo === pais)?.nome || 'Brazil'

    salvarNovoDoador({
      nome,
      telefone,
      categoria,
      obs,
      paisCodigo: pais,
      pais: paisNome,
      estadoId,
      estado: estadoNome,
      municipio
    })

    setNome('')
    setTelefone('')
    setObs('')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')
    setDoadores(listarDoadores())

    alert('Doador cadastrado com sucesso!')
  }

  return (
    <main style={styles.page}>
      <BackButton />

      <section style={styles.header}>
        <h1 style={styles.title}>Cadastro de Doadores</h1>
        <p style={styles.subtitle}>Gerencie doadores físicos, jurídicos e parceiros.</p>
      </section>

      <form onSubmit={cadastrar} style={styles.card}>
        <h2 style={styles.formTitle}>Novo Doador</h2>

        <input style={styles.input} placeholder="Nome ou razão social" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input style={styles.input} placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

        <select style={styles.input} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option>Pessoa Física</option>
          <option>Pessoa Jurídica</option>
          <option>Parceiro</option>
        </select>

        <textarea style={styles.textarea} placeholder="Observações" value={obs} onChange={(e) => setObs(e.target.value)} />

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
            const novoEstadoId = e.target.value

            const estado = estados.find(
              (item) => String(item.id) === String(novoEstadoId)
            )

            setEstadoId(novoEstadoId)
            setEstadoNome(estado?.nome || '')
            setMunicipio('')
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

        <button style={styles.button}>Salvar Doador</button>
      </form>

      <section style={styles.listCard}>
        <h2 style={styles.formTitle}>Doadores cadastrados</h2>

        {doadores.map((d) => (
          <div key={d.id} style={styles.item}>
            <strong>{d.nome}</strong>
            <span>{d.categoria}</span>
            <span>{d.municipio} - {d.estado}</span>
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
    maxWidth: '760px',
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
    gridTemplateColumns: '2fr 1fr 1.5fr',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid #e5e7eb'
  }
}

export default DoadoresAdmin