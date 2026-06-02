import { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { listarNecessidadesAtivas } from '../../services/necessidadesService'

const PRIORIDADES = {
  ALTA: {
    texto: 'Alta prioridade',
    cor: '#dc2626'
  },
  MEDIA: {
    texto: 'Média prioridade',
    cor: '#f59e0b'
  },
  BAIXA: {
    texto: 'Baixa prioridade',
    cor: '#16a34a'
  }
}

const CATEGORIAS = [
  'Alimentos',
  'Roupas',
  'Utensílios',
  'Higiene',
  'Escolar',
  'Outros'
]

function NossasNecessidades() {
  const [necessidades, setNecessidades] = useState([])

useEffect(() => {
  async function carregarNecessidades() {
    try {
      const dados = await listarNecessidadesAtivas()
      setNecessidades(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error('Erro ao carregar necessidades:', error)
      setNecessidades([])
    }
  }

  carregarNecessidades()
}, [])

  const dadosPrioridade = useMemo(() => {
    return {
      ALTA: necessidades.filter((item) => item.prioridade === 'ALTA').length,
      MEDIA: necessidades.filter((item) => item.prioridade === 'MEDIA').length,
      BAIXA: necessidades.filter((item) => item.prioridade === 'BAIXA').length
    }
  }, [necessidades])

  const total =
    dadosPrioridade.ALTA +
    dadosPrioridade.MEDIA +
    dadosPrioridade.BAIXA

  function montarDasharray(valor) {
    if (total === 0) return '0 100'
    return `${(valor / total) * 100} ${100 - (valor / total) * 100}`
  }

  function offsetPrioridade(tipo) {
    const alta = total ? (dadosPrioridade.ALTA / total) * 100 : 0
    const media = total ? (dadosPrioridade.MEDIA / total) * 100 : 0

    if (tipo === 'ALTA') return 25
    if (tipo === 'MEDIA') return 25 - alta
    return 25 - alta - media
  }

  function itensPorCategoria(categoria) {
    return necessidades.filter((item) => item.categoria === categoria)
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Nossas Necessidades</h1>

          <p style={styles.subtitle}>
            Veja as necessidades cadastradas pela instituição conforme o grau de prioridade.
          </p>
        </header>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Prioridades atuais</h2>

          <p style={styles.text}>
            O gráfico mostra a distribuição das necessidades por urgência.
          </p>

          <div style={styles.chartWrapper}>
            <div style={styles.pieArea}>
              <svg viewBox="0 0 42 42" style={styles.svgPie}>
                <circle
                  r="15.915"
                  cx="21"
                  cy="21"
                  fill="transparent"
                  stroke={PRIORIDADES.ALTA.cor}
                  strokeWidth="9"
                  strokeDasharray={montarDasharray(dadosPrioridade.ALTA)}
                  strokeDashoffset={offsetPrioridade('ALTA')}
                />

                <circle
                  r="15.915"
                  cx="21"
                  cy="21"
                  fill="transparent"
                  stroke={PRIORIDADES.MEDIA.cor}
                  strokeWidth="9"
                  strokeDasharray={montarDasharray(dadosPrioridade.MEDIA)}
                  strokeDashoffset={offsetPrioridade('MEDIA')}
                />

                <circle
                  r="15.915"
                  cx="21"
                  cy="21"
                  fill="transparent"
                  stroke={PRIORIDADES.BAIXA.cor}
                  strokeWidth="9"
                  strokeDasharray={montarDasharray(dadosPrioridade.BAIXA)}
                  strokeDashoffset={offsetPrioridade('BAIXA')}
                />

                <circle cx="21" cy="21" r="9" fill="#ffffff" />

                <text
                  x="21"
                  y="20"
                  textAnchor="middle"
                  fontSize="3"
                  fill="#0B3D91"
                  fontWeight="700"
                >
                  {total}
                </text>

                <text
                  x="21"
                  y="24"
                  textAnchor="middle"
                  fontSize="2.1"
                  fill="#475569"
                >
                  itens
                </text>
              </svg>
            </div>

            <div style={styles.priorityGrid}>
              {Object.entries(PRIORIDADES).map(([chave, prioridade]) => (
                <div key={chave} style={styles.priorityCard}>
                  <span
                    style={{
                      ...styles.dot,
                      background: prioridade.cor
                    }}
                  />

                  <div>
                    <strong>{prioridade.texto}</strong>
                    <p>{dadosPrioridade[chave]} item(ns)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Itens por categoria</h2>

          <div style={styles.categoryGrid}>
            {CATEGORIAS.map((categoria) => {
              const itens = itensPorCategoria(categoria)

              return (
                <article key={categoria} style={styles.categoryCard}>
                  <h3 style={styles.categoryTitle}>{categoria}</h3>

                  {itens.length === 0 ? (
                    <p style={styles.empty}>Nenhum item cadastrado.</p>
                  ) : (
                    <div style={styles.itemList}>
                      {itens.map((item) => (
                        <div key={item.id} style={styles.needItem}>
                          <span
                            style={{
                              ...styles.dot,
                              background:
                                PRIORIDADES[item.prioridade]?.cor || '#f59e0b'
                            }}
                          />

                          <div>
                            <strong>{item.descricao}</strong>

                            <p style={styles.needText}>
                              {item.quantidade} {item.unidade || 'unidade(s)'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section style={styles.legendBox}>
          <h2 style={styles.cardTitle}>Legenda de prioridade</h2>

          <div style={styles.legendGrid}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.dot, background: '#dc2626' }} />
              <strong>Alta:</strong>
              <span>necessidade urgente</span>
            </div>

            <div style={styles.legendItem}>
              <span style={{ ...styles.dot, background: '#f59e0b' }} />
              <strong>Média:</strong>
              <span>necessidade importante</span>
            </div>

            <div style={styles.legendItem}>
              <span style={{ ...styles.dot, background: '#16a34a' }} />
              <strong>Baixa:</strong>
              <span>necessidade de reposição</span>
            </div>
          </div>
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
    maxWidth: '1150px',
    margin: '0 auto'
  },

  header: {
    marginBottom: '26px'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.6rem',
    margin: 0
  },

  subtitle: {
    color: '#334155',
    lineHeight: '1.6',
    maxWidth: '850px'
  },

  card: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '30px',
    marginBottom: '26px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)'
  },

  cardTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  text: {
    color: '#334155',
    lineHeight: '1.7'
  },

  chartWrapper: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '36px',
    alignItems: 'center',
    marginTop: '22px'
  },

  pieArea: {
    minHeight: '310px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  svgPie: {
    width: '280px',
    height: '280px',
    transform: 'rotate(-90deg)',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.14))'
  },

  priorityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },

  priorityCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px'
  },

  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px'
  },

  categoryCard: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px'
  },

  categoryTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  needItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '12px',
    border: '1px solid #e0ecff'
  },

  needText: {
    margin: '4px 0 0',
    color: '#475569'
  },

  empty: {
    color: '#64748b'
  },

  legendBox: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '30px',
    marginBottom: '26px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)'
  },

  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '14px'
  },

  legendItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '14px'
  },

  dot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    flexShrink: 0
  }
}

export default NossasNecessidades