/*
  Banco local de palavras da Aventura dos Blocos.

  Aqui ficam palavras educativas separadas por categoria.
  Não usamos nome de pai, mãe, bairro ou dados pessoais da criança.

  Campos:
  - id: identificador único
  - categoria: tema da palavra
  - imagem: emoji usado como imagem inicial
  - dica: texto mostrado para a criança
  - resposta: palavra que será montada com os blocos
  - nivelMinimo: a partir de qual nível essa palavra pode aparecer
*/

export const palavrasAventuraBlocos = [
  // VOGAIS
  {
    id: 'vogal-a',
    categoria: 'Vogais',
    imagem: '🔤',
    dica: 'Qual é a primeira vogal?',
    resposta: 'A',
    nivelMinimo: 1
  },
  {
    id: 'vogal-e',
    categoria: 'Vogais',
    imagem: '🔤',
    dica: 'Qual vogal vem depois da letra A?',
    resposta: 'E',
    nivelMinimo: 1
  },
  {
    id: 'vogal-i',
    categoria: 'Vogais',
    imagem: '🔤',
    dica: 'Monte a vogal I.',
    resposta: 'I',
    nivelMinimo: 1
  },
  {
    id: 'vogal-o',
    categoria: 'Vogais',
    imagem: '🔤',
    dica: 'Monte a vogal O.',
    resposta: 'O',
    nivelMinimo: 1
  },
  {
    id: 'vogal-u',
    categoria: 'Vogais',
    imagem: '🔤',
    dica: 'Monte a vogal U.',
    resposta: 'U',
    nivelMinimo: 1
  },

  // PALAVRAS SIMPLES
  {
    id: 'sol',
    categoria: 'Natureza',
    imagem: '☀️',
    dica: 'O que brilha no céu durante o dia?',
    resposta: 'SOL',
    nivelMinimo: 2
  },
  {
    id: 'lua',
    categoria: 'Natureza',
    imagem: '🌙',
    dica: 'O que aparece no céu à noite?',
    resposta: 'LUA',
    nivelMinimo: 2
  },
  {
    id: 'rio',
    categoria: 'Natureza',
    imagem: '🏞️',
    dica: 'Água que corre pela natureza.',
    resposta: 'RIO',
    nivelMinimo: 2
  },
  {
    id: 'paz',
    categoria: 'Palavras do Bem',
    imagem: '🕊️',
    dica: 'Uma palavra que combina com tranquilidade.',
    resposta: 'PAZ',
    nivelMinimo: 2
  },

  // ANIMAIS
  {
    id: 'gato',
    categoria: 'Animais',
    imagem: '🐱',
    dica: 'Que animal é esse?',
    resposta: 'GATO',
    nivelMinimo: 3
  },
  {
    id: 'pato',
    categoria: 'Animais',
    imagem: '🦆',
    dica: 'Que animal é esse?',
    resposta: 'PATO',
    nivelMinimo: 3
  },
  {
    id: 'sapo',
    categoria: 'Animais',
    imagem: '🐸',
    dica: 'Que animal pula e vive perto da água?',
    resposta: 'SAPO',
    nivelMinimo: 3
  },
  {
    id: 'leao',
    categoria: 'Animais',
    imagem: '🦁',
    dica: 'Animal conhecido como rei da selva.',
    resposta: 'LEAO',
    nivelMinimo: 5
  },
  {
    id: 'peixe',
    categoria: 'Animais',
    imagem: '🐟',
    dica: 'Animal que vive na água.',
    resposta: 'PEIXE',
    nivelMinimo: 7
  },
  {
    id: 'coelho',
    categoria: 'Animais',
    imagem: '🐰',
    dica: 'Animal que gosta de cenoura.',
    resposta: 'COELHO',
    nivelMinimo: 10
  },
  {
    id: 'cavalo',
    categoria: 'Animais',
    imagem: '🐴',
    dica: 'Animal usado para montar e correr.',
    resposta: 'CAVALO',
    nivelMinimo: 12
  },
  {
    id: 'cachorro',
    categoria: 'Animais',
    imagem: '🐶',
    dica: 'Conhecido como melhor amigo do ser humano.',
    resposta: 'CACHORRO',
    nivelMinimo: 18
  },

  // FRUTAS
  {
    id: 'uva',
    categoria: 'Frutas',
    imagem: '🍇',
    dica: 'Que fruta é essa?',
    resposta: 'UVA',
    nivelMinimo: 3
  },
  {
    id: 'maca',
    categoria: 'Frutas',
    imagem: '🍎',
    dica: 'Que fruta é essa?',
    resposta: 'MACA',
    nivelMinimo: 4
  },
  {
    id: 'pera',
    categoria: 'Frutas',
    imagem: '🍐',
    dica: 'Que fruta é essa?',
    resposta: 'PERA',
    nivelMinimo: 4
  },
  {
    id: 'banana',
    categoria: 'Frutas',
    imagem: '🍌',
    dica: 'Fruta amarela que muitos macacos gostam.',
    resposta: 'BANANA',
    nivelMinimo: 9
  },
  {
    id: 'melancia',
    categoria: 'Frutas',
    imagem: '🍉',
    dica: 'Fruta grande, verde por fora e vermelha por dentro.',
    resposta: 'MELANCIA',
    nivelMinimo: 20
  },

  // OBJETOS
  {
    id: 'bola',
    categoria: 'Objetos',
    imagem: '⚽',
    dica: 'Objeto usado para jogar futebol.',
    resposta: 'BOLA',
    nivelMinimo: 4
  },
  {
    id: 'carro',
    categoria: 'Objetos',
    imagem: '🚗',
    dica: 'Meio de transporte com quatro rodas.',
    resposta: 'CARRO',
    nivelMinimo: 6
  },
  {
    id: 'casa',
    categoria: 'Objetos',
    imagem: '🏠',
    dica: 'Lugar onde a família mora.',
    resposta: 'CASA',
    nivelMinimo: 5
  },
  {
    id: 'porta',
    categoria: 'Objetos',
    imagem: '🚪',
    dica: 'Usamos para entrar e sair de um lugar.',
    resposta: 'PORTA',
    nivelMinimo: 8
  },
  {
    id: 'janela',
    categoria: 'Objetos',
    imagem: '🪟',
    dica: 'Por ela entra luz e vento.',
    resposta: 'JANELA',
    nivelMinimo: 12
  },

  // UTENSÍLIOS
  {
    id: 'copo',
    categoria: 'Utensílios',
    imagem: '🥛',
    dica: 'Usamos para beber água.',
    resposta: 'COPO',
    nivelMinimo: 5
  },
  {
    id: 'prato',
    categoria: 'Utensílios',
    imagem: '🍽️',
    dica: 'Usamos para colocar comida.',
    resposta: 'PRATO',
    nivelMinimo: 8
  },
  {
    id: 'garfo',
    categoria: 'Utensílios',
    imagem: '🍴',
    dica: 'Usamos para comer alguns alimentos.',
    resposta: 'GARFO',
    nivelMinimo: 9
  },
  {
    id: 'colher',
    categoria: 'Utensílios',
    imagem: '🥄',
    dica: 'Usamos para sopa, feijão e sobremesa.',
    resposta: 'COLHER',
    nivelMinimo: 13
  },
  {
    id: 'panela',
    categoria: 'Utensílios',
    imagem: '🍲',
    dica: 'Usamos para cozinhar alimentos.',
    resposta: 'PANELA',
    nivelMinimo: 14
  },

  // MATERIAL ESCOLAR
  {
    id: 'lapis',
    categoria: 'Material Escolar',
    imagem: '✏️',
    dica: 'Usamos para escrever e desenhar.',
    resposta: 'LAPIS',
    nivelMinimo: 6
  },
  {
    id: 'livro',
    categoria: 'Material Escolar',
    imagem: '📘',
    dica: 'Usamos para ler e aprender.',
    resposta: 'LIVRO',
    nivelMinimo: 7
  },
  {
    id: 'cola',
    categoria: 'Material Escolar',
    imagem: '🧴',
    dica: 'Usamos para colar papel.',
    resposta: 'COLA',
    nivelMinimo: 7
  },
  {
    id: 'regua',
    categoria: 'Material Escolar',
    imagem: '📏',
    dica: 'Usamos para medir e fazer linhas retas.',
    resposta: 'REGUA',
    nivelMinimo: 9
  },
  {
    id: 'caderno',
    categoria: 'Material Escolar',
    imagem: '📒',
    dica: 'Usamos para escrever as atividades da escola.',
    resposta: 'CADERNO',
    nivelMinimo: 15
  },
  {
    id: 'borracha',
    categoria: 'Material Escolar',
    imagem: '◻️',
    dica: 'Usamos para apagar o lápis.',
    resposta: 'BORRACHA',
    nivelMinimo: 20
  },

  // PALAVRAS DO BEM
  {
    id: 'amor',
    categoria: 'Palavras do Bem',
    imagem: '❤️',
    dica: 'Sentimento bonito que aproxima as pessoas.',
    resposta: 'AMOR',
    nivelMinimo: 5
  },
  {
    id: 'ajuda',
    categoria: 'Palavras do Bem',
    imagem: '🤝',
    dica: 'Quando fazemos algo para apoiar alguém.',
    resposta: 'AJUDA',
    nivelMinimo: 8
  },
  {
    id: 'cuidado',
    categoria: 'Palavras do Bem',
    imagem: '💛',
    dica: 'Atenção, carinho e proteção com alguém.',
    resposta: 'CUIDADO',
    nivelMinimo: 16
  },
  {
    id: 'respeito',
    categoria: 'Palavras do Bem',
    imagem: '🙌',
    dica: 'Tratar o outro com consideração.',
    resposta: 'RESPEITO',
    nivelMinimo: 22
  }
]