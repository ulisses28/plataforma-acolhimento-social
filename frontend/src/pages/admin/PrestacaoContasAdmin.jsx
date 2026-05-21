import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarPublicacoesTransparencia,
  salvarPublicacaoTransparencia,
  atualizarPublicacaoTransparencia,
  excluirPublicacaoTransparencia,
  lerArquivoComoBase64
} from '../../services/transparenciaService'

import {
  listarIndicadoresFinanceiros,
  salvarIndicadorFinanceiro,
  excluirIndicadorFinanceiro
} from '../../services/indicadoresFinanceirosService'

function PrestacaoContasAdmin() {
  const formLimpo = {
    titulo: '',
    tipo: 'Relatório Mensal',
    ano: '2025',
    periodo: '',
    resumo: '',
    descricao: '',
    arquivoNome: '',
    arquivoBase64: '',
    imagemCapa: '',
    status: 'Publicado'
  }

  const [publicacoes, setPublicacoes] = useState([])
  const [form, setForm] = useState(formLimpo)
  const [editandoId, setEditandoId] = useState(null)

  const [indicadores, setIndicadores] = useState([])

  const [indicadorForm, setIndicadorForm] = useState({
    ano: '2025',
    mes: '01',
    receitaBruta: '',
    despesas: '',
    ativoTotal: '',
    passivoTotal: '',
    arrecadado: '',
    aplicado: '',
    categoria: 'Alimentação'
  })

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    setPublicacoes(listarPublicacoesTransparencia())
    setIndicadores(listarIndicadoresFinanceiros())
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  async function selecionarPdf(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    if (arquivo.type !== 'application/pdf') {
      alert('Envie apenas arquivos PDF.')
      return
    }

    try {
      const base64 = await lerArquivoComoBase64(arquivo)

      setForm((atual) => ({
        ...atual,
        arquivoNome: arquivo.name,
        arquivoBase64: base64
      }))
    } catch (erro) {
      console.error(erro)
      alert('Erro ao carregar PDF.')
    }
  }

  function publicar(e) {
    e.preventDefault()

    if (!form.titulo.trim()) {
      alert('Informe o título.')
      return
    }

    if (!form.resumo.trim()) {
      alert('Informe o resumo.')
      return
    }

    if (editandoId) {
      atualizarPublicacaoTransparencia({
        ...form,
        id: editandoId
      })

      setEditandoId(null)
    } else {
      salvarPublicacaoTransparencia(form)
    }

    setForm(formLimpo)

    carregar()

    alert('Publicação salva com sucesso.')
  }

  function editar(item) {
    setForm({
      ...formLimpo,
      ...item
    })

    setEditandoId(item.id)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function remover(id) {
    const confirmar = confirm(
      'Deseja remover esta publicação?'
    )

    if (!confirmar) return

    excluirPublicacaoTransparencia(id)

    carregar()
  }

  function baixarDocumento(item) {
    if (!item.arquivoBase64) {
      alert('Este documento não possui PDF.')
      return
    }

    const link = document.createElement('a')

    link.href = item.arquivoBase64
    link.download =
      item.arquivoNome || 'documento.pdf'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
  }

  function alterarIndicador(campo, valor) {
    setIndicadorForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  function salvarIndicador(e) {
    e.preventDefault()

    salvarIndicadorFinanceiro(indicadorForm)

    setIndicadorForm({
      ano: '2025',
      mes: '01',
      receitaBruta: '',
      despesas: '',
      ativoTotal: '',
      passivoTotal: '',
      arrecadado: '',
      aplicado: '',
      categoria: 'Alimentação'
    })

    carregar()

    alert('Indicador salvo com sucesso.')
  }

  function removerIndicador(id) {
    const confirmar = confirm(
      'Deseja remover este indicador?'
    )

    if (!confirmar) return

    excluirIndicadorFinanceiro(id)

    carregar()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>
            Prestação de Contas
          </h1>

          <p style={styles.subtitle}>
            Cadastre documentos, relatórios
            financeiros e indicadores públicos.
          </p>
        </header>

        <section style={styles.grid}>
          <form
            onSubmit={publicar}
            style={styles.card}
          >
            <h2 style={styles.sectionTitle}>
              {editandoId
                ? 'Editar publicação'
                : 'Nova publicação'}
            </h2>

            <label style={styles.label}>
              Título da publicação
            </label>

            <input
              style={styles.input}
              value={form.titulo}
              onChange={(e) =>
                alterarCampo(
                  'titulo',
                  e.target.value
                )
              }
              placeholder="Ex: Prestação de Contas 2025"
            />

            <label style={styles.label}>
              Tipo de documento
            </label>

            <select
              style={styles.input}
              value={form.tipo}
              onChange={(e) =>
                alterarCampo(
                  'tipo',
                  e.target.value
                )
              }
            >
              <option>
                Relatório Mensal
              </option>

              <option>
                Balanço Patrimonial
              </option>

              <option>Balancete</option>

              <option>
                Demonstração de Superávit/Déficit
              </option>

              <option>
                Notícia institucional
              </option>

              <option>Outros</option>
            </select>

            <div style={styles.twoColumns}>
              <div>
                <label style={styles.label}>
                  Ano
                </label>

                <input
                  style={styles.input}
                  value={form.ano}
                  onChange={(e) =>
                    alterarCampo(
                      'ano',
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label style={styles.label}>
                  Período
                </label>

                <input
                  style={styles.input}
                  value={form.periodo}
                  onChange={(e) =>
                    alterarCampo(
                      'periodo',
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <label style={styles.label}>
              Resumo público
            </label>

            <textarea
              style={styles.textarea}
              value={form.resumo}
              onChange={(e) =>
                alterarCampo(
                  'resumo',
                  e.target.value
                )
              }
              placeholder="Texto curto para aparecer na página pública."
            />

            <label style={styles.label}>
              Descrição detalhada
            </label>

            <textarea
              style={styles.textarea}
              value={form.descricao}
              onChange={(e) =>
                alterarCampo(
                  'descricao',
                  e.target.value
                )
              }
            />

            <label style={styles.label}>
              Anexar PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              style={styles.input}
              onChange={selecionarPdf}
            />

            {form.arquivoNome && (
              <p style={styles.fileName}>
                PDF selecionado:{' '}
                {form.arquivoNome}
              </p>
            )}

            <label style={styles.label}>
              Status
            </label>

            <select
              style={styles.input}
              value={form.status}
              onChange={(e) =>
                alterarCampo(
                  'status',
                  e.target.value
                )
              }
            >
              <option>Publicado</option>

              <option>Rascunho</option>
            </select>

            <div style={styles.actions}>
              <button
                type="submit"
                style={styles.button}
              >
                {editandoId
                  ? 'Atualizar publicação'
                  : 'Publicar'}
              </button>

              {editandoId && (
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setForm(formLimpo)
                    setEditandoId(null)
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Indicadores Financeiros
            </h2>

            <p style={styles.helper}>
              Estes dados alimentam os gráficos
              da transparência pública.
            </p>

            <form onSubmit={salvarIndicador}>
              <div style={styles.twoColumns}>
                <div>
                  <label style={styles.label}>
                    Ano
                  </label>

                  <input
                    style={styles.input}
                    value={indicadorForm.ano}
                    onChange={(e) =>
                      alterarIndicador(
                        'ano',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Mês
                  </label>

                  <select
                    style={styles.input}
                    value={indicadorForm.mes}
                    onChange={(e) =>
                      alterarIndicador(
                        'mes',
                        e.target.value
                      )
                    }
                  >
                    <option value="01">
                      Janeiro
                    </option>

                    <option value="02">
                      Fevereiro
                    </option>

                    <option value="03">
                      Março
                    </option>

                    <option value="04">
                      Abril
                    </option>

                    <option value="05">
                      Maio
                    </option>

                    <option value="06">
                      Junho
                    </option>

                    <option value="07">
                      Julho
                    </option>

                    <option value="08">
                      Agosto
                    </option>

                    <option value="09">
                      Setembro
                    </option>

                    <option value="10">
                      Outubro
                    </option>

                    <option value="11">
                      Novembro
                    </option>

                    <option value="12">
                      Dezembro
                    </option>
                  </select>
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div>
                  <label style={styles.label}>
                    Receita bruta
                  </label>

                  <input
                    style={styles.input}
                    value={
                      indicadorForm.receitaBruta
                    }
                    onChange={(e) =>
                      alterarIndicador(
                        'receitaBruta',
                        e.target.value
                      )
                    }
                    placeholder="R$ 0,00"
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Despesas
                  </label>

                  <input
                    style={styles.input}
                    value={
                      indicadorForm.despesas
                    }
                    onChange={(e) =>
                      alterarIndicador(
                        'despesas',
                        e.target.value
                      )
                    }
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div>
                  <label style={styles.label}>
                    Ativo total
                  </label>

                  <input
                    style={styles.input}
                    value={
                      indicadorForm.ativoTotal
                    }
                    onChange={(e) =>
                      alterarIndicador(
                        'ativoTotal',
                        e.target.value
                      )
                    }
                    placeholder="R$ 0,00"
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Passivo total
                  </label>

                  <input
                    style={styles.input}
                    value={
                      indicadorForm.passivoTotal
                    }
                    onChange={(e) =>
                      alterarIndicador(
                        'passivoTotal',
                        e.target.value
                      )
                    }
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div>
                  <label style={styles.label}>
                    Total arrecadado
                  </label>

                  <input
                    style={styles.input}
                    value={
                      indicadorForm.arrecadado
                    }
                    onChange={(e) =>
                      alterarIndicador(
                        'arrecadado',
                        e.target.value
                      )
                    }
                    placeholder="R$ 0,00"
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Total aplicado
                  </label>

                  <input
                    style={styles.input}
                    value={
                      indicadorForm.aplicado
                    }
                    onChange={(e) =>
                      alterarIndicador(
                        'aplicado',
                        e.target.value
                      )
                    }
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <label style={styles.label}>
                Categoria
              </label>

              <select
                style={styles.input}
                value={indicadorForm.categoria}
                onChange={(e) =>
                  alterarIndicador(
                    'categoria',
                    e.target.value
                  )
                }
              >
                <option>Alimentação</option>
                <option>Educação</option>
                <option>Saúde</option>
                <option>Higiene</option>
                <option>Manutenção</option>
                <option>
                  Recursos humanos
                </option>
                <option>Outros</option>
              </select>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  marginTop: '18px'
                }}
              >
                Salvar indicador
              </button>
            </form>

            <div style={{ marginTop: '30px' }}>
              <h3 style={styles.smallTitle}>
                Indicadores cadastrados
              </h3>

              {indicadores.length === 0 ? (
                <p style={styles.helper}>
                  Nenhum indicador cadastrado.
                </p>
              ) : (
                indicadores.map((item) => (
                  <div
                    key={item.id}
                    style={styles.publicationItem}
                  >
                    <p style={styles.itemText}>
                      <strong>
                        {item.mes}/{item.ano}
                      </strong>{' '}
                      • {item.categoria}
                    </p>

                    <p style={styles.itemText}>
                      Receita:{' '}
                      {item.receitaBruta}
                    </p>

                    <p style={styles.itemText}>
                      Despesas:{' '}
                      {item.despesas}
                    </p>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        removerIndicador(item.id)
                      }
                    >
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Publicações cadastradas
            </h2>

            {publicacoes.length === 0 ? (
              <p style={styles.helper}>
                Nenhuma publicação cadastrada.
              </p>
            ) : (
              publicacoes.map((item) => (
                <article
                  key={item.id}
                  style={styles.publicationItem}
                >
                  <span style={styles.status}>
                    {item.status}
                  </span>

                  <h3 style={styles.itemTitle}>
                    {item.titulo}
                  </h3>

                  <p style={styles.itemText}>
                    {item.tipo} • {item.ano}
                  </p>

                  <p style={styles.itemText}>
                    {item.resumo}
                  </p>

                  {item.arquivoNome && (
                    <p style={styles.fileName}>
                      PDF:{' '}
                      {item.arquivoNome}
                    </p>
                  )}

                  <div style={styles.actions}>
                    <button
                      style={styles.editButton}
                      onClick={() =>
                        editar(item)
                      }
                    >
                      ✏️ Editar
                    </button>

                    <button
                      style={
                        styles.downloadButton
                      }
                      onClick={() =>
                        baixarDocumento(item)
                      }
                    >
                      ⬇ Baixar PDF
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        remover(item.id)
                      }
                    >
                      🗑 Remover
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
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
    maxWidth: '1200px',
    margin: '0 auto'
  },

  header: {
    marginBottom: '25px'
  },

  title: {
    color: '#0B3D91',
    margin: 0,
    fontSize: '2.4rem'
  },

  subtitle: {
    color: '#475569',
    lineHeight: '1.6'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px'
  },

  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  smallTitle: {
    color: '#0B3D91'
  },

  label: {
    display: 'block',
    marginTop: '14px',
    marginBottom: '6px',
    color: '#334155',
    fontWeight: '800'
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

  textarea: {
    width: '100%',
    minHeight: '90px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box'
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px'
  },

  helper: {
    color: '#64748b',
    lineHeight: '1.5'
  },

  button: {
    background: '#0B3D91',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  cancelButton: {
    background: '#64748b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  publicationItem: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px'
  },

  status: {
    background: '#ffc928',
    color: '#002855',
    padding: '5px 10px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },

  itemTitle: {
    color: '#0B3D91',
    marginBottom: '6px'
  },

  itemText: {
    color: '#475569',
    lineHeight: '1.5'
  },

  fileName: {
    color: '#0B3D91',
    fontWeight: '800'
  },

  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
    flexWrap: 'wrap'
  },

  editButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: '700'
  },

  downloadButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: '700'
  },

  deleteButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: '700'
  }
}

export default PrestacaoContasAdmin