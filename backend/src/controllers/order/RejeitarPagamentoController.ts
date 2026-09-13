import { Request, Response } from "express";
import { RejeitarPagamentoService } from "../../services/order/RejeitarPagamentoServices";

class RejeitarPagamentoController {
    async handle(req: Request, res: Response) {

        const { id } = req.params as { id: string };

        const rejeitarPagamento = new RejeitarPagamentoService();

        const compra = await rejeitarPagamento.execute({ id, confirmado_por: req.user_id });

        res.json(compra);
    }
}

export { RejeitarPagamentoController }
