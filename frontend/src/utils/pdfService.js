import jsPDF from 'jspdf'

export function gerarRelatorioPDF({ resumo, doacoes, analytics, insights }) {
  const pdf = new jsPDF()

  const dataGeracao = new Date().toLocaleDateString('pt-BR')
  const horaGeracao = new Date().toLocaleTimeString('pt-BR')

  pdf.setFontSize(18)
  pdf.text('Relatório Gerencial de Doações e Eficiência da Plataforma', 14, 18)

  pdf.setFontSize(10)
  pdf.text('Instituição: Lar Batista Albertine Meador', 14, 26)
  pdf.text(`Gerado em: ${dataGeracao} às ${horaGeracao}`, 14, 32)

  pdf.line(14, 36, 196, 36)

  pdf.setFontSize(13)
  pdf.text('1. Resumo de Doações', 14, 46)

  pdf.setFontSize(10)
  pdf.text(`Total financeiro confirmado: ${formatarMoeda(resumo.totalFinanceiroConfirmado)}`, 14, 55)
  pdf.text(`Total estimado em doações materiais: ${formatarMoeda(resumo.totalEstimadoMaterial)}`, 14, 61)
  pdf.text(`Quantidade de doações financeiras: ${resumo.quantidadeFinanceiras}`, 14, 67)
  pdf.text(`Quantidade de doações materiais: ${resumo.quantidadeMateriais}`, 14, 73)

  pdf.setFontSize(13)
  pdf.text('2. Indicadores de Uso da Plataforma', 14, 88)

  pdf.setFontSize(10)
  pdf.text(`Visitas no mês: ${analytics?.totalVisitas || 0}`, 14, 97)
  pdf.text(`Tempo total no site: ${formatarMinutos(analytics?.tempoTotal || 0)}`, 14, 103)
  pdf.text(`Tempo médio por usuário: ${(analytics?.tempoMedio || 0).toFixed(1)} segundos`, 14, 109)
  pdf.text(`Total de interações: ${analytics?.totalInteracoes || 0}`, 14, 115)
  pdf.text(`Interações por usuário: ${(analytics?.interacoesPorUsuario || 0).toFixed(1)}`, 14, 121)

  pdf.setFontSize(13)
  pdf.text('3. Insights Automáticos', 14, 136)

  pdf.setFontSize(10)
  pdf.text(`Nível de engajamento: ${insights?.nivelEngajamento || '-'}`, 14, 145)
  pdf.text(`Leitura do tempo médio: ${insights?.leituraTempo || '-'}`, 14, 151)
  pdf.text(`Eficiência da plataforma: ${insights?.eficiencia || '-'}`, 14, 157)

  const textoInsight = pdf.splitTextToSize(
    insights?.resumoTexto || 'Sem dados suficientes para gerar uma leitura automática.',
    180
  )

  pdf.text(textoInsight, 14, 166)

  let y = 190

  pdf.setFontSize(13)
  pdf.text('4. Últimas Doações Registradas', 14, y)

  y += 8

  pdf.setFontSize(9)

  const ultimas = [...doacoes].slice(-10).reverse()

  if (ultimas.length === 0) {
    pdf.text('Nenhuma doação registrada até o momento.', 14, y)
  } else {
    ultimas.forEach((d) => {
      if (y > 280) {
        pdf.addPage()
        y = 20
      }

      const valor =
        d.forma === 'Material'
          ? formatarMoeda(Number(d.valorEstimadoMaterial || 0))
          : d.valor || '-'

      const linha = `${d.data || '-'} | ${d.doador || 'Anônimo'} | ${d.tipoDoacao || '-'} | ${valor} | ${d.status || '-'}`
      pdf.text(linha, 14, y)
      y += 6
    })
  }

  pdf.save('relatorio-gerencial-doacoes.pdf')
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatarMinutos(segundos) {
  const minutos = Number(segundos || 0) / 60
  return `${minutos.toFixed(1)} min`
}