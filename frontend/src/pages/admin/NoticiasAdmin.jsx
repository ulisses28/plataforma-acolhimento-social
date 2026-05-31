import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { registrarAuditoriaFrontend } from '../../services/auditoriaFrontendService'
import { processarArquivos } from '../../services/uploadService'

import {
  listarNoticias,
  salvarNoticia,
  atualizarNoticia,
  excluirNoticia
} from '../../services/noticiasService'

function NoticiasAdmin() {
  const [noticias, setNoticias] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('Todos')

  const editorRef = useRef(null)

  const formInicial = {
    titulo: '',
    categoria: 'Notícia institucional',
    areaPublicacao: 'Últimas Notícias',
    resumo: '',
    conteudo: '',
    midias: [],
    youtubeUrl: '',
    status: 'Rascunho'
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

  async function carregarNoticias() {
    try {
      setCarregando(true)
      const dados = await listarNoticias()
      setNoticias(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
      setNoticias([])
    } finally {
      setCarregando(false)
    }
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  async function selecionarMidias(e) {
    try {
      const midiasConvertidas = await processarArquivos({
        arquivos: e.target.files,
        tiposPermitidos: ['image', 'video'],
        limiteImagemMB: 5,
        limiteVideoMB: 100,
        alertaVideoMB: 50
      })

      alterarCampo('midias', [
        ...form.midias,
        ...midiasConvertidas
      ])
    } catch (error) {
      alert(error.message)
    } finally {
      e.target.value = ''
    }
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

  async function salvar(e) {
    e.preventDefault()

    if (!form.titulo.trim()) return alert('Informe o título.')
    if (!form.resumo.trim()) return alert('Informe o resumo.')
    if (!form.conteudo.trim()) return alert('Informe o conteúdo.')

    const dados = {
      titulo: form.titulo,
      categoria: form.categoria,
      areaPublicacao: form.areaPublicacao,
      resumo: form.resumo,
      conteudo: form.conteudo,
      youtubeUrl: form.youtubeUrl || '',
      midias: form.midias || [],
      midia: form.midias?.[0]?.base64 || '',
      tipoMidia: form.midias?.[0]?.tipo || '',
      status: form.status
    }

    try {
      if (editandoId) {
        await atualizarNoticia({
          ...dados,
          _id: editandoId
        })

        registrarAuditoriaFrontend(
          'ATUALIZACAO_NOTICIA',
          dados.titulo
        )

        alert('Publicação atualizada com sucesso!')
      } else {
        await salvarNoticia(dados)

        registrarAuditoriaFrontend(
          'CRIACAO_NOTICIA',
          dados.titulo
        )

        alert('Publicação cadastrada com sucesso!')
      }

      limparFormulario()
      await carregarNoticias()
    } catch (error) {
      console.error('Erro ao salvar notícia:', error)
      alert('Erro ao salvar publicação. Verifique se o backend está rodando.')
    }
  }

  function editar(item) {
    setForm({
      titulo: item.titulo || '',
      categoria: item.categoria || 'Notícia institucional',
      areaPublicacao: item.areaPublicacao || 'Últimas Notícias',
      resumo: item.resumo || '',
      conteudo: item.conteudo || '',
      midias:
        item.midias ||
        (item.midia
          ? [{ base64: item.midia, tipo: item.tipoMidia }]
          : []),
      youtubeUrl: item.youtubeUrl || '',
      status: item.status || 'Rascunho'
    })

    setEditandoId(item._id || item.id)
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function remover(id) {
    if (!confirm('Deseja remover esta publicação?')) return

    try {
      await excluirNoticia(id)

      registrarAuditoriaFrontend(
        'EXCLUSAO_NOTICIA',
        `Publicação removida: ${id}`
      )

      await carregarNoticias()
    } catch (error) {
      console.error('Erro ao remover notícia:', error)
      alert('Erro ao remover publicação.')
    }
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

  function formatarData(item) {
    if (item.createdAt) {
      return new Date(item.createdAt).toLocaleDateString('pt-BR')
    }

    return item.criadoEm || 'Publicação'
  }

  async function alterarStatusPublicacao(item, novoStatus) {
    try {
      const id = item._id || item.id

      await atualizarNoticia({
        ...item,
        _id: id,
        status: novoStatus
      })

      registrarAuditoriaFrontend(
        'ALTERACAO_STATUS_NOTICIA',
        `${item.titulo} alterada para ${novoStatus}`
      )

      await carregarNoticias()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status da publicação.')
    }
  }

  function corStatus(status) {
    switch (status) {
      case 'Rascunho':
        return '#64748b'

      case 'Em Revisão':
        return '#f59e0b'

      case 'Publicado':
        return '#16a34a'

      case 'Arquivado':
        return '#dc2626'

      default:
        return '#64748b'
    }
  }

  const noticiasFiltradas =
    filtroStatus === 'Todos'
      ? noticias
      : noticias.filter((item) => item.status === filtroStatus)

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
              <option>Campanha</option>
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

                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('bold')}>B</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('italic')}>I</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('underline')}>U</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('strikeThrough')}>S</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('insertUnorderedList')}>• Lista</button>
                <button type="button" style={styles.toolButton} onClick={aplicarListaNumerada}>1. Lista</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('justifyLeft')}>←</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('justifyCenter')}>↔</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarComando('justifyRight')}>→</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarCor('#0B3D91')}>Azul</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarCor('#dc2626')}>Vermelho</button>
                <button type="button" style={styles.toolButton} onClick={() => aplicarCor('#16a34a')}>Verde</button>
                <button type="button" style={styles.toolButton} onClick={aplicarTitulo}>Título</button>
                <button type="button" style={styles.toolButton} onClick={limparFormatacao}>Limpar</button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck={true}
                style={styles.editor}
                onInput={atualizarConteudoEditor}
              />
            </div>

            <label style={styles.label}>Link do YouTube opcional</label>
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

                    {midia.tamanhoMB && (
                      <p style={styles.mediaSize}>
                        Tamanho: {midia.tamanhoMB} MB
                      </p>
                    )}
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
              <option>Rascunho</option>
              <option>Em Revisão</option>
              <option>Publicado</option>
              <option>Arquivado</option>
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

          <div style={styles.filterBox}>
            {['Todos', 'Rascunho', 'Em Revisão', 'Publicado', 'Arquivado'].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  style={
                    filtroStatus === status
                      ? styles.filterButtonActive
                      : styles.filterButton
                  }
                  onClick={() => setFiltroStatus(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {carregando ? (
            <p style={styles.emptyText}>Carregando publicações...</p>
          ) : noticiasFiltradas.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma publicação cadastrada ainda.</p>
          ) : (
            <div style={styles.newsGrid}>
              {noticiasFiltradas.map((item) => (
                <article key={item._id || item.id} style={styles.newsCard}>
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

                  <span
                    style={{
                      ...styles.badge,
                      background: corStatus(item.status),
                      color: '#fff'
                    }}
                  >
                    {item.status || 'Rascunho'}
                  </span>

                  <h3 style={styles.newsTitle}>{item.titulo}</h3>

                  <p style={styles.newsMeta}>
                    {item.categoria} • {item.areaPublicacao || 'Últimas Notícias'} • {formatarData(item)}
                  </p>

                  <p style={styles.newsText}>{item.resumo}</p>

                  <div style={styles.cardActions}>
                    {item.status === 'Rascunho' && (
                      <button
                        type="button"
                        style={styles.reviewButton}
                        onClick={() => alterarStatusPublicacao(item, 'Em Revisão')}
                      >
                        Enviar para revisão
                      </button>
                    )}

                    {item.status === 'Em Revisão' && (
                      <button
                        type="button"
                        style={styles.approveButton}
                        onClick={() => alterarStatusPublicacao(item, 'Publicado')}
                      >
                        Aprovar
                      </button>
                    )}

                    {item.status === 'Publicado' && (
                      <button
                        type="button"
                        style={styles.archiveButton}
                        onClick={() => alterarStatusPublicacao(item, 'Arquivado')}
                      >
                        Arquivar
                      </button>
                    )}

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
                      onClick={() => remover(item._id || item.id)}
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
  page: { minHeight: '100vh', background: '#f1f7ff', padding: '40px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' },
  title: { color: '#0B3D91', fontSize: '2.4rem', margin: 0 },
  subtitle: { color: '#475569', lineHeight: '1.6', maxWidth: '780px' },
  addButton: { background: '#ffc928', color: '#002855', border: 'none', borderRadius: '14px', padding: '14px 20px', fontWeight: '900', cursor: 'pointer' },
  formCard: { background: '#fff', borderRadius: '22px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  listCard: { background: '#fff', borderRadius: '22px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  sectionTitle: { color: '#0B3D91', marginTop: 0 },
  label: { display: 'block', marginTop: '14px', marginBottom: '6px', color: '#334155', fontWeight: '800' },
  input: { width: '100%', minHeight: '46px', borderRadius: '10px', border: '1px solid #bfdbfe', background: '#f8fbff', padding: '0 12px', boxSizing: 'border-box' },
  textarea: { width: '100%', minHeight: '90px', borderRadius: '10px', border: '1px solid #bfdbfe', background: '#f8fbff', padding: '12px', boxSizing: 'border-box', resize: 'vertical' },
  editorBox: { border: '1px solid #bfdbfe', borderRadius: '14px', overflow: 'hidden', background: '#fff' },
  toolbar: { display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '14px', borderBottom: '1px solid #dbeafe', background: '#f8fbff', position: 'sticky', top: 0, zIndex: 10 },
  toolButton: { border: '1px solid #bfdbfe', background: '#fff', color: '#0B3D91', borderRadius: '6px', padding: '6px 10px', fontWeight: '800', cursor: 'pointer', minWidth: '42px' },
  toolSelect: { border: '1px solid #bfdbfe', background: '#fff', color: '#0B3D91', borderRadius: '6px', padding: '6px 10px', fontWeight: '800', cursor: 'pointer', minWidth: '120px' },
  editor: { minHeight: '320px', padding: '22px', outline: 'none', fontSize: '17px', lineHeight: '1.9', color: '#1e293b', background: '#ffffff', caretColor: '#0B3D91', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'Arial, sans-serif' },
  youtubePreview: { marginTop: '12px', background: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '12px' },
  youtubeIframe: { width: '100%', height: '320px', border: 'none', borderRadius: '12px' },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '14px' },
  previewItem: { background: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '14px', padding: '10px' },
  previewMedia: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' },
  removeMediaButton: { marginTop: '8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontWeight: '800' },
  actions: { display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' },
  saveButton: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px 18px', fontWeight: '900', cursor: 'pointer' },
  cancelButton: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px 18px', fontWeight: '900', cursor: 'pointer' },
  emptyText: { color: '#64748b' },
  newsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' },
  newsCard: { background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '22px', padding: '22px', boxShadow: '0 8px 20px rgba(15,23,42,0.06)', transition: '0.3s' },
  cardMedia: { width: '100%', height: '260px', objectFit: 'contain', background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '16px', marginBottom: '14px', padding: '8px' },
  badge: { display: 'inline-block', background: '#ffc928', color: '#002855', padding: '6px 10px', borderRadius: '999px', fontWeight: '900', fontSize: '12px' },
  newsTitle: { color: '#0B3D91', marginBottom: '10px', fontSize: '1.7rem', lineHeight: '1.4', fontWeight: '900' },
  newsMeta: { color: '#64748b', fontSize: '14px' },
  newsText: { color: '#475569', lineHeight: '1.8', marginTop: '12px', minHeight: '90px', fontSize: '15px' },
  cardActions: { display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' },
  editButton: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '900', cursor: 'pointer' },
  deleteButton: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '900', cursor: 'pointer' },
  mediaSize: { color: '#64748b', fontSize: '12px', marginTop: '6px', fontWeight: '700' },
  reviewButton: { background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '900', cursor: 'pointer' },
  approveButton: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '900', cursor: 'pointer' },
  archiveButton: { background: '#64748b', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: '900', cursor: 'pointer' },

  filterBox: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },

  filterButton: {
    background: '#e2e8f0',
    color: '#0f172a',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 16px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  filterButtonActive: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 16px',
    fontWeight: '900',
    cursor: 'pointer'
  }
}

export default NoticiasAdmin