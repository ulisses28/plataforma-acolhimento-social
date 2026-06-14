import mongoose from 'mongoose'

const midiaSchema = new mongoose.Schema(
  {
    /*
      Nome original do arquivo enviado pelo usuário.
      Exemplo: foto-evento.jpg
    */
    nome: {
      type: String,
      default: ''
    },

    /*
      Tipo do arquivo.
      Exemplos:
      - image/jpeg
      - image/png
      - image/webp
      - video/mp4
    */
    tipo: {
      type: String,
      default: ''
    },

    /*
      Tamanho do arquivo em bytes.
    */
    tamanho: {
      type: Number,
      default: 0
    },

    /*
      Tamanho formatado em MB.
      Exemplo: "2.35"
    */
    tamanhoMB: {
      type: String,
      default: ''
    },

    /*
      Campo antigo mantido por compatibilidade.

      Antes, imagens eram salvas como base64.
      Agora, quando vier da Cloudinary, este campo pode guardar a URL.
    */
    base64: {
      type: String,
      default: ''
    },

    /*
      URL pública da imagem salva na Cloudinary.
      Exemplo: https://res.cloudinary.com/...
    */
    imagemUrl: {
      type: String,
      default: ''
    },

    /*
      ID da imagem dentro da Cloudinary.
      Serve futuramente para apagar ou substituir a imagem.
    */
    imagemPublicId: {
      type: String,
      default: ''
    },

    /*
      Origem da mídia.
      Exemplos:
      - cloudinary
      - base64
      - existente
    */
    origem: {
      type: String,
      default: ''
    }
  },
  {
    _id: false
  }
)

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },

    categoria: {
      type: String,
      default: 'Notícia institucional',
      trim: true
    },

    areaPublicacao: {
      type: String,
      default: 'Últimas Notícias',
      trim: true
    },

    resumo: {
      type: String,
      required: true,
      trim: true
    },

    conteudo: {
      type: String,
      required: true
    },

    /*
      Lista de mídias da publicação.

      Esse campo é importante para salvar:
      - imagens enviadas para Cloudinary
      - vídeos antigos em base64
      - futuras mídias extras da notícia
    */
    midias: {
      type: [midiaSchema],
      default: []
    },

    /*
      Campo antigo mantido por compatibilidade.

      Se alguma tela pública ou admin ainda usa "midia",
      o sistema continua funcionando.

      No novo fluxo, esse campo recebe a URL principal da imagem.
    */
    midia: {
      type: String,
      default: ''
    },

    /*
      Tipo da mídia principal.

      Exemplos possíveis:
      - imagem
      - image/jpeg
      - video/mp4
      - youtube
    */
    tipoMidia: {
      type: String,
      default: ''
    },

    youtubeUrl: {
      type: String,
      default: ''
    },

    /*
      Novo campo principal para integração com Cloudinary.

      A imagem será salva na Cloudinary e o MongoDB guardará apenas a URL.
    */
    imagemUrl: {
      type: String,
      default: ''
    },

    /*
      Identificador da imagem na Cloudinary.

      Serve futuramente para remover/substituir a imagem da Cloudinary.
    */
    imagemPublicId: {
      type: String,
      default: ''
    },

    /*
      Status da publicação.

      Atenção:
      A tela admin usa "Em Revisão", então esse valor precisa estar no enum.
    */
    status: {
      type: String,
      default: 'Publicado',
      enum: ['Publicado', 'Rascunho', 'Em Revisão', 'Arquivado']
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Noticia', noticiaSchema)