// Serviço para carregar país, estado e município

export async function listarPaises() {
  try {
    const resposta = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')

    const dados = await resposta.json()

    return dados
      .map((pais) => ({
        codigo: pais.cca2,
        nome: pais.name.common
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  } catch (error) {
    return [
      { codigo: 'BR', nome: 'Brazil' }
    ]
  }
}

export async function listarEstadosBrasil() {
  try {
    const resposta = await fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    )

    const dados = await resposta.json()

    return dados
      .map((estado) => ({
        id: estado.id,
        sigla: estado.sigla,
        nome: estado.nome
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  } catch (error) {
    return []
  }
}

export async function listarMunicipiosPorEstado(ufId) {
  if (!ufId) return []

  try {
    const resposta = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`
    )

    const dados = await resposta.json()

    return dados
      .map((municipio) => ({
        id: municipio.id,
        nome: municipio.nome
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  } catch (error) {
    return []
  }
}