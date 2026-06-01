import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Doador from '../models/Doador.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import { enviarEmailRecuperacao } from '../services/emailService.js'

function senhaForte(senha) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(senha)
}

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function registrarDoador(req, res) {
  try {
    const {
      nome,
      email,
      senha,
      telefone,
      documento,
      tipoPessoa,
      pais,
      estado,
      municipio
    } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Informe nome, e-mail e senha.'
      })
    }

    if (!senhaForte(senha)) {
      return res.status(400).json({
        mensagem:
          'A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      })
    }

    const emailNormalizado = email.trim().toLowerCase()
    const documentoLimpo = documento.replace(/\D/g, '')

    const existe = await Doador.findOne({
      email: emailNormalizado
    })

    if (existe) {
      return res.status(400).json({
        mensagem: 'Este e-mail já está cadastrado.'
      })
    }
    const documentoExiste = await Doador.findOne({
      documento: documentoLimpo
    })

    if (documentoExiste) {
      return res.status(400).json({
        mensagem:
          'Já existe um cadastro vinculado a este CPF/CNPJ. Utilize a opção "Esqueci minha senha" para recuperar o acesso.'
      })
    }
    const senhaHash = await bcrypt.hash(senha, 10)

    const doador = await Doador.create({
      nome: nome.trim(),
      email: emailNormalizado,
      senha: senhaHash,
      telefone,
      documento: documentoLimpo,
      tipoPessoa,
      pais,
      estado,
      municipio
    })

    return res.status(201).json({
      mensagem: 'Doador cadastrado com sucesso.',
      doador: {
        id: doador._id,
        nome: doador.nome,
        email: doador.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao cadastrar doador.',
      erro: error.message
    })
  }
}

export async function loginDoador(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'Informe e-mail e senha.'
      })
    }

    const doador = await Doador.findOne({
      email: email.trim().toLowerCase()
    })

    if (!doador) {
      return res.status(400).json({
        mensagem: 'E-mail ou senha inválidos.'
      })
    }

    const senhaValida = await bcrypt.compare(senha, doador.senha)

    if (!senhaValida) {
      return res.status(400).json({
        mensagem: 'E-mail ou senha inválidos.'
      })
    }

    const token = jwt.sign(
      {
        id: doador._id,
        email: doador.email,
        tipo: 'doador'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    return res.json({
      token,
      doador: {
        id: doador._id,
        nome: doador.nome,
        email: doador.email,
        telefone: doador.telefone,
        documento: doador.documento,
        tipoPessoa: doador.tipoPessoa,
        pais: doador.pais,
        estado: doador.estado,
        municipio: doador.municipio
      }
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao fazer login.',
      erro: error.message
    })
  }
}

export async function solicitarRecuperacaoSenha(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        mensagem: 'Informe o e-mail cadastrado.'
      })
    }

    const emailNormalizado = email.trim().toLowerCase()

    const doador = await Doador.findOne({
      email: emailNormalizado
    })

    if (!doador) {
      return res.status(404).json({
        mensagem: 'E-mail não encontrado.'
      })
    }

    const codigo = gerarCodigo()

    await PasswordResetToken.create({
      email: emailNormalizado,
      codigo,
      tipoUsuario: 'doador',
      usado: false,
      expiraEm: new Date(Date.now() + 15 * 60 * 1000)
    })

    await enviarEmailRecuperacao(emailNormalizado, codigo)

    return res.json({
      mensagem: 'Código enviado para o e-mail cadastrado.'
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao solicitar recuperação de senha.',
      erro: error.message
    })
  }
}

export async function redefinirSenhaDoador(req, res) {
  try {
    const { email, codigo, novaSenha } = req.body

    if (!email || !codigo || !novaSenha) {
      return res.status(400).json({
        mensagem: 'Informe e-mail, código e nova senha.'
      })
    }

    if (!senhaForte(novaSenha)) {
      return res.status(400).json({
        mensagem:
          'A nova senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      })
    }

    const emailNormalizado = email.trim().toLowerCase()

    const token = await PasswordResetToken.findOne({
      email: emailNormalizado,
      codigo,
      tipoUsuario: 'doador',
      usado: false,
      expiraEm: { $gt: new Date() }
    }).sort({ createdAt: -1 })

    if (!token) {
      return res.status(400).json({
        mensagem: 'Código inválido ou expirado.'
      })
    }

    const doador = await Doador.findOne({
      email: emailNormalizado
    })

    if (!doador) {
      return res.status(404).json({
        mensagem: 'Doador não encontrado.'
      })
    }

    doador.senha = await bcrypt.hash(novaSenha, 10)
    await doador.save()

    token.usado = true
    await token.save()

    return res.json({
      mensagem: 'Senha redefinida com sucesso.'
    })
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao redefinir senha.',
      erro: error.message
    })
  }
}