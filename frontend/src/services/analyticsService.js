const KEY = 'analytics_visitas'

function getData() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
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

  data[key].visitas = Math.round(Number(data[key].visitas || 0))
  data[key].tempoTotal = Math.round(Number(data[key].tempoTotal || 0))
  data[key].interacoes = Math.round(Number(data[key].interacoes || 0))
}

export function registrarVisita() {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  data[key].visitas = Math.round(data[key].visitas + 1)

  salvar(data)
}

export function registrarTempo(segundos) {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  data[key].tempoTotal = Math.round(
    data[key].tempoTotal + Number(segundos || 0)
  )

  salvar(data)
}

export function registrarInteracao() {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  data[key].interacoes = Math.round(data[key].interacoes + 1)

  salvar(data)
}

export function registrarInteracaoComVisita() {
  const data = getData()
  const key = getHojeKey()

  criarDiaSeNaoExistir(data, key)

  if (data[key].visitas === 0) {
    data[key].visitas = 1
  }

  data[key].interacoes = Math.round(data[key].interacoes + 1)

  salvar(data)
}

export function formatarTempo(segundos) {
  const total = Math.round(Number(segundos || 0))

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
      totalVisitas += Math.round(Number(data[dataKey].visitas || 0))
      tempoTotal += Math.round(Number(data[dataKey].tempoTotal || 0))
      totalInteracoes += Math.round(Number(data[dataKey].interacoes || 0))
    }
  })

  const tempoMedio =
    totalVisitas > 0 ? Math.round(tempoTotal / totalVisitas) : 0

  const interacoesPorUsuario =
  totalVisitas > 0
    ? Number((totalInteracoes / totalVisitas).toFixed(2))
    : 0

  const taxaInteracao =
    totalVisitas > 0
      ? Math.round((totalInteracoes / totalVisitas) * 100)
      : 0

  return {
    totalVisitas: Math.round(totalVisitas),
    tempoTotal: Math.round(tempoTotal),
    tempoMedio,
    totalInteracoes: Math.round(totalInteracoes),

    interacoesPorUsuario,
    interacoesPorUsuarioFormatado: interacoesPorUsuario.toFixed(2),

    taxaInteracao,
    taxaInteracaoFormatada: `${taxaInteracao}%`,

    tempoTotalFormatado: formatarTempo(tempoTotal),
    tempoMedioFormatado: formatarTempo(tempoMedio)
  }
}