const STORAGE_KEY = 'analytics_data'

function getHoje() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function registrarVisita() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  const hoje = getHoje()

  if (!data[hoje]) {
    data[hoje] = {
      visitas: 0,
      tempo: 0
    }
  }

  data[hoje].visitas += 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function registrarTempo(segundos) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  const hoje = getHoje()

  if (!data[hoje]) {
    data[hoje] = {
      visitas: 0,
      tempo: 0
    }
  }

  data[hoje].tempo += segundos
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function obterAnalyticsMes(mes, ano) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}

  return Object.entries(data)
    .filter(([dia]) => {
      const [a, m] = dia.split('-')
      return a === String(ano) && m === String(mes)
    })
    .map(([dia, valores]) => ({
      dia,
      visitas: valores.visitas || 0,
      tempo: valores.tempo || 0
    }))
}