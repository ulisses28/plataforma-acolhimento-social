import mongoose from 'mongoose'

const auditoriaSchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      required: true
    },

    acao: {
      type: String,
      required: true
    },

    detalhes: {
      type: String,
      default: ''
    },

    ip: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Auditoria', auditoriaSchema)