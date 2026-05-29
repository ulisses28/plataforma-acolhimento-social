const TEMPO_SESSAO_MS = 1000 * 60 * 60 * 2 // 2 horas
const TEMPO_INATIVIDADE_MS = 1000 * 60 * 15 // 15 minutos

export function iniciarSessaoAdmin() {
  const agora = Date.now()

  localStorage.setItem(
    'admin-login-hora',
    String(agora)
  )

  localStorage.setItem(
    'admin-ultima-atividade',
    String(agora)
  )
}

export function registrarAtividadeAdmin() {
  localStorage.setItem(
    'admin-ultima-atividade',
    String(Date.now())
  )
}

export function sessaoAdminExpirada() {
  const loginHora =
    localStorage.getItem('admin-login-hora')

  if (!loginHora) return true

  const agora = Date.now()

  const tempoLogado =
    agora - Number(loginHora)

  return tempoLogado > TEMPO_SESSAO_MS
}

export function sessaoAdminInativa() {
  const ultimaAtividade =
    localStorage.getItem(
      'admin-ultima-atividade'
    )

  if (!ultimaAtividade) return true

  const agora = Date.now()

  const tempoParado =
    agora - Number(ultimaAtividade)

  return (
    tempoParado >
    TEMPO_INATIVIDADE_MS
  )
}

export function limparSessaoAdmin() {
  localStorage.removeItem('admin-auth')
  localStorage.removeItem('admin-token')
  localStorage.removeItem('admin-data')
  localStorage.removeItem('admin-trocar-senha')
  localStorage.removeItem('admin-login-hora')
  localStorage.removeItem('admin-ultima-atividade')
}