import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.logoArea}>
        <img
          src="/logo-lar.png"
          alt="Logo do Lar Batista Albertine Meador"
          style={styles.logo}
        />
        <div>
          <h1 style={styles.title}>Lar Batista Albertine Meador</h1>
          <p style={styles.subtitle}>Plataforma de Acolhimento Social</p>
        </div>
      </div>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/quem-somos">Quem Somos</Link>
        <Link style={styles.link} to="/projetos">Projetos</Link>
        <Link style={styles.link} to="/transparencia">Transparência</Link>
        <Link style={styles.link} to="/voluntario">Seja um Voluntário</Link>
        <Link style={styles.link} to="/parceiros">Parceiros</Link>
        <Link style={styles.loginLink} to="/login">Login</Link>
      </nav>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '16px'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    width: '70px',
    height: '70px',
    objectFit: 'contain'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    color: '#0B3D91'
  },
  subtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280'
  },
  nav: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  link: {
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: 500
  },
  loginLink: {
    textDecoration: 'none',
    color: '#0B3D91',
    fontWeight: 700
  }
}

export default Navbar