import prismaClient from "../../prisma";

interface ListProdutosRequest {
  id_categoria?: string
  nome?: string
  todos?: boolean
}

class ListProdutoServices {
  async execute({ id_categoria, nome, todos }: ListProdutosRequest) {
    const produtos = await prismaClient.produto.findMany({
      where: {
        ...(todos ? {} : { ativo: true }),
        ...(id_categoria ? { id_categoria } : {}),
        ...(nome
          ? {
              OR: [
                { nome: { contains: nome, mode: 'insensitive' } },
                { descricao: { contains: nome, mode: 'insensitive' } },
                { categoria: { nome: { contains: nome, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        unidade: true,
        descricao: true,
        banner: true,
        estoque: true,
        ativo: true,
        categoria: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    return produtos;
  }
}

export { ListProdutoServices }
