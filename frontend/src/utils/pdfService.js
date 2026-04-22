import jsPDF from "jspdf"

export function gerarRelatorioPDF({ resumo, doacoes }) {
  const pdf = new jsPDF()

  // Título
  pdf.setFontSize(18)
  pdf.text("Relatório de Doações", 14, 20)

  // Data
  pdf.setFontSize(10)
  pdf.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 28)

  // Linha separadora
  pdf.line(14, 32, 196, 32)

  // Resumo
  pdf.setFontSize(12)
  pdf.text("Resumo Geral:", 14, 40)

  pdf.setFontSize(10)
  pdf.text(`Total Financeiro: R$ ${resumo.totalFinanceiroConfirmado.toFixed(2)}`, 14, 48)
  pdf.text(`Total Material: R$ ${resumo.totalEstimadoMaterial.toFixed(2)}`, 14, 54)
  pdf.text(`Doações Financeiras: ${resumo.quantidadeFinanceiras}`, 14, 60)
  pdf.text(`Doações Materiais: ${resumo.quantidadeMateriais}`, 14, 66)

  // Tabela simples
  let y = 80

  pdf.setFontSize(12)
  pdf.text("Últimas Doações:", 14, y)

  y += 8

  pdf.setFontSize(9)

  doacoes.slice(-10).forEach((d) => {
    const linha = `${d.data} | ${d.doador || 'Anônimo'} | ${d.tipoDoacao} | ${d.status}`
    pdf.text(linha, 14, y)
    y += 6
  })

  pdf.save("relatorio-doacoes.pdf")
}