import BackButton from '../../components/ui/BackButton'
import { listarNecessidadesConcluidas } from '../../services/necessidadesService'

function HistoricoNecessidadesAdmin() {
  const concluidas = listarNecessidadesConcluidas()

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <h1 style={styles.title}>Histórico de Necessidades</h1>

        <p style={styles.subtitle}>
          Necessidades concluídas e retiradas da campanha ativa.
        </p>

        <section style={styles.card}>
          {concluidas.length === 0 ? (
            <p style={styles.empty}>Nenhuma necessidade concluída ainda.</p>
          ) : (
            concluidas.map((item) => (
              <article key={item.id} style={styles.item}>
                <h2 style={styles.itemTitle}>{item.descricao}</h2>

                <p><strong>Categoria:</strong> {item.categoria}</p>
                <p><strong>Quantidade:</strong> {item.quantidade}</p>
                <p><strong>Prioridade:</strong> {item.prioridade}</p>
                <p><strong>Cadastrado em:</strong> {item.criadoEm}</p>
                <p><strong>Concluído em:</strong> {item.concluidoEm}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.5rem'
  },
  subtitle: {
    color: '#475569'
  },
  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  item: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px'
  },
  itemTitle: {
    color: '#0B3D91'
  },
  empty: {
    color: '#64748b'
  }
}

export default HistoricoNecessidadesAdmin