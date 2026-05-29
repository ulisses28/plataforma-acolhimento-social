import Auditoria from '../models/Auditoria.js'

export async function registrarAuditoria(
  admin,
  acao,
  detalhes = ''
) {
  try {
    await Auditoria.create({
      admin,
      acao,
      detalhes
    })
  } catch (error) {
    console.error(error)
  }
}