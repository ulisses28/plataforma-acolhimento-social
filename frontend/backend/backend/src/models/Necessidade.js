import mongoose from 'mongoose'

const necessidadeSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },

    categoria: {
      type: String,
      default: 'Necessidade'
    },

    descricao: {
      type: String,
      required: true
    },

    prioridade: {
      type: String,
      enum: ['BAIXA', 'MEDIA', 'ALTA'],
      default: 'MEDIA'
    },

    quantidade: {
      type: Number,
      default: 1
    },

    imagem: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Ativa'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Necessidade', necessidadeSchema)