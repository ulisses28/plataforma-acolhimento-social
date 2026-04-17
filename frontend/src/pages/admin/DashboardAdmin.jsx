import { Link } from 'react-router-dom'

function DashboardAdmin() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard Administrativo</h1>
            <p style={styles.subtitle}>
              Gerencie parceiros, doadores, relatórios, prestação de contas e pendências do sistema.
            </p>
          </div>
        </header>

        <section style={styles.grid}>
          <Link to="/admin/parceiros" style={styles.card}>
            <h2 style={styles.cardTitle}>Parceiros</h2>
            <p style={styles.cardText}>Cadastre e acompanhe empresas, igrejas e apoiadores institucionais.</p>
          </Link>

          <Link to="/admin/doadores" style={styles.card}>
            <h2 style={styles.cardTitle}>Doadores</h2>
            <p style={styles.cardText}>Gerencie doadores de bens materiais e contribuições fora do site.</p>
          </Link>

          <Link to="/admin/prestacao-contas" style={styles.card}>
            <h2 style={styles.cardTitle}>Prestação de Contas</h2>
            <p style={styles.cardText}>Organize os dados mensais que poderão ser publicados em transparência.</p>
          </Link>

          <Link to="/admin/relatorios" style={styles.card}>
            <h2 style={styles.cardTitle}>Relatórios</h2>
            <p style={styles.cardText}>Consulte dados consolidados e relatórios administrativos.</p>
          </Link>

          <Link to="/admin/pendentes" style={styles.card}>
            <h2 style={styles.cardTitle}>Pendentes e Não Concluídas</h2>
            <p style={styles.cardText}>Acompanhe doações pendentes, falhas, expirações e cancelamentos.</p>
          </Link>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '22px'
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
  }
}

export default DashboardAdmin