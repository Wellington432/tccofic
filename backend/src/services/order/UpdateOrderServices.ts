import prismaClient from "../../prisma";

interface UpdateOrderRequest {
  id: string;
  quantidade: number;
  user_id: string;
}

class UpdateOrderService {
  async execute({ id, quantidade, user_id }: UpdateOrderRequest) {
    if (quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }

    const item = await prismaClient.itemCompra.findUnique({
      where: { id },
      include: { compra: { select: { id_usuario: true } } }
    });

    if (!item) throw new Error("Item não encontrado.");
    if (item.compra.id_usuario !== user_id) throw new Error("Acesso negado.");

    const atualizado = await prismaClient.itemCompra.update({
      where: { id },
      data: { quantidade },
    });

    return atualizado;
  }
}

export { UpdateOrderService };
