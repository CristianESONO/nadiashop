import { createFileRoute } from '@tanstack/react-router'
import { Globe, Bell, Shield, Check } from 'lucide-react'
import { useState } from 'react'
import { useSettings, type Currency, type Language } from '../context/SettingsContext'

export const Route = createFileRoute('/admin/configuracion')({
  component: AdminConfiguracion,
})

function AdminConfiguracion() {
  const { settings, updateSettings } = useSettings()

  const [storeName, setStoreName] = useState(settings.storeName)
  const [email, setEmail] = useState(settings.email)
  const [currency, setCurrency] = useState<Currency>(settings.currency)
  const [language, setLanguage] = useState<Language>(settings.language)
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail)
  const [newPassword, setNewPassword] = useState('')
  const [notifications, setNotifications] = useState(settings.notifications)
  const [saved, setSaved] = useState(false)

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    updateSettings({ storeName, email, currency, language, adminEmail, notifications })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const notifLabels: { key: keyof typeof notifications; label: string }[] = [
    { key: 'newOrders', label: 'Nuevos pedidos' },
    { key: 'newClients', label: 'Clientes registrados' },
    { key: 'lowStock', label: 'Stock bajo' },
    { key: 'weeklySummary', label: 'Resumen semanal' },
  ]

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
              <input
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Moneda</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="XAF">FCFA – Franco CFA (XAF)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="USD">$ Dólar (USD)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Email de contacto</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Idioma de la interfaz</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
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
          {notifLabels.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer" onClick={() => toggleNotification(key)}>
                <input type="checkbox" checked={notifications[key]} readOnly className="sr-only peer" />
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
            <input
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Nueva contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
            saved
              ? 'bg-green-600 text-white scale-100'
              : 'bg-[var(--text-main)] text-white hover:scale-105'
          }`}
        >
          {saved ? <><Check size={18} /> Guardado</> : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
