import { Request, Response } from 'express';
import { ListMeusPedidosService } from '../../services/order/ListMeusPedidosService';

class ListMeusPedidosController {
  async handle(req: Request, res: Response) {
    const service = new ListMeusPedidosService();
    const pedidos = await service.execute({ user_id: req.user_id });
    res.json(pedidos);
  }
}

export { ListMeusPedidosController };
