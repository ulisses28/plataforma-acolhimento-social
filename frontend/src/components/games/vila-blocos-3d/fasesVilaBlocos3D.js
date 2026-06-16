/*
  FASES DO JOGO VILA DOS BLOCOS 3D

  Este arquivo concentra as informações das fases:
  - nome
  - clima
  - palavra educativa
  - cores do ambiente
  - posições das letras no mundo 3D

  Manutenção futura:
  Para criar uma nova fase, basta adicionar um novo objeto no array FASES_VILA_BLOCOS_3D.
*/

export const FASES_VILA_BLOCOS_3D = [
  {
    id: 'vila-verde',
    nome: 'Vila Verde',
    clima: 'sol',
    icone: '☀️',
    palavra: 'AMOR',
    tema: 'Solidariedade',
    missao: 'Colete as letras na ordem certa e forme a palavra AMOR.',
    mensagemFinal: 'O amor transforma pequenas atitudes em grandes gestos.',
    ceu: '#7dd3fc',
    chao: '#4ade80',
    lateralBloco: '#8b5a2b',
    ambiente: 'Dia ensolarado',
    letras: [
      { letra: 'A', posicao: [-4, 0.8, -2] },
      { letra: 'M', posicao: [3, 0.8, -3] },
      { letra: 'O', posicao: [-2, 0.8, 3] },
      { letra: 'R', posicao: [4, 0.8, 2] }
    ]
  },
  {
    id: 'montanha-neve',
    nome: 'Montanha de Neve',
    clima: 'neve',
    icone: '❄️',
    palavra: 'PAZ',
    tema: 'Cuidado',
    missao: 'Atravesse o cenário de neve e forme a palavra PAZ.',
    mensagemFinal: 'A paz começa quando escolhemos cuidar e respeitar.',
    ceu: '#93c5fd',
    chao: '#e0f2fe',
    lateralBloco: '#94a3b8',
    ambiente: 'Neve leve',
    letras: [
      { letra: 'P', posicao: [-4, 0.8, -2] },
      { letra: 'A', posicao: [3, 0.8, -3] },
      { letra: 'Z', posicao: [2, 0.8, 3] }
    ]
  },
  {
    id: 'floresta-chuvosa',
    nome: 'Floresta Chuvosa',
    clima: 'chuva',
    icone: '🌧️',
    palavra: 'LAR',
    tema: 'Proteção',
    missao: 'Mesmo com chuva, encontre as letras e forme LAR.',
    mensagemFinal: 'Lar é lugar de proteção, cuidado e esperança.',
    ceu: '#334155',
    chao: '#166534',
    lateralBloco: '#5b3418',
    ambiente: 'Chuva leve',
    letras: [
      { letra: 'L', posicao: [-3, 0.8, -2] },
      { letra: 'A', posicao: [4, 0.8, -1] },
      { letra: 'R', posicao: [0, 0.8, 3] }
    ]
  },
  {
    id: 'vale-gelado',
    nome: 'Vale Gelado',
    clima: 'frio',
    icone: '🧊',
    palavra: 'LUZ',
    tema: 'Esperança',
    missao: 'Explore o vale gelado e forme a palavra LUZ.',
    mensagemFinal: 'A esperança é luz nos momentos difíceis.',
    ceu: '#60a5fa',
    chao: '#bae6fd',
    lateralBloco: '#64748b',
    ambiente: 'Frio intenso',
    letras: [
      { letra: 'L', posicao: [-4, 0.8, -3] },
      { letra: 'U', posicao: [2, 0.8, -2] },
      { letra: 'Z', posicao: [4, 0.8, 3] }
    ]
  },
  {
    id: 'jardim-esperanca',
    nome: 'Jardim da Esperança',
    clima: 'sol',
    icone: '🌻',
    palavra: 'AJUDA',
    tema: 'Voluntariado',
    missao: 'Colete as letras e forme a palavra AJUDA.',
    mensagemFinal: 'Ajudar é participar da transformação de vidas.',
    ceu: '#86efac',
    chao: '#65a30d',
    lateralBloco: '#92400e',
    ambiente: 'Jardim claro',
    letras: [
      { letra: 'A', posicao: [-5, 0.8, -3] },
      { letra: 'J', posicao: [3, 0.8, -4] },
      { letra: 'U', posicao: [-3, 0.8, 3] },
      { letra: 'D', posicao: [2, 0.8, 3] },
      { letra: 'A', posicao: [5, 0.8, 0] }
    ]
  }
]