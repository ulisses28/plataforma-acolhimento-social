import Auditoria from '../models/Auditoria.js'

export async function listarAuditorias(req, res) {
  try {
    const logs = await Auditoria
      .find()
      .sort({ createdAt: -1 })
      .limit(100)

    return res.json(logs)
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao listar auditoria.',
      erro: error.message
    })
  }
}