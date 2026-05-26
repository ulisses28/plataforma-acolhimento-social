const API_URL = 'https://backend-abrigo.onrender.com/api'
export async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error('Erro ao buscar dados')
  }

  return response.json()
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Erro ao salvar')
  }

  return response.json()
}

export async function apiPut(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar')
  }

  return response.json()
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Erro ao excluir')
  }

  return response.json()
}