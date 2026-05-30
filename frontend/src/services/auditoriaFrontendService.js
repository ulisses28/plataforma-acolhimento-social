export function registrarAuditoriaFrontend(
  acao,
  detalhes = ''
) {
  const logs =
    JSON.parse(
      localStorage.getItem(
        'auditoria_frontend'
      )
    ) || []

  const admin =
    JSON.parse(
      localStorage.getItem('admin-data')
    ) || {}

  logs.unshift({
    id: Date.now(),
    admin: admin.email || 'Administrador',
    acao,
    detalhes,
    data: new Date().toLocaleString('pt-BR')
  })

  localStorage.setItem(
    'auditoria_frontend',
    JSON.stringify(logs)
  )
}