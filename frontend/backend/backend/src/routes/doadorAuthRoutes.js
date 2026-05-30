import express from 'express'

import {
  registrarDoador,
  loginDoador,
  solicitarRecuperacaoSenha,
  redefinirSenhaDoador
} from '../controllers/doadorAuthController.js'

const router = express.Router()

router.post('/registrar', registrarDoador)
router.post('/login', loginDoador)
router.post('/solicitar-recuperacao', solicitarRecuperacaoSenha)
router.post('/redefinir-senha', redefinirSenhaDoador)

export default router