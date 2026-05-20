import React, { useEffect, useMemo, useState } from 'react'
import { listarDoacoes } from '../../services/doacoesService'
import AdminHeader from '../../components/ui/AdminHeader'

function RelatoriosAdmin() {
  const [doacoes, setDoacoes] = useState([])
  const [aba, setAba] = useState('geral')

  useEffect(() => {
    setDoacoes(listarDoacoes())
  }, [])

  const confirmadas = useMemo(() => {
    return doacoes.filter((d) => d.status === 'Confirmado')
  }, [doacoes])

  const doacoesFinanceiras = useMemo(() => {
    return confirmadas.filter((d) => d.tipoDoacao === 'Financeira')
  }, [confirmadas])

  const doacoesMateriais = useMemo(() => {
    return confirmadas.filter((d) => d.tipoDoacao === 'Material')
  }, [confirmadas])

  const rankingFinanceiro = useMemo(() => {
    const mapa = {}

    doacoesFinanceiras.forEach((d) => {
      const nome = d.doador || 'Anônimo'
      const valor = extrairNumeroMoeda(d.valor)

      if (!mapa[nome]) {
        mapa[nome] = {
          nome,
          quantidade: 0,
          total: 0,
          ultimaDoacao: d.data || '-',
          banco: d.banco || 'Não informado',
          historico: []
        }
      }

      mapa[nome].quantidade += 1
      mapa[nome].total += valor
      mapa[nome].ultimaDoacao = d.data || '-'

      mapa[nome].historico.push({
        data: d.data || '-',
        valor,
        banco: d.banco || 'Não informado',
        forma: d.forma || d.operacao || 'Pix'
      })
    })

    return Object.values(mapa).sort((a, b) => b.total - a.total)
  }, [doacoesFinanceiras])

  const rankingMaterial = useMemo(() => {
    const mapa = {}

    doacoesMateriais.forEach((d) => {
      const nome = d.doador || 'Anônimo'
      const descricao = d.descricaoMaterial || 'Material não informado'
      const valorEstimado = Number(d.valorEstimadoMaterial || 0)

      if (!mapa[nome]) {
        mapa[nome] = {
          nome,
          quantidade: 0,
          totalEstimado: 0,
          ultimaDoacao: d.data || '-',
          banco: d.banco || 'Não informado',
          itens: [],
          historico: []
        }
      }

      mapa[nome].quantidade += 1
      mapa[nome].totalEstimado += valorEstimado
      mapa[nome].ultimaDoacao = d.data || '-'
      mapa[nome].itens.push(descricao)

      mapa[nome].historico.push({
        data: d.data || '-',
        item: descricao,
        valorEstimado,
        banco: d.banco || 'Não informado'
      })
    })

    return Object.values(mapa).sort((a, b) => b.totalEstimado - a.totalEstimado)
  }, [doacoesMateriais])

  const resumoGeral = useMemo(() => {
    const totalFinanceiro = doacoesFinanceiras.reduce(
      (acc, d) => acc + extrairNumeroMoeda(d.valor),
      0
    )

    const totalMaterial = doacoesMateriais.reduce(
      (acc, d) => acc + Number(d.valorEstimadoMaterial || 0),
      0
    )

    const categoriasMateriais = {
      roupas: 0,
      alimentos: 0,
      brinquedos: 0,
      higiene: 0,
      escolar: 0,
      voluntario: 0,
      outros: 0
    }

    doacoesMateriais.forEach((d) => {
      const texto = String(d.descricaoMaterial || '').toLowerCase()

      if (texto.includes('roupa')) categoriasMateriais.roupas += 1
      else if (texto.includes('alimento') || texto.includes('comida')) categoriasMateriais.alimentos += 1
      else if (texto.includes('brinquedo')) categoriasMateriais.brinquedos += 1
      else if (texto.includes('higiene')) categoriasMateriais.higiene += 1
      else if (texto.includes('escolar') || texto.includes('material escolar')) categoriasMateriais.escolar += 1
      else if (texto.includes('volunt')) categoriasMateriais.voluntario += 1
      else categoriasMateriais.outros += 1
    })

    return {
      totalFinanceiro,
      totalMaterial,
      totalGeral: totalFinanceiro + totalMaterial,
      quantidadeFinanceira: doacoesFinanceiras.length,
      quantidadeMaterial: doacoesMateriais.length,
      categoriasMateriais
    }
  }, [doacoesFinanceiras, doacoesMateriais])

  function exportarExcelCSV() {
    let linhas = []

    if (aba === 'financeiro') {
      linhas = [
        ['Posição', 'Doador', 'Quantidade', 'Total financeiro', 'Última doação', 'Banco'],
        ...rankingFinanceiro.map((item, index) => [
          index + 1,
          item.nome,
          item.quantidade,
          item.total.toFixed(2),
          item.ultimaDoacao,
          item.banco
        ])
      ]
    }

    if (aba === 'material') {
      linhas = [
        ['Posição', 'Doador', 'Quantidade', 'Itens doados', 'Valor estimado', 'Última doação', 'Banco'],
        ...rankingMaterial.map((item, index) => [
          index + 1,
          item.nome,
          item.quantidade,
          item.itens.join(' | '),
          item.totalEstimado.toFixed(2),
          item.ultimaDoacao,
          item.banco
        ])
      ]
    }

    if (aba === 'geral') {
      linhas = [
        ['Indicador', 'Valor'],
        ['Total financeiro', resumoGeral.totalFinanceiro.toFixed(2)],
        ['Total material estimado', resumoGeral.totalMaterial.toFixed(2)],
        ['Total geral', resumoGeral.totalGeral.toFixed(2)],
        ['Doações financeiras', resumoGeral.quantidadeFinanceira],
        ['Doações materiais', resumoGeral.quantidadeMaterial],
        ['Roupas', resumoGeral.categoriasMateriais.roupas],
        ['Alimentos', resumoGeral.categoriasMateriais.alimentos],
        ['Brinquedos', resumoGeral.categoriasMateriais.brinquedos],
        ['Higiene', resumoGeral.categoriasMateriais.higiene],
        ['Material escolar', resumoGeral.categoriasMateriais.escolar],
        ['Trabalho voluntário', resumoGeral.categoriasMateriais.voluntario],
        ['Outros', resumoGeral.categoriasMateriais.outros]
      ]
    }

    const csv = linhas.map((linha) => linha.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `relatorio-${aba}-lar-batista.csv`
    link.click()

    URL.revokeObjectURL(url)
  }

  function exportarPDF() {
    window.print()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <AdminHeader
          title="Relatório por Doador"
          subtitle="Análise separada de doações financeiras, materiais e visão geral."
        />

        <section style={styles.actions}>
          <div style={styles.tabs}>
            <button style={aba === 'geral' ? styles.tabActive : styles.tab} onClick={() => setAba('geral')}>
              Geral
            </button>

            <button style={aba === 'financeiro' ? styles.tabActive : styles.tab} onClick={() => setAba('financeiro')}>
              Financeiro
            </button>

            <button style={aba === 'material' ? styles.tabActive : styles.tab} onClick={() => setAba('material')}>
              Material
            </button>
          </div>

          <div style={styles.exportButtons}>
            <button style={styles.btnPdf} onClick={exportarPDF}>
              Exportar PDF
            </button>

            <button style={styles.btnExcel} onClick={exportarExcelCSV}>
              Exportar Excel
            </button>
          </div>
        </section>

        {aba === 'geral' && (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Resumo Geral do Mês</h2>

            <div style={styles.summaryGrid}>
              <ResumoCard label="Total financeiro" value={formatarMoeda(resumoGeral.totalFinanceiro)} />
              <ResumoCard label="Total material estimado" value={formatarMoeda(resumoGeral.totalMaterial)} />
              <ResumoCard label="Total geral arrecadado" value={formatarMoeda(resumoGeral.totalGeral)} />
              <ResumoCard label="Doações registradas" value={confirmadas.length} />
            </div>

            <h3 style={styles.sectionTitle}>Itens materiais por categoria</h3>

            <div style={styles.categoryGrid}>
              <Categoria label="Roupas" value={resumoGeral.categoriasMateriais.roupas} />
              <Categoria label="Alimentos" value={resumoGeral.categoriasMateriais.alimentos} />
              <Categoria label="Brinquedos" value={resumoGeral.categoriasMateriais.brinquedos} />
              <Categoria label="Higiene" value={resumoGeral.categoriasMateriais.higiene} />
              <Categoria label="Material escolar" value={resumoGeral.categoriasMateriais.escolar} />
              <Categoria label="Trabalho voluntário" value={resumoGeral.categoriasMateriais.voluntario} />
              <Categoria label="Outros" value={resumoGeral.categoriasMateriais.outros} />
            </div>
          </section>
        )}

        {aba === 'financeiro' && (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Doações Financeiras</h2>

            {rankingFinanceiro.length === 0 ? (
              <p style={styles.emptyText}>Nenhuma doação financeira confirmada.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>Doador</th>
                      <th style={styles.th}>Quantidade</th>
                      <th style={styles.th}>Total financeiro</th>
                      <th style={styles.th}>Última doação</th>
                      <th style={styles.th}>Banco</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rankingFinanceiro.map((item, index) => (
                      <React.Fragment key={item.nome}>
                        <tr>
                          <td style={styles.td}>{index + 1}</td>
                          <td style={styles.td}>{item.nome}</td>
                          <td style={styles.td}>{item.quantidade}</td>
                          <td style={styles.td}>{formatarMoeda(item.total)}</td>
                          <td style={styles.td}>{item.ultimaDoacao}</td>
                          <td style={styles.td}>{item.banco}</td>
                        </tr>

                        <tr>
                          <td style={styles.historyTd} colSpan="6">
                            <strong>Histórico de doações:</strong>

                            <div style={styles.historyList}>
                              {item.historico.map((h, i) => (
                                <span key={i} style={styles.historyItem}>
                                  {h.data} • {h.forma} • {h.banco} • {formatarMoeda(h.valor)}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {aba === 'material' && (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Doações Materiais</h2>

            {rankingMaterial.length === 0 ? (
              <p style={styles.emptyText}>Nenhuma doação material confirmada.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>Doador</th>
                      <th style={styles.th}>Quantidade</th>
                      <th style={styles.th}>Itens doados</th>
                      <th style={styles.th}>Valor estimado</th>
                      <th style={styles.th}>Última doação</th>
                      <th style={styles.th}>Banco</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rankingMaterial.map((item, index) => (
                      <React.Fragment key={item.nome}>
                        <tr>
                          <td style={styles.td}>{index + 1}</td>
                          <td style={styles.td}>{item.nome}</td>
                          <td style={styles.td}>{item.quantidade}</td>
                          <td style={styles.td}>{item.itens.join(', ')}</td>
                          <td style={styles.td}>{formatarMoeda(item.totalEstimado)}</td>
                          <td style={styles.td}>{item.ultimaDoacao}</td>
                          <td style={styles.td}>{item.banco}</td>
                        </tr>

                        <tr>
                          <td style={styles.historyTd} colSpan="7">
                            <strong>Histórico de materiais:</strong>

                            <div style={styles.historyList}>
                              {item.historico.map((h, i) => (
                                <span key={i} style={styles.historyItem}>
                                  {h.data} • {h.item} • {h.banco} • {formatarMoeda(h.valorEstimado)}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

function ResumoCard({ label, value }) {
  return (
    <div style={styles.resumoCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function Categoria({ label, value }) {
  return (
    <div style={styles.categoryCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function extrairNumeroMoeda(valor) {
  return (
    Number(
      String(valor || '0')
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    ) || 0
  )
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eaf4ff 0%, #f8fbff 100%)',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '1220px',
    margin: '0 auto'
  },

  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },

  tabs: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  tab: {
    background: '#ffffff',
    color: '#0B3D91',
    border: '1px solid #bfdbfe',
    padding: '12px 20px',
    borderRadius: '999px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  tabActive: {
    background: '#0B3D91',
    color: '#ffffff',
    border: '1px solid #0B3D91',
    padding: '12px 20px',
    borderRadius: '999px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  exportButtons: {
    display: 'flex',
    gap: '10px'
  },

  btnPdf: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  btnExcel: {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },

  cardTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px'
  },

  resumoCard: {
    background: '#f8fbff',
    border: '1px solid #bfdbfe',
    borderLeft: '5px solid #ffc928',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  sectionTitle: {
    color: '#002855',
    marginTop: '28px'
  },

  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px'
  },

  categoryCard: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #dbeafe',
    color: '#0B3D91',
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },

  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1f2937',
    verticalAlign: 'top'
  },

  historyTd: {
    padding: '12px 14px 18px',
    background: '#f8fbff',
    borderBottom: '1px solid #dbeafe',
    color: '#475569'
  },

  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '8px'
  },

  historyItem: {
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '10px',
    padding: '8px 10px',
    color: '#334155'
  },

  emptyText: {
    color: '#6b7280',
    margin: 0
  }
}

export default RelatoriosAdmin