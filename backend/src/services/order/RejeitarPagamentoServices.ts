import prismaClient from "../../prisma";

class RejeitarPagamentoService {
  async execute({ id, confirmado_por }: { id: string; confirmado_por: string }) {
    const compra = await prismaClient.compra.findUnique({
      where: { id },
    });

    if (!compra) {
      throw new Error("Pedido não encontrado");
    }

    if (compra.status !== "AGUARDANDO_CONFIRMACAO") {
      throw new Error("Este pedido não está aguardando aprovação");
    }

    const compraAtualizada = await prismaClient.compra.update({
      where: { id },
      data: { status: "REJEITADO", confirmado_por, confirmado_em: new Date() },
    });

    return compraAtualizada;
  }
}

export { RejeitarPagamentoService };