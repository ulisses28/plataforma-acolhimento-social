const KEY = 'analytics_visitas'

function getData() {
  const data = JSON.parse(localStorage.getItem(KEY)) || {}
  return data
}

function salvar(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function getHojeKey() {
  const hoje = new Date()
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
}

// REGISTRAR VISITA
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

// REGISTRAR TEMPO
export function registrarTempo(segundos) {
  const data = getData()
  const key = getHojeKey()

  if (!data[key]) return

  data[key].tempoTotal += segundos

  salvar(data)
}

// 🔥 NOVO: registrar interação
export function registrarInteracao() {
  const data = getData()
  const key = getHojeKey()

  if (!data[key]) return

  data[key].interacoes += 1

  salvar(data)
}

// OBTER DADOS DO MÊS
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

  const tempoMedio = totalVisitas > 0 ? tempoTotal / totalVisitas : 0
  const interacoesPorUsuario = totalVisitas > 0 ? totalInteracoes / totalVisitas : 0

  return {
    totalVisitas,
    tempoTotal,
    tempoMedio,
    totalInteracoes,
    interacoesPorUsuario
  }
}