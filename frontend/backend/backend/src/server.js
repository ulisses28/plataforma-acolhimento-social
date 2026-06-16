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

/*
  CONFIGURAÇÃO DE CORS

  Isso libera o backend para receber requisições:
  - do frontend local, durante desenvolvimento
  - do frontend hospedado na Vercel
  - da URL configurada no Render pela variável FRONTEND_URL
*/

const allowedOrigins = [
  'http://localhost:5173',
  'https://plataforma-acolhimento-social.vercel.app',
  'https://www.larbatistaalbertinemeador.com.br',
  'https://larbatistaalbertinemeador.com.br',
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''))

app.use(
  cors({
    origin: function (origin, callback) {
      /*
        Permite requisições sem origin, como testes diretos,
        Postman, navegador acessando a API diretamente etc.
      */
      if (!origin) {
        return callback(null, true)
      }

      const origemNormalizada = origin.replace(/\/$/, '')

      if (allowedOrigins.includes(origemNormalizada)) {
        return callback(null, true)
      }

      return callback(
        new Error(`Origem não permitida pelo CORS: ${origin}`)
      )
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

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
    status: 'Backend funcionando',
    ambiente: process.env.NODE_ENV || 'development',
    frontendPermitido:
      process.env.FRONTEND_URL ||
      'https://plataforma-acolhimento-social.vercel.app'
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
  console.log('Origens permitidas pelo CORS:', allowedOrigins)
})