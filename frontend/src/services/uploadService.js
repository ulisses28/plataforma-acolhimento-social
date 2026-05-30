export function formatarTamanho(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2)
}

export function validarArquivo({
  arquivo,
  tiposPermitidos = [],
  limiteMB = 5
}) {
  const tamanhoMB = Number(formatarTamanho(arquivo.size))

  if (
    tiposPermitidos.length > 0 &&
    !tiposPermitidos.some((tipo) => arquivo.type.startsWith(tipo))
  ) {
    return {
      valido: false,
      mensagem: `Tipo de arquivo não permitido: ${arquivo.type}`
    }
  }

  if (tamanhoMB > limiteMB) {
    return {
      valido: false,
      mensagem: `O arquivo "${arquivo.name}" possui ${tamanhoMB} MB. O limite permitido é ${limiteMB} MB.`
    }
  }

  return {
    valido: true,
    tamanhoMB
  }
}

export function lerArquivoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = () => {
      resolve({
        nome: arquivo.name,
        tipo: arquivo.type,
        tamanho: arquivo.size,
        tamanhoMB: formatarTamanho(arquivo.size),
        base64: leitor.result
      })
    }

    leitor.onerror = () => {
      reject(new Error('Erro ao ler arquivo.'))
    }

    leitor.readAsDataURL(arquivo)
  })
}

export async function processarArquivos({
  arquivos,
  tiposPermitidos,
  limiteImagemMB = 5,
  limiteVideoMB = 100,
  alertaVideoMB = 50
}) {
  const lista = Array.from(arquivos || [])

  if (lista.length === 0) return []

  for (const arquivo of lista) {
    const tamanhoMB = Number(formatarTamanho(arquivo.size))

    if (arquivo.type.startsWith('image')) {
      const validacao = validarArquivo({
        arquivo,
        tiposPermitidos: ['image'],
        limiteMB: limiteImagemMB
      })

      if (!validacao.valido) {
        throw new Error(validacao.mensagem)
      }
    }

    if (arquivo.type.startsWith('video')) {
      const validacao = validarArquivo({
        arquivo,
        tiposPermitidos: ['video'],
        limiteMB: limiteVideoMB
      })

      if (!validacao.valido) {
        throw new Error(
          `${validacao.mensagem}\n\nPara vídeos maiores, publique no YouTube e cole o link.`
        )
      }

      if (tamanhoMB > alertaVideoMB) {
        const continuar = confirm(
          `O vídeo "${arquivo.name}" possui ${tamanhoMB} MB.\n\n` +
            'Arquivos grandes podem deixar a publicação mais lenta.\n\n' +
            'Deseja continuar mesmo assim?'
        )

        if (!continuar) {
          throw new Error('Envio cancelado pelo usuário.')
        }
      }
    }
  }

  return await Promise.all(
    lista.map((arquivo) => lerArquivoBase64(arquivo))
  )
}