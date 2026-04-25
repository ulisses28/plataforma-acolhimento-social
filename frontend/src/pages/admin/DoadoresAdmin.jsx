import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarDoadores } from '../../services/doadoresService'
import { listarDoacoes } from '../../services/doacoesService'
import BackButton from '../../components/ui/BackButton'
import AdminHeader from '../../components/ui/AdminHeader'
/*
  LISTAGEM DE DOADORES (ADMIN)
  - Mostra todos os doadores cadastrados
  - Exibe última doação e quantidade
  - Permite acessar ficha completa
*/

function DoadoresAdmin() {
  const [doadores, setDoadores] = useState([])
  const [doacoes, setDoacoes] = useState([])

  /*
    Carregamento inicial
  */
  useEffect(() => {
    setDoadores(listarDoadores())
    setDoacoes(listarDoacoes())
  }, [])

  /*
    Atualização automática (simulação tempo real)
  */
  useEffect(() => {
    const intervalo = setInterval(() => {
      setDoadores(listarDoadores())
      setDoacoes(listarDoacoes())
    }, 2000)

    return () => clearInterval(intervalo)
  }, [])

  /*
    Monta resumo por doador
  */
  const listaComResumo = useMemo(() => {
    return doadores.map((doador) => {
      const historico = doacoes
        .filter((item) => item.doador === doador.nome)
        .sort((a, b) => converterDataBR(b.data) - converterDataBR(a.data))

      return {
        ...doador,
        ultimaDoacao: historico[0]?.data || '-',
        totalDoacoes: historico.length
      }
    })
  }, [doadores, doacoes])

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* ================= BOTÃO VOLTAR ================= */}
        <BackButton />

        {/* ================= HEADER ================= */}
        <header style={styles.header}>
          <h1 style={styles.title}>Doadores</h1>
          <p style={styles.subtitle}>
            Visualize e acompanhe os doadores cadastrados no sistema.
          </p>
        </header>

        {/* ================= RESUMO ================= */}
        <section style={styles.summaryCard}>
          <h2 style={styles.summaryNumber}>{listaComResumo.length}</h2>
          <p style={styles.summaryLabel}>Doadores cadastrados</p>
        </section>

        {/* ================= TABELA ================= */}
        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Lista de doadores</h2>
            <p style={styles.tableSubtitle}>
              Clique no nome do doador para acessar a ficha completa e o histórico detalhado.
            </p>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Telefone</th>
                  <th style={styles.th}>Observação</th>
                  <th style={styles.th}>Última doação</th>
                  <th style={styles.th}>Qtd. de doações</th>
                </tr>
              </thead>

              <tbody>
                {listaComResumo.length === 0 ? (
                  <tr>
                    <td style={styles.emptyTd} colSpan="5">
                      Nenhum doador cadastrado até o momento.
                    </td>
                  </tr>
                ) : (
                  listaComResumo.map((doador) => (
                    <tr key={doador.id}>
                      <td style={styles.td}>
                        {/* LINK PARA DETALHE */}
                        <Link
                          to={`/admin/doadores/${doador.id}`}
                          style={styles.linkNome}
                        >
                          {doador.nome}
                        </Link>
                      </td>

                      <td style={styles.td}>{doador.telefone || '-'}</td>
                      <td style={styles.td}>{doador.obs || '-'}</td>
                      <td style={styles.td}>{doador.ultimaDoacao}</td>
                      <td style={styles.td}>{doador.totalDoacoes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  )
}

/*
  Conversão de data BR para objeto Date
*/
function converterDataBR(dataBR) {
  if (!dataBR || dataBR === '-') return new Date(0)
  const [dia, mes, ano] = dataBR.split('/')
  return new Date(`${ano}-${mes}-${dia}T00:00:00`)
}

/* ================= ESTILOS ================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eaf4ff 0%, #f1f5f9 35%, #f8fbff 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    color: '#0B3D91',
    fontSize: '2.2rem'
  },
  subtitle: {
    marginTop: '10px',
    color: '#4b5563'
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px'
  },
  summaryNumber: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#0B3D91'
  },
  summaryLabel: {
    marginTop: '10px',
    color: '#4b5563'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px'
  },
  tableHeader: {
    marginBottom: '20px'
  },
  tableTitle: {
    margin: 0,
    color: '#0B3D91'
  },
  tableSubtitle: {
    marginTop: '8px',
    color: '#6b7280'
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
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9'
  },
  emptyTd: {
    padding: '20px',
    textAlign: 'center'
  },
  linkNome: {
    color: '#0B3D91',
    fontWeight: '700',
    textDecoration: 'none'
  }
}

export default DoadoresAdmin