const STORAGE_KEY = 'parceiros_lar_batista'

export function listarParceiros() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarParceiro(parceiro) {
  const lista = listarParceiros()

  const novo = {
    id: Date.now(),
    criadoEm: new Date().toLocaleDateString('pt-BR'),
    ...parceiro
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([novo, ...lista])
  )
}

export function lerLogoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}