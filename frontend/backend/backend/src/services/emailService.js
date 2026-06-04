import nodemailer from 'nodemailer'

function criarTransporter() {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error(
      'Configuração de e-mail incompleta. Verifique EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS e EMAIL_FROM no .env.'
    )
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

export async function enviarEmailRecuperacao(destinatario, codigo) {
  const transporter = criarTransporter()

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

export async function enviarEmailSolicitacaoResetAdmin({
  emailAdmin,
  ip,
  dataHora
}) {
  const transporter = criarTransporter()

  const destinatarioTecnico =
    process.env.EMAIL_ADMIN_RECUPERACAO || process.env.EMAIL_USER

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: destinatarioTecnico,
    subject: 'Solicitação de recuperação de senha administrativa',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Solicitação de recuperação administrativa</h2>

        <p>Foi solicitada recuperação de senha para o painel administrativo.</p>

        <p><strong>E-mail administrativo:</strong> ${emailAdmin}</p>
        <p><strong>IP:</strong> ${ip || 'Não identificado'}</p>
        <p><strong>Data/Hora:</strong> ${dataHora}</p>

        <p>
          Por segurança, a senha administrativa não deve ser redefinida automaticamente.
          Valide a solicitação e execute o reset técnico pelo ambiente seguro.
        </p>
      </div>
    `
  })
}
export async function enviarEmailLinkRecuperacao(destinatario, link) {
  const transporter = criarTransporter()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: destinatario,
    subject: 'Redefinição de senha',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Redefinição de senha</h2>

        <p>Recebemos uma solicitação para redefinir sua senha.</p>

        <p>Clique no botão abaixo para criar uma nova senha:</p>

        <p>
          <a 
            href="${link}" 
            style="
              background:#0B3D91;
              color:#ffffff;
              padding:12px 18px;
              border-radius:8px;
              text-decoration:none;
              font-weight:bold;
              display:inline-block;
            "
          >
            Redefinir senha
          </a>
        </p>

        <p>Este link expira em 15 minutos.</p>

        <p>Se você não solicitou essa recuperação, ignore este e-mail.</p>
      </div>
    `
  })
}