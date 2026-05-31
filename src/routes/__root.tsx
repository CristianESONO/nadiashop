import { HeadContent, Scripts, Outlet, createRootRoute, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { CartProvider, useCart } from '../context/CartContext'
import Footer from '../components/Footer'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <html>
        <head><HeadContent /></head>
        <body><div className="p-10 text-center font-bold text-xl">404 - Página no encontrada</div><Scripts /></body>
      </html>
    )
  }
})

function RootComponent() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')
  const { totalItems } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/catalogo', search: (old: any) => ({ ...old, q: searchQuery.trim() }) as any })
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Public header hidden on admin routes */}
      {!isAdmin && (
        <header className="sticky top-0 z-50 island-shell border-b-0 m-4 rounded-3xl mx-4 md:mx-auto max-w-5xl w-[calc(100%-2rem)]">
          <nav className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main)] no-underline">
                Nadia's Shop
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/catalogo" className="nav-link text-sm font-medium tracking-wide transition-colors">Catálogo</Link>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-1 animate-in slide-in-from-right-4 duration-300">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-32 sm:w-48 placeholder:text-gray-400"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)}>
                    <X size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Search size={20} className="text-[var(--text-soft)]" />
                </button>
              )}
              <Link to="/carrito" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={20} className="text-[var(--text-soft)]" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--accent)] text-white text-[10px] flex items-center justify-center rounded-full font-bold animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu size={20} className="text-[var(--text-soft)]" />
              </button>
            </div>
          </nav>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAdmin && <Footer />}
    </div>
  )
}
