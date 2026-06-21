import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Doador from '../models/Doador.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import { enviarEmailRecuperacao } from '../services/emailService.js'

/*
  CONTROLLER: AUTENTICAÇÃO DO DOADOR

  Responsável por:
  - cadastrar doador;
  - fazer login;
  - solicitar código de recuperação;
  - redefinir senha.

  Ajustes desta versão:
  - Recebe e salva o campo "genero".
  - Retorna "genero" no login.
  - Retorna mais dados do doador após cadastro.
  - Corrige mensagens de erro do cadastro.
  - Evita erro quando documento vem vazio.
*/

function senhaForte(senha) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/.test(
    senha
  )
}

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function limparDocumento(documento) {
  return String(documento || '').replace(/\D/g, '')
}

/*
  CADASTRAR DOADOR

  O frontend envia:
  - nome
  - email
  - senha
  - telefone
  - documento
  - genero
  - tipoPessoa
  - pais
  - estado
  - municipio
*/
export async function registrarDoador(req, res) {
  try {
    const {
      nome,
      email,
      senha,
      telefone,
      documento,
      genero,
      tipoPessoa,
      pais,
      estado,
      municipio
    } = req.body

    if (!nome || !email || !senha || !documento) {
      return res.status(400).json({
        mensagem: 'Informe nome, e-mail, senha e documento.'
      })
    }

    if (!senhaForte(senha)) {
      return res.status(400).json({
        mensagem:
          'A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      })
    }

    const emailNormalizado = normalizarEmail(email)
    const documentoLimpo = limparDocumento(documento)

    if (!documentoLimpo) {
      return res.status(400).json({
        mensagem: 'Informe um CPF/CNPJ válido.'
      })
    }

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
      telefone: telefone || '',
      documento: documentoLimpo,
      genero: genero || 'Prefiro não dizer',
      tipoPessoa: tipoPessoa || 'fisica',
      pais: pais || 'Brasil',
      estado: estado || '',
      municipio: municipio || ''
    })

    return res.status(201).json({
      mensagem: 'Doador cadastrado com sucesso.',
      doador: {
        id: doador._id,
        nome: doador.nome,
        email: doador.email,
        telefone: doador.telefone,
        documento: doador.documento,
        genero: doador.genero,
        tipoPessoa: doador.tipoPessoa,
        pais: doador.pais,
        estado: doador.estado,
        municipio: doador.municipio
      }
    })
  } catch (error) {
    console.error('Erro ao cadastrar doador:', error)

    return res.status(500).json({
      mensagem: 'Erro ao cadastrar doador.',
      erro: error.message
    })
  }
}

/*
  LOGIN DO DOADOR

  Retorna os dados necessários para salvar o doador logado
  no localStorage do frontend.
*/
export async function loginDoador(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'Informe e-mail e senha.'
      })
    }

    const doador = await Doador.findOne({
      email: normalizarEmail(email)
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
        genero: doador.genero || 'Prefiro não dizer',
        tipoPessoa: doador.tipoPessoa,
        pais: doador.pais,
        estado: doador.estado,
        municipio: doador.municipio
      }
    })
  } catch (error) {
    console.error('Erro ao fazer login doador:', error)

    return res.status(500).json({
      mensagem: 'Erro ao fazer login.',
      erro: error.message
    })
  }
}

/*
  SOLICITAR RECUPERAÇÃO DE SENHA

  Gera código de 6 dígitos e envia por e-mail.
*/
export async function solicitarRecuperacaoSenha(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        mensagem: 'Informe o e-mail cadastrado.'
      })
    }

    const emailNormalizado = normalizarEmail(email)

    const doador = await Doador.findOne({
      email: emailNormalizado
    })

    if (!doador) {
      return res.status(404).json({
        mensagem: 'E-mail não encontrado.'
      })
    }

    const codigo = gerarCodigo()

    await PasswordResetToken.deleteMany({
      email: emailNormalizado,
      tipoUsuario: 'doador',
      usado: false
    })

    await PasswordResetToken.create({
      email: emailNormalizado,
      token: codigo,
      tipoUsuario: 'doador',
      usado: false,
      expiraEm: new Date(Date.now() + 15 * 60 * 1000)
    })

    if (process.env.EMAIL_MODO_SIMULADO === 'true') {
      return res.json({
        mensagem: 'Modo simulado: use o código abaixo para redefinir a senha.',
        codigoRecuperacao: codigo
      })
    }

    await enviarEmailRecuperacao(emailNormalizado, codigo)

    return res.json({
      mensagem: 'Enviamos um código de recuperação para o e-mail cadastrado.'
    })
  } catch (error) {
    console.error('Erro recuperação doador:', error)

    return res.status(500).json({
      mensagem:
        'Não foi possível enviar o código de recuperação. Verifique a configuração de e-mail do sistema.',
      erro: error.message
    })
  }
}

/*
  REDEFINIR SENHA DO DOADOR

  Confere:
  - e-mail;
  - código;
  - validade do código;
  - força da nova senha.
*/
export async function redefinirSenhaDoador(req, res) {
  try {
    const { email, codigo, novaSenha } = req.body

    if (!email || !codigo || !novaSenha) {
      return res.status(400).json({
        mensagem: 'Informe o e-mail, o código recebido e a nova senha.'
      })
    }

    if (!senhaForte(novaSenha)) {
      return res.status(400).json({
        mensagem:
          'A nova senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial.'
      })
    }

    const emailNormalizado = normalizarEmail(email)
    const codigoLimpo = String(codigo || '').trim()

    const registroToken = await PasswordResetToken.findOne({
      email: emailNormalizado,
      token: codigoLimpo,
      tipoUsuario: 'doador',
      usado: false,
      expiraEm: { $gt: new Date() }
    }).sort({ createdAt: -1 })

    if (!registroToken) {
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

    registroToken.usado = true
    await registroToken.save()

    return res.json({
      mensagem: 'Senha redefinida com sucesso.'
    })
  } catch (error) {
    console.error('Erro ao redefinir senha doador:', error)

    return res.status(500).json({
      mensagem: 'Erro ao redefinir senha.',
      erro: error.message
    })
  }
}