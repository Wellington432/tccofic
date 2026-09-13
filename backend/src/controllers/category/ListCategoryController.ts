import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";

class ListCategoryController {
    async handle(req: Request, res: Response) {
        const listCategory = new ListCategoryService();
        const categorias = await listCategory.execute();
        res.json(categorias);
    }
}

export { ListCategoryController };
