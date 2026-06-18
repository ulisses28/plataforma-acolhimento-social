import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import chullyImg from '../../assets/chully_robo.png'
import { registrarInteracao } from '../../services/analyticsService'

/*
  COMPONENTE: AssistenteVirtual

  Objetivo:
  - Tornar a Chully mais inteligente e útil para visitantes do site.
  - Responder dúvidas frequentes sobre doações, Pix, bazar, voluntariado,
    vagas, transparência, projetos, parceiros, contato e jogos.
  - Direcionar o usuário para páginas internas do site.
  - Manter uma solução simples, sem depender de API paga de inteligência artificial.

  Observação:
  Esta versão usa "intenção por palavras-chave".
  Ou seja, a Chully identifica termos digitados e escolhe a melhor resposta.
*/

function AssistenteVirtual() {
  const [aberto, setAberto] = useState(false)
  const [pergunta, setPergunta] = useState('')
  const [iniciou, setIniciou] = useState(false)
  const [mensagens, setMensagens] = useState([])
  const [mobile, setMobile] = useState(window.innerWidth <= 768)

  const mensagensRef = useRef(null)

  /*
    Ajusta o comportamento visual quando a tela muda entre desktop e mobile.
  */
  useEffect(() => {
    function verificarTela() {
      setMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', verificarTela)

    return () => {
      window.removeEventListener('resize', verificarTela)
    }
  }, [])

  /*
    Sempre que chegar nova mensagem, o chat desce automaticamente.
  */
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight
    }
  }, [mensagens])

  function saudacao() {
    const hora = new Date().getHours()

    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  /*
    Remove acentos e deixa tudo minúsculo.
    Isso ajuda a Chully entender "doação", "doacao", "voluntário", "voluntario" etc.
  */
  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  /*
    Pequeno registro de interação.
    Uso em try/catch para não quebrar a Chully caso o analytics falhe.
  */
  function registrarAcaoChat(tipo, detalhe) {
    try {
      registrarInteracao({
        tipo: `chully_${tipo}`,
        detalhe
      })
    } catch (erro) {
      console.warn('Não foi possível registrar interação da Chully:', erro)
    }
  }

  function iniciarAtendimento() {
    setIniciou(true)

    setMensagens([
      {
        tipo: 'bot',
        texto: `${saudacao()}! Eu sou a Chully, assistente virtual do Lar Batista. Posso ajudar com doações, Pix, bazar solidário, voluntariado, vagas, projetos, transparência, parceiros, contato e jogos educativos.`,
        links: [
          { label: 'Doar agora', to: '/doar-agora' },
          { label: 'Seja voluntário', to: '/voluntario' },
          { label: 'Conhecer projetos', to: '/projetos' }
        ]
      }
    ])

    registrarAcaoChat('inicio', 'Usuário iniciou atendimento com a Chully')
  }

  /*
    Base de conhecimento da Chully.
    Cada assunto possui texto, palavras-chave e links internos.
  */
  const baseConhecimento = {
    doacao: {
      titulo: 'Doações',
      palavras: [
        'doacao',
        'doar',
        'doe',
        'ajudar',
        'contribuir',
        'contribuicao',
        'pix',
        'ted',
        'dinheiro',
        'deposito',
        'banco',
        'donativo'
      ],
      texto:
        'Você pode ajudar o Lar Batista por meio de doações financeiras, Pix, doações de alimentos, roupas, calçados, itens de higiene, materiais escolares e outros bens. Acesse a página Doar Agora para ver as formas de contribuição disponíveis.',
      links: [{ label: 'Ir para Doar Agora', to: '/doar-agora' }]
    },

    pix: {
      titulo: 'Pix',
      palavras: [
        'pix',
        'chave pix',
        'qr code',
        'qrcode',
        'copia e cola',
        'copia cola',
        'pagamento',
        'pagar'
      ],
      texto:
        'O Pix é uma das formas mais rápidas de contribuir. Na página Doar Agora você encontra as informações de doação. Estamos melhorando essa área para exibir QR Code e botão de copiar chave Pix de forma mais prática.',
      links: [{ label: 'Ver informações do Pix', to: '/doar-agora' }]
    },

    bazar: {
      titulo: 'Bazar Solidário',
      palavras: [
        'bazar',
        'roupa',
        'calcado',
        'calçado',
        'pecas',
        'peças',
        'doacoes de roupa',
        'brecho',
        'lojinha'
      ],
      texto:
        'O Bazar Solidário ajuda a transformar doações em recursos para as demandas das residentes. Voluntários podem apoiar na triagem, organização das peças, montagem do espaço, atendimento ao público e divulgação das campanhas.',
      links: [
        { label: 'Conhecer projetos', to: '/projetos' },
        { label: 'Ser voluntário', to: '/voluntario' }
      ]
    },

    voluntario: {
      titulo: 'Voluntariado',
      palavras: [
        'voluntario',
        'voluntaria',
        'voluntariado',
        'ajudar presencial',
        'quero ajudar',
        'trabalho voluntario',
        'ser voluntario'
      ],
      texto:
        'Os voluntários podem contribuir com apoio nas rotinas diárias, escuta, interação, atividades recreativas e educativas, eventos, bazar solidário, organização de doações, campanhas e apoio administrativo quando necessário. O voluntário atua como apoio e não substitui o profissional contratado.',
      links: [{ label: 'Seja um voluntário', to: '/voluntario' }]
    },

    vagas: {
      titulo: 'Vagas e Currículos',
      palavras: [
        'vaga',
        'vagas',
        'emprego',
        'trabalho',
        'curriculo',
        'currículo',
        'banco de talentos',
        'processo seletivo',
        'contratacao',
        'contratação'
      ],
      texto:
        'Na página Vagas você pode conhecer oportunidades e enviar currículo para o banco de talentos. Informe seus dados, área de interesse e, se disponível, anexe seu currículo ou carta de apresentação.',
      links: [{ label: 'Ver vagas', to: '/vagas' }]
    },

    transparencia: {
      titulo: 'Transparência',
      palavras: [
        'transparencia',
        'transparência',
        'prestacao',
        'prestação',
        'contas',
        'relatorio',
        'relatório',
        'documentos',
        'financeiro',
        'gastos'
      ],
      texto:
        'Na página Transparência você pode acompanhar informações institucionais, documentos, relatórios e prestações de contas da instituição.',
      links: [{ label: 'Ver transparência', to: '/transparencia' }]
    },

    governanca: {
      titulo: 'Governança',
      palavras: [
        'governanca',
        'governança',
        'diretoria',
        'estatuto',
        'institucional',
        'conselho',
        'gestao',
        'gestão'
      ],
      texto:
        'Na página Governança você encontra informações institucionais importantes sobre organização, gestão, documentos e estrutura administrativa do Lar Batista.',
      links: [{ label: 'Ver governança', to: '/governanca-institucional' }]
    },

    necessidades: {
      titulo: 'Necessidades Atuais',
      palavras: [
        'necessidade',
        'necessidades',
        'alimento',
        'alimentos',
        'higiene',
        'material escolar',
        'escolar',
        'utensilios',
        'utensílios',
        'fralda',
        'limpeza'
      ],
      texto:
        'As necessidades podem envolver alimentos, roupas, calçados, higiene, materiais escolares, utensílios, limpeza e outros itens importantes para a rotina da instituição. Você pode contribuir acessando a página Doar Agora.',
      links: [{ label: 'Como doar', to: '/doar-agora' }]
    },

    parceiros: {
      titulo: 'Parceiros',
      palavras: [
        'parceiro',
        'parceiros',
        'empresa',
        'empresas',
        'igreja',
        'igrejas',
        'apoiador',
        'apoiadores',
        'patrocinio',
        'patrocínio'
      ],
      texto:
        'Empresas, igrejas, escolas e instituições podem apoiar o Lar Batista com doações, campanhas, serviços, alimentos, bens ou contribuições financeiras. Esse apoio fortalece o impacto social da instituição.',
      links: [{ label: 'Ser parceiro', to: '/parceiros' }]
    },

    contato: {
      titulo: 'Contato',
      palavras: [
        'contato',
        'telefone',
        'email',
        'e-mail',
        'whatsapp',
        'zap',
        'endereco',
        'endereço',
        'onde fica',
        'localizacao',
        'localização'
      ],
      texto:
        'O Lar Batista Albertine Meador está localizado na Rua Santos Dumont, 120, Parque Residencial Laranjeiras, Serra/ES, CEP 29.165-048. Telefone: (27) 3328-5165. E-mails institucionais: gri@larbatista.org.br e financeiro@larbatista.org.br.',
      links: [{ label: 'Conhecer a instituição', to: '/quem-somos' }]
    },

    quemSomos: {
      titulo: 'Quem Somos',
      palavras: [
        'quem somos',
        'historia',
        'história',
        'lar batista',
        'instituicao',
        'instituição',
        'missao',
        'missão',
        'visao',
        'visão',
        'valores'
      ],
      texto:
        'O Lar Batista Albertine Meador atua no acolhimento institucional de crianças, adolescentes e jovens em situação de vulnerabilidade social, promovendo cuidado, proteção, educação, reintegração familiar, adoção e autonomia.',
      links: [{ label: 'Ler Quem Somos', to: '/quem-somos' }]
    },

    projetos: {
      titulo: 'Projetos e Serviços',
      palavras: [
        'projeto',
        'projetos',
        'servico',
        'serviço',
        'servicos',
        'serviços',
        'casa lar',
        'casas lares',
        'republica',
        'república',
        'acolhimento'
      ],
      texto:
        'Na página Projetos você encontra informações sobre casas lares, república de jovens, bazar solidário, parceiros, padrinhos, profissionais, rotinas e formas de sustentação da instituição.',
      links: [{ label: 'Ver projetos', to: '/projetos' }]
    },

    jogos: {
      titulo: 'Jogos Educativos',
      palavras: [
        'jogo',
        'jogos',
        'aventura dos blocos',
        'blocos',
        'quiz',
        'educativo',
        'brincar',
        'game'
      ],
      texto:
        'A área de jogos educativos foi criada para oferecer experiências simples, lúdicas e educativas. No momento, a Aventura dos Blocos está disponível, e outros jogos aparecem como Em breve.',
      links: [{ label: 'Abrir jogos', to: '/jogos' }]
    },

    noticias: {
      titulo: 'Notícias, Artigos e Vídeos',
      palavras: [
        'noticia',
        'notícias',
        'noticias',
        'artigo',
        'artigos',
        'video',
        'vídeo',
        'videos',
        'galeria'
      ],
      texto:
        'O site possui áreas de notícias, artigos institucionais e galeria de vídeos educativos para ampliar o acesso à informação e fortalecer a conscientização social.',
      links: [
        { label: 'Ver artigos', to: '/artigos' },
        { label: 'Galeria de vídeos', to: '/galeria-videos' }
      ]
    },

    login: {
      titulo: 'Acesso e Painéis',
      palavras: [
        'login',
        'entrar',
        'senha',
        'painel',
        'doador',
        'admin',
        'administrador',
        'recuperar senha'
      ],
      texto:
        'O botão Entrar dá acesso às áreas de login disponíveis no site. Se você é doador ou administrador, use o painel correspondente. Para dúvidas de acesso, procure o suporte institucional.',
      links: [{ label: 'Entrar', to: '/login' }]
    },

    saudacao: {
      titulo: 'Saudação',
      palavras: [
        'oi',
        'ola',
        'olá',
        'bom dia',
        'boa tarde',
        'boa noite',
        'tudo bem',
        'chully'
      ],
      texto:
        'Olá! Eu sou a Chully. Posso te ajudar com doações, Pix, voluntariado, bazar, projetos, vagas, transparência, parceiros, contato e jogos educativos.',
      links: [
        { label: 'Doar agora', to: '/doar-agora' },
        { label: 'Voluntariado', to: '/voluntario' }
      ]
    },

    agradecimento: {
      titulo: 'Agradecimento',
      palavras: [
        'obrigado',
        'obrigada',
        'valeu',
        'ajudou',
        'grato',
        'gratidao',
        'gratidão'
      ],
      texto:
        'Fico feliz em ajudar! Quando precisar, é só chamar a Chully novamente. Sua participação fortalece a missão do Lar Batista.',
      links: []
    }
  }

  /*
    Identifica qual assunto combina melhor com a mensagem digitada.
  */
  function detectarIntencao(textoDigitado) {
    const texto = normalizarTexto(textoDigitado)

    let melhorAssunto = null
    let melhorPontuacao = 0

    Object.entries(baseConhecimento).forEach(([chave, assunto]) => {
      let pontuacao = 0

      assunto.palavras.forEach((palavra) => {
        const termo = normalizarTexto(palavra)

        if (texto.includes(termo)) {
          pontuacao += termo.length > 6 ? 2 : 1
        }
      })

      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao
        melhorAssunto = chave
      }
    })

    return melhorAssunto
  }

  function criarRespostaPadrao() {
    return {
      tipo: 'bot',
      texto:
        'Entendi sua mensagem. No momento, posso ajudar melhor com doações, Pix, bazar, voluntariado, vagas, projetos, transparência, governança, parceiros, contato e jogos educativos. Toque em uma opção abaixo ou reformule sua pergunta.',
      links: [
        { label: 'Doar agora', to: '/doar-agora' },
        { label: 'Seja voluntário', to: '/voluntario' },
        { label: 'Projetos', to: '/projetos' },
        { label: 'Contato', to: '/quem-somos' }
      ]
    }
  }

  function criarMensagemBot(assunto) {
    if (!assunto) return criarRespostaPadrao()

    return {
      tipo: 'bot',
      texto: baseConhecimento[assunto].texto,
      links: baseConhecimento[assunto].links || []
    }
  }

  function responderRapido(assunto) {
    if (!iniciou) {
      iniciarAtendimento()
    }

    const resposta = criarMensagemBot(assunto)

    setMensagens((atual) => [
      ...atual,
      {
        tipo: 'user',
        texto: baseConhecimento[assunto]?.titulo || assunto
      },
      resposta
    ])

    registrarAcaoChat('opcao_rapida', assunto)
  }

  function responderTexto(e) {
    e.preventDefault()

    const texto = pergunta.trim()
    if (!texto) return

    const intencao = detectarIntencao(texto)
    const resposta = criarMensagemBot(intencao)

    if (!iniciou) {
      setIniciou(true)
    }

    setMensagens((atual) => [
      ...atual,
      { tipo: 'user', texto },
      resposta
    ])

    registrarAcaoChat('pergunta', texto)

    setPergunta('')
  }

  function abrirOuFecharChat() {
    const novoEstado = !aberto
    setAberto(novoEstado)

    if (novoEstado && !iniciou) {
      iniciarAtendimento()
    }
  }

  const opcoesRapidas = [
    { id: 'doacao', label: 'Doações' },
    { id: 'pix', label: 'Pix' },
    { id: 'bazar', label: 'Bazar' },
    { id: 'voluntario', label: 'Voluntariado' },
    { id: 'vagas', label: 'Vagas' },
    { id: 'transparencia', label: 'Transparência' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'contato', label: 'Contato' }
  ]

  return (
    <>
      {aberto && (
        <section
          style={{
            ...styles.chatBox,
            ...(mobile ? styles.chatBoxMobile : {})
          }}
        >
          <header style={styles.header}>
            <img src={chullyImg} alt="Chully" style={styles.avatar} />

            <div style={styles.headerText}>
              <strong>Chully</strong>
              <small>Assistente virtual</small>
            </div>

            <button
              type="button"
              style={styles.close}
              onClick={() => setAberto(false)}
              aria-label="Fechar assistente virtual"
            >
              ×
            </button>
          </header>

          <div ref={mensagensRef} style={styles.messages}>
            {mensagens.map((msg, index) => (
              <div
                key={`${msg.tipo}-${index}`}
                style={msg.tipo === 'bot' ? styles.botMsg : styles.userMsg}
              >
                <p style={styles.msgText}>{msg.texto}</p>

                {msg.links && msg.links.length > 0 && (
                  <div style={styles.msgLinks}>
                    {msg.links.map((link) => (
                      <Link
                        key={`${link.to}-${link.label}`}
                        to={link.to}
                        style={styles.msgLink}
                        onClick={() =>
                          registrarAcaoChat('clique_link', link.label)
                        }
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form style={styles.form} onSubmit={responderTexto}>
            <input
              style={styles.input}
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Digite sua dúvida..."
              aria-label="Digite sua dúvida para a Chully"
            />

            <button type="submit" style={styles.sendButton}>
              Enviar
            </button>
          </form>

          <div style={styles.options}>
            {opcoesRapidas.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                style={styles.optionButton}
                onClick={() => responderRapido(opcao.id)}
              >
                {opcao.label}
              </button>
            ))}
          </div>

          <div style={styles.footerText}>
            A Chully orienta sobre informações públicas do site. Para situações
            específicas, entre em contato diretamente com a instituição.
          </div>
        </section>
      )}

      <button
        type="button"
        style={{
          ...styles.floatButton,
          ...(mobile ? styles.floatButtonMobile : {})
        }}
        onClick={abrirOuFecharChat}
        aria-label="Abrir assistente virtual Chully"
      >
        <img src={chullyImg} alt="Chully" style={styles.floatAvatar} />

        {!mobile && (
          <div>
            <strong>Chully</strong>
            <small>Assistente virtual</small>
          </div>
        )}
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
    minWidth: '58px',
    width: '58px',
    height: '58px',
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
    width: '390px',
    maxWidth: 'calc(100vw - 40px)',
    background: '#fff',
    borderRadius: '22px',
    boxShadow: '0 18px 45px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    zIndex: 9999,
    border: '1px solid #dbeafe'
  },

  chatBoxMobile: {
    right: '10px',
    bottom: '150px',
    width: 'calc(100vw - 20px)',
    maxHeight: '72vh'
  },

  header: {
    background: 'linear-gradient(135deg, #002855, #0B3D91)',
    color: '#fff',
    padding: '14px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },

  headerText: {
    display: 'grid',
    gap: '2px'
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
    maxHeight: '285px',
    overflowY: 'auto',
    background: '#f8fbff'
  },

  botMsg: {
    background: '#eef6ff',
    color: '#0B3D91',
    padding: '11px',
    borderRadius: '14px',
    marginBottom: '10px',
    fontSize: '14px',
    lineHeight: '1.5',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
  },

  userMsg: {
    background: '#ffc928',
    color: '#002855',
    padding: '11px',
    borderRadius: '14px',
    marginBottom: '10px',
    fontSize: '14px',
    textAlign: 'right',
    fontWeight: '800',
    marginLeft: '35px'
  },

  msgText: {
    margin: 0
  },

  msgLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px'
  },

  msgLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    background: '#0B3D91',
    color: '#fff',
    padding: '7px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '900'
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
    borderRadius: '12px',
    padding: '10px',
    outline: 'none',
    fontSize: '14px'
  },

  sendButton: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
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

  optionButton: {
    border: '1px solid #bfdbfe',
    background: '#ffffff',
    color: '#0B3D91',
    borderRadius: '999px',
    padding: '8px 10px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '13px'
  },

  footerText: {
    padding: '13px 18px',
    borderTop: '1px solid #e5e7eb',
    background: '#f8fbff',
    color: '#475569',
    fontSize: '12px',
    lineHeight: '1.5',
    textAlign: 'center',
    fontWeight: '500'
  }
}

export default AssistenteVirtual