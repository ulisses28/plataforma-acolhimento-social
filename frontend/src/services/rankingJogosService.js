/*
  SERVIÇO LOCAL DO RANKING DOS JOGOS

  Objetivo desta versão:
  - Manter ranking local no navegador.
  - Usar jogadorId estável.
  - Preparar o sistema para vincular ranking ao doador logado.
  - Evitar duplicidade quando o mesmo doador joga várias vezes.
*/

const STORAGE_KEY = 'ranking_jogos_lar_batista'

/*
  Lista o ranking de um jogo específico.
*/
export function listarRankingJogos(jogoId = 'aventura-blocos') {
  const ranking = carregarRankingCompleto()

  return ranking
    .filter((item) => item.jogoId === jogoId)
    .sort(ordenarRanking)
    .slice(0, 10)
}

/*
  Registra ou atualiza a pontuação de um jogador.

  Se já existir ranking para o mesmo jogo e jogador:
  - só substitui se a nova pontuação for melhor.
*/
export function registrarPontuacaoJogo(dados) {
  const ranking = carregarRankingCompleto()

  const novoRegistro = {
    id: dados.id || `${dados.jogoId || 'aventura-blocos'}-${dados.jogadorId || 'visitante'}-${Date.now()}`,
    jogoId: dados.jogoId || 'aventura-blocos',
    jogadorId: dados.jogadorId || 'visitante',
    doadorId: dados.doadorId || '',
    doadorEmail: dados.doadorEmail || '',
    apelido: dados.apelido || 'Jogador Solidário',
    avatarUrl: dados.avatarUrl || '',
    personagem: dados.personagem || 'Personagem Azul',
    pontos: Number(dados.pontos) || 0,
    nivel: Number(dados.nivel) || 1,
    acertos: Number(dados.acertos) || 0,
    maiorNivel: Number(dados.maiorNivel) || Number(dados.nivel) || 1,
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
      novoRegistro.nivel > registroAtual.nivel ||
      novoRegistro.maiorNivel > (registroAtual.maiorNivel || 1)

    if (novoEhMelhor) {
      ranking[indiceExistente] = {
        ...registroAtual,
        ...novoRegistro,
        id: registroAtual.id,
        atualizadoEm: new Date().toISOString()
      }
    }
  } else {
    ranking.push({
      ...novoRegistro,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    })
  }

  const rankingOrdenado = ranking.sort(ordenarRanking).slice(0, 50)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingOrdenado))

  return listarRankingJogos(novoRegistro.jogoId)
}

/*
  Limpa o ranking de um jogo específico.
*/
export function limparRankingJogos(jogoId = 'aventura-blocos') {
  const ranking = carregarRankingCompleto()

  const rankingAtualizado = ranking.filter((item) => item.jogoId !== jogoId)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingAtualizado))

  return []
}

/*
  Carrega todos os rankings salvos localmente.
*/
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

/*
  Ordenação:
  1. Mais pontos.
  2. Maior nível.
  3. Mais acertos.
*/
function ordenarRanking(a, b) {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos
  if ((b.maiorNivel || b.nivel) !== (a.maiorNivel || a.nivel)) {
    return (b.maiorNivel || b.nivel) - (a.maiorNivel || a.nivel)
  }

  return b.acertos - a.acertos
}