import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  size?: string
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, delta: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.id === newItem.id && i.size === newItem.size)
      if (existing) {
        return current.map(i => 
          (i.id === newItem.id && i.size === newItem.size) 
            ? { ...i, qty: i.qty + newItem.qty } 
            : i
        )
      }
      return [...current, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems(current => current.filter(i => i.id !== id))
  }

  const updateQty = (id: string, delta: number) => {
    setItems(current => 
      current.map(i => 
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0)
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
