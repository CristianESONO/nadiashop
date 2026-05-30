import { createFileRoute, Outlet, Link, useLocation, redirect, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('admin_session') !== 'true') {
        throw redirect({
          to: '/login',
        })
      }
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    navigate({ to: '/login' })
  }
  
  const menuItems = [
    { name: 'Panel Control', icon: LayoutDashboard, path: '/admin', exact: true },
    { name: 'Productos', icon: Package, path: '/admin/productos', exact: false },
    { name: 'Pedidos', icon: ShoppingCart, path: '/admin/pedidos', exact: false },
    { name: 'Clientes', icon: Users, path: '/admin/clientes', exact: false },
    { name: 'Configuración', icon: Settings, path: '/admin/configuracion', exact: false },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="font-serif text-xl font-bold text-[var(--text-main)] no-underline">
            Boutique <span className="text-[var(--accent)]">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <Link 
                key={item.name}
                to={item.path as any}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive
                    ? 'bg-[var(--text-main)] text-white shadow-lg shadow-gray-200' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[var(--text-main)]'
                }`}
              >
                <item.icon size={18} />
                {item.name}
                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
