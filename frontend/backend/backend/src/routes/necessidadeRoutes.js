import express from 'express'

import {
  listarNecessidades,
  criarNecessidade,
  atualizarNecessidade,
  excluirNecessidade
} from '../controllers/necessidadeController.js'

const router = express.Router()

router.get('/', listarNecessidades)
router.post('/', criarNecessidade)
router.put('/:id', atualizarNecessidade)
router.delete('/:id', excluirNecessidade)

export default router