import Auditoria from '../models/Auditoria.js'

export async function registrarAuditoria(admin, acao, detalhes = '', ip = '') {
  try {
    await Auditoria.create({
      admin,
      acao,
      detalhes,
      ip
    })
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error.message)
  }
}