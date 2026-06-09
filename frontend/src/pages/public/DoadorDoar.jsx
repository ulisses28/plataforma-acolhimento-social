import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import BackButton from '../../components/ui/BackButton'
import { criarDoacao } from '../../services/doacoesService'
import { listarBancosBrasil } from '../../services/bancosService'

const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'
const PIX_CHAVE = '27363944000180'
function removerAcentos(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

function campo(id, valor) {
  const tamanho = String(valor.length).padStart(2, '0')
  return `${id}${tamanho}${valor}`
}

function calcularCRC16(payload) {
  let crc = 0xffff

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }

      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function gerarPayloadPix() {
  const nomeRecebedor = removerAcentos('LAR BATISTA').slice(0, 25)

  const cidade = removerAcentos('SERRA').slice(0, 15)

  const merchantAccount =
    campo('00', 'BR.GOV.BCB.PIX') +
    campo('01', PIX_CHAVE)

  const payloadSemCRC =
    campo('00', '01') +
    campo('26', merchantAccount) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('58', 'BR') +
    campo('59', nomeRecebedor) +
    campo('60', cidade) +
    campo('62', campo('05', 'DOACAO')) +
    '6304'

  const crc = calcularCRC16(payloadSemCRC)

  return payloadSemCRC + crc
}

function converterArquivoParaBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler comprovante.'))

    leitor.readAsDataURL(arquivo)
  })
}

function DoadorDoar() {
  const navigate = useNavigate()

  const [doador, setDoador] = useState(null)
  const [forma, setForma] = useState('Pix')
  const [valor, setValor] = useState('')
  const [comprovante, setComprovante] = useState('')
  const [comprovanteNome, setComprovanteNome] = useState('')
  const [bancoOrigem, setBancoOrigem] = useState('')
  const bancos = listarBancosBrasil()
  const [tempo, setTempo] = useState(540)
  const [mensagem, setMensagem] = useState('')
  const [pixPayload, setPixPayload] = useState('')
  const [pixQrCode, setPixQrCode] = useState('')
  const [pixFinalizado, setPixFinalizado] = useState(false)
  useEffect(() => {
    const logado = localStorage.getItem(DOADOR_LOGADO_KEY)

    if (!logado) {
      navigate('/doador/login')
      return
    }

    setDoador(JSON.parse(logado))
  }, [navigate])

  useEffect(() => {
    if (forma !== 'Pix') return

    const payload = gerarPayloadPix()

    setPixPayload(payload)

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2
    }).then(setPixQrCode)

    const intervalo = setInterval(() => {
      setTempo((atual) => {
        if (atual <= 1) {
          clearInterval(intervalo)
          return 0
        }

        return atual - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [forma])

  function formatarTempo(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, '0')
    const sec = String(segundos % 60).padStart(2, '0')
    return `${min}:${sec}`
  }

  function copiarPix() {
  navigator.clipboard.writeText(pixPayload)
  setMensagem('Código PIX copiado com sucesso.')
}

  function confirmarDoacao() {
    if (forma === 'TED' && !valor.trim()) {
      setMensagem('Informe o valor da TED.')
      return
    }
    if (!bancoOrigem) {
      setMensagem('Selecione o banco utilizado para pagamento.')
      return
    }
    criarDoacao({
      doador,
      tipoDoacao: 'Financeira',
      forma: 'Pix',
      valor: '',
      comprovante: '',
      bancoOrigem
    })

    setMensagem(
      forma === 'Pix'
        ? 'Doação PIX registrada com sucesso.'
        : 'TED registrada. Aguardando validação do administrador.'
    )

    setValor('')
    setComprovante('')
    setComprovanteNome('')
    setBancoOrigem('')
  }

  if (!doador) return null

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <section style={styles.card}>
          <h1 style={styles.title}>Doar agora</h1>

          <p style={styles.subtitle}>
            Confirme seus dados e escolha a forma de contribuição.
          </p>

          <section style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>Dados do doador</h2>
            <p><strong>Nome:</strong> {doador.nome}</p>
            <p><strong>Documento:</strong> {doador.documento || '-'}</p>
            <p><strong>E-mail:</strong> {doador.email || '-'}</p>
            <p><strong>Cidade:</strong> {doador.cidade || doador.municipio || '-'}</p>
            <p><strong>Estado:</strong> {doador.estado || '-'}</p>
          </section>

          <section style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>Dados do pagamento</h2>

            <label style={styles.label}>Banco utilizado para pagamento</label>

            <select
              style={styles.input}
              value={bancoOrigem}
              onChange={(e) => setBancoOrigem(e.target.value)}
            >
              <option value="">Selecione o banco</option>

              {bancos.map((banco) => (
                <option key={banco} value={banco}>
                  {banco}
                </option>
              ))}
            </select>
          </section>

          <section style={styles.paymentGrid}>
            <button
              type="button"
              style={forma === 'Pix' ? styles.optionActive : styles.option}
              onClick={() => {
                setForma('Pix')
                setTempo(540)
                setPixFinalizado(false)
                setMensagem('')
              }}
            >
              PIX
            </button>

            <button
              type="button"
              style={forma === 'TED' ? styles.optionActive : styles.option}
              onClick={() => setForma('TED')}
            >
              TED
            </button>
          </section>

          {forma === 'Pix' && (
            <section style={styles.pixBox}>
            {!pixFinalizado ? (
              <>
                <h2 style={styles.sectionTitle}>Pagamento via PIX</h2>

                <p style={styles.timer}>
                  Tempo para pagamento: {formatarTempo(tempo)}
                </p>

                <img
                  style={styles.qr}
                  src={pixQrCode}
                  alt="QR Code PIX"
                />

                <p><strong>Chave PIX/CNPJ:</strong> {PIX_CHAVE}</p>

                <button type="button" style={styles.copyButton} onClick={copiarPix}>
                  Copiar código PIX
                </button>

                <button
                  type="button"
                  style={styles.confirmPixButton}
                  onClick={() => {
                    criarDoacao({
                      doador,
                      tipoDoacao: 'Financeira',
                      forma: 'Pix',
                      valor: '',
                      comprovante: ''
                    })

                    setPixFinalizado(true)
                    setMensagem('PIX enviado com sucesso. Aguardando conferência da instituição.')
                  }}
                >
                  Já realizei o PIX
                </button>

                {tempo === 0 && (
                  <p style={styles.error}>
                    PIX expirado. Clique novamente em PIX para gerar novo tempo.
                  </p>
                )}
              </>
            ) : (
              <div style={styles.successBox}>
                <h2 style={styles.successTitle}>PIX enviado com sucesso ✅</h2>

                <p style={styles.successText}>
                  Obrigado pela sua doação. A instituição poderá conferir o pagamento e manter seu histórico atualizado.
                </p>

                <button
                  type="button"
                  style={styles.button}
                  onClick={() => {
                    setPixFinalizado(false)
                    setTempo(540)
                    setMensagem('')
                  }}
                >
                  Fazer outra doação
                </button>
              </div>
            )}
          </section>
          )}

          {forma === 'TED' && (
            <section style={styles.tedBox}>
              <h2 style={styles.sectionTitle}>Dados bancários para TED</h2>

              <p><strong>Banco:</strong> Banestes</p>
              <p><strong>Agência:</strong> 059</p>
              <p><strong>Conta Corrente:</strong> 6.948.103</p>
              <p><strong>Razão Social:</strong> Lar Batista Albertine Meador</p>
              <p><strong>CNPJ:</strong> 27.363.944/0001-80</p>

              <label style={styles.label}>Valor da TED</label>
              <input
                style={styles.input}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 50,00"
              />

              <label style={styles.label}>Comprovante</label>
              <input
                type="file"
                style={styles.input}
                onChange={async (e) => {
                  const arquivo = e.target.files?.[0]

                  if (!arquivo) return

                  const base64 = await converterArquivoParaBase64(
                    arquivo
                  )

                  setComprovante(base64)
                  setComprovanteNome(arquivo.name)
                }}
              />
            </section>
          )}

          {mensagem && <p style={styles.message}>{mensagem}</p>}

          <button type="button" style={styles.button} onClick={confirmarDoacao}>
            Confirmar doação
          </button>
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
    maxWidth: '950px',
    margin: '0 auto'
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '34px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: 0
  },
  subtitle: {
    color: '#475569',
    marginBottom: '24px'
  },
  sectionTitle: {
    color: '#0B3D91'
  },
  infoBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '20px',
    marginBottom: '24px'
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginBottom: '24px'
  },
  option: {
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid #bfdbfe',
    background: '#eef6ff',
    color: '#0B3D91',
    fontWeight: '900',
    cursor: 'pointer'
  },
  optionActive: {
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    background: '#0B3D91',
    color: '#fff',
    fontWeight: '900',
    cursor: 'pointer'
  },
  pixBox: {
    textAlign: 'center',
    background: '#f8fbff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid #dbeafe'
  },
  tedBox: {
    background: '#f8fbff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid #dbeafe'
  },
  qr: {
    width: '280px',
    height: '280px',
    margin: '18px auto',
    display: 'block'
  },
  timer: {
    color: '#dc2626',
    fontWeight: '900'
  },
  label: {
    display: 'block',
    marginTop: '16px',
    marginBottom: '6px',
    fontWeight: '800'
  },
  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '0 12px'
  },
  copyButton: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  button: {
    width: '100%',
    marginTop: '24px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '16px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  message: {
    marginTop: '18px',
    color: '#166534',
    fontWeight: '900'
  },
  error: {
    color: '#dc2626',
    fontWeight: '900'
  }
  ,
confirmPixButton: {
  marginTop: '14px',
  marginLeft: '10px',
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 18px',
  fontWeight: '900',
  cursor: 'pointer'
},

successBox: {
  background: '#ecfdf5',
  border: '1px solid #bbf7d0',
  borderRadius: '18px',
  padding: '28px',
  textAlign: 'center'
},

successTitle: {
  color: '#166534',
  marginTop: 0
},

successText: {
  color: '#166534',
  lineHeight: '1.6',
  fontWeight: '700'
}
}

export default DoadorDoar