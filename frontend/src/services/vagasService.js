const STORAGE_KEY = 'vagas_lar_batista'
const CURRICULOS_KEY = 'curriculos_lar_batista'

export function listarVagas() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function listarVagasAtivas() {
  return listarVagas().filter((vaga) => vaga.status !== 'Arquivada')
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
    publicarNoticias: Boolean(vaga.publicarNoticias),
    status: 'Ativa',
    criadoEm: new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([nova, ...lista]))
  return nova
}

export function atualizarVaga(vagaAtualizada) {
  const lista = listarVagas()
  const atualizada = lista.map((item) =>
    item.id === vagaAtualizada.id ? vagaAtualizada : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function arquivarVaga(id) {
  const lista = listarVagas()
  const atualizada = lista.map((item) =>
    item.id === id ? { ...item, status: 'Arquivada' } : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function excluirVaga(id) {
  const lista = listarVagas()
  const atualizada = lista.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function listarCurriculos() {
  const dados = localStorage.getItem(CURRICULOS_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarCurriculo(curriculo) {
  const lista = listarCurriculos()

  const novo = {
    id: Date.now(),
    nome: curriculo.nome || '',
    cpf: curriculo.cpf || '',
    email: curriculo.email || '',
    sexo: curriculo.sexo || '',
    pais: curriculo.pais || 'BR',
    estado: curriculo.estado || '',
    municipio: curriculo.municipio || '',
    vagaId: curriculo.vagaId || '',
    vaga: curriculo.vaga || '',
    tipo: curriculo.tipo || 'Vaga',
    escolaridade: curriculo.escolaridade || '',
    experiencia: curriculo.experiencia || '',
    habilidades: curriculo.habilidades || '',
    observacoes: curriculo.observacoes || '',
    arquivos: curriculo.arquivos || [],
    status: 'Em análise',
    historico: [
      {
        status: 'Em análise',
        data: new Date().toLocaleString('pt-BR')
      }
    ],
    criadoEm: new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(CURRICULOS_KEY, JSON.stringify([novo, ...lista]))
  return novo
}

export function atualizarStatusCurriculo(id, status) {
  const lista = listarCurriculos()

  const atualizada = lista.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          historico: [
            ...(item.historico || []),
            {
              status,
              data: new Date().toLocaleString('pt-BR')
            }
          ]
        }
      : item
  )

  localStorage.setItem(CURRICULOS_KEY, JSON.stringify(atualizada))
}

export function excluirCurriculo(id) {
  const lista = listarCurriculos()
  const atualizada = lista.filter((item) => item.id !== id)
  localStorage.setItem(CURRICULOS_KEY, JSON.stringify(atualizada))
}

export function calcularCompatibilidade(vaga, curriculo) {
  const requisitos = `
    ${vaga?.requisitos || ''}
    ${vaga?.escolaridade || ''}
    ${vaga?.experiencia || ''}
  `
    .toLowerCase()
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter(Boolean)

  const curriculoTexto = `
    ${curriculo?.escolaridade || ''}
    ${curriculo?.experiencia || ''}
    ${curriculo?.habilidades || ''}
    ${curriculo?.observacoes || ''}
  `.toLowerCase()

  if (requisitos.length === 0) {
    return { percentual: 0, nivel: 'Baixa' }
  }

  const pontos = requisitos.reduce((total, req) => {
    return curriculoTexto.includes(req) ? total + 1 : total
  }, 0)

  const percentual = Math.round((pontos / requisitos.length) * 100)

  let nivel = 'Baixa'
  if (percentual >= 75) nivel = 'Alta'
  else if (percentual >= 40) nivel = 'Média'

  return { percentual, nivel }
}

export function lerArquivoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo'))
    leitor.readAsDataURL(arquivo)
  })
}

/*
  Compatibilidade com arquivos antigos do projeto.
  Mantém funcionando partes que ainda chamam candidaturas.
*/
export const listarCandidaturas = listarCurriculos
export const salvarCandidatura = salvarCurriculo
export const atualizarStatusCandidatura = atualizarStatusCurriculo
export const excluirCandidatura = excluirCurriculo