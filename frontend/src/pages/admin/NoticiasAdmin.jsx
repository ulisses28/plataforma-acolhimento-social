import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { registrarAuditoriaFrontend } from '../../services/auditoriaFrontendService'

import {
  enviarImagemNoticia,
  processarArquivos
} from '../../services/uploadService'

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
  const [salvando, setSalvando] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('Todos')

  const editorRef = useRef(null)

  /*
    Formulário base.

    Campos antigos mantidos:
    - midias
    - midia
    - tipoMidia

    Campos novos para Cloudinary:
    - imagemUrl
    - imagemPublicId

    A ideia é:
    - imagemUrl guarda a URL pública da Cloudinary
    - imagemPublicId guarda o ID da imagem na Cloudinary
    - midia continua recebendo a URL para compatibilidade com telas antigas
  */
  const formInicial = {
    titulo: '',
    categoria: 'Notícia institucional',
    areaPublicacao: 'Últimas Notícias',
    resumo: '',
    conteudo: '',
    midias: [],
    midia: '',
    tipoMidia: '',
    imagemUrl: '',
    imagemPublicId: '',
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

  /*
    Limpa URLs temporárias criadas pelo navegador para pré-visualização.
    Isso evita acúmulo de memória quando o usuário seleciona imagens,
    remove imagens ou cancela o formulário.
  */
  function liberarPreviewsLocais(midias = []) {
    midias.forEach((midia) => {
      if (midia.previewUrl) {
        URL.revokeObjectURL(midia.previewUrl)
      }
    })
  }

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

  function formatarTamanhoMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2)
  }

  /*
    Seleção de mídias.

    Para imagens:
    - não convertemos mais para base64
    - guardamos o arquivo temporariamente no estado
    - criamos apenas uma prévia local com URL.createObjectURL
    - o upload real para Cloudinary acontece no botão Salvar

    Para vídeos:
    - mantemos o comportamento antigo em base64 por compatibilidade
    - para produção, o ideal é usar link do YouTube
  */
  async function selecionarMidias(e) {
    try {
      const arquivos = Array.from(e.target.files || [])

      if (arquivos.length === 0) return

      const novasMidias = []

      for (const arquivo of arquivos) {
        const tamanhoMB = Number(formatarTamanhoMB(arquivo.size))

        if (arquivo.type.startsWith('image')) {
          if (tamanhoMB > 5) {
            throw new Error(
              `A imagem "${arquivo.name}" possui ${tamanhoMB} MB. O limite permitido é 5 MB.`
            )
          }

          novasMidias.push({
            nome: arquivo.name,
            tipo: arquivo.type,
            tamanho: arquivo.size,
            tamanhoMB,
            arquivo,
            previewUrl: URL.createObjectURL(arquivo),
            origem: 'local'
          })
        } else if (arquivo.type.startsWith('video')) {
          const videosConvertidos = await processarArquivos({
            arquivos: [arquivo],
            tiposPermitidos: ['video'],
            limiteImagemMB: 5,
            limiteVideoMB: 100,
            alertaVideoMB: 50
          })

          novasMidias.push(
            ...videosConvertidos.map((video) => ({
              ...video,
              origem: 'base64'
            }))
          )
        } else {
          throw new Error(
            `Tipo de arquivo não permitido: ${arquivo.type}`
          )
        }
      }

      setForm((atual) => ({
        ...atual,
        midias: [
          ...(atual.midias || []),
          ...novasMidias
        ]
      }))
    } catch (error) {
      alert(error.message)
    } finally {
      e.target.value = ''
    }
  }

  function removerMidia(index) {
    const midiaRemovida = form.midias[index]

    if (midiaRemovida?.previewUrl) {
      URL.revokeObjectURL(midiaRemovida.previewUrl)
    }

    alterarCampo(
      'midias',
      form.midias.filter((_, i) => i !== index)
    )
  }

  function limparFormulario() {
    liberarPreviewsLocais(form.midias)

    setForm(formInicial)
    setEditandoId(null)
    setMostrarFormulario(false)

    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
  }

  /*
    Prepara as mídias antes de salvar.

    Regras:
    1. Se houver imagem local nova, ela é enviada para Cloudinary.
    2. A primeira imagem enviada vira a imagem principal da notícia.
    3. O campo imagemUrl recebe a URL da Cloudinary.
    4. O campo midia também recebe a mesma URL para compatibilidade.
    5. Vídeos em base64 continuam funcionando, mas o recomendado é usar YouTube.
  */
  async function prepararMidiasParaSalvar() {
    const midiasOriginais = form.midias || []
    const midiasParaSalvar = []

    let midiaPrincipal = form.midia || form.imagemUrl || ''
    let tipoMidiaPrincipal = form.tipoMidia || ''
    let imagemUrlFinal = form.imagemUrl || ''
    let imagemPublicIdFinal = form.imagemPublicId || ''

    let primeiraImagemLocalEnviada = false

    for (const midia of midiasOriginais) {
      if (midia.arquivo && midia.tipo?.startsWith('image')) {
        const upload = await enviarImagemNoticia(midia.arquivo)

        const midiaSalva = {
          nome: midia.nome || '',
          tipo: midia.tipo || 'image',
          tamanho: midia.tamanho || 0,
          tamanhoMB: midia.tamanhoMB || '',
          base64: upload.imagemUrl,
          imagemUrl: upload.imagemUrl,
          imagemPublicId: upload.imagemPublicId,
          origem: 'cloudinary'
        }

        midiasParaSalvar.push(midiaSalva)

        /*
          Se o usuário selecionou uma imagem nova durante a edição,
          essa imagem nova substitui a imagem principal anterior.
        */
        if (!primeiraImagemLocalEnviada) {
          midiaPrincipal = upload.imagemUrl
          tipoMidiaPrincipal = 'imagem'
          imagemUrlFinal = upload.imagemUrl
          imagemPublicIdFinal = upload.imagemPublicId
          primeiraImagemLocalEnviada = true
        }
      } else {
        const urlExistente =
          midia.imagemUrl ||
          midia.base64 ||
          ''

        const midiaSalva = {
          nome: midia.nome || '',
          tipo: midia.tipo || '',
          tamanho: midia.tamanho || 0,
          tamanhoMB: midia.tamanhoMB || '',
          base64: urlExistente,
          imagemUrl:
            midia.imagemUrl ||
            (urlExistente.startsWith('http') ? urlExistente : ''),
          imagemPublicId: midia.imagemPublicId || '',
          origem: midia.origem || 'existente'
        }

        midiasParaSalvar.push(midiaSalva)

        if (!midiaPrincipal && urlExistente) {
          midiaPrincipal = urlExistente
          tipoMidiaPrincipal = midia.tipo || ''

          if (!imagemUrlFinal && urlExistente.startsWith('http')) {
            imagemUrlFinal = urlExistente
          }

          if (!imagemPublicIdFinal && midia.imagemPublicId) {
            imagemPublicIdFinal = midia.imagemPublicId
          }
        }
      }
    }

    return {
      midiasParaSalvar,
      midiaPrincipal,
      tipoMidiaPrincipal,
      imagemUrlFinal,
      imagemPublicIdFinal
    }
  }

  async function salvar(e) {
    e.preventDefault()

    const conteudoAtual =
      editorRef.current?.innerHTML ||
      form.conteudo ||
      ''

    if (!form.titulo.trim()) return alert('Informe o título.')
    if (!form.resumo.trim()) return alert('Informe o resumo.')
    if (!conteudoAtual.trim()) return alert('Informe o conteúdo.')

    try {
      setSalvando(true)

      const {
        midiasParaSalvar,
        midiaPrincipal,
        tipoMidiaPrincipal,
        imagemUrlFinal,
        imagemPublicIdFinal
      } = await prepararMidiasParaSalvar()

      const dados = {
        titulo: form.titulo,
        categoria: form.categoria,
        areaPublicacao: form.areaPublicacao,
        resumo: form.resumo,
        conteudo: conteudoAtual,
        youtubeUrl: form.youtubeUrl || '',
        midias: midiasParaSalvar,
        midia: midiaPrincipal,
        tipoMidia: tipoMidiaPrincipal,
        imagemUrl: imagemUrlFinal,
        imagemPublicId: imagemPublicIdFinal,
        status: form.status
      }

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

      alert(
        error.message ||
          'Erro ao salvar publicação. Verifique se o backend está rodando.'
      )
    } finally {
      setSalvando(false)
    }
  }

  function editar(item) {
    const imagemPrincipal =
      item.imagemUrl ||
      item.midia ||
      ''

    const midiasExistentes =
      item.midias ||
      (imagemPrincipal
        ? [
            {
              base64: imagemPrincipal,
              imagemUrl: item.imagemUrl || imagemPrincipal,
              imagemPublicId: item.imagemPublicId || '',
              tipo: item.tipoMidia || 'imagem',
              origem: 'existente'
            }
          ]
        : [])

    setForm({
      titulo: item.titulo || '',
      categoria: item.categoria || 'Notícia institucional',
      areaPublicacao: item.areaPublicacao || 'Últimas Notícias',
      resumo: item.resumo || '',
      conteudo: item.conteudo || '',
      midias: midiasExistentes,
      midia: item.midia || imagemPrincipal,
      tipoMidia: item.tipoMidia || '',
      imagemUrl: item.imagemUrl || '',
      imagemPublicId: item.imagemPublicId || '',
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

  function obterSrcPreview(midia) {
    return (
      midia.previewUrl ||
      midia.imagemUrl ||
      midia.base64 ||
      ''
    )
  }

  function ehVideo(midia) {
    return midia.tipo?.startsWith('video')
  }

  function obterMidiaCard(item) {
    return (
      item.imagemUrl ||
      item.midia ||
      item.midias?.[0]?.imagemUrl ||
      item.midias?.[0]?.base64 ||
      ''
    )
  }

  function obterTipoMidiaCard(item) {
    return (
      item.tipoMidia ||
      item.midias?.[0]?.tipo ||
      ''
    )
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

            <label style={styles.label}>Imagem principal ou vídeo</label>
            <input
              style={styles.input}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={selecionarMidias}
            />

            <p style={styles.helperText}>
              Imagens serão enviadas para a Cloudinary ao salvar a publicação.
              Para vídeos grandes, prefira publicar no YouTube e colar o link acima.
            </p>

            {form.midias.length > 0 && (
              <div style={styles.previewGrid}>
                {form.midias.map((midia, index) => {
                  const src = obterSrcPreview(midia)

                  return (
                    <div key={index} style={styles.previewItem}>
                      {ehVideo(midia) ? (
                        <video src={src} controls style={styles.previewMedia} />
                      ) : (
                        <img src={src} alt="Prévia" style={styles.previewMedia} />
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

                      {midia.imagemUrl && (
                        <p style={styles.mediaSize}>
                          Imagem salva na Cloudinary
                        </p>
                      )}
                    </div>
                  )
                })}
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
              <button
                type="submit"
                style={styles.saveButton}
                disabled={salvando}
              >
                {salvando
                  ? 'Salvando...'
                  : editandoId
                    ? 'Atualizar publicação'
                    : 'Publicar'}
              </button>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={limparFormulario}
                disabled={salvando}
              >
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
              {noticiasFiltradas.map((item) => {
                const midiaCard = obterMidiaCard(item)
                const tipoMidiaCard = obterTipoMidiaCard(item)

                return (
                  <article key={item._id || item.id} style={styles.newsCard}>
                    {item.youtubeUrl ? (
                      <iframe
                        src={converterYoutubeEmbed(item.youtubeUrl)}
                        title={item.titulo}
                        style={styles.cardMedia}
                        allowFullScreen
                      />
                    ) : midiaCard ? (
                      tipoMidiaCard?.startsWith('video') ? (
                        <video src={midiaCard} controls style={styles.cardMedia} />
                      ) : (
                        <img src={midiaCard} alt={item.titulo} style={styles.cardMedia} />
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
                )
              })}
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
    gap: '10px',
    padding: '14px',
    borderBottom: '1px solid #dbeafe',
    background: '#f8fbff',
    position: 'sticky',
    top: 0,
    zIndex: 10
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
    minHeight: '320px',
    padding: '22px',
    outline: 'none',
    fontSize: '17px',
    lineHeight: '1.9',
    color: '#1e293b',
    background: '#ffffff',
    caretColor: '#0B3D91',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'Arial, sans-serif'
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
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: '13px',
    lineHeight: '1.5'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px'
  },

  newsCard: {
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '22px',
    padding: '22px',
    boxShadow: '0 8px 20px rgba(15,23,42,0.06)',
    transition: '0.3s'
  },

  cardMedia: {
    width: '100%',
    height: '260px',
    objectFit: 'contain',
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    marginBottom: '14px',
    padding: '8px'
  },

  badge: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },

  newsTitle: {
    color: '#0B3D91',
    marginBottom: '10px',
    fontSize: '1.7rem',
    lineHeight: '1.4',
    fontWeight: '900'
  },

  newsMeta: {
    color: '#64748b',
    fontSize: '14px'
  },

  newsText: {
    color: '#475569',
    lineHeight: '1.8',
    marginTop: '12px',
    minHeight: '90px',
    fontSize: '15px'
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
  },

  mediaSize: {
    color: '#64748b',
    fontSize: '12px',
    marginTop: '6px',
    fontWeight: '700'
  },

  reviewButton: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  approveButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  archiveButton: {
    background: '#64748b',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

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