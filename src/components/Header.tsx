import { Link } from '@tanstack/react-router'
import { ShoppingBag, User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useSettings } from '../context/SettingsContext'

export default function Header() {
  const { settings } = useSettings()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center justify-between py-3 sm:py-5">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-serif font-bold tracking-tight text-[var(--text-main)] no-underline"
          >
            {settings.storeName}
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Inicio
            </Link>
            <Link
              to="/catalogo"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Colecciones
            </Link>
            <Link
              to="/catalogo"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Novedades
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors">
            <User size={20} />
          </button>
          <Link
            to="/carrito"
            className="p-2 text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors relative"
          >
            <ShoppingBag size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
