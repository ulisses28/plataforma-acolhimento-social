const STORAGE_KEY = 'governanca_lar_batista'

export function listarDocumentosGovernanca() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarDocumentoGovernanca(documento) {
  const documentos = listarDocumentosGovernanca()

  const novo = {
    id: Date.now(),
    titulo: documento.titulo,
    categoria: documento.categoria,
    descricao: documento.descricao,
    arquivo: documento.arquivo || '',
    status: documento.status || 'Publicado',
    dataPublicacao: new Date().toLocaleDateString('pt-BR')
  }

  documentos.unshift(novo)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(documentos))

  return novo
}

export function excluirDocumentoGovernanca(id) {
  const documentos = listarDocumentosGovernanca()

  const atualizados = documentos.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados))

  return atualizados
}