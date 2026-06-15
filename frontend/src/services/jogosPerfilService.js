const STORAGE_KEY = 'perfil_jogador_lar_batista'

/*
  Serviço local do perfil de jogador.

  Por enquanto, o perfil fica salvo apenas no navegador da pessoa
  usando localStorage. Isso evita mexer com banco de dados agora.

  Não usamos foto própria para evitar problemas com privacidade/LGPD.
  O avatar é gerado por URL com base no apelido escolhido.
*/

export function carregarPerfilJogador() {
  const dados = localStorage.getItem(STORAGE_KEY)

  if (!dados) return null

  try {
    return JSON.parse(dados)
  } catch (error) {
    console.error('Erro ao carregar perfil do jogador:', error)
    return null
  }
}

export function salvarPerfilJogador(perfil) {
  const perfilNormalizado = {
    id: perfil.id || Date.now(),
    apelido: perfil.apelido?.trim() || 'Visitante Solidário',
    estiloAvatar: perfil.estiloAvatar || 'adventurer',
    avatarSeed: perfil.avatarSeed || gerarSeedAleatoria(),
    avatarUrl: gerarAvatarUrl({
      estiloAvatar: perfil.estiloAvatar || 'adventurer',
      avatarSeed: perfil.avatarSeed || gerarSeedAleatoria()
    }),
    criadoEm: perfil.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString()
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfilNormalizado))

  return perfilNormalizado
}

export function apagarPerfilJogador() {
  localStorage.removeItem(STORAGE_KEY)
}

export function gerarSeedAleatoria() {
  return `lar-${Date.now()}-${Math.floor(Math.random() * 99999)}`
}

export function gerarAvatarUrl({ estiloAvatar = 'adventurer', avatarSeed }) {
  const seed = encodeURIComponent(avatarSeed || gerarSeedAleatoria())

  return `https://api.dicebear.com/9.x/${estiloAvatar}/svg?seed=${seed}`
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