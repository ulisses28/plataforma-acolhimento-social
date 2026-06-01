import mongoose from 'mongoose'

const doadorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    senha: {
      type: String,
      required: true
    },

    telefone: {
      type: String,
      default: ''
    },

    documento: {
      type: String,
      required: true,
      unique: true
    },

    tipoPessoa: {
      type: String,
      default: 'fisica'
    },

    pais: {
      type: String,
      default: 'Brasil'
    },

    estado: {
      type: String,
      default: ''
    },

    municipio: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Doador', doadorSchema)