import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'doadores_lar_batista'

function DoadoresAdmin() {
  const [doadores, setDoadores] = useState([])
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Financeiro')
  const [telefone, setTelefone] = useState('')
  const [obs, setObs] = useState('')

  useEffect(() => {
    const dados = localStorage.getItem(STORAGE_KEY)
    if (dados) {
      setDoadores(JSON.parse(dados))
    }
  }, [])

  function salvarDoadores(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
    setDoadores(lista)
  }

  function handleCadastrar(e) {
    e.preventDefault()

    if (!nome) return alert('Digite o nome')

    const novo = {
      id: Date.now(),
      nome,
      tipo,
      telefone,
      obs
    }

    const novaLista = [...doadores, novo]
    salvarDoadores(novaLista)

    setNome('')
    setTipo('Financeiro')
    setTelefone('')
    setObs('')
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Cadastro de Doadores</h1>

        {/* FORM */}
        <form style={styles.form} onSubmit={handleCadastrar}>
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
          />

          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.input}>
            <option>Financeiro</option>
            <option>Material</option>
          </select>

          <input
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Observação"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button}>Cadastrar</button>
        </form>

        {/* LISTA */}
        <div style={styles.lista}>
          {doadores.length === 0 ? (
            <p>Nenhum doador cadastrado.</p>
          ) : (
            doadores.map((d) => (
              <div key={d.id} style={styles.card}>
                <strong>{d.nome}</strong>
                <p>Tipo: {d.tipo}</p>
                <p>Telefone: {d.telefone}</p>
                <p>{d.obs}</p>
              </div>
            ))
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
  form: {
    display: 'grid',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  button: {
    backgroundColor: '#0B3D91',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  lista: {
    display: 'grid',
    gap: '10px'
  },
  card: {
    background: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  }
}

export default DoadoresAdmin