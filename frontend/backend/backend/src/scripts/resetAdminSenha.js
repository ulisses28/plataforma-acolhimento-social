import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'

dotenv.config()

async function resetarSenha() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const email = 'admin@larbatista.com'
    const novaSenha = 'Admin@123'

    const senhaHash = await bcrypt.hash(novaSenha, 10)

    const admin = await Admin.findOneAndUpdate(
      { email },
      {
        senha: senhaHash,
        ultimaTrocaSenha: new Date(),
        tentativasLogin: 0,
        bloqueadoAte: null
      },
      { new: true }
    )

    if (!admin) {
      console.log('Administrador não encontrado.')
      process.exit()
    }

    console.log('Senha redefinida com sucesso.')
    console.log('E-mail:', email)
    console.log('Nova senha:', novaSenha)

    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

resetarSenha()