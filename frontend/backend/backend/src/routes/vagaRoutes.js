import express from 'express'

import {
  listarVagas,
  listarVagasAtivas,
  criarVaga,
  buscarVaga,
  atualizarVaga,
  arquivarVaga,
  excluirVaga
} from '../controllers/vagaController.js'

const router = express.Router()

router.get('/', listarVagas)
router.get('/ativas', listarVagasAtivas)
router.post('/', criarVaga)
router.get('/:id', buscarVaga)
router.put('/:id', atualizarVaga)
router.patch('/:id/arquivar', arquivarVaga)
router.delete('/:id', excluirVaga)

export default router