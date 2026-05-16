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

/*
========================================
REGISTRAR VISITA
========================================
*/
export function registrarVisita() {
  const data = getData()
  const key = getHojeKey()

  if (!data[key]) {
    data[key] = {
      visitas: 0,
      tempoTotal: 0,
      interacoes: 0
    }
  }

  data[key].visitas += 1

  salvar(data)
}

/*
========================================
REGISTRAR TEMPO
========================================
*/
export function registrarTempo(segundos) {
  const data = getData()
  const key = getHojeKey()

  if (!data[key]) {
    data[key] = {
      visitas: 0,
      tempoTotal: 0,
      interacoes: 0
    }
  }

  data[key].tempoTotal += Number(segundos || 0)

  salvar(data)
}

/*
========================================
REGISTRAR INTERAÇÃO
========================================
*/
export function registrarInteracao() {
  const data = getData()
  const key = getHojeKey()

  if (!data[key]) {
    data[key] = {
      visitas: 0,
      tempoTotal: 0,
      interacoes: 0
    }
  }

  data[key].interacoes += 1

  salvar(data)
}

/*
========================================
FORMATAR TEMPO
========================================
*/
export function formatarTempo(segundos) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const secs = Math.floor(segundos % 60)

  let resultado = ''

  if (horas > 0) resultado += `${horas}h `
  if (minutos > 0) resultado += `${minutos}min `
  resultado += `${secs}s`

  return resultado
}

/*
========================================
OBTER ANALYTICS
========================================
*/
export function obterAnalyticsMes(mes, ano) {
  const data = getData()

  let totalVisitas = 0
  let tempoTotal = 0
  let totalInteracoes = 0

  Object.keys(data).forEach((dataKey) => {
    const [y, m] = dataKey.split('-')

    if (y === ano && m === mes) {
      totalVisitas += data[dataKey].visitas
      tempoTotal += data[dataKey].tempoTotal
      totalInteracoes += data[dataKey].interacoes
    }
  })

  const tempoMedio =
    totalVisitas > 0 ? tempoTotal / totalVisitas : 0

  const interacoesPorUsuario =
    totalVisitas > 0
      ? totalInteracoes / totalVisitas
      : 0

  return {
    totalVisitas,
    tempoTotal,
    tempoMedio,
    totalInteracoes,
    interacoesPorUsuario,
    tempoTotalFormatado: formatarTempo(tempoTotal),
    tempoMedioFormatado: formatarTempo(tempoMedio)
  }
}