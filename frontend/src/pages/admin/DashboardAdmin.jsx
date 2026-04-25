import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarDoacoes } from '../../services/doacoesService'
import { obterTopDoadores } from '../../services/rankingService'
import BackButton from '../../components/ui/BackButton'

/*
  DASHBOARD ADMINISTRATIVO
  - Painel principal da instituição
  - Exibe métricas, ranking e últimas doações
*/

function DashboardAdmin() {
  const [doacoes, setDoacoes] = useState([])
  const [topDoadores, setTopDoadores] = useState([])

  /*
    Carregamento inicial
  */
  useEffect(() => {
    setDoacoes([...listarDoacoes()])
    setTopDoadores(obterTopDoadores(3))
  }, [])

  /*
    Atualização em tempo real (simulada)
  */
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDoacoes([...listarDoacoes()])
      setTopDoadores(obterTopDoadores(3))
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  const totalDoacoes = doacoes.length
  const confirmadas = doacoes.filter((d) => d.status === 'Confirmado')
  const pendentes = doacoes.filter((d) => d.status === 'Pendente')
  const falhas = doacoes.filter((d) => d.status === 'Erro')

  const valorTotalConfirmado = confirmadas.reduce((total, d) => {
    const valorNumerico = Number(
      String(d.valor)
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
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

        {/* ================= BOTÃO VOLTAR ================= */}
        {/*
          Mantém padrão UX do sistema
          Sempre no topo da página interna
        */}
        <BackButton />

        {/* ================= HEADER ================= */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard Administrativo</h1>
            <p style={styles.subtitle}>
              Gerencie a operação da instituição e acompanhe indicadores do sistema em tempo real.
            </p>
          </div>
        </header>

        {/* ================= RESUMO ================= */}
        <section style={styles.summaryGrid}>
          <SummaryCard label="Doações registradas" value={totalDoacoes} />
          <SummaryCard label="Confirmadas" value={confirmadas.length} />
          <SummaryCard label="Pendentes" value={pendentes.length} />
          <SummaryCard label="Falhas" value={falhas.length} />
          <SummaryCard label="Total confirmado" value={valorTotalFormatado} />
        </section>

        {/* ================= LINKS ================= */}
        <section style={styles.grid}>
          <CardLink to="/admin/parceiros" title="Parceiros" />
          <CardLink to="/admin/doadores" title="Doadores" />
          <CardLink to="/admin/prestacao-contas" title="Prestação de Contas" />
          <CardLink to="/admin/relatorios" title="Relatórios" />
          <CardLink to="/admin/pendentes" title="Pendentes" />
          <CardLink to="/admin/graficos" title="Central de Gráficos" />
        </section>

        {/* ================= RANKING ================= */}
        <section style={styles.rankingCard}>
          <h2 style={styles.tableTitle}>Top 3 doadores</h2>

          <div style={styles.rankingGrid}>
            {topDoadores.map((d, i) => (
              <div key={d.nome} style={styles.rankingItem}>
                <div style={styles.rankingPosition}>
                  {getMedalha(i)} {i + 1}º lugar
                </div>

                <h3 style={styles.rankingName}>{d.nome}</h3>

                <p style={styles.rankingText}>
                  {d.total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TABELA ================= */}
        <section style={styles.tableCard}>
          <h2 style={styles.tableTitle}>Últimas doações</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Doador</th>
                <th style={styles.th}>Valor</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {ultimasDoacoes.map((d) => (
                <tr key={d.id}>
                  <td style={styles.td}>{d.data}</td>
                  <td style={styles.td}>{d.doador}</td>
                  <td style={styles.td}>{d.valor}</td>
                  <td style={styles.td}>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </main>
  )
}

/* ================= COMPONENTES AUXILIARES ================= */

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <h2 style={styles.summaryNumber}>{value}</h2>
      <p style={styles.summaryLabel}>{label}</p>
    </div>
  )
}

function CardLink({ to, title }) {
  return (
    <Link to={to} style={styles.card}>
      <h2 style={styles.cardTitle}>{title}</h2>
    </Link>
  )
}

function getMedalha(i) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return ''
}

/* ================= ESTILOS ================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fbff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: { marginBottom: '20px' },
  title: { color: '#0B3D91' },
  subtitle: { color: '#4b5563' },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px'
  },
  summaryCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '16px'
  },
  summaryNumber: { color: '#0B3D91' },
  summaryLabel: { color: '#6b7280' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    textDecoration: 'none'
  },
  cardTitle: { color: '#0B3D91' },

  rankingCard: {
    marginTop: '30px',
    background: '#fff',
    padding: '20px',
    borderRadius: '16px'
  },
  rankingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  rankingItem: {
    background: '#f1f5f9',
    padding: '16px',
    borderRadius: '12px'
  },
  rankingPosition: { fontWeight: 'bold' },
  rankingName: { margin: 0 },
  rankingText: { color: '#4b5563' },

  tableCard: {
    marginTop: '30px',
    background: '#fff',
    padding: '20px',
    borderRadius: '16px'
  },
  table: { width: '100%' },
  th: { textAlign: 'left' },
  td: { padding: '8px 0' }
}

export default DashboardAdmin