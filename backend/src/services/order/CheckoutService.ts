import { gerarPayloadPix } from '../../modulos/pix/PixServices';
import QRCode from 'qrcode';
import prismaClient from '../../prisma';
import { TipoEntrega } from '@prisma/client';

interface CheckoutRequest {
  id_compra: string;
  tipo_entrega: TipoEntrega;
  endereco?: string;
  user_id: string;
}

class CheckoutService {
  async execute({ id_compra, tipo_entrega, endereco, user_id }: CheckoutRequest) {
    const compra = await prismaClient.compra.findUnique({
      where: { id: id_compra },
      include: { itens: { include: { produto: true } } },
    });

    if (!compra) throw new Error('Compra não encontrada.');
    if (compra.id_usuario !== user_id) throw new Error('Acesso negado.');
    if (compra.status !== 'CARRINHO') throw new Error('Este pedido já foi processado.');
    if (compra.itens.length === 0) throw new Error('O carrinho está vazio.');

    if (tipo_entrega === 'ENTREGA' && !endereco) {
      throw new Error('Endereço é obrigatório para entrega.');
    }

    for (const item of compra.itens) {
      if (item.produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para "${item.produto.nome}".`);
      }
    }

    const total = compra.itens.reduce(
      (soma, item) => soma + Number(item.produto.preco) * item.quantidade,
      0
    );

   
    const copiaCola = gerarPayloadPix({
      chavePix: process.env.PIX_KEY!, 
      nomeRecebedor: process.env.PIX_NOME_RECEBEDOR!,
      cidade: process.env.PIX_CIDADE!,
      valor: total,
      txid: id_compra.replace(/-/g, '').substring(0, 25),
    });

    const qrCodeBase64 = await QRCode.toDataURL(copiaCola);

    await prismaClient.$transaction([
      ...compra.itens.map((item) =>
        prismaClient.itemCompra.update({
          where: { id: item.id },
          data: { preco_unitario: item.produto.preco },
        })
      ),
      prismaClient.compra.update({
        where: { id: id_compra },
        data: {
          tipo_entrega,
          endereco: endereco ?? null,
          forma_pagamento: 'PIX',
          total,
          status: 'AGUARDANDO_PAGAMENTO', 
        },
      }),
    ]);

    return {
      checkout_url: `/pagamento/${id_compra}`,
      qr_code_base64: qrCodeBase64,
      copia_cola: copiaCola,
      id_compra,
    };
  }
}

export { CheckoutService };