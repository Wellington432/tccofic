import prismaClient from '../../prisma';

class GetOrCreateCartService {
  async execute({ user_id }: { user_id: string }) {
    let compra = await prismaClient.compra.findFirst({
      where: { id_usuario: user_id, status: 'CARRINHO' },
      include: {
        itens: {
          include: { produto: { include: { categoria: true } } },
        },
      },
    });

    if (!compra) {
      compra = await prismaClient.compra.create({
        data: { id_usuario: user_id },
        include: {
          itens: {
            include: { produto: { include: { categoria: true } } },
          },
        },
      });
    }

    return compra;
  }
}

export { GetOrCreateCartService };
