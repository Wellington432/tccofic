import { Request, Response } from 'express';
import { CheckoutService } from '../../services/order/CheckoutService';
import { TipoEntrega } from '@prisma/client';

class CheckoutController {
  async handle(req: Request, res: Response) {
    const { id_compra, tipo_entrega, endereco } = req.body;

    const checkoutService = new CheckoutService();

    const result = await checkoutService.execute({
      id_compra,
      tipo_entrega: tipo_entrega as TipoEntrega,
      endereco,
      user_id: req.user_id,
    });

    res.json(result);
  }
}

export { CheckoutController };
