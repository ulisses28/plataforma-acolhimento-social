/*
  SERVIÇO LOCAL DO PERFIL DE JOGADOR

  Objetivo desta versão:
  - Vincular o perfil de jogador ao doador logado, quando existir.
  - Evitar que vários doadores usando o mesmo computador misturem perfis.
  - Manter suporte para visitante.
  - Não usar foto própria por segurança, privacidade e LGPD.
*/

const BASE_STORAGE_KEY = 'perfil_jogador_lar_batista'
const DOADOR_LOGADO_KEY = 'doador_logado_lar_batista'

/*
  Retorna o doador logado salvo no sistema.
  Se não houver doador logado, retorna null.
*/
export function carregarDoadorLogadoParaJogos() {
  const dados = localStorage.getItem(DOADOR_LOGADO_KEY)

  if (!dados) return null

  try {
    return JSON.parse(dados)
  } catch (error) {
    console.error('Erro ao carregar doador logado para jogos:', error)
    return null
  }
}

/*
  Cria uma identificação segura para separar perfis.

  Exemplo:
  - perfil_jogador_lar_batista_doador_123
  - perfil_jogador_lar_batista_email_teste@email.com
  - perfil_jogador_lar_batista_visitante
*/
export function obterEscopoPerfilJogador() {
  const doador = carregarDoadorLogadoParaJogos()

  if (doador?.id) {
    return `doador_${doador.id}`
  }

  if (doador?.email) {
    return `email_${normalizarChave(doador.email)}`
  }

  return 'visitante'
}

export function obterStorageKeyPerfilJogador() {
  return `${BASE_STORAGE_KEY}_${obterEscopoPerfilJogador()}`
}

/*
  Carrega o perfil do jogador do escopo atual.

  Se o doador estiver logado, carrega o perfil daquele doador.
  Se não estiver logado, carrega o perfil visitante.
*/
export function carregarPerfilJogador() {
  const storageKey = obterStorageKeyPerfilJogador()
  const dados = localStorage.getItem(storageKey)

  if (!dados) return null

  try {
    return JSON.parse(dados)
  } catch (error) {
    console.error('Erro ao carregar perfil do jogador:', error)
    return null
  }
}

/*
  Salva o perfil do jogador no escopo correto.

  Se estiver logado:
  - salva vinculado ao doador.

  Se não estiver logado:
  - salva como visitante.
*/
export function salvarPerfilJogador(perfil) {
  const doador = carregarDoadorLogadoParaJogos()
  const escopo = obterEscopoPerfilJogador()
  const storageKey = obterStorageKeyPerfilJogador()

  const seedFinal = perfil.avatarSeed || gerarSeedAleatoria()

  const perfilNormalizado = {
    id: perfil.id || gerarIdJogador(doador, escopo),
    escopo,
    doadorId: doador?.id || '',
    doadorEmail: doador?.email || '',
    doadorNome: doador?.nome || '',
    apelido: perfil.apelido?.trim() || doador?.nome || 'Visitante Solidário',
    estiloAvatar: perfil.estiloAvatar || 'adventurer',
    avatarSeed: seedFinal,
    avatarUrl: gerarAvatarUrl({
      estiloAvatar: perfil.estiloAvatar || 'adventurer',
      avatarSeed: seedFinal
    }),
    criadoEm: perfil.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  }

  localStorage.setItem(storageKey, JSON.stringify(perfilNormalizado))

  /*
    Compatibilidade:
    Mantemos também uma cópia antiga para telas que ainda usem a chave antiga.
    Depois podemos remover isso quando tudo estiver migrado.
  */
  localStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(perfilNormalizado))

  return perfilNormalizado
}

/*
  Apaga somente o perfil do escopo atual.
  Se for doador logado, apaga o perfil daquele doador.
  Se for visitante, apaga o perfil visitante.
*/
export function apagarPerfilJogador() {
  const storageKey = obterStorageKeyPerfilJogador()

  localStorage.removeItem(storageKey)
  localStorage.removeItem(BASE_STORAGE_KEY)
}

export function gerarSeedAleatoria() {
  return `lar-${Date.now()}-${Math.floor(Math.random() * 99999)}`
}

export function gerarAvatarUrl({ estiloAvatar = 'adventurer', avatarSeed }) {
  const seed = encodeURIComponent(avatarSeed || gerarSeedAleatoria())

  return `https://api.dicebear.com/9.x/${estiloAvatar}/svg?seed=${seed}`
}

/*
  Cria um ID estável para o jogador.

  Prioridade:
  1. ID do doador logado.
  2. E-mail do doador logado.
  3. Visitante local.
*/
function gerarIdJogador(doador, escopo) {
  if (doador?.id) {
    return `doador-${doador.id}`
  }

  if (doador?.email) {
    return `email-${normalizarChave(doador.email)}`
  }

  return `visitante-${escopo}`
}

function normalizarChave(valor) {
  return String(valor || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, '-')
}

export const estilosAvatar = [
  {
    id: 'adventurer',
    nome: 'Aventureiro'
  },
  {
    id: 'bottts',
    nome: 'Robô'
  },
  {
    id: 'fun-emoji',
    nome: 'Divertido'
  },
  {
    id: 'thumbs',
    nome: 'Personagem'
  },
  {
    id: 'notionists',
    nome: 'Criativo'
  },
  {
    id: 'pixel-art',
    nome: 'Pixel'
  }
]