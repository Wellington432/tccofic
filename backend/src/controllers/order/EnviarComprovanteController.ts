import { Request, Response } from 'express';
import { EnviarComprovanteService } from '../../services/order/EnviarComprovanteServices';

class EnviarComprovanteController {
  async handle(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Comprovante é obrigatório.' });
      }

      const { id_compra } = req.params;

      if (typeof id_compra !== 'string') {
        return res.status(400).json({ error: 'ID da compra inválido.' });
      }

      const user_id = req.user_id;

      const service = new EnviarComprovanteService();
      const result = await service.execute({
        id: id_compra,
        user_id,
        caminhoArquivo: `/uploads/${req.file.filename}`,
      });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export { EnviarComprovanteController };