const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

async function tratarResposta(response, mensagemPadrao) {
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