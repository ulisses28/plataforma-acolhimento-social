export function exportarBackupSistema() {
  const backup = {
    dataBackup: new Date().toISOString(),

    doacoes:
      JSON.parse(
        localStorage.getItem('doacoes_lar_batista')
      ) || [],

    necessidades:
      JSON.parse(
        localStorage.getItem('necessidades_lar_batista')
      ) || [],

    historicoNecessidades:
      JSON.parse(
        localStorage.getItem('historico_necessidades')
      ) || [],

    noticias:
      JSON.parse(
        localStorage.getItem('noticias_lar_batista')
      ) || [],

    governanca:
      JSON.parse(
        localStorage.getItem('governanca_lar_batista')
      ) || []
  }

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    {
      type: 'application/json'
    }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url

  link.download = `backup-lar-batista-${Date.now()}.json`

  link.click()

  URL.revokeObjectURL(url)
}