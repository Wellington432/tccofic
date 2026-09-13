import { Request, Response } from 'express';
import { DeleteOrderServices } from '../../services/order/DeletOrderServices';

export class DeleteOrderController {
    async handle(req: Request, res: Response) {
        const { id } = req.body;

        const deleteOrderService = new DeleteOrderServices();

        await deleteOrderService.execute({
            id,
            user_id: req.user_id
        });

        res.json({message: "Pedido deletado com sucesso"});

    }
    

}    