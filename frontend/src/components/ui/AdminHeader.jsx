import BackButton from './BackButton'

/*
  Header padrão das páginas administrativas
  - Centraliza o botão voltar, título e subtítulo
  - Evita repetir código em todas as páginas
*/

function AdminHeader({ title, subtitle, showBack = true }) {
  return (
    <header style={styles.header}>
      {showBack && (
        <div style={styles.backArea}>
          <BackButton />
        </div>
      )}

      <div>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  )
}

const styles = {
  header: {
    marginBottom: '24px'
  },
  backArea: {
    marginBottom: '10px'
  },
  title: {
    margin: 0,
    color: '#0B3D91',
    fontSize: '2.2rem'
  },
  subtitle: {
    marginTop: '8px',
    color: '#4b5563',
    lineHeight: '1.6'
  }
}

export default AdminHeader