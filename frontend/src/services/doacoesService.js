const STORAGE_KEY = 'doacoes_lar_batista'

/*
  Serviço de doações
  - Salva doações no localStorage
  - Admin pode registrar material, dinheiro, cheque etc.
  - Público pode registrar Pix ou TED
*/

export function criarDoacao(valorOuDados, doadorAntigo = null) {
  const doacoes = listarDoacoes()

  /*
    Compatibilidade com versões antigas:
    quando vinha apenas um valor simples, o sistema criava Pix.
  */
  if (typeof valorOuDados !== 'object' || valorOuDados === null) {
    const valorFormatado = formatarValor(valorOuDados)

  const nova = {
    id: Date.now(),

    valor:
    formaPagamento === 'Pix' && !valor
      ? 'Valor informado no banco'
      : formatarValor(valor),

      data: new Date().toLocaleDateString('pt-BR'),

      dataCompleta: new Date().toISOString(),

      forma: formaPagamento,

      operacao: operacao || formaPagamento,

      banco: banco || 'Não informado',

      agencia: agencia || '',

      status: formaPagamento === 'Pix'
        ? 'Confirmado'
        : 'Pendente',

      doador: nomeDoador,

      tipoDoacao: 'Financeira',

      comprovante: comprovante || '',

      descricaoMaterial: '',

      valorEstimadoMaterial: 0,

      categoriaDoador
    }

    doacoes.push(nova)
    salvarDoacoes(doacoes)

    return nova
  }

  const {
  doador,
  tipoDoacao,
  valor,
  forma,
  comprovante,
  descricaoMaterial,
  valorEstimadoMaterial,
  banco,
  agencia,
  operacao
} = valorOuDados

  const nomeDoador = doador ? doador.nome : 'Anônimo'
  const categoriaDoador = doador?.categoria || 'Pessoa Física'

  /*
    Doação material:
    já entra como confirmada porque normalmente é registrada
    manualmente pelo administrador após recebimento.
  */
  if (tipoDoacao === 'Material') {
    const nova = {
      id: Date.now(),
      valor: '-',
      data: new Date().toLocaleDateString('pt-BR'),
      forma: 'Material',
      status: 'Confirmado',
      doador: nomeDoador,
      tipoDoacao: 'Material',
      comprovante: '',
      descricaoMaterial: descricaoMaterial || '',
      valorEstimadoMaterial: Number(valorEstimadoMaterial || 0),
      categoriaDoador
    }

    doacoes.push(nova)
    salvarDoacoes(doacoes)

    return nova
  }

  /*
    Doação financeira:
    - Pix: confirmado automaticamente, pois o usuário escaneia o QR Code
      e doa diretamente pelo banco.
    - TED: fica pendente para o administrador validar o comprovante.
  */
  const formaPagamento = forma || 'Pix'

  const nova = {
    id: Date.now(),
    valor:
      formaPagamento === 'Pix' && !valor
        ? 'Valor informado no banco'
        : formatarValor(valor),
    data: new Date().toLocaleDateString('pt-BR'),
    forma: formaPagamento,
    status: formaPagamento === 'Pix' ? 'Confirmado' : 'Pendente',
    doador: nomeDoador,
    tipoDoacao: 'Financeira',
    comprovante: comprovante || '',
    descricaoMaterial: '',
    valorEstimadoMaterial: 0,
    categoriaDoador
  }

  doacoes.push(nova)
  salvarDoacoes(doacoes)

  return nova
}

export function listarDoacoes() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function atualizarStatusDoacao(id, novoStatus) {
  const doacoes = listarDoacoes()

  const indice = doacoes.findIndex((d) => d.id === id)

  if (indice !== -1) {
    doacoes[indice].status = novoStatus
    salvarDoacoes(doacoes)
  }

  return doacoes
}

function salvarDoacoes(doacoes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doacoes))
}

function formatarValor(valor) {
  const numero = Number(String(valor || 0).replace(',', '.'))

  if (isNaN(numero)) return 'R$ 0,00'

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}