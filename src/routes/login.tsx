import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { loginAdmin } from '../db/functions'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const loginAction = useServerFn(loginAdmin)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await loginAction({ data: { email, password } })
      if (result?.success) {
        // Since we are using simple localStorage for SPA auth bypass (or cookie check)
        localStorage.setItem('admin_session', 'true')
        navigate({ to: '/admin' })
      } else {
        setError('Credenciales incorrectas.')
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--bg-base)] page-wrap p-4">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-[var(--line)] rise-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--cream)] border border-[var(--line)] mb-6 text-[var(--accent)] shadow-sm">
            <Lock size={28} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text-main)] mb-2">Acceso Admin</h1>
          <p className="text-[var(--text-soft)] text-sm">Ingresa tus credenciales para gestionar Nadia's Shop.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)] ml-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="admin@nadiashop.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)] ml-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--text-main)] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? 'Verificando...' : 'Entrar al Panel'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors no-underline">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
