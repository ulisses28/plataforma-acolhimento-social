import express from 'express'

import {
  listarNoticias,
  criarNoticia,
  buscarNoticia,
  atualizarNoticia,
  excluirNoticia
} from '../controllers/noticiaController.js'

const router = express.Router()

router.get('/', listarNoticias)

router.post('/', criarNoticia)

router.get('/:id', buscarNoticia)

router.put('/:id', atualizarNoticia)

router.delete('/:id', excluirNoticia)

export default router