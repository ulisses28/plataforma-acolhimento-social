import mongoose from 'mongoose'

export async function conectarBanco() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('✅ MongoDB conectado')
  } catch (erro) {
    console.error('❌ Erro ao conectar MongoDB:', erro.message)
    process.exit(1)
  }
}