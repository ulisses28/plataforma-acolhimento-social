import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Admin from '../models/Admin.js'

function senhaForte(senha) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(senha)
}

function senhaExpirada(data) {
  if (!data) return true

  const ultimaTroca = new Date(data)
  const agora = new Date()
  const diferencaMs = agora - ultimaTroca
  const dias = diferencaMs / (1000 * 60 * 60 * 24)

  return dias >= 45
}

export async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Preencha nome, e-mail e senha.'
      })
    }

    if (!senhaForte(senha)) {
      return res.status(400).json({
        mensagem:
          'A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      })
    }

    const adminExiste = await Admin.findOne({ email })

    if (adminExiste) {
      return res.status(400).json({
        mensagem: 'Admin já existe'
      })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const admin = await Admin.create({
      nome,
      email,
      senha: senhaHash,
      ultimaTrocaSenha: new Date()
    })

    return res.status(201).json({
      mensagem: 'Administrador criado com sucesso.',
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

export async function login(req, res) {
  try {
    const { email, senha } = req.body

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(400).json({
        mensagem: 'Usuário inválido'
      })
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha)

    if (!senhaValida) {
      return res.status(400).json({
        mensagem: 'Senha inválida'
      })
    }
    const DIAS_VALIDADE = 45

    const ultimaTroca = new Date(
      admin.ultimaTrocaSenha
    )

    const hoje = new Date()

    const diasSemTrocar =
      Math.floor(
        (hoje - ultimaTroca) /
          (1000 * 60 * 60 * 24)
      )

    const precisaTrocarSenha =
      diasSemTrocar >= DIAS_VALIDADE
        const precisaTrocarSenha = senhaExpirada(admin.ultimaTrocaSenha)

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    return res.json({
      token,

      precisaTrocarSenha,

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

export async function alterarSenha(req, res) {
  try {
    const { email, senhaAtual, novaSenha } = req.body

    if (!email || !senhaAtual || !novaSenha) {
      return res.status(400).json({
        mensagem: 'Informe e-mail, senha atual e nova senha.'
      })
    }

    if (!senhaForte(novaSenha)) {
      return res.status(400).json({
        mensagem:
          'A nova senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      })
    }

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(404).json({
        mensagem: 'Administrador não encontrado.'
      })
    }

    const senhaValida = await bcrypt.compare(senhaAtual, admin.senha)

    if (!senhaValida) {
      return res.status(400).json({
        mensagem: 'Senha atual inválida.'
      })
    }

    admin.senha = await bcrypt.hash(novaSenha, 10)
    admin.ultimaTrocaSenha = new Date()

    await admin.save()

    return res.json({
      mensagem: 'Senha alterada com sucesso.'
    })
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    })
  }
}