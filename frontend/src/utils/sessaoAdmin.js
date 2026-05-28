const TEMPO_SESSAO_MS = 1000 * 60 * 60 * 2 // 2 horas

export function iniciarSessaoAdmin() {
  localStorage.setItem('admin-login-hora', String(Date.now()))
}

export function sessaoAdminExpirada() {
  const loginHora = localStorage.getItem('admin-login-hora')

  if (!loginHora) return true

  const agora = Date.now()
  const tempoLogado = agora - Number(loginHora)

  return tempoLogado > TEMPO_SESSAO_MS
}

export function limparSessaoAdmin() {
  localStorage.removeItem('admin-auth')
  localStorage.removeItem('admin-token')
  localStorage.removeItem('admin-data')
  localStorage.removeItem('admin-trocar-senha')
  localStorage.removeItem('admin-login-hora')
}