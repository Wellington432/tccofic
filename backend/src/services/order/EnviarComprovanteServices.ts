import prismaClient from '../../prisma';

interface EnviarComprovanteRequest {
  id: string;
  user_id: string;
  caminhoArquivo: string;
}

class EnviarComprovanteService {
  async execute({ id, user_id, caminhoArquivo }: EnviarComprovanteRequest) {
    const compra = await prismaClient.compra.findUnique({ where: { id } });

    if (!compra) throw new Error('Compra não encontrada.');
    if (compra.id_usuario !== user_id) throw new Error('Acesso negado.');
    if (compra.status !== 'AGUARDANDO_PAGAMENTO') {
      throw new Error('Este pedido não está aguardando pagamento.');
    }

    await prismaClient.compra.update({
      where: { id },
      data: {
        comprovante_url: caminhoArquivo,
        comprovante_enviado_em: new Date(),
        status: 'AGUARDANDO_CONFIRMACAO',
      },
    });

    return { status: 'AGUARDANDO_CONFIRMACAO' };
  }
}

export { EnviarComprovanteService };