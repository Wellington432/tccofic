import { Request, Response } from "express";
import { AprovarPagamentoService } from "../../services/order/AprovarPagamentos";

class AprovarPagamentoController {
    async handle(req: Request, res: Response) {

        const { id } = req.params as { id: string };

        const aprovarPagamento = new AprovarPagamentoService();

        const compra = await aprovarPagamento.execute({ id, confirmado_por: req.user_id });

        res.json(compra);
    }
}

export { AprovarPagamentoController }
