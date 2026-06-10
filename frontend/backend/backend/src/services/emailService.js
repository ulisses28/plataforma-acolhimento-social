import nodemailer from 'nodemailer'
import dns from 'dns'

function criarTransporter() {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM
  } = process.env

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    throw new Error(
      'Configuração de e-mail incompleta. Verifique EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS e EMAIL_FROM no .env.'
    )
  }

  const porta = Number(EMAIL_PORT)

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: porta,
    secure: porta === 465,

    /*
      Força IPv4 no Render.
      O erro ENETUNREACH estava tentando sair pelo IPv6:
      2607:f8b0:400e:c09::6
    */
    family: 4,

    lookup: (hostname, options, callback) => {
      return dns.lookup(
        hostname,
        {
          family: 4,
          all: false
        },
        callback
      )
    },

    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,

    tls: {
      servername: EMAIL_HOST,
      rejectUnauthorized: true
    }
  })
}

function getEmailFrom() {
  return process.env.EMAIL_FROM
}

function getReplyTo() {
  return process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER
}

export async function enviarEmailRecuperacao(destinatario, codigo) {
  const transporter = criarTransporter()

  await transporter.sendMail({
    from: getEmailFrom(),
    replyTo: getReplyTo(),
    to: destinatario,
    subject: 'Código de recuperação de senha',
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2 style="color: #0B3D91;">Recuperação de senha</h2>

        <p>Recebemos uma solicitação para recuperação de senha.</p>

        <p>Seu código de recuperação é:</p>

        <div style="
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 4px;
          color: #0B3D91;
          margin: 20px 0;
        ">
          ${codigo}
        </div>

        <p>Este código expira em 15 minutos.</p>

        <p>Se você não solicitou essa recuperação, ignore este e-mail.</p>
      </div>
    `
  })
}

export async function enviarEmailLinkRecuperacao(destinatario, link) {
  const transporter = criarTransporter()

  await transporter.sendMail({
    from: getEmailFrom(),
    replyTo: getReplyTo(),
    to: destinatario,
    subject: 'Redefinição de senha',
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2 style="color: #0B3D91;">Redefinição de senha</h2>

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

export async function enviarEmailSolicitacaoResetAdmin({
  emailAdmin,
  ip,
  dataHora
}) {
  const transporter = criarTransporter()

  const destinatarioTecnico =
    process.env.EMAIL_ADMIN_RECUPERACAO || process.env.EMAIL_USER

  await transporter.sendMail({
    from: getEmailFrom(),
    replyTo: getReplyTo(),
    to: destinatarioTecnico,
    subject: 'Solicitação de recuperação de senha administrativa',
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2 style="color: #0B3D91;">Solicitação de recuperação administrativa</h2>

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