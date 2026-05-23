import Vaga from '../models/Vaga.js'

export async function listarVagas(req, res) {
  const vagas = await Vaga.find().sort({ createdAt: -1 })
  return res.json(vagas)
}

export async function listarVagasAtivas(req, res) {
  const vagas = await Vaga.find({ status: 'Ativa' }).sort({ createdAt: -1 })
  return res.json(vagas)
}

export async function criarVaga(req, res) {
  const vaga = await Vaga.create(req.body)
  return res.status(201).json(vaga)
}

export async function buscarVaga(req, res) {
  const vaga = await Vaga.findById(req.params.id)

  if (!vaga) {
    return res.status(404).json({ mensagem: 'Vaga não encontrada' })
  }

  return res.json(vaga)
}

export async function atualizarVaga(req, res) {
  const vaga = await Vaga.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  return res.json(vaga)
}

export async function arquivarVaga(req, res) {
  const vaga = await Vaga.findByIdAndUpdate(
    req.params.id,
    { status: 'Arquivada' },
    { new: true }
  )

  return res.json(vaga)
}

export async function excluirVaga(req, res) {
  await Vaga.findByIdAndDelete(req.params.id)
  return res.json({ mensagem: 'Vaga excluída com sucesso' })
}