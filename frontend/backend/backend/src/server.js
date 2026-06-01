import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/authRoutes.js'
import auditoriaRoutes from './routes/auditoriaRoutes.js'
import doadorAuthRoutes from './routes/doadorAuthRoutes.js'
import noticiaRoutes from './routes/noticiaRoutes.js'
import necessidadeRoutes from './routes/necessidadeRoutes.js'
import parceiroRoutes from './routes/parceiroRoutes.js'
import transparenciaRoutes from './routes/transparenciaRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import vagaRoutes from './routes/vagaRoutes.js'
import curriculoRoutes from './routes/curriculoRoutes.js'

dotenv.config()

const app = express()

app.use(cors())

app.use(
  express.json({
    limit: '50mb'
  })
)


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado')
  })
  .catch((error) => {
    console.log('Erro ao conectar MongoDB:', error.message)
  })

app.get('/', (req, res) => {
  res.json({
    status: 'Backend funcionando'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/auditoria', auditoriaRoutes)
app.use('/api/doador-auth', doadorAuthRoutes)
app.use('/api/noticias', noticiaRoutes)
app.use('/api/necessidades', necessidadeRoutes)
app.use('/api/parceiros', parceiroRoutes)
app.use('/api/transparencia', transparenciaRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/vagas', vagaRoutes)
app.use('/api/curriculos', curriculoRoutes)

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})