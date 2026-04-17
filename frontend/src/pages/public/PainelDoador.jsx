import React, { useState, useEffect } from 'react'
import { criarDoacao, listarDoacoes } from '../../services/doacoesService'
import { buscarDoadores } from '../../services/doadoresService'

function PainelDoador() {
  const [doacoes, setDoacoes] = useState([])
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [doadorSelecionado, setDoadorSelecionado] = useState(null)
  const [modoDoador, setModoDoador] = useState(null)

  useEffect(() => {
    setDoacoes([...listarDoacoes()])
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setDoacoes([...listarDoacoes()])
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  function handleBuscar(nome) {
    setBusca(nome)

    if (nome.length < 2) {
      setResultados([])
      return
    }

    const lista = buscarDoadores(nome)
    setResultados(lista)
  }

  function handleNovaDoacao() {
    const valor = prompt('Digite o valor da doação:')

    if (!valor) return

    criarDoacao(valor, doadorSelecionado)
    setDoacoes([...listarDoacoes()])
  }

  const totalDoacoes = doacoes.length

  const valorTotal = doacoes.reduce((total, doacao) => {
    const valorNumerico = Number(
      String(doacao.valor).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    )

    return total + (isNaN(valorNumerico) ? 0 : valorNumerico)
  }, 0)

  const totalConfirmadas = doacoes.filter(
    (doacao) => doacao.status === 'Confirmado'
  ).length

  const valorTotalFormatado = valorTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.headerCard}>
          <div style={styles.headerTextArea}>
            <h1 style={styles.title}>Olá, Doador</h1>
            <p style={styles.subtitle}>
              Acompanhe aqui seu histórico de contribuições e seu relacionamento com a instituição.
            </p>

            <div style={styles.selectorArea}>
              <button
                onClick={() => {
                  setModoDoador('existente')
                  setDoadorSelecionado(null)
                  setBusca('')
                  setResultados([])
                }}
                style={styles.buttonSec}
                type="button"
              >
                Selecionar doador existente
              </button>

              <button
                onClick={() => {
                  setModoDoador('novo')
                  setDoadorSelecionado(null)
                  setBusca('')
                  setResultados([])
                }}
                style={styles.buttonSec}
                type="button"
              >
                Cadastrar novo doador
              </button>
            </div>

            {modoDoador === 'existente' && (
              <div style={styles.blockArea}>
                <input
                  placeholder="Buscar doador..."
                  value={busca}
                  onChange={(e) => handleBuscar(e.target.value)}
                  style={styles.input}
                />

                {resultados.length > 0 && (
                  <div style={styles.resultBox}>
                    {resultados.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setDoadorSelecionado(d)
                          setBusca(d.nome)
                          setResultados([])
                        }}
                        style={styles.itemBusca}
                      >
                        {d.nome}
                      </div>
                    ))}
                  </div>
                )}

                {doadorSelecionado && (
                  <p style={styles.selectedText}>
                    Doador selecionado: {doadorSelecionado.nome}
                  </p>
                )}
              </div>
            )}

            {modoDoador === 'novo' && (
              <div style={styles.blockArea}>
                <input
                  placeholder="Nome do novo doador"
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value)
                    setDoadorSelecionado({ nome: e.target.value })
                  }}
                  style={styles.input}
                />

                {doadorSelecionado?.nome && (
                  <p style={styles.selectedText}>
                    Novo doador informado: {doadorSelecionado.nome}
                  </p>
                )}
              </div>
            )}
          </div>

          <button style={styles.primaryButton} onClick={handleNovaDoacao} type="button">
            Nova doação
          </button>
        </section>

        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{totalDoacoes}</h2>
            <p style={styles.summaryLabel}>Doações registradas</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{valorTotalFormatado}</h2>
            <p style={styles.summaryLabel}>Valor total doado</p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>{totalConfirmadas}</h2>
            <p style={styles.summaryLabel}>Doações confirmadas</p>
          </div>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Histórico de doações</h2>
            <p style={styles.tableSubtitle}>
              Visualize suas últimas contribuições.
            </p>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Doador</th>
                  <th style={styles.th}>Valor</th>
                  <th style={styles.th}>Forma</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {doacoes.length === 0 ? (
                  <tr>
                    <td style={styles.emptyTd} colSpan="5">
                      Nenhuma doação registrada ainda.
                    </td>
                  </tr>
                ) : (
                  doacoes.map((doacao) => (
                    <tr key={doacao.id}>
                      <td style={styles.td}>{doacao.data}</td>
                      <td style={styles.td}>{doacao.doador || 'Anônimo'}</td>
                      <td style={styles.td}>{doacao.valor}</td>
                      <td style={styles.td}>{doacao.forma}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(doacao.status === 'Confirmado'
                              ? styles.statusConfirmed
                              : doacao.status === 'Erro'
                              ? styles.statusError
                              : styles.statusPending)
                          }}
                        >
                          {doacao.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    backgroundColor: '#F1F5F9',
    minHeight: '100vh',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  headerTextArea: {
    flex: 1,
    minWidth: '320px'
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#0B3D91'
  },
  subtitle: {
    marginTop: '10px',
    color: '#4b5563',
    lineHeight: '1.6'
  },
  selectorArea: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px'
  },
  blockArea: {
    marginTop: '16px'
  },
  buttonSec: {
    padding: '10px 15px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#0B3D91',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600'
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%'
  },
  resultBox: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginTop: '5px',
    overflow: 'hidden'
  },
  itemBusca: {
    padding: '10px',
    background: '#fff',
    borderBottom: '1px solid #eee',
    cursor: 'pointer'
  },
  selectedText: {
    marginTop: '8px',
    color: 'green',
    fontWeight: '600'
  },
  primaryButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '14px 22px',
    backgroundColor: '#0B3D91',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'center'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  summaryNumber: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#0B3D91'
  },
  summaryLabel: {
    marginTop: '10px',
    color: '#4b5563'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  tableHeader: {
    marginBottom: '20px'
  },
  tableTitle: {
    margin: 0,
    color: '#0B3D91'
  },
  tableSubtitle: {
    marginTop: '8px',
    color: '#6b7280'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    fontSize: '14px'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1f2937'
  },
  emptyTd: {
    padding: '20px 14px',
    textAlign: 'center',
    color: '#6b7280'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusConfirmed: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
}

export default PainelDoador