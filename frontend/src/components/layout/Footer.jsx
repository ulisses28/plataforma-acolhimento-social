import { Link } from 'react-router-dom'
import logoLar from '../../assets/logo-lar.jpg'


function Footer() {
  return (
    <footer style={styles.footer}>
      <div>
        <div style={styles.logoBox}>
          <img src={logoLar} alt="Lar Batista" style={styles.logo} />
        </div>
        <p style={styles.text}>
          O Lar Batista Albertine Meador acolhe, cuida e transforma vidas com
          amor, fé e solidariedade.
        </p>
      </div>

      <div>
        <h4 style={styles.title}>Navegação</h4>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/quem-somos">Quem Somos</Link>
        <Link style={styles.link} to="/projetos">Projetos</Link>
        <Link style={styles.link} to="/transparencia">Transparência</Link>
        <Link style={styles.link} to="/voluntario">Seja um Voluntário</Link>
      </div>

      <div>
        <h4 style={styles.title}>Institucional</h4>
        <Link style={styles.link} to="/doar-agora">Doe agora</Link>
        <Link style={styles.link} to="/parceiros">Parceiros</Link>
        <Link style={styles.link} to="/admin/login">Área administrativa</Link>
      </div>

      <div>
        <h4 style={styles.title}>Contato</h4>
        <p style={styles.text}>(27) 3328-5165</p>
        <p style={styles.text}>visitas@larbatista.org.br</p>
        <p style={styles.text}>Rua Santos Dumont, 120, Laranjeiras, Serra - ES</p>
        <p style={styles.text}>CEP: 29.165-048</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#002855',
    color: '#ffffff',
    padding: '55px 8%',
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1.3fr',
    gap: '42px'
  },
  logoBox: {
    width: '145px',
    background: '#ffffff',
    borderRadius: '18px',
    padding: '10px',
    marginBottom: '15px'
  },
  logo: {
    width: '100%',
    display: 'block'
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: '14px'
  },
  link: {
    display: 'block',
    color: '#dbeafe',
    textDecoration: 'none',
    marginBottom: '9px'
  },
  text: {
    color: '#dbeafe',
    lineHeight: '1.6'
  }
}

export default Footer