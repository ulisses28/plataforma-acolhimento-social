import Noticia from '../models/Noticia.js'

export async function listarNoticias(req, res) {
  try {
    const noticias = await Noticia
      .find()
      .sort({ createdAt: -1 })

    return res.json(noticias)
  } catch (error) {
    console.error('Erro ao listar notícias:', error)

    return res.status(500).json({
      mensagem: 'Erro ao listar notícias',
      erro: error.message
    })
  }
}

export async function criarNoticia(req, res) {
  try {
    const noticia = await Noticia.create(req.body)

    return res.status(201).json(noticia)
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao criar notícia'
    })
  }
}

export async function buscarNoticia(req, res) {
  try {
    const noticia = await Noticia.findById(req.params.id)

    if (!noticia) {
      return res.status(404).json({
        mensagem: 'Notícia não encontrada'
      })
    }

    return res.json(noticia)
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao buscar notícia'
    })
  }
}

export async function atualizarNoticia(req, res) {
  try {
    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    )

    return res.json(noticia)
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao atualizar notícia'
    })
  }
}

export async function excluirNoticia(req, res) {
  try {
    await Noticia.findByIdAndDelete(req.params.id)

    return res.json({
      mensagem: 'Notícia excluída com sucesso'
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao excluir notícia'
    })
  }
}