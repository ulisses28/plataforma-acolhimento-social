import express from 'express'

import {
  registrar,
  login,
  alterarSenha
} from '../controllers/authController.js'

const router = express.Router()

router.post('/registrar', registrar)
router.post('/login', login)
router.put('/alterar-senha', alterarSenha)

export default router