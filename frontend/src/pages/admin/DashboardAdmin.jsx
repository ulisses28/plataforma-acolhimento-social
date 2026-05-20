import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import BackButton from '../../components/ui/BackButton'

import { listarDoacoes } from '../../services/doacoesService'

import { obterTopDoadores } from '../../services/rankingService'

import {
  listarNecessidadesAtivas,
  salvarNecessidade,
  contarNecessidadesPorCategoria,
  concluirNecessidade
} from '../../services/necessidadesService'

function DashboardAdmin() {
  const [doacoes, setDoacoes] = useState([])
  const [topDoadores, setTopDoadores] = useState([])

  const [necessidades, setNecessidades] = useState([])
  const [graficoNecessidades, setGraficoNecessidades] = useState({})

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [descricaoNecessidade, setDescricaoNecessidade] =
    useState('')

  const [prioridade, setPrioridade] = useState('MEDIA')

  const [quantidade, setQuantidade] = useState('')

  useEffect(() => {
    carregarDashboard()
  }, [])

  function carregarDashboard() {
    setDoacoes([...listarDoacoes()])

    setTopDoadores(obterTopDoadores(3))

    setNecessidades(listarNecessidadesAtivas())

    setGraficoNecessidades(
      contarNecessidadesPorCategoria()
    )
  }

  function abrirCategoria(categoria) {
    setCategoriaSelecionada(categoria)

    setMostrarFormulario(false)

    setDescricaoNecessidade('')

    setPrioridade('MEDIA')

    setQuantidade('')
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
      prioridade,
      quantidade
    })

    setDescricaoNecessidade('')
    setPrioridade('MEDIA')
    setQuantidade('')

    setMostrarFormulario(false)

    carregarDashboard()

    alert('Necessidade cadastrada com sucesso!')
  }

  const totalDoacoes = doacoes.length

  const confirmadas = doacoes.filter(
    (d) => d.status === 'Confirmado'
  )

  const pendentes = doacoes.filter(
    (d) => d.status === 'Pendente'
  )

  const falhas = doacoes.filter(
    (d) => d.status === 'Erro'
  )

  const valorTotalConfirmado =
    confirmadas.reduce((total, d) => {
      const valorNumerico = Number(
        String(d.valor)
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim()
      )

      return total + (isNaN(valorNumerico) ? 0 : valorNumerico)
    }, 0)

  const valorTotalFormatado =
    valorTotalConfirmado.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

  const ultimasDoacoes = [...doacoes]
    .slice(-5)
    .reverse()

  const necessidadesDaCategoria =
    necessidades.filter(
      (item) =>
        item.categoria === categoriaSelecionada
    )

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>
            Dashboard Administrativo
          </h1>

          <p style={styles.subtitle}>
            Gerencie a operação da instituição
            e acompanhe indicadores em tempo real.
          </p>
        </header>

        {/* INDICADORES */}

        <section style={styles.sectionHeaderBlue}>
          <h2 style={styles.sectionTitleWhite}>
            Indicadores do Sistema
          </h2>

          <p style={styles.sectionSubtitleWhite}>
            Monitoramento operacional da plataforma.
          </p>
        </section>

        <section style={styles.summaryGrid}>
          <SummaryCard
            icon="📦"
            label="Doações registradas"
            value={totalDoacoes}
          />

          <SummaryCard
            icon="✅"
            label="Confirmadas"
            value={confirmadas.length}
          />

          <SummaryCard
            icon="⏳"
            label="Pendentes"
            value={pendentes.length}
          />

          <SummaryCard
            icon="⚠️"
            label="Falhas"
            value={falhas.length}
          />

          <SummaryCard
            icon="💰"
            label="Total confirmado"
            value={valorTotalFormatado}
          />
        </section>

        {/* PAINEL ADMIN */}

        <section style={styles.sectionHeaderBlue}>
          <h2 style={styles.sectionTitleWhite}>
            Painel de Controle do Administrador
          </h2>

          <p style={styles.sectionSubtitleWhite}>
            Acesse os módulos administrativos da plataforma.
          </p>
        </section>

        <section style={styles.grid}>
          <CardLink
            to="/admin/parceiros"
            icon="🤝"
            title="Parceiros"
            descricao="Empresas e instituições parceiras."
          />

          <CardLink
            to="/admin/doadores"
            icon="👥"
            title="Doadores"
            descricao="Controle de doadores e contribuições."
          />

          <CardLink
            to="/admin/prestacao-contas"
            icon="📄"
            title="Prestação de Contas"
            descricao="Relatórios financeiros e transparência."
          />

          <CardLink
            to="/admin/relatorios"
            icon="📊"
            title="Relatórios"
            descricao="Exportações e análises."
          />

          <CardLink
            to="/admin/pendentes"
            icon="⏳"
            title="Pendentes"
            descricao="Aprovação de TEDs e registros."
          />

          <CardLink
            to="/admin/graficos"
            icon="📈"
            title="Central de Gráficos"
            descricao="Analytics e indicadores."
          />

          <CardLink
            to="/admin/noticias"
            icon="📰"
            title="Publicar Notícias"
            descricao="Publicações e comunicados."
          />

          <CardLink
            to="/admin/vagas"
            icon="💼"
            title="Vagas"
            descricao="Gestão de oportunidades."
          />

          <CardLink
            to="/admin/banco-curriculos"
            icon="📁"
            title="Banco de Currículos"
            descricao="Gestão de candidatos cadastrados."
          />
        </section>

        {/* NECESSIDADES */}

        <section style={styles.needsCard}>
          <h2 style={styles.tableTitle}>
            Nossas Necessidades
          </h2>

          <p style={styles.subtitle}>
            Cadastre necessidades por categoria
            e prioridade.
          </p>

          <div style={styles.categoryButtons}>
            {[
              'Alimentos',
              'Roupas',
              'Utensílios',
              'Higiene',
              'Escolar',
              'Outros'
            ].map((categoria) => (
              <button
                key={categoria}
                type="button"
                onClick={() =>
                  abrirCategoria(categoria)
                }
                style={
                  categoriaSelecionada === categoria
                    ? styles.categoryButtonActive
                    : styles.categoryButton
                }
              >
                {categoria}
              </button>
            ))}
          </div>

          {categoriaSelecionada && (
            <div style={styles.categoryArea}>
              <h3 style={styles.categoryTitle}>
                {categoriaSelecionada}
              </h3>

              <button
                type="button"
                style={styles.addNeedButton}
                onClick={() =>
                  setMostrarFormulario(true)
                }
              >
                + Deseja cadastrar uma nova necessidade?
              </button>

              {mostrarFormulario && (
                <div style={styles.formNeed}>
                  <label style={styles.label}>
                    Descrição da necessidade
                  </label>

                  <textarea
                    style={styles.textarea}
                    placeholder="Ex: 24 latas de leite..."
                    value={descricaoNecessidade}
                    onChange={(e) =>
                      setDescricaoNecessidade(
                        e.target.value
                      )
                    }
                  />

                  <label style={styles.label}>
                    Quantidade necessária
                  </label>

                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) =>
                      setQuantidade(e.target.value)
                    }
                    style={styles.input}
                    placeholder="Ex: 24"
                  />

                  <label style={styles.label}>
                    Nível de prioridade
                  </label>

                  <div style={styles.priorityGroup}>
                    <label style={styles.priorityItem}>
                      <input
                        type="radio"
                        checked={
                          prioridade === 'ALTA'
                        }
                        onChange={() =>
                          setPrioridade('ALTA')
                        }
                      />
                      🔴 Alta
                    </label>

                    <label style={styles.priorityItem}>
                      <input
                        type="radio"
                        checked={
                          prioridade === 'MEDIA'
                        }
                        onChange={() =>
                          setPrioridade('MEDIA')
                        }
                      />
                      🟠 Média
                    </label>

                    <label style={styles.priorityItem}>
                      <input
                        type="radio"
                        checked={
                          prioridade === 'BAIXA'
                        }
                        onChange={() =>
                          setPrioridade('BAIXA')
                        }
                      />
                      🟢 Baixa
                    </label>
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="button"
                      style={styles.saveButton}
                      onClick={
                        salvarNovaNecessidade
                      }
                    >
                      Salvar
                    </button>

                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={() => {
                        setMostrarFormulario(false)
                        setDescricaoNecessidade('')
                        setPrioridade('MEDIA')
                        setQuantidade('')
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div style={styles.needsList}>
                {necessidadesDaCategoria.map(
                  (item) => (
                    <div
                      key={item.id}
                      style={styles.needItem}
                    >
                      <div>
                        <strong>
                          {item.descricao}
                        </strong>

                        <p style={styles.needMeta}>
                          Quantidade:{' '}
                          {item.quantidade || 0}
                        </p>

                        <p style={styles.needMeta}>
                          Prioridade:{' '}
                          {item.prioridade}
                        </p>

                        <p style={styles.needMeta}>
                          Cadastro:{' '}
                          {item.criadoEm}
                        </p>
                        <button
                        type="button"
                        style={styles.completeButton}
                        onClick={() => {
                          const ok = confirm(
                            'Deseja concluir esta necessidade? Ela sairá da campanha ativa e irá para o histórico.'
                          )

                          if (!ok) return

                          concluirNecessidade(item.id)
                          carregarDashboard()
                        }}
                      >
                        Concluir necessidade
                      </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
        <div style={styles.historyBox}>
          <h3 style={styles.historyTitle}>
            Histórico de necessidades concluídas
          </h3>

          <p style={styles.historyText}>
            Consulte necessidades que já foram atendidas e retiradas da campanha ativa.
          </p>

          <Link to="/admin/necessidades/historico" style={styles.historyLink}>
            Ver histórico →
          </Link>
        </div>
        {/* TOP DOADORES */}

        <section style={styles.rankingCard}>
          <h2 style={styles.tableTitle}>
            Top 3 Doadores
          </h2>

          <div style={styles.rankingGrid}>
            {topDoadores.map((d, i) => (
              <div
                key={d.nome}
                style={styles.rankingItem}
              >
                <div style={styles.rankingPosition}>
                  {i === 0
                    ? '🥇'
                    : i === 1
                    ? '🥈'
                    : '🥉'}
                </div>

                <h3 style={styles.rankingName}>
                  {d.nome}
                </h3>

                <p style={styles.rankingText}>
                  {d.total.toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL'
                    }
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ÚLTIMAS DOAÇÕES */}

        <section style={styles.tableCard}>
          <h2 style={styles.tableTitle}>
            Últimas Doações
          </h2>

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
                  <td style={styles.td}>
                    {d.data}
                  </td>

                  <td style={styles.td}>
                    {d.doador}
                  </td>

                  <td style={styles.td}>
                    {d.valor}
                  </td>

                  <td style={styles.td}>
                    {d.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

function SummaryCard({
  icon,
  label,
  value
}) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryIcon}>
        {icon}
      </div>

      <h2 style={styles.summaryNumber}>
        {value}
      </h2>

      <p style={styles.summaryLabel}>
        {label}
      </p>
    </div>
  )
}

function CardLink({
  to,
  icon,
  title,
  descricao
}) {
  return (
    <Link to={to} style={styles.card}>
      <div style={styles.cardIcon}>{icon}</div>

      <h2 style={styles.cardTitle}>
        {title}
      </h2>

      <p style={styles.cardDescription}>
        {descricao}
      </p>
    </Link>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f5f9',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '1280px',
    margin: '0 auto'
  },

  header: {
    marginBottom: '24px'
  },

  title: {
    fontSize: '2.5rem',
    color: '#0B3D91',
    marginBottom: '10px'
  },

  subtitle: {
    color: '#475569'
  },

  sectionHeaderBlue: {
    background: '#0B3D91',
    borderRadius: '20px',
    padding: '24px',
    marginTop: '30px',
    marginBottom: '24px'
  },

  sectionTitleWhite: {
    color: '#fff',
    margin: 0
  },

  sectionSubtitleWhite: {
    color: '#dbeafe',
    marginTop: '8px'
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '20px'
  },

  summaryCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '20px',
    borderTop: '6px solid #ffc928',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.07)'
  },

  summaryIcon: {
    fontSize: '30px'
  },

  summaryNumber: {
    color: '#0B3D91'
  },

  summaryLabel: {
    color: '#64748b'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  },

  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '26px',
    textDecoration: 'none',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.07)',
    borderTop: '5px solid #0B3D91'
  },

  cardIcon: {
    fontSize: '36px'
  },

  cardTitle: {
    color: '#0B3D91'
  },

  cardDescription: {
    color: '#64748b',
    lineHeight: '1.5'
  },

  needsCard: {
    marginTop: '35px',
    background: '#fff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  tableTitle: {
    color: '#0B3D91'
  },

  categoryButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '20px'
  },

  categoryButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: '800'
  },

  categoryButtonActive: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: '900'
  },

  categoryArea: {
    marginTop: '25px',
    background: '#f8fbff',
    borderRadius: '18px',
    padding: '20px',
    border: '1px solid #dbeafe'
  },

  categoryTitle: {
    color: '#0B3D91'
  },

  addNeedButton: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 18px',
    cursor: 'pointer',
    fontWeight: '900'
  },

  formNeed: {
    marginTop: '20px',
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #dbeafe'
  },

  label: {
    display: 'block',
    marginTop: '14px',
    marginBottom: '6px',
    fontWeight: '800',
    color: '#334155'
  },

  textarea: {
    width: '100%',
    minHeight: '110px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '14px',
    resize: 'vertical'
  },

  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '0 12px',
    boxSizing: 'border-box'
  },

  priorityGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    flexWrap: 'wrap'
  },

  priorityItem: {
    fontWeight: '700',
    color: '#334155'
  },

  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },

  saveButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '900'
  },

  cancelButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '900'
  },

  needsList: {
    marginTop: '24px'
  },

  needItem: {
    background: '#fff',
    padding: '16px',
    borderRadius: '14px',
    marginBottom: '12px',
    borderLeft: '6px solid #ffc928'
  },

  needMeta: {
    color: '#64748b',
    marginTop: '4px'
  },

  rankingCard: {
    marginTop: '35px',
    background: '#fff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  rankingGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px'
  },

  rankingItem: {
    background: '#f8fbff',
    borderRadius: '16px',
    padding: '18px'
  },

  rankingPosition: {
    fontSize: '26px'
  },

  rankingName: {
    color: '#0B3D91'
  },

  rankingText: {
    color: '#475569'
  },

  tableCard: {
    marginTop: '35px',
    background: '#fff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #dbeafe',
    color: '#0B3D91'
  },

  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9'
  },
  completeButton: {
  marginTop: '12px',
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 14px',
  fontWeight: '900',
  cursor: 'pointer'
},

historyBox: {
  marginTop: '24px',
  background: '#eef6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '18px',
  padding: '20px'
},

historyTitle: {
  color: '#0B3D91',
  margin: 0
},

historyText: {
  color: '#475569'
},

historyLink: {
  display: 'inline-block',
  marginTop: '8px',
  background: '#0B3D91',
  color: '#fff',
  textDecoration: 'none',
  padding: '12px 16px',
  borderRadius: '10px',
  fontWeight: '900'
}
}

export default DashboardAdmin