import express from 'express'

import {
  listarCurriculos,
  criarCurriculo,
  atualizarStatusCurriculo,
  excluirCurriculo
} from '../controllers/curriculoController.js'

const router = express.Router()

router.get('/', listarCurriculos)
router.post('/', criarCurriculo)
router.patch('/:id/status', atualizarStatusCurriculo)
router.delete('/:id', excluirCurriculo)

export default router
