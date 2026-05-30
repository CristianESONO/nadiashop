import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ShieldCheck, Truck, CheckCircle, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

export const Route = createFileRoute('/checkout')({
  component: Checkout,
})

const formatXAF = (amount: number) =>
  new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount)

const FREE_SHIPPING_THRESHOLD = 9500

import { useServerFn } from '@tanstack/react-start'
import { createOrder, createCheckoutSession } from '../db/functions'

function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const createOrderFn = useServerFn(createOrder)
  const createSessionFn = useServerFn(createCheckoutSession)
  
  // Handle Stripe Redirection Results
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const isSuccess = searchParams.get('success') === 'true'
  const isCanceled = searchParams.get('canceled') === 'true'

  const [confirmed, setConfirmed] = useState(isSuccess)
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', address: '', city: '', postal: '' })

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 2900
  const grandTotal = totalPrice + shipping

  useEffect(() => {
    if (isSuccess) {
      clearCart()
      setOrderNumber('#BEBE-STRIPE-OK')
    }
  }, [isSuccess])

  useEffect(() => {
    if (items.length === 0 && !confirmed && !isSuccess && !isCanceled) {
      const timer = setTimeout(() => {
        if (items.length === 0 && !confirmed) navigate({ to: '/carrito' })
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [items.length, confirmed, isSuccess, isCanceled])

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Create Order in DB
      await createOrderFn({
        data: {
          user: form,
          items: items.map(i => ({ 
            id: i.id, 
            name: i.name, 
            price: Number(i.price), 
            qty: Number(i.qty), 
            size: i.size || 'U' 
          })),
          total: Number(grandTotal)
        }
      })

      // 2. Create Stripe Session
      const session = await createSessionFn({
        data: items.map(i => ({
          id: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.qty),
          image: i.image,
        }))
      })

      // 3. Redirect to Stripe
      if (session.url) {
        window.location.href = session.url
      } else {
        throw new Error('No redirection URL')
      }
    } catch (err) {
      console.error(err)
      alert('Error al procesar el pago')
    } finally {
      // setLoading(false) // Not needed if redirecting
    }
  }

  if (confirmed) {
    return (
      <div className="page-wrap py-32 px-4 flex flex-col items-center text-center space-y-8 rise-in">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold">¡Pedido Confirmado!</h1>
          <p className="text-[var(--text-soft)]">Hemos recibido tu pedido. Recibirás un email de confirmación en breve.</p>
        </div>
        <div className="bg-white border border-[var(--line)] rounded-2xl p-6 text-sm text-[var(--text-soft)] max-w-sm w-full">
          <p className="font-bold text-[var(--text-main)] mb-2">Número de pedido</p>
          <p className="font-mono text-lg">{orderNumber}</p>
        </div>
        <Link to="/" className="bg-[var(--text-main)] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform no-underline">
          Volver a la tienda
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page-wrap py-32 px-4 flex flex-col items-center text-center space-y-6">
        <ShoppingBag size={48} className="text-gray-200" />
        <h2 className="text-xl font-serif font-bold text-[var(--text-main)]">No hay nada que pagar</h2>
        <p className="text-[var(--text-soft)]">Tu carrito está vacío.</p>
        <Link to="/catalogo" className="bg-[var(--text-main)] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm no-underline">
          Ver Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="page-wrap py-16 px-4">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold mb-2">Finalizar Pedido</h1>
        <p className="text-[var(--text-soft)] text-sm">Introduce tus datos de envío y método de pago.</p>
        
        {isCanceled && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3">
            <span className="font-bold">⚠ El pago fue cancelado.</span> Por favor, inténtalo de nuevo.
          </div>
        )}
      </div>

      <form onSubmit={handlePay}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact & Shipping */}
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="font-bold text-lg">Datos de contacto</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Nombre</label>
                  <input required value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="Ana" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Apellidos</label>
                  <input required value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="García" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="ana@ejemplo.com" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-bold text-lg">Dirección de envío</h2>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Dirección</label>
                <input required value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="Rue 1.783, Bastos" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Ciudad</label>
                  <input required value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="Yaoundé" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Código Postal</label>
                  <input value={form.postal} onChange={e => setForm(f => ({...f, postal: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="BP 1234" />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-bold text-lg">Pago seguro</h2>
              <div className="p-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center gap-4">
                <ShieldCheck className="text-[var(--accent)] flex-shrink-0" size={32} />
                <div>
                  <p className="font-bold text-sm">Pago procesado con Stripe</p>
                  <p className="text-xs text-[var(--text-soft)] mt-1">Tu información está protegida con cifrado SSL de 256 bits.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-[var(--line)] rounded-2xl p-8 h-fit space-y-6 sticky top-24">
            <h3 className="font-bold text-lg">Tu pedido</h3>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-soft)]">Talla {item.size} × {item.qty}</p>
                  </div>
                  <p className="font-medium text-sm whitespace-nowrap">{formatXAF(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-soft)]">
                <span>Subtotal</span><span>{formatXAF(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span className="flex items-center gap-1"><Truck size={14} /> Envío</span>
                <span>{shipping === 0 ? 'Gratis' : formatXAF(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t text-[var(--text-main)] text-base">
                <span>Total</span><span>{formatXAF(grandTotal)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--text-main)] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Confirmar y Pagar'}
            </button>
            <Link to="/carrito" className="block text-center text-xs text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors no-underline">
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
