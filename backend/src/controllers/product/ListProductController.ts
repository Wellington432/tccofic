import { Request, Response } from "express";
import { ListProdutoServices } from "../../services/product/ListProdutoServices";

class ListProductController {
  async handle(req: Request, res: Response) {
    const { id_categoria, nome, todos } = req.query;

    const listProduto = new ListProdutoServices();

    const produtos = await listProduto.execute({
      id_categoria: id_categoria as string | undefined,
      nome: nome as string | undefined,
      todos: todos === "1" || todos === "true"
    });

    res.json(produtos);
  }
}

export { ListProductController }
