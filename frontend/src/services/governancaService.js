const STORAGE_KEY = 'governanca_lar_batista'

export function listarDocumentosGovernanca() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

export function salvarDocumentoGovernanca(documento) {
  const lista = listarDocumentosGovernanca()

  const novo = {
    id: Date.now(),
    titulo: documento.titulo,
    categoria: documento.categoria,
    descricao: documento.descricao,
    arquivoNome: documento.arquivoNome || '',
    arquivoBase64: documento.arquivoBase64 || '',
    status: 'Publicado',
    dataPublicacao: new Date().toLocaleDateString('pt-BR')
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([novo, ...lista]))

  return novo
}

export function excluirDocumentoGovernanca(id) {
  const lista = listarDocumentosGovernanca()

  const atualizada = lista.filter((item) => item.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
}

export function lerArquivoComoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo.'))

    leitor.readAsDataURL(arquivo)
  })
}

export function abrirArquivoBase64(arquivoBase64) {
  if (!arquivoBase64) {
    alert('Arquivo não encontrado.')
    return
  }

  const novaJanela = window.open()

  if (!novaJanela) {
    alert('O navegador bloqueou a abertura do arquivo.')
    return
  }

  novaJanela.document.write(`
    <iframe 
      src="${arquivoBase64}" 
      style="width:100%;height:100vh;border:none;"
    ></iframe>
  `)
}

export function baixarArquivoBase64(arquivoBase64, nomeArquivo = 'documento.pdf') {
  if (!arquivoBase64) {
    alert('Arquivo não encontrado.')
    return
  }

  const link = document.createElement('a')
  link.href = arquivoBase64
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}