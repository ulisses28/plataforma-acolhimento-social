import { useEffect, useState } from 'react'

import BackButton from '../../components/ui/BackButton'
import { listarNecessidadesConcluidas } from '../../services/necessidadesService'

function HistoricoNecessidadesAdmin() {
  const [concluidas, setConcluidas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const dados = await listarNecessidadesConcluidas()

        setConcluidas(Array.isArray(dados) ? dados : [])
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
        setConcluidas([])
      } finally {
        setCarregando(false)
      }
    }

    carregarHistorico()
  }, [])

  function formatarData(item) {
    const data = item.updatedAt || item.concluidoEm || item.createdAt

    if (!data) return 'Não informado'

    try {
      return new Date(data).toLocaleDateString('pt-BR')
    } catch {
      return data
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <h1 style={styles.title}>Histórico de Necessidades</h1>

        <p style={styles.subtitle}>
          Necessidades concluídas e retiradas da campanha ativa.
        </p>

        <section style={styles.card}>
          {carregando ? (
            <p style={styles.empty}>Carregando histórico...</p>
          ) : concluidas.length === 0 ? (
            <p style={styles.empty}>Nenhuma necessidade concluída ainda.</p>
          ) : (
            concluidas.map((item) => (
              <article key={item._id || item.id} style={styles.item}>
                <h2 style={styles.itemTitle}>{item.descricao}</h2>

                <p>
                  <strong>Categoria:</strong> {item.categoria}
                </p>

                <p>
                  <strong>Quantidade:</strong> {item.quantidade}{' '}
                  {item.unidade || 'unidade(s)'}
                </p>

                <p>
                  <strong>Prioridade:</strong> {item.prioridade}
                </p>

                <p>
                  <strong>Status:</strong> {item.status}
                </p>

                <p>
                  <strong>Cadastrado em:</strong>{' '}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('pt-BR')
                    : item.criadoEm || 'Não informado'}
                </p>

                <p>
                  <strong>Concluído em:</strong> {formatarData(item)}
                </p>
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