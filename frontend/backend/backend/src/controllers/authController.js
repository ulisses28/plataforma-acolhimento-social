import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Admin from '../models/Admin.js'
// Se você já criou o service de auditoria, descomente esta linha:
// import { registrarAuditoria } from '../services/auditoriaService.js'

/*
  Controller de autenticação administrativa

  Responsável por:
  - registrar administrador
  - fazer login
  - criptografar senha com bcrypt
  - gerar token JWT
  - bloquear conta após tentativas inválidas
  - exigir troca de senha a cada 45 dias
  - permitir alteração de senha
*/

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

    const adminExiste = await Admin.findOne({
      email: email.trim().toLowerCase()
    })

    if (adminExiste) {
      return res.status(400).json({
        mensagem: 'Admin já existe.'
      })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const admin = await Admin.create({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senhaHash,
      ultimaTrocaSenha: new Date(),
      tentativasLogin: 0,
      bloqueadoAte: null
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
      mensagem: 'Erro ao registrar administrador.',
      erro: error.message
    })
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'Informe e-mail e senha.'
      })
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase()
    })

    if (!admin) {
      return res.status(400).json({
        mensagem: 'Usuário inválido.'
      })
    }

    /*
      Bloqueio temporário:
      se o administrador errou várias vezes, a conta fica bloqueada
      por 15 minutos.
    */
    if (admin.bloqueadoAte && admin.bloqueadoAte > new Date()) {
      return res.status(429).json({
        mensagem: 'Conta temporariamente bloqueada. Tente novamente mais tarde.'
      })
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha)

    /*
      Se a senha estiver errada:
      - soma uma tentativa
      - ao atingir 5 tentativas, bloqueia por 15 minutos
    */
    if (!senhaValida) {
      admin.tentativasLogin = (admin.tentativasLogin || 0) + 1

      if (admin.tentativasLogin >= 5) {
        admin.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000)
        admin.tentativasLogin = 0
      }

      await admin.save()

      return res.status(400).json({
        mensagem: 'Senha inválida.'
      })
    }

    /*
      Se a senha estiver correta:
      - limpa tentativas inválidas
      - remove bloqueio
      - verifica se a senha venceu em 45 dias
    */
    admin.tentativasLogin = 0
    admin.bloqueadoAte = null

    const precisaTrocarSenha = senhaExpirada(admin.ultimaTrocaSenha)

    await admin.save()

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

    // Se você criou auditoria, pode ativar:
    // await registrarAuditoria(admin.email, 'LOGIN', 'Administrador acessou o sistema.')

    return res.json({
      token,
      precisaTrocarSenha,
      admin: {
        id: admin._id,
        nome: admin.nome,
        email: admin.email,
        ultimaTrocaSenha: admin.ultimaTrocaSenha
      }
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao fazer login.',
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

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase()
    })

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

    /*
      Ao alterar senha:
      - criptografa a nova senha
      - atualiza data da última troca
      - limpa bloqueios
      - limpa tentativas inválidas
    */
    admin.senha = await bcrypt.hash(novaSenha, 10)
    admin.ultimaTrocaSenha = new Date()
    admin.tentativasLogin = 0
    admin.bloqueadoAte = null

    await admin.save()

    // Se você criou auditoria, pode ativar:
    // await registrarAuditoria(admin.email, 'ALTERACAO_SENHA', 'Senha administrativa alterada.')

    return res.json({
      mensagem: 'Senha alterada com sucesso.'
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao alterar senha.',
      erro: error.message
    })
  }
}