import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import * as XLSX from "xlsx"

// EXPORTAR PDF
export async function exportarPDF(idElemento) {
  const elemento = document.getElementById(idElemento)

  const canvas = await html2canvas(elemento)
  const imgData = canvas.toDataURL("image/png")

  const pdf = new jsPDF("p", "mm", "a4")

  const largura = 210
  const altura = (canvas.height * largura) / canvas.width

  pdf.addImage(imgData, "PNG", 0, 10, largura, altura)
  pdf.save("relatorio-doacoes.pdf")
}

// EXPORTAR EXCEL
export function exportarExcel(dados) {
  const worksheet = XLSX.utils.json_to_sheet(dados)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório")

  XLSX.writeFile(workbook, "relatorio-doacoes.xlsx")
}