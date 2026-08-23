export type TipoUsuario = 'ADM' | 'CLIENTE'
export type StatusCompra =
  | 'CARRINHO'
  | 'AGUARDANDO_PAGAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA'
  | 'ENTREGUE'
export type TipoEntrega = 'RETIRADA' | 'ENTREGA'

export interface Usuario {
  id: string
  nome: string
  email: string
  tipo: TipoUsuario
}

export interface AuthResponse extends Usuario {
  token: string
}

export interface Categoria {
  id: string
  nome: string
}

export interface Produto {
  id: string
  nome: string
  preco: string
  unidade: string
  descricao: string
  banner: string
  estoque: number
  id_categoria?: string
  categoria?: Categoria
}

export interface ItemCompra {
  id: string
  quantidade: number
  preco_unitario: string | null
  id_compra: string
  id_produto: string
  produto: Produto
}

export interface RelatorioVendas {
  periodo_dias: number
  receita_total: number
  pedidos_finalizados: number
  pedidos_aguardando_pagamento: number
  pedidos_cancelados: number
  receita_por_dia: { data: string; total: number }[]
  produtos_mais_vendidos: { id_produto: string; nome: string; quantidade: number }[]
}

export interface Compra {
  id: string
  status: StatusCompra
  tipo_entrega: TipoEntrega
  endereco: string | null
  forma_pagamento: string | null
  total: string
  mp_preference_id: string | null
  mp_payment_id: string | null
  criado_em: string
  id_usuario: string
  itens: ItemCompra[]
}

export interface ApiErrorBody {
  error?: string
}
