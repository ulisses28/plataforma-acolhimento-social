const STORAGE_KEY = 'transparencia_lar_batista'

export function listarPublicacoesTransparencia() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarPublicacaoTransparencia(publicacao) {
  const lista = listarPublicacoesTransparencia()

  const nova = {
    id: Date.now(),
    criadoEm: new Date().toLocaleString('pt-BR'),
    ...publicacao
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([nova, ...lista]))
}

export function atualizarPublicacaoTransparencia(publicacaoAtualizada) {
  const lista = listarPublicacoesTransparencia()

  const atualizada = lista.map((item) =>
    item.id === publicacaoAtualizada.id ? publicacaoAtualizada : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function excluirPublicacaoTransparencia(id) {
  const lista = listarPublicacoesTransparencia()
  const nova = lista.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nova))
}

export function lerArquivoComoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'))
    reader.readAsDataURL(file)
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