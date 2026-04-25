import { listarDoacoes } from './doacoesService'

export function obterTopDoadores(limite = 3, mes = 'todos', ano = 'todos') {
  const doacoes = listarDoacoes()

  const confirmadas = doacoes.filter((doacao) => {
    if (doacao.status !== 'Confirmado') return false

    if (mes === 'todos' || ano === 'todos') return true

    const data = converterDataBR(doacao.data)
    if (!data) return false

    return (
      data.getMonth() + 1 === Number(mes) &&
      data.getFullYear() === Number(ano)
    )
  })

  const ranking = {}

  confirmadas.forEach((doacao) => {
    const nome = doacao.doador || 'Doador Anônimo'

    const valor =
      doacao.tipoDoacao === 'Material'
        ? Number(doacao.valorEstimadoMaterial || 0)
        : extrairNumeroMoeda(doacao.valor)

    if (!ranking[nome]) {
      ranking[nome] = {
        nome,
        total: 0,
        quantidade: 0
      }
    }

    ranking[nome].total += valor
    ranking[nome].quantidade += 1
  })

  return Object.values(ranking)
    .sort((a, b) => b.total - a.total)
    .slice(0, limite)
}

function extrairNumeroMoeda(valor) {
  return (
    Number(
      String(valor)
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    ) || 0
  )
}

function converterDataBR(dataBR) {
  if (!dataBR) return null
  const [dia, mes, ano] = dataBR.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}