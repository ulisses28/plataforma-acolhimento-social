import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarDoacoes } from '../../services/doacoesService'
import { obterTopDoadores } from '../../services/rankingService'
import BackButton from '../../components/ui/BackButton'
import {
  listarNecessidades,
  salvarNecessidade,
  contarNecessidadesPorCategoria
} from '../../services/necessidadesService'

function DashboardAdmin() {
  const [doacoes, setDoacoes] = useState([])
  const [topDoadores, setTopDoadores] = useState([])

  const [necessidades, setNecessidades] = useState([])
  const [graficoNecessidades, setGraficoNecessidades] = useState({})
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [descricaoNecessidade, setDescricaoNecessidade] = useState('')
  const [prioridade, setPrioridade] = useState('MEDIA')

  useEffect(() => {
    carregarDashboard()
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      carregarDashboard()
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  function carregarDashboard() {
    setDoacoes([...listarDoacoes()])
    setTopDoadores(obterTopDoadores(3))
    setNecessidades(listarNecessidades())
    setGraficoNecessidades(contarNecessidadesPorCategoria())
  }

  function abrirCategoria(categoria) {
    setCategoriaSelecionada(categoria)
    setMostrarFormulario(false)
    setDescricaoNecessidade('')
    setPrioridade('MEDIA')
  }

  function salvarNovaNecessidade() {
    if (!categoriaSelecionada) {
      alert('Selecione uma categoria.')
      return
    }

    if (!descricaoNecessidade.trim()) {
      alert('Digite a necessidade.')
      return
    }

    salvarNecessidade({
      categoria: categoriaSelecionada,
      descricao: descricaoNecessidade.trim(),
      prioridade
    })

    setDescricaoNecessidade('')
    setPrioridade('MEDIA')
    setMostrarFormulario(false)
    carregarDashboard()

    alert('Necessidade cadastrada com sucesso!')
  }

  const totalDoacoes = doacoes.length
  const confirmadas = doacoes.filter((d) => d.status === 'Confirmado')
  const pendentes = doacoes.filter((d) => d.status === 'Pendente')
  const falhas = doacoes.filter((d) => d.status === 'Erro')

  const valorTotalConfirmado = confirmadas.reduce((total, d) => {
    const valorNumerico = Number(
      String(d.valor)
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    )

    return total + (isNaN(valorNumerico) ? 0 : valorNumerico)
  }, 0)

  const valorTotalFormatado = valorTotalConfirmado.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  const ultimasDoacoes = [...doacoes].slice(-5).reverse()

  const necessidadesDaCategoria = necessidades.filter(
    (item) => item.categoria === categoriaSelecionada
  )

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard Administrativo</h1>
            <p style={styles.subtitle}>
              Gerencie a operação da instituição e acompanhe indicadores do sistema em tempo real.
            </p>
          </div>
        </header>

        <section style={styles.summaryGrid}>
          <SummaryCard icon="📦" label="Doações registradas" value={totalDoacoes} />
          <SummaryCard icon="✅" label="Confirmadas" value={confirmadas.length} />
          <SummaryCard icon="⏳" label="Pendentes" value={pendentes.length} />
          <SummaryCard icon="⚠️" label="Falhas" value={falhas.length} />
          <SummaryCard icon="💰" label="Total confirmado" value={valorTotalFormatado} />
        </section>

        <section style={styles.grid}>
          <CardLink to="/admin/parceiros" icon="🤝" title="Parceiros" />
          <CardLink to="/admin/doadores" icon="👥" title="Doadores" />
          <CardLink to="/admin/prestacao-contas" icon="📄" title="Prestação de Contas" />
          <CardLink to="/admin/relatorios" icon="📊" title="Relatórios" />
          <CardLink to="/admin/pendentes" icon="⏳" title="Pendentes" />
          <CardLink to="/admin/graficos" icon="📈" title="Central de Gráficos" />
        </section>

        <section style={styles.needsCard}>
          <div style={styles.needsHeader}>
            <div>
              <h2 style={styles.tableTitle}>Nossas Necessidades</h2>
              <p style={styles.subtitle}>
                Cadastre necessidades da instituição por categoria e prioridade.
              </p>
            </div>
          </div>

          <div style={styles.categoryButtons}>
            {['Alimentos', 'Roupas', 'Utensílios', 'Higiene', 'Escolar', 'Outros'].map(
              (categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => abrirCategoria(categoria)}
                  style={
                    categoriaSelecionada === categoria
                      ? styles.categoryButtonActive
                      : styles.categoryButton
                  }
                >
                  {categoria}
                </button>
              )
            )}
          </div>

          {categoriaSelecionada && (
            <div style={styles.categoryArea}>
              <h3 style={styles.categoryTitle}>{categoriaSelecionada}</h3>

              <button
                type="button"
                style={styles.addNeedButton}
                onClick={() => setMostrarFormulario(true)}
              >
                + Deseja cadastrar uma nova necessidade?
              </button>

              {mostrarFormulario && (
                <div style={styles.formNeed}>
                  <label style={styles.label}>Descrição da necessidade</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Ex: 24 latas de leite ninho, roupas infantis, material escolar..."
                    value={descricaoNecessidade}
                    onChange={(e) => setDescricaoNecessidade(e.target.value)}
                  />

                  <label style={styles.label}>Nível de prioridade</label>

                  <div style={styles.priorityGroup}>
                    <label style={styles.priorityItem}>
                      <input
                        type="radio"
                        checked={prioridade === 'ALTA'}
                        onChange={() => setPrioridade('ALTA')}
                      />
                      <span style={{ ...styles.priorityDot, background: '#dc2626' }} />
                      Alta
                    </label>

                    <label style={styles.priorityItem}>
                      <input
                        type="radio"
                        checked={prioridade === 'MEDIA'}
                        onChange={() => setPrioridade('MEDIA')}
                      />
                      <span style={{ ...styles.priorityDot, background: '#f97316' }} />
                      Média
                    </label>

                    <label style={styles.priorityItem}>
                      <input
                        type="radio"
                        checked={prioridade === 'BAIXA'}
                        onChange={() => setPrioridade('BAIXA')}
                      />
                      <span style={{ ...styles.priorityDot, background: '#16a34a' }} />
                      Baixa
                    </label>
                  </div>

                  <div style={styles.formActions}>
                    <button type="button" style={styles.saveButton} onClick={salvarNovaNecessidade}>
                      Salvar
                    </button>

                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={() => {
                        setMostrarFormulario(false)
                        setDescricaoNecessidade('')
                        setPrioridade('MEDIA')
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div style={styles.needsList}>
                {necessidadesDaCategoria.length === 0 ? (
                  <p style={styles.emptyText}>Nenhuma necessidade cadastrada nesta categoria.</p>
                ) : (
                  necessidadesDaCategoria.map((item) => (
                    <div key={item.id} style={styles.needItem}>
                      <span
                        style={{
                          ...styles.priorityBar,
                          background: prioridadeCor(item.prioridade)
                        }}
                      />

                      <div>
                        <strong>{item.descricao}</strong>
                        <p style={styles.needMeta}>
                          Prioridade: {item.prioridade} | Cadastro: {item.criadoEm}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div style={styles.pizzaBox}>
            <h3 style={styles.categoryTitle}>Gráfico por Categoria</h3>

            <div style={styles.pizzaGrid}>
              {Object.keys(graficoNecessidades).length === 0 ? (
                <p style={styles.emptyText}>Nenhuma necessidade cadastrada para gerar gráfico.</p>
              ) : (
                Object.entries(graficoNecessidades).map(([categoria, total]) => (
                  <div key={categoria} style={styles.pizzaItem}>
                    <span style={styles.pizzaColor} />
                    <strong>{categoria}</strong>
                    <span>{total}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section style={styles.rankingCard}>
          <h2 style={styles.tableTitle}>Top 3 doadores</h2>

          <div style={styles.rankingGrid}>
            {topDoadores.map((d, i) => (
              <div key={d.nome} style={styles.rankingItem}>
                <div style={styles.rankingPosition}>
                  {getMedalha(i)} {i + 1}º lugar
                </div>

                <h3 style={styles.rankingName}>{d.nome}</h3>

                <p style={styles.rankingText}>
                  {d.total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.tableCard}>
          <h2 style={styles.tableTitle}>Últimas doações</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Doador</th>
                <th style={styles.th}>Valor</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {ultimasDoacoes.map((d) => (
                <tr key={d.id}>
                  <td style={styles.td}>{d.data}</td>
                  <td style={styles.td}>{d.doador}</td>
                  <td style={styles.td}>{d.valor}</td>
                  <td style={styles.td}>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

function SummaryCard({ icon, label, value }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryIcon}>{icon}</div>
      <h2 style={styles.summaryNumber}>{value}</h2>
      <p style={styles.summaryLabel}>{label}</p>
    </div>
  )
}

function CardLink({ to, icon, title }) {
  return (
    <Link to={to} style={styles.card}>
      <div style={styles.cardIcon}>{icon}</div>
      <h2 style={styles.cardTitle}>{title}</h2>
    </Link>
  )
}

function getMedalha(i) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return ''
}

function prioridadeCor(prioridade) {
  if (prioridade === 'ALTA') return '#dc2626'
  if (prioridade === 'MEDIA') return '#f97316'
  return '#16a34a'
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fbff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: 0
  },
  subtitle: {
    color: '#4b5563',
    lineHeight: '1.5'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px'
  },
  summaryCard: {
    background: '#fff',
    padding: '22px',
    borderRadius: '18px',
    borderLeft: '6px solid #ffc928',
    boxShadow: '0 8px 24px rgba(0,0,0,0.07)'
  },
  summaryIcon: {
    fontSize: '26px',
    marginBottom: '8px'
  },
  summaryNumber: {
    color: '#0B3D91',
    margin: 0
  },
  summaryLabel: {
    color: '#6b7280',
    marginBottom: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    background: '#fff',
    padding: '22px',
    borderRadius: '18px',
    textDecoration: 'none',
    borderLeft: '6px solid #ffc928',
    boxShadow: '0 8px 24px rgba(0,0,0,0.07)'
  },
  cardIcon: {
    fontSize: '30px',
    marginBottom: '10px'
  },
  cardTitle: {
    color: '#0B3D91',
    margin: 0
  },
  needsCard: {
    marginTop: '30px',
    background: '#fff',
    padding: '26px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  needsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap'
  },
  categoryButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px'
  },
  categoryButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '800'
  },
  categoryButtonActive: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '900'
  },
  categoryArea: {
    marginTop: '20px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px'
  },
  categoryTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  addNeedButton: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '900'
  },
  formNeed: {
    marginTop: '16px',
    background: '#fff',
    borderRadius: '14px',
    padding: '18px',
    border: '1px solid #dbeafe'
  },
  label: {
    display: 'block',
    color: '#334155',
    fontWeight: '800',
    marginBottom: '6px',
    marginTop: '10px'
  },
  textarea: {
    width: '100%',
    minHeight: '90px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box'
  },
  priorityGroup: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap'
  },
  priorityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontWeight: '800',
    color: '#334155'
  },
  priorityDot: {
    width: '13px',
    height: '13px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px'
  },
  saveButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  cancelButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  needsList: {
    marginTop: '18px'
  },
  needItem: {
    display: 'flex',
    gap: '12px',
    background: '#fff',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '10px',
    border: '1px solid #e5e7eb'
  },
  priorityBar: {
    width: '8px',
    borderRadius: '999px'
  },
  needMeta: {
    color: '#64748b',
    margin: '4px 0 0',
    fontSize: '14px'
  },
  pizzaBox: {
    marginTop: '22px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px'
  },
  pizzaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px'
  },
  pizzaItem: {
    background: '#fff',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #e5e7eb'
  },
  pizzaColor: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#ffc928'
  },
  rankingCard: {
    marginTop: '30px',
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.07)'
  },
  tableTitle: {
    color: '#002855'
  },
  rankingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  rankingItem: {
    background: '#f1f5f9',
    padding: '16px',
    borderRadius: '12px'
  },
  rankingPosition: {
    fontWeight: 'bold'
  },
  rankingName: {
    margin: 0
  },
  rankingText: {
    color: '#4b5563'
  },
  tableCard: {
    marginTop: '30px',
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.07)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    color: '#0B3D91',
    borderBottom: '1px solid #dbeafe',
    padding: '10px'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #f1f5f9'
  },
  emptyText: {
    color: '#64748b'
  }
}

export default DashboardAdmin