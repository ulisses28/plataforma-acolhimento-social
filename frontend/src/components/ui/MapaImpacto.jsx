import React from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'

/*
  MapaImpacto
  - Mostra o mapa mundial
  - Colore todos os países
  - Destaca países com doações
  - Mostra pontos vermelhos onde existem doações
  - Exibe nome do país ao passar o mouse
*/

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const coordenadasPaises = {
  brazil: [-51.9253, -14.235],
  brasil: [-51.9253, -14.235],
  portugal: [-8.2245, 39.3999],
  argentina: [-63.6167, -38.4161],
  chile: [-71.543, -35.6751],
  paraguay: [-58.4438, -23.4425],
  paraguai: [-58.4438, -23.4425],
  uruguay: [-55.7658, -32.5228],
  uruguai: [-55.7658, -32.5228],
  'united states': [-95.7129, 37.0902],
  'estados unidos': [-95.7129, 37.0902]
}

const coresGlobais = [
  '#1d4ed8',
  '#2563eb',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#a855f7'
]

function MapaImpacto({ dadosPorPais = [] }) {
  const totalDoacoes = dadosPorPais.reduce(
    (acc, item) => acc + Number(item.value || 0),
    0
  )

  const maiorValor = Math.max(
    ...dadosPorPais.map((item) => Number(item.value || 0)),
    1
  )

  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  function buscarQuantidadePais(nomePais) {
    const nomeNormalizado = normalizar(nomePais)

    const encontrado = dadosPorPais.find((item) => {
      const itemNormalizado = normalizar(item.name)

      return (
        itemNormalizado === nomeNormalizado ||
        (itemNormalizado === 'brasil' && nomeNormalizado === 'brazil') ||
        (itemNormalizado === 'brazil' && nomeNormalizado === 'brasil')
      )
    })

    return Number(encontrado?.value || 0)
  }

  function corPorQuantidade(qtd, index) {
    if (qtd > 0) {
      const intensidade = qtd / maiorValor

      if (intensidade >= 0.75) return '#ef4444'
      if (intensidade >= 0.5) return '#f97316'
      if (intensidade >= 0.25) return '#facc15'

      return '#22c55e'
    }

    return coresGlobais[index % coresGlobais.length]
  }

  const marcadores = dadosPorPais
    .map((item) => {
      const chave = normalizar(item.name)
      const coordenadas = coordenadasPaises[chave]

      if (!coordenadas) return null

      return {
        nome: item.name,
        quantidade: Number(item.value || 0),
        coordenadas
      }
    })
    .filter(Boolean)

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Mapa de Impacto Social</h2>

      <p style={styles.subtitle}>
        Visualização global do alcance das doações. Passe o mouse sobre os países
        para ver o nome e a quantidade de doações.
      </p>

      <div style={styles.infoBox}>
        <strong>{dadosPorPais.length}</strong>
        <span> países alcançados</span>
        <br />
        <strong>{totalDoacoes}</strong>
        <span> doações mapeadas</span>
      </div>

      <div style={styles.mapBox}>
        <ComposableMap projectionConfig={{ scale: 145 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
                const nomePais = geo.properties.name || 'País'
                const quantidade = buscarQuantidadePais(nomePais)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: corPorQuantidade(quantidade, index),
                        stroke: '#e2e8f0',
                        strokeWidth: 0.35,
                        outline: 'none'
                      },
                      hover: {
                        fill: quantidade > 0 ? '#dc2626' : '#0B3D91',
                        stroke: '#ffffff',
                        strokeWidth: 0.7,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#2563eb',
                        outline: 'none'
                      }
                    }}
                  >
                    <title>
                      {nomePais} - {quantidade} doações
                    </title>
                  </Geography>
                )
              })
            }
          </Geographies>

          {marcadores.map((item) => (
            <Marker key={item.nome} coordinates={item.coordenadas}>
              <circle r={7} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />

              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fill: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700
                }}
              >
                {item.quantidade}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div style={styles.legend}>
        <span><b style={{ background: '#22c55e' }} /> Doações baixas</span>
        <span><b style={{ background: '#facc15' }} /> Doações médias</span>
        <span><b style={{ background: '#f97316' }} /> Doações altas</span>
        <span><b style={{ background: '#ef4444' }} /> Muito alto</span>
      </div>
    </section>
  )
}

const styles = {
  card: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  title: {
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    color: '#94a3b8',
    lineHeight: '1.6'
  },
  infoBox: {
    color: '#ffffff',
    background: '#111827',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '16px'
  },
  mapBox: {
    width: '100%',
    background: 'linear-gradient(180deg, #0B3D91 0%, #082f6f 50%, #061f4a 100%)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  legend: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '14px',
    color: '#cbd5e1',
    fontSize: '14px'
  }
}

export default MapaImpacto