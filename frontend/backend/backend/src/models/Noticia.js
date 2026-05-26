import mongoose from 'mongoose'

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true
    },

    categoria: {
      type: String,
      default: 'Notícia institucional'
    },

    areaPublicacao: {
      type: String,
      default: 'Últimas Notícias'
    },

    resumo: {
      type: String,
      required: true
    },

    conteudo: {
      type: String,
      required: true
    },

    midia: {
      type: String,
      default: ''
    },

    tipoMidia: {
      type: String,
      default: ''
    },

    youtubeUrl: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Publicado'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Noticia', noticiaSchema)