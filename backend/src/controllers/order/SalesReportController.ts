import { Request, Response } from 'express';
import { SalesReportService } from '../../services/order/SalesReportService';

class SalesReportController {
  async handle(req: Request, res: Response) {
    const { dias } = req.query;

    const service = new SalesReportService();
    const relatorio = await service.execute({
      dias: dias ? Number(dias) : undefined
    });

    res.json(relatorio);
  }
}

export { SalesReportController };
