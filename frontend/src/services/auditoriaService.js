import { apiGet } from './api'

export function listarAuditorias() {
  return apiGet('/auditoria')
}