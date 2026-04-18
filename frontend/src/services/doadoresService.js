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

export function salvarNovoDoador(doador) {
  const lista = listarDoadores()

  const jaExiste = lista.find(
    (item) => item.nome.trim().toLowerCase() === doador.nome.trim().toLowerCase()
  )

  if (jaExiste) {
    return jaExiste
  }

  const novo = {
    id: Date.now(),
    nome: doador.nome,
    categoria: doador.categoria || 'Pessoa Física',
    telefone: doador.telefone || '',
    obs: doador.obs || ''
  }

  const novaLista = [...lista, novo]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista))

  return novo
}