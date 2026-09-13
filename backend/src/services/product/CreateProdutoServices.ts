import prismaClient from "../../prisma"

interface CreateProductServiceProps {
  nome: string
  preco: number
  unidade: string
  descricao: string
  banner: string
  id_categoria: string
  estoque?: number
}

class CreateProductServices {
  async execute({
    nome,
    preco,
    unidade,
    descricao,
    banner,
    id_categoria,
    estoque
  }: CreateProductServiceProps) {

    if (!nome || preco === undefined || preco === null || !unidade || !descricao || !banner || !id_categoria) {
      throw new Error("Dados ausentes")
    }

    if (Number.isNaN(preco) || preco <= 0) {
      throw new Error("Preço inválido")
    }

    if (estoque !== undefined && estoque < 0) {
      throw new Error("Estoque não pode ser negativo")
    }

    const produto = await prismaClient.produto.create({
      data: {
        nome,
        preco,
        unidade,
        descricao,
        banner,
        id_categoria,
        estoque: estoque ?? 0
      }
    })

    return produto
  }
}

export { CreateProductServices }