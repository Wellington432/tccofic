import { Request, Response } from "express";
import { ListPedidosPendentesService } from "../../services/order/ListPedidosPendentesServices";

class ListPedidosPendentesController {
    async handle(req: Request, res: Response) {

        const listPedidosPendentes = new ListPedidosPendentesService();

        const pedidos = await listPedidosPendentes.execute();

        res.json(pedidos);
    }
}

export { ListPedidosPendentesController }
