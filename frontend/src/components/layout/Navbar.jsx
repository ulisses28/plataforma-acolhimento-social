import { Link } from 'react-router-dom'
import logoLar from '../../assets/logo-lar.jpg'
import { registrarInteracao } from '../../services/analyticsService'

function Navbar() {
  function registrarClique() {
    registrarInteracao()
  }

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoLink} onClick={registrarClique}>
        <img src={logoLar} alt="Lar Batista Albertine Meador" style={styles.logo} />
      </Link>

      <nav style={styles.nav}>
        <Link style={styles.navLink} to="/" onClick={registrarClique}>
          Home
        </Link>

        <Link style={styles.navLink} to="/quem-somos" onClick={registrarClique}>
          Quem Somos
        </Link>

        <Link style={styles.navLink} to="/projetos" onClick={registrarClique}>
          Projetos
        </Link>

        <Link style={styles.navLink} to="/transparencia" onClick={registrarClique}>
          Transparência
        </Link>

        <Link style={styles.navLink} to="/voluntario" onClick={registrarClique}>
          Seja um Voluntário
        </Link>

        <Link style={styles.navLink} to="/parceiros" onClick={registrarClique}>
          Parceiros
        </Link>

        <Link style={styles.navLink} to="/tutorial" onClick={registrarClique}>
          Tutorial
        </Link>
      </nav>

      <Link to="/login" style={styles.button} onClick={registrarClique}>
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
  },
  logoBox: {
  background: '#ffc928',
  borderRadius: '18px',
  padding: '12px 18px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 18px rgba(0,0,0,0.25)'
},

logoMain: {
  fontSize: '24px',
  fontWeight: '900',
  color: '#0B3D91',
  lineHeight: 1
},

logoSub: {
  fontSize: '13px',
  fontWeight: '700',
  color: '#ff6b00',
  marginTop: '4px',
  letterSpacing: '1px'
},
}

export default Navbar