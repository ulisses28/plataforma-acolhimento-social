const STORAGE_KEY = 'doadores_lar_batista'

/*
  SERVIÇO DE DOADORES

  Responsável por:
  - listar doadores
  - buscar doadores pelo nome
  - salvar novo doador
  - manter compatibilidade com cadastros antigos
  - incluir país, estado e município para futuros gráficos geográficos
*/

export function listarDoadores() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function buscarDoadores(nome) {
  const lista = listarDoadores()

  return lista.filter((d) =>
    String(d.nome || '')
      .toLowerCase()
      .includes(String(nome || '').toLowerCase())
  )
}

export function salvarNovoDoador(doador) {
  const lista = listarDoadores()

  const jaExiste = lista.find(
    (item) =>
      String(item.nome || '').trim().toLowerCase() ===
      String(doador.nome || '').trim().toLowerCase()
  )

  if (jaExiste) {
    return jaExiste
  }

  const novo = {
    id: Date.now(),

    // Dados principais
    nome: doador.nome || '',
    categoria: doador.categoria || 'Pessoa Física',
    telefone: doador.telefone || '',
    obs: doador.obs || '',

    // Dados opcionais
    email: doador.email || '',
    documento: doador.documento || '',
    tipoPessoa: doador.tipoPessoa || '',

    // Dados geográficos para gráficos
    paisCodigo: doador.paisCodigo || 'BR',
    pais: doador.pais || 'Brazil',
    estadoId: doador.estadoId || '',
    estado: doador.estado || '',
    municipio: doador.municipio || '',

    criadoEm: doador.criadoEm || new Date().toLocaleDateString('pt-BR')
  }

  const novaLista = [...lista, novo]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista))

  return novo
}

export function atualizarDoador(doadorAtualizado) {
  const lista = listarDoadores()

  const novaLista = lista.map((item) =>
    item.id === doadorAtualizado.id ? { ...item, ...doadorAtualizado } : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista))

  return doadorAtualizado
}