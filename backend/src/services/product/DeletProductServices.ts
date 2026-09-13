import prismaClient from "../../prisma";

interface DeleteProductRequest {
  id: string
}

class DeleteProductServices {
  async execute({ id }: DeleteProductRequest) {
    if (!id) {
      throw new Error("Dados ausentes")
    }

    const produto = await prismaClient.produto.update({
      where: { id },
      data: { ativo: false }
    })

    return produto
  }
}

export { DeleteProductServices }
