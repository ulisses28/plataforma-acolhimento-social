const RECUPERACAO_KEY = 'solicitacoes_recuperacao_senha'

export function listarSolicitacoesRecuperacao() {
  const dados = localStorage.getItem(RECUPERACAO_KEY)
  return dados ? JSON.parse(dados) : []
}

export function registrarSolicitacaoRecuperacao(dados) {
  const lista = listarSolicitacoesRecuperacao()

  const novaSolicitacao = {
    id: Date.now(),
    nome: dados.nome || '',
    email: dados.email || '',
    perfil: dados.perfil || 'Doador',
    mensagem: dados.mensagem || '',
    status: 'Pendente',
    criadoEm: new Date().toLocaleString('pt-BR')
  }

  localStorage.setItem(
    RECUPERACAO_KEY,
    JSON.stringify([novaSolicitacao, ...lista])
  )

  return novaSolicitacao
}