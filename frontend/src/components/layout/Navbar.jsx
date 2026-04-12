import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.logoArea}>
        <img
          src="/logo-lar.jpg"
          alt="Logo Lar Batista Albertine Meador"
          style={styles.logo}
        />
      </div>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/quem-somos">Quem Somos</Link>
        <Link style={styles.link} to="/projetos">Projetos</Link>
        <Link style={styles.link} to="/transparencia">Transparência</Link>
        <Link style={styles.link} to="/voluntario">Seja um Voluntário</Link>
        <Link style={styles.link} to="/parceiros">Parceiros</Link>
        <Link style={styles.login} to="/login">Entrar</Link>
      </nav>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    minHeight: '70px'
  },

  logoArea: {
    display: 'flex',
    alignItems: 'center'
  },

  logo: {
    height: '65px',
    width: 'auto',
    objectFit: 'contain',
    display: 'block'
  },

  nav: {
    display: 'flex',
    gap: '22px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  link: {
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: 500,
    fontSize: '15px'
  },

  login: {
    textDecoration: 'none',
    backgroundColor: '#0B3D91',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: 600
  }
}

export default Navbar