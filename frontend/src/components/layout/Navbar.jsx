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

      <div style={styles.searchArea}>
  <div style={styles.searchBox}>
    <span style={styles.searchIcon} aria-hidden="true">🔍</span>
    <input
      type="text"
      placeholder="Pesquisar no site..."
      style={styles.searchInput}
      aria-label="Pesquisar no site"
    />
  </div>
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
    display: 'grid',
    gridTemplateColumns: '180px 1fr auto',
    alignItems: 'center',
    gap: '24px',
    padding: '10px 28px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    minHeight: '84px'
  },
  searchArea: {
  display: 'flex',
  justifyContent: 'center',
  width: '100%'
},

searchWrapper: {
  position: 'relative',
  width: '100%',
  maxWidth: '380px'
},

searchIcon: {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '16px',
  color: '#6b7280',
  pointerEvents: 'none' // importante!
},

searchInput: {
  width: '100%',
  padding: '12px 16px 12px 40px', // espaço para a lupa
  borderRadius: '999px',
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: '14px',
  backgroundColor: '#f9fafb'
},
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  logo: {
    height: '110px',
    maxHeight: '100%',
    width: 'auto',
    objectFit: 'contain',
    display: 'block'
  },

  searchArea: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },

  searchInput: {
    width: '100%',
    maxWidth: '300px',
    padding: '12px 18px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    outline: 'none',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: '#f9fafb'
  },

  nav: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap'
  },

  link: {
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: 500,
    fontSize: '15px',
    whiteSpace: 'nowrap'
  },

  login: {
    textDecoration: 'none',
    backgroundColor: '#0B3D91',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: 600,
    whiteSpace: 'nowrap'
  }
}

export default Navbar