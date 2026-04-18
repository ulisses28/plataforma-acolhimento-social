const STORAGE_KEY = 'doacoes_lar_batista'

export function criarDoacao(valorOuDados, doadorAntigo = null) {
  const doacoes = listarDoacoes()

  if (typeof valorOuDados !== 'object' || valorOuDados === null) {
    const valorFormatado = formatarValor(valorOuDados)

    const nova = {
      id: Date.now(),
      valor: valorFormatado,
      data: new Date().toLocaleDateString('pt-BR'),
      forma: 'Pix',
      status: 'Pendente',
      doador: doadorAntigo ? doadorAntigo.nome : 'Anônimo',
      tipoDoacao: 'Financeira',
      comprovante: '',
      valorEstimadoMaterial: 0,
      categoriaDoador: doadorAntigo?.categoria || 'Pessoa Física'
    }

    doacoes.push(nova)
    salvarDoacoes(doacoes)
    simularRetornoBanco(nova.id)

    return nova
  }

  const {
    doador,
    tipoDoacao,
    valor,
    forma,
    comprovante,
    descricaoMaterial,
    valorEstimadoMaterial
  } = valorOuDados

  const nomeDoador = doador ? doador.nome : 'Anônimo'
  const categoriaDoador = doador?.categoria || 'Pessoa Física'

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

  const nova = {
    id: Date.now(),
    valor: formatarValor(valor),
    data: new Date().toLocaleDateString('pt-BR'),
    forma: forma || 'Pix',
    status: 'Pendente',
    doador: nomeDoador,
    tipoDoacao: 'Financeira',
    comprovante: comprovante || '',
    descricaoMaterial: '',
    valorEstimadoMaterial: 0,
    categoriaDoador
  }

  doacoes.push(nova)
  salvarDoacoes(doacoes)
  simularRetornoBanco(nova.id)

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

function simularRetornoBanco(id) {
  setTimeout(() => {
    const doacoes = listarDoacoes()

    const sorteio = Math.random()
    let status = 'Pendente'

    if (sorteio < 0.7) {
      status = 'Confirmado'
    } else if (sorteio < 0.9) {
      status = 'Pendente'
    } else {
      status = 'Erro'
    }

    const indice = doacoes.findIndex((d) => d.id === id)

    if (indice !== -1) {
      doacoes[indice].status = status
      salvarDoacoes(doacoes)

      if (status === 'Confirmado') {
        alert(`Doação confirmada com sucesso: ${doacoes[indice].valor}`)
      } else if (status === 'Erro') {
        alert(`Houve uma falha no processamento da doação: ${doacoes[indice].valor}`)
      }
    }
  }, 3000)
}

function formatarValor(valor) {
  const numero = Number(String(valor).replace(',', '.'))

  if (isNaN(numero)) return 'R$ 0,00'

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}