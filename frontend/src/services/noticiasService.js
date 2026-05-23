import { apiGet, apiPost, apiPut, apiDelete } from './api'

export function listarNoticias() {
  return apiGet('/noticias')
}

export function buscarNoticiaPorId(id) {
  return apiGet(`/noticias/${id}`)
}

export function salvarNoticia(noticia) {
  return apiPost('/noticias', noticia)
}

export function atualizarNoticia(noticiaAtualizada) {
  return apiPut(`/noticias/${noticiaAtualizada._id || noticiaAtualizada.id}`, noticiaAtualizada)
}

export function excluirNoticia(id) {
  return apiDelete(`/noticias/${id}`)
}

export function lerMidiaComoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo'))

    leitor.readAsDataURL(arquivo)
  })
}