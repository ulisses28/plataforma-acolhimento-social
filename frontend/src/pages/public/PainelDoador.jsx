
function PainelDoador() {
  const doacoes = [
    {
      id: 1,
      data: '10/04/2026',
      valor: 'R$ 100,00',
      forma: 'Pix',
      status: 'Confirmado'
    },
    {
      id: 2,
      data: '22/03/2026',
      valor: 'R$ 50,00',
      forma: 'TED',
      status: 'Confirmado'
    },
    {
      id: 3,
      data: '05/02/2026',
      valor: 'R$ 80,00',
      forma: 'Pix',
      status: 'Pendente'
    }
  ]

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.headerCard}>
          <div>
            <h1 style={styles.title}>Olá, Doador</h1>
            <p style={styles.subtitle}>
              Acompanhe aqui seu histórico de contribuições e seu relacionamento com a instituição.
            </p>
          </div>

          <button style={styles.primaryButton}>
            Nova doação
          </button>
        </section>

        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>3</h2>
            <p style={styles.summaryLabel}>Doações registradas</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>R$ 230,00</h2>
            <p style={styles.summaryLabel}>Valor total doado</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>2</h2>
            <p style={styles.summaryLabel}>Doações confirmadas</p>
          </div>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Histórico de doações</h2>
            <p style={styles.tableSubtitle}>
              Visualize suas últimas contribuições.
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
                {doacoes.map((doacao) => (
                  <tr key={doacao.id}>
                    <td style={styles.td}>{doacao.data}</td>
                    <td style={styles.td}>{doacao.valor}</td>
                    <td style={styles.td}>{doacao.forma}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(doacao.status === 'Confirmado'
                            ? styles.statusConfirmed
                            : styles.statusPending)
                        }}
                      >
                        {doacao.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
    backgroundColor: '#F1F5F9',
    minHeight: '100vh',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#0B3D91'
  },
  subtitle: {
    marginTop: '10px',
    color: '#4b5563',
    lineHeight: '1.6'
  },
  primaryButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '14px 22px',
    backgroundColor: '#0B3D91',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer'
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
  }
}

export default PainelDoador