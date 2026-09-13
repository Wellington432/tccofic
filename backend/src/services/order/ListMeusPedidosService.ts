import prismaClient from '../../prisma';

class ListMeusPedidosService {
  async execute({ user_id }: { user_id: string }) {
    const pedidos = await prismaClient.compra.findMany({
      where: {
        id_usuario: user_id,
        status: { not: 'CARRINHO' },
      },
      orderBy: { criado_em: 'desc' },
      include: {
        itens: {
          include: { produto: true },
        },
      },
    });

    return pedidos;
  }
}

export { ListMeusPedidosService };
