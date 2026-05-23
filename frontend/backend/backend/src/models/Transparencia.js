import mongoose from 'mongoose'

const transparenciaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true
    },

    descricao: {
      type: String,
      default: ''
    },

    categoria: {
      type: String,
      default: 'Prestação de contas'
    },

    arquivo: {
      type: String,
      default: ''
    },

    tipoArquivo: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Publicado'
    }
  },
  { timestamps: true }
)

export default mongoose.model(
  'Transparencia',
  transparenciaSchema
)