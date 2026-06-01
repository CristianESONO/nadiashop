import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getClients } from '../db/functions'
import { useState, useEffect } from 'react'
import { Users, Search } from 'lucide-react'

export const Route = createFileRoute('/admin/clientes')({
  component: AdminClientes,
})

// currency formatting provided by SettingsContext when needed

function AdminClientes() {
  const fetchClients = useServerFn(getClients)
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchClients().then(data => {
      setClients(data || [])
      setLoading(false)
    })
  }, [])

  const filteredClients = clients.filter(c => 
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-main)]">Gestión de Clientes</h2>
          <p className="text-[var(--text-soft)] text-sm mt-1">{clients.length} clientes registrados</p>
        </div>
      </div>

      <div className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center gap-4">
        <Search size={20} className="text-gray-400" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none" 
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th className="px-8 py-5 font-bold">Cliente</th>
              <th className="px-8 py-5 font-bold">Email</th>
              <th className="px-8 py-5 font-bold">Rol</th>
              <th className="px-8 py-5 font-bold text-right">Registrado el</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400">Cargando clientes...</td></tr>
            ) : filteredClients.length === 0 ? (
              <tr><td colSpan={4} className="px-8 py-20 text-center text-[var(--text-soft)] italic">No se encontraron clientes.</td></tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--soft-pink)] flex items-center justify-center flex-shrink-0">
                        <Users size={16} className="text-[var(--accent)]" />
                      </div>
                      <span className="font-bold text-[var(--text-main)]">{client.fullName || 'Sin nombre'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-600 font-mono text-xs">{client.email}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${client.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {client.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-gray-500">
                    {new Date(client.createdAt).toLocaleDateString()}
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
