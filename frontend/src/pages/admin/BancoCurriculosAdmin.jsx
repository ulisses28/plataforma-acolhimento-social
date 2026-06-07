import React, { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarCurriculos,
  excluirCurriculo,
  abrirArquivoBase64,
  baixarArquivoBase64
} from '../../services/curriculosService'

import { listarVagas } from '../../services/vagasService'

function BancoCurriculosAdmin() {
  const [curriculos, setCurriculos] = useState([])
  const [vagas, setVagas] = useState([])
  const [vagaSelecionada, setVagaSelecionada] = useState(null)
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null)
  const [pesquisa, setPesquisa] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')

  useEffect(() => {
    carregarDados()
  }, [])

  function carregarDados() {
    setCurriculos(listarCurriculos())
    setVagas(listarVagas())
  }

  function obterCandidaturasDaVaga(vaga) {
    return curriculos.filter((candidato) => {
      if (vaga.id === 'sem-vaga') {
        return !candidato.vagaId && !candidato.vaga && !candidato.vagaTitulo
      }

      return (
        String(candidato.vagaId) === String(vaga.id) ||
        candidato.vaga === vaga.titulo ||
        candidato.vagaTitulo === vaga.titulo
      )
    })
  }

  const vagasComBanco = useMemo(() => {
    return [
      ...vagas,
      {
        id: 'sem-vaga',
        titulo: 'Banco de talentos',
        local: 'Currículos sem vaga vinculada',
        status: 'Ativa'
      }
    ]
  }, [vagas])

  const candidaturasFiltradas = useMemo(() => {
    if (!vagaSelecionada) return []

    return obterCandidaturasDaVaga(vagaSelecionada).filter((item) => {
      const texto = `
        ${item.nome || ''}
        ${item.email || ''}
        ${item.telefone || ''}
        ${item.sexo || ''}
        ${item.vaga || ''}
        ${item.vagaTitulo || ''}
        ${item.habilidades || ''}
      `.toLowerCase()

      const matchPesquisa = texto.includes(pesquisa.toLowerCase())

      const matchStatus =
        filtroStatus === 'Todos' ? true : item.status === filtroStatus

      return matchPesquisa && matchStatus
    })
  }, [vagaSelecionada, curriculos, pesquisa, filtroStatus])

  function encerrarCandidaturas(vagaId) {
    if (vagaId === 'sem-vaga') {
      alert('O banco de talentos não pode ser encerrado.')
      return
    }

    const confirmar = window.confirm(
      'Deseja encerrar as candidaturas desta vaga? Novos candidatos não poderão se inscrever.'
    )

    if (!confirmar) return

    const atualizadas = vagas.map((vaga) =>
      String(vaga.id) === String(vagaId)
        ? { ...vaga, aceitaCurriculos: false, statusCandidatura: 'Encerrada' }
        : vaga
    )

    localStorage.setItem('vagas_lar_batista', JSON.stringify(atualizadas))
    setVagas(atualizadas)

    alert('Candidaturas encerradas para esta vaga.')
  }

  function reabrirCandidaturas(vagaId) {
    const atualizadas = vagas.map((vaga) =>
      String(vaga.id) === String(vagaId)
        ? { ...vaga, aceitaCurriculos: true, statusCandidatura: 'Aberta' }
        : vaga
    )

    localStorage.setItem('vagas_lar_batista', JSON.stringify(atualizadas))
    setVagas(atualizadas)

    alert('Candidaturas reabertas para esta vaga.')
  }

  function alterarStatus(id, novoStatus) {
    const atualizados = curriculos.map((item) =>
      item.id === id ? { ...item, status: novoStatus } : item
    )

    localStorage.setItem('banco_curriculos_lar_batista', JSON.stringify(atualizados))
    setCurriculos(atualizados)

    if (candidatoSelecionado?.id === id) {
      setCandidatoSelecionado({
        ...candidatoSelecionado,
        status: novoStatus
      })
    }
  }

  function remover(id) {
    const confirmar = window.confirm('Deseja excluir este currículo?')

    if (!confirmar) return

    excluirCurriculo(id)
    carregarDados()
    setCandidatoSelecionado(null)
  }

  function voltarParaVagas() {
    setVagaSelecionada(null)
    setCandidatoSelecionado(null)
    setPesquisa('')
    setFiltroStatus('Todos')
  }

  function voltarParaLista() {
    setCandidatoSelecionado(null)
  }

  if (candidatoSelecionado) {
    const item = candidatoSelecionado

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <button type="button" style={styles.backButton} onClick={voltarParaLista}>
            ← Voltar para candidaturas
          </button>

          <article style={styles.detailCard}>
            <h1 style={styles.title}>{item.nome}</h1>

            <p style={styles.subtitle}>
              Candidatura para: {item.vagaTitulo || item.vaga || 'Banco de talentos'}
            </p>

            <div style={styles.info}>
              <p><strong>E-mail:</strong> {item.email || 'Não informado'}</p>
              <p><strong>Telefone:</strong> {item.telefone || 'Não informado'}</p>
              <p><strong>Sexo:</strong> {item.sexo || 'Não informado'}</p>
              <p><strong>Data da candidatura:</strong> {item.dataCadastro || item.criadoEm || 'Não informado'}</p>
              <p><strong>Status:</strong> {item.status || 'Em análise'}</p>
              <p><strong>Currículo:</strong> {item.curriculoNome || item.curriculo || 'Não enviado'}</p>
              <p><strong>Carta:</strong> {item.recomendacaoNome || item.recomendacao || 'Não enviada'}</p>
            </div>

            <div style={styles.actions}>
              {item.curriculoBase64 && (
                <>
                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => abrirArquivoBase64(item.curriculoBase64)}
                  >
                    Visualizar currículo
                  </button>

                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => baixarArquivoBase64(item.curriculoBase64, item.curriculoNome)}
                  >
                    Baixar currículo
                  </button>
                </>
              )}

              {item.recomendacaoBase64 && (
                <>
                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => abrirArquivoBase64(item.recomendacaoBase64)}
                  >
                    Visualizar carta
                  </button>

                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => baixarArquivoBase64(item.recomendacaoBase64, item.recomendacaoNome)}
                  >
                    Baixar carta
                  </button>
                </>
              )}

              <select
                value={item.status || 'Em análise'}
                onChange={(e) => alterarStatus(item.id, e.target.value)}
                style={styles.select}
              >
                <option>Em análise</option>
                <option>Entrevista</option>
                <option>Aprovado</option>
                <option>Banco de talentos</option>
                <option>Reprovado</option>
              </select>

              <button
                type="button"
                style={styles.delete}
                onClick={() => remover(item.id)}
              >
                Excluir candidatura
              </button>
            </div>
          </article>
        </div>
      </main>
    )
  }

  if (vagaSelecionada) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <button type="button" style={styles.backButton} onClick={voltarParaVagas}>
            ← Voltar para vagas
          </button>

          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>{vagaSelecionada.titulo}</h1>

              <p style={styles.subtitle}>
                Candidaturas recebidas para esta vaga.
              </p>
            </div>

            <div style={styles.statCard}>
              <strong>{candidaturasFiltradas.length}</strong>
              <span>Candidaturas</span>
            </div>
          </header>

          <section style={styles.filters}>
            <input
              type="text"
              placeholder="Pesquisar candidato, e-mail ou habilidade"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              style={styles.input}
            />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={styles.select}
            >
              <option>Todos</option>
              <option>Em análise</option>
              <option>Entrevista</option>
              <option>Aprovado</option>
              <option>Banco de talentos</option>
              <option>Reprovado</option>
            </select>
          </section>

          <section style={styles.listCard}>
            {candidaturasFiltradas.length === 0 ? (
              <div style={styles.empty}>Nenhuma candidatura encontrada para esta vaga.</div>
            ) : (
              candidaturasFiltradas.map((item) => (
                <div key={item.id} style={styles.row}>
                  <div>
                    <h3 style={styles.rowTitle}>{item.nome}</h3>

                    <p style={styles.rowText}>
                      {item.dataCadastro || item.criadoEm || 'Data não informada'} •{' '}
                      {item.email || 'E-mail não informado'}
                    </p>

                    <p style={styles.rowText}>
                      Status: <strong>{item.status || 'Em análise'}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    style={styles.primaryButtonSmall}
                    onClick={() => setCandidatoSelecionado(item)}
                  >
                    Visualizar candidatura
                  </button>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Banco de Currículos</h1>

            <p style={styles.subtitle}>
              Gestão de candidaturas por vaga, com visualização organizada para análise da instituição.
            </p>
          </div>

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <strong>{curriculos.length}</strong>
              <span>Total</span>
            </div>

            <div style={styles.statCard}>
              <strong>
                {curriculos.filter((i) => i.status === 'Em análise').length}
              </strong>
              <span>Em análise</span>
            </div>

            <div style={styles.statCard}>
              <strong>
                {curriculos.filter((i) => i.status === 'Aprovado').length}
              </strong>
              <span>Aprovados</span>
            </div>
          </div>
        </header>

        <section style={styles.grid}>
          {vagasComBanco.map((vaga) => {
            const total = obterCandidaturasDaVaga(vaga).length
            const encerrada = vaga.aceitaCurriculos === false || vaga.statusCandidatura === 'Encerrada'

            return (
              <article key={vaga.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span
                    style={{
                      ...styles.badge,
                      background: encerrada ? '#dc2626' : '#16a34a'
                    }}
                  >
                    {encerrada ? 'Encerrada' : 'Aberta'}
                  </span>
                </div>

                <h2 style={styles.name}>{vaga.titulo}</h2>

                <p style={styles.email}>{vaga.local || 'Local não informado'}</p>

                <div style={styles.countBox}>
                  <strong>{total}</strong>
                  <span>candidaturas recebidas</span>
                </div>

                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => setVagaSelecionada(vaga)}
                  >
                    Visualizar candidaturas
                  </button>

                  {vaga.id !== 'sem-vaga' && (
                    encerrada ? (
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={() => reabrirCandidaturas(vaga.id)}
                      >
                        Reabrir candidaturas
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={styles.delete}
                        onClick={() => encerrarCandidaturas(vaga.id)}
                      >
                        Encerrar candidaturas
                      </button>
                    )
                  )}
                </div>
              </article>
            )
          })}
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
    maxWidth: '1350px',
    margin: '0 auto'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '30px',
    flexWrap: 'wrap',
    marginBottom: '35px'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.6rem',
    marginBottom: '10px'
  },

  subtitle: {
    color: '#64748b',
    maxWidth: '720px',
    lineHeight: '1.6'
  },

  stats: {
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap'
  },

  statCard: {
    background: '#fff',
    padding: '22px',
    borderRadius: '18px',
    minWidth: '150px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '28px',
    flexWrap: 'wrap'
  },

  input: {
    flex: 1,
    minWidth: '300px',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1'
  },

  select: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    minWidth: '240px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
    gap: '24px'
  },

  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '26px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    border: '1px solid #dbeafe'
  },

  detailCard: {
    background: '#fff',
    borderRadius: '24px',
    padding: '34px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    border: '1px solid #dbeafe'
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '12px'
  },

  badge: {
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },

  name: {
    color: '#0B3D91',
    marginBottom: '8px'
  },

  email: {
    color: '#64748b',
    marginBottom: '18px'
  },

  countBox: {
    background: '#eef6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    color: '#0B3D91'
  },

  listCard: {
    background: '#fff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    border: '1px solid #dbeafe'
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '18px',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    padding: '18px 0',
    flexWrap: 'wrap'
  },

  rowTitle: {
    color: '#0B3D91',
    margin: 0
  },

  rowText: {
    color: '#64748b',
    margin: '6px 0 0'
  },

  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
    color: '#334155'
  },

  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  primaryButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    padding: '14px',
    textAlign: 'center',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '900',
    cursor: 'pointer'
  },

  primaryButtonSmall: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    padding: '12px 16px',
    textAlign: 'center',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '900',
    cursor: 'pointer'
  },

  secondaryButton: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  delete: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#0B3D91',
    fontWeight: '900',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '1rem'
  },

  empty: {
    background: '#fff',
    padding: '40px',
    borderRadius: '18px',
    textAlign: 'center',
    color: '#64748b'
  }
}

export default BancoCurriculosAdmin