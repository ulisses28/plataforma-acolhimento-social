function getEmailFromName() {
  return process.env.EMAIL_FROM_NAME || 'Lar Batista Albertine Meador'
}

function getEmailFromAddress() {
  const emailFromAddress = process.env.EMAIL_FROM_ADDRESS

  if (!emailFromAddress) {
    throw new Error(
      'EMAIL_FROM_ADDRESS não configurado no ambiente do servidor.'
    )
  }

  return emailFromAddress
}

function getReplyTo() {
  return process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM_ADDRESS
}

async function enviarEmailBrevo({ destinatario, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    throw new Error('BREVO_API_KEY não configurada no ambiente do servidor.')
  }

  const senderEmail = getEmailFromAddress()
  const senderName = getEmailFromName()
  const replyTo = getReplyTo()

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: [
        {
          email: destinatario
        }
      ],
      replyTo: {
        email: replyTo
      },
      subject,
      htmlContent: html
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    console.error('Erro Brevo:', data)

    throw new Error(
      data?.message ||
        data?.error ||
        'Erro ao enviar e-mail pela Brevo.'
    )
  }

  return data
}

export async function enviarEmailRecuperacao(destinatario, codigo) {
  return enviarEmailBrevo({
    destinatario,
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
  return enviarEmailBrevo({
    destinatario,
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
  const destinatarioTecnico =
    process.env.EMAIL_ADMIN_RECUPERACAO ||
    process.env.EMAIL_REPLY_TO ||
    process.env.EMAIL_FROM_ADDRESS

  return enviarEmailBrevo({
    destinatario: destinatarioTecnico,
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