import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getAdminStats } from '../db/functions'
import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminIndex,
})

const formatXAF = (amount: number) =>
  new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount)

function AdminIndex() {
  const fetchStats = useServerFn(getAdminStats)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const stats = [
    { name: 'Ventas Totales', value: formatXAF(data?.totalSales || 0), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Pedidos Totales', value: (data?.totalOrders || 0).toString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Productos', value: (data?.totalProducts || 0).toString(), icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Clientes', value: (data?.totalClients || 0).toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-10 rise-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-main)]">Resumen General</h2>
          <p className="text-sm text-[var(--text-soft)]">Bienvenido de nuevo, aquí tienes lo que está pasando hoy.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Última actualización</p>
          <p className="text-sm font-medium">Hace 5 minutos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
            <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="font-serif text-xl font-bold mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {loading ? (
              <p className="text-sm text-gray-400">Cargando actividad...</p>
            ) : data?.recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--text-soft)] italic">No hay actividad reciente.</p>
            ) : (
              data?.recentActivity.map((activity: any, i: number) => (
                <div key={activity.id} className="flex items-center gap-4 group">
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--text-main)]">Nuevo pedido de {activity.user}</p>
                    <p className="text-xs text-[var(--text-soft)]">
                      {new Date(activity.date).toLocaleDateString()} • {formatXAF(activity.amount)}
                    </p>
                  </div>
                  <Link 
                    to="/admin/pedidos" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-[var(--accent)] hover:underline no-underline"
                  >
                    Ver pedidos
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="bg-[var(--text-main)] text-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h3 className="font-serif text-2xl font-bold">Plan de Marketing</h3>
            <p className="text-white/70 text-sm leading-relaxed">Aumenta tus ventas un 30% activando la nueva campaña de accesorios para bebés.</p>
            <button className="w-full bg-white text-[var(--text-main)] py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">Activar Ahora</button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
