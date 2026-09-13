import prismaClient from "../../prisma";

class ListPedidosPendentesService {
  async execute() {
    const pedidos = await prismaClient.compra.findMany({
      where: { status: { in: ["AGUARDANDO_CONFIRMACAO", "REJEITADO"] } },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
        itens: true,
      },
      orderBy: { comprovante_enviado_em: "asc" },
    });

    return pedidos;
  }
}

export { ListPedidosPendentesService };