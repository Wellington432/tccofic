import { Request, Response } from "express";
import { DeleteProductServices } from "../../services/product/DeletProductServices";

class DeleteProductController {
  async handle(req: Request, res: Response) {
    const { id } = req.body;

    const deleteProduct = new DeleteProductServices();

    await deleteProduct.execute({ id });

    res.json({ message: "Produto desativado com sucesso" });
  }
}

export { DeleteProductController }
