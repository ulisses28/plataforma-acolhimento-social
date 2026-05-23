import express from 'express'

import upload from '../config/multer.js'

const router = express.Router()

router.post(
  '/',
  upload.single('arquivo'),
  (req, res) => {
    return res.json({
      arquivo: req.file.filename
    })
  }
)

export default router