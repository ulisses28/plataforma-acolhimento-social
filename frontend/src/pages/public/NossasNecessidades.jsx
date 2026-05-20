import { useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { listarNecessidades } from '../../services/necessidadesService'
import { registrarInteracao } from '../../services/analyticsService'

const WHATSAPP_LINK = 'https://wa.me/5527999999999'

const CATEGORIAS = [
  {
    nome: 'Alimentos',
    cor: '#dc2626',
    exemplos: [
      'Alimentos não perecíveis',
      'Leite em pó',
      'Arroz, feijão, macarrão e óleo',
      'Itens para composição de cestas básicas'
    ]
  },
  {
    nome: 'Roupas',
    cor: '#2563eb',
    exemplos: [
      'Roupas em bom estado',
      'Calçados',
      'Roupas de cama',
      'Cobertores e toalhas'
    ]
  },
  {
    nome: 'Utensílios',
    cor: '#16a34a',
    exemplos: [
      'Carrinhos de bebê',
      'Colchões',
      'Móveis em bom estado',
      'Utensílios domésticos'
    ]
  },
  {
    nome: 'Higiene',
    cor: '#f59e0b',
    exemplos: [
      'Sabonete, shampoo e creme dental',
      'Fraldas',
      'Papel higiênico',
      'Produtos de limpeza'
    ]
  },
  {
    nome: 'Escolar',
    cor: '#7c3aed',
    exemplos: [
      'Cadernos, lápis e canetas',
      'Mochilas',
      'Material pedagógico',
      'Papel A4 e materiais de apoio'
    ]
  },
  {
    nome: 'Outros',
    cor: '#0ea5e9',
    exemplos: [
      'Itens diversos em bom estado',
      'Equipamentos de apoio',
      'Materiais para bazar solidário',
      'Outras contribuições combinadas com a instituição'
    ]
  }
]

function NossasNecessidades() {
  const necessidades = listarNecessidades()
  const [tooltip, setTooltip] = useState(null)

  const dadosGrafico = useMemo(() => {
    return CATEGORIAS.map((categoria) => {
      const itens = necessidades.filter((item) => item.categoria === categoria.nome)

      return {
        ...categoria,
        total: itens.length,
        itens
      }
    })
  }, [necessidades])

  const totalCategorias = CATEGORIAS.length
  const tamanhoFatia = 100 / totalCategorias

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Nossas Necessidades</h1>

          <p style={styles.subtitle}>
            Conheça, de forma transparente, as principais áreas em que a
            instituição pode receber apoio da sociedade.
          </p>
        </header>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Visão geral das categorias</h2>

              <p style={styles.text}>
                Passe o mouse sobre o gráfico para visualizar os itens
                cadastrados pela administração em cada categoria.
              </p>
            </div>
          </div>

          <div style={styles.chartWrapper}>
            <div style={styles.pieArea}>
              <svg viewBox="0 0 42 42" style={styles.svgPie}>
                {dadosGrafico.map((categoria, index) => {
                  const offset = 25 - index * tamanhoFatia

                  return (
                    <circle
                      key={categoria.nome}
                      r="15.915"
                      cx="21"
                      cy="21"
                      fill="transparent"
                      stroke={categoria.cor}
                      strokeWidth="9"
                      strokeDasharray={`${tamanhoFatia} ${100 - tamanhoFatia}`}
                      strokeDashoffset={offset}
                      style={styles.pieSlice}
                      onMouseEnter={() => setTooltip(categoria)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                })}

                <circle cx="21" cy="21" r="9" fill="#ffffff" />

                <text
                  x="21"
                  y="20"
                  textAnchor="middle"
                  fontSize="3.2"
                  fill="#0B3D91"
                  fontWeight="700"
                >
                  LAR
                </text>

                <text
                  x="21"
                  y="24"
                  textAnchor="middle"
                  fontSize="2.2"
                  fill="#475569"
                >
                  Apoio
                </text>
              </svg>

              {tooltip && (
                <div style={styles.tooltip}>
                  <h3 style={{ ...styles.tooltipTitle, color: tooltip.cor }}>
                    {tooltip.nome}
                  </h3>

                  {tooltip.itens.length === 0 ? (
                    <p style={styles.tooltipText}>
                      Ainda não há item específico cadastrado nesta categoria.
                    </p>
                  ) : (
                    <ul style={styles.tooltipList}>
                      {tooltip.itens.map((item) => (
                        <li key={item.id}>
                          {item.descricao} — prioridade {item.prioridade}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div style={styles.legendGrid}>
              {dadosGrafico.map((categoria) => (
                <div key={categoria.nome} style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      background: categoria.cor
                    }}
                  />

                  <div>
                    <strong>{categoria.nome}</strong>
                    <p>{categoria.total} item(ns) cadastrado(s)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>O que pode ser doado</h2>

          <p style={styles.text}>
            As contribuições são recebidas conforme a necessidade institucional,
            sempre respeitando a organização interna, a capacidade de
            armazenamento e a finalidade social da instituição.
          </p>

          <div style={styles.donationGrid}>
            {CATEGORIAS.map((categoria) => (
              <article key={categoria.nome} style={styles.categoryCard}>
                <h3 style={{ ...styles.categoryTitle, color: categoria.cor }}>
                  {categoria.nome}
                </h3>

                <ul style={styles.list}>
                  {categoria.exemplos.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section style={styles.contactCard}>
          <div>
            <h2 style={styles.cardTitle}>Fale conosco</h2>

            <p style={styles.text}>
              Para alinhar uma contribuição, tirar dúvidas ou verificar a melhor
              forma de apoio, entre em contato com a instituição.
            </p>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            style={styles.whatsappButton}
          >
            Falar no WhatsApp
          </a>
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
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap'
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
    position: 'relative',
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
  pieSlice: {
    cursor: 'pointer',
    transition: 'stroke-width 0.2s ease, opacity 0.2s ease'
  },
  tooltip: {
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '14px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.14)',
    zIndex: 10
  },
  tooltipTitle: {
    margin: '0 0 8px'
  },
  tooltipText: {
    margin: 0,
    color: '#64748b'
  },
  tooltipList: {
    margin: 0,
    paddingLeft: '18px',
    color: '#334155',
    lineHeight: '1.5'
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px'
  },
  legendItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '14px'
  },
  legendColor: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    flexShrink: 0
  },
  donationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
    marginTop: '22px'
  },
  categoryCard: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px'
  },
  categoryTitle: {
    marginTop: 0
  },
  list: {
    color: '#334155',
    lineHeight: '1.9',
    paddingLeft: '20px'
  },
  contactCard: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '30px',
    marginBottom: '26px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  whatsappButton: {
    background: '#16a34a',
    color: '#ffffff',
    padding: '14px 22px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontWeight: '900',
    boxShadow: '0 8px 18px rgba(22,163,74,0.25)'
  }
}

export default NossasNecessidades