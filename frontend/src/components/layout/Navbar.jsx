import { Link } from 'react-router-dom'
import { useState } from 'react'
import logoLar from '../../assets/logo-lar.jpg'
import { registrarInteracao } from '../../services/analyticsService'
import './navbar.css'

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  function clicarMenu() {
    registrarInteracao()
    setMenuAberto(false)
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
    background: 'linear-gradient(90deg, #0B4FA3, #1A67C7)',
    minHeight: '78px',
    padding: '10px 5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    flexWrap: 'wrap',
    position: 'relative',
    boxShadow: '0 4px 14px rgba(11, 79, 163, 0.20)'
  },

  logoLink: {
    width: '82px',
    height: '60px',
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
    filter: 'drop-shadow(0 5px 12px rgba(0,0,0,0.20))'
  },

  nav: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flex: 1
  },

  navMobileOpen: {
    display: 'flex',
    position: 'absolute',
    top: '78px',
    left: 0,
    right: 0,
    background: 'linear-gradient(180deg, #0B4FA3, #0A3D7A)',
    flexDirection: 'column',
    padding: '24px',
    zIndex: 999,
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
  },

  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '900',
    fontSize: '14px'
  },

  button: {
    background: '#FFD54A',
    color: '#06295c',
    padding: '12px 26px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: '900',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(255,213,74,0.35)'
  },

  menuButton: {
    display: 'none',
    background: '#FFD54A',
    border: 'none',
    color: '#06295c',
    fontSize: '26px',
    borderRadius: '12px',
    padding: '7px 13px',
    cursor: 'pointer',
    fontWeight: '900',
    zIndex: 1000
  }
}

export default Navbar