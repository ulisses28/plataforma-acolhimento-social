import { apiPostFormData } from './api'

const STORAGE_KEY = 'governanca_lar_batista'

/*
  Lista os documentos de governança salvos no localStorage.

  Hoje o sistema ainda usa localStorage.
  A integração com Cloudinary fica responsável apenas pelo armazenamento do arquivo.
  Os dados do documento continuam sendo salvos aqui.
*/
export function listarDocumentosGovernanca() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

/*
  Envia um PDF para o backend.

  O backend recebe em:
  POST /api/upload/documento

  Como no api.js o API_URL já termina com /api,
  aqui usamos apenas /upload/documento.

  O campo "documento" precisa ser igual ao usado no backend:
  uploadDocumento.single('documento')
*/
export async function enviarDocumentoGovernanca(arquivo) {
  validarPdf(arquivo)

  const formData = new FormData()
  formData.append('documento', arquivo)

  return apiPostFormData('/upload/documento', formData)
}

/*
  Salva o registro do documento no localStorage.

  Compatível com o modelo antigo:
  - arquivoBase64

  Compatível com o modelo novo Cloudinary:
  - arquivoUrl
  - arquivoPublicId
  - pdfUrl
  - documentoUrl
  - documentoPublicId
*/
export function salvarDocumentoGovernanca(documento) {
  const lista = listarDocumentosGovernanca()

  const novo = {
    id: documento.id || Date.now(),

    titulo: documento.titulo,
    categoria: documento.categoria,
    descricao: documento.descricao,

    /*
      Compatibilidade antiga.
      Mantemos arquivoBase64 para documentos já cadastrados antes da Cloudinary.
    */
    arquivoNome: documento.arquivoNome || documento.documentoNome || '',
    arquivoBase64: documento.arquivoBase64 || '',

    /*
      Campos novos para documentos enviados para Cloudinary.
    */
    arquivoUrl: documento.arquivoUrl || documento.pdfUrl || documento.documentoUrl || '',
    arquivoPublicId: documento.arquivoPublicId || documento.documentoPublicId || '',
    pdfUrl: documento.pdfUrl || documento.arquivoUrl || documento.documentoUrl || '',
    documentoUrl: documento.documentoUrl || documento.arquivoUrl || documento.pdfUrl || '',
    documentoPublicId: documento.documentoPublicId || documento.arquivoPublicId || '',
    documentoNome: documento.documentoNome || documento.arquivoNome || '',

    status: documento.status || 'Publicado',
    dataPublicacao:
      documento.dataPublicacao || new Date().toLocaleDateString('pt-BR')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([novo, ...lista]))

  return novo
}

/*
  Atualiza um documento existente.

  Deixei essa função pronta para caso o admin de governança permita edição.
*/
export function atualizarDocumentoGovernanca(documentoAtualizado) {
  const lista = listarDocumentosGovernanca()

  const atualizada = lista.map((item) =>
    item.id === documentoAtualizado.id ? documentoAtualizado : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))

  return documentoAtualizado
}

export function excluirDocumentoGovernanca(id) {
  const lista = listarDocumentosGovernanca()
  const atualizada = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

/*
  Valida PDF antes de enviar.

  Limite igual ao backend:
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
  Função antiga mantida.

  Ainda pode ser usada por telas que salvam PDF em base64.
  Não remover para não quebrar documentos antigos.
*/
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