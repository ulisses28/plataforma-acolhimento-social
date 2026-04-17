import React, { useEffect, useState } from 'react'
import { listarDoacoes } from '../../services/doacoesService'

function RelatoriosAdmin() {
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    gerarRelatorio()
  }, [])

  function gerarRelatorio() {
    const doacoes = listarDoacoes()

    // pegar só confirmadas
    const confirmadas = doacoes.filter(d => d.status === 'Confirmado')

    const mapa = {}

    confirmadas.forEach((d) => {
      const nome = d.doador || 'Anônimo'

      const valorNumerico = Number(
        String(d.valor)
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim()
      )

      if (!mapa[nome]) {
        mapa[nome] = {
          nome,
          total: 0,
          quantidade: 0
        }
      }

      mapa[nome].total += isNaN(valorNumerico) ? 0 : valorNumerico
      mapa[nome].quantidade += 1
    })

    const lista = Object.values(mapa)

    // ordenar por maior valor
    lista.sort((a, b) => b.total - a.total)

    setRanking(lista)
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Relatório por Doador</h1>
        <p style={styles.subtitle}>
          Ranking baseado apenas em doações confirmadas.
        </p>

        <div style={styles.card}>
          {ranking.length === 0 ? (
            <p>Nenhuma doação confirmada ainda.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Doador</th>
                  <th style={styles.th}>Quantidade</th>
                  <th style={styles.th}>Total</th>
                </tr>
              </thead>

              <tbody>
                {ranking.map((d, index) => (
                  <tr key={d.nome}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{d.nome}</td>
                    <td style={styles.td}>{d.quantidade}</td>
                    <td style={styles.td}>
                      {d.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F1F5F9',
    padding: '40px'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    color: '#0B3D91'
  },
  subtitle: {
    marginBottom: '20px',
    color: '#555'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '2px solid #ddd'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee'
  }
}

export default RelatoriosAdmin