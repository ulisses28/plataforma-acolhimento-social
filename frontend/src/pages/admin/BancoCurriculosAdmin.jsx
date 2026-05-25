import React, { useEffect, useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarCandidaturas,
  atualizarStatusCandidatura,
  excluirCandidatura
} from '../../services/vagasService'

import {
  listarNoticias
} from '../../services/noticiasService'

function BancoCurriculosAdmin() {
  const [curriculos, setCurriculos] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [filtroStatus, setFiltroStatus] =
    useState('Todos')

  useEffect(() => {
    carregarDados()
  }, [])

  function carregarDados() {
    const lista = listarCandidaturas()
    setCurriculos(lista)
  }

  const [vagas, setVagas] = useState([])

  useEffect(() => {
    async function carregarVagas() {
      try {
        const noticias = await listarNoticias()

        const vagasFiltradas = noticias.filter(
          (item) =>
            item.tipo === 'vaga' ||
            item.categoria === 'Vagas'
        )

        setVagas(vagasFiltradas)
      } catch (error) {
        console.error(error)
      }
    }

    carregarVagas()
  }, [])

  function alterarStatus(id, status) {
    atualizarStatusCandidatura(id, status)
    carregarDados()
  }

  function remover(id) {
    const confirmar = window.confirm(
      'Deseja excluir esta candidatura?'
    )

    if (!confirmar) return

    excluirCandidatura(id)
    carregarDados()
  }

  const filtrados = curriculos.filter((item) => {
    const texto =
      `
      ${item.nome || ''}
      ${item.email || ''}
      ${item.vaga || ''}
      ${item.habilidades || ''}
    `.toLowerCase()

    const matchPesquisa = texto.includes(
      pesquisa.toLowerCase()
    )

    const matchStatus =
      filtroStatus === 'Todos'
        ? true
        : item.status === filtroStatus

    return matchPesquisa && matchStatus
  })

  function calcularCompatibilidade(candidato) {
    const vagaRelacionada = vagas.find(
      (vaga) => vaga.titulo === candidato.vaga
    )

    if (!vagaRelacionada)
      return {
        cor: '#64748b',
        texto: 'Sem vaga vinculada'
      }

    const requisitos = (
      vagaRelacionada.resumo || ''
    ).toLowerCase()

    const habilidades = (
      candidato.habilidades || ''
    ).toLowerCase()

    let pontos = 0

    const palavras = requisitos.split(' ')

    palavras.forEach((palavra) => {
      if (
        palavra.length > 4 &&
        habilidades.includes(palavra)
      ) {
        pontos++
      }
    })

    if (pontos >= 6) {
      return {
        cor: '#16a34a',
        texto: 'Alta compatibilidade'
      }
    }

    if (pontos >= 3) {
      return {
        cor: '#f59e0b',
        texto: 'Compatibilidade média'
      }
    }

    return {
      cor: '#dc2626',
      texto: 'Baixa compatibilidade'
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Banco de Currículos
            </h1>

            <p style={styles.subtitle}>
              Gestão inteligente de
              candidaturas e análise de
              compatibilidade com vagas.
            </p>
          </div>

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <strong>
                {curriculos.length}
              </strong>

              <span>Total</span>
            </div>

            <div style={styles.statCard}>
              <strong>
                {
                  curriculos.filter(
                    (i) =>
                      i.status ===
                      'Em análise'
                  ).length
                }
              </strong>

              <span>Em análise</span>
            </div>

            <div style={styles.statCard}>
              <strong>
                {
                  curriculos.filter(
                    (i) =>
                      i.status ===
                      'Aprovado'
                  ).length
                }
              </strong>

              <span>Aprovados</span>
            </div>
          </div>
        </div>

        <section style={styles.filters}>
          <input
            type="text"
            placeholder="Pesquisar candidato, vaga ou habilidade"
            value={pesquisa}
            onChange={(e) =>
              setPesquisa(e.target.value)
            }
            style={styles.input}
          />

          <select
            value={filtroStatus}
            onChange={(e) =>
              setFiltroStatus(e.target.value)
            }
            style={styles.select}
          >
            <option>Todos</option>
            <option>Em análise</option>
            <option>Entrevista</option>
            <option>Aprovado</option>
            <option>Banco de talentos</option>
          </select>
        </section>

        <section style={styles.grid}>
          {filtrados.length === 0 ? (
            <div style={styles.empty}>
              Nenhum currículo encontrado.
            </div>
          ) : (
            filtrados.map((item) => {
              const compatibilidade =
                calcularCompatibilidade(
                  item
                )

              return (
                <article
                  key={item.id}
                  style={styles.card}
                >
                  <div style={styles.top}>
                    <div>
                      <h2 style={styles.name}>
                        {item.nome}
                      </h2>

                      <p style={styles.email}>
                        {item.email}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.compatibilidade,
                        background:
                          compatibilidade.cor
                      }}
                    >
                      {
                        compatibilidade.texto
                      }
                    </span>
                  </div>

                  <div style={styles.info}>
                    <p>
                      <strong>Vaga:</strong>{' '}
                      {item.vaga}
                    </p>

                    <p>
                      <strong>Status:</strong>{' '}
                      {item.status}
                    </p>

                    <p>
                      <strong>Telefone:</strong>{' '}
                      {item.telefone}
                    </p>
                  </div>

                  {item.habilidades && (
                    <div style={styles.skills}>
                      {item.habilidades
                        .split(',')
                        .map((skill, index) => (
                          <span
                            key={index}
                            style={styles.skill}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  <div style={styles.actions}>
                    {item.curriculo && (
                      <a
                        href={item.curriculo}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.download}
                      >
                        Abrir currículo
                      </a>
                    )}

                    <select
                      value={item.status}
                      onChange={(e) =>
                        alterarStatus(
                          item.id,
                          e.target.value
                        )
                      }
                      style={styles.status}
                    >
                      <option>
                        Em análise
                      </option>

                      <option>
                        Entrevista
                      </option>

                      <option>
                        Aprovado
                      </option>

                      <option>
                        Banco de talentos
                      </option>

                      <option>
                        Reprovado
                      </option>
                    </select>

                    <button
                      style={styles.delete}
                      onClick={() =>
                        remover(item.id)
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              )
            })
          )}
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
    maxWidth: '1400px',
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
    fontSize: '2.8rem',
    marginBottom: '10px'
  },

  subtitle: {
    color: '#64748b',
    maxWidth: '700px'
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
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '35px',
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
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    minWidth: '240px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(380px,1fr))',
    gap: '24px'
  },

  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '26px',
    boxShadow:
      '0 10px 30px rgba(0,0,0,0.06)',
    border: '1px solid #dbeafe'
  },

  top: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '22px',
    flexWrap: 'wrap'
  },

  name: {
    color: '#0B3D91',
    marginBottom: '6px'
  },

  email: {
    color: '#64748b'
  },

  compatibilidade: {
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '999px',
    fontWeight: '700',
    fontSize: '13px'
  },

  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '22px',
    color: '#334155'
  },

  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '24px'
  },

  skill: {
    background: '#dbeafe',
    color: '#0B3D91',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '700'
  },

  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },

  download: {
    background: '#0B3D91',
    color: '#fff',
    padding: '14px',
    textAlign: 'center',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700'
  },

  status: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1'
  },

  delete: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer'
  },

  empty: {
    background: '#fff',
    padding: '50px',
    borderRadius: '22px',
    textAlign: 'center',
    color: '#64748b'
  }
}

export default BancoCurriculosAdmin