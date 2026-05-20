import React, { useEffect, useRef, useState } from 'react'
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

  const editorRef = useRef(null)

  const formInicial = {
    titulo: '',
    categoria: 'Notícia institucional',
    areaPublicacao: 'Últimas Notícias',
    resumo: '',
    conteudo: '',
    midias: [],
    youtubeUrl: '',
    status: 'Publicado'
  }

  const [form, setForm] = useState(formInicial)

  useEffect(() => {
    carregarNoticias()
  }, [])

  useEffect(() => {
    if (mostrarFormulario && editorRef.current) {
      editorRef.current.innerHTML = form.conteudo || ''
    }
  }, [mostrarFormulario, editandoId])

  function carregarNoticias() {
    setNoticias(listarNoticias())
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function selecionarMidias(e) {
  const arquivos = Array.from(e.target.files || [])
  if (arquivos.length === 0) return

  const LIMITE_VIDEO = 20 * 1024 * 1024

  for (const arquivo of arquivos) {
    if (arquivo.type.startsWith('video') && arquivo.size > LIMITE_VIDEO) {
      alert(
        'Vídeo muito grande. Envie vídeos de até 20MB ou use o campo de link do YouTube.'
      )

      e.target.value = ''
      return
    }
  }

  const midiasConvertidas = await Promise.all(
    arquivos.map(async (arquivo) => ({
      nome: arquivo.name,
      tipo: arquivo.type,
      base64: await lerMidiaComoBase64(arquivo)
    }))
  )

  alterarCampo('midias', [...form.midias, ...midiasConvertidas])
}

  function removerMidia(index) {
    alterarCampo(
      'midias',
      form.midias.filter((_, i) => i !== index)
    )
  }

  function limparFormulario() {
    setForm(formInicial)
    setEditandoId(null)
    setMostrarFormulario(false)

    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
  }

  function salvar(e) {
    e.preventDefault()

    if (!form.titulo.trim()) return alert('Informe o título.')
    if (!form.resumo.trim()) return alert('Informe o resumo.')
    if (!form.conteudo.trim()) return alert('Informe o conteúdo.')

    const dados = {
      ...form,
      youtubeUrl: form.youtubeUrl || '',
      midia: form.midias?.[0]?.base64 || '',
      tipoMidia: form.midias?.[0]?.tipo || ''
    }

    if (editandoId) {
      atualizarNoticia({ ...dados, id: editandoId })
      alert('Publicação atualizada com sucesso!')
    } else {
      salvarNoticia(dados)
      alert('Publicação cadastrada com sucesso!')
    }

    limparFormulario()
    carregarNoticias()
  }

  function editar(item) {
    setForm({
      titulo: item.titulo || '',
      categoria: item.categoria || 'Notícia institucional',
      areaPublicacao: item.areaPublicacao || 'Últimas Notícias',
      resumo: item.resumo || '',
      conteudo: item.conteudo || '',
      midias: item.midias || (item.midia ? [{ base64: item.midia, tipo: item.tipoMidia }] : []),
      youtubeUrl: item.youtubeUrl || '',
      status: item.status || 'Publicado'
    })

    setEditandoId(item.id)
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function remover(id) {
    if (!confirm('Deseja remover esta publicação?')) return
    excluirNoticia(id)
    carregarNoticias()
  }

  function aplicarComando(comando) {
    document.execCommand(comando, false, null)
    atualizarConteudoEditor()
  }

  function aplicarCor(cor) {
    document.execCommand('foreColor', false, cor)
    atualizarConteudoEditor()
  }

  function aplicarTitulo() {
    document.execCommand('formatBlock', false, 'h2')
    atualizarConteudoEditor()
  }

  function aplicarTamanho(tamanho) {
    document.execCommand('fontSize', false, tamanho)
    atualizarConteudoEditor()
  }

  function aplicarListaNumerada() {
    document.execCommand('insertOrderedList', false, null)
    atualizarConteudoEditor()
  }

  function limparFormatacao() {
    document.execCommand('removeFormat', false, null)
    atualizarConteudoEditor()
  }

  function atualizarConteudoEditor() {
    if (editorRef.current) {
      alterarCampo('conteudo', editorRef.current.innerHTML)
    }
  }

  function converterYoutubeEmbed(url) {
    if (!url) return ''

    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/')
    }

    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }

    if (url.includes('/shorts/')) {
      const id = url.split('/shorts/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }

    return url
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Publicar Notícias</h1>
            <p style={styles.subtitle}>
              Cadastre notícias, mensagens do dia, histórias de vida, avisos,
              fotos, vídeos e links do YouTube para exibição no site.
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
              {editandoId ? 'Editar publicação' : 'Nova publicação'}
            </h2>

            <label style={styles.label}>Título</label>
            <input
              style={styles.input}
              value={form.titulo}
              onChange={(e) => alterarCampo('titulo', e.target.value)}
              placeholder="Ex: Voluntariado que transforma"
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
              <option>Vagas</option>
            </select>

            <label style={styles.label}>Onde publicar?</label>
            <select
              style={styles.input}
              value={form.areaPublicacao}
              onChange={(e) => alterarCampo('areaPublicacao', e.target.value)}
            >
              <option>Últimas Notícias</option>
              <option>Mensagem do Dia</option>
              <option>Ambos</option>
            </select>

            <label style={styles.label}>Resumo</label>
            <textarea
              style={styles.textarea}
              value={form.resumo}
              onChange={(e) => alterarCampo('resumo', e.target.value)}
              placeholder="Texto curto que aparecerá na Home."
            />

            <label style={styles.label}>Matéria / Conteúdo</label>

            <div style={styles.editorBox}>
              <div style={styles.toolbar}>
                <select
                  style={styles.toolSelect}
                  onChange={(e) => aplicarTamanho(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Tamanho
                  </option>
                  <option value="2">Pequena</option>
                  <option value="3">Normal</option>
                  <option value="4">Média</option>
                  <option value="5">Grande</option>
                  <option value="6">Título</option>
                  <option value="7">Título grande</option>
                </select>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('bold')}>
                  B
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('italic')}>
                  I
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('underline')}>
                  U
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('strikeThrough')}>
                  S
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('insertUnorderedList')}>
                  • Lista
                </button>

                <button type="button" style={styles.toolButton} onClick={aplicarListaNumerada}>
                  1. Lista
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('justifyLeft')}>
                  ←
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('justifyCenter')}>
                  ↔
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('justifyRight')}>
                  →
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarCor('#0B3D91')}>
                  Azul
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarCor('#dc2626')}>
                  Vermelho
                </button>

                <button type="button" style={styles.toolButton} onClick={() => aplicarCor('#16a34a')}>
                  Verde
                </button>

                <button type="button" style={styles.toolButton} onClick={aplicarTitulo}>
                  Título
                </button>

                <button type="button" style={styles.toolButton} onClick={limparFormatacao}>
                  Limpar
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                style={styles.editor}
                onInput={atualizarConteudoEditor}
              />
            </div>

            <label style={styles.label}>Link do YouTube (opcional)</label>
            <input
              style={styles.input}
              type="text"
              value={form.youtubeUrl}
              onChange={(e) => alterarCampo('youtubeUrl', e.target.value)}
              placeholder="Cole aqui o link do YouTube, Shorts ou embed"
            />

            {form.youtubeUrl && (
              <div style={styles.youtubePreview}>
                <iframe
                  src={converterYoutubeEmbed(form.youtubeUrl)}
                  title="Prévia YouTube"
                  style={styles.youtubeIframe}
                  allowFullScreen
                />
              </div>
            )}

            <label style={styles.label}>Fotos ou vídeos</label>
            <input
              style={styles.input}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={selecionarMidias}
            />

            <p style={styles.helperText}>
              Para vídeos grandes, prefira usar o campo de link do YouTube. O navegador pode não salvar vídeos grandes no localStorage.
            </p>

            {form.midias.length > 0 && (
              <div style={styles.previewGrid}>
                {form.midias.map((midia, index) => (
                  <div key={index} style={styles.previewItem}>
                    {midia.tipo?.startsWith('video') ? (
                      <video src={midia.base64} controls style={styles.previewMedia} />
                    ) : (
                      <img src={midia.base64} alt="Prévia" style={styles.previewMedia} />
                    )}

                    <button
                      type="button"
                      style={styles.removeMediaButton}
                      onClick={() => removerMidia(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
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
                {editandoId ? 'Atualizar publicação' : 'Publicar'}
              </button>

              <button type="button" style={styles.cancelButton} onClick={limparFormulario}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <section style={styles.listCard}>
          <h2 style={styles.sectionTitle}>Publicações cadastradas</h2>

          {noticias.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma publicação cadastrada ainda.</p>
          ) : (
            <div style={styles.newsGrid}>
              {noticias.map((item) => (
                <article key={item.id} style={styles.newsCard}>
                  {item.youtubeUrl ? (
                    <iframe
                      src={converterYoutubeEmbed(item.youtubeUrl)}
                      title={item.titulo}
                      style={styles.cardMedia}
                      allowFullScreen
                    />
                  ) : item.midia ? (
                    item.tipoMidia?.startsWith('video') ? (
                      <video src={item.midia} controls style={styles.cardMedia} />
                    ) : (
                      <img src={item.midia} alt={item.titulo} style={styles.cardMedia} />
                    )
                  ) : null}

                  <span style={styles.badge}>{item.status}</span>

                  <h3 style={styles.newsTitle}>{item.titulo}</h3>

                  <p style={styles.newsMeta}>
                    {item.categoria} • {item.areaPublicacao || 'Últimas Notícias'} • {item.criadoEm}
                  </p>

                  <p style={styles.newsText}>{item.resumo}</p>

                  {item.categoria === 'Vagas' && (
                    <div style={styles.vagasBox}>
                      <strong style={styles.vagasTitle}>
                        📄 Envie seu currículo para esta oportunidade
                      </strong>

                      <p style={styles.vagasText}>
                        Clique abaixo para acessar o formulário de candidatura,
                        anexar currículo e participar do processo seletivo.
                      </p>

                      <a href="/vagas" style={styles.vagasLink}>
                        Enviar currículo →
                      </a>
                    </div>
                  )}

                  <div style={styles.cardActions}>
                    <button type="button" style={styles.editButton} onClick={() => editar(item)}>
                      ✏️ Editar
                    </button>

                    <button type="button" style={styles.deleteButton} onClick={() => remover(item.id)}>
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
    background: '#fff',
    borderRadius: '22px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },

  listCard: {
    background: '#fff',
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

  editorBox: {
    border: '1px solid #bfdbfe',
    borderRadius: '14px',
    overflow: 'hidden',
    background: '#fff'
  },

  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '10px',
    borderBottom: '1px solid #dbeafe',
    background: '#eef6ff'
  },

  toolButton: {
    border: '1px solid #bfdbfe',
    background: '#fff',
    color: '#0B3D91',
    borderRadius: '6px',
    padding: '6px 10px',
    fontWeight: '800',
    cursor: 'pointer',
    minWidth: '42px'
  },

  toolSelect: {
    border: '1px solid #bfdbfe',
    background: '#fff',
    color: '#0B3D91',
    borderRadius: '6px',
    padding: '6px 10px',
    fontWeight: '800',
    cursor: 'pointer',
    minWidth: '120px'
  },

  editor: {
    minHeight: '260px',
    padding: '18px',
    outline: 'none',
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#1e293b'
  },

  youtubePreview: {
    marginTop: '12px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '12px'
  },

  youtubeIframe: {
    width: '100%',
    height: '320px',
    border: 'none',
    borderRadius: '12px'
  },

  helperText: {
    color: '#64748b',
    fontSize: '13px',
    marginTop: '8px'
  },

  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginTop: '14px'
  },

  previewItem: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '10px'
  },

  previewMedia: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '12px'
  },

  removeMediaButton: {
    marginTop: '8px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 10px',
    cursor: 'pointer',
    fontWeight: '800'
  },

  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },

  saveButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  cancelButton: {
    background: '#dc2626',
    color: '#fff',
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
    border: 'none',
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

  vagasBox: {
    background: '#eef6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '14px',
    padding: '14px',
    marginTop: '14px'
  },

  vagasTitle: {
    display: 'block',
    color: '#0B3D91',
    marginBottom: '8px',
    fontSize: '15px'
  },

  vagasText: {
    color: '#475569',
    lineHeight: '1.5',
    marginBottom: '12px'
  },

  vagasLink: {
    display: 'inline-block',
    background: '#0B3D91',
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: '900'
  },

  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap'
  },

  editButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  deleteButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  }
}

export default NoticiasAdmin