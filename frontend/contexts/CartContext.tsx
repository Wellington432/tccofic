'use client'

import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react'
import { api, getApiErrorMessage } from '@/lib/api'
import { Compra } from '@/lib/types'
import { useAuth } from './AuthContext'

interface CartContextData {
  cart: Compra | null
  itemCount: number
  loading: boolean
  refresh: () => Promise<void>
  addItem: (id_produto: string, quantidade?: number) => Promise<void>
  updateItem: (id: string, quantidade: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth()
  const [cart, setCart] = useState<Compra | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get<Compra>('/carrinho')
      setCart(data)
    } catch (err) {
      console.error(getApiErrorMessage(err, 'Não foi possível carregar o carrinho.'))
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isHydrated) return
    refresh()
  }, [isHydrated, isAuthenticated, refresh])

  async function addItem(id_produto: string, quantidade = 1) {
    let id_compra = cart?.id
    if (!id_compra) {
      const { data } = await api.get<Compra>('/carrinho')
      id_compra = data.id
    }
    await api.post('/novopedido', { id_compra, id_produto, quantidade })
    await refresh()
  }

  async function updateItem(id: string, quantidade: number) {
    await api.put('/atualizapedido', { id, quantidade })
    await refresh()
  }

  async function removeItem(id: string) {
    await api.delete('/deletapedido', { data: { id } })
    await refresh()
  }

  const itemCount = cart?.itens.reduce((soma, item) => soma + item.quantidade, 0) ?? 0

  return (
    <CartContext.Provider
      value={{ cart, itemCount, loading, refresh, addItem, updateItem, removeItem }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
