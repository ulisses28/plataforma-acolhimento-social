import React, { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import {
  listarPublicacoesTransparencia,
  salvarPublicacaoTransparencia,
  excluirPublicacaoTransparencia,
  atualizarPublicacaoTransparencia,
  lerArquivoComoBase64
} from '../../services/transparenciaService'

function PrestacaoContasAdmin() {
  const [publicacoes, setPublicacoes] = useState([])

  const [form, setForm] = useState({
    titulo: '',
    tipo: 'Relatório Mensal',
    ano: '2025',
    periodo: '',
    resumo: '',
    descricao: '',
    valorArrecadado: '',
    valorAplicado: '',
    categoriaAplicacao: 'Alimentação',
    arquivoNome: '',
    imagemCapa: '',
    graficosPublicos: [],
    status: 'Publicado'
  })
  const [editandoId, setEditandoId] = useState(null)
  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    setPublicacoes(listarPublicacoesTransparencia())
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  function alternarGrafico(grafico) {
    setForm((atual) => {
      const existe = atual.graficosPublicos.includes(grafico)

      return {
        ...atual,
        graficosPublicos: existe
          ? atual.graficosPublicos.filter((item) => item !== grafico)
          : [...atual.graficosPublicos, grafico]
      }
    })
  }

  function publicar(e) {
    e.preventDefault()

    if (!form.titulo.trim()) {
      alert('Informe o título da publicação.')
      return
    }

    if (!form.resumo.trim()) {
      alert('Informe um resumo público.')
      return
    }

    if (editandoId) {
      atualizarPublicacaoTransparencia({ ...form, id: editandoId })
      setEditandoId(null)
    } else {
      salvarPublicacaoTransparencia(form)
    }

    setForm({
      titulo: '',
      tipo: 'Relatório Mensal',
      ano: '2025',
      periodo: '',
      resumo: '',
      descricao: '',
      valorArrecadado: '',
      valorAplicado: '',
      categoriaAplicacao: 'Alimentação',
      arquivoNome: '',
      imagemCapa: '',
      graficosPublicos: [],
      status: 'Publicado'
    })

    carregar()
    alert('Publicação salva na transparência pública.')
  }

  function remover(id) {
    const confirmar = confirm('Deseja remover esta publicação?')

    if (!confirmar) return

    excluirPublicacaoTransparencia(id)
    carregar()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Prestação de Contas</h1>
          <p style={styles.subtitle}>
            Cadastre documentos, notícias, relatórios e selecione os gráficos que
            serão exibidos na página pública de transparência.
          </p>
        </header>

        <section style={styles.grid}>
          <form onSubmit={publicar} style={styles.card}>
            <h2 style={styles.sectionTitle}>Nova publicação</h2>

            <label style={styles.label}>Título da publicação</label>
            <input
              style={styles.input}
              value={form.titulo}
              onChange={(e) => alterarCampo('titulo', e.target.value)}
              placeholder="Ex: Prestação de Contas 2025"
            />

            <label style={styles.label}>Tipo de documento</label>
            <select
              style={styles.input}
              value={form.tipo}
              onChange={(e) => alterarCampo('tipo', e.target.value)}
            >
              <option>Relatório Mensal</option>
              <option>Balanço Patrimonial</option>
              <option>Balancete</option>
              <option>Demonstração de Superávit/Déficit</option>
              <option>Notícia institucional</option>
              <option>Outros</option>
            </select>

            <div style={styles.twoColumns}>
              <div>
                <label style={styles.label}>Ano</label>
                <input
                  style={styles.input}
                  value={form.ano}
                  onChange={(e) => alterarCampo('ano', e.target.value)}
                  placeholder="2025"
                />
              </div>

              <div>
                <label style={styles.label}>Período</label>
                <input
                  style={styles.input}
                  value={form.periodo}
                  onChange={(e) => alterarCampo('periodo', e.target.value)}
                  placeholder="01/01/2025 a 31/12/2025"
                />
              </div>
            </div>

            <label style={styles.label}>Resumo público</label>
            <textarea
              style={styles.textarea}
              value={form.resumo}
              onChange={(e) => alterarCampo('resumo', e.target.value)}
              placeholder="Texto curto que aparecerá na página pública."
            />

            <label style={styles.label}>Descrição detalhada</label>
            <textarea
              style={styles.textarea}
              value={form.descricao}
              onChange={(e) => alterarCampo('descricao', e.target.value)}
              placeholder="Explique o conteúdo do documento ou notícia."
            />

            <div style={styles.twoColumns}>
              <div>
                <label style={styles.label}>Valor arrecadado</label>
                <input
                  style={styles.input}
                  value={form.valorArrecadado}
                  onChange={(e) => alterarCampo('valorArrecadado', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <label style={styles.label}>Valor aplicado</label>
                <input
                  style={styles.input}
                  value={form.valorAplicado}
                  onChange={(e) => alterarCampo('valorAplicado', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <label style={styles.label}>Categoria de aplicação</label>
            <select
              style={styles.input}
              value={form.categoriaAplicacao}
              onChange={(e) => alterarCampo('categoriaAplicacao', e.target.value)}
            >
              <option>Alimentação</option>
              <option>Higiene</option>
              <option>Educação</option>
              <option>Manutenção</option>
              <option>Recursos humanos</option>
              <option>Patrimônio institucional</option>
              <option>Gestão institucional</option>
              <option>Outros</option>
            </select>

            <label style={styles.label}>Anexar PDF</label>
            <input
              type="file"
              accept=".pdf"
              style={styles.input}
              onChange={(e) =>
                alterarCampo('arquivoNome', e.target.files?.[0]?.name || '')
              }
            />

            <label style={styles.label}>Imagem de capa</label>
            <input
              type="file"
              accept="image/*"
              style={styles.input}
              onChange={(e) =>
                alterarCampo('imagemCapa', e.target.files?.[0]?.name || '')
              }
            />

            <section style={styles.graphBox}>
              <h3 style={styles.smallTitle}>Gráficos públicos</h3>
              <p style={styles.helper}>
                Selecione quais gráficos da Central de Gráficos poderão aparecer
                na página pública de transparência.
              </p>

              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.graficosPublicos.includes('doacoes-mensais')}
                  onChange={() => alternarGrafico('doacoes-mensais')}
                />
                Doações mensais
              </label>

              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.graficosPublicos.includes('receitas-despesas')}
                  onChange={() => alternarGrafico('receitas-despesas')}
                />
                Receitas x Despesas
              </label>

              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.graficosPublicos.includes('categorias')}
                  onChange={() => alternarGrafico('categorias')}
                />
                Aplicação por categoria
              </label>

              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.graficosPublicos.includes('patrimonio')}
                  onChange={() => alternarGrafico('patrimonio')}
                />
                Balanço patrimonial
              </label>

              <label style={styles.check}>
                <input
                  type="checkbox"
                  checked={form.graficosPublicos.includes('ranking-doadores')}
                  onChange={() => alternarGrafico('ranking-doadores')}
                />
                Ranking de doadores
              </label>
            </section>

            <label style={styles.label}>Status</label>
            <select
              style={styles.input}
              value={form.status}
              onChange={(e) => alterarCampo('status', e.target.value)}
            >
              <option>Publicado</option>
              <option>Rascunho</option>
            </select>

            <button type="submit" style={styles.button}>
              Publicar na Transparência
            </button>
          </form>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Publicações cadastradas</h2>

            {publicacoes.length === 0 ? (
              <p style={styles.helper}>Nenhuma publicação cadastrada.</p>
            ) : (
              publicacoes.map((item) => (
                <article key={item.id} style={styles.publicationItem}>
                  <span style={styles.status}>{item.status}</span>

                  <h3 style={styles.itemTitle}>{item.titulo}</h3>

                  <p style={styles.itemText}>
                    {item.tipo} • {item.ano} • {item.periodo || 'Sem período'}
                  </p>

                  <p style={styles.itemText}>{item.resumo}</p>

                  {item.arquivoNome && (
                    <p style={styles.fileName}>PDF: {item.arquivoNome}</p>
                  )}

                  <div style={styles.actions}>
                  <button
                    style={styles.editButton}
                    onClick={() => {
                      setForm(item)
                      setEditandoId(item.id)
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => remover(item.id)}
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
    gridTemplateColumns: '1.3fr 1fr',
    gap: '24px',
    alignItems: 'start'
  },

  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },

  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  smallTitle: {
    color: '#0B3D91',
    marginBottom: '8px'
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
    boxSizing: 'border-box',
    resize: 'vertical'
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px'
  },

  graphBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '16px',
    marginTop: '18px'
  },

  helper: {
    color: '#64748b',
    lineHeight: '1.5'
  },

  check: {
    display: 'block',
    marginTop: '10px',
    color: '#334155',
    fontWeight: '700'
  },

  button: {
    marginTop: '22px',
    background: '#0B3D91',
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

  // ✅ NOVOS BOTÕES PROFISSIONAIS
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px'
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