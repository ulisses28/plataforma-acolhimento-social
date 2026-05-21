const STORAGE_KEY = 'vagas_lar_batista'
const CURRICULOS_KEY = 'curriculos_lar_batista'

/*
========================================
VAGAS
========================================
*/

export function listarVagas() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarVaga(vaga) {
  const lista = listarVagas()

  const nova = {
    id: Date.now(),

    titulo: vaga.titulo,
    tipo: vaga.tipo || 'Vaga',

    local: vaga.local || '',
    resumo: vaga.resumo || '',
    descricao: vaga.descricao || '',

    requisitos: vaga.requisitos || '',
    escolaridade: vaga.escolaridade || '',
    experiencia: vaga.experiencia || '',

    imagem: vaga.imagem || '',

    publicarNoticias:
      vaga.publicarNoticias || false,

    status: 'Ativa',

    criadoEm:
      new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([nova, ...lista])
  )

  return nova
}

export function atualizarVaga(vagaAtualizada) {
  const lista = listarVagas()

  const atualizada = lista.map((item) =>
    item.id === vagaAtualizada.id
      ? vagaAtualizada
      : item
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizada)
  )
}

export function arquivarVaga(id) {
  const lista = listarVagas()

  const atualizada = lista.map((item) =>
    item.id === id
      ? {
          ...item,
          status: 'Arquivada'
        }
      : item
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizada)
  )
}

export function excluirVaga(id) {
  const lista = listarVagas()

  const atualizada = lista.filter(
    (item) => item.id !== id
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizada)
  )
}

/*
========================================
CURRÍCULOS
========================================
*/

export function listarCurriculos() {
  const dados = localStorage.getItem(
    CURRICULOS_KEY
  )

  return dados ? JSON.parse(dados) : []
}

export function salvarCurriculo(curriculo) {
  const lista = listarCurriculos()

  const novo = {
    id: Date.now(),

    nome: curriculo.nome,
    email: curriculo.email,

    vagaId: curriculo.vagaId,
    vaga: curriculo.vaga,

    escolaridade:
      curriculo.escolaridade || '',

    experiencia:
      curriculo.experiencia || '',

    habilidades:
      curriculo.habilidades || '',

    observacoes:
      curriculo.observacoes || '',

    arquivos:
      curriculo.arquivos || [],

    status: 'Em análise',

    criadoEm:
      new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(
    CURRICULOS_KEY,
    JSON.stringify([novo, ...lista])
  )

  return novo
}

export function atualizarStatusCurriculo(
  id,
  status
) {
  const lista = listarCurriculos()

  const atualizada = lista.map((item) =>
    item.id === id
      ? {
          ...item,
          status
        }
      : item
  )

  localStorage.setItem(
    CURRICULOS_KEY,
    JSON.stringify(atualizada)
  )
}

export function excluirCurriculo(id) {
  const lista = listarCurriculos()

  const atualizada = lista.filter(
    (item) => item.id !== id
  )

  localStorage.setItem(
    CURRICULOS_KEY,
    JSON.stringify(atualizada)
  )
}

/*
========================================
MATCH IA SIMPLES
========================================
*/

export function calcularCompatibilidade(
  vaga,
  curriculo
) {
  let pontos = 0
  let total = 0

  const requisitos = `
    ${vaga.requisitos}
    ${vaga.escolaridade}
    ${vaga.experiencia}
  `
    .toLowerCase()
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter(Boolean)

  const curriculoTexto = `
    ${curriculo.escolaridade}
    ${curriculo.experiencia}
    ${curriculo.habilidades}
    ${curriculo.observacoes}
  `.toLowerCase()

  requisitos.forEach((req) => {
    total++

    if (curriculoTexto.includes(req)) {
      pontos++
    }
  })

  if (total === 0) {
    return {
      percentual: 0,
      nivel: 'Baixa'
    }
  }

  const percentual = Math.round(
    (pontos / total) * 100
  )

  let nivel = 'Baixa'

  if (percentual >= 75) {
    nivel = 'Alta'
  } else if (percentual >= 40) {
    nivel = 'Média'
  }

  return {
    percentual,
    nivel
  }
}

/*
========================================
UTILS
========================================
*/

export function lerArquivoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = () =>
      resolve(leitor.result)

    leitor.onerror = () =>
      reject(
        new Error('Erro ao ler arquivo')
      )

    leitor.readAsDataURL(arquivo)
  })
}