import nodemailer from 'nodemailer'

export async function enviarEmailRecuperacao(destinatario, codigo) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: destinatario,
    subject: 'Código de recuperação de senha',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Recuperação de senha</h2>
        <p>Seu código de recuperação é:</p>
        <h1>${codigo}</h1>
        <p>Este código expira em 15 minutos.</p>
        <p>Se você não solicitou essa recuperação, ignore este e-mail.</p>
      </div>
    `
  })
}