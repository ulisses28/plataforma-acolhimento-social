import { Link } from 'react-router-dom'
import logoLar from '../../assets/logo-lar.jpg'

function Navbar() {
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoLink}>
        <img src={logoLar} alt="Lar Batista" style={styles.logo} />
      </Link>

      <nav style={styles.nav}>
        <Link style={styles.navLink} to="/">Home</Link>
        <Link style={styles.navLink} to="/quem-somos">Quem Somos</Link>
        <Link style={styles.navLink} to="/projetos">Projetos</Link>
        <Link style={styles.navLink} to="/transparencia">Transparência</Link>
        <Link style={styles.navLink} to="/voluntario">Seja um Voluntário</Link>
        <Link style={styles.navLink} to="/parceiros">Parceiros</Link>
      </nav>

      <Link to="/login" style={styles.button}>
        Entrar
      </Link>
    </header>
  )
}

const styles = {
  header: {
    background: 'linear-gradient(90deg, #002855, #0B3D91)',
    minHeight: '110px',
    padding: '18px 7%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px'
  },

  logoLink: {
    width: '130px',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    textDecoration: 'none'
  },

  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: 'transparent',
    filter:
      'brightness(0.88) contrast(1.08) drop-shadow(0 8px 18px rgba(0,0,0,0.35))'
  },

  nav: {
    display: 'flex',
    gap: '26px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flex: 1
  },

  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '900',
    fontSize: '15px'
  },

  button: {
    background: '#ffc928',
    color: '#061f4a',
    padding: '14px 30px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: '900',
    fontSize: '16px'
  }
}

export default Navbar