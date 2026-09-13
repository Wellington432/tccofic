'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock3, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminShell from '@/components/admin/AdminShell';
import { api, getApiErrorMessage } from '@/lib/api';

interface ItemCompra {
  id: string;
  quantidade: number;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface Compra {
  id: string;
  status: 'AGUARDANDO_CONFIRMACAO' | 'REJEITADO' | string;
  total: number;
  comprovante_url: string;
  comprovante_enviado_em: string;
  usuario: Usuario;
  itens: ItemCompra[];
}

export default function PagamentosPendentesPage() {
  const [pedidos, setPedidos] = useState<Compra[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await api.get<Compra[]>('/pedidospendentes');
      setPedidos(data);
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Não foi possível carregar os pagamentos.'));
    } finally {
      setCarregando(false);
    }
  }

  async function aprovar(id: string) {
    if (!confirm('Confirma a aprovação deste pagamento?')) return;

    setProcessandoId(id);
    try {
      await api.patch(`/aprovarpagamento/${id}`);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao aprovar pagamento.'));
    } finally {
      setProcessandoId(null);
    }
  }

  async function rejeitar(id: string) {
    if (!confirm('Confirma a rejeição deste pagamento?')) return;

    setProcessandoId(id);
    try {
      await api.patch(`/rejeitarpagamento/${id}`);
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'REJEITADO' } : p))
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao rejeitar pagamento.'));
    } finally {
      setProcessandoId(null);
    }
  }

  const pendentes = pedidos.filter((p) => p.status === 'AGUARDANDO_CONFIRMACAO');
  const recusados = pedidos.filter((p) => p.status === 'REJEITADO');

  return (
    <AdminShell title="Pagamentos">
      {erro && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {erro}
        </div>
      )}

      {carregando && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-card border border-card-border animate-pulse" />
          ))}
        </div>
      )}

      {!carregando && !erro && (
        <div className="flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock3 className="w-[18px] h-[18px] text-warning-ink" />
              <h2 className="font-bold text-lg text-ink-800">Pendentes</h2>
              <span className="text-xs font-medium text-ink-400">({pendentes.length})</span>
            </div>

            {pendentes.length === 0 ? (
              <p className="text-sm text-ink-400">Nenhum pagamento pendente no momento.</p>
            ) : (
              <div className="space-y-4">
                {pendentes.map((pedido) => (
                  <div key={pedido.id} className="bg-white border border-card-border rounded-card p-4 shadow-card">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <p className="font-medium text-ink-800">{pedido.usuario.nome}</p>
                        <p className="text-sm text-ink-500">{pedido.usuario.email}</p>
                      </div>
                      <p className="font-bold text-lg text-horta-dark">
                        R$ {Number(pedido.total).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-sm text-ink-500 mb-3">
                      Comprovante enviado em:{' '}
                      {new Date(pedido.comprovante_enviado_em).toLocaleString('pt-BR')}
                    </p>

                    <a
                      href={pedido.comprovante_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-horta-dark hover:underline text-sm mb-4"
                    >
                      Ver comprovante
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex gap-2">
                      <button
                        onClick={() => aprovar(pedido.id)}
                        disabled={processandoId === pedido.id}
                        className="flex-1 bg-horta-dark text-white py-2.5 rounded-input hover:bg-[#0f4023] transition-colors disabled:opacity-50"
                      >
                        {processandoId === pedido.id ? 'Processando...' : 'Aprovar'}
                      </button>
                      <button
                        onClick={() => rejeitar(pedido.id)}
                        disabled={processandoId === pedido.id}
                        className="flex-1 bg-brand-red text-white py-2.5 rounded-input hover:bg-brand-red/90 transition-colors disabled:opacity-50"
                      >
                        {processandoId === pedido.id ? 'Processando...' : 'Rejeitar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-[18px] h-[18px] text-brand-red" />
              <h2 className="font-bold text-lg text-ink-800">Recusados</h2>
              <span className="text-xs font-medium text-ink-400">({recusados.length})</span>
            </div>

            {recusados.length === 0 ? (
              <p className="text-sm text-ink-400">Nenhum pagamento recusado.</p>
            ) : (
              <div className="space-y-3">
                {recusados.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-white border border-card-border rounded-card p-4 opacity-80"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <p className="font-medium text-ink-800">{pedido.usuario.nome}</p>
                        <p className="text-sm text-ink-500">{pedido.usuario.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-ink-600">R$ {Number(pedido.total).toFixed(2)}</p>
                        <span className="px-2.5 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                          Recusado
                        </span>
                      </div>
                    </div>
                    <a
                      href={pedido.comprovante_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-ink-500 hover:underline text-xs mt-2"
                    >
                      Ver comprovante
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}
