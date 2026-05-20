const KEY = 'analytics_visitas'

function getData() {
  return JSON.parse(localStorage.getItem(KEY)) || {}
}

function salvar(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function getHojeKey() {
  const hoje = new Date()

  return `${hoje.getFullYear()}-${String(
    hoje.getMonth() + 1
  ).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
}

function criarDiaSeNaoExistir(data, key) {
  if (!data[key]) {
    data[key] = {
      visitas: 0,
      tempoTotal: 0,
      interacoes: 0
    }
  }
}

export function registrarVisita() {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  data[key].visitas += 1

  salvar(data)
}

export function registrarTempo(segundos) {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  data[key].tempoTotal += Number(segundos || 0)

  salvar(data)
}

export function registrarInteracao() {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  data[key].interacoes += 1

  salvar(data)
}

export function registrarInteracaoComVisita() {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  if (data[key].visitas === 0) {
    data[key].visitas = 1
  }

  data[key].interacoes += 1

  salvar(data)
}

export function formatarTempo(segundos) {
  const total = Number(segundos || 0)

  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const secs = Math.floor(total % 60)

  if (horas > 0) {
    return `${horas}h ${minutos}min ${secs}s`
  }

  if (minutos > 0) {
    return `${minutos}min ${secs}s`
  }

  return `${secs}s`
}

export function obterAnalyticsMes(mes, ano) {
  const data = getData()

  let totalVisitas = 0
  let tempoTotal = 0
  let totalInteracoes = 0

  Object.keys(data).forEach((dataKey) => {
    const [y, m] = dataKey.split('-')

    if (String(y) === String(ano) && String(m) === String(mes)) {
      totalVisitas += Number(data[dataKey].visitas || 0)
      tempoTotal += Number(data[dataKey].tempoTotal || 0)
      totalInteracoes += Number(data[dataKey].interacoes || 0)
    }
  })

  const tempoMedio =
    totalVisitas > 0 ? tempoTotal / totalVisitas : 0

  const interacoesPorUsuario =
    totalVisitas > 0 ? totalInteracoes / totalVisitas : 0

  const taxaInteracao =
    totalVisitas > 0 ? (totalInteracoes / totalVisitas) * 100 : 0

  return {
    totalVisitas,
    tempoTotal,
    tempoMedio,
    totalInteracoes,

    interacoesPorUsuario,
    interacoesPorUsuarioFormatado: interacoesPorUsuario.toFixed(2),

    taxaInteracao,
    taxaInteracaoFormatada: `${taxaInteracao.toFixed(2)}%`,

    tempoTotalFormatado: formatarTempo(tempoTotal),
    tempoMedioFormatado: formatarTempo(tempoMedio)
  }
}