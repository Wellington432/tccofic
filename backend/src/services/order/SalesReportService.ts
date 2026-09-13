import prismaClient from "../../prisma";

interface SalesReportRequest {
  dias?: number;
}

class SalesReportService {
  async execute({ dias }: SalesReportRequest) {
    const periodoDias = dias && [7, 30, 90].includes(dias) ? dias : 30;

    const desde = new Date();
    desde.setDate(desde.getDate() - (periodoDias - 1));
    desde.setHours(0, 0, 0, 0);

    const vendas = await prismaClient.compra.findMany({
      where: {
        status: 'PAGO',
        modificado_em: { gte: desde },
      },
      include: {
        itens: { include: { produto: { select: { id: true, nome: true } } } },
      },
    });

    const pedidosCancelados = await prismaClient.compra.count({
      where: { status: 'CANCELADO', modificado_em: { gte: desde } },
    });

    const pedidosAguardandoPagamento = await prismaClient.compra.count({
      where: { status: 'AGUARDANDO_PAGAMENTO' },
    });

    const receitaPorDiaMap = new Map<string, number>();
    for (let i = 0; i < periodoDias; i++) {
      const dia = new Date(desde);
      dia.setDate(dia.getDate() + i);
      receitaPorDiaMap.set(dia.toISOString().slice(0, 10), 0);
    }

    const quantidadePorProduto = new Map<string, { nome: string; quantidade: number }>();

    let receitaTotal = 0;

    for (const venda of vendas) {
      const dataChave = venda.modificado_em.toISOString().slice(0, 10);
      const totalVenda = Number(venda.total);
      receitaTotal += totalVenda;
      receitaPorDiaMap.set(dataChave, (receitaPorDiaMap.get(dataChave) ?? 0) + totalVenda);

      for (const item of venda.itens) {
        const atual = quantidadePorProduto.get(item.id_produto);
        quantidadePorProduto.set(item.id_produto, {
          nome: item.produto.nome,
          quantidade: (atual?.quantidade ?? 0) + item.quantidade,
        });
      }
    }

    const receita_por_dia = Array.from(receitaPorDiaMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, total]) => ({ data, total }));

    const produtos_mais_vendidos = Array.from(quantidadePorProduto.entries())
      .map(([id_produto, dados]) => ({ id_produto, nome: dados.nome, quantidade: dados.quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      periodo_dias: periodoDias,
      receita_total: receitaTotal,
      pedidos_finalizados: vendas.length,
      pedidos_aguardando_pagamento: pedidosAguardandoPagamento,
      pedidos_cancelados: pedidosCancelados,
      receita_por_dia,
      produtos_mais_vendidos,
    };
  }
}

export { SalesReportService };