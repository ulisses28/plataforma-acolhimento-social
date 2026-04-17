const STORAGE_KEY = 'doacoes_lar_batista'

export function criarDoacao(valor, doador) {
  const doacoes = listarDoacoes()

  const valorFormatado = formatarValor(valor)

  const nova = {
    id: Date.now(),
    valor: valorFormatado,
    data: new Date().toLocaleDateString('pt-BR'),
    forma: 'Pix',
    status: 'Pendente',
    doador: doador ? doador.nome : 'Anônimo'
  }

  doacoes.push(nova)
  salvarDoacoes(doacoes)

  simularRetornoBanco(nova.id)

  return nova
}

export function listarDoacoes() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

function salvarDoacoes(doacoes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doacoes))
}

function simularRetornoBanco(id) {
  setTimeout(() => {
    const doacoes = listarDoacoes()

    const sorteio = Math.random()
    let status = 'Pendente'

    if (sorteio < 0.7) {
      status = 'Confirmado'
    } else if (sorteio < 0.9) {
      status = 'Pendente'
    } else {
      status = 'Erro'
    }

    const indice = doacoes.findIndex((d) => d.id === id)

    if (indice !== -1) {
      doacoes[indice].status = status
      salvarDoacoes(doacoes)

      if (status === 'Confirmado') {
        alert(`Doação confirmada com sucesso: ${doacoes[indice].valor}`)
      } else if (status === 'Erro') {
        alert(`Houve uma falha no processamento da doação: ${doacoes[indice].valor}`)
      }
    }
  }, 3000)
}

function formatarValor(valor) {
  const numero = Number(String(valor).replace(',', '.'))

  if (isNaN(numero)) return 'R$ 0,00'

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
export function atualizarStatusDoacao(id, novoStatus) {
  const doacoes = listarDoacoes()

  const indice = doacoes.findIndex((d) => d.id === id)

  if (indice !== -1) {
    doacoes[indice].status = novoStatus
    salvarDoacoes(doacoes)
  }

  return doacoes
}