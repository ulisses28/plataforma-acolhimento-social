import express from 'express'

import {
  listarParceiros,
  criarParceiro,
  atualizarParceiro,
  excluirParceiro
} from '../controllers/parceiroController.js'

const router = express.Router()

router.get('/', listarParceiros)
router.post('/', criarParceiro)
router.put('/:id', atualizarParceiro)
router.delete('/:id', excluirParceiro)

export default router