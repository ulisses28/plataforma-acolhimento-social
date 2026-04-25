import AdminHeader from '../../components/ui/AdminHeader'

/*
  PRESTAÇÃO DE CONTAS (ADMIN)
  - Página destinada à consolidação mensal dos dados
  - Utiliza AdminHeader para manter padrão de navegação e layout
*/

function PrestacaoContasAdmin() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* 
          Header padrão do sistema
          - Já inclui botão voltar automaticamente
          - Mantém consistência visual em todas páginas admin
        */}
        <AdminHeader
          title="Prestação de Contas"
          subtitle="Consolidação mensal das informações institucionais e financeiras."
        />

        {/* Conteúdo da página */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Resumo institucional</h2>

          <p style={styles.text}>
            Esta área será utilizada para organizar e apresentar os dados financeiros,
            relatórios mensais e prestação de contas da instituição de forma clara e transparente.
          </p>

          <p style={styles.text}>
            Aqui poderão ser adicionados futuramente:
          </p>

          <ul style={styles.list}>
            <li>Relatórios mensais consolidados</li>
            <li>Entradas e saídas financeiras</li>
            <li>Distribuição de recursos</li>
            <li>Exportação de relatórios em PDF</li>
          </ul>
        </section>

      </div>
    </main>
  )
}

/*
  Estilos isolados da página
*/
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eaf4ff 0%, #f1f5f9 35%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    marginTop: 0,
    color: '#0B3D91'
  },
  text: {
    color: '#4b5563',
    lineHeight: '1.7'
  },
  list: {
    marginTop: '10px',
    paddingLeft: '18px',
    color: '#374151'
  }
}

export default PrestacaoContasAdmin