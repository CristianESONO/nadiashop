import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const Route = createFileRoute('/carrito')({
  component: Carrito,
})

const formatXAF = (amount: number) =>
  new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount)

const FREE_SHIPPING_THRESHOLD = 9500

function Carrito() {
  const { items, removeItem, updateQty, totalPrice } = useCart()

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 2900
  const grandTotal = totalPrice + shipping

  return (
    <div className="page-wrap py-16 px-4">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold mb-2">Tu Carrito</h1>
        <p className="text-[var(--text-soft)] text-sm">{items.length} artículo{items.length !== 1 ? 's' : ''}</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 space-y-6">
          <ShoppingBag size={48} className="mx-auto text-gray-300" />
          <p className="text-[var(--text-soft)] text-lg">Tu carrito está vacío.</p>
          <Link to="/catalogo" className="inline-flex items-center gap-2 bg-[var(--text-main)] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest no-underline hover:scale-105 transition-transform">
            <ArrowLeft size={16} /> Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-[var(--line)] rounded-2xl p-5 flex items-center gap-5">
                <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-sm text-[var(--text-main)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-soft)]">Talla: {item.size}</p>
                  <p className="font-medium text-sm">{formatXAF(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-[var(--line)] rounded-full px-3 py-1">
                    <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 hover:text-black transition-colors font-bold cursor-pointer">−</button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, +1)} className="text-gray-500 hover:text-black transition-colors font-bold cursor-pointer">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-[var(--line)] rounded-2xl p-8 h-fit space-y-6 sticky top-24">
            <h3 className="font-bold text-lg">Resumen del pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[var(--text-soft)]">
                <span>Subtotal</span>
                <span>{formatXAF(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-soft)]">
                <span>Envío</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Gratis' : formatXAF(shipping)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-[var(--text-main)]">
                <span>Total</span>
                <span>{formatXAF(grandTotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[var(--text-main)] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform no-underline"
            >
              Ir al Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/catalogo" className="block text-center text-xs text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors no-underline mt-2">
              ← Continuar comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
