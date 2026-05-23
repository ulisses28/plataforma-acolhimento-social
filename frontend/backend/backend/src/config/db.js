import mongoose from 'mongoose'

export async function conectarBanco() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB conectado')
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message)
    process.exit(1)
  }
}