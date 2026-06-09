import React, { useEffect, useState } from 'react'
import {
  listarDoacoes,
  atualizarStatusDoacao
} from '../../services/doacoesService'
import AdminHeader from '../../components/ui/AdminHeader'

function PendentesAdmin() {
  const [doacoes, setDoacoes] = useState([])

  useEffect(() => {
    carregar()
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      carregar()
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  function carregar() {
    setDoacoes([...listarDoacoes()])
  }

  function handleAtualizarStatus(id, novoStatus) {
    atualizarStatusDoacao(id, novoStatus)
    carregar()
  }

  function abrirComprovante(comprovante) {
  if (!comprovante) {
    alert('Nenhum comprovante anexado.')
    return
  }

  if (!String(comprovante).startsWith('data:')) {
    alert('Este comprovante antigo foi salvo apenas como nome do arquivo. Envie uma nova TED para salvar o arquivo corretamente.')
    return
  }

  const novaJanela = window.open()

  if (!novaJanela) {
    alert('O navegador bloqueou a abertura do comprovante.')
    return
  }

  novaJanela.document.write(`
    <iframe
      src="${comprovante}"
      style="width:100%;height:100vh;border:none;"
    ></iframe>
  `)

  novaJanela.document.close()
}

  function baixarComprovante(comprovante, nome = 'comprovante.pdf') {
  if (!comprovante) {
    alert('Nenhum comprovante anexado.')
    return
  }

  if (!String(comprovante).startsWith('data:')) {
    alert('Este comprovante antigo foi salvo apenas como nome do arquivo. Envie uma nova TED para baixar corretamente.')
    return
  }

  const link = document.createElement('a')
  link.href = comprovante
  link.download = nome
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  }

  const pendentes = doacoes.filter((d) => d.status === 'Pendente')
  const falhas = doacoes.filter((d) => d.status === 'Erro')
  const naoConcluidas = doacoes.filter(
    (d) => d.status === 'Pendente' || d.status === 'Erro'
  )

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <AdminHeader
          title="Pendentes e Não Concluídas"
          subtitle="Confira PIX, TED e comprovantes antes de confirmar a contabilização."
        />

        <section style={styles.summaryGrid}>
          <SummaryCard label="Pendentes" value={pendentes.length} />
          <SummaryCard label="Falhas" value={falhas.length} />
          <SummaryCard label="Não concluídas" value={naoConcluidas.length} />
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Controle de pendências</h2>
            <p style={styles.tableSubtitle}>
              PIX e TED só entram nos gráficos após confirmação manual do administrador.
            </p>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Doador</th>
                  <th style={styles.th}>Valor</th>
                  <th style={styles.th}>Forma</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Comprovante</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {naoConcluidas.length === 0 ? (
                  <tr>
                    <td style={styles.emptyTd} colSpan="7">
                      Nenhuma pendência no momento.
                    </td>
                  </tr>
                ) : (
                  naoConcluidas.map((d) => (
                    <tr key={d.id}>
                      <td style={styles.td}>{d.data || '-'}</td>
                      <td style={styles.td}>{d.doador || d.nomeDoador || 'Não informado'}</td>
                      <td style={styles.td}>{d.valor || '-'}</td>
                      <td style={styles.td}>{d.forma || d.formaPagamento || '-'}</td>

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
                        {d.comprovante ? (
                          <div style={styles.linkGroup}>
                            <button
                              type="button"
                              style={styles.linkButton}
                              onClick={() => abrirComprovante(d.comprovante)}
                            >
                              Visualizar
                            </button>

                            <span style={styles.separator}>|</span>

                            <button
                              type="button"
                              style={styles.linkButton}
                              onClick={() =>
                                baixarComprovante(
                                  d.comprovante,
                                  d.comprovanteNome || 'comprovante.pdf'
                                )
                              }
                            >
                              Baixar
                            </button>
                          </div>
                        ) : (
                          <span style={styles.noFile}>Sem anexo</span>
                        )}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            type="button"
                            style={styles.confirmButton}
                            onClick={() =>
                              handleAtualizarStatus(d.id, 'Confirmado')
                            }
                          >
                            Confirmar
                          </button>

                          <button
                            type="button"
                            style={styles.pendingButton}
                            onClick={() =>
                              handleAtualizarStatus(d.id, 'Pendente')
                            }
                          >
                            Rejeitar
                          </button>

                          <button
                            type="button"
                            style={styles.errorButton}
                            onClick={() =>
                              handleAtualizarStatus(d.id, 'Erro')
                            }
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

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <h2 style={styles.summaryNumber}>{value}</h2>
      <p style={styles.summaryLabel}>{label}</p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F1F5F9',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '1250px',
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
    borderCollapse: 'collapse',
    minWidth: '900px'
  },

  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #e5e7eb',
    color: '#334155'
  },

  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1f2937',
    verticalAlign: 'middle'
  },

  emptyTd: {
    textAlign: 'center',
    padding: '24px',
    color: '#64748b'
  },

  statusBadge: {
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '800'
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

  linkGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap'
  },

  linkButton: {
    background: 'transparent',
    border: 'none',
    color: '#0B3D91',
    fontWeight: '900',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0
  },

  separator: {
    color: '#94a3b8'
  },

  noFile: {
    color: '#94a3b8',
    fontSize: '13px'
  },

  confirmButton: {
    backgroundColor: '#166534',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '800'
  },

  pendingButton: {
    backgroundColor: '#92400e',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '800'
  },

  errorButton: {
    backgroundColor: '#991b1b',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '800'
  }
}

export default PendentesAdmin