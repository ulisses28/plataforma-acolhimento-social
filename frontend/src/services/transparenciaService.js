const STORAGE_KEY = 'transparencia_lar_batista'

// LISTAR
export function listarPublicacoesTransparencia() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

// SALVAR
export function salvarPublicacaoTransparencia(publicacao) {
  const lista = listarPublicacoesTransparencia()

  const nova = {
    id: Date.now(),
    criadoEm: new Date().toLocaleString('pt-BR'),
    ...publicacao
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([nova, ...lista]))
}

// EDITAR
export function atualizarPublicacaoTransparencia(publicacaoAtualizada) {
  const lista = listarPublicacoesTransparencia()

  const atualizada = lista.map((item) =>
    item.id === publicacaoAtualizada.id ? publicacaoAtualizada : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

// EXCLUIR
export function excluirPublicacaoTransparencia(id) {
  const lista = listarPublicacoesTransparencia()
  const nova = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nova))
}

// 🔥 NOVO: converter PDF para base64
export function lerArquivoComoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}