import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import noticiaRoutes from './routes/noticiaRoutes.js'
import auditoriaRoutes from './routes/auditoriaRoutes.js'

dotenv.config()

const app = express()

app.use('/api/auditoria', auditoriaRoutes)

app.use(cors())

app.use(express.json({
  limit: '50mb'
}))

/*
|--------------------------------------------------------------------------
| CONEXÃO MONGODB
|--------------------------------------------------------------------------
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado')
  })
  .catch((error) => {
    console.log('❌ Erro MongoDB:', error)
  })

/*
|--------------------------------------------------------------------------
| ROTA TESTE
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {
  return res.json({
    status: 'Backend funcionando 🚀'
  })
})

/*
|--------------------------------------------------------------------------
| ROTAS API
|--------------------------------------------------------------------------
*/

app.use('/api/noticias', noticiaRoutes)

/*
|--------------------------------------------------------------------------
| PORTA
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})