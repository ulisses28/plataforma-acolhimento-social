import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obterTopDoadores } from '../../services/rankingService'
import { listarPublicacoesTransparencia } from '../../services/transparenciaService'

function Transparencia() {
  const hoje = new Date()

  const [topDoadores, setTopDoadores] = useState([])
  const [publicacoes, setPublicacoes] = useState([])
  const [mes, setMes] = useState(String(hoje.getMonth() + 1).padStart(2, '0'))
  const [ano, setAno] = useState('2025')
  

  useEffect(() => {
    setTopDoadores(obterTopDoadores(3, mes, ano))

    const lista = listarPublicacoesTransparencia().filter(
      (item) => String(item.status).trim().toLowerCase() === 'publicado'
    )

    setPublicacoes(lista)
  }, [mes, ano])

  const publicacoesDoAno = publicacoes.filter(
    (item) => String(item.ano || '') === String(ano)
  )

  function converterValor(valor) {
    if (!valor) return 0

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

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }


  function abrirPdf(item) {
  if (!item.arquivoBase64) {
    alert('PDF não encontrado. Edite esta publicação no admin e anexe o PDF novamente.')
    return
  }

  window.open(item.arquivoBase64, '_blank')
  }

  function baixarPdf(item) {
  if (!item.arquivoBase64) {
    alert('PDF não encontrado. Edite esta publicação no admin e anexe o PDF novamente.')
    return
  }

  const link = document.createElement('a')
  link.href = item.arquivoBase64
  link.download = item.arquivoNome || `${item.titulo || 'documento'}.pdf`
  link.click()
  }
  
  const totalArrecadado = publicacoesDoAno.reduce(
    (acc, item) => acc + converterValor(item.valorArrecadado),
    0
  )

  const totalAplicado = publicacoesDoAno.reduce(
    (acc, item) => acc + converterValor(item.valorAplicado),
    0
  )

  const saldo = totalArrecadado - totalAplicado

  const dadosPorPublicacao = publicacoesDoAno.map((item, index) => {
    const arrecadado = converterValor(item.valorArrecadado)
    const aplicado = converterValor(item.valorAplicado)
    const resultado = arrecadado - aplicado

    return {
      label: item.periodo || item.ano || `Item ${index + 1}`,
      arrecadado,
      aplicado,
      superavit: resultado > 0 ? resultado : 0,
      deficit: resultado < 0 ? Math.abs(resultado) : 0
    }
  })

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Transparência</h1>

          <p style={styles.subtitle}>
            Acompanhe documentos, relatórios, prestações de contas e informações
            públicas sobre a atuação institucional.
          </p>
        </header>

        <section style={styles.infoCard}>
          <h2 style={styles.sectionTitle}>Compromisso com a transparência</h2>

          <p style={styles.text}>
            A instituição valoriza a clareza na gestão dos recursos e disponibiliza
            informações públicas para fortalecer a confiança da sociedade,
            parceiros e doadores.
          </p>
        </section>

        <section style={styles.cardsResumo}>
          <ResumoCard titulo="Receita Bruta 2025" valor="R$ 1.606.190,40" />
          <ResumoCard titulo="Custos/Despesas 2025" valor="R$ 1.689.575,45" />
          <ResumoCard titulo="Ativo Total 2025" valor="R$ 2.318.747,34" />
          <ResumoCard titulo="Passivo Total 2025" valor="R$ 2.318.747,34" />
        </section>

        <section style={styles.graphSection}>
          <div>
            <h2 style={styles.rankingTitle}>Gráfico financeiro da transparência</h2>
            <p style={styles.rankingSubtitle}>
              Comparativo automático baseado nos valores cadastrados nas publicações.
            </p>
          </div>

          <div style={styles.graphSummary}>
            <ResumoMini titulo="Total arrecadado" valor={formatarMoeda(totalArrecadado)} cor="#16a34a" />
            <ResumoMini titulo="Total aplicado" valor={formatarMoeda(totalAplicado)} cor="#dc2626" />
            <ResumoMini
              titulo={saldo >= 0 ? 'Superávit geral' : 'Déficit geral'}
              valor={formatarMoeda(saldo)}
              cor={saldo >= 0 ? '#16a34a' : '#dc2626'}
            />
          </div>

          <LinhaGrafico
            titulo="Arrecadado x Aplicado"
            subtitulo="Linha verde representa o valor arrecadado. Linha vermelha representa o valor aplicado."
            dados={dadosPorPublicacao}
            linhas={[
              { chave: 'arrecadado', nome: 'Arrecadado', cor: '#16a34a' },
              { chave: 'aplicado', nome: 'Aplicado', cor: '#dc2626' }
            ]}
          />

          <LinhaGrafico
            titulo="Superávit x Déficit"
            subtitulo="Linha verde representa superávit. Linha vermelha representa déficit."
            dados={dadosPorPublicacao}
            linhas={[
              { chave: 'superavit', nome: 'Superávit', cor: '#16a34a' },
              { chave: 'deficit', nome: 'Déficit', cor: '#dc2626' }
            ]}
          />
        </section>

        <section style={styles.publicationsSection}>
          <div style={styles.rankingHeader}>
            <div>
              <h2 style={styles.rankingTitle}>Documentos e publicações</h2>
              <p style={styles.rankingSubtitle}>
                Relatórios, notícias institucionais e documentos de prestação de contas.
              </p>
            </div>

            <input
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              style={styles.input}
              placeholder="Ano"
            />
          </div>

          <div style={styles.publicationGrid}>
            {publicacoesDoAno.length === 0 ? (
              <p style={styles.rankingText}>Nenhuma publicação encontrada para este ano.</p>
            ) : (
              publicacoesDoAno.map((item) => (
                <article key={item.id} style={styles.publicationCard}>
                  <span style={styles.badge}>{item.tipo}</span>

                  <h3 style={styles.publicationTitle}>{item.titulo}</h3>

                  <p style={styles.rankingText}>
                    {item.periodo || `Ano ${item.ano}`}
                  </p>

                  <p style={styles.text}>{item.resumo}</p>

                  <div style={styles.valuesGrid}>
                    {item.valorArrecadado && (
                      <div>
                        <strong>Arrecadado</strong>
                        <span>{item.valorArrecadado}</span>
                      </div>
                    )}

                    {item.valorAplicado && (
                      <div>
                        <strong>Aplicado</strong>
                        <span>{item.valorAplicado}</span>
                      </div>
                    )}
                  </div>

                  {item.graficosPublicos?.length > 0 && (
                    <div style={styles.graphPreview}>
                      <strong>Gráficos públicos:</strong>
                      <p>{item.graficosPublicos.join(', ')}</p>
                    </div>
                  )}

                  {item.arquivoBase64 ? (
                    <div style={styles.pdfActions}>
                      <button type="button" style={styles.viewButton} onClick={() => abrirPdf(item)}>
                        Visualizar documento
                      </button>

                      <button type="button" style={styles.downloadButton} onClick={() => baixarPdf(item)}>
                        Baixar PDF
                      </button>
                    </div>
                  ) : (
                    <p style={styles.warningText}>
                      Documento sem PDF anexado. Atualize esta publicação no painel administrativo.
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        <section style={styles.rankingSection}>
          <div style={styles.rankingHeader}>
            <div>
              <h2 style={styles.rankingTitle}>Destaques de Solidariedade</h2>
              <p style={styles.rankingSubtitle}>
                Top 3 doadores com base nas doações confirmadas.
              </p>
            </div>

            <div style={styles.filters}>
              <select value={mes} onChange={(e) => setMes(e.target.value)} style={styles.input}>
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

              <input value={ano} onChange={(e) => setAno(e.target.value)} style={styles.input} placeholder="Ano" />
            </div>
          </div>

          <div style={styles.rankingGrid}>
            {topDoadores.length === 0 ? (
              <p style={styles.rankingText}>Ainda não há doadores destacados neste período.</p>
            ) : (
              topDoadores.map((doador, index) => (
                <div key={doador.nome} style={styles.rankingCard}>
                  <div style={styles.medal}>{getMedalha(index)}</div>

                  <h3 style={styles.rankingPosition}>{index + 1}º lugar</h3>

                  <p style={styles.rankingName}>{doador.nome}</p>

                  <p style={styles.rankingText}>
                    Total contribuído:{' '}
                    {doador.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>

                  <p style={styles.rankingText}>
                    Doações confirmadas: {doador.quantidade}
                  </p>
                </div>
              ))
            )}
          </div>

          <div style={styles.ctaBox}>
            <h3 style={styles.ctaTitle}>Quer contribuir com esta missão?</h3>

            <p style={styles.ctaText}>
              Sua contribuição fortalece ações sociais e ajuda a transformar vidas.
            </p>

            <Link to="/doar-agora" style={styles.ctaButton}>
              Fazer uma contribuição
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function ResumoCard({ titulo, valor }) {
  return (
    <div style={styles.resumoCard}>
      <p>{titulo}</p>
      <strong>{valor}</strong>
    </div>
  )
}

function ResumoMini({ titulo, valor, cor }) {
  return (
    <div style={{ ...styles.resumoMini, borderLeft: `6px solid ${cor}` }}>
      <span>{titulo}</span>
      <strong style={{ color: cor }}>{valor}</strong>
    </div>
  )
}

function LinhaGrafico({ titulo, subtitulo, dados, linhas }) {
  const largura = 880
  const altura = 260
  const margem = 36

  const valores = dados.flatMap((item) => linhas.map((linha) => item[linha.chave]))
  const maiorValor = Math.max(...valores, 1)

  function getX(index) {
    if (dados.length <= 1) return largura / 2
    return margem + (index * (largura - margem * 2)) / (dados.length - 1)
  }

  function getY(valor) {
    return altura - margem - (valor / maiorValor) * (altura - margem * 2)
  }

  function gerarPontos(chave) {
    return dados
      .map((item, index) => `${getX(index)},${getY(item[chave])}`)
      .join(' ')
  }

  return (
    <div style={styles.lineChartCard}>
      <div style={styles.chartHeader}>
        <div>
          <h3 style={styles.chartTitle}>{titulo}</h3>
          <p style={styles.chartSubtitle}>{subtitulo}</p>
        </div>

        <div style={styles.chartLegend}>
          {linhas.map((linha) => (
            <span key={linha.chave}>
              <i style={{ background: linha.cor }} />
              {linha.nome}
            </span>
          ))}
        </div>
      </div>

      {dados.length === 0 ? (
        <p style={styles.rankingText}>Cadastre publicações para gerar o gráfico.</p>
      ) : (
        <svg viewBox={`0 0 ${largura} ${altura}`} style={styles.svgChart}>
          <line x1={margem} y1={altura - margem} x2={largura - margem} y2={altura - margem} stroke="#cbd5e1" />
          <line x1={margem} y1={margem} x2={margem} y2={altura - margem} stroke="#cbd5e1" />

          {[0.25, 0.5, 0.75, 1].map((nivel) => (
            <line
              key={nivel}
              x1={margem}
              x2={largura - margem}
              y1={altura - margem - nivel * (altura - margem * 2)}
              y2={altura - margem - nivel * (altura - margem * 2)}
              stroke="#e2e8f0"
            />
          ))}

          {linhas.map((linha) => (
            <polyline
              key={linha.chave}
              fill="none"
              stroke={linha.cor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={gerarPontos(linha.chave)}
            />
          ))}

          {dados.map((item, index) =>
            linhas.map((linha) => (
              <circle
                key={`${linha.chave}-${index}`}
                cx={getX(index)}
                cy={getY(item[linha.chave])}
                r="6"
                fill={linha.cor}
              >
                <title>
                  {linha.nome}: {item[linha.chave].toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </title>
              </circle>
            ))
          )}

          {dados.map((item, index) => (
            <text key={index} x={getX(index)} y={altura - 8} textAnchor="middle" fontSize="11" fill="#475569">
              {index + 1}
            </text>
          ))}
        </svg>
      )}
    </div>
  )
}

function getMedalha(index) {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return '🏅'
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f0f6ff 0%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  container: { maxWidth: '1120px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  title: { color: '#0B3D91', fontSize: '2.4rem', margin: 0 },
  subtitle: { color: '#4b5563', marginTop: '10px', lineHeight: '1.6' },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  sectionTitle: { margin: 0, color: '#0B3D91' },
  text: { marginTop: '12px', color: '#374151', lineHeight: '1.7' },
  warningText: {
    marginTop: '14px',
    color: '#dc2626',
    fontWeight: '800',
    fontSize: '14px'
  },
  cardsResumo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '24px'
  },
  resumoCard: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '22px',
    borderLeft: '6px solid #ffc928',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  graphSection: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  graphSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
    marginTop: '20px',
    marginBottom: '20px'
  },
  resumoMini: {
    background: '#f8fbff',
    borderRadius: '14px',
    padding: '16px',
    border: '1px solid #dbeafe',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  lineChartCard: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px',
    marginTop: '18px'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '14px'
  },
  chartTitle: { color: '#0B3D91', margin: 0 },
  chartSubtitle: { color: '#64748b', margin: '6px 0 0' },
  chartLegend: { display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' },
  svgChart: { width: '100%', height: '260px', background: '#ffffff', borderRadius: '14px' },
  publicationsSection: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  publicationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
    marginTop: '22px'
  },
  publicationCard: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '20px'
  },
  badge: {
    background: '#ffc928',
    color: '#002855',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },
  publicationTitle: { color: '#0B3D91' },
  valuesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' },
  graphPreview: {
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '12px',
    color: '#475569'
  },
  pdfActions: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' },
  viewButton: {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  downloadButton: {
    background: '#0B3D91',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  rankingSection: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  rankingHeader: { display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' },
  rankingTitle: { margin: 0, color: '#0B3D91' },
  rankingSubtitle: { marginTop: '10px', color: '#6b7280' },
  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', backgroundColor: '#ffffff' },
  rankingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '25px' },
  rankingCard: { backgroundColor: '#f8fbff', borderRadius: '18px', padding: '24px', border: '1px solid #dbeafe', textAlign: 'center' },
  medal: { fontSize: '2.4rem', marginBottom: '8px' },
  rankingPosition: { color: '#0B3D91', margin: 0 },
  rankingName: { fontWeight: '700', fontSize: '1.15rem', color: '#111827', marginTop: '8px' },
  rankingText: { color: '#4b5563', marginTop: '6px' },
  ctaBox: {
    marginTop: '30px',
    background: 'linear-gradient(135deg, #0B3D91, #1d4ed8)',
    borderRadius: '18px',
    padding: '26px',
    color: '#ffffff',
    textAlign: 'center'
  },
  ctaTitle: { margin: 0, fontSize: '1.4rem' },
  ctaText: { marginTop: '10px', lineHeight: '1.6' },
  ctaButton: {
    display: 'inline-block',
    marginTop: '16px',
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    color: '#0B3D91',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: '700'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    background: '#ffffff',
    width: 'min(1000px, 96vw)',
    height: '90vh',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '14px'
  },
  modalTitle: { color: '#0B3D91', margin: 0 },
  modalSubtitle: { color: '#64748b', margin: '6px 0 0' },
  closeButton: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontWeight: '900'
  },
  pdfFrame: {
    flex: 1,
    width: '100%',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    marginBottom: '14px'
  }
}

export default Transparencia