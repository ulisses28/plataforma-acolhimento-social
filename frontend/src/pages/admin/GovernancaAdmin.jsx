import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarDocumentosGovernanca,
  salvarDocumentoGovernanca,
  excluirDocumentoGovernanca
} from '../../services/governancaService'

function GovernancaAdmin() {
  const [documentos, setDocumentos] = useState([])
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('Transparência')
  const [descricao, setDescricao] = useState('')
  const [arquivo, setArquivo] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    setDocumentos(listarDocumentosGovernanca())
  }

  function salvar(e) {
    e.preventDefault()

    if (!titulo.trim()) return alert('Informe o título.')
    if (!descricao.trim()) return alert('Informe a descrição.')

    salvarDocumentoGovernanca({
      titulo,
      categoria,
      descricao,
      arquivo
    })

    setTitulo('')
    setCategoria('Transparência')
    setDescricao('')
    setArquivo('')

    carregar()
  }

  function remover(id) {
    const ok = confirm('Deseja remover este documento?')

    if (!ok) return

    excluirDocumentoGovernanca(id)
    carregar()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Governança Institucional</h1>

          <p style={styles.subtitle}>
            Publique documentos de transparência, equidade, responsabilidade e ética institucional.
          </p>
        </header>

        <section style={styles.grid}>
          <form style={styles.card} onSubmit={salvar}>
            <h2 style={styles.cardTitle}>Publicar documento</h2>

            <label style={styles.label}>Título do documento</label>
            <input
              style={styles.input}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Código de Ética e Conduta"
            />

            <label style={styles.label}>Categoria</label>
            <select
              style={styles.input}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Transparência</option>
              <option>Equidade</option>
              <option>Responsabilidade</option>
              <option>Ética</option>
              <option>Prestação de Contas</option>
            </select>

            <label style={styles.label}>Descrição</label>
            <textarea
              style={styles.textarea}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a finalidade do documento..."
            />

            <label style={styles.label}>Arquivo/documento</label>
            <input
              type="file"
              style={styles.input}
              onChange={(e) => setArquivo(e.target.files?.[0]?.name || '')}
            />

            <button style={styles.button}>Publicar documento</button>
          </form>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Documentos publicados</h2>

            {documentos.length === 0 ? (
              <p style={styles.empty}>Nenhum documento publicado ainda.</p>
            ) : (
              documentos.map((item) => (
                <article key={item.id} style={styles.documentItem}>
                  <span style={styles.badge}>{item.categoria}</span>

                  <h3 style={styles.docTitle}>{item.titulo}</h3>

                  <p style={styles.docText}>{item.descricao}</p>

                  <p style={styles.meta}>
                    Publicado em {item.dataPublicacao}
                  </p>

                  {item.arquivo && (
                    <p style={styles.meta}>
                      Arquivo: {item.arquivo}
                    </p>
                  )}

                  <button
                    type="button"
                    style={styles.removeButton}
                    onClick={() => remover(item.id)}
                  >
                    Remover
                  </button>
                </article>
              ))
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1180px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '28px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.6rem',
    margin: 0
  },
  subtitle: {
    color: '#475569',
    lineHeight: '1.6'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    gap: '24px'
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  label: {
    display: 'block',
    marginTop: '14px',
    marginBottom: '6px',
    fontWeight: '800',
    color: '#334155'
  },
  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    padding: '0 12px',
    boxSizing: 'border-box',
    background: '#f8fbff'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    padding: '12px',
    boxSizing: 'border-box',
    background: '#f8fbff',
    resize: 'vertical'
  },
  button: {
    width: '100%',
    marginTop: '20px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  documentItem: {
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px',
    marginBottom: '14px',
    background: '#f8fbff'
  },
  badge: {
    display: 'inline-block',
    background: '#ffc928',
    color: '#002855',
    padding: '7px 12px',
    borderRadius: '999px',
    fontWeight: '900'
  },
  docTitle: {
    color: '#0B3D91',
    marginBottom: '8px'
  },
  docText: {
    color: '#334155',
    lineHeight: '1.6'
  },
  meta: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  removeButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  empty: {
    color: '#64748b'
  }
}

export default GovernancaAdmin