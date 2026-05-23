import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Admin from '../models/Admin.js'

export async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body

    const adminExiste = await Admin.findOne({
      email
    })

    if (adminExiste) {
      return res.status(400).json({
        mensagem: 'Admin já existe'
      })
    }

    const senhaHash =
      await bcrypt.hash(senha, 10)

    const admin = await Admin.create({
      nome,
      email,
      senha: senhaHash
    })

    return res.status(201).json(admin)
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    })
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body

    const admin = await Admin.findOne({
      email
    })

    if (!admin) {
      return res.status(400).json({
        mensagem: 'Usuário inválido'
      })
    }

    const senhaValida =
      await bcrypt.compare(
        senha,
        admin.senha
      )

    if (!senhaValida) {
      return res.status(400).json({
        mensagem: 'Senha inválida'
      })
    }

    const token = jwt.sign(
      {
        id: admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    return res.json({
      token,
      admin: {
        id: admin._id,
        nome: admin.nome,
        email: admin.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    })
  }
}
