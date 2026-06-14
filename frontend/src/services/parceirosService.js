import { apiPostFormData } from './api'

const STORAGE_KEY = 'parceiros_lar_batista'

/*
  Lista parceiros salvos no localStorage.

  A logo pode estar:
  - em base64, campo antigo "logo"
  - em URL da Cloudinary, campo novo "logoUrl" ou "imagemUrl"
*/
export function listarParceiros() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

/*
  Envia logo do parceiro para a Cloudinary.

  Usa a rota de imagem já criada:
  POST /api/upload/imagem

  Campo esperado pelo backend:
  imagem
*/
export async function enviarLogoParceiro(arquivo) {
  validarLogo(arquivo)

  const formData = new FormData()
  formData.append('imagem', arquivo)

  return apiPostFormData('/upload/imagem', formData)
}

/*
  Salva parceiro no localStorage.

  Compatível com:
  - logo: campo antigo, base64
  - logoUrl: campo novo, Cloudinary
  - logoPublicId: ID da imagem na Cloudinary
  - imagemUrl/imagemPublicId: nomes alternativos vindos da rota de upload
*/
export function salvarParceiro(parceiro) {
  const lista = listarParceiros()

  const novo = {
    id: parceiro.id || Date.now(),
    criadoEm: parceiro.criadoEm || new Date().toLocaleDateString('pt-BR'),

    ...parceiro,

    logo: parceiro.logo || parceiro.logoUrl || parceiro.imagemUrl || '',
    logoUrl: parceiro.logoUrl || parceiro.imagemUrl || parceiro.logo || '',
    logoPublicId: parceiro.logoPublicId || parceiro.imagemPublicId || '',
    imagemUrl: parceiro.imagemUrl || parceiro.logoUrl || parceiro.logo || '',
    imagemPublicId: parceiro.imagemPublicId || parceiro.logoPublicId || ''
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([novo, ...lista])
  )

  return novo
}

/*
  Atualiza parceiro.

  Deixei pronto caso o painel admin permita edição.
*/
export function atualizarParceiro(parceiroAtualizado) {
  const lista = listarParceiros()

  const atualizada = lista.map((item) =>
    item.id === parceiroAtualizado.id ? parceiroAtualizado : item
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))

  return parceiroAtualizado
}

export function excluirParceiro(id) {
  const lista = listarParceiros()
  const atualizada = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

/*
  Validação de logo.

  Mesmos formatos aceitos no backend:
  - JPG
  - PNG
  - WEBP

  Limite:
  5 MB
*/
export function validarLogo(arquivo, limiteMB = 5) {
  if (!arquivo) {
    throw new Error('Nenhum arquivo foi selecionado.')
  }

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']

  if (!tiposPermitidos.includes(arquivo.type)) {
    throw new Error('Formato inválido. Envie logo em JPG, PNG ou WEBP.')
  }

  const tamanhoMB = arquivo.size / (1024 * 1024)

  if (tamanhoMB > limiteMB) {
    throw new Error(
      `A logo possui ${tamanhoMB.toFixed(2)} MB. O limite permitido é ${limiteMB} MB.`
    )
  }

  return true
}

/*
  Função antiga mantida.

  Ainda pode ser usada por telas que salvam a logo em base64.
*/
export function lerLogoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = () => reject(new Error('Erro ao ler logo.'))
  })
}