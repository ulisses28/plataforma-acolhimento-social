import { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { listarDoadores, salvarNovoDoador } from '../../services/doadoresService'
import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

function DoadoresAdmin() {
  const [doadores, setDoadores] = useState([])

  // Dados principais
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [categoria, setCategoria] = useState('Pessoa Física')
  const [status, setStatus] = useState('ativo')
  const [obs, setObs] = useState('')

  // Tipo de contribuição cadastrada pelo admin
  const [tipoContribuicao, setTipoContribuicao] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [descricaoContribuicao, setDescricaoContribuicao] = useState('')

  // Localização
  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  // Pesquisa inteligente
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('doador')

  useEffect(() => {
    carregar()
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

    if (!documento.trim()) {
      alert('Informe CPF ou CNPJ.')
      return
    }

    if (!telefone.trim()) {
      alert('Informe o telefone.')
      return
    }

    if (!tipoContribuicao) {
      alert('Selecione se é material, voluntário ou apenas cadastro.')
      return
    }

    if (
      (tipoContribuicao === 'Material' || tipoContribuicao === 'Voluntário') &&
      !descricaoContribuicao.trim()
    ) {
      alert('Descreva a contribuição.')
      return
    }

    const paisNome = paises.find((p) => p.codigo === pais)?.nome || 'Brazil'

    const descricaoFinal =
      tipoContribuicao === 'Apenas cadastro'
        ? obs
        : `${tipoContribuicao}: ${quantidade ? quantidade + ' - ' : ''}${descricaoContribuicao}`

    salvarNovoDoador({
      nome: nome.trim(),
      documento: documento.trim(),
      cpfCnpj: documento.trim(),
      telefone: telefone.trim(),
      categoria,
      status,
      tipoContribuicao,
      quantidade,
      descricaoContribuicao,
      obs: descricaoFinal,
      paisCodigo: pais,
      pais: paisNome,
      estadoId,
      estado: estadoNome,
      municipio
    })

    limparFormulario()
    setDoadores(listarDoadores())

    alert('Doador cadastrado com sucesso!')
  }

  function limparFormulario() {
    setNome('')
    setDocumento('')
    setTelefone('')
    setCategoria('Pessoa Física')
    setStatus('ativo')
    setTipoContribuicao('')
    setQuantidade('')
    setDescricaoContribuicao('')
    setObs('')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')
  }

  const doadoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    let lista = [...doadores]

    if (filtro === 'ativos_atencao') {
      lista = lista.filter(
        (d) => (d.status || 'ativo') === 'ativo' || d.status === 'atencao'
      )
    }

    if (filtro === 'inativos') {
      lista = lista.filter((d) => d.status === 'inativo')
    }

    if (termo) {
      lista = lista.filter((d) => {
        const nomeDoador = String(d.nome || '').toLowerCase()
        const documentoDoador = String(d.documento || d.cpfCnpj || '').toLowerCase()

        return nomeDoador.includes(termo) || documentoDoador.includes(termo)
      })
    }

    if (filtro === 'doador' && !termo) {
      return lista.slice(-5).reverse()
    }

    return lista.reverse()
  }, [doadores, busca, filtro])

  function exportarLista() {
    window.print()
  }

  return (
    <main style={styles.page}>
      <BackButton />

      <section style={styles.header}>
        <h1 style={styles.title}>Cadastro de Doadores</h1>
        <p style={styles.subtitle}>
          Gerencie doadores, contribuições materiais, voluntários e localização.
        </p>
      </section>

      <form onSubmit={cadastrar} style={styles.card}>
        <h2 style={styles.formTitle}>Novo Doador</h2>

        <label style={styles.label}>Nome ou razão social</label>
        <input
          style={styles.input}
          placeholder="Nome ou razão social"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label style={styles.label}>CPF ou CNPJ</label>
        <input
          style={styles.input}
          placeholder="Digite CPF ou CNPJ"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <label style={styles.label}>Telefone</label>
        <input
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <label style={styles.label}>Tipo de pessoa</label>
        <select
          style={styles.input}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option>Pessoa Física</option>
          <option>Pessoa Jurídica</option>
          <option>Parceiro</option>
        </select>

        <label style={styles.label}>Tipo de contribuição</label>
        <select
          style={styles.input}
          value={tipoContribuicao}
          onChange={(e) => {
            setTipoContribuicao(e.target.value)
            setQuantidade('')
            setDescricaoContribuicao('')
          }}
        >
          <option value="">Selecione</option>
          <option>Apenas cadastro</option>
          <option>Material</option>
          <option>Voluntário</option>
        </select>

        {(tipoContribuicao === 'Material' || tipoContribuicao === 'Voluntário') && (
          <div style={styles.contribuicaoBox}>
            <label style={styles.label}>Quantidade</label>
            <input
              style={styles.smallInput}
              placeholder="Ex: 24"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />

            <label style={styles.label}>Descrição</label>
            <input
              style={styles.input}
              placeholder={
                tipoContribuicao === 'Material'
                  ? 'Ex: latas de leite ninho, roupas, alimentos'
                  : 'Ex: aulas, recreação, apoio administrativo'
              }
              value={descricaoContribuicao}
              onChange={(e) => setDescricaoContribuicao(e.target.value)}
            />
          </div>
        )}

        <label style={styles.label}>Status do doador</label>
        <select
          style={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ativo">Ativo</option>
          <option value="atencao">Em atenção</option>
          <option value="inativo">Inativo</option>
        </select>

        <label style={styles.label}>Observações</label>
        <textarea
          style={styles.textarea}
          placeholder="Observações internas"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        <h3 style={styles.sectionTitle}>Localização</h3>

        <label style={styles.label}>País</label>
        <select
          style={styles.input}
          value={pais}
          onChange={(e) => {
            setPais(e.target.value)
            setEstadoId('')
            setEstadoNome('')
            setMunicipio('')
          }}
        >
          {paises.map((p) => (
            <option key={p.codigo} value={p.codigo}>
              {p.nome}
            </option>
          ))}
        </select>

        <label style={styles.label}>Estado</label>
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
            <option key={e.id} value={e.id}>
              {e.nome} - {e.sigla}
            </option>
          ))}
        </select>

        <label style={styles.label}>Município</label>
        <select
          style={styles.input}
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
          disabled={!estadoId}
        >
          <option value="">Selecione o município</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>

        <button style={styles.button}>Salvar Doador</button>
      </form>

      <section style={styles.listCard}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.formTitle}>Doadores cadastrados</h2>
            <p style={styles.helperText}>
              Sem pesquisa, aparecem os 5 últimos cadastrados.
            </p>
          </div>

          <button type="button" style={styles.printButton} onClick={exportarLista}>
            Exportar / Imprimir
          </button>
        </div>

        <div style={styles.searchGrid}>
          <input
            style={styles.input}
            placeholder="Buscar por nome, CPF ou CNPJ"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            style={styles.input}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="doador">Procurar por doador</option>
            <option value="todos">Procurar todos</option>
            <option value="ativos_atencao">Ativos e em atenção</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>

        {doadoresFiltrados.length === 0 ? (
          <p style={styles.emptyText}>Nenhum doador encontrado.</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHead}>
              <span>Status</span>
              <span>Nome</span>
              <span>CPF/CNPJ</span>
              <span>Tipo</span>
              <span>Contribuição</span>
              <span>Cidade/Estado</span>
            </div>

            {doadoresFiltrados.map((d) => (
              <div key={d.id} style={styles.tableRow}>
                <span>
                  <span style={{ ...styles.statusDot, background: corStatus(d.status) }} />
                </span>
                <strong>{d.nome}</strong>
                <span>{d.documento || d.cpfCnpj || '-'}</span>
                <span>{d.categoria || '-'}</span>
                <span>{d.tipoContribuicao || d.obs || '-'}</span>
                <span>
                  {d.municipio || '-'} {d.estado ? `- ${d.estado}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function corStatus(status) {
  if (status === 'inativo') return '#dc2626'
  if (status === 'atencao') return '#f97316'
  return '#16a34a'
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '32px'
  },
  header: {
    maxWidth: '850px',
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
    maxWidth: '850px',
    margin: '0 auto',
    background: '#ffffff',
    padding: '30px',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  listCard: {
    maxWidth: '1100px',
    margin: '28px auto 0',
    background: '#ffffff',
    padding: '25px',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  formTitle: {
    color: '#002855',
    margin: 0
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: '18px'
  },
  label: {
    display: 'block',
    marginTop: '12px',
    marginBottom: '6px',
    color: '#334155',
    fontWeight: '700'
  },
  input: {
    width: '100%',
    height: '48px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  smallInput: {
    width: '160px',
    height: '46px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    minHeight: '90px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box'
  },
  contribuicaoBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px',
    margin: '10px 0'
  },
  button: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer',
    marginTop: '12px'
  },
  printButton: {
    background: '#0B3D91',
    color: '#ffffff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '18px'
  },
  helperText: {
    margin: '6px 0 0',
    color: '#64748b',
    fontSize: '14px'
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '14px',
    marginBottom: '18px'
  },
  table: {
    width: '100%',
    overflowX: 'auto'
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '70px 1.5fr 1fr 1fr 1.3fr 1.2fr',
    gap: '12px',
    padding: '12px',
    background: '#eff6ff',
    color: '#0B3D91',
    fontWeight: '900',
    borderRadius: '10px'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '70px 1.5fr 1fr 1fr 1.3fr 1.2fr',
    gap: '12px',
    padding: '14px 12px',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center'
  },
  statusDot: {
    display: 'inline-block',
    width: '13px',
    height: '13px',
    borderRadius: '999px'
  },
  emptyText: {
    color: '#64748b'
  }
}

export default DoadoresAdmin