import Curriculo from '../models/Curriculo.js'

export async function listarCurriculos(req, res) {
  const curriculos = await Curriculo.find().sort({ createdAt: -1 })
  return res.json(curriculos)
}

export async function criarCurriculo(req, res) {
  const curriculo = await Curriculo.create(req.body)
  return res.status(201).json(curriculo)
}

export async function atualizarStatusCurriculo(req, res) {
  const curriculo = await Curriculo.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )

  return res.json(curriculo)
}

export async function excluirCurriculo(req, res) {
  await Curriculo.findByIdAndDelete(req.params.id)
  return res.json({ mensagem: 'Currículo excluído com sucesso' })
}