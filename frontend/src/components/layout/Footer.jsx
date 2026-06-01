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

      <div>
        <h4 style={styles.title}>Redes Sociais</h4>

        <a
          href="https://www.facebook.com/larbatistaam"
          target="_blank"
          rel="noreferrer"
          style={styles.socialLink}
        >
          Facebook
        </a>

        <a
          href="https://www.instagram.com/larbatistaalbertinemeador"
          target="_blank"
          rel="noreferrer"
          style={styles.socialLink}
        >
          Instagram
        </a>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'linear-gradient(180deg, #0B4FA3, #0A3D7A)',
    color: '#ffffff',
    padding: '45px 8%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '34px',
    boxShadow: '0 -6px 18px rgba(11,79,163,0.18)'
  },

  logoBox: {
    width: '95px',
    background: '#ffffff',
    borderRadius: '14px',
    padding: '8px',
    marginBottom: '14px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.18)'
  },

  logo: {
    width: '100%',
    display: 'block'
  },

  title: {
    textTransform: 'uppercase',
    marginBottom: '14px',
    color: '#ffffff',
    fontSize: '15px'
  },

  link: {
    display: 'block',
    color: '#eaf3ff',
    textDecoration: 'none',
    marginBottom: '9px',
    fontWeight: '700'
  },

  socialLink: {
    display: 'block',
    color: '#ffffff',
    textDecoration: 'none',
    marginBottom: '12px',
    fontWeight: '900'
  },

  text: {
    color: '#eaf3ff',
    lineHeight: '1.6',
    fontWeight: '600'
  }
}

export default Footer