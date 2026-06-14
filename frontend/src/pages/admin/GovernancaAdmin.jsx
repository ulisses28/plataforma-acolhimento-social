import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarDocumentosGovernanca,
  salvarDocumentoGovernanca,
  excluirDocumentoGovernanca,
  enviarDocumentoGovernanca,
  abrirArquivoBase64,
  baixarArquivoBase64
} from '../../services/governancaService'

function GovernancaAdmin() {
  const [documentos, setDocumentos] = useState([])

  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('Transparência')
  const [descricao, setDescricao] = useState('')

  /*
    Estados do arquivo.

    arquivoSelecionado:
    - Guarda o PDF escolhido pelo usuário antes de salvar.
    - Não deve ir para o localStorage.

    arquivoNome:
    - Nome visível do PDF.

    arquivoUrl / arquivoPublicId:
    - Campos novos vindos da Cloudinary.

    arquivoBase64:
    - Mantido apenas para compatibilidade com documentos antigos.
  */
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null)
  const [arquivoNome, setArquivoNome] = useState('')
  const [arquivoBase64, setArquivoBase64] = useState('')
  const [arquivoUrl, setArquivoUrl] = useState('')
  const [arquivoPublicId, setArquivoPublicId] = useState('')

  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    setDocumentos(listarDocumentosGovernanca())
  }

  function limparFormulario() {
    setTitulo('')
    setCategoria('Transparência')
    setDescricao('')
    setArquivoSelecionado(null)
    setArquivoNome('')
    setArquivoBase64('')
    setArquivoUrl('')
    setArquivoPublicId('')
  }

  /*
    Seleciona PDF.

    Agora não convertemos mais para base64.
    Apenas guardamos o arquivo temporariamente no estado.
    O upload para Cloudinary acontece no botão "Publicar documento".
  */
  function selecionarArquivo(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    if (arquivo.type !== 'application/pdf') {
      alert('Envie apenas arquivos PDF.')
      e.target.value = ''
      return
    }

    const limiteMB = 20
    const tamanhoMB = arquivo.size / (1024 * 1024)

    if (tamanhoMB > limiteMB) {
      alert(`O PDF possui ${tamanhoMB.toFixed(2)} MB. O limite é ${limiteMB} MB.`)
      e.target.value = ''
      return
    }

    setArquivoSelecionado(arquivo)
    setArquivoNome(arquivo.name)

    /*
      Limpamos os campos antigos/anteriores para evitar salvar arquivo errado.
    */
    setArquivoBase64('')
    setArquivoUrl('')
    setArquivoPublicId('')
  }

  /*
    Retorna a URL de documento quando ele foi enviado para Cloudinary.
  */
  function obterUrlDocumento(item) {
    return item.arquivoUrl || item.pdfUrl || item.documentoUrl || ''
  }

  function visualizarDocumento(item) {
    const urlDocumento = obterUrlDocumento(item)

    if (urlDocumento) {
      window.open(urlDocumento, '_blank', 'noopener,noreferrer')
      return
    }

    if (item.arquivoBase64) {
      abrirArquivoBase64(item.arquivoBase64)
      return
    }

    alert('Documento não encontrado.')
  }

  function baixarDocumento(item) {
    const urlDocumento = obterUrlDocumento(item)
    const nomeArquivo = item.arquivoNome || item.documentoNome || `${item.titulo || 'documento'}.pdf`

    if (urlDocumento) {
      const link = document.createElement('a')
      link.href = urlDocumento
      link.download = nomeArquivo
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return
    }

    if (item.arquivoBase64) {
      baixarArquivoBase64(item.arquivoBase64, nomeArquivo)
      return
    }

    alert('Documento não encontrado.')
  }

  async function salvar(e) {
    e.preventDefault()

    if (!titulo.trim()) return alert('Informe o título.')
    if (!descricao.trim()) return alert('Informe a descrição.')

    try {
      setSalvando(true)

      let dadosArquivo = {
        arquivoNome,
        arquivoBase64,
        arquivoUrl,
        arquivoPublicId,
        pdfUrl: arquivoUrl,
        documentoUrl: arquivoUrl,
        documentoPublicId: arquivoPublicId,
        documentoNome: arquivoNome
      }

      /*
        Se o usuário selecionou um PDF novo, enviamos para Cloudinary.
      */
      if (arquivoSelecionado) {
        const upload = await enviarDocumentoGovernanca(arquivoSelecionado)

        dadosArquivo = {
          arquivoNome: upload.arquivoNome || arquivoSelecionado.name,
          arquivoBase64: '',
          arquivoUrl: upload.arquivoUrl,
          arquivoPublicId: upload.arquivoPublicId,
          pdfUrl: upload.pdfUrl || upload.arquivoUrl,
          documentoUrl: upload.documentoUrl || upload.arquivoUrl,
          documentoPublicId: upload.documentoPublicId || upload.arquivoPublicId,
          documentoNome: upload.documentoNome || upload.arquivoNome || arquivoSelecionado.name
        }
      }

      salvarDocumentoGovernanca({
        titulo,
        categoria,
        descricao,
        ...dadosArquivo
      })

      limparFormulario()
      carregar()

      alert('Documento publicado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar documento:', error)
      alert(error.message || 'Erro ao salvar documento.')
    } finally {
      setSalvando(false)
    }
  }

  function remover(id) {
    const ok = confirm('Deseja remover este documento?')

    if (!ok) return

    excluirDocumentoGovernanca(id)
    carregar()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Governança Institucional</h1>

          <p style={styles.subtitle}>
            Publique documentos de transparência, equidade, responsabilidade e ética institucional.
          </p>
        </header>

        <section style={styles.grid}>
          <form style={styles.card} onSubmit={salvar}>
            <h2 style={styles.cardTitle}>Publicar documento</h2>

            <label style={styles.label}>Título do documento</label>
            <input
              style={styles.input}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Código de Ética e Conduta"
            />

            <label style={styles.label}>Categoria</label>
            <select
              style={styles.input}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Transparência</option>
              <option>Equidade</option>
              <option>Responsabilidade</option>
              <option>Ética</option>
              <option>Prestação de Contas</option>
            </select>

            <label style={styles.label}>Descrição</label>
            <textarea
              style={styles.textarea}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a finalidade do documento..."
            />

            <label style={styles.label}>Arquivo/documento em PDF</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              style={styles.input}
              onChange={selecionarArquivo}
            />

            {arquivoNome && (
              <p style={styles.meta}>
                PDF selecionado: {arquivoNome}
              </p>
            )}

            <button
              type="submit"
              style={styles.button}
              disabled={salvando}
            >
              {salvando ? 'Enviando...' : 'Publicar documento'}
            </button>
          </form>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Documentos publicados</h2>

            {documentos.length === 0 ? (
              <p style={styles.empty}>Nenhum documento publicado ainda.</p>
            ) : (
              documentos.map((item) => (
                <article key={item.id} style={styles.documentItem}>
                  <span style={styles.badge}>{item.categoria}</span>

                  <h3 style={styles.docTitle}>{item.titulo}</h3>

                  <p style={styles.docText}>{item.descricao}</p>

                  <p style={styles.meta}>
                    Publicado em {item.dataPublicacao}
                  </p>

                  {(item.arquivoNome || item.arquivoUrl || item.pdfUrl || item.documentoUrl || item.arquivoBase64) && (
                    <>
                      <p style={styles.meta}>
                        Arquivo: {item.arquivoNome || item.documentoNome || 'documento.pdf'}
                      </p>

                      <div style={styles.actions}>
                        <button
                          type="button"
                          style={styles.viewButton}
                          onClick={() => visualizarDocumento(item)}
                        >
                          Visualizar
                        </button>

                        <button
                          type="button"
                          style={styles.downloadButton}
                          onClick={() => baixarDocumento(item)}
                        >
                          Baixar PDF
                        </button>
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    style={styles.removeButton}
                    onClick={() => remover(item.id)}
                  >
                    Remover
                  </button>
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
    maxWidth: '1180px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '28px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.6rem',
    margin: 0
  },
  subtitle: {
    color: '#475569',
    lineHeight: '1.6'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    gap: '24px'
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  label: {
    display: 'block',
    marginTop: '14px',
    marginBottom: '6px',
    fontWeight: '800',
    color: '#334155'
  },
  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    padding: '0 12px',
    boxSizing: 'border-box',
    background: '#f8fbff'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    padding: '12px',
    boxSizing: 'border-box',
    background: '#f8fbff',
    resize: 'vertical'
  },
  button: {
    width: '100%',
    marginTop: '20px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  documentItem: {
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px',
    marginBottom: '14px',
    background: '#f8fbff'
  },
  badge: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '7px 12px',
    borderRadius: '999px',
    fontWeight: '900'
  },
  docTitle: {
    color: '#0B3D91',
    marginBottom: '8px'
  },
  docText: {
    color: '#334155',
    lineHeight: '1.6'
  },
  meta: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  removeButton: {
    marginTop: '12px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  empty: {
    color: '#64748b'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '12px'
  },
  viewButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  downloadButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  }
}

export default GovernancaAdmin