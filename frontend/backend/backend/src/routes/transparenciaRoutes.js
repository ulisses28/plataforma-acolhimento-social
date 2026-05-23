import express from 'express'

import {
  listarPublicacoes,
  criarPublicacao,
  atualizarPublicacao,
  excluirPublicacao
} from '../controllers/transparenciaController.js'

const router = express.Router()

router.get('/', listarPublicacoes)

router.post('/', criarPublicacao)

router.put('/:id', atualizarPublicacao)

router.delete('/:id', excluirPublicacao)

export default router