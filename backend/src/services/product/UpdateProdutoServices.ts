import prismaClient from "../../prisma"

interface UpdateProductServiceProps {
  id: string
  nome: string
  preco: number
  unidade: string
  descricao: string
  id_categoria: string
  estoque: number
  banner?: string
  ativo?: boolean
}

class UpdateProductServices {
  async execute({
    id,
    nome,
    preco,
    unidade,
    descricao,
    id_categoria,
    estoque,
    banner,
    ativo
  }: UpdateProductServiceProps) {

    if (!id || !nome || preco === undefined || preco === null || !unidade || !descricao || !id_categoria) {
      throw new Error("Dados ausentes")
    }

    if (Number.isNaN(preco) || preco <= 0) {
      throw new Error("Preço inválido")
    }

    if (estoque < 0) {
      throw new Error("Estoque não pode ser negativo")
    }

    const produto = await prismaClient.produto.update({
      where: { id },
      data: {
        nome,
        preco,
        unidade,
        descricao,
        id_categoria,
        estoque,
        ...(banner ? { banner } : {}),
        ...(ativo !== undefined ? { ativo } : {})
      }
    })

    return produto
  }
}

export { UpdateProductServices }
