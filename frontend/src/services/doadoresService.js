const STORAGE_KEY = 'doadores_lar_batista'

export function listarDoadores() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function buscarDoadores(nome) {
  const lista = listarDoadores()

  return lista.filter((d) =>
    d.nome.toLowerCase().includes(nome.toLowerCase())
  )
}