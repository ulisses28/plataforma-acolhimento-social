const STORAGE_KEY = 'necessidades_lar_batista'

export function listarNecessidades() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function listarNecessidadesAtivas() {
  return listarNecessidades().filter(
    (item) => item.status !== 'Concluída'
  )
}

export function listarNecessidadesConcluidas() {
  return listarNecessidades().filter(
    (item) => item.status === 'Concluída'
  )
}

export function salvarNecessidade(novaNecessidade) {
  const lista = listarNecessidades()

  const necessidade = {
    id: Date.now(),
    categoria: novaNecessidade.categoria,
    descricao: novaNecessidade.descricao,
    prioridade: novaNecessidade.prioridade || 'MEDIA',
    quantidade: Number(novaNecessidade.quantidade || 0),
    unidade: novaNecessidade.unidade || 'unidade',
    status: 'Em aberto',
    criadoEm: new Date().toLocaleDateString('pt-BR'),
    concluidoEm: ''
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([necessidade, ...lista])
  )

  return necessidade
}

export function concluirNecessidade(id) {
  const lista = listarNecessidades()

  const atualizada = lista.map((item) =>
    item.id === id
      ? {
          ...item,
          status: 'Concluída',
          concluidoEm: new Date().toLocaleDateString('pt-BR')
        }
      : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function contarNecessidadesPorCategoria() {
  const lista = listarNecessidadesAtivas()

  return lista.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1
    return acc
  }, {})
}