import { Request, Response } from "express";
import { CreateProductServices } from "../../services/product/CreateProdutoServices";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { nome, preco, unidade, descricao, id_categoria, estoque } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Imagem é obrigatória.' });
    }

    const banner = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const createProduct = new CreateProductServices();
    const produto = await createProduct.execute({
      nome,
      preco: Number(preco),
      unidade,
      descricao,
      banner,
      id_categoria,
      estoque: estoque !== undefined ? Number(estoque) : undefined
    });

    res.json(produto);
  }
}

export { CreateProductController }
