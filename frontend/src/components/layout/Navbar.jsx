import { Link } from 'react-router-dom'
import { useState } from 'react'
import logoLar from '../../assets/logo-lar.jpg'
import { registrarInteracao } from '../../services/analyticsService'
import './navbar.css'

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  function registrarClique() {
    registrarInteracao()
  }

  function fecharMenu() {
    setMenuAberto(false)
  }

  function clicarMenu() {
    registrarClique()
    fecharMenu()
  }

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoLink} onClick={clicarMenu}>
        <img src={logoLar} alt="Lar Batista Albertine Meador" style={styles.logo} />
      </Link>

      <button
        type="button"
        className="navbar-mobile-button"
        style={styles.menuButton}
        onClick={() => setMenuAberto(!menuAberto)}
      >
        ☰
      </button>

      <nav
        className={`navbar-menu ${menuAberto ? 'navbar-open' : ''}`}
        style={{
          ...styles.nav,
          ...(menuAberto ? styles.navMobileOpen : {})
        }}
      >
        <Link style={styles.navLink} to="/" onClick={clicarMenu}>Home</Link>
        <Link style={styles.navLink} to="/quem-somos" onClick={clicarMenu}>Quem Somos</Link>
        <Link style={styles.navLink} to="/projetos" onClick={clicarMenu}>Projetos</Link>
        <Link style={styles.navLink} to="/transparencia" onClick={clicarMenu}>Transparência</Link>
        <Link style={styles.navLink} to="/voluntario" onClick={clicarMenu}>Seja um Voluntário</Link>
        <Link style={styles.navLink} to="/parceiros" onClick={clicarMenu}>Parceiros</Link>
        <Link style={styles.navLink} to="/governanca-institucional" onClick={clicarMenu}>Governança</Link>
        <Link style={styles.navLink} to="/tutorial" onClick={clicarMenu}>Tutorial</Link>

        <Link
          to="/login"
          className="navbar-enter-button"
          style={styles.button}
          onClick={clicarMenu}
        >
          Entrar
        </Link>
      </nav>
    </header>
  )
}

const styles = {
  header: {
    background: 'linear-gradient(90deg, #002855, #0B3D91)',
    minHeight: '110px',
    padding: '18px 5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
    position: 'relative'
  },

  logoLink: {
    width: '130px',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    zIndex: 1000
  },

  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: 'transparent',
    filter: 'brightness(0.88) contrast(1.08) drop-shadow(0 8px 18px rgba(0,0,0,0.35))'
  },

  nav: {
    display: 'flex',
    gap: '22px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flex: 1
  },

  navMobileOpen: {
    display: 'flex',
    position: 'absolute',
    top: '110px',
    left: 0,
    right: 0,
    background: '#0B3D91',
    flexDirection: 'column',
    padding: '28px',
    zIndex: 999,
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
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
  },

  menuButton: {
    display: 'none',
    background: '#ffc928',
    border: 'none',
    color: '#002855',
    fontSize: '28px',
    borderRadius: '12px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: '900',
    zIndex: 1000
  }
}

export default Navbar