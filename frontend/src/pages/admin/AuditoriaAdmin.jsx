import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { listarAuditorias } from '../../services/auditoriaService'

function AuditoriaAdmin() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarAuditorias()
        setLogs(Array.isArray(dados) ? dados : [])
      } catch (error) {
        setLogs([])
      }
    }

    carregar()
  }, [])

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <section style={styles.card}>
          <h1 style={styles.title}>Auditoria do Sistema</h1>
          <p style={styles.subtitle}>
            Registro das principais ações administrativas realizadas na plataforma.
          </p>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Administrador</th>
                  <th style={styles.th}>Ação</th>
                  <th style={styles.th}>Detalhes</th>
                  <th style={styles.th}>IP</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td style={styles.td}>
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString('pt-BR')
                        : '-'}
                    </td>
                    <td style={styles.td}>{log.admin || '-'}</td>
                    <td style={styles.td}>{log.acao || '-'}</td>
                    <td style={styles.td}>{log.detalhes || '-'}</td>
                    <td style={styles.td}>{log.ip || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && (
            <p style={styles.empty}>Nenhum registro encontrado.</p>
          )}
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f5f9',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1180px',
    margin: '0 auto'
  },
  card: {
    background: '#fff',
    borderRadius: '22px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  title: {
    color: '#0B3D91',
    margin: 0
  },
  subtitle: {
    color: '#475569',
    lineHeight: '1.6'
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: '24px'
  },
  table: {
    width: '100%',
    minWidth: '760px',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '14px',
    borderBottom: '1px solid #dbeafe',
    color: '#0B3D91'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#374151'
  },
  empty: {
    color: '#64748b',
    marginTop: '20px'
  }
}

export default AuditoriaAdmin