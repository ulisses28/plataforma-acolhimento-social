import express from 'express'
import multer from 'multer'

import {
  uploadImagemCloudinary,
  uploadDocumentoCloudinary
} from '../services/cloudinaryService.js'

const router = express.Router()

/*
  Usamos memoryStorage porque o arquivo não deve ser salvo no disco do Render.

  Fluxo:
  navegador -> backend em memória -> Cloudinary -> URL salva no MongoDB/localStorage
*/
const storage = multer.memoryStorage()

/*
  Upload para imagens.

  Limite: 5 MB
  Usado por:
  - notícias
  - logos de parceiros
*/
const uploadImagem = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

/*
  Upload para documentos PDF.

  Limite: 20 MB
  Usado por:
  - governança
  - transparência
  - prestações de contas
*/
const uploadDocumento = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
})

/*
  Executa o middleware do Multer dentro de Promise.

  Isso permite capturar erros de limite de tamanho ou falha no upload
  e devolver uma resposta JSON amigável ao frontend.
*/
function executarUpload(middleware, req, res) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (error) => {
      if (error) {
        return reject(error)
      }

      return resolve()
    })
  })
}

/*
  POST /api/upload/imagem

  Campo esperado no FormData:
  - imagem

  Resposta:
  {
    imagemUrl: 'https://res.cloudinary.com/...',
    imagemPublicId: 'lar-batista/noticias/...'
  }
*/
router.post('/imagem', async (req, res) => {
  try {
    await executarUpload(uploadImagem.single('imagem'), req, res)

    const resultado = await uploadImagemCloudinary(req.file)

    return res.status(201).json({
      mensagem: 'Imagem enviada com sucesso.',
      imagemUrl: resultado.url,
      imagemPublicId: resultado.publicId,
      formato: resultado.formato,
      largura: resultado.largura,
      altura: resultado.altura,
      bytes: resultado.bytes
    })
  } catch (error) {
    console.error('Erro ao enviar imagem:', error)

    return res.status(400).json({
      mensagem:
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Imagem muito grande. O limite é 5 MB.'
          : error.message || 'Erro ao enviar imagem.'
    })
  }
})

/*
  POST /api/upload/documento

  Campo esperado no FormData:
  - documento

  Essa rota será usada por:
  - Governança
  - Transparência
  - prestação de contas
  - documentos institucionais

  Resposta com nomes compatíveis:
  - arquivoUrl
  - pdfUrl
  - documentoUrl

  Assim o frontend pode usar qualquer um desses nomes sem quebrar.
*/
router.post('/documento', async (req, res) => {
  try {
    await executarUpload(uploadDocumento.single('documento'), req, res)

    const resultado = await uploadDocumentoCloudinary(req.file)

    return res.status(201).json({
      mensagem: 'Documento enviado com sucesso.',

      arquivoUrl: resultado.url,
      arquivoPublicId: resultado.publicId,
      arquivoNome: resultado.nomeOriginal,

      pdfUrl: resultado.url,
      documentoUrl: resultado.url,
      documentoPublicId: resultado.publicId,
      documentoNome: resultado.nomeOriginal,

      mimetype: resultado.mimetype,
      bytes: resultado.bytes,
      resourceType: resultado.resourceType
    })
  } catch (error) {
    console.error('Erro ao enviar documento:', error)

    return res.status(400).json({
      mensagem:
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Documento muito grande. O limite é 20 MB.'
          : error.message || 'Erro ao enviar documento.'
    })
  }
})

export default router