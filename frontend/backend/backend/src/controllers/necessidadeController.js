import Necessidade from '../models/Necessidade.js'

export async function listarNecessidades(req, res) {
  const necessidades = await Necessidade.find().sort({
    createdAt: -1
  })

  return res.json(necessidades)
}

export async function criarNecessidade(req, res) {
  const necessidade = await Necessidade.create(req.body)

  return res.status(201).json(necessidade)
}

export async function atualizarNecessidade(req, res) {
  const necessidade = await Necessidade.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  return res.json(necessidade)
}

export async function excluirNecessidade(req, res) {
  await Necessidade.findByIdAndDelete(req.params.id)

  return res.json({
    mensagem: 'Necessidade excluída com sucesso'
  })
}