import React, { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import {
  listarNoticias,
  salvarNoticia,
  atualizarNoticia,
  excluirNoticia,
  lerMidiaComoBase64
} from '../../services/noticiasService'

function NoticiasAdmin() {
  const [noticias, setNoticias] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const [form, setForm] = useState({
    titulo: '',
    categoria: 'Notícia institucional',
    resumo: '',
    conteudo: '',
    midia: '',
    tipoMidia: '',
    status: 'Publicado'
  })

  useEffect(() => {
    carregarNoticias()
  }, [])

  function carregarNoticias() {
    setNoticias(listarNoticias())
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  async function selecionarMidia(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    const base64 = await lerMidiaComoBase64(arquivo)

    alterarCampo('midia', base64)
    alterarCampo('tipoMidia', arquivo.type)
  }

  function limparFormulario() {
    setForm({
      titulo: '',
      categoria: 'Notícia institucional',
      resumo: '',
      conteudo: '',
      midia: '',
      tipoMidia: '',
      status: 'Publicado'
    })

    setEditandoId(null)
    setMostrarFormulario(false)
  }

  function salvar(e) {
    e.preventDefault()

    if (!form.titulo.trim()) {
      alert('Informe o título da notícia.')
      return
    }

    if (!form.resumo.trim()) {
      alert('Informe um resumo para a notícia.')
      return
    }

    if (!form.conteudo.trim()) {
      alert('Informe o conteúdo da notícia.')
      return
    }

    if (editandoId) {
      atualizarNoticia({
        ...form,
        id: editandoId
      })

      alert('Notícia atualizada com sucesso!')
    } else {
      salvarNoticia(form)
      alert('Notícia publicada com sucesso!')
    }

    limparFormulario()
    carregarNoticias()
  }

  function editar(item) {
    setForm(item)
    setEditandoId(item.id)
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function remover(id) {
    const confirmar = confirm('Deseja remover esta notícia?')
    if (!confirmar) return

    excluirNoticia(id)
    carregarNoticias()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Publicar Notícias</h1>
            <p style={styles.subtitle}>
              Cadastre notícias, avisos, histórias de vida, fotos ou vídeos para
              exibição na área pública do site.
            </p>
          </div>

          <button
            type="button"
            style={styles.addButton}
            onClick={() => {
              limparFormulario()
              setMostrarFormulario(true)
            }}
          >
            + Nova publicação
          </button>
        </header>

        {mostrarFormulario && (
          <form style={styles.formCard} onSubmit={salvar}>
            <h2 style={styles.sectionTitle}>
              {editandoId ? 'Editar notícia' : 'Nova notícia'}
            </h2>

            <label style={styles.label}>Título</label>
            <input
              style={styles.input}
              value={form.titulo}
              onChange={(e) => alterarCampo('titulo', e.target.value)}
              placeholder="Ex: Ações que acolhem"
            />

            <label style={styles.label}>Categoria</label>
            <select
              style={styles.input}
              value={form.categoria}
              onChange={(e) => alterarCampo('categoria', e.target.value)}
            >
              <option>Notícia institucional</option>
              <option>Aviso importante</option>
              <option>História de vida</option>
              <option>Projeto social</option>
              <option>Prestação de contas</option>
              <option>Evento</option>
            </select>

            <label style={styles.label}>Resumo</label>
            <textarea
              style={styles.textarea}
              value={form.resumo}
              onChange={(e) => alterarCampo('resumo', e.target.value)}
              placeholder="Texto curto que aparecerá no card da Home."
            />

            <label style={styles.label}>Matéria / Conteúdo</label>
            <textarea
              style={styles.textareaLarge}
              value={form.conteudo}
              onChange={(e) => alterarCampo('conteudo', e.target.value)}
              placeholder="Digite aqui a matéria, aviso ou história de vida."
            />

            <label style={styles.label}>Foto ou vídeo</label>
            <input
              style={styles.input}
              type="file"
              accept="image/*,video/*"
              onChange={selecionarMidia}
            />

            {form.midia && (
              <div style={styles.previewBox}>
                {form.tipoMidia?.startsWith('video') ? (
                  <video src={form.midia} controls style={styles.previewMedia} />
                ) : (
                  <img src={form.midia} alt="Prévia" style={styles.previewMedia} />
                )}
              </div>
            )}

            <label style={styles.label}>Status</label>
            <select
              style={styles.input}
              value={form.status}
              onChange={(e) => alterarCampo('status', e.target.value)}
            >
              <option>Publicado</option>
              <option>Rascunho</option>
            </select>

            <div style={styles.actions}>
              <button type="submit" style={styles.saveButton}>
                {editandoId ? 'Atualizar notícia' : 'Publicar notícia'}
              </button>

              <button type="button" style={styles.cancelButton} onClick={limparFormulario}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <section style={styles.listCard}>
          <h2 style={styles.sectionTitle}>Notícias cadastradas</h2>

          {noticias.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma notícia cadastrada ainda.</p>
          ) : (
            <div style={styles.newsGrid}>
              {noticias.map((item) => (
                <article key={item.id} style={styles.newsCard}>
                  {item.midia && (
                    item.tipoMidia?.startsWith('video') ? (
                      <video src={item.midia} controls style={styles.cardMedia} />
                    ) : (
                      <img src={item.midia} alt={item.titulo} style={styles.cardMedia} />
                    )
                  )}

                  <span style={styles.badge}>{item.status}</span>

                  <h3 style={styles.newsTitle}>{item.titulo}</h3>

                  <p style={styles.newsMeta}>
                    {item.categoria} • {item.criadoEm}
                  </p>

                  <p style={styles.newsText}>{item.resumo}</p>

                  <div style={styles.cardActions}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => editar(item)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => remover(item.id)}
                    >
                      🗑 Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
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
    maxWidth: '780px'
  },
  addButton: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 20px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  formCard: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  listCard: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
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
  textareaLarge: {
    width: '100%',
    minHeight: '150px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  previewBox: {
    marginTop: '14px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '14px'
  },
  previewMedia: {
    maxWidth: '100%',
    maxHeight: '320px',
    borderRadius: '14px',
    objectFit: 'cover'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  saveButton: {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  cancelButton: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  emptyText: {
    color: '#64748b'
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px'
  },
  newsCard: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px'
  },
  cardMedia: {
    width: '100%',
    height: '190px',
    objectFit: 'cover',
    borderRadius: '14px',
    marginBottom: '12px'
  },
  badge: {
    background: '#ffc928',
    color: '#002855',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },
  newsTitle: {
    color: '#0B3D91',
    marginBottom: '6px'
  },
  newsMeta: {
    color: '#64748b',
    fontSize: '14px'
  },
  newsText: {
    color: '#334155',
    lineHeight: '1.6'
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap'
  },
  editButton: {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  deleteButton: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  }
}

export default NoticiasAdmin