import { Request, Response } from 'express';
import { GetOrCreateCartService } from '../../services/order/GetOrCreateCartService';

class GetOrCreateCartController {
  async handle(req: Request, res: Response) {
    const service = new GetOrCreateCartService();
    const compra = await service.execute({ user_id: req.user_id });
    res.json(compra);
  }
}

export { GetOrCreateCartController };
