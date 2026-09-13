import prismaClient from "../../prisma";

interface OrderRequest {
  id_compra: string;
  id_produto: string;
  quantidade: number;
  user_id: string;
}

class CreateOrderService {
  async execute({ id_compra, id_produto, quantidade, user_id }: OrderRequest) {
    if (!id_compra || !id_produto || !quantidade) {
      throw new Error("Dados ausentes");
    }

    if (quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }

    const compra = await prismaClient.compra.findUnique({
      where: { id: id_compra },
      select: { id_usuario: true, status: true },
    });

    if (!compra) throw new Error("Carrinho não encontrado.");
    if (compra.id_usuario !== user_id) throw new Error("Acesso negado.");
    if (compra.status !== 'CARRINHO') throw new Error("Este pedido já foi processado.");

    const order = await prismaClient.itemCompra.create({
      data: {
        quantidade,
        id_compra,
        id_produto,
      },
    });

    return order;
  }
}

export { CreateOrderService };