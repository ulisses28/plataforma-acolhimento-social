import { useEffect, useState } from 'react'

const STORAGE_KEY = 'parceiros_lar_batista'

function Parceiros() {
  const [parceiros, setParceiros] = useState([])

  useEffect(() => {
    const dados = localStorage.getItem(STORAGE_KEY)
    setParceiros(dados ? JSON.parse(dados) : [])
  }, [])

  const ativos = parceiros.filter((p) => p.status === 'Ativo')

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <h1 style={styles.title}>Parceiros</h1>
        <p style={styles.subtitle}>
          Empresas e instituições que apoiam a missão do Lar Batista Albertine Meador.
        </p>
      </section>

      <section style={styles.grid}>
        {ativos.length === 0 ? (
          <p style={styles.empty}>Nenhum parceiro publicado no momento.</p>
        ) : (
          ativos.map((p) => (
            <article key={p.id} style={styles.card}>
              {p.logo ? (
                <img src={p.logo} alt={p.nomeFantasia} style={styles.logo} />
              ) : (
                <div style={styles.logoFallback}>{p.nomeFantasia?.charAt(0)}</div>
              )}

              <h2 style={styles.name}>{p.nomeFantasia}</h2>
              <p style={styles.text}>{p.tipoParceria || 'Parceiro institucional'}</p>
              <p style={styles.text}>{p.municipio} {p.estado ? `- ${p.estado}` : ''}</p>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#eef4fb', padding: '50px 20px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { color: '#0B3D91', fontSize: '3rem', margin: 0 },
  subtitle: { color: '#475569' },
  grid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '22px' },
  card: { background: '#fff', borderRadius: '22px', padding: '28px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  logo: { width: '150px', height: '90px', objectFit: 'contain', marginBottom: '16px' },
  logoFallback: { width: '90px', height: '90px', borderRadius: '18px', background: '#0B3D91', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', fontWeight: '900' },
  name: { color: '#0B3D91', fontSize: '1.4rem' },
  text: { color: '#64748b' },
  empty: { color: '#64748b' }
}

export default Parceiros