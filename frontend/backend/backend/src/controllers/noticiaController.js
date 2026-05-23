import Noticia from '../models/Noticia.js'

export async function listarNoticias(req, res) {
  const noticias = await Noticia.find().sort({ createdAt: -1 })
  return res.json(noticias)
}

export async function criarNoticia(req, res) {
  const noticia = await Noticia.create(req.body)
  return res.status(201).json(noticia)
}

export async function buscarNoticia(req, res) {
  const noticia = await Noticia.findById(req.params.id)

  if (!noticia) {
    return res.status(404).json({ mensagem: 'Notícia não encontrada' })
  }

  return res.json(noticia)
}

export async function atualizarNoticia(req, res) {
  const noticia = await Noticia.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  return res.json(noticia)
}

export async function excluirNoticia(req, res) {
  await Noticia.findByIdAndDelete(req.params.id)

  return res.json({ mensagem: 'Notícia excluída com sucesso' })
}