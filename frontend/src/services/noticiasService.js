const STORAGE_KEY = 'noticias_lar_batista'

export function listarNoticias() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function buscarNoticiaPorId(id) {
  const noticias = listarNoticias()
  return noticias.find((item) => String(item.id) === String(id))
}

export function salvarNoticia(noticia) {
  const noticias = listarNoticias()

  const novaNoticia = {
    id: Date.now(),
    ...noticia,
    criadoEm: new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([novaNoticia, ...noticias]))
  return novaNoticia
}

export function atualizarNoticia(noticiaAtualizada) {
  const noticias = listarNoticias()

  const atualizadas = noticias.map((item) =>
    item.id === noticiaAtualizada.id ? noticiaAtualizada : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas))
}

export function excluirNoticia(id) {
  const noticias = listarNoticias()
  const atualizadas = noticias.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas))
}

export function lerMidiaComoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo'))

    leitor.readAsDataURL(arquivo)
  })
}