import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import chullyImg from '../../assets/chully_robo.png'
import { registrarInteracao } from '../../services/analyticsService'

function AssistenteVirtual() {
  const [aberto, setAberto] = useState(false)
  const [pergunta, setPergunta] = useState('')
  const [iniciou, setIniciou] = useState(false)
  const [mensagens, setMensagens] = useState([])

  const [mobile, setMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function verificarTela() {
      setMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', verificarTela)

    return () => {
      window.removeEventListener('resize', verificarTela)
    }
  }, [])

  function saudacao() {
    const hora = new Date().getHours()

    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  function iniciarAtendimento() {
    setIniciou(true)

    setMensagens([
      {
        tipo: 'bot',
        texto: `${saudacao()}! Eu sou a Chully, sua assistente virtual. Posso ajudar com doações, voluntariado, vagas, transparência, necessidades atuais, parceiros e contato.`
      }
    ])
  }

  const respostas = {
    doacao:
      'Para fazer uma doação, acesse a página Doar Agora. Lá você encontra as opções Pix e TED. Sua contribuição ajuda no acolhimento, alimentação, cuidado e proteção.',
    voluntario:
      'Para ser voluntário, acesse Seja um Voluntário. Você poderá conhecer formas de apoiar atividades, eventos, bazar solidário e organização das doações.',
    vagas:
      'Para enviar currículo, acesse Vagas. Você pode informar seus dados, área de interesse, anexar currículo ou carta de apresentação e entrar no banco de talentos.',
    transparencia:
      'Na página Transparência você acompanha documentos, relatórios, gráficos financeiros e prestações de contas da instituição.',
    necessidades:
      'Em Necessidades Atuais você visualiza categorias como alimentos, roupas, utensílios, higiene, escolar e outros itens importantes.',
    parceiros:
      'Empresas e instituições podem apoiar acessando Parceiros. O apoio institucional fortalece o impacto social do Lar Batista.',
    contato:
      'Você pode entrar em contato pelo telefone (27) 3328-5165 ou pelo e-mail visitas@larbatista.org.br.'
  }

  function responderRapido(assunto) {
    if (!iniciou) iniciarAtendimento()

    setMensagens((atual) => [
      ...atual,
      { tipo: 'user', texto: assunto },
      { tipo: 'bot', texto: respostas[assunto] }
    ])
  }

  function responderTexto(e) {
    e.preventDefault()

    const texto = pergunta.trim()
    if (!texto) return

    if (!iniciou) {
      iniciarAtendimento()
    }

    const t = texto.toLowerCase()

    let resposta =
      'Posso te ajudar com doações, voluntariado, vagas, transparência, necessidades atuais, parceiros e contato. Escolha uma opção abaixo ou digite sua dúvida.'

    if (t.includes('doa') || t.includes('pix') || t.includes('ted')) resposta = respostas.doacao
    else if (t.includes('volunt')) resposta = respostas.voluntario
    else if (t.includes('vaga') || t.includes('curr')) resposta = respostas.vagas
    else if (t.includes('transpar') || t.includes('prestação') || t.includes('prestacao')) resposta = respostas.transparencia
    else if (t.includes('necess') || t.includes('alimento') || t.includes('roupa')) resposta = respostas.necessidades
    else if (t.includes('parce')) resposta = respostas.parceiros
    else if (t.includes('contato') || t.includes('telefone') || t.includes('email')) resposta = respostas.contato

    setMensagens((atual) => [
      ...atual,
      { tipo: 'user', texto },
      { tipo: 'bot', texto: resposta }
    ])

    setPergunta('')
  }

  return (
    <>
      {aberto && (
        <section style={{ ...styles.chatBox, ...(mobile ? styles.chatBoxMobile : {}) }} >
          <header style={styles.header}>
            <img src={chullyImg} alt="Chully" style={styles.avatar} />

            {!mobile && (
              <div>
                <strong>Chully</strong>
                <small>Assistente virtual</small>
              </div>
            )}

            <button style={styles.close} onClick={() => setAberto(false)}>
              ×
            </button>
          </header>

          <div style={styles.messages}>
            {!iniciou && (
              <div style={styles.botMsg}>
                {saudacao()}! Digite sua dúvida para começar o atendimento.
              </div>
            )}

            {mensagens.map((msg, index) => (
              <div key={index} style={msg.tipo === 'bot' ? styles.botMsg : styles.userMsg}>
                {msg.texto}
              </div>
            ))}
          </div>

          <form style={styles.form} onSubmit={responderTexto}>
            <input
              style={styles.input}
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Digite sua dúvida..."
            />

            <button style={styles.sendButton}>Enviar</button>
          </form>

          {iniciou && (
            <div style={styles.options}>
              <button onClick={() => responderRapido('doacao')}>Doações</button>
              <button onClick={() => responderRapido('voluntario')}>Voluntariado</button>
              <button onClick={() => responderRapido('vagas')}>Vagas</button>
              <button onClick={() => responderRapido('transparencia')}>Transparência</button>
              <button onClick={() => responderRapido('necessidades')}>Necessidades</button>
              <button onClick={() => responderRapido('parceiros')}>Parceiros</button>
              <button onClick={() => responderRapido('contato')}>Contato</button>
            </div>
          )}

          <div style={styles.footerText}>
            Fale com a Chully, sua assistente virtual, e tire dúvidas sobre
            doações, vagas, voluntariado, transparência e muito mais.
          </div>
        </section>
      )}

      <button
          style={{
            ...styles.floatButton,
            ...(mobile ? styles.floatButtonMobile : {})
          }}
          onClick={() => setAberto(!aberto)}
        >
        <img src={chullyImg} alt="Chully" style={styles.floatAvatar} />

        <div>
          <strong>Chully</strong>
          <small>Assistente virtual</small>
        </div>
      </button>
    </>
  )
}

const styles = {
  floatButton: {
    position: 'fixed',
    right: '24px',
    bottom: '155px',
    minWidth: '230px',
    height: '70px',
    borderRadius: '20px',
    border: 'none',
    background: 'linear-gradient(135deg, #002855, #0B3D91)',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 9999,
    boxShadow: '0 12px 28px rgba(0,0,0,0.28)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    textAlign: 'left'
  },
  floatButtonMobile: {
  right: '14px',
  bottom: '86px',
  minWidth: '54px',
  width: '54px',
  height: '54px',
  borderRadius: '50%',
  padding: '6px',
  justifyContent: 'center',
  gap: 0
  },
  floatAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#fff'
  },

  chatBox: {
    position: 'fixed',
    right: '24px',
    bottom: '235px',
    width: '370px',
    maxWidth: 'calc(100vw - 40px)',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 18px 45px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    zIndex: 9999
  },
  chatBoxMobile: {
  right: '10px',
  bottom: '150px',
  width: 'calc(100vw - 20px)',
  maxHeight: '70vh'
  },
  header: {
    background: 'linear-gradient(135deg, #002855, #0B3D91)',
    color: '#fff',
    padding: '14px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },

  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#fff'
  },

  close: {
    marginLeft: 'auto',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontWeight: '900'
  },

  messages: {
    padding: '14px',
    maxHeight: '250px',
    overflowY: 'auto',
    background: '#f8fbff'
  },

  botMsg: {
    background: '#eef6ff',
    color: '#0B3D91',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '10px',
    fontSize: '14px',
    lineHeight: '1.5'
  },

  userMsg: {
    background: '#ffc928',
    color: '#002855',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '10px',
    fontSize: '14px',
    textAlign: 'right',
    fontWeight: '800'
  },

  form: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    borderTop: '1px solid #e5e7eb'
  },

  input: {
    flex: 1,
    border: '1px solid #bfdbfe',
    borderRadius: '10px',
    padding: '10px',
    outline: 'none'
  },

  sendButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 12px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  options: {
    padding: '12px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },

  footerText: {
  padding: '14px 18px',
  borderTop: '1px solid #e5e7eb',
  background: '#f8fbff',
  color: '#475569',
  fontSize: '13px',
  lineHeight: '1.6',
  textAlign: 'center',
  fontWeight: '500'
  },

  
}

export default AssistenteVirtual