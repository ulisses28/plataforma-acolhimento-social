/*
  Serviço base de comunicação com a API.

  Este arquivo centraliza:
  - URL base do backend
  - tratamento padrão das respostas
  - métodos GET, POST, PUT e DELETE
  - método POST com FormData para upload de arquivos

  Em produção, a variável VITE_API_URL deve estar configurada na Vercel:
  VITE_API_URL=https://backend-abrigo.onrender.com/api
*/

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

async function tratarResposta(response, mensagemPadrao) {
  /*
    Algumas respostas podem vir sem JSON.
    Por isso usamos catch para evitar erro ao tentar converter.
  */
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.mensagem || data.erro || mensagemPadrao)
  }

  return data
}

export async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)

  return tratarResposta(
    response,
    'Erro ao buscar dados da API'
  )
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return tratarResposta(
    response,
    'Erro ao salvar dados na API'
  )
}

export async function apiPut(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return tratarResposta(
    response,
    'Erro ao atualizar dados na API'
  )
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE'
  })

  return tratarResposta(
    response,
    'Erro ao excluir dados da API'
  )
}

/*
  POST com FormData.

  Usado para upload de arquivos/imagens.

  Atenção:
  Não colocamos manualmente o header "Content-Type".
  Quando usamos FormData, o navegador define automaticamente
  o Content-Type com o boundary correto.

  Se colocar:
  'Content-Type': 'multipart/form-data'
  pode quebrar o upload.
*/
export async function apiPostFormData(endpoint, formData) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    body: formData
  })

  return tratarResposta(
    response,
    'Erro ao enviar arquivo para a API'
  )
}