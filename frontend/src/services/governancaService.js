const STORAGE_KEY = 'governanca_lar_batista'

export function listarDocumentosGovernanca() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarDocumentoGovernanca(documento) {
  const lista = listarDocumentosGovernanca()

  const novo = {
    id: Date.now(),
    titulo: documento.titulo,
    categoria: documento.categoria,
    descricao: documento.descricao,
    arquivoNome: documento.arquivoNome || '',
    arquivoBase64: documento.arquivoBase64 || '',
    status: 'Publicado',
    dataPublicacao: new Date().toLocaleDateString('pt-BR')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([novo, ...lista]))
  return novo
}

export function excluirDocumentoGovernanca(id) {
  const lista = listarDocumentosGovernanca()
  const atualizada = lista.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function lerArquivoComoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo.'))
    leitor.readAsDataURL(arquivo)
  })
}

function base64ParaBlobUrl(base64) {
  const partes = base64.split(',')
  const mime = partes[0].match(/:(.*?);/)?.[1] || 'application/pdf'
  const binario = atob(partes[1])
  const tamanho = binario.length
  const bytes = new Uint8Array(tamanho)

  for (let i = 0; i < tamanho; i++) {
    bytes[i] = binario.charCodeAt(i)
  }

  const blob = new Blob([bytes], { type: mime })
  return URL.createObjectURL(blob)
}

export function abrirArquivoBase64(arquivoBase64) {
  if (!arquivoBase64) {
    alert('Arquivo não encontrado.')
    return
  }

  const url = base64ParaBlobUrl(arquivoBase64)
  window.open(url, '_blank')
}

export function baixarArquivoBase64(arquivoBase64, nomeArquivo = 'documento.pdf') {
  if (!arquivoBase64) {
    alert('Arquivo não encontrado.')
    return
  }

  const url = base64ParaBlobUrl(arquivoBase64)

  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}