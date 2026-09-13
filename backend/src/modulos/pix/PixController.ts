import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { gerarPayloadPix } from './PixServices'; 
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export async function gerarQrCode(req: Request, res: Response) {
  const { compraId } = req.params;

  if (typeof compraId !== 'string') {
    return res.status(400).json({ error: 'compraId inválido' });
  }

  const compra = await prisma.compra.findUnique({ where: { id: compraId } });
  if (!compra) return res.status(404).json({ error: 'Compra não encontrada' });

  const txid = compraId.replace(/-/g, '').slice(0, 25);
  const valor = Number(compra.total); 
  const brCode = gerarPayloadPix({
    chavePix: process.env.PIX_KEY!,
    nomeRecebedor: process.env.PIX_NOME_RECEBEDOR!,
    cidade: process.env.PIX_CIDADE!,
    valor,
    txid
  });
  const qrCodeBase64 = await QRCode.toDataURL(brCode);

  return res.json({ brCode, qrCodeBase64 });
}