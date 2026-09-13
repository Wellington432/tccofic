import { Request, Response } from "express";
import { UpdateOrderService } from "../../services/order/UpdateOrderServices";

class UpdateOrderController {
  async handle(req: Request, res: Response) {
    const { id, quantidade } = req.body;

    const updateOrderService = new UpdateOrderService();

    const item = await updateOrderService.execute({ id, quantidade, user_id: req.user_id });

    res.json(item);
  }
}

export { UpdateOrderController };
