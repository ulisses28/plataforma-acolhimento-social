import Parceiro from '../models/Parceiro.js'

export async function listarParceiros(req, res) {
  const parceiros = await Parceiro.find().sort({
    createdAt: -1
  })

  return res.json(parceiros)
}

export async function criarParceiro(req, res) {
  const parceiro = await Parceiro.create(req.body)

  return res.status(201).json(parceiro)
}

export async function atualizarParceiro(req, res) {
  const parceiro = await Parceiro.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  return res.json(parceiro)
}

export async function excluirParceiro(req, res) {
  await Parceiro.findByIdAndDelete(req.params.id)

  return res.json({
    mensagem: 'Parceiro excluído com sucesso'
  })
}