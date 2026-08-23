'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type StatusCompra =
  | 'CARRINHO'
  | 'AGUARDANDO_PAGAMENTO'
  | 'AGUARDANDO_CONFIRMACAO'
  | 'PAGO'
  | 'REJEITADO'
  | 'CANCELADO';

interface DadosPix {
  brCode: string;
  qrCodeBase64: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // ex: http://localhost:3333

export default function PagamentoPage() {
  const { id: compraId } = useParams();
  const [pix, setPix] = useState<DadosPix | null>(null);
  const [status, setStatus] = useState<StatusCompra>('AGUARDANDO_PAGAMENTO');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPix();
  }, [compraId]);

  async function carregarPix() {
    setCarregando(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/checkout/${compraId}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao gerar QR Code');

      const data = await res.json();
      setPix(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar dados do Pix');
    } finally {
      setCarregando(false);
    }
  }

  async function copiarCodigo() {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.brCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function enviarComprovante() {
    if (!arquivo) return;
    setEnviando(true);

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('comprovante', arquivo);

      const res = await fetch(`${API_URL}/checkout/${compraId}/comprovante`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao enviar comprovante');

      setStatus('AGUARDANDO_CONFIRMACAO');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p className="p-6 text-center">Carregando QR Code...</p>;
  if (!pix) return <p className="p-6 text-center">Não foi possível carregar o Pix.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      {status === 'AGUARDANDO_PAGAMENTO' && (
        <>
          <h1 className="text-xl font-bold mb-4 text-center">Pague com Pix</h1>

          <img
            src={pix.qrCodeBase64}
            alt="QR Code Pix"
            className="mx-auto mb-4 w-64 h-64"
          />

          <button
            onClick={copiarCodigo}
            className="w-full bg-green-600 text-white py-2 rounded mb-4"
          >
            {copiado ? 'Copiado!' : 'Copiar código Pix'}
          </button>

          <div className="border-t pt-4">
            <label className="block mb-2 font-medium">
              Envie o comprovante de pagamento:
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              className="mb-3 w-full"
            />
            <button
              onClick={enviarComprovante}
              disabled={!arquivo || enviando}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Enviar comprovante'}
            </button>
          </div>
        </>
      )}

      {status === 'AGUARDANDO_CONFIRMACAO' && (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">Comprovante enviado ✅</h2>
          <p className="text-gray-600">
            Aguardando aprovação do pagamento pelo administrador. Você será
            notificado assim que for confirmado.
          </p>
        </div>
      )}

      {status === 'PAGO' && (
        <div className="text-center text-green-700">
          <h2 className="text-lg font-bold">Pagamento confirmado! 🎉</h2>
        </div>
      )}

      {status === 'REJEITADO' && (
        <div className="text-center text-red-700">
          <h2 className="text-lg font-bold">Comprovante rejeitado</h2>
          <p className="text-gray-600">
            Verifique o comprovante e envie novamente, ou entre em contato.
          </p>
        </div>
      )}
    </div>
  );
}