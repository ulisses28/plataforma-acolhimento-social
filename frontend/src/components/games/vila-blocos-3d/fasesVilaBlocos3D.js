/*
  FASES DA VILA DOS BLOCOS 3D

  Este arquivo concentra as fases do jogo.

  Manutenção futura:
  - Para alterar uma fase, edite o objeto correspondente.
  - Para adicionar fases novas, copie um objeto e mude numero, id, nome e palavra.
  - As posições das letras são geradas automaticamente pela função criarBlocosDaFase.
  - letrasFalsas servem para confundir e estimular lógica.
*/

export const FASES_VILA_BLOCOS_3D = [
  {
    numero: 1,
    id: 'vila-verde',
    nome: 'Vila Verde',
    tipoMapa: 'vila',
    clima: 'sol',
    icone: '☀️',
    palavra: 'AMOR',
    tema: 'Solidariedade',
    objetivo: 'Pegue as letras corretas e monte a palavra AMOR.',
    dica: 'Comece procurando a primeira letra da palavra.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 1,
    tamanhoMapa: 17,
    letrasFalsas: ['B', 'C', 'S', 'T', 'P', 'L'],
    cores: {
      ceu: '#7dd3fc',
      chao: '#4ade80',
      chaoAlternativo: '#22c55e',
      lateral: '#8b5a2b',
      neblina: '#e0f2fe'
    }
  },
  {
    numero: 2,
    id: 'bosque-cuidado',
    nome: 'Bosque do Cuidado',
    tipoMapa: 'floresta',
    clima: 'dia',
    icone: '🌳',
    palavra: 'PAZ',
    tema: 'Cuidado',
    objetivo: 'Leve as letras até a plataforma para formar PAZ.',
    dica: 'Alguns blocos são falsos. Observe a ordem da palavra.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 1,
    tamanhoMapa: 17,
    letrasFalsas: ['M', 'R', 'O', 'T', 'V', 'C'],
    cores: {
      ceu: '#93c5fd',
      chao: '#65a30d',
      chaoAlternativo: '#4d7c0f',
      lateral: '#7c2d12',
      neblina: '#dcfce7'
    }
  },
  {
    numero: 3,
    id: 'cidade-chuvosa',
    nome: 'Cidade Chuvosa',
    tipoMapa: 'cidade',
    clima: 'chuva',
    icone: '🌧️',
    palavra: 'LAR',
    tema: 'Proteção',
    objetivo: 'Ande pela cidade, encontre as letras e forme LAR.',
    dica: 'A chuva dificulta a visão, mas a plataforma fica iluminada.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 2,
    tamanhoMapa: 24,
    letrasFalsas: ['A', 'P', 'M', 'S', 'T', 'C', 'O'],
    cores: {
      ceu: '#334155',
      chao: '#475569',
      chaoAlternativo: '#64748b',
      lateral: '#1e293b',
      neblina: '#94a3b8'
    }
  },
  {
    numero: 4,
    id: 'montanha-neve',
    nome: 'Montanha de Neve',
    tipoMapa: 'neve',
    clima: 'neve',
    icone: '❄️',
    palavra: 'LUZ',
    tema: 'Esperança',
    objetivo: 'Explore a neve e monte a palavra LUZ.',
    dica: 'Os blocos falsos se misturam com o cenário claro.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 2,
    tamanhoMapa: 35,
    letrasFalsas: ['P', 'A', 'R', 'S', 'N', 'V', 'O'],
    cores: {
      ceu: '#93c5fd',
      chao: '#e0f2fe',
      chaoAlternativo: '#bae6fd',
      lateral: '#94a3b8',
      neblina: '#ffffff'
    }
  },
  {
    numero: 5,
    id: 'jardim-ajuda',
    nome: 'Jardim da Ajuda',
    tipoMapa: 'jardim',
    clima: 'sol',
    icone: '🌻',
    palavra: 'AJUDA',
    tema: 'Voluntariado',
    objetivo: 'Colete as letras certas e forme AJUDA.',
    dica: 'Palavras maiores exigem mais atenção.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 3,
    tamanhoMapa: 40,
    letrasFalsas: ['M', 'R', 'O', 'P', 'L', 'S', 'T', 'E'],
    cores: {
      ceu: '#86efac',
      chao: '#65a30d',
      chaoAlternativo: '#84cc16',
      lateral: '#92400e',
      neblina: '#fef9c3'
    }
  },
  {
    numero: 6,
    id: 'floresta-alta',
    nome: 'Floresta Alta',
    tipoMapa: 'floresta',
    clima: 'floresta',
    icone: '🌲',
    palavra: 'VIDA',
    tema: 'Natureza e cuidado',
    objetivo: 'Procure as letras entre árvores, matos e caminhos.',
    dica: 'Não pegue o primeiro bloco que encontrar. Confira a palavra.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 3,
    tamanhoMapa: 50,
    letrasFalsas: ['A', 'M', 'O', 'R', 'L', 'P', 'S', 'T', 'C'],
    cores: {
      ceu: '#38bdf8',
      chao: '#166534',
      chaoAlternativo: '#15803d',
      lateral: '#5b3418',
      neblina: '#dcfce7'
    }
  },
  {
    numero: 7,
    id: 'noite-estrelada',
    nome: 'Noite Estrelada',
    tipoMapa: 'noite',
    clima: 'noite',
    icone: '🌙',
    palavra: 'SONHO',
    tema: 'Esperança',
    objetivo: 'Use as luzes do cenário para encontrar SONHO.',
    dica: 'As letras brilham mais quando estão próximas.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 3,
    tamanhoMapa: 59,
    letrasFalsas: ['A', 'M', 'R', 'P', 'L', 'U', 'Z', 'C'],
    cores: {
      ceu: '#020617',
      chao: '#1e293b',
      chaoAlternativo: '#334155',
      lateral: '#111827',
      neblina: '#475569'
    }
  },
  {
    numero: 8,
    id: 'cidade-neon',
    nome: 'Cidade Neon',
    tipoMapa: 'neon',
    clima: 'neon',
    icone: '🎧',
    palavra: 'FOCO',
    tema: 'Tecnologia e atenção',
    objetivo: 'Monte FOCO em uma cidade com luzes e ritmo.',
    dica: 'As luzes confundem, então acompanhe a ordem da palavra.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 4,
    tamanhoMapa: 50,
    letrasFalsas: ['A', 'M', 'R', 'P', 'S', 'T', 'L', 'N', 'E'],
    cores: {
      ceu: '#111827',
      chao: '#312e81',
      chaoAlternativo: '#1e1b4b',
      lateral: '#0f172a',
      neblina: '#a78bfa'
    }
  },
  {
    numero: 9,
    id: 'vale-gelado',
    nome: 'Vale Gelado',
    tipoMapa: 'neve',
    clima: 'frio',
    icone: '🧊',
    palavra: 'FORCA',
    tema: 'Coragem',
    objetivo: 'Encontre as letras da palavra FORÇA no vale gelado.',
    dica: 'No código usamos FORCA sem acento para facilitar a montagem.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 4,
    tamanhoMapa: 51,
    letrasFalsas: ['A', 'M', 'O', 'R', 'L', 'P', 'S', 'T', 'U', 'Z'],
    cores: {
      ceu: '#60a5fa',
      chao: '#bae6fd',
      chaoAlternativo: '#7dd3fc',
      lateral: '#64748b',
      neblina: '#dbeafe'
    }
  },
  {
    numero: 10,
    id: 'floresta-alerta',
    nome: 'Floresta em Alerta',
    tipoMapa: 'floresta-fogo',
    clima: 'fogo',
    icone: '🔥',
    palavra: 'CUIDADO',
    tema: 'Proteção ambiental',
    objetivo: 'Monte CUIDADO antes que o fogo avance.',
    dica: 'Fase com tempo. Complete a palavra antes do perigo aumentar.',
    tempoLimite: 300,
    perigo: 'fogo',
    dificuldade: 5,
    tamanhoMapa: 72,
    letrasFalsas: ['A', 'B', 'E', 'M', 'R', 'S', 'T', 'L', 'P', 'V'],
    cores: {
      ceu: '#7f1d1d',
      chao: '#365314',
      chaoAlternativo: '#4d7c0f',
      lateral: '#7c2d12',
      neblina: '#f97316'
    }
  },
  {
    numero: 11,
    id: 'cidade-alagada',
    nome: 'Cidade Alagada',
    tipoMapa: 'cidade',
    clima: 'enchente',
    icone: '🌊',
    palavra: 'PROTEGER',
    tema: 'Prevenção',
    objetivo: 'Monte PROTEGER antes que a água suba.',
    dica: 'Fase com tempo e enchente. Seja rápido e lógico.',
    tempoLimite: 300,
    perigo: 'enchente',
    dificuldade: 5,
    tamanhoMapa: 72,
    letrasFalsas: ['A', 'C', 'D', 'L', 'M', 'S', 'V', 'B', 'N'],
    cores: {
      ceu: '#1e3a8a',
      chao: '#475569',
      chaoAlternativo: '#334155',
      lateral: '#1e293b',
      neblina: '#38bdf8'
    }
  },
  {
    numero: 12,
    id: 'deserto-dourado',
    nome: 'Deserto Dourado',
    tipoMapa: 'deserto',
    clima: 'sol-forte',
    icone: '🏜️',
    palavra: 'FE',
    tema: 'Persistência',
    objetivo: 'Atravesse o deserto e forme FÉ.',
    dica: 'No código usamos FE sem acento para facilitar.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 5,
    tamanhoMapa: 65,
    letrasFalsas: ['A', 'M', 'O', 'R', 'L', 'P', 'S', 'T', 'C', 'D'],
    cores: {
      ceu: '#facc15',
      chao: '#d97706',
      chaoAlternativo: '#f59e0b',
      lateral: '#92400e',
      neblina: '#fef3c7'
    }
  },
  {
    numero: 13,
    id: 'ilha-blocos',
    nome: 'Ilha dos Blocos',
    tipoMapa: 'ilha',
    clima: 'praia',
    icone: '🏝️',
    palavra: 'UNIAO',
    tema: 'Cooperação',
    objetivo: 'Monte UNIÃO atravessando caminhos entre blocos.',
    dica: 'No código usamos UNIAO sem acento.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 6,
    tamanhoMapa: 50,
    letrasFalsas: ['A', 'M', 'O', 'R', 'P', 'S', 'T', 'L', 'V', 'C'],
    cores: {
      ceu: '#67e8f9',
      chao: '#facc15',
      chaoAlternativo: '#eab308',
      lateral: '#0e7490',
      neblina: '#cffafe'
    }
  },
  {
    numero: 14,
    id: 'festival-luzes',
    nome: 'Festival de Luzes',
    tipoMapa: 'festival',
    clima: 'musica',
    icone: '🎵',
    palavra: 'RITMO',
    tema: 'Alegria e aprendizado',
    objetivo: 'Monte RITMO em uma fase com luzes coloridas.',
    dica: 'As luzes mudam o ambiente, mas a sequência da palavra não muda.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 6,
    tamanhoMapa: 62,
    letrasFalsas: ['A', 'B', 'C', 'D', 'E', 'L', 'P', 'S', 'U', 'V'],
    cores: {
      ceu: '#1e1b4b',
      chao: '#581c87',
      chaoAlternativo: '#7e22ce',
      lateral: '#111827',
      neblina: '#f0abfc'
    }
  },
  {
    numero: 15,
    id: 'castelo-esperanca',
    nome: 'Castelo da Esperança',
    tipoMapa: 'castelo',
    clima: 'epico',
    icone: '🏰',
    palavra: 'ESPERANCA',
    tema: 'Conclusão do primeiro mundo',
    objetivo: 'Complete ESPERANÇA e finalize o primeiro ciclo de fases.',
    dica: 'No código usamos ESPERANCA sem acento.',
    tempoLimite: null,
    perigo: null,
    dificuldade: 7,
    tamanhoMapa: 85,
    letrasFalsas: ['A', 'B', 'C', 'D', 'F', 'L', 'M', 'O', 'T', 'U', 'V'],
    cores: {
      ceu: '#bfdbfe',
      chao: '#22c55e',
      chaoAlternativo: '#16a34a',
      lateral: '#64748b',
      neblina: '#dbeafe'
    }
  }
]

/*
  Retorna a fase com base no índice atual.
  Se passar do final, volta para a primeira fase.
*/
export function obterFasePorIndice(indice) {
  const seguro = Math.max(0, indice)
  return FASES_VILA_BLOCOS_3D[seguro % FASES_VILA_BLOCOS_3D.length]
}

/*
  Cria os blocos de letras da fase.

  A palavra correta entra uma letra por vez.
  As letras falsas entram para confundir.
  Depois embaralhamos e distribuímos pelo mapa.
*/
export function criarBlocosDaFase(fase) {
  const letrasCorretas = fase.palavra.split('').map((letra, index) => ({
    id: `${fase.id}-correta-${letra}-${index}`,
    letra,
    correta: true,
    ordemCorreta: index,
    tipo: 'correta'
  }))

  const letrasFalsas = fase.letrasFalsas.map((letra, index) => ({
    id: `${fase.id}-falsa-${letra}-${index}`,
    letra,
    correta: false,
    ordemCorreta: null,
    tipo: 'falsa'
  }))

  const blocos = embaralhar([...letrasCorretas, ...letrasFalsas])
  const posicoes = criarPosicoesEspalhadas(fase.tamanhoMapa, blocos.length)

  return blocos.map((bloco, index) => ({
    ...bloco,
    position: posicoes[index],
    coletado: false,
    colocado: false
  }))
}

/*
  Cria posições distribuídas pelo mapa.

  Mantemos os blocos longe do centro inicial do jogador e longe da plataforma.
*/
/*
  Distribui os blocos pelo mapa de forma mais espalhada.

  Agora as letras ficam longe da posição inicial e longe da plataforma.
  Isso força o jogador a explorar melhor o cenário.
*/
function criarPosicoesEspalhadas(tamanhoMapa, quantidade) {
  const limite = Math.floor(tamanhoMapa / 2) - 2
  const posicoesPossiveis = []

  for (let z = -limite + 3; z <= limite - 3; z += 3) {
    for (let x = -limite + 1; x <= limite - 1; x += 3) {
      const pertoDoInicio = Math.abs(x) <= 2 && z >= limite - 4
      const pertoDaPlataforma = Math.abs(x) <= 3 && z <= -limite + 4
      const centroMuitoLivre = Math.abs(x) <= 1 && Math.abs(z) <= 1

      if (!pertoDoInicio && !pertoDaPlataforma && !centroMuitoLivre) {
        posicoesPossiveis.push([x, 0.75, z])
      }
    }
  }

  const embaralhadas = embaralhar(posicoesPossiveis)

  return Array.from({ length: quantidade }).map((_, index) => {
    const base = embaralhadas[index % embaralhadas.length]
    const ciclo = Math.floor(index / embaralhadas.length)

    return [
      limitar(base[0] + ciclo, -limite, limite),
      0.75,
      limitar(base[2] - ciclo, -limite, limite)
    ]
  })
}

function embaralhar(lista) {
  const copia = [...lista]

  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }

  return copia
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor))
}