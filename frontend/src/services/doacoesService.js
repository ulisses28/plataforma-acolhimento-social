let doacoes = []

export function criarDoacao(valor) {
  const nova = {
    id: Date.now(),
    valor,
    data: new Date().toLocaleDateString(),
    forma: "Pix",
    status: "Pendente"
  }

  doacoes.push(nova)

  simularRetornoBanco(nova.id)

  return nova
}

export function listarDoacoes() {
  return doacoes
}

function simularRetornoBanco(id) {
  setTimeout(() => {
    const statusPossiveis = ["Confirmado", "Erro"]
    const status = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)]

    const doacao = doacoes.find(d => d.id === id)

    if (doacao) {
      doacao.status = status

      // Notificação simples
      alert(`Doação ${status}: R$ ${doacao.valor}`)
    }
  }, 3000) // 3 segundos
}