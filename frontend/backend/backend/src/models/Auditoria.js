import mongoose from 'mongoose'

const auditoriaSchema = new mongoose.Schema(
  {
    admin: String,

    acao: String,

    detalhes: String,

    data: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model(
  'Auditoria',
  auditoriaSchema
)