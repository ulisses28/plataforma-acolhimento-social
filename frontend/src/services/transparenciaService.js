import { apiPostFormData } from './api'

const STORAGE_KEY = 'transparencia_lar_batista'

/*
  Lista as publicações de transparência salvas no localStorage.

  O arquivo PDF pode estar:
  - em base64, modelo antigo
  - em URL da Cloudinary, modelo novo
*/
export function listarPublicacoesTransparencia() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

/*
  Envia PDF para o backend.

  Rota final:
  POST /api/upload/documento

  Campo esperado pelo backend:
  documento
*/
export async function enviarDocumentoTransparencia(arquivo) {
  validarPdf(arquivo)

  const formData = new FormData()
  formData.append('documento', arquivo)

  return apiPostFormData('/upload/documento', formData)
}

/*
  Salva uma publicação de transparência.

  Mantém todos os campos que já vierem da tela admin,
  mas garante compatibilidade com os campos de PDF antigo e novo.
*/
export function salvarPublicacaoTransparencia(publicacao) {
  const lista = listarPublicacoesTransparencia()

  const nova = {
    id: publicacao.id || Date.now(),
    criadoEm: publicacao.criadoEm || new Date().toLocaleString('pt-BR'),

    ...publicacao,

    /*
      Compatibilidade antiga.
    */
    arquivoNome: publicacao.arquivoNome || publicacao.documentoNome || '',
    arquivoBase64: publicacao.arquivoBase64 || '',

    /*
      Campos novos para Cloudinary.
    */
    arquivoUrl: publicacao.arquivoUrl || publicacao.pdfUrl || publicacao.documentoUrl || '',
    arquivoPublicId: publicacao.arquivoPublicId || publicacao.documentoPublicId || '',
    pdfUrl: publicacao.pdfUrl || publicacao.arquivoUrl || publicacao.documentoUrl || '',
    documentoUrl: publicacao.documentoUrl || publicacao.arquivoUrl || publicacao.pdfUrl || '',
    documentoPublicId: publicacao.documentoPublicId || publicacao.arquivoPublicId || '',
    documentoNome: publicacao.documentoNome || publicacao.arquivoNome || ''
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([nova, ...lista]))

  return nova
}

export function atualizarPublicacaoTransparencia(publicacaoAtualizada) {
  const lista = listarPublicacoesTransparencia()

  const atualizada = lista.map((item) =>
    item.id === publicacaoAtualizada.id ? publicacaoAtualizada : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))

  return publicacaoAtualizada
}

export function excluirPublicacaoTransparencia(id) {
  const lista = listarPublicacoesTransparencia()
  const nova = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nova))
}

/*
  Validação de PDF.

  Mesmo limite usado no backend:
  20 MB.
*/
export function validarPdf(arquivo, limiteMB = 20) {
  if (!arquivo) {
    throw new Error('Nenhum arquivo foi selecionado.')
  }

  if (arquivo.type !== 'application/pdf') {
    throw new Error('Formato inválido. Envie apenas arquivo PDF.')
  }

  const tamanhoMB = arquivo.size / (1024 * 1024)

  if (tamanhoMB > limiteMB) {
    throw new Error(
      `O arquivo possui ${tamanhoMB.toFixed(2)} MB. O limite permitido é ${limiteMB} MB.`
    )
  }

  return true
}

/*
  Função antiga mantida por compatibilidade.

  Pode continuar sendo usada por documentos salvos antes da Cloudinary.
*/
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

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function baixarArquivoBase64(
  arquivoBase64,
  nomeArquivo = 'documento.pdf'
) {
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