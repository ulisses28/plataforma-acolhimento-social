import React, { useState } from 'react'
import { criarDoacao } from '../../services/doacoesService'
import BackButton from '../../components/ui/BackButton' // 🔹 Botão padrão de voltar

/*
  Página pública de doação
  - Permite doação anônima ou identificada
  - Pix (automático) e TED (pendente)
  - UX profissional com botão de voltar padrão
*/

function DoarAgora() {
  const [tipoDoador, setTipoDoador] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [valor, setValor] = useState('')
  const [forma, setForma] = useState('')
  const [comprovante, setComprovante] = useState('')
  const [mensagem, setMensagem] = useState('')

  function handleEnviar(e) {
    e.preventDefault()

    // 🔹 Validações obrigatórias
    if (!tipoDoador) {
      setMensagem('Selecione se deseja doar como doador ou anonimamente.')
      return
    }

    if (tipoDoador === 'identificado' && !nome.trim()) {
      setMensagem('Informe seu nome ou escolha doar anonimamente.')
      return
    }

    if (!forma) {
      setMensagem('Selecione a forma de pagamento.')
      return
    }

    if (forma === 'TED' && !valor.trim()) {
      setMensagem('Informe o valor da TED.')
      return
    }

    // 🔹 Criação da doação
    criarDoacao({
      doador: {
        nome: tipoDoador === 'anonimo' ? 'Anônimo' : nome,
        email,
        categoria: 'Pessoa Física'
      },
      tipoDoacao: 'Financeira',
      valor: forma === 'Pix' ? '' : valor,
      forma,
      comprovante
    })

    // 🔹 Mensagem de retorno
    setMensagem(
      forma === 'Pix'
        ? 'Doação via Pix confirmada automaticamente. Obrigado!'
        : 'TED registrada e aguardando validação do comprovante.'
    )

    // 🔹 Reset
    setTipoDoador('')
    setNome('')
    setEmail('')
    setValor('')
    setForma('')
    setComprovante('')
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* 🔹 BOTÃO VOLTAR PADRÃO */}
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Doar Agora</h1>

          <p style={styles.subtitle}>
            Sua contribuição ajuda a manter o acolhimento, cuidado,
            alimentação e proteção das pessoas atendidas.
          </p>
        </header>

        <section style={styles.grid}>
          
          {/* 🔹 FORMULÁRIO */}
          <form style={styles.card} onSubmit={handleEnviar}>
            <h2 style={styles.sectionTitle}>Dados da doação</h2>

            {/* 🔹 Tipo de doador */}
            <div style={styles.radioGroup}>
              <label style={styles.radioItem}>
                <input
                  type="radio"
                  checked={tipoDoador === 'identificado'}
                  onChange={() => setTipoDoador('identificado')}
                />
                Doar como doador
              </label>

              <label style={styles.radioItem}>
                <input
                  type="radio"
                  checked={tipoDoador === 'anonimo'}
                  onChange={() => setTipoDoador('anonimo')}
                />
                Doar anonimamente
              </label>
            </div>

            {/* 🔹 Campos condicionais */}
            {tipoDoador === 'identificado' && (
              <>
                <label style={styles.label}>Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={styles.input}
                />

                <label style={styles.label}>E-mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </>
            )}

            {/* 🔹 Forma de pagamento */}
            <label style={styles.label}>Forma de pagamento</label>

            <div style={styles.radioGroup}>
              <label style={styles.radioItem}>
                <input
                  type="radio"
                  checked={forma === 'Pix'}
                  onChange={() => setForma('Pix')}
                />
                Pix
              </label>

              <label style={styles.radioItem}>
                <input
                  type="radio"
                  checked={forma === 'TED'}
                  onChange={() => setForma('TED')}
                />
                TED
              </label>
            </div>

            {/* 🔹 TED */}
            {forma === 'TED' && (
              <>
                <label style={styles.label}>Valor</label>
                <input
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  style={styles.input}
                />

                <label style={styles.label}>Comprovante</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setComprovante(e.target.files?.[0]?.name || '')
                  }
                  style={styles.input}
                />
              </>
            )}

            {/* 🔹 Pix info */}
            {forma === 'Pix' && (
              <p style={styles.info}>
                Escaneie o QR Code e doe o valor desejado diretamente no seu banco.
              </p>
            )}

            {/* 🔹 Mensagem */}
            {mensagem && <p style={styles.message}>{mensagem}</p>}

            {/* 🔹 Botão */}
            <button style={styles.button}>
              {forma === 'Pix'
                ? 'Confirmar Pix'
                : forma === 'TED'
                ? 'Enviar TED'
                : 'Continuar'}
            </button>
          </form>

          {/* 🔹 CARD PIX / TED */}
          <aside style={styles.card}>
            <h2 style={styles.sectionTitle}>Dados para doação</h2>

            {!forma && <p>Selecione Pix ou TED para visualizar os dados.</p>}

            {forma === 'Pix' && (
              <>
                <div style={styles.pixBox}>
                  <strong>PIX / CNPJ</strong>
                  <span>27363944000180</span>
                </div>

                <div style={styles.qr}>QR</div>
              </>
            )}

            {forma === 'TED' && (
              <div>
                <p><strong>Banco:</strong> Banestes</p>
                <p><strong>Agência:</strong> 059</p>
                <p><strong>Conta:</strong> 6.948.103</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: { background: '#F1F5F9', padding: '40px 20px' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '20px' },
  title: { color: '#0B3D91' },
  subtitle: { color: '#555' },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },

  card: {
    background: '#fff',
    padding: '24px',
    borderRadius: '14px'
  },

  sectionTitle: { color: '#0B3D91' },

  radioGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '10px'
  },

  radioItem: { cursor: 'pointer' },

  label: { display: 'block', marginTop: '10px' },

  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px'
  },

  button: {
    width: '100%',
    marginTop: '20px',
    padding: '12px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '8px'
  },

  pixBox: {
    background: '#eef6ff',
    padding: '12px',
    borderRadius: '10px'
  },

  qr: {
    marginTop: '20px',
    height: '150px',
    background: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  info: {
    background: '#eef6ff',
    padding: '10px',
    borderRadius: '8px'
  },

  message: {
    marginTop: '10px',
    fontWeight: 'bold'
  }
}

export default DoarAgora