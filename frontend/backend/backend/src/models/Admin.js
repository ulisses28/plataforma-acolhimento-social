import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
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

    ultimaTrocaSenha: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Admin', adminSchema)