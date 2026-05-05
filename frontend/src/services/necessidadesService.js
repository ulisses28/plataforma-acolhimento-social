// src/services/necessidadesService.js

const STORAGE_KEY = 'necessidades_lar_batista'

// Lista todas as necessidades salvas no localStorage
export function listarNecessidades() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

// Salva uma nova necessidade
export function salvarNecessidade(novaNecessidade) {
  const lista = listarNecessidades()

  const necessidade = {
    id: Date.now(),
    categoria: novaNecessidade.categoria,
    descricao: novaNecessidade.descricao,
    prioridade: novaNecessidade.prioridade,
    criadoEm: new Date().toLocaleDateString('pt-BR')
  }

  const listaAtualizada = [...lista, necessidade]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada))

  return necessidade
}

// Conta quantas necessidades existem por categoria
export function contarNecessidadesPorCategoria() {
  const lista = listarNecessidades()

  return lista.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1
    return acc
  }, {})
}