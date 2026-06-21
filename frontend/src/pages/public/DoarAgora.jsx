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
import { listarBancosBrasil } from '../../services/bancosService'

import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

/*
  PÁGINA: DOAR AGORA

  Objetivo desta versão:
  - Pix deixa de aparecer automaticamente ao selecionar a opção.
  - O QR Code Pix só é gerado ao clicar no botão "Gerar QR Code Pix".
  - Os dados TED só aparecem ao clicar no botão "Gerar dados TED".
  - Antes de gerar Pix/TED, o sistema valida os dados obrigatórios.
  - Após o usuário clicar em "Já realizei o Pix", o QR Code some,
    o formulário é limpo e aparece uma mensagem verde de sucesso.
  - Inclui o campo "Gênero" com opção "Prefiro não dizer".
*/

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

/*
  Converte valor digitado em formato aceito pelo Pix.
  Exemplos:
  - "50" vira "50.00"
  - "50,00" vira "50.00"
  - "R$ 1.200,50" vira "1200.50"
*/
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

/*
  Gera payload Pix no padrão EMV.
  Este QR Code é funcional para pagamento, mas a confirmação automática
  do recebimento só seria possível com integração bancária/API Pix.
*/
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

  /*
    Campo 54 = valor da transação.
    Como queremos um Pix mais real, incluímos o valor informado.
  */
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

function DoarAgora() {
  const [nome, setNome] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('fisica')
  const [documento, setDocumento] = useState('')
  const [genero, setGenero] = useState('Prefiro não dizer')
  const [email, setEmail] = useState('')

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  const [bancoOrigem, setBancoOrigem] = useState('')
  const bancos = listarBancosBrasil()

  const [valor, setValor] = useState('')
  const [forma, setForma] = useState('')
  const [comprovante, setComprovante] = useState('')
  const [comprovanteNome, setComprovanteNome] = useState('')
  const [aceitouLGPD, setAceitouLGPD] = useState(false)

  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('erro')

  const [pixQrCode, setPixQrCode] = useState('')
  const [pixPayload, setPixPayload] = useState('')
  const [pixGerado, setPixGerado] = useState(false)
  const [tedGerado, setTedGerado] = useState(false)
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

  /*
    Timer do Pix.
    Ele só começa a contar quando o QR Code realmente foi gerado.
  */
  useEffect(() => {
    if (!pixGerado) return
    if (tempoPix <= 0) return

    const timer = setInterval(() => {
      setTempoPix((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [pixGerado, tempoPix])

  function mostrarErro(texto) {
    setTipoMensagem('erro')
    setMensagem(texto)
  }

  function mostrarSucesso(texto) {
    setTipoMensagem('sucesso')
    setMensagem(texto)
  }

  function registrarAcao() {
    try {
      registrarInteracao()
    } catch {
      /*
        Mantemos vazio para não quebrar a doação caso o analytics falhe.
      */
    }
  }

  function limparDadosGerados() {
    setPixQrCode('')
    setPixPayload('')
    setPixGerado(false)
    setTedGerado(false)
    setTempoPix(540)
    setComprovante('')
    setComprovanteNome('')
  }

  function selecionarForma(novaForma) {
    setForma(novaForma)
    setMensagem('')
    limparDadosGerados()
  }

  function handleEstadoChange(e) {
    const idSelecionado = e.target.value

    const estadoSelecionado = estados.find(
      (estado) => String(estado.id) === String(idSelecionado)
    )

    setEstadoId(idSelecionado)
    setEstadoNome(estadoSelecionado ? estadoSelecionado.nome : '')
    setMunicipio('')
  }

  /*
    Validação principal do formulário.
    Usamos a mesma função antes de gerar Pix e antes de gerar TED.
  */
  function validarFormularioParaGerar(tipo) {
    if (!nome.trim()) {
      mostrarErro(
        tipo === 'Pix'
          ? 'Preencha todos os campos obrigatórios do formulário para gerar o QR Code Pix.'
          : 'Preencha todos os campos obrigatórios do formulário para gerar os dados bancários para doação.'
      )
      return false
    }

    if (!documento.trim()) {
      mostrarErro('Informe CPF/RG ou CNPJ.')
      return false
    }

    if (tipoPessoa === 'fisica' && !validarCPF(documento)) {
      mostrarErro('CPF inválido.')
      return false
    }

    if (tipoPessoa === 'juridica' && !validarCNPJ(documento)) {
      mostrarErro('CNPJ inválido.')
      return false
    }

    if (!email.trim()) {
      mostrarErro('Informe seu e-mail.')
      return false
    }

    if (!validarEmail(email)) {
      mostrarErro('Informe um e-mail válido.')
      return false
    }

    if (!genero.trim()) {
      mostrarErro('Selecione o gênero ou marque Prefiro não dizer.')
      return false
    }

    if (!pais.trim()) {
      mostrarErro('Selecione o país.')
      return false
    }

    if (pais === 'BR' && !estadoNome.trim()) {
      mostrarErro('Selecione o estado.')
      return false
    }

    if (pais === 'BR' && !municipio.trim()) {
      mostrarErro('Selecione o município.')
      return false
    }

    if (!bancoOrigem) {
      mostrarErro('Selecione o banco utilizado para pagamento.')
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

    if (!aceitouLGPD) {
      mostrarErro('Você precisa aceitar os termos LGPD para continuar.')
      return false
    }

    return true
  }

  async function gerarPix() {
    registrarAcao()

    if (forma !== 'Pix') {
      mostrarErro('Selecione a forma Pix antes de gerar o QR Code.')
      return
    }

    if (!validarFormularioParaGerar('Pix')) return

    const payload = gerarPayloadPix(valor)

    const qrGerado = await QRCode.toDataURL(payload, {
      width: 350,
      margin: 2
    })

    setPixPayload(payload)
    setPixQrCode(qrGerado)
    setPixGerado(true)
    setTedGerado(false)
    setTempoPix(540)

    mostrarSucesso('QR Code Pix gerado com sucesso. Realize o pagamento no aplicativo do seu banco.')
  }

  function gerarTed() {
    registrarAcao()

    if (forma !== 'TED') {
      mostrarErro('Selecione a forma TED antes de gerar os dados bancários.')
      return
    }

    if (!validarFormularioParaGerar('TED')) return

    setTedGerado(true)
    setPixGerado(false)
    setPixQrCode('')
    setPixPayload('')

    mostrarSucesso('Dados bancários para TED gerados com sucesso.')
  }

  function montarDoador() {
    return {
      nome: nome.trim(),
      documento: documento.trim(),
      genero,
      email: email.trim().toLowerCase(),
      pais,
      estado: estadoNome,
      municipio,
      categoria: tipoPessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física',
      tipoPessoa
    }
  }

  function limparFormularioAposSucesso() {
    setNome('')
    setTipoPessoa('fisica')
    setDocumento('')
    setGenero('Prefiro não dizer')
    setEmail('')
    setPais('BR')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')
    setMunicipios([])
    setBancoOrigem('')
    setValor('')
    setForma('')
    setComprovante('')
    setComprovanteNome('')
    setAceitouLGPD(false)
    setPixQrCode('')
    setPixPayload('')
    setPixGerado(false)
    setTedGerado(false)
    setTempoPix(540)
  }

  function confirmarPixRealizado() {
    registrarAcao()

    if (!pixGerado || !pixPayload) {
      mostrarErro('Gere o QR Code Pix antes de confirmar a doação.')
      return
    }

    criarDoacao({
      doador: montarDoador(),
      tipoDoacao: 'Financeira',
      valor: formatarValorBR(valor),
      forma: 'Pix',
      bancoOrigem,
      comprovante: '',
      pixCopiaECola: pixPayload,
      status: 'Aguardando conferência',
      lgpdAceito: true,
      lgpdAceitoEm: new Date().toLocaleString('pt-BR')
    })

    limparFormularioAposSucesso()

    mostrarSucesso(
      'Pix registrado com sucesso! Obrigado pela sua doação. A instituição fará a conferência do pagamento.'
    )
  }

  function confirmarTed() {
    registrarAcao()

    if (!tedGerado) {
      mostrarErro('Gere os dados TED antes de confirmar a doação.')
      return
    }

    if (!comprovante) {
      mostrarErro('Anexe o comprovante da TED antes de confirmar.')
      return
    }

    criarDoacao({
      doador: montarDoador(),
      tipoDoacao: 'Financeira',
      valor: formatarValorBR(valor),
      forma: 'TED',
      bancoOrigem,
      comprovante,
      comprovanteNome,
      status: 'Aguardando conferência',
      lgpdAceito: true,
      lgpdAceitoEm: new Date().toLocaleString('pt-BR')
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
          <form style={styles.card} onSubmit={(e) => e.preventDefault()}>
            <h2 style={styles.sectionTitle}>Dados da doação</h2>

            <p style={styles.badge}>Preencha os dados para gerar Pix ou TED</p>

            <label style={styles.label}>Nome ou razão social</label>
            <input
              style={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome ou razão social"
            />

            <label style={styles.label}>Tipo de documento</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  checked={tipoPessoa === 'fisica'}
                  onChange={() => {
                    setTipoPessoa('fisica')
                    setDocumento('')
                  }}
                />{' '}
                CPF
              </label>

              <label>
                <input
                  type="radio"
                  checked={tipoPessoa === 'juridica'}
                  onChange={() => {
                    setTipoPessoa('juridica')
                    setDocumento('')
                  }}
                />{' '}
                CNPJ
              </label>
            </div>

            <label style={styles.label}>
              {tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF'}
            </label>
            <input
              style={styles.input}
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder={tipoPessoa === 'juridica' ? 'Digite o CNPJ' : 'Digite o CPF'}
            />

            <label style={styles.label}>Gênero</label>
            <select
              style={styles.input}
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              {OPCOES_GENERO.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>

            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
            />

            <section style={styles.locationBox}>
              <h3 style={styles.locationTitle}>Localização do doador</h3>

              <label style={styles.label}>País</label>
              <select
                style={styles.input}
                value={pais}
                onChange={(e) => {
                  setPais(e.target.value)
                  setEstadoId('')
                  setEstadoNome('')
                  setMunicipio('')
                }}
              >
                <option value="">Selecione o país</option>

                {paises.map((item) => (
                  <option key={item.codigo} value={item.codigo}>
                    {item.nome}
                  </option>
                ))}
              </select>

              {pais === 'BR' && (
                <>
                  <label style={styles.label}>Estado</label>
                  <select
                    style={styles.input}
                    value={estadoId}
                    onChange={handleEstadoChange}
                  >
                    <option value="">Selecione o estado</option>

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
                    disabled={!estadoId}
                  >
                    <option value="">
                      {!estadoId ? 'Selecione o estado primeiro' : 'Selecione o município'}
                    </option>

                    {municipios.map((cidade) => (
                      <option key={cidade.id} value={cidade.nome}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </section>

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

            <label style={styles.label}>Forma de pagamento</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  checked={forma === 'Pix'}
                  onChange={() => selecionarForma('Pix')}
                />{' '}
                Pix
              </label>

              <label>
                <input
                  type="radio"
                  checked={forma === 'TED'}
                  onChange={() => selecionarForma('TED')}
                />{' '}
                TED
              </label>
            </div>

            {forma === 'TED' && tedGerado && (
              <>
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
              </>
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
                  onChange={(e) => {
                    setAceitouLGPD(e.target.checked)
                    limparDadosGerados()
                  }}
                />
                Li e aceito os termos LGPD.
              </label>
            </section>

            {mensagem && (
              <p style={tipoMensagem === 'sucesso' ? styles.successMessage : styles.errorMessage}>
                {mensagem}
              </p>
            )}

            {forma === 'Pix' && !pixGerado && (
              <button type="button" style={styles.pixGenerateButton} onClick={gerarPix}>
                Gerar QR Code Pix
              </button>
            )}

            {forma === 'Pix' && pixGerado && (
              <button type="button" style={styles.confirmPixButton} onClick={confirmarPixRealizado}>
                Já realizei o Pix
              </button>
            )}

            {forma === 'TED' && !tedGerado && (
              <button type="button" style={styles.tedGenerateButton} onClick={gerarTed}>
                Gerar dados TED para doação
              </button>
            )}

            {forma === 'TED' && tedGerado && (
              <button type="button" style={styles.button} onClick={confirmarTed}>
                Confirmar TED
              </button>
            )}

            {!forma && (
              <button type="button" style={styles.button} onClick={() => mostrarErro('Selecione Pix ou TED para continuar.')}>
                Continuar
              </button>
            )}
          </form>

          <aside style={styles.card}>
            <h2 style={styles.sectionTitle}>Dados para doação</h2>

            {!forma && (
              <p style={styles.info}>
                Selecione Pix ou TED para visualizar as opções de pagamento.
              </p>
            )}

            {forma === 'Pix' && !pixGerado && (
              <div style={styles.waitBox}>
                <h3 style={styles.waitTitle}>Pix selecionado</h3>
                <p>
                  Preencha todos os dados obrigatórios e clique em
                  <strong> Gerar QR Code Pix</strong>.
                </p>
              </div>
            )}

            {forma === 'Pix' && pixGerado && (
              <section style={styles.pixContainer}>
                <h2 style={styles.pixTitle}>Pagamento via Pix</h2>

                <p style={styles.pixTimer}>
                  Tempo para pagamento: {formatarTempo(tempoPix)}
                </p>

                {pixQrCode && (
                  <img
                    src={pixQrCode}
                    alt="QR Code Pix"
                    style={styles.qrImage}
                  />
                )}

                <div style={styles.pixBox}>
                  <strong>Chave Pix/CNPJ</strong>
                  <span>{PIX_CHAVE}</span>
                </div>

                <p style={styles.pixKey}>
                  Valor: {formatarValorBR(valor)}
                </p>

                <button
                  type="button"
                  style={styles.copyButton}
                  onClick={copiarPix}
                >
                  Copiar código Pix
                </button>

                {tempoPix === 0 && (
                  <p style={styles.errorMessage}>
                    Pix expirado. Gere um novo QR Code para continuar.
                  </p>
                )}
              </section>
            )}

            {forma === 'TED' && !tedGerado && (
              <div style={styles.waitBox}>
                <h3 style={styles.waitTitle}>TED selecionada</h3>
                <p>
                  Preencha todos os dados obrigatórios e clique em
                  <strong> Gerar dados TED para doação</strong>.
                </p>
              </div>
            )}

            {forma === 'TED' && tedGerado && (
              <section style={styles.tedBox}>
                <h3 style={styles.tedTitle}>Dados bancários para TED</h3>

                <p><strong>Banco:</strong> {DADOS_TED.banco}</p>
                <p><strong>Agência:</strong> {DADOS_TED.agencia}</p>
                <p><strong>Conta Corrente:</strong> {DADOS_TED.conta}</p>
                <p><strong>Razão Social:</strong> {DADOS_TED.razaoSocial}</p>
                <p><strong>CNPJ:</strong> {DADOS_TED.cnpj}</p>
                <p><strong>Valor:</strong> {formatarValorBR(valor)}</p>

                <p style={styles.info}>
                  Após realizar a TED, anexe o comprovante no formulário e clique em Confirmar TED.
                </p>
              </section>
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
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: 0
  },
  subtitle: {
    color: '#555',
    lineHeight: '1.6'
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
    color: '#0B3D91',
    marginTop: 0
  },
  badge: {
    background: '#eef6ff',
    color: '#0B3D91',
    padding: '10px',
    borderRadius: '10px',
    fontWeight: '800',
    lineHeight: '1.5'
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
  },
  info: {
    background: '#eef6ff',
    padding: '10px',
    borderRadius: '8px',
    color: '#475569',
    lineHeight: '1.5'
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
  },
  button: {
    width: '100%',
    marginTop: '20px',
    padding: '13px',
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '800',
    cursor: 'pointer'
  },
  pixGenerateButton: {
    width: '100%',
    marginTop: '20px',
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
    marginTop: '20px',
    padding: '14px',
    background: '#0B5FC3',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  confirmPixButton: {
    width: '100%',
    marginTop: '20px',
    padding: '14px',
    background: '#15803D',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  waitBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px',
    color: '#475569',
    lineHeight: '1.6'
  },
  waitTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  pixContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px'
  },
  pixTitle: {
    color: '#0B3D91',
    marginBottom: '10px'
  },
  pixTimer: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '20px'
  },
  qrImage: {
    width: '350px',
    maxWidth: '100%',
    borderRadius: '20px',
    background: '#fff',
    padding: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  pixBox: {
    width: '100%',
    marginTop: '18px',
    background: '#eef6ff',
    padding: '12px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#0B3D91',
    fontWeight: '800'
  },
  pixKey: {
    marginTop: '18px',
    fontWeight: '900',
    color: '#111827',
    fontSize: '18px'
  },
  copyButton: {
    marginTop: '18px',
    background: '#FACC15',
    color: '#001B44',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 22px',
    fontWeight: '900',
    cursor: 'pointer',
    fontSize: '16px'
  },
  tedBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '18px',
    color: '#374151',
    lineHeight: '1.7'
  },
  tedTitle: {
    color: '#0B3D91',
    marginTop: 0
  }
}

export default DoarAgora