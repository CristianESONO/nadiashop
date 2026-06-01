import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getOrders, updateOrderStatus } from '../db/functions'
import { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'
import { Package, Check, Truck, XCircle, Clock } from 'lucide-react'

export const Route = createFileRoute('/admin/pedidos')({
  component: AdminOrders,
})


function AdminOrders() {
  const fetchOrders = useServerFn(getOrders)
  const updateStatus = useServerFn(updateOrderStatus)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    setLoading(true)
    const data = await fetchOrders()
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    await updateStatus({ id: orderId, status: newStatus })
    loadOrders()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider"><Check size={12} /> Pagado</span>
      case 'shipped':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider"><Truck size={12} /> Enviado</span>
      case 'delivered':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider"><Package size={12} /> Entregado</span>
      case 'cancelled':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider"><XCircle size={12} /> Cancelado</span>
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider"><Clock size={12} /> Pendiente</span>
    }
  }

  const { formatPrice } = useSettings()

  return (
    <div className="rise-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-main)]">Gestión de Pedidos</h2>
          <p className="text-sm text-[var(--text-soft)]">Monitoriza y actualiza el estado de las compras en tiempo real.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">ID Pedido</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Cliente</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Total</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Estado</th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-[var(--text-soft)] italic">No hay pedidos registrados aún.</td>
                </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium text-[var(--text-main)]">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--text-main)]">{order.user?.fullName || 'Invitado'}</td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--text-main)]">{formatPrice(Number(order.totalAmount))}</td>
                  <td className="px-6 py-5">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <select 
                      className="text-xs border-none bg-gray-100 rounded-lg p-2 font-bold focus:ring-0 cursor-pointer"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
