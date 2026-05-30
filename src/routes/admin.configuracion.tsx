import { createFileRoute } from '@tanstack/react-router'
import { Globe, Bell, Shield } from 'lucide-react'

export const Route = createFileRoute('/admin/configuracion')({
  component: AdminConfiguracion,
})

function AdminConfiguracion() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-serif text-3xl font-bold text-[var(--text-main)]">Configuración</h2>
        <p className="text-[var(--text-soft)] text-sm mt-1">Gestiona los ajustes generales de tu tienda.</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
          <Globe size={20} className="text-[var(--accent)]" />
          <h3 className="font-bold text-[var(--text-main)]">Información de la Tienda</h3>
        </div>
        <div className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Nombre de la tienda</label>
              <input defaultValue="Boutique Bebé" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Moneda</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]">
                <option value="EUR">€ Euro (EUR)</option>
                <option value="USD">$ Dólar (USD)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Email de contacto</label>
              <input defaultValue="hola@boutiquebebe.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Idioma</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]">
                <option>Español</option>
                <option>Français</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
          <Bell size={20} className="text-[var(--accent)]" />
          <h3 className="font-bold text-[var(--text-main)]">Notificaciones</h3>
        </div>
        <div className="p-8 space-y-4">
          {[
            ['Nuevos pedidos', true],
            ['Clientes registrados', true],
            ['Stock bajo', false],
            ['Resumen semanal', true],
          ].map(([label, defaultChecked]) => (
            <div key={label as string} className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-main)]">{label as string}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked as boolean} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[var(--accent)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100">
          <Shield size={20} className="text-[var(--accent)]" />
          <h3 className="font-bold text-[var(--text-main)]">Seguridad</h3>
        </div>
        <div className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Email de administrador</label>
            <input defaultValue="admin@nadiashop.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Nueva contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
          <button className="bg-[var(--text-main)] text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
