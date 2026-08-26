'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { getStoredAuth } from '@/lib/api';
import PrimaryButton from '@/components/PrimaryButton';

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
      const token = getStoredAuth()?.token;

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
      const token = getStoredAuth()?.token;

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

  if (carregando) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-horta-dark animate-spin" />
      </div>
    );
  }

  if (!pix) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center px-6">
        <p className="text-ink-500 text-center">Não foi possível carregar o Pix.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white rounded-card border border-card-border shadow-card p-6">
        {status === 'AGUARDANDO_PAGAMENTO' && (
          <>
            <h1 className="text-h2 font-bold text-horta-dark text-center mb-5">Pague com Pix</h1>

            <img
              src={pix.qrCodeBase64}
              alt="QR Code Pix"
              className="mx-auto mb-5 w-56 h-56 rounded-input border border-card-border"
            />

            <PrimaryButton onClick={copiarCodigo} className="mb-6">
              {copiado ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                'Copiar código Pix'
              )}
            </PrimaryButton>

            <div className="border-t border-card-border pt-5">
              <label className="block mb-2 text-body-sm font-medium text-ink-700">
                Envie o comprovante de pagamento:
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                className="mb-4 w-full text-body-sm text-ink-600 file:mr-3 file:py-2 file:px-3 file:rounded-input file:border-0 file:bg-horta-medium/10 file:text-horta-dark file:font-medium"
              />
              <PrimaryButton onClick={enviarComprovante} disabled={!arquivo} loading={enviando}>
                Enviar comprovante
              </PrimaryButton>
            </div>
          </>
        )}

        {status === 'AGUARDANDO_CONFIRMACAO' && (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-horta-medium mx-auto mb-3" />
            <h2 className="text-h3 font-bold text-ink-800 mb-2">Comprovante enviado</h2>
            <p className="text-ink-600 text-body-sm">
              Aguardando aprovação do pagamento pelo administrador. Você será
              notificado assim que for confirmado.
            </p>
          </div>
        )}

        {status === 'PAGO' && (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-horta-medium mx-auto mb-3" />
            <h2 className="text-h3 font-bold text-horta-dark">Pagamento confirmado!</h2>
          </div>
        )}

        {status === 'REJEITADO' && (
          <div className="text-center py-4">
            <XCircle className="w-10 h-10 text-brand-red mx-auto mb-3" />
            <h2 className="text-h3 font-bold text-brand-red mb-2">Comprovante rejeitado</h2>
            <p className="text-ink-600 text-body-sm">
              Verifique o comprovante e envie novamente, ou entre em contato.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
