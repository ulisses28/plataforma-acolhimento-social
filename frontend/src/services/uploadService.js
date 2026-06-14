import { apiPostFormData } from './api'

/*
  Converte bytes para MB.
  Usado para exibir tamanho do arquivo e validar limites.
*/
export function formatarTamanho(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2)
}

/*
  Valida tipo e tamanho do arquivo.

  Exemplo de tiposPermitidos:
  ['image'] aceita image/png, image/jpeg, image/webp etc.
  ['video'] aceita video/mp4 etc.
*/
export function validarArquivo({
  arquivo,
  tiposPermitidos = [],
  limiteMB = 5
}) {
  if (!arquivo) {
    return {
      valido: false,
      mensagem: 'Nenhum arquivo foi selecionado.'
    }
  }

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

/*
  Lê um arquivo como Base64.

  Mantive essa função porque ela pode estar sendo usada em outras partes
  do sistema antigo, principalmente se alguma tela ainda salva imagem
  direto como texto/base64.
*/
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

/*
  Processa arquivos localmente em Base64.

  Mantido por compatibilidade com o fluxo antigo.
  Para notícias com Cloudinary, o ideal será usar enviarImagemNoticia().
*/
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
        tiposPermitidos: tiposPermitidos || ['image'],
        limiteMB: limiteImagemMB
      })

      if (!validacao.valido) {
        throw new Error(validacao.mensagem)
      }
    }

    if (arquivo.type.startsWith('video')) {
      const validacao = validarArquivo({
        arquivo,
        tiposPermitidos: tiposPermitidos || ['video'],
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

/*
  NOVO FLUXO PARA CLOUDINARY

  Essa função envia uma imagem para o backend.

  O backend recebe a imagem em:
  POST /api/upload/imagem

  Como o API_URL já termina com /api, aqui usamos apenas:
  /upload/imagem

  O backend então envia a imagem para a Cloudinary e devolve:
  {
    mensagem: 'Imagem enviada com sucesso.',
    imagemUrl: 'https://res.cloudinary.com/...',
    imagemPublicId: 'lar-batista/noticias/...'
  }
*/
export async function enviarImagemNoticia(arquivo) {
  const validacao = validarArquivo({
    arquivo,
    tiposPermitidos: ['image'],
    limiteMB: 5
  })

  if (!validacao.valido) {
    throw new Error(validacao.mensagem)
  }

  const formData = new FormData()

  /*
    O nome "imagem" precisa ser igual ao usado no backend:

    upload.single('imagem')
  */
  formData.append('imagem', arquivo)

  return apiPostFormData('/upload/imagem', formData)
}