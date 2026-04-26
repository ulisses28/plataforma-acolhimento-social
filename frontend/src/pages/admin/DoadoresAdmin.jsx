import React, { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import AdminHeader from '../../components/ui/AdminHeader'
import {
  listarDoadores,
  salvarNovoDoador
} from '../../services/doadoresService'
import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

function DoadoresAdmin() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [categoria, setCategoria] = useState('Pessoa Física')
  const [obs, setObs] = useState('')

  // 🌍 Localização
  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  const [doadores, setDoadores] = useState([])

  useEffect(() => {
    carregarDados()
  }, [])

  useEffect(() => {
    carregarMunicipios()
  }, [estadoId])

  async function carregarDados() {
    setDoadores(listarDoadores())

    const listaPaises = await listarPaises()
    const listaEstados = await listarEstadosBrasil()

    setPaises(listaPaises)
    setEstados(listaEstados)
  }

  async function carregarMunicipios() {
    if (!estadoId) return

    const lista = await listarMunicipiosPorEstado(estadoId)
    setMunicipios(lista)
  }

  function cadastrarDoador(e) {
    e.preventDefault()

    if (!nome.trim()) {
      alert('Informe o nome do doador')
      return
    }

    const paisSelecionado =
      paises.find((p) => p.codigo === pais)?.nome || pais

    salvarNovoDoador({
      nome,
      telefone,
      categoria,
      obs,
      paisCodigo: pais,
      pais: paisSelecionado,
      estadoId,
      estado: estadoNome,
      municipio
    })

    setNome('')
    setTelefone('')
    setObs('')
    setEstadoId('')
    setMunicipio('')

    setDoadores(listarDoadores())
  }

  return (
    <main style={styles.page}>
      <BackButton />
      <AdminHeader />

      <div style={styles.container}>
        <h1 style={styles.title}>Cadastro de Doadores</h1>

        {/* FORM */}
        <form onSubmit={cadastrarDoador} style={styles.card}>
          <h2 style={styles.subtitle}>Novo Doador</h2>

          <input
            placeholder="Nome ou razão social"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={styles.input}
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={styles.input}
          >
            <option>Pessoa Física</option>
            <option>Pessoa Jurídica</option>
            <option>Parceiro</option>
          </select>

          <textarea
            placeholder="Observações"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            style={styles.input}
          />

          {/* 🌍 LOCALIZAÇÃO */}
          <h3 style={styles.section}>Localização</h3>

          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            style={styles.input}
          >
            {paises.map((p) => (
              <option key={p.codigo} value={p.codigo}>
                {p.nome}
              </option>
            ))}
          </select>

          <select
            value={estadoId}
            onChange={(e) => {
              const est = estados.find(
                (s) => String(s.id) === e.target.value
              )
              setEstadoId(e.target.value)
              setEstadoNome(est?.nome || '')
            }}
            style={styles.input}
          >
            <option value="">Selecione o estado</option>
            {estados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>

          <select
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            style={styles.input}
          >
            <option value="">Selecione o município</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.nome}>
                {m.nome}
              </option>
            ))}
          </select>

          <button type="submit" style={styles.button}>
            Cadastrar
          </button>
        </form>

        {/* LISTA */}
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Doadores cadastrados</h2>

          {doadores.map((d) => (
            <div key={d.id} style={styles.item}>
              <strong>{d.nome}</strong>
              <span>{d.categoria}</span>
              <span>
                {d.municipio} - {d.estado} ({d.pais})
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: { padding: '30px' },
  container: { maxWidth: '900px', margin: '0 auto' },
  title: { color: '#0B3D91' },
  subtitle: { marginBottom: '10px' },
  section: { marginTop: '20px' },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    marginTop: '20px'
  },
  input: {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  button: {
    background: '#0B3D91',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  item: {
    padding: '10px',
    borderBottom: '1px solid #eee'
  }
}

export default DoadoresAdmincls