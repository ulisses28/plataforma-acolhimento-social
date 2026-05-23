import mongoose from 'mongoose'

const vagaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    tipo: { type: String, default: 'Vaga' },
    local: { type: String, default: '' },
    resumo: { type: String, default: '' },
    descricao: { type: String, default: '' },
    requisitos: { type: String, default: '' },
    escolaridade: { type: String, default: '' },
    experiencia: { type: String, default: '' },
    imagem: { type: String, default: '' },
    publicarNoticias: { type: Boolean, default: false },
    status: { type: String, default: 'Ativa' }
  },
  { timestamps: true }
)

export default mongoose.model('Vaga', vagaSchema)