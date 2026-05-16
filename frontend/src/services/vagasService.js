const STORAGE_KEY = 'vagas_lar_batista'

export function listarCandidaturas() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarCandidatura(candidatura) {
  const lista = listarCandidaturas()

  const nova = {
    id: Date.now(),
    criadoEm: new Date().toLocaleString('pt-BR'),
    status: 'Em análise',
    historico: [
      {
        status: 'Em análise',
        data: new Date().toLocaleString('pt-BR')
      }
    ],
    ...candidatura
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([nova, ...lista]))
  return nova
}

export function atualizarCandidatura(candidaturaAtualizada) {
  const lista = listarCandidaturas()

  const atualizada = lista.map((item) =>
    item.id === candidaturaAtualizada.id ? candidaturaAtualizada : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function atualizarStatusCandidatura(id, novoStatus) {
  const lista = listarCandidaturas()

  const atualizada = lista.map((item) => {
    if (item.id !== id) return item

    return {
      ...item,
      status: novoStatus,
      historico: [
        ...(item.historico || []),
        {
          status: novoStatus,
          data: new Date().toLocaleString('pt-BR')
        }
      ]
    }
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function excluirCandidatura(id) {
  const lista = listarCandidaturas()
  const atualizada = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function lerArquivoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo'))
    leitor.readAsDataURL(arquivo)
  })
}