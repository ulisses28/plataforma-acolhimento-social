import { Link } from 'react-router-dom'
import logoLar from '../../assets/logo-lar.jpg'

function Navbar() {
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoBox}>
        <img src={logoLar} alt="Lar Batista Albertine Meador" style={styles.logo} />
      </Link>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/quem-somos">Quem Somos</Link>
        <Link style={styles.link} to="/projetos">Projetos</Link>
        <Link style={styles.link} to="/transparencia">Transparência</Link>
        <Link style={styles.link} to="/voluntario">Seja um Voluntário</Link>
        <Link style={styles.link} to="/parceiros">Parceiros</Link>
      </nav>

      <Link to="/login" style={styles.button}>Entrar</Link>
    </header>
  )
}

const styles = {
  header: {
    minHeight: '110px',
    padding: '18px 7%',
    background: 'linear-gradient(90deg, #002855, #0B3D91)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.18)'
  },
  logoBox: {
    width: '125px',
    height: '90px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    boxShadow: '0 8px 22px rgba(0,0,0,0.25)'
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    opacity: 0.96
  },
  nav: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '800',
    fontSize: '15px'
  },
  button: {
    background: '#ffc928',
    color: '#061f4a',
    padding: '14px 28px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: '900'
  }
}

export default Navbar