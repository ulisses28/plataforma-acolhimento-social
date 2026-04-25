import React, { useEffect, useState } from 'react'
import { listarDoacoes, atualizarStatusDoacao } from '../../services/doacoesService'
import AdminHeader from '../../components/ui/AdminHeader'

/*
  PENDENTES ADMIN
  - Controle de doações não concluídas
  - Permite alterar status manualmente
  - Usa AdminHeader (já inclui botão voltar)
*/

function PendentesAdmin() {
  const [doacoes, setDoacoes] = useState([])

  /*
    Carregamento inicial
  */
  useEffect(() => {
    setDoacoes([...listarDoacoes()])
  }, [])

  /*
    Atualização automática (simulação tempo real)
  */
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDoacoes([...listarDoacoes()])
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  /*
    Atualiza status manualmente
  */
  function handleAtualizarStatus(id, novoStatus) {
    atualizarStatusDoacao(id, novoStatus)
    setDoacoes([...listarDoacoes()])
  }

  const pendentes = doacoes.filter((d) => d.status === 'Pendente')
  const falhas = doacoes.filter((d) => d.status === 'Erro')
  const naoConcluidas = doacoes.filter(
    (d) => d.status === 'Pendente' || d.status === 'Erro'
  )

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER PADRÃO DO SISTEMA */}
        <AdminHeader
          title="Pendentes e Não Concluídas"
          subtitle="Acompanhe doações que ainda não foram confirmadas ou que apresentaram falha."
        />

        {/* RESUMO */}
        <section style={styles.summaryGrid}>
          <SummaryCard label="Pendentes" value={pendentes.length} />
          <SummaryCard label="Falhas" value={falhas.length} />
          <SummaryCard label="Não concluídas" value={naoConcluidas.length} />
        </section>

        {/* TABELA */}
        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Controle de pendências</h2>
            <p style={styles.tableSubtitle}>
              Apenas doações confirmadas devem entrar nos relatórios oficiais.
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
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {naoConcluidas.length === 0 ? (
                  <tr>
                    <td style={styles.emptyTd} colSpan="5">
                      Nenhuma pendência no momento.
                    </td>
                  </tr>
                ) : (
                  naoConcluidas.map((d) => (
                    <tr key={d.id}>
                      <td style={styles.td}>{d.data}</td>
                      <td style={styles.td}>{d.valor}</td>
                      <td style={styles.td}>{d.forma}</td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(d.status === 'Pendente'
                              ? styles.statusPending
                              : styles.statusError)
                          }}
                        >
                          {d.status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            style={styles.confirmButton}
                            onClick={() => handleAtualizarStatus(d.id, 'Confirmado')}
                          >
                            Confirmar
                          </button>

                          <button
                            style={styles.pendingButton}
                            onClick={() => handleAtualizarStatus(d.id, 'Pendente')}
                          >
                            Pendente
                          </button>

                          <button
                            style={styles.errorButton}
                            onClick={() => handleAtualizarStatus(d.id, 'Erro')}
                          >
                            Erro
                          </button>
                        </div>
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

/*
  COMPONENTE AUXILIAR
*/
function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <h2 style={styles.summaryNumber}>{value}</h2>
      <p style={styles.summaryLabel}>{label}</p>
    </div>
  )
}

/*
  ESTILOS
*/
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
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9'
  },
  emptyTd: {
    textAlign: 'center',
    padding: '20px'
  },
  statusBadge: {
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
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  confirmButton: {
    backgroundColor: '#166534',
    color: '#fff',
    border: 'none',
    padding: '8px',
    borderRadius: '8px'
  },
  pendingButton: {
    backgroundColor: '#92400e',
    color: '#fff',
    border: 'none',
    padding: '8px',
    borderRadius: '8px'
  },
  errorButton: {
    backgroundColor: '#991b1b',
    color: '#fff',
    border: 'none',
    padding: '8px',
    borderRadius: '8px'
  }
}

export default PendentesAdmin