import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { listarDoadores } from '../../services/doadoresService'
import { listarDoacoes } from '../../services/doacoesService'
import BackButton from '../../components/ui/BackButton'
import AdminHeader from '../../components/ui/AdminHeader'
/*
  DETALHE DO DOADOR (ADMIN)
  - Exibe dados completos do doador
  - Histórico completo de doações
  - Filtros por data e status
*/

function DoadorDetalheAdmin() {
  const { id } = useParams()

  const [doador, setDoador] = useState(null)
  const [doacoes, setDoacoes] = useState([])
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  /*
    Carregar dados iniciais
  */
  useEffect(() => {
    const listaDoadores = listarDoadores()
    const encontrado = listaDoadores.find((item) => String(item.id) === String(id))

    setDoador(encontrado || null)
    setDoacoes(listarDoacoes())
  }, [id])

  /*
    Filtro e ordenação do histórico
  */
  const historico = useMemo(() => {
    if (!doador) return []

    let lista = doacoes.filter((item) => item.doador === doador.nome)

    if (statusFiltro !== 'Todos') {
      lista = lista.filter((item) => item.status === statusFiltro)
    }

    if (dataInicio) {
      lista = lista.filter(
        (item) => converterDataBR(item.data) >= new Date(`${dataInicio}T00:00:00`)
      )
    }

    if (dataFim) {
      lista = lista.filter(
        (item) => converterDataBR(item.data) <= new Date(`${dataFim}T23:59:59`)
      )
    }

    return lista.sort((a, b) => converterDataBR(b.data) - converterDataBR(a.data))
  }, [doador, doacoes, dataInicio, dataFim, statusFiltro])

  /*
    Soma total confirmado
  */
  const totalConfirmado = historico
    .filter((item) => item.status === 'Confirmado')
    .reduce((acc, item) => {
      const valor = Number(
        String(item.valor)
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim()
      )
      return acc + (isNaN(valor) ? 0 : valor)
    }, 0)

  /*
    Caso não encontre o doador
  */
  if (!doador) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <BackButton />
          <h1 style={styles.title}>Doador não encontrado</h1>
          <Link to="/admin/doadores" style={styles.backLink}>
            Voltar para lista
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* ================= BOTÃO PADRÃO ================= */}
        <BackButton label="Voltar para doadores" />

        {/* ================= HEADER ================= */}
        <header style={styles.header}>
          <h1 style={styles.title}>{doador.nome}</h1>
          <p style={styles.subtitle}>
            Ficha completa do doador e histórico desde a primeira doação.
          </p>
        </header>

        {/* ================= INFORMAÇÕES ================= */}
        <section style={styles.infoGrid}>
          <InfoCard title="Telefone" value={doador.telefone} />
          <InfoCard title="Observação" value={doador.obs} />
          <InfoCard title="Última doação" value={historico[0]?.data} />
          <InfoCard
            title="Total confirmado"
            value={totalConfirmado.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          />
        </section>

        {/* ================= FILTROS ================= */}
        <section style={styles.tableCard}>
          <div style={styles.filtersRow}>
            <Filter label="Data inicial">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                style={styles.input}
              />
            </Filter>

            <Filter label="Data final">
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={styles.input}
              />
            </Filter>

            <Filter label="Status">
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                style={styles.input}
              >
                <option value="Todos">Todos</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Pendente">Pendente</option>
                <option value="Erro">Erro</option>
              </select>
            </Filter>
          </div>

          {/* ================= TABELA ================= */}
          <h2 style={styles.tableTitle}>Histórico completo</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Valor</th>
                <th style={styles.th}>Forma</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Detalhe</th>
              </tr>
            </thead>

            <tbody>
              {historico.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyTd}>
                    Nenhuma doação encontrada.
                  </td>
                </tr>
              ) : (
                historico.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.data}</td>
                    <td style={styles.td}>{item.valor}</td>
                    <td style={styles.td}>{item.forma}</td>
                    <td style={styles.td}>{item.status}</td>
                    <td style={styles.td}>
                      {item.descricaoMaterial || item.comprovante || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

      </div>
    </main>
  )
}

/* ================= COMPONENTES AUX ================= */

function InfoCard({ title, value }) {
  return (
    <div style={styles.infoCard}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{value || '-'}</p>
    </div>
  )
}

function Filter({ label, children }) {
  return (
    <div style={styles.filterItem}>
      <label style={styles.filterLabel}>{label}</label>
      {children}
    </div>
  )
}

function converterDataBR(dataBR) {
  if (!dataBR) return new Date(0)
  const [dia, mes, ano] = dataBR.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}

/* ================= ESTILOS ================= */

const styles = {
  page: { padding: '40px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '20px' },
  title: { color: '#0B3D91' },
  subtitle: { color: '#6b7280' },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },

  infoCard: { background: '#fff', padding: '20px', borderRadius: '12px' },
  cardTitle: { margin: 0 },
  cardText: { color: '#374151' },

  tableCard: { marginTop: '20px', background: '#fff', padding: '20px' },

  filtersRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },

  filterItem: { display: 'flex', flexDirection: 'column' },
  filterLabel: { fontWeight: '600' },

  input: { padding: '10px', borderRadius: '8px' },

  table: { width: '100%', marginTop: '20px' },
  th: { textAlign: 'left' },
  td: { padding: '8px 0' },
  emptyTd: { textAlign: 'center', padding: '20px' }
}

export default DoadorDetalheAdmin