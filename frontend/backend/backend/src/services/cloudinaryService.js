import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

/*
  Configuração da Cloudinary.

  As variáveis precisam estar configuradas no Render:
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET

  Opcional:
  - CLOUDINARY_FOLDER
  - CLOUDINARY_DOCUMENT_FOLDER
*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

function validarConfigCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Credenciais da Cloudinary não configuradas no servidor.')
  }
}

/*
  Validação para imagens.

  Usada em:
  - notícias
  - logos de parceiros
  - futuras imagens institucionais
*/
export function validarImagem(file) {
  if (!file) {
    throw new Error('Nenhuma imagem foi enviada.')
  }

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']

  if (!tiposPermitidos.includes(file.mimetype)) {
    throw new Error('Formato inválido. Envie imagem JPG, PNG ou WEBP.')
  }

  const limiteMb = 5
  const limiteBytes = limiteMb * 1024 * 1024

  if (file.size > limiteBytes) {
    throw new Error(`Imagem muito grande. O limite é ${limiteMb} MB.`)
  }
}

/*
  Validação para documentos PDF.

  Usada em:
  - Governança
  - Transparência
  - prestação de contas
  - documentos institucionais
*/
export function validarDocumento(file) {
  if (!file) {
    throw new Error('Nenhum documento foi enviado.')
  }

  const tiposPermitidos = ['application/pdf']

  if (!tiposPermitidos.includes(file.mimetype)) {
    throw new Error('Formato inválido. Envie apenas documentos em PDF.')
  }

  const limiteMb = 20
  const limiteBytes = limiteMb * 1024 * 1024

  if (file.size > limiteBytes) {
    throw new Error(`Documento muito grande. O limite é ${limiteMb} MB.`)
  }
}

/*
  Função genérica para enviar arquivo por stream para a Cloudinary.

  Usamos stream porque o Multer está configurado com memoryStorage.
  Ou seja, o arquivo fica temporariamente em memória e não é salvo no Render.
*/
function enviarBufferParaCloudinary(file, opcoes) {
  validarConfigCloudinary()

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      opcoes,
      (error, result) => {
        if (error) {
          return reject(error)
        }

        return resolve(result)
      }
    )

    streamifier.createReadStream(file.buffer).pipe(uploadStream)
  })
}

/*
  Upload de imagem para Cloudinary.

  Retorna:
  - url: URL pública
  - publicId: ID usado futuramente para excluir/substituir
*/
export async function uploadImagemCloudinary(
  file,
  pasta = 'lar-batista/noticias'
) {
  validarImagem(file)

  const folder = process.env.CLOUDINARY_FOLDER || pasta

  const result = await enviarBufferParaCloudinary(file, {
    folder,
    resource_type: 'image',
    transformation: [
      {
        width: 1200,
        height: 800,
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ]
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    formato: result.format,
    largura: result.width,
    altura: result.height,
    bytes: result.bytes
  }
}

/*
  Upload de documento PDF para Cloudinary.

  Para PDF, usamos resource_type: 'raw'.
  Isso evita tratar o PDF como imagem e preserva o arquivo como documento.

  Retorna:
  - url: URL pública do PDF
  - publicId: ID usado futuramente para excluir/substituir
*/
export async function uploadDocumentoCloudinary(
  file,
  pasta = 'lar-batista/documentos'
) {
  validarDocumento(file)

  const folder = process.env.CLOUDINARY_DOCUMENT_FOLDER || pasta

  const result = await enviarBufferParaCloudinary(file, {
    folder,
    resource_type: 'raw',
    use_filename: true,
    unique_filename: true,
    overwrite: false
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    nomeOriginal: file.originalname,
    mimetype: file.mimetype,
    bytes: result.bytes,
    resourceType: result.resource_type
  }
}

/*
  Remove imagem da Cloudinary.

  Usar futuramente quando uma notícia/parceiro for excluído
  e você quiser remover também o arquivo da Cloudinary.
*/
export async function deletarImagemCloudinary(publicId) {
  if (!publicId) {
    return null
  }

  validarConfigCloudinary()

  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image'
  })
}

/*
  Remove documento PDF da Cloudinary.

  Como PDF foi enviado como resource_type: 'raw',
  a exclusão também precisa usar raw.
*/
export async function deletarDocumentoCloudinary(publicId) {
  if (!publicId) {
    return null
  }

  validarConfigCloudinary()

  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'raw'
  })
}