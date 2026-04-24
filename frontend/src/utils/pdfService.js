import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function gerarRelatorioPDF({
  resumo,
  doacoes,
  analytics,
  insights,
  secoes = []
}) {
  const pdf = new jsPDF()
  const incluir = (secao) => secoes.includes(secao)

  let y = 18

  pdf.setFontSize(16)
  pdf.text('Relatório Gerencial - Lar Batista Albertine Meador', 14, y)

  y += 8
  pdf.setFontSize(10)
  pdf.text(
    `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    14,
    y
  )

  y += 6
  pdf.line(14, y, 196, y)
  y += 10

  if (incluir('resumo')) {
    pdf.setFontSize(13)
    pdf.text('1. Resumo de Doações', 14, y)
    y += 8

    pdf.setFontSize(10)
    pdf.text(`Total financeiro confirmado: ${formatarMoeda(resumo.totalFinanceiroConfirmado)}`, 14, y)
    y += 6
    pdf.text(`Total estimado material: ${formatarMoeda(resumo.totalEstimadoMaterial)}`, 14, y)
    y += 6
    pdf.text(`Doações financeiras: ${resumo.quantidadeFinanceiras}`, 14, y)
    y += 6
    pdf.text(`Doações materiais: ${resumo.quantidadeMateriais}`, 14, y)
    y += 12
  }

  if (incluir('uso')) {
    pdf.setFontSize(13)
    pdf.text('2. Indicadores de Uso da Plataforma', 14, y)
    y += 8

    pdf.setFontSize(10)
    pdf.text(`Visitas no mês: ${analytics?.totalVisitas || 0}`, 14, y)
    y += 6
    pdf.text(`Tempo total no site: ${((analytics?.tempoTotal || 0) / 60).toFixed(1)} min`, 14, y)
    y += 6
    pdf.text(`Tempo médio por usuário: ${(analytics?.tempoMedio || 0).toFixed(1)} s`, 14, y)
    y += 6
    pdf.text(`Total de interações: ${analytics?.totalInteracoes || 0}`, 14, y)
    y += 6
    pdf.text(`Interações por usuário: ${(analytics?.interacoesPorUsuario || 0).toFixed(1)}`, 14, y)
    y += 12
  }

  if (incluir('insights')) {
    pdf.setFontSize(13)
    pdf.text('3. Insights Automáticos', 14, y)
    y += 8

    pdf.setFontSize(10)
    pdf.text(`Nível de engajamento: ${insights?.nivelEngajamento || '-'}`, 14, y)
    y += 6
    pdf.text(`Leitura do tempo médio: ${insights?.leituraTempo || '-'}`, 14, y)
    y += 6
    pdf.text(`Eficiência da plataforma: ${insights?.eficiencia || '-'}`, 14, y)
    y += 8

    const texto = pdf.splitTextToSize(
      insights?.resumoTexto || 'Sem dados suficientes para gerar uma leitura automática.',
      180
    )

    pdf.text(texto, 14, y)
    y += texto.length * 5 + 10
  }

  if (incluir('doacoes')) {
    if (y > 230) {
      pdf.addPage()
      y = 20
    }

    pdf.setFontSize(13)
    pdf.text('4. Últimas Doações Registradas', 14, y)
    y += 8

    pdf.setFontSize(9)

    const ultimas = [...doacoes].slice(-10).reverse()

    if (ultimas.length === 0) {
      pdf.text('Nenhuma doação registrada.', 14, y)
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

        pdf.text(
          `${d.data || '-'} | ${d.doador || 'Anônimo'} | ${d.tipoDoacao || '-'} | ${valor} | ${d.status || '-'}`,
          14,
          y
        )
        y += 6
      })
    }
  }

  const graficosSelecionados = secoes.filter((secao) => secao.startsWith('grafico-'))

  for (const graficoId of graficosSelecionados) {
    const elemento = document.getElementById(graficoId)

    if (elemento) {
      pdf.addPage()

      const canvas = await html2canvas(elemento, {
        scale: 1,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const largura = 180
      const altura = (canvas.height * largura) / canvas.width

      pdf.addImage(imgData, 'PNG', 14, 20, largura, Math.min(altura, 250))
    }
  }

  pdf.save('relatorio-gerencial-doacoes.pdf')
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}