import React, { useEffect, useState } from 'react'
import { listarDoacoes } from '../../services/doacoesService'
import AdminHeader from '../../components/ui/AdminHeader'

/*
  RELATÓRIOS ADMIN
  - Exibe ranking por doador
  - Considera apenas doações confirmadas
  - Usa AdminHeader para manter botão voltar e padrão visual
*/

function RelatoriosAdmin() {
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    gerarRelatorio()
  }, [])

  function gerarRelatorio() {
    const doacoes = listarDoacoes()

    const confirmadas = doacoes.filter((d) => d.status === 'Confirmado')
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

    const lista = Object.values(mapa).sort((a, b) => b.total - a.total)

    setRanking(lista)
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <AdminHeader
          title="Relatório por Doador"
          subtitle="Ranking baseado apenas em doações confirmadas."
        />

        <section style={styles.card}>
          {ranking.length === 0 ? (
            <p style={styles.emptyText}>Nenhuma doação confirmada ainda.</p>
          ) : (
            <div style={styles.tableWrapper}>
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
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eaf4ff 0%, #f1f5f9 35%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    fontSize: '14px'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1f2937'
  },
  emptyText: {
    color: '#6b7280',
    margin: 0
  }
}

export default RelatoriosAdmin