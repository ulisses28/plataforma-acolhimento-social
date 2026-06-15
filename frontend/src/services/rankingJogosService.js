const STORAGE_KEY = 'ranking_jogos_lar_batista'

/*
  Ranking local dos jogos.

  Nesta primeira versão, o ranking fica salvo no navegador da pessoa.
  Depois podemos evoluir para MongoDB e ranking geral online.

  Dados salvos:
  - jogoId
  - jogadorId
  - apelido
  - avatarUrl
  - personagem
  - pontos
  - nivel
  - acertos
  - data
*/

export function listarRankingJogos(jogoId = 'aventura-blocos') {
  const ranking = carregarRankingCompleto()

  return ranking
    .filter((item) => item.jogoId === jogoId)
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos
      return b.nivel - a.nivel
    })
    .slice(0, 10)
}

export function registrarPontuacaoJogo(dados) {
  const ranking = carregarRankingCompleto()

  const novoRegistro = {
    id: dados.id || `${dados.jogoId}-${dados.jogadorId}-${Date.now()}`,
    jogoId: dados.jogoId || 'aventura-blocos',
    jogadorId: dados.jogadorId || 'visitante',
    apelido: dados.apelido || 'Jogador Solidário',
    avatarUrl: dados.avatarUrl || '',
    personagem: dados.personagem || 'Personagem Azul',
    pontos: Number(dados.pontos) || 0,
    nivel: Number(dados.nivel) || 1,
    acertos: Number(dados.acertos) || 0,
    data: dados.data || new Date().toISOString()
  }

  const indiceExistente = ranking.findIndex(
    (item) =>
      item.jogoId === novoRegistro.jogoId &&
      item.jogadorId === novoRegistro.jogadorId
  )

  if (indiceExistente >= 0) {
    const registroAtual = ranking[indiceExistente]

    const novoEhMelhor =
      novoRegistro.pontos > registroAtual.pontos ||
      novoRegistro.nivel > registroAtual.nivel

    if (novoEhMelhor) {
      ranking[indiceExistente] = novoRegistro
    }
  } else {
    ranking.push(novoRegistro)
  }

  const rankingOrdenado = ranking
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos
      return b.nivel - a.nivel
    })
    .slice(0, 50)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingOrdenado))

  return listarRankingJogos(novoRegistro.jogoId)
}

export function limparRankingJogos(jogoId = 'aventura-blocos') {
  const ranking = carregarRankingCompleto()

  const rankingAtualizado = ranking.filter((item) => item.jogoId !== jogoId)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingAtualizado))

  return []
}

function carregarRankingCompleto() {
  const dados = localStorage.getItem(STORAGE_KEY)

  if (!dados) return []

  try {
    const ranking = JSON.parse(dados)

    return Array.isArray(ranking) ? ranking : []
  } catch (error) {
    console.error('Erro ao carregar ranking dos jogos:', error)
    return []
  }
}