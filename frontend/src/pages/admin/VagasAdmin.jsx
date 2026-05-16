import React, { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import {
  listarCandidaturas,
  excluirCandidatura,
  atualizarStatusCandidatura
} from '../../services/vagasService'

function VagasAdmin() {
  const [candidaturas, setCandidaturas] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [palavrasChave, setPalavrasChave] = useState('')
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    setCandidaturas(listarCandidaturas())
  }

  function remover(id) {
    if (!confirm('Deseja remover esta candidatura?')) return
    excluirCandidatura(id)
    carregar()
    setSelecionado(null)
  }

  function baixarArquivo(arquivo) {
    const link = document.createElement('a')
    link.href = arquivo.base64
    link.download = arquivo.nome || 'arquivo'
    link.click()
  }

  function mudarStatus(id, novoStatus) {
    atualizarStatusCandidatura(id, novoStatus)
    carregar()

    if (selecionado?.id === id) {
      const atualizada = listarCandidaturas().find((item) => item.id === id)
      setSelecionado(atualizada)
    }
  }

  const listaFiltrada = useMemo(() => {
    const textoBusca = busca.toLowerCase().trim()

    const keywords = palavrasChave
      .toLowerCase()
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)

    return candidaturas
      .map((item) => {
        const textoCompleto = `
          ${item.nome}
          ${item.cpf}
          ${item.email}
          ${item.vaga}
          ${item.tipo}
          ${item.observacoes}
          ${item.estado}
          ${item.municipio}
        `.toLowerCase()

        const pontos = keywords.reduce((total, palavra) => {
          return textoCompleto.includes(palavra) ? total + 1 : total
        }, 0)

        const percentual =
          keywords.length === 0 ? 0 : Math.round((pontos / keywords.length) * 100)

        return { ...item, pontos, percentual }
      })
      .filter((item) => {
        const textoCompleto = `
          ${item.nome}
          ${item.cpf}
          ${item.email}
          ${item.vaga}
          ${item.tipo}
          ${item.observacoes}
        `.toLowerCase()

        const passaBusca = !textoBusca || textoCompleto.includes(textoBusca)
        const passaTipo = filtroTipo === 'Todos' || item.tipo === filtroTipo
        const passaStatus = filtroStatus === 'Todos' || item.status === filtroStatus

        return passaBusca && passaTipo && passaStatus
      })
      .sort((a, b) => b.percentual - a.percentual)
  }, [candidaturas, busca, filtroTipo, filtroStatus, palavrasChave])

  const resumo = {
    total: candidaturas.length,
    analise: candidaturas.filter((c) => c.status === 'Em análise' || !c.status).length,
    entrevista: candidaturas.filter((c) => c.status === 'Entrevista').length,
    aprovados: candidaturas.filter((c) => c.status === 'Aprovado').length,
    banco: candidaturas.filter((c) => c.status === 'Banco de talentos').length
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Banco de Currículos</h1>
            <p style={styles.subtitle}>
              Gerencie candidaturas recebidas, currículos, cartas de apresentação,
              status de seleção e filtros por palavras-chave.
            </p>
          </div>
        </header>

        <section style={styles.summaryGrid}>
          <ResumoCard title="Total" value={resumo.total} color="#0B3D91" />
          <ResumoCard title="Em análise" value={resumo.analise} color="#2563eb" />
          <ResumoCard title="Entrevistas" value={resumo.entrevista} color="#f59e0b" />
          <ResumoCard title="Aprovados" value={resumo.aprovados} color="#16a34a" />
          <ResumoCard title="Banco talentos" value={resumo.banco} color="#64748b" />
        </section>

        <section style={styles.filterCard}>
          <h2 style={styles.sectionTitle}>Filtros inteligentes</h2>

          <div style={styles.filterGrid}>
            <input
              style={styles.input}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar por nome, CPF, e-mail ou vaga"
            />

            <select
              style={styles.input}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option>Todos</option>
              <option>Vaga</option>
              <option>Banco de Talentos</option>
              <option>Outros</option>
            </select>

            <select
              style={styles.input}
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option>Todos</option>
              <option>Em análise</option>
              <option>Entrevista</option>
              <option>Aprovado</option>
              <option>Reprovado</option>
              <option>Banco de talentos</option>
            </select>
          </div>

          <input
            style={styles.input}
            value={palavrasChave}
            onChange={(e) => setPalavrasChave(e.target.value)}
            placeholder="Palavras-chave da vaga. Ex: administração, excel, atendimento, crianças"
          />

          <p style={styles.helper}>
            A pontuação é apenas um apoio de triagem. A decisão final deve ser
            feita por análise humana, considerando critérios justos e objetivos.
          </p>
        </section>

        <section style={styles.listCard}>
          <h2 style={styles.sectionTitle}>Currículos recebidos</h2>

          {listaFiltrada.length === 0 ? (
            <p style={styles.empty}>Nenhuma candidatura encontrada.</p>
          ) : (
            <div style={styles.grid}>
              {listaFiltrada.map((item) => (
                <article key={item.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.badge}>{item.tipo}</span>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background: statusCor(item.status || 'Em análise')
                      }}
                    >
                      {item.status || 'Em análise'}
                    </span>
                  </div>

                  <h3 style={styles.name}>{item.nome}</h3>

                  <p style={styles.meta}>
                    <strong>Vaga/Área:</strong> {item.vaga}
                  </p>

                  <p style={styles.meta}>
                    <strong>Data:</strong> {item.criadoEm}
                  </p>

                  <p style={styles.meta}>
                    <strong>Local:</strong> {item.municipio} - {item.estado}
                  </p>

                  <div style={styles.scoreBox}>
                    <strong>Compatibilidade por palavras-chave</strong>

                    <div style={styles.scoreTrack}>
                      <div
                        style={{
                          ...styles.scoreFill,
                          width: `${item.percentual}%`
                        }}
                      />
                    </div>

                    <span style={styles.scoreText}>
                      {item.percentual}% • {item.pontos} palavra(s) encontrada(s)
                    </span>
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      type="button"
                      style={styles.viewButton}
                      onClick={() => setSelecionado(item)}
                    >
                      Ver detalhes
                    </button>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => remover(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {selecionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selecionado.nome}</h2>
                <p style={styles.modalSubtitle}>
                  {selecionado.vaga} • {selecionado.tipo}
                </p>
              </div>

              <button
                type="button"
                style={styles.closeButton}
                onClick={() => setSelecionado(null)}
              >
                Fechar
              </button>
            </div>

            <section style={styles.modalGrid}>
              <Info label="CPF" value={selecionado.cpf} />
              <Info label="E-mail" value={selecionado.email} />
              <Info label="Sexo/Gênero" value={selecionado.sexo} />
              <Info label="Local" value={`${selecionado.municipio} - ${selecionado.estado}`} />
              <Info label="Data de envio" value={selecionado.criadoEm} />
              <Info label="Status atual" value={selecionado.status || 'Em análise'} />
            </section>

            <label style={styles.label}>Alterar status</label>
            <select
              style={styles.input}
              value={selecionado.status || 'Em análise'}
              onChange={(e) => mudarStatus(selecionado.id, e.target.value)}
            >
              <option>Em análise</option>
              <option>Entrevista</option>
              <option>Aprovado</option>
              <option>Reprovado</option>
              <option>Banco de talentos</option>
            </select>

            <section style={styles.modalSection}>
              <h3 style={styles.modalSectionTitle}>Observações</h3>
              <p style={styles.obs}>
                {selecionado.observacoes || 'Sem observações adicionais.'}
              </p>
            </section>

            <section style={styles.modalSection}>
              <h3 style={styles.modalSectionTitle}>Arquivos anexados</h3>

              {selecionado.arquivos?.length > 0 ? (
                selecionado.arquivos.map((arquivo, index) => (
                  <button
                    key={index}
                    type="button"
                    style={styles.fileButton}
                    onClick={() => baixarArquivo(arquivo)}
                  >
                    📎 {arquivo.nome || `Arquivo ${index + 1}`}
                  </button>
                ))
              ) : (
                <p style={styles.emptySmall}>Nenhum arquivo anexado.</p>
              )}
            </section>

            <section style={styles.modalSection}>
              <h3 style={styles.modalSectionTitle}>Histórico</h3>

              {(selecionado.historico || []).map((h, index) => (
                <p key={index} style={styles.historyItem}>
                  {h.data} — {h.status}
                </p>
              ))}
            </section>
          </div>
        </div>
      )}
    </main>
  )
}

function ResumoCard({ title, value, color }) {
  return (
    <div style={{ ...styles.summaryCard, borderLeft: `6px solid ${color}` }}>
      <strong style={{ color }}>{value}</strong>
      <span>{title}</span>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <strong>{label}</strong>
      <span>{value || 'Não informado'}</span>
    </div>
  )
}

function statusCor(status) {
  if (status === 'Entrevista') return '#f59e0b'
  if (status === 'Aprovado') return '#16a34a'
  if (status === 'Reprovado') return '#dc2626'
  if (status === 'Banco de talentos') return '#64748b'
  return '#2563eb'
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: 0
  },
  subtitle: {
    color: '#475569',
    lineHeight: '1.6',
    maxWidth: '760px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  summaryCard: {
    background: '#fff',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  filterCard: {
    background: '#fff',
    borderRadius: '22px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  listCard: {
    background: '#fff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '14px',
    marginBottom: '14px'
  },
  input: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  label: {
    display: 'block',
    marginTop: '16px',
    marginBottom: '8px',
    fontWeight: '900',
    color: '#334155'
  },
  helper: {
    color: '#64748b',
    fontSize: '14px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px'
  },
  card: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '20px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap'
  },
  badge: {
    background: '#0B3D91',
    color: '#fff',
    borderRadius: '999px',
    padding: '6px 10px',
    fontWeight: '900',
    fontSize: '12px'
  },
  statusBadge: {
    color: '#fff',
    borderRadius: '999px',
    padding: '6px 10px',
    fontWeight: '900',
    fontSize: '12px'
  },
  name: {
    color: '#0B3D91',
    marginBottom: '10px'
  },
  meta: {
    color: '#334155',
    margin: '7px 0'
  },
  scoreBox: {
    background: '#fff',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '12px'
  },
  scoreTrack: {
    height: '12px',
    background: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    marginTop: '10px'
  },
  scoreFill: {
    height: '100%',
    background: '#16a34a',
    borderRadius: '999px'
  },
  scoreText: {
    display: 'block',
    color: '#64748b',
    marginTop: '8px',
    fontSize: '14px'
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap'
  },
  viewButton: {
    flex: 1,
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  deleteButton: {
    flex: 1,
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  empty: {
    color: '#64748b'
  },
  emptySmall: {
    color: '#64748b',
    fontSize: '14px'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 9999
  },
  modal: {
    background: '#fff',
    width: 'min(980px, 96vw)',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '22px',
    padding: '28px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'flex-start'
  },
  modalTitle: {
    color: '#0B3D91',
    margin: 0
  },
  modalSubtitle: {
    color: '#64748b'
  },
  closeButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontWeight: '900'
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginTop: '20px'
  },
  infoBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  modalSection: {
    marginTop: '20px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px'
  },
  modalSectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  obs: {
    color: '#475569',
    lineHeight: '1.6'
  },
  fileButton: {
    display: 'block',
    width: '100%',
    marginTop: '8px',
    background: '#eef6ff',
    color: '#0B3D91',
    border: '1px solid #bfdbfe',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: '800'
  },
  historyItem: {
    color: '#475569',
    margin: '6px 0'
  }
}

export default VagasAdmin