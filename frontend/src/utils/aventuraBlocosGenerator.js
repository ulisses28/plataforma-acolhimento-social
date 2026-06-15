import { palavrasAventuraBlocos } from '../data/aventuraBlocosPalavras'

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const NUMEROS = '0123456789'.split('')

/*
  Gera um desafio infinito para a Aventura dos Blocos.

  A cada nível, o sistema escolhe se será:
  - palavra
  - matemática

  Conforme o nível aumenta, a dificuldade também aumenta.
*/

export function gerarDesafioAventuraBlocos(nivel = 1) {
  const nivelSeguro = Number(nivel) > 0 ? Number(nivel) : 1

  const deveGerarMatematica = escolherSeVaiGerarMatematica(nivelSeguro)

  if (deveGerarMatematica) {
    return gerarDesafioMatematica(nivelSeguro)
  }

  return gerarDesafioPalavra(nivelSeguro)
}

function gerarDesafioPalavra(nivel) {
  const palavrasDisponiveis = palavrasAventuraBlocos.filter(
    (item) => item.nivelMinimo <= nivel
  )

  const palavraEscolhida = escolherAleatorio(
    palavrasDisponiveis.length > 0
      ? palavrasDisponiveis
      : palavrasAventuraBlocos
  )

  const resposta = limparResposta(palavraEscolhida.resposta)

  return {
    id: `palavra-${palavraEscolhida.id}-${Date.now()}`,
    tipo: 'palavra',
    nivel,
    categoria: palavraEscolhida.categoria,
    imagem: palavraEscolhida.imagem,
    titulo: 'Monte a palavra',
    dica: palavraEscolhida.dica,
    pergunta: palavraEscolhida.dica,
    resposta,
    blocos: gerarBlocosParaResposta(resposta, 'letra'),
    pontosBase: calcularPontosBase(nivel, resposta.length)
  }
}

function gerarDesafioMatematica(nivel) {
  const operacao = escolherOperacaoPorNivel(nivel)

  let numeroA = 1
  let numeroB = 1
  let resultado = 0
  let simbolo = '+'

  if (operacao === 'soma') {
    simbolo = '+'
    const limite = nivel < 10 ? 9 : nivel < 25 ? 20 : 50
    numeroA = sortearNumero(1, limite)
    numeroB = sortearNumero(1, limite)
    resultado = numeroA + numeroB
  }

  if (operacao === 'subtracao') {
    simbolo = '-'
    const limite = nivel < 20 ? 15 : 60
    numeroA = sortearNumero(5, limite)
    numeroB = sortearNumero(1, numeroA)
    resultado = numeroA - numeroB
  }

  if (operacao === 'multiplicacao') {
    simbolo = '×'
    const limite = nivel < 30 ? 5 : 10
    numeroA = sortearNumero(1, limite)
    numeroB = sortearNumero(1, limite)
    resultado = numeroA * numeroB
  }

  if (operacao === 'divisao') {
    simbolo = '÷'
    const divisor = sortearNumero(1, nivel < 40 ? 5 : 10)
    const respostaInteira = sortearNumero(1, nivel < 40 ? 8 : 12)

    numeroA = divisor * respostaInteira
    numeroB = divisor
    resultado = respostaInteira
  }

  const resposta = String(resultado)

  return {
    id: `matematica-${operacao}-${Date.now()}`,
    tipo: 'matematica',
    nivel,
    categoria: 'Matemática',
    imagem: '🧮',
    titulo: 'Resolva a conta',
    dica: `Quanto é ${numeroA} ${simbolo} ${numeroB}?`,
    pergunta: `${numeroA} ${simbolo} ${numeroB} = ?`,
    resposta,
    blocos: gerarBlocosParaResposta(resposta, 'numero'),
    pontosBase: calcularPontosBase(nivel, resposta.length)
  }
}

function escolherSeVaiGerarMatematica(nivel) {
  if (nivel < 4) return false

  const chance =
    nivel < 10 ? 0.25 :
    nivel < 20 ? 0.35 :
    nivel < 35 ? 0.45 :
    0.5

  return Math.random() < chance
}

function escolherOperacaoPorNivel(nivel) {
  if (nivel < 8) {
    return 'soma'
  }

  if (nivel < 15) {
    return escolherAleatorio(['soma', 'subtracao'])
  }

  if (nivel < 25) {
    return escolherAleatorio(['soma', 'subtracao', 'multiplicacao'])
  }

  return escolherAleatorio([
    'soma',
    'subtracao',
    'multiplicacao',
    'divisao'
  ])
}

function gerarBlocosParaResposta(resposta, tipo) {
  const caracteresResposta = Array.from(resposta)

  const quantidadeExtras = Math.min(
    tipo === 'numero' ? 6 : 10,
    Math.max(4, caracteresResposta.length + 3)
  )

  const fonte = tipo === 'numero' ? NUMEROS : ALFABETO
  const extras = []

  while (extras.length < quantidadeExtras) {
    const caractere = escolherAleatorio(fonte)

    extras.push(caractere)
  }

  return embaralhar([...caracteresResposta, ...extras])
}

function limparResposta(valor) {
  return String(valor || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ç/g, 'C')
    .replace(/[^A-Z0-9]/g, '')
}

function calcularPontosBase(nivel, tamanhoResposta) {
  return nivel * 10 + tamanhoResposta * 5
}

function escolherAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

function sortearNumero(min, max) {
  const minimo = Math.ceil(min)
  const maximo = Math.floor(max)

  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo
}

function embaralhar(lista) {
  const copia = [...lista]

  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))

    const temporario = copia[i]
    copia[i] = copia[j]
    copia[j] = temporario
  }

  return copia
}