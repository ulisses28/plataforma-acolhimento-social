import {
  validarCPF,
  validarCNPJ,
  validarEmail
} from '../../utils/validacoes'
import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { criarDoacao } from '../../services/doacoesService'
import BackButton from '../../components/ui/BackButton'
import { registrarInteracao } from '../../services/analyticsService'

import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

function DoarAgora() {
  const [nome, setNome] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('fisica')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  const [valor, setValor] = useState('')
  const [forma, setForma] = useState('')
  const [comprovante, setComprovante] = useState('')
  const [aceitouLGPD, setAceitouLGPD] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [pixQrCode, setPixQrCode] = useState('')
  const [pixPayload, setPixPayload] = useState('')
  const [tempoPix, setTempoPix] = useState(540)

  useEffect(() => {
    async function carregarLocalidades() {
      const listaPaises = await listarPaises()
      const listaEstados = await listarEstadosBrasil()

      setPaises(listaPaises)
      setEstados(listaEstados)
    }

    carregarLocalidades()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!estadoId) {
        setMunicipios([])
        setMunicipio('')
        return
      }

      const listaMunicipios = await listarMunicipiosPorEstado(estadoId)
      setMunicipios(listaMunicipios)
      setMunicipio('')
    }

    carregarMunicipios()
  }, [estadoId])
  useEffect(() => {

  if (forma !== 'Pix') return

  if (tempoPix <= 0) return

  const timer = setInterval(() => {
    setTempoPix((prev) => prev - 1)
  }, 1000)

  return () => clearInterval(timer)

}, [forma, tempoPix])
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
  const chavePix = '27363944000180'

  const nomeRecebedor = removerAcentos('LAR BATISTA').slice(0, 25)

  const cidade = removerAcentos('SERRA').slice(0, 15)

  const txid = 'DOACAO'

  const merchantAccount =
    campo('00', 'BR.GOV.BCB.PIX') +
    campo('01', chavePix) +
    campo('02', 'DOACAO LAR BATISTA')

  const payloadSemCRC =
    campo('00', '01') +
    campo('26', merchantAccount) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('58', 'BR') +
    campo('59', nomeRecebedor) +
    campo('60', cidade) +
    campo('62', campo('05', txid)) +
    '6304'

  const crc = calcularCRC16(payloadSemCRC)

  return payloadSemCRC + crc
}

async function gerarPixReal() {

  const payload = gerarPayloadPix()
  console.log(payload)
  setPixPayload(payload)

  const qrGerado = await QRCode.toDataURL(payload, {
    width: 350,
    margin: 2
  })

  setPixQrCode(qrGerado)
  }
  function handleEstadoChange(e) {
    const idSelecionado = e.target.value
    const estadoSelecionado = estados.find((estado) => estado.id === idSelecionado)

    setEstadoId(idSelecionado)
    setEstadoNome(estadoSelecionado ? estadoSelecionado.nome : '')
  }

  function handleEnviar(e) {
    e.preventDefault()

    if (!nome.trim()) return setMensagem('Informe seu nome ou razão social.')
    if (!documento.trim()) return setMensagem('Informe CPF/RG ou CNPJ.')
    if (!email.trim()) return setMensagem('Informe seu e-mail.')
    if (!validarEmail(email)) {
      return setMensagem('Informe um e-mail válido.')
    }

    if (
      tipoPessoa === 'fisica' &&
      !validarCPF(documento)
    ) {
      return setMensagem('CPF inválido.')
    }

    if (
      tipoPessoa === 'juridica' &&
      !validarCNPJ(documento)
    ) {
      return setMensagem('CNPJ inválido.')
    }
    if (!pais.trim()) return setMensagem('Selecione o país.')
    if (!estadoNome.trim()) return setMensagem('Selecione o estado.')
    if (!municipio.trim()) return setMensagem('Selecione o município.')
    if (!forma) return setMensagem('Selecione Pix ou TED.')
    if (forma === 'TED' && !valor.trim()) return setMensagem('Informe o valor da TED.')
    if (!aceitouLGPD) return setMensagem('Você precisa aceitar os termos LGPD.')

    criarDoacao({
      doador: {
        nome: nome.trim(),
        documento: documento.trim(),
        email: email.trim().toLowerCase(),
        pais,
        estado: estadoNome,
        municipio,
        categoria: tipoPessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'
      },
      tipoDoacao: 'Financeira',
      valor: forma === 'Pix' ? '' : valor,
      forma,
      comprovante,
      lgpdAceito: true,
      lgpdAceitoEm: new Date().toLocaleString('pt-BR')
    })

    setMensagem(
      forma === 'Pix'
        ? 'Doação Pix registrada. Obrigado por contribuir!'
        : 'TED registrada e aguardando validação do comprovante.'
    )

    setNome('')
    setDocumento('')
    setEmail('')
    setPais('BR')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')
    setMunicipios([])
    setValor('')
    setForma('')
    setComprovante('')
    setAceitouLGPD(false)
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>Doar Agora</h1>
          <p style={styles.subtitle}>
            Sua contribuição ajuda a manter o acolhimento, cuidado, alimentação e proteção das pessoas atendidas.
          </p>
        </header>

        <section style={styles.grid}>
          <form style={styles.card} onSubmit={handleEnviar}>
            <h2 style={styles.sectionTitle}>Dados da doação</h2>

            <p style={styles.badge}>Doar como doador</p>

            <label style={styles.label}>Nome ou razão social</label>
            <input
              style={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label style={styles.label}>Tipo de documento</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  checked={tipoPessoa === 'fisica'}
                  onChange={() => setTipoPessoa('fisica')}
                />{' '}
                CPF/RG
              </label>

              <label>
                <input
                  type="radio"
                  checked={tipoPessoa === 'juridica'}
                  onChange={() => setTipoPessoa('juridica')}
                />{' '}
                CNPJ
              </label>
            </div>

            <label style={styles.label}>
              {tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF/RG'}
            </label>
            <input
              style={styles.input}
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />

            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <section style={styles.locationBox}>
              <h3 style={styles.locationTitle}>Localização do doador</h3>

              <label style={styles.label}>País</label>
              <select
                style={styles.input}
                value={pais}
                onChange={(e) => setPais(e.target.value)}
              >
                {paises.map((item) => (
                  <option key={item.codigo} value={item.codigo}>
                    {item.nome}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Estado</label>
              <select
                style={styles.input}
                value={estadoId}
                onChange={handleEstadoChange}
                disabled={pais !== 'BR'}
              >
                <option value="">
                  {pais === 'BR'
                    ? 'Selecione o estado'
                    : 'Estados disponíveis apenas para Brasil'}
                </option>

                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome} - {estado.sigla}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Município</label>
              <select
                style={styles.input}
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                disabled={!estadoId || municipios.length === 0}
              >
                <option value="">
                  {!estadoId
                    ? 'Selecione o estado primeiro'
                    : municipios.length === 0
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>

                {municipios.map((cidade) => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </section>

            <label style={styles.label}>Forma de pagamento</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  checked={forma === 'Pix'}
                  onChange={async () => {

                  setForma('Pix')

                  setTempoPix(540)

                  await gerarPixReal()
                }}
                />{' '}
                Pix
              </label>

              <label>
                <input
                  type="radio"
                  checked={forma === 'TED'}
                  onChange={() => setForma('TED')}
                />{' '}
                TED
              </label>
            </div>

            {forma === 'TED' && (
              <>
                <label style={styles.label}>Valor</label>
                <input
                  style={styles.input}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />

                <label style={styles.label}>Comprovante</label>
                <input
                  type="file"
                  style={styles.input}
                  onChange={(e) => setComprovante(e.target.files?.[0]?.name || '')}
                />
              </>
            )}

            {forma === 'Pix' && (
              <p style={styles.info}>
                Escaneie o QR Code e doe o valor desejado diretamente no seu banco.
              </p>
            )}

            <section style={styles.lgpdBox}>
              <h3 style={styles.sectionTitle}>Termo LGPD</h3>
              <p style={styles.info}>
                Ao continuar, você autoriza o uso dos dados informados para registro da doação,
                emissão de comprovante, transparência institucional e prestação de contas.
              </p>

              <label style={styles.lgpdCheck}>
                <input
                  type="checkbox"
                  checked={aceitouLGPD}
                  onChange={(e) => setAceitouLGPD(e.target.checked)}
                />
                Li e aceito os termos LGPD.
              </label>
            </section>

            {mensagem && <p style={styles.message}>{mensagem}</p>}

            <button style={styles.button}>
              {forma === 'Pix' ? 'Confirmar Pix' : forma === 'TED' ? 'Enviar TED' : 'Continuar'}
            </button>
          </form>

          <aside style={styles.card}>
            <h2 style={styles.sectionTitle}>Dados para doação</h2>

            {!forma && <p>Selecione Pix ou TED para visualizar os dados.</p>}

            {forma === 'Pix' && (
              <>
                <div style={styles.pixBox}>
                  <strong>PIX / CNPJ</strong>
                  <span>27363944000180</span>
                </div>
                <div style={styles.pixContainer}>

                <h2 style={styles.pixTitle}>
                  Pagamento via PIX
                </h2>

                <p style={styles.pixTimer}>
                  Tempo para pagamento:{' '}
                  {String(Math.floor(tempoPix / 60)).padStart(2, '0')}:
                  {String(tempoPix % 60).padStart(2, '0')}
                </p>

                {pixQrCode && (
                  <img
                    src={pixQrCode}
                    alt="QR Code PIX"
                    style={styles.qrImage}
                  />
                )}

                <p style={styles.pixKey}>
                  Chave PIX/CNPJ: 27363944000180
                </p>

                <button
                  type="button"
                  style={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(pixPayload)
                    alert('Código PIX copiado!')
                  }}
                >
                  Copiar código PIX
                </button>

              </div>
              </>
            )}

            {forma === 'TED' && (
              <div>
                <p><strong>Banco:</strong> Banestes</p>
                <p><strong>Agência:</strong> 059</p>
                <p><strong>Conta:</strong> 6.948.103</p>
                <p><strong>CNPJ:</strong> 27.363.944/0001-80</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    background: '#F1F5F9',
    padding: '40px 20px',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    color: '#0B3D91'
  },
  subtitle: {
    color: '#555'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  card: {
    background: '#fff',
    padding: '28px',
    borderRadius: '18px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    color: '#0B3D91'
  },
  badge: {
    background: '#eef6ff',
    color: '#0B3D91',
    padding: '10px',
    borderRadius: '10px',
    fontWeight: '800'
  },
  radioGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '10px',
    flexWrap: 'wrap'
  },
  label: {
    display: 'block',
    marginTop: '12px',
    marginBottom: '6px',
    fontWeight: '700'
  },
  input: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  locationBox: {
    marginTop: '18px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px'
  },
  locationTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  button: {
    width: '100%',
    marginTop: '20px',
    padding: '13px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '800'
  },
  pixBox: {
    background: '#eef6ff',
    padding: '12px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column'
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
    borderRadius: '8px',
    color: '#475569',
    lineHeight: '1.5'
  },
  message: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#0B3D91'
  },
  lgpdBox: {
    marginTop: '18px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '16px'
  },
  lgpdCheck: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontWeight: '700',
    color: '#374151'
  }
  ,
  pixContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px'
  },

  pixTitle: {
    color: '#0B3D91',
    marginBottom: '10px'
  },

  pixTimer: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '22px'
  },

  qrImage: {
    width: '350px',
    maxWidth: '100%',
    borderRadius: '20px',
    background: '#fff',
    padding: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },

  pixKey: {
    marginTop: '20px',
    fontWeight: '700',
    color: '#111827',
    fontSize: '20px'
  },

  copyButton: {
    marginTop: '20px',
    background: '#FACC15',
    color: '#001B44',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 26px',
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '18px'
  }
}

export default DoarAgora