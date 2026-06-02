import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete
} from './api'

export async function listarNecessidades() {
  return apiGet('/necessidades')
}

export async function listarNecessidadesAtivas() {
  const lista = await listarNecessidades()

  return lista.filter(
    (item) =>
      item.status !== 'Concluída' &&
      item.status !== 'Concluida' &&
      item.status !== 'Concluída' &&
      item.status !== 'Concluida' &&
      item.status !== 'Encerrada'
  )
}

export async function listarNecessidadesConcluidas() {
  const lista = await listarNecessidades()

  return lista.filter(
    (item) =>
      item.status === 'Concluída' ||
      item.status === 'Concluida' ||
      item.status === 'Encerrada'
  )
}

export async function salvarNecessidade(novaNecessidade) {
  return apiPost('/necessidades', {
    titulo:
      novaNecessidade.titulo ||
      novaNecessidade.descricao ||
      'Necessidade cadastrada',

    categoria: novaNecessidade.categoria,
    descricao: novaNecessidade.descricao,
    prioridade: novaNecessidade.prioridade || 'MEDIA',
    quantidade: Number(novaNecessidade.quantidade || 0),
    unidade: novaNecessidade.unidade || 'unidade',
    status: 'Ativa'
  })
}

export async function atualizarNecessidade(id, dados) {
  return apiPut(`/necessidades/${id}`, dados)
}

export async function concluirNecessidade(id) {
  return apiPut(`/necessidades/${id}`, {
    status: 'Concluída'
  })
}

export async function excluirNecessidade(id) {
  return apiDelete(`/necessidades/${id}`)
}

export async function contarNecessidadesPorCategoria() {
  const lista = await listarNecessidadesAtivas()

  return lista.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1
    return acc
  }, {})
}