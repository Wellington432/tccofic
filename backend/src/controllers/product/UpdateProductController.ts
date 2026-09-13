import { Request, Response } from "express";
import { UpdateProductServices } from "../../services/product/UpdateProdutoServices";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { id, nome, preco, unidade, descricao, id_categoria, estoque, ativo } = req.body;

    const banner = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : undefined;

    const updateProduct = new UpdateProductServices();
    const produto = await updateProduct.execute({
      id,
      nome,
      preco: Number(preco),
      unidade,
      descricao,
      id_categoria,
      estoque: Number(estoque),
      banner,
      ativo: ativo === undefined ? undefined : ativo === true || ativo === "true"
    });

    res.json(produto);
  }
}

export { UpdateProductController }
