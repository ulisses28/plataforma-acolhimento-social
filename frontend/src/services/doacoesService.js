const STORAGE_KEY = 'doacoes_lar_batista'

export function criarDoacao(dados) {
  const doacoes = listarDoacoes()

  const doador = dados.doador || {}

  const nova = {
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    dataCompleta: new Date().toISOString(),
    
    doadorId: doador.id || doador._id || '',
    doador: doador.nome || 'Anônimo',
    documento: doador.documento || '',
    email: doador.email || '',
    telefone: doador.telefone || '',
    cidade: doador.cidade || doador.municipio || '',
    estado: doador.estado || '',

    tipoDoacao: dados.tipoDoacao || 'Financeira',
    forma: dados.forma || 'Pix',

    valor:
      dados.forma === 'Pix' && !dados.valor
        ? 'Valor informado no banco'
        : formatarValor(dados.valor),

    banco: dados.forma === 'TED' ? 'Banestes' : 'PIX',
    agencia: dados.forma === 'TED' ? '059' : '',
    conta: dados.forma === 'TED' ? '6.948.103' : '',
    chavePix: dados.forma === 'Pix' ? '27363944000180' : '',

    comprovante: dados.comprovante || '',
    status: dados.forma === 'TED' ? 'Pendente' : 'Confirmado'
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

  const atualizadas = doacoes.map((item) =>
    item.id === id ? { ...item, status: novoStatus } : item
  )

  salvarDoacoes(atualizadas)
  return atualizadas
}

function salvarDoacoes(doacoes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doacoes))
}

function formatarValor(valor) {
  const numero = Number(String(valor || 0).replace(',', '.'))

  if (!valor || isNaN(numero)) return 'R$ 0,00'

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}