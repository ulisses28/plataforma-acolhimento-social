import Transparencia from '../models/Transparencia.js'

export async function listarPublicacoes(
  req,
  res
) {
  const publicacoes =
    await Transparencia.find().sort({
      createdAt: -1
    })

  return res.json(publicacoes)
}

export async function criarPublicacao(
  req,
  res
) {
  const publicacao =
    await Transparencia.create(req.body)

  return res.status(201).json(publicacao)
}

export async function atualizarPublicacao(
  req,
  res
) {
  const publicacao =
    await Transparencia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

  return res.json(publicacao)
}

export async function excluirPublicacao(
  req,
  res
) {
  await Transparencia.findByIdAndDelete(
    req.params.id
  )

  return res.json({
    mensagem:
      'Publicação removida com sucesso'
  })
}