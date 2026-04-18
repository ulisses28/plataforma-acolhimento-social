import React, { useState, useEffect } from 'react'
import { criarDoacao, listarDoacoes } from '../../services/doacoesService'
import { buscarDoadores, salvarNovoDoador } from '../../services/doadoresService'

function PainelDoador() {
  const [doacoes, setDoacoes] = useState([])
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [doadorSelecionado, setDoadorSelecionado] = useState(null)
  const [modoDoador, setModoDoador] = useState(null)
  const [mostrarHistoricoDoador, setMostrarHistoricoDoador] = useState(false)

  const [novoNome, setNovoNome] = useState('')
  const [novoTipo, setNovoTipo] = useState('Financeiro')
  const [novoTelefone, setNovoTelefone] = useState('')
  const [novoObs, setNovoObs] = useState('')

  const [desejaDoacao, setDesejaDoacao] = useState('nao')
  const [tipoNovaDoacao, setTipoNovaDoacao] = useState('Financeira')
  const [valorNovaDoacao, setValorNovaDoacao] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('Pix')
  const [comprovanteArquivo, setComprovanteArquivo] = useState(null)
  const [descricaoMaterial, setDescricaoMaterial] = useState('')

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
    setMostrarHistoricoDoador(false)

    if (nome.trim().length === 0) {
      setResultados([])
      setDoadorSelecionado(null)
      return
    }

    if (nome.length < 2) {
      setResultados([])
      return
    }

    const lista = buscarDoadores(nome)
    setResultados(lista)
  }

  function selecionarDoador(doador) {
    setDoadorSelecionado(doador)
    setBusca(doador.nome)
    setResultados([])
    setMostrarHistoricoDoador(false)
  }

  function handleKeyDownBusca(e) {
    if (e.key === 'Enter' && resultados.length > 0) {
      e.preventDefault()
      selecionarDoador(resultados[0])
    }
  }

  function limparBuscaExistente() {
    setBusca('')
    setResultados([])
    setDoadorSelecionado(null)
    setMostrarHistoricoDoador(false)
  }

  function handleNovaDoacaoExistente() {
    const valor = prompt('Digite o valor da doação:')

    if (!valor) return

    criarDoacao(valor, doadorSelecionado)
    setDoacoes([...listarDoacoes()])
    setMostrarHistoricoDoador(false)
  }

  function resetFormularioNovoDoador() {
    setNovoNome('')
    setNovoTipo('Financeiro')
    setNovoTelefone('')
    setNovoObs('')
    setDesejaDoacao('nao')
    setTipoNovaDoacao('Financeira')
    setValorNovaDoacao('')
    setFormaPagamento('Pix')
    setComprovanteArquivo(null)
    setDescricaoMaterial('')
    setDoadorSelecionado(null)
    setBusca('')
    setResultados([])
    setMostrarHistoricoDoador(false)
  }

  function handleConfirmarNovoDoador() {
    if (!novoNome.trim()) {
      alert('Digite o nome do novo doador.')
      return
    }

    const doadorSalvo = salvarNovoDoador({
      nome: novoNome,
      tipo: novoTipo,
      telefone: novoTelefone,
      obs: novoObs
    })

    if (desejaDoacao === 'sim') {
      if (tipoNovaDoacao === 'Financeira') {
        if (!valorNovaDoacao.trim()) {
          alert('Digite o valor da doação financeira.')
          return
        }

        criarDoacao({
          doador: doadorSalvo,
          tipoDoacao: 'Financeira',
          valor: valorNovaDoacao,
          forma: formaPagamento,
          comprovante: formaPagamento === 'TED' && comprovanteArquivo
            ? comprovanteArquivo.name
            : ''
        })
      } else {
        if (!descricaoMaterial.trim()) {
          alert('Descreva a doação material.')
          return
        }

        criarDoacao({
          doador: doadorSalvo,
          tipoDoacao: 'Material',
          descricaoMaterial
        })
      }
    }

    setDoacoes([...listarDoacoes()])
    alert('Cadastro confirmado com sucesso.')
    resetFormularioNovoDoador()
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

  const historicoDoDoador = doadorSelecionado
    ? doacoes.filter((doacao) => doacao.doador === doadorSelecionado.nome)
    : []

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
                  setMostrarHistoricoDoador(false)
                }}
                style={styles.buttonSec}
                type="button"
              >
                Selecionar doador existente
              </button>

              <button
                onClick={() => {
                  setModoDoador('novo')
                  resetFormularioNovoDoador()
                }}
                style={styles.buttonSec}
                type="button"
              >
                Cadastrar novo doador
              </button>
            </div>

            {modoDoador === 'existente' && (
              <div style={styles.blockArea}>
                <div style={styles.searchInputWrapper}>
                  <input
                    placeholder="Buscar doador..."
                    value={busca}
                    onChange={(e) => handleBuscar(e.target.value)}
                    onKeyDown={handleKeyDownBusca}
                    style={styles.inputWithClear}
                  />

                  {busca && (
                    <button
                      type="button"
                      onClick={limparBuscaExistente}
                      style={styles.clearButton}
                      aria-label="Limpar busca"
                      title="Limpar busca"
                    >
                      ×
                    </button>
                  )}
                </div>

                {resultados.length > 0 && (
                  <div style={styles.resultBox}>
                    {resultados.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => selecionarDoador(d)}
                        style={styles.itemBusca}
                      >
                        {d.nome}
                      </div>
                    ))}
                  </div>
                )}

                {doadorSelecionado && (
                  <div style={styles.selectedBox}>
                    <p style={styles.selectedText}>
                      Doador selecionado: {doadorSelecionado.nome}
                    </p>

                    <div style={styles.actionButtons}>
                      <button
                        style={styles.primaryButtonSmall}
                        onClick={handleNovaDoacaoExistente}
                        type="button"
                      >
                        Cadastrar nova doação
                      </button>

                      <button
                        style={styles.secondaryButtonSmall}
                        onClick={() => setMostrarHistoricoDoador(true)}
                        type="button"
                      >
                        Histórico de doações
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {modoDoador === 'novo' && (
              <div style={styles.blockArea}>
                <input
                  placeholder="Nome do novo doador"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  style={styles.input}
                />

                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value)}
                  style={styles.input}
                >
                  <option value="Financeiro">Financeiro</option>
                  <option value="Material">Material</option>
                </select>

                <input
                  placeholder="Telefone"
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                  style={styles.input}
                />

                <input
                  placeholder="Observação"
                  value={novoObs}
                  onChange={(e) => setNovoObs(e.target.value)}
                  style={styles.input}
                />

                <div style={styles.radioBox}>
                  <label style={styles.radioLabel}>Deseja realizar uma doação agora?</label>

                  <div style={styles.radioGroup}>
                    <label>
                      <input
                        type="radio"
                        name="desejaDoacao"
                        value="sim"
                        checked={desejaDoacao === 'sim'}
                        onChange={(e) => setDesejaDoacao(e.target.value)}
                      />{' '}
                      Sim
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="desejaDoacao"
                        value="nao"
                        checked={desejaDoacao === 'nao'}
                        onChange={(e) => setDesejaDoacao(e.target.value)}
                      />{' '}
                      Não
                    </label>
                  </div>
                </div>

                {desejaDoacao === 'sim' && (
                  <div style={styles.blockArea}>
                    <select
                      value={tipoNovaDoacao}
                      onChange={(e) => setTipoNovaDoacao(e.target.value)}
                      style={styles.input}
                    >
                      <option value="Financeira">Financeira</option>
                      <option value="Material">Material</option>
                    </select>

                    {tipoNovaDoacao === 'Financeira' && (
                      <>
                        <input
                          placeholder="Valor da doação"
                          value={valorNovaDoacao}
                          onChange={(e) => setValorNovaDoacao(e.target.value)}
                          style={styles.input}
                        />

                        <select
                          value={formaPagamento}
                          onChange={(e) => setFormaPagamento(e.target.value)}
                          style={styles.input}
                        >
                          <option value="Pix">Pix</option>
                          <option value="TED">TED</option>
                        </select>

                        {formaPagamento === 'TED' && (
                          <div style={styles.fileBox}>
                            <label style={styles.fileLabel}>
                              Anexar comprovante (opcional)
                            </label>
                            <input
                              type="file"
                              onChange={(e) => setComprovanteArquivo(e.target.files[0] || null)}
                              style={styles.input}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {tipoNovaDoacao === 'Material' && (
                      <input
                        placeholder="Descrição da doação material"
                        value={descricaoMaterial}
                        onChange={(e) => setDescricaoMaterial(e.target.value)}
                        style={styles.input}
                      />
                    )}
                  </div>
                )}

                <div style={styles.actionButtonsBottom}>
                  <button
                    type="button"
                    style={styles.confirmButton}
                    onClick={handleConfirmarNovoDoador}
                  >
                    Confirmar
                  </button>

                  <button
                    type="button"
                    style={styles.cancelButton}
                    onClick={resetFormularioNovoDoador}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {mostrarHistoricoDoador && doadorSelecionado && (
          <section style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h2 style={styles.tableTitle}>
                Histórico de doações de {doadorSelecionado.nome}
              </h2>
              <p style={styles.tableSubtitle}>
                Visualização filtrada do doador selecionado.
              </p>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Data</th>
                    <th style={styles.th}>Valor</th>
                    <th style={styles.th}>Forma</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoDoDoador.length === 0 ? (
                    <tr>
                      <td style={styles.emptyTd} colSpan="4">
                        Este doador ainda não possui doações registradas.
                      </td>
                    </tr>
                  ) : (
                    historicoDoDoador.map((doacao) => (
                      <tr key={doacao.id}>
                        <td style={styles.td}>{doacao.data}</td>
                        <td style={styles.td}>{doacao.valor}</td>
                        <td style={styles.td}>
                          {doacao.forma}
                          {doacao.comprovante ? ` (${doacao.comprovante})` : ''}
                        </td>
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
        )}

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
            <h2 style={styles.tableTitle}>Histórico geral de doações</h2>
            <p style={styles.tableSubtitle}>
              Visualize todas as contribuições registradas no sistema.
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
                      <td style={styles.td}>
                        {doacao.forma}
                        {doacao.comprovante ? ` (${doacao.comprovante})` : ''}
                      </td>
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
    marginBottom: '24px'
  },
  headerTextArea: {
    width: '100%'
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
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    width: '100%',
    marginTop: '10px'
  },
  searchInputWrapper: {
    position: 'relative',
    width: '100%'
  },
  inputWithClear: {
    padding: '12px 42px 12px 12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    width: '100%'
  },
  clearButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    fontSize: '22px',
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0
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
  selectedBox: {
    marginTop: '10px'
  },
  selectedText: {
    marginTop: '8px',
    color: 'green',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px'
  },
  primaryButtonSmall: {
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer'
  },
  secondaryButtonSmall: {
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    backgroundColor: '#92400e',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer'
  },
  radioBox: {
    marginTop: '12px'
  },
  radioLabel: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#374151'
  },
  radioGroup: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap'
  },
  fileBox: {
    marginTop: '10px'
  },
  fileLabel: {
    display: 'block',
    marginBottom: '6px',
    color: '#4b5563',
    fontWeight: '600'
  },
  actionButtonsBottom: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '18px'
  },
  confirmButton: {
    border: 'none',
    borderRadius: '10px',
    padding: '12px 18px',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer'
  },
  cancelButton: {
    border: 'none',
    borderRadius: '10px',
    padding: '12px 18px',
    backgroundColor: '#991b1b',
    color: '#ffffff',
    fontWeight: '700',
    cursor: 'pointer'
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
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
    marginBottom: '24px'
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