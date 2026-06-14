import Noticia from '../models/Noticia.js'

function removerCamposIndefinidos(objeto) {
  return Object.fromEntries(
    Object.entries(objeto).filter(([, valor]) => valor !== undefined)
  )
}

function montarDadosCriacao(body) {
  const {
    titulo,
    categoria,
    areaPublicacao,
    resumo,
    conteudo,
    midia,
    tipoMidia,
    youtubeUrl,
    status,
    imagemUrl,
    imagemPublicId
  } = body

  /*
    Compatibilidade:
    - imagemUrl é o novo campo da Cloudinary
    - midia é o campo antigo que o frontend pode estar usando
    Se vier imagemUrl, também salvamos em midia para não quebrar telas antigas.
  */
  const midiaFinal = imagemUrl || midia || ''

  let tipoMidiaFinal = tipoMidia || ''

  if (!tipoMidiaFinal && imagemUrl) {
    tipoMidiaFinal = 'imagem'
  }

  if (!tipoMidiaFinal && youtubeUrl) {
    tipoMidiaFinal = 'youtube'
  }

  return removerCamposIndefinidos({
    titulo,
    categoria,
    areaPublicacao,
    resumo,
    conteudo,
    midia: midiaFinal,
    tipoMidia: tipoMidiaFinal,
    youtubeUrl,
    status,
    imagemUrl,
    imagemPublicId
  })
}

function montarDadosAtualizacao(body) {
  const {
    titulo,
    categoria,
    areaPublicacao,
    resumo,
    conteudo,
    midia,
    tipoMidia,
    youtubeUrl,
    status,
    imagemUrl,
    imagemPublicId
  } = body

  const dados = removerCamposIndefinidos({
    titulo,
    categoria,
    areaPublicacao,
    resumo,
    conteudo,
    midia,
    tipoMidia,
    youtubeUrl,
    status,
    imagemUrl,
    imagemPublicId
  })

  /*
    Se a edição receber uma imagem nova da Cloudinary,
    atualizamos também o campo antigo "midia".
  */
  if (imagemUrl !== undefined) {
    dados.midia = imagemUrl
    dados.tipoMidia = tipoMidia || 'imagem'
  }

  /*
    Se receber uma URL do YouTube e não tiver tipo de mídia definido,
    marcamos como youtube.
  */
  if (youtubeUrl !== undefined && !dados.tipoMidia && youtubeUrl) {
    dados.tipoMidia = 'youtube'
  }

  return dados
}

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
    const dadosNoticia = montarDadosCriacao(req.body)

    const noticia = await Noticia.create(dadosNoticia)

    return res.status(201).json(noticia)
  } catch (error) {
    console.error('Erro ao criar notícia:', error)

    return res.status(500).json({
      mensagem: 'Erro ao criar notícia',
      erro: error.message
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
    console.error('Erro ao buscar notícia:', error)

    return res.status(500).json({
      mensagem: 'Erro ao buscar notícia',
      erro: error.message
    })
  }
}

export async function atualizarNoticia(req, res) {
  try {
    const dadosAtualizacao = montarDadosAtualizacao(req.body)

    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      dadosAtualizacao,
      {
        new: true,
        runValidators: true
      }
    )

    if (!noticia) {
      return res.status(404).json({
        mensagem: 'Notícia não encontrada'
      })
    }

    return res.json(noticia)
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error)

    return res.status(500).json({
      mensagem: 'Erro ao atualizar notícia',
      erro: error.message
    })
  }
}

export async function excluirNoticia(req, res) {
  try {
    const noticia = await Noticia.findByIdAndDelete(req.params.id)

    if (!noticia) {
      return res.status(404).json({
        mensagem: 'Notícia não encontrada'
      })
    }

    return res.json({
      mensagem: 'Notícia excluída com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir notícia:', error)

    return res.status(500).json({
      mensagem: 'Erro ao excluir notícia',
      erro: error.message
    })
  }
}