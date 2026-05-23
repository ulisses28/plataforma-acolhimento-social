import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { conectarBanco } from './config/db.js'
import noticiaRoutes from './routes/noticiaRoutes.js'
import vagaRoutes from './routes/vagaRoutes.js'
import curriculoRoutes from './routes/curriculoRoutes.js'
import necessidadeRoutes from './routes/necessidadeRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/noticias', noticiaRoutes)
app.use('/api/vagas', vagaRoutes)
app.use('/api/curriculos', curriculoRoutes)
app.use('/api/necessidades', necessidadeRoutes)

app.get('/', (req, res) => {
  res.json({
    status: 'Backend funcionando 🚀',
    banco: 'MongoDB conectado ✅'
  })
})

await conectarBanco()

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})