import mongoose from 'mongoose'

const parceiroSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },

    categoria: {
      type: String,
      default: 'Parceiro'
    },

    descricao: {
      type: String,
      default: ''
    },

    logo: {
      type: String,
      default: ''
    },

    site: {
      type: String,
      default: ''
    },

    telefone: {
      type: String,
      default: ''
    },

    email: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Ativo'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Parceiro', parceiroSchema)