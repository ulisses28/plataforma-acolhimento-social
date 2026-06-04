import express from 'express'

import {
  registrar,
  login,
  alterarSenha,
  solicitarResetAdmin
} from '../controllers/authController.js'

const router = express.Router()

router.post('/registrar', registrar)
router.post('/login', login)
router.post('/solicitar-reset', solicitarResetAdmin)
router.put('/alterar-senha', alterarSenha)

export default router