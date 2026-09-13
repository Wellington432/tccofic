import {Request, Response} from 'express';
import { CreateOrderService } from '../../services/order/CreateOrderSerivices';

export class CreateOrderController{
    async handle(req: Request, res: Response) {
        const {id_compra, id_produto, quantidade} = req.body;

        const createOrderService = new CreateOrderService();

        const order = await createOrderService.execute({
            id_compra,
            id_produto,
            quantidade,
            user_id: req.user_id
        });

         res.json(order);


    }
}