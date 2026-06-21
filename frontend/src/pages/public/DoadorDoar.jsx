import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import BackButton from '../../components/ui/BackButton'
import { criarDoacao } from '../../services/doacoesService'
import { listarBancosBrasil } from '../../services/bancosService'

/*
  PÁGINA: DOADOR LOGADO / DOAR AGORA

  Objetivo desta versão:
  - Doador logado só gera Pix depois de preencher banco, valor e forma.
  - TED só mostra dados bancários depois do botão "Gerar dados TED".
  - Corrige bug antigo que registrava forma "Pix" fixa.
  - Inclui campo Gênero.
  - Após confirmar Pix, o QR Code some, formulário limpa e aparece mensagem verde.
*/

const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'

const PIX_CHAVE = '27363944000180'
const PIX_RECEBEDOR = 'LAR BATISTA ALBERTINE MEADOR'
const PIX_CIDADE = 'SERRA'

const DADOS_TED = {
  banco: 'Banestes',
  agencia: '059',
  conta: '6.948.103',
  razaoSocial: 'Lar Batista Albertine Meador',
  cnpj: '27.363.944/0001-80'
}

const OPCOES_GENERO = [
  'Prefiro não dizer',
  'Feminino',
  'Masculino',
  'Mulher trans',
  'Homem trans',
  'Pessoa não binária',
  'Agênero',
  'Gênero fluido',
  'Outro'
]

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

function normalizarValorPix(valor) {
  const limpo = String(valor || '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const numero = Number(limpo)

  if (!Number.isFinite(numero) || numero <= 0) {
    return ''
  }

  return numero.toFixed(2)
}

function formatarValorBR(valor) {
  const valorNormalizado = normalizarValorPix(valor)

  if (!valorNormalizado) return ''

  return Number(valorNormalizado).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function gerarPayloadPix(valor) {
  const valorPix = normalizarValorPix(valor)

  const nomeRecebedor = removerAcentos(PIX_RECEBEDOR).slice(0, 25)
  const cidade = removerAcentos(PIX_CIDADE).slice(0, 15)

  const merchantAccount =
    campo('00', 'BR.GOV.BCB.PIX') +
    campo('01', PIX_CHAVE) +
    campo('02', 'DOACAO LAR BATISTA')

  let payloadSemCRC =
    campo('00', '01') +
    campo('26', merchantAccount) +
    campo('52', '0000') +
    campo('53', '986')

  if (valorPix) {
    payloadSemCRC += campo('54', valorPix)
  }

  payloadSemCRC +=
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

  const [genero, setGenero] = useState('Prefiro não dizer')
  const [forma, setForma] = useState('')
  const [valor, setValor] = useState('')
  const [bancoOrigem, setBancoOrigem] = useState('')

  const [comprovante, setComprovante] = useState('')
  const [comprovanteNome, setComprovanteNome] = useState('')

  const bancos = listarBancosBrasil()

  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('erro')

  const [pixPayload, setPixPayload] = useState('')
  const [pixQrCode, setPixQrCode] = useState('')
  const [pixGerado, setPixGerado] = useState(false)
  const [tedGerado, setTedGerado] = useState(false)
  const [tempo, setTempo] = useState(540)

  useEffect(() => {
    const logado = localStorage.getItem(DOADOR_LOGADO_KEY)

    if (!logado) {
      navigate('/doador/login')
      return
    }

    const dados = JSON.parse(logado)

    setDoador(dados)
    setGenero(dados.genero || 'Prefiro não dizer')
  }, [navigate])

  /*
    Timer do Pix somente depois de gerar QR Code.
  */
  useEffect(() => {
    if (!pixGerado) return
    if (tempo <= 0) return

    const intervalo = setInterval(() => {
      setTempo((atual) => atual - 1)
    }, 1000)

    return () => clearInterval(intervalo)
  }, [pixGerado, tempo])

  function mostrarErro(texto) {
    setTipoMensagem('erro')
    setMensagem(texto)
  }

  function mostrarSucesso(texto) {
    setTipoMensagem('sucesso')
    setMensagem(texto)
  }

  function limparDadosGerados() {
    setPixPayload('')
    setPixQrCode('')
    setPixGerado(false)
    setTedGerado(false)
    setTempo(540)
    setComprovante('')
    setComprovanteNome('')
  }

  function selecionarForma(novaForma) {
    setForma(novaForma)
    setMensagem('')
    limparDadosGerados()
  }

  function validarFormularioParaGerar(tipo) {
    if (!doador?.nome) {
      mostrarErro('Não foi possível identificar o doador logado.')
      return false
    }

    if (!genero.trim()) {
      mostrarErro('Selecione o gênero ou marque Prefiro não dizer.')
      return false
    }

    if (!bancoOrigem) {
      mostrarErro(
        tipo === 'Pix'
          ? 'Preencha todos os campos do formulário para gerar o QR Code Pix.'
          : 'Preencha todos os campos do formulário para gerar os dados bancários para doação.'
      )
      return false
    }

    if (!forma) {
      mostrarErro('Selecione Pix ou TED.')
      return false
    }

    if (!valor.trim() || !normalizarValorPix(valor)) {
      mostrarErro('Informe um valor válido para a doação.')
      return false
    }

    return true
  }

  async function gerarPix() {
    if (forma !== 'Pix') {
      mostrarErro('Selecione Pix antes de gerar o QR Code.')
      return
    }

    if (!validarFormularioParaGerar('Pix')) return

    const payload = gerarPayloadPix(valor)

    const qrGerado = await QRCode.toDataURL(payload, {
      width: 320,
      margin: 2
    })

    setPixPayload(payload)
    setPixQrCode(qrGerado)
    setPixGerado(true)
    setTedGerado(false)
    setTempo(540)

    mostrarSucesso('QR Code Pix gerado com sucesso. Realize o pagamento no aplicativo do seu banco.')
  }

  function gerarTed() {
    if (forma !== 'TED') {
      mostrarErro('Selecione TED antes de gerar os dados bancários.')
      return
    }

    if (!validarFormularioParaGerar('TED')) return

    setTedGerado(true)
    setPixGerado(false)
    setPixPayload('')
    setPixQrCode('')

    mostrarSucesso('Dados bancários para TED gerados com sucesso.')
  }

  function montarDoadorComGenero() {
    return {
      ...doador,
      genero
    }
  }

  function limparFormularioAposSucesso() {
    setGenero(doador?.genero || 'Prefiro não dizer')
    setForma('')
    setValor('')
    setBancoOrigem('')
    setComprovante('')
    setComprovanteNome('')
    setPixPayload('')
    setPixQrCode('')
    setPixGerado(false)
    setTedGerado(false)
    setTempo(540)
  }

  function confirmarPixRealizado() {
    if (!pixGerado || !pixPayload) {
      mostrarErro('Gere o QR Code Pix antes de confirmar a doação.')
      return
    }

    criarDoacao({
      doador: montarDoadorComGenero(),
      doadorId: doador.id,
      email: doador.email,
      documento: doador.documento,
      tipoDoacao: 'Financeira',
      forma: 'Pix',
      valor: formatarValorBR(valor),
      bancoOrigem,
      comprovante: '',
      pixCopiaECola: pixPayload,
      status: 'Aguardando conferência',
      genero
    })

    limparFormularioAposSucesso()

    mostrarSucesso(
      'Pix registrado com sucesso! Obrigado pela sua doação. A instituição fará a conferência do pagamento.'
    )
  }

  function confirmarTed() {
    if (!tedGerado) {
      mostrarErro('Gere os dados TED antes de confirmar a doação.')
      return
    }

    if (!comprovante) {
      mostrarErro('Anexe o comprovante da TED antes de confirmar.')
      return
    }

    criarDoacao({
      doador: montarDoadorComGenero(),
      doadorId: doador.id,
      email: doador.email,
      documento: doador.documento,
      tipoDoacao: 'Financeira',
      forma: 'TED',
      valor: formatarValorBR(valor),
      bancoOrigem,
      comprovante,
      comprovanteNome,
      status: 'Aguardando conferência',
      genero
    })

    limparFormularioAposSucesso()

    mostrarSucesso(
      'TED registrada com sucesso! O comprovante ficará aguardando validação da instituição.'
    )
  }

  function copiarPix() {
    if (!pixPayload) return

    navigator.clipboard.writeText(pixPayload)
    mostrarSucesso('Código Pix copiado com sucesso.')
  }

  function formatarTempo(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, '0')
    const sec = String(segundos % 60).padStart(2, '0')
    return `${min}:${sec}`
  }

  if (!doador) return null

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <section style={styles.card}>
          <h1 style={styles.title}>Doar agora</h1>

          <p style={styles.subtitle}>
            Confirme seus dados, preencha o valor e escolha a forma de contribuição.
          </p>

          <section style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>Dados do doador</h2>

            <p><strong>Nome:</strong> {doador.nome}</p>
            <p><strong>Documento:</strong> {doador.documento || '-'}</p>
            <p><strong>E-mail:</strong> {doador.email || '-'}</p>
            <p><strong>Cidade:</strong> {doador.cidade || doador.municipio || '-'}</p>
            <p><strong>Estado:</strong> {doador.estado || '-'}</p>

            <label style={styles.label}>Gênero</label>
            <select
              style={styles.input}
              value={genero}
              onChange={(e) => {
                setGenero(e.target.value)
                limparDadosGerados()
              }}
            >
              {OPCOES_GENERO.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </section>

          <section style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>Dados do pagamento</h2>

            <label style={styles.label}>Banco utilizado para pagamento</label>
            <select
              style={styles.input}
              value={bancoOrigem}
              onChange={(e) => {
                setBancoOrigem(e.target.value)
                limparDadosGerados()
              }}
            >
              <option value="">Selecione o banco</option>

              {bancos.map((banco) => (
                <option key={banco} value={banco}>
                  {banco}
                </option>
              ))}
            </select>

            <label style={styles.label}>Valor da doação</label>
            <input
              style={styles.input}
              value={valor}
              onChange={(e) => {
                setValor(e.target.value)
                limparDadosGerados()
              }}
              placeholder="Ex: 50,00"
            />
          </section>

          <section style={styles.paymentGrid}>
            <button
              type="button"
              style={forma === 'Pix' ? styles.optionActive : styles.option}
              onClick={() => selecionarForma('Pix')}
            >
              Pix
            </button>

            <button
              type="button"
              style={forma === 'TED' ? styles.optionActive : styles.option}
              onClick={() => selecionarForma('TED')}
            >
              TED
            </button>
          </section>

          {forma === 'Pix' && (
            <section style={styles.pixBox}>
              {!pixGerado ? (
                <>
                  <h2 style={styles.sectionTitle}>Pagamento via Pix</h2>

                  <p style={styles.info}>
                    Para gerar o QR Code Pix, selecione o banco, informe o valor e clique no botão abaixo.
                  </p>

                  <button type="button" style={styles.pixGenerateButton} onClick={gerarPix}>
                    Gerar QR Code Pix
                  </button>
                </>
              ) : (
                <>
                  <h2 style={styles.sectionTitle}>Pagamento via Pix</h2>

                  <p style={styles.timer}>
                    Tempo para pagamento: {formatarTempo(tempo)}
                  </p>

                  <img
                    style={styles.qr}
                    src={pixQrCode}
                    alt="QR Code Pix"
                  />

                  <p><strong>Chave Pix/CNPJ:</strong> {PIX_CHAVE}</p>
                  <p><strong>Valor:</strong> {formatarValorBR(valor)}</p>

                  <button type="button" style={styles.copyButton} onClick={copiarPix}>
                    Copiar código Pix
                  </button>

                  <button type="button" style={styles.confirmPixButton} onClick={confirmarPixRealizado}>
                    Já realizei o Pix
                  </button>

                  {tempo === 0 && (
                    <p style={styles.errorMessage}>
                      Pix expirado. Gere um novo QR Code para continuar.
                    </p>
                  )}
                </>
              )}
            </section>
          )}

          {forma === 'TED' && (
            <section style={styles.tedBox}>
              {!tedGerado ? (
                <>
                  <h2 style={styles.sectionTitle}>TED selecionada</h2>

                  <p style={styles.info}>
                    Para visualizar os dados bancários, selecione o banco, informe o valor e clique no botão abaixo.
                  </p>

                  <button type="button" style={styles.tedGenerateButton} onClick={gerarTed}>
                    Gerar dados TED para doação
                  </button>
                </>
              ) : (
                <>
                  <h2 style={styles.sectionTitle}>Dados bancários para TED</h2>

                  <p><strong>Banco:</strong> {DADOS_TED.banco}</p>
                  <p><strong>Agência:</strong> {DADOS_TED.agencia}</p>
                  <p><strong>Conta Corrente:</strong> {DADOS_TED.conta}</p>
                  <p><strong>Razão Social:</strong> {DADOS_TED.razaoSocial}</p>
                  <p><strong>CNPJ:</strong> {DADOS_TED.cnpj}</p>
                  <p><strong>Valor:</strong> {formatarValorBR(valor)}</p>

                  <label style={styles.label}>Comprovante da TED</label>
                  <input
                    type="file"
                    style={styles.input}
                    onChange={async (e) => {
                      const arquivo = e.target.files?.[0]

                      if (!arquivo) return

                      const base64 = await converterArquivoParaBase64(arquivo)

                      setComprovante(base64)
                      setComprovanteNome(arquivo.name)
                    }}
                  />

                  <button type="button" style={styles.button} onClick={confirmarTed}>
                    Confirmar TED
                  </button>
                </>
              )}
            </section>
          )}

          {mensagem && (
            <p style={tipoMensagem === 'sucesso' ? styles.successMessage : styles.errorMessage}>
              {mensagem}
            </p>
          )}
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
    marginBottom: '24px',
    lineHeight: '1.6'
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
  label: {
    display: 'block',
    marginTop: '12px',
    marginBottom: '6px',
    fontWeight: '800',
    color: '#1f2937'
  },
  input: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#fff',
    padding: '0 12px',
    boxSizing: 'border-box'
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
    border: '1px solid #dbeafe',
    marginBottom: '20px'
  },
  tedBox: {
    background: '#f8fbff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid #dbeafe',
    marginBottom: '20px'
  },
  info: {
    background: '#eef6ff',
    padding: '12px',
    borderRadius: '10px',
    color: '#475569',
    lineHeight: '1.6'
  },
  timer: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: '20px'
  },
  qr: {
    width: '320px',
    maxWidth: '100%',
    borderRadius: '20px',
    background: '#fff',
    padding: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  pixGenerateButton: {
    width: '100%',
    marginTop: '18px',
    padding: '14px',
    background: '#16A34A',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  tedGenerateButton: {
    width: '100%',
    marginTop: '18px',
    padding: '14px',
    background: '#0B5FC3',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  copyButton: {
    marginTop: '12px',
    marginRight: '10px',
    background: '#FACC15',
    color: '#001B44',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  confirmPixButton: {
    marginTop: '12px',
    background: '#15803D',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  button: {
    width: '100%',
    marginTop: '20px',
    padding: '13px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  errorMessage: {
    marginTop: '12px',
    padding: '12px',
    borderRadius: '10px',
    background: '#fee2e2',
    color: '#991b1b',
    fontWeight: '800'
  },
  successMessage: {
    marginTop: '12px',
    padding: '12px',
    borderRadius: '10px',
    background: '#dcfce7',
    color: '#166534',
    fontWeight: '900'
  }
}

export default DoadorDoar