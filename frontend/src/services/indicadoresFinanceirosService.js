const STORAGE_KEY = 'indicadores_financeiros_lar'

export function listarIndicadoresFinanceiros() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarIndicadorFinanceiro(indicador) {
  const lista = listarIndicadoresFinanceiros()

  const novo = {
    id: Date.now(),
    ...indicador,
    criadoEm: new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([novo, ...lista]))
}

export function excluirIndicadorFinanceiro(id) {
  const lista = listarIndicadoresFinanceiros()
  const nova = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nova))
}