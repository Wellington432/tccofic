import { createStaticPix, hasError } from 'pix-utils';

interface GerarPayloadPixParams {
  chavePix: string;
  nomeRecebedor: string;
  cidade: string;
  valor: number;
  txid: string;
}

function gerarPayloadPix({
  chavePix,
  nomeRecebedor,
  cidade,
  valor,
  txid,
}: GerarPayloadPixParams): string {
  const pix = createStaticPix({
    merchantName: nomeRecebedor.substring(0, 25),
    merchantCity: cidade.substring(0, 15),
    pixKey: chavePix,
    infoAdicional: 'Compra FeiraEtec',
    transactionAmount: valor,
    txid,
  });

  if (hasError(pix)) {
    throw new Error('Erro ao gerar payload Pix: ' + pix.error);
  }

  return pix.toBRCode();
}

export { gerarPayloadPix };