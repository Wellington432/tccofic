'use client';

import { useEffect, useState } from 'react';

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
  status: string;
  total: number;
  comprovante_url: string;
  comprovante_enviado_em: string;
  usuario: Usuario;
  itens: ItemCompra[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // ex: http://localhost:3333

export default function PagamentosPendentesPage() {
  const [pedidos, setPedidos] = useState<Compra[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    setCarregando(true);
    try {
      const token = localStorage.getItem('token'); // ajusta pra como você guarda o token

      const res = await fetch(`${API_URL}/pedidospendentes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao buscar pedidos');

      const data = await res.json();
      setPedidos(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar pedidos pendentes');
    } finally {
      setCarregando(false);
    }
  }

  async function aprovar(id: string) {
    if (!confirm('Confirma a aprovação deste pagamento?')) return;

    setProcessandoId(id);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/aprovarpagamento/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao aprovar');
      }

      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setProcessandoId(null);
    }
  }

  async function rejeitar(id: string) {
    if (!confirm('Confirma a rejeição deste pagamento?')) return;

    setProcessandoId(id);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/rejeitarpagamento/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao rejeitar');
      }

      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setProcessandoId(null);
    }
  }

  if (carregando) return <p className="p-6">Carregando pedidos...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Pagamentos aguardando confirmação</h1>

      {pedidos.length === 0 && (
        <p className="text-gray-500">Nenhum pagamento pendente no momento.</p>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">{pedido.usuario.nome}</p>
                <p className="text-sm text-gray-500">{pedido.usuario.email}</p>
              </div>
              <p className="font-bold text-lg">
                R$ {Number(pedido.total).toFixed(2)}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Comprovante enviado em:{' '}
              {new Date(pedido.comprovante_enviado_em).toLocaleString('pt-BR')}
            </p>

            <a
              href={pedido.comprovante_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm block mb-4"
            >
              Ver comprovante
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => aprovar(pedido.id)}
                disabled={processandoId === pedido.id}
                className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50"
                >
                {processandoId === pedido.id ? 'Processando...' : 'Aprovar'}
              </button>
              <button
                onClick={() => rejeitar(pedido.id)}
                disabled={processandoId === pedido.id}
                className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
              >
                {processandoId === pedido.id ? 'Processando...' : 'Rejeitar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}