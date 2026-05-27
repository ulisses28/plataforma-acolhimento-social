const API_URL =
  import.meta.env.VITE_API_URL || 'https://backend-abrigo.onrender.com/api'

export async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)
  if (!response.ok) throw new Error('Erro ao buscar dados da API')
  return response.json()
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw new Error('Erro ao salvar dados na API')
  return response.json()
}

export async function apiPut(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw new Error('Erro ao atualizar dados na API')
  return response.json()
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE'
  })

  if (!response.ok) throw new Error('Erro ao excluir dados da API')
  return response.json()
}