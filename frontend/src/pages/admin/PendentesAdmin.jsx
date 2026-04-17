import React, { useEffect, useState } from 'react'
import { listarDoacoes } from '../../services/doacoesService'

function PendentesAdmin() {
  const [doacoes, setDoacoes] = useState([])

  useEffect(() => {
    setDoacoes([...listarDoacoes()])
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setDoacoes([...listarDoacoes()])
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  const pendentes = doacoes.filter((doacao) => doacao.status === 'Pendente')
  const falhas = doacoes.filter((doacao) => doacao.status === 'Erro')
  const naoConcluidas = doacoes.filter(
    (doacao) => doacao.status === 'Pendente' || doacao.status === 'Erro'
  )

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Pendentes e Não Concluídas</h1>
          <p style={styles.subtitle}>
            Acompanhe doações que ainda não foram confirmadas ou que apresentaram falha no processamento.
          </p>
        </header>

        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{pendentes.length}</h2>
            <p style={styles.summaryLabel}>Pendentes</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{falhas.length}</h2>
            <p style={styles.summaryLabel}>Falhas</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{naoConcluidas.length}</h2>
            <p style={styles.summaryLabel}>Não concluídas</p>
          </div>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Controle de pendências</h2>
            <p style={styles.tableSubtitle}>
              Somente doações confirmadas devem compor os relatórios e totais financeiros.
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
                </tr>
              </thead>
              <tbody>
                {naoConcluidas.length === 0 ? (
                  <tr>
                    <td style={styles.emptyTd} colSpan="4">
                      Nenhuma doação pendente ou com falha no momento.
                    </td>
                  </tr>
                ) : (
                  naoConcluidas.map((doacao) => (
                    <tr key={doacao.id}>
                      <td style={styles.td}>{doacao.data}</td>
                      <td style={styles.td}>{doacao.valor}</td>
                      <td style={styles.td}>{doacao.forma}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(doacao.status === 'Pendente'
                              ? styles.statusPending
                              : styles.statusError)
                          }}
                        >
                          {doacao.status}
                        </span>
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

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F1F5F9',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    fontSize: '2.2rem',
    color: '#0B3D91'
  },
  subtitle: {
    marginTop: '10px',
    color: '#4b5563',
    lineHeight: '1.6'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  summaryNumber: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#0B3D91'
  },
  summaryLabel: {
    marginTop: '10px',
    color: '#4b5563'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  tableHeader: {
    marginBottom: '20px'
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
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
}

export default PendentesAdmin