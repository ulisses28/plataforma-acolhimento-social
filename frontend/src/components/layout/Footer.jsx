function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>Lar Batista Albertine Meador</p>
      <p style={styles.text}>Serra - ES</p>
      <p style={styles.text}>Telefone: (27) 3328-5165</p>
      <p style={styles.text}>Email: gri@larbatista.org.br</p>
    </footer>
  )
}

const styles = {
  footer: {
    marginTop: '40px',
    padding: '24px',
    backgroundColor: '#0B3D91',
    textAlign: 'center'
  },
  text: {
    color: '#ffffff',
    margin: '6px 0'
  }
}

export default Footer