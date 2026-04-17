import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarDoacoes } from '../../services/doacoesService'

function DashboardAdmin() {
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

  const totalDoacoes = doacoes.length
  const confirmadas = doacoes.filter((doacao) => doacao.status === 'Confirmado')
  const pendentes = doacoes.filter((doacao) => doacao.status === 'Pendente')
  const falhas = doacoes.filter((doacao) => doacao.status === 'Erro')

  const valorTotalConfirmado = confirmadas.reduce((total, doacao) => {
    const valorNumerico = Number(
      String(doacao.valor).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    )

    return total + (isNaN(valorNumerico) ? 0 : valorNumerico)
  }, 0)

  const valorTotalFormatado = valorTotalConfirmado.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  const ultimasDoacoes = [...doacoes].slice(-5).reverse()

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard Administrativo</h1>
            <p style={styles.subtitle}>
              Gerencie a operação da instituição e acompanhe indicadores do sistema em tempo real.
            </p>
          </div>
        </header>

        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{totalDoacoes}</h2>
            <p style={styles.summaryLabel}>Doações registradas</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{confirmadas.length}</h2>
            <p style={styles.summaryLabel}>Confirmadas</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{pendentes.length}</h2>
            <p style={styles.summaryLabel}>Pendentes</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{falhas.length}</h2>
            <p style={styles.summaryLabel}>Falhas</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{valorTotalFormatado}</h2>
            <p style={styles.summaryLabel}>Total confirmado</p>
          </div>
        </section>

        <section style={styles.grid}>
          <Link to="/admin/parceiros" style={styles.card}>
            <h2 style={styles.cardTitle}>Parceiros</h2>
            <p style={styles.cardText}>
              Cadastre e acompanhe empresas, igrejas, prefeitura e apoiadores institucionais.
            </p>
          </Link>

          <Link to="/admin/doadores" style={styles.card}>
            <h2 style={styles.cardTitle}>Doadores</h2>
            <p style={styles.cardText}>
              Organize doadores de materiais, contribuições presenciais e registros internos.
            </p>
          </Link>

          <Link to="/admin/prestacao-contas" style={styles.card}>
            <h2 style={styles.cardTitle}>Prestação de Contas</h2>
            <p style={styles.cardText}>
              Consolide dados mensais para prestação de contas e transparência institucional.
            </p>
          </Link>

          <Link to="/admin/relatorios" style={styles.card}>
            <h2 style={styles.cardTitle}>Relatórios</h2>
            <p style={styles.cardText}>
              Visualize informações consolidadas e indicadores administrativos.
            </p>
          </Link>

          <Link to="/admin/pendentes" style={styles.card}>
            <h2 style={styles.cardTitle}>Pendentes e Não Concluídas</h2>
            <p style={styles.cardText}>
              Acompanhe falhas, pendências e transações que não devem entrar nos totais oficiais.
            </p>
          </Link>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Últimas doações registradas</h2>
            <p style={styles.tableSubtitle}>
              Visão rápida das movimentações mais recentes do sistema.
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
                {ultimasDoacoes.length === 0 ? (
                  <tr>
                    <td style={styles.emptyTd} colSpan="4">
                      Nenhuma doação registrada até o momento.
                    </td>
                  </tr>
                ) : (
                  ultimasDoacoes.map((doacao) => (
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
                              : doacao.status === 'Pendente'
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
    marginBottom: '28px'
  },
  title: {
    margin: 0,
    color: '#0B3D91',
    fontSize: '2.2rem'
  },
  subtitle: {
    marginTop: '10px',
    color: '#4b5563',
    lineHeight: '1.6'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '22px',
    marginBottom: '24px'
  },
  card: {
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '26px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
    color: 'inherit'
  },
  cardTitle: {
    marginTop: 0,
    color: '#0B3D91'
  },
  cardText: {
    color: '#374151',
    lineHeight: '1.7'
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

export default DashboardAdmin