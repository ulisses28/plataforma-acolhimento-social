const CHAVE = 'banco_curriculos_lar_batista'

export function listarCurriculos() {
  return JSON.parse(localStorage.getItem(CHAVE) || '[]')
}

export function salvarCurriculo(curriculo) {
  const atual = listarCurriculos()

  atual.unshift({
    id: Date.now(),
    dataCadastro: new Date().toLocaleString('pt-BR'),
    status: 'Em análise',
    ...curriculo
  })

  localStorage.setItem(CHAVE, JSON.stringify(atual))
}

export function excluirCurriculo(id) {
  const atual = listarCurriculos()
  localStorage.setItem(
    CHAVE,
    JSON.stringify(atual.filter((item) => item.id !== id))
  )
}

export function lerArquivoComoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => resolve(leitor.result)
    leitor.onerror = () => reject(new Error('Erro ao ler arquivo.'))
    leitor.readAsDataURL(arquivo)
  })
}

export function abrirArquivoBase64(base64) {
  if (!base64) {
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
      src="${base64}" 
      style="width:100%;height:100vh;border:none;"
    ></iframe>
  `)
}
export function baixarArquivoBase64(base64, nomeArquivo = 'arquivo.pdf') {
  if (!base64) {
    alert('Arquivo não encontrado.')
    return
  }

  const link = document.createElement('a')
  link.href = base64
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}