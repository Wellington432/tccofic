import { MercadoPagoConfig, Payment } from 'mercadopago';
import prismaClient from '../../prisma';
import { StatusCompra } from '@prisma/client';

interface WebhookRequest {
  type: string;
  data_id: string;
}

class WebhookMercadoPagoService {
  async execute({ type, data_id }: WebhookRequest) {
    if (type !== 'payment') return;

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) throw new Error('Configuração do Mercado Pago ausente.');

    const client = new MercadoPagoConfig({ accessToken });
    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({ id: data_id });

    const compra_id = payment.external_reference;
    if (!compra_id) return;

    let novoStatus: StatusCompra | null = null;

    if (payment.status === 'approved') {
      novoStatus = 'FINALIZADA';
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      novoStatus = 'CANCELADA';
    }

    if (!novoStatus) return;

    await prismaClient.compra.update({
      where: { id: compra_id },
      data: {
        status: novoStatus,
        mp_payment_id: String(payment.id),
      },
    });
  }
}

export { WebhookMercadoPagoService };
