import mongoose from 'mongoose'

const curriculoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, default: '' },
    vagaId: { type: String, default: '' },
    vaga: { type: String, default: '' },
    escolaridade: { type: String, default: '' },
    experiencia: { type: String, default: '' },
    habilidades: { type: String, default: '' },
    arquivo: { type: String, default: '' },
    status: { type: String, default: 'Em análise' }
  },
  { timestamps: true }
)

export default mongoose.model('Curriculo', curriculoSchema)