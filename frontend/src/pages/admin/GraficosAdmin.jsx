import React, { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts'
import { listarDoacoes } from '../../services/doacoesService'
import { obterAnalyticsMes } from '../../services/analyticsService'
import { gerarRelatorioPDF } from '../../utils/pdfService'

function GraficosAdmin() {
  const hoje = new Date()

  const [doacoes, setDoacoes] = useState([])
  const [analytics, setAnalytics] = useState({
    totalVisitas: 0,
    tempoTotal: 0,
    tempoMedio: 0,
    totalInteracoes: 0,
    interacoesPorUsuario: 0
  })
  const [mesSelecionado, setMesSelecionado] = useState(
    String(hoje.getMonth() + 1).padStart(2, '0')
  )
  const [anoSelecionado, setAnoSelecionado] = useState(
    String(hoje.getFullYear())
  )

  useEffect(() => {
    setDoacoes(listarDoacoes())
    setAnalytics(obterAnalyticsMes(mesSelecionado, anoSelecionado))
  }, [mesSelecionado, anoSelecionado])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setDoacoes(listarDoacoes())
      setAnalytics(obterAnalyticsMes(mesSelecionado, anoSelecionado))
    }, 2000)

    return () => clearInterval(intervalo)
  }, [mesSelecionado, anoSelecionado])

  const resumo = useMemo(() => {
    const financeiras = doacoes.filter((d) => d.tipoDoacao === 'Financeira')
    const materiais = doacoes.filter((d) => d.tipoDoacao === 'Material')

    const totalFinanceiroConfirmado = financeiras
      .filter((d) => d.status === 'Confirmado')
      .reduce((acc, d) => acc + extrairNumeroMoeda(d.valor), 0)

    const totalEstimadoMaterial = materiais.reduce(
      (acc, d) => acc + Number(d.valorEstimadoMaterial || 0),
      0
    )

    return {
      quantidadeFinanceiras: financeiras.length,
      quantidadeMateriais: materiais.length,
      totalFinanceiroConfirmado,
      totalEstimadoMaterial
    }
  }, [doacoes])

  const dadosTipoDoacao = useMemo(() => {
    return [
      { name: 'Financeiras', value: resumo.quantidadeFinanceiras },
      { name: 'Materiais', value: resumo.quantidadeMateriais }
    ]
  }, [resumo])

  const dadosCategoriaDoador = useMemo(() => {
    const contagem = {
      'Pessoa Física': 0,
      'Pessoa Jurídica': 0,
      Parceiro: 0
    }

    doacoes.forEach((d) => {
      const categoria = d.categoriaDoador || 'Pessoa Física'
      if (contagem[categoria] !== undefined) {
        contagem[categoria] += 1
      } else {
        contagem['Pessoa Física'] += 1
      }
    })

    return [
      { name: 'Pessoa Física', value: contagem['Pessoa Física'] },
      { name: 'Pessoa Jurídica', value: contagem['Pessoa Jurídica'] },
      { name: 'Parceiro', value: contagem['Parceiro'] }
    ]
  }, [doacoes])

  const dadosLinhaMensal = useMemo(() => {
    const ano = Number(anoSelecionado)
    const mes = Number(mesSelecionado)
    const ultimoDia = new Date(ano, mes, 0).getDate()

    const base = Array.from({ length: ultimoDia }, (_, i) => ({
      dia: i + 1,
      total: 0
    }))

    doacoes.forEach((d) => {
      const data = converterDataBR(d.data)
      if (!data) return

      const anoD = data.getFullYear()
      const mesD = data.getMonth() + 1
      const diaD = data.getDate()

      if (anoD === ano && mesD === mes) {
        let valor = 0

        if (d.tipoDoacao === 'Material') {
          valor = Number(d.valorEstimadoMaterial || 0)
        } else if (d.status === 'Confirmado') {
          valor = extrairNumeroMoeda(d.valor)
        }

        base[diaD - 1].total += valor
      }
    })

    return base
  }, [doacoes, mesSelecionado, anoSelecionado])

  const dadosBarrasTotais = useMemo(() => {
    return [
      {
        name: 'Financeiro',
        total: Number(resumo.totalFinanceiroConfirmado.toFixed(2))
      },
      {
        name: 'Material',
        total: Number(resumo.totalEstimadoMaterial.toFixed(2))
      }
    ]
  }, [resumo])

  const totalVisitasMes = analytics.totalVisitas || 0
  const totalTempoMes = analytics.tempoTotal || 0
  const tempoMedioVisita = analytics.tempoMedio || 0
  const totalInteracoes = analytics.totalInteracoes || 0
  const interacoesPorUsuario = analytics.interacoesPorUsuario || 0

  const dadosMetricasSite = [
    { name: 'Visitas', valor: totalVisitasMes },
    { name: 'Tempo médio (s)', valor: Number(tempoMedioVisita.toFixed(1)) },
    { name: 'Interações', valor: totalInteracoes },
    { name: 'Interações/usuário', valor: Number(interacoesPorUsuario.toFixed(1)) }
  ]

  const insights = useMemo(() => {
    let nivelEngajamento = 'Baixo'
    if (interacoesPorUsuario >= 3) nivelEngajamento = 'Alto'
    else if (interacoesPorUsuario >= 1.5) nivelEngajamento = 'Médio'

    let leituraTempo = 'Tempo médio baixo'
    if (tempoMedioVisita >= 120) leituraTempo = 'Tempo médio alto'
    else if (tempoMedioVisita >= 45) leituraTempo = 'Tempo médio moderado'

    let eficiencia = 'Eficiência baixa'
    if (tempoMedioVisita >= 60 && interacoesPorUsuario >= 2) {
      eficiencia = 'Eficiência alta'
    } else if (tempoMedioVisita >= 30 && interacoesPorUsuario >= 1) {
      eficiencia = 'Eficiência moderada'
    }

    let resumoTexto =
      'A plataforma ainda apresenta sinais iniciais de uso e pode evoluir com melhorias de navegação e incentivo à interação.'

    if (eficiencia === 'Eficiência alta') {
      resumoTexto =
        'A plataforma demonstra bom desempenho de uso, com permanência consistente e interação relevante dos visitantes.'
    } else if (eficiencia === 'Eficiência moderada') {
      resumoTexto =
        'A plataforma apresenta desempenho intermediário, indicando bom potencial de conversão com ajustes de experiência do usuário.'
    }

    return {
      nivelEngajamento,
      leituraTempo,
      eficiencia,
      resumoTexto
    }
  }, [tempoMedioVisita, interacoesPorUsuario])

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Central de Gráficos</h1>
            <p style={styles.subtitle}>
              Indicadores visuais do sistema de doações, eficiência da plataforma e engajamento dos usuários.
            </p>
          </div>

          <div style={styles.filters}>
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              style={styles.select}
            >
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>

            <input
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              style={styles.select}
              placeholder="Ano"
            />

            <button
              style={styles.btnExport}
              onClick={() => gerarRelatorioPDF({ resumo, doacoes })}
              type="button"
            >
              Gerar PDF Profissional
            </button>
          </div>
        </header>

        <section style={styles.summaryGrid}>
          <SummaryCard
            label="Total financeiro confirmado"
            value={resumo.totalFinanceiroConfirmado.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          />

          <SummaryCard
            label="Total estimado material"
            value={resumo.totalEstimadoMaterial.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          />

          <SummaryCard
            label="Doações financeiras"
            value={resumo.quantidadeFinanceiras}
          />

          <SummaryCard
            label="Doações materiais"
            value={resumo.quantidadeMateriais}
          />

          <SummaryCard
            label="Visitas no mês"
            value={totalVisitasMes}
          />

          <SummaryCard
            label="Tempo total (min)"
            value={(totalTempoMes / 60).toFixed(1)}
          />

          <SummaryCard
            label="Tempo médio por usuário"
            value={`${tempoMedioVisita.toFixed(1)} s`}
          />

          <SummaryCard
            label="Total de interações"
            value={totalInteracoes}
          />

          <SummaryCard
            label="Interações por usuário"
            value={interacoesPorUsuario.toFixed(1)}
          />
        </section>

        <section style={styles.insightsGrid}>
          <InsightCard
            label="Nível de engajamento"
            value={insights.nivelEngajamento}
          />
          <InsightCard
            label="Leitura do tempo médio"
            value={insights.leituraTempo}
          />
          <InsightCard
            label="Eficiência da plataforma"
            value={insights.eficiencia}
          />
        </section>

        <section style={styles.textInsightCard}>
          <h2 style={styles.chartTitle}>Insight automático</h2>
          <p style={styles.textInsight}>
            {insights.resumoTexto}
          </p>
        </section>

        <section id="area-graficos" style={styles.chartGrid}>
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Financeiras x Materiais</h2>
            <p style={styles.chartSubtitle}>
              Distribuição percentual por tipo de doação.
            </p>
            <div style={styles.chartArea}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={dadosTipoDoacao}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    <Cell fill="#00C2FF" />
                    <Cell fill="#7CFFB2" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Origem das doações</h2>
            <p style={styles.chartSubtitle}>
              Pessoa Física, Pessoa Jurídica e Parceiros.
            </p>
            <div style={styles.chartArea}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={dadosCategoriaDoador}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    <Cell fill="#FACC15" />
                    <Cell fill="#38BDF8" />
                    <Cell fill="#FB7185" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...styles.chartCard, gridColumn: '1 / -1' }}>
            <h2 style={styles.chartTitle}>Variação diária do mês</h2>
            <p style={styles.chartSubtitle}>
              Evolução do volume diário do dia 1 até o último dia do mês selecionado.
            </p>
            <div style={styles.chartAreaLarge}>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={dadosLinhaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3140" />
                  <XAxis dataKey="dia" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="Total diário"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...styles.chartCard, gridColumn: '1 / -1' }}>
            <h2 style={styles.chartTitle}>Comparativo de valores</h2>
            <p style={styles.chartSubtitle}>
              Valor financeiro confirmado versus valor estimado de doações materiais.
            </p>
            <div style={styles.chartAreaLarge}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={dadosBarrasTotais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3140" />
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar
                    dataKey="total"
                    fill="#60a5fa"
                    name="Total em R$"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...styles.chartCard, gridColumn: '1 / -1' }}>
            <h2 style={styles.chartTitle}>Eficiência e engajamento do site</h2>
            <p style={styles.chartSubtitle}>
              Visitas, tempo médio de permanência e interações para medir a eficiência da plataforma.
            </p>
            <div style={styles.chartAreaLarge}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={dadosMetricasSite}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3140" />
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar
                    dataKey="valor"
                    fill="#22c55e"
                    name="Métrica"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryValue}>{value}</div>
      <div style={styles.summaryLabel}>{label}</div>
    </div>
  )
}

function InsightCard({ label, value }) {
  return (
    <div style={styles.insightCard}>
      <div style={styles.insightLabel}>{label}</div>
      <div style={styles.insightValue}>{value}</div>
    </div>
  )
}

function converterDataBR(dataBR) {
  if (!dataBR || dataBR === '-') return null
  const [dia, mes, ano] = dataBR.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}

function extrairNumeroMoeda(valor) {
  return (
    Number(
      String(valor)
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    ) || 0
  )
}

const tooltipStyle = {
  backgroundColor: '#111827',
  border: '1px solid #334155',
  borderRadius: '10px',
  color: '#fff'
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #050816 0%, #0b1220 40%, #111827 100%)',
    padding: '32px 20px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  title: {
    color: '#fff',
    fontSize: '2rem',
    margin: 0
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: '8px',
    lineHeight: '1.6'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  select: {
    background: '#111827',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #334155'
  },
  btnExport: {
    background: 'linear-gradient(135deg, #16a34a, #166534)',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  summaryCard: {
    background: '#0f172a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #1e293b'
  },
  summaryValue: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  summaryLabel: {
    color: '#94a3b8',
    marginTop: '8px'
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  insightCard: {
    background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155'
  },
  insightLabel: {
    color: '#94a3b8'
  },
  insightValue: {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: '700',
    marginTop: '8px'
  },
  textInsightCard: {
    background: '#0f172a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155',
    marginBottom: '20px'
  },
  textInsight: {
    color: '#cbd5e1',
    lineHeight: '1.7',
    marginTop: '10px'
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '18px'
  },
  chartCard: {
    background: '#0f172a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #1e293b'
  },
  chartTitle: {
    color: '#fff',
    margin: 0
  },
  chartSubtitle: {
    color: '#94a3b8',
    marginTop: '8px'
  },
  chartArea: {
    height: '320px',
    marginTop: '12px'
  },
  chartAreaLarge: {
    height: '360px',
    marginTop: '12px'
  }
}

export default GraficosAdmin