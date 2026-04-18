import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { listarDoadores } from '../../services/doadoresService'
import { listarDoacoes } from '../../services/doacoesService'

function DoadorDetalheAdmin() {
  const { id } = useParams()
  const [doador, setDoador] = useState(null)
  const [doacoes, setDoacoes] = useState([])
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  useEffect(() => {
    const listaDoadores = listarDoadores()
    const encontrado = listaDoadores.find((item) => String(item.id) === String(id))
    setDoador(encontrado || null)
    setDoacoes(listarDoacoes())
  }, [id])

  const historico = useMemo(() => {
    if (!doador) return []

    let lista = doacoes.filter((item) => item.doador === doador.nome)

    if (statusFiltro !== 'Todos') {
      lista = lista.filter((item) => item.status === statusFiltro)
    }

    if (dataInicio) {
      lista = lista.filter((item) => converterDataBR(item.data) >= new Date(`${dataInicio}T00:00:00`))
    }

    if (dataFim) {
      lista = lista.filter((item) => converterDataBR(item.data) <= new Date(`${dataFim}T23:59:59`))
    }

    return lista.sort((a, b) => converterDataBR(b.data) - converterDataBR(a.data))
  }, [doador, doacoes, dataInicio, dataFim, statusFiltro])

  const totalConfirmado = historico
    .filter((item) => item.status === 'Confirmado')
    .reduce((acc, item) => {
      const valor = Number(
        String(item.valor).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
      )
      return acc + (isNaN(valor) ? 0 : valor)
    }, 0)

  if (!doador) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Doador não encontrado</h1>
          <Link to="/admin/doadores" style={styles.backLink}>Voltar para doadores</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>{doador.nome}</h1>
            <p style={styles.subtitle}>Ficha completa do doador e histórico desde a primeira doação.</p>
          </div>
          <Link to="/admin/doadores" style={styles.backButton}>Voltar</Link>
        </div>

        <section style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Telefone</h3>
            <p style={styles.cardText}>{doador.telefone || '-'}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Observação</h3>
            <p style={styles.cardText}>{doador.obs || '-'}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Última doação</h3>
            <p style={styles.cardText}>{historico[0]?.data || '-'}</p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Total confirmado</h3>
            <p style={styles.cardText}>
              {totalConfirmado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.filtersRow}>
            <div style={styles.filterItem}>
              <label style={styles.filterLabel}>Data inicial</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.filterItem}>
              <label style={styles.filterLabel}>Data final</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.filterItem}>
              <label style={styles.filterLabel}>Status</label>
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
            </div>
          </div>

          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Histórico completo</h2>
            <p style={styles.tableSubtitle}>
              Filtre por período e status para análise administrativa.
            </p>
          </div>

          <div style={styles.tableWrapper}>
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
                    <td style={styles.emptyTd} colSpan="5">
                      Nenhuma doação encontrada para esse filtro.
                    </td>
                  </tr>
                ) : (
                  historico.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>{item.data}</td>
                      <td style={styles.td}>{item.valor}</td>
                      <td style={styles.td}>{item.forma}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(item.status === 'Confirmado'
                              ? styles.statusConfirmed
                              : item.status === 'Erro'
                              ? styles.statusError
                              : styles.statusPending)
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {item.descricaoMaterial || item.comprovante || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function converterDataBR(dataBR) {
  if (!dataBR) return new Date(0)
  const [dia, mes, ano] = dataBR.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eaf4ff 0%, #f1f5f9 35%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    color: '#0B3D91',
    fontSize: '2.2rem'
  },
  subtitle: {
    marginTop: '8px',
    color: '#4b5563'
  },
  backButton: {
    textDecoration: 'none',
    backgroundColor: '#0B3D91',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '600'
  },
  backLink: {
    color: '#0B3D91',
    textDecoration: 'none',
    fontWeight: '600'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '24px'
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    margin: 0,
    color: '#0B3D91',
    fontSize: '1rem'
  },
  cardText: {
    marginTop: '10px',
    color: '#1f2937'
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  filtersRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px',
    marginBottom: '20px'
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  filterLabel: {
    color: '#374151',
    fontWeight: '600'
  },
  input: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #d1d5db'
  },
  tableHeader: {
    marginBottom: '18px'
  },
  tableTitle: {
    margin: 0,
    color: '#0B3D91'
  },
  tableSubtitle: {
    marginTop: '8px',
    color: '#6b7280'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    fontSize: '14px'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1f2937'
  },
  emptyTd: {
    padding: '20px 14px',
    textAlign: 'center',
    color: '#6b7280'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusConfirmed: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
}

export default DoadorDetalheAdmin