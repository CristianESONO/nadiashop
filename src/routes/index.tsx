import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useServerFn } from '@tanstack/react-start'
import { getProducts } from '../db/functions'

export const Route = createFileRoute('/')(({
  component: Home,
}))


function Home() {
  const fetchProducts = useServerFn(getProducts)
  const [featured, setFeatured] = useState<any[]>([])

  useEffect(() => {
  fetchProducts().then((data) => {
      // Show first 3 products as featured
      setFeatured(data?.slice(0, 3) || [])
    })
  }, [])
  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/hero_baby_premium_1780007336762.png" alt="Bebé Premium" className="w-full h-full object-cover brightness-[0.9]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        </div>
        <div className="page-wrap relative z-10 text-white space-y-6 rise-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} className="text-[var(--accent-soft)]" />
            Nueva Colección Primavera
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight max-w-2xl">
            Elegancia desde <br /> el primer día
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-lg font-light leading-relaxed">
            Descubre nuestra selección exclusiva de ropa para bebés, confeccionada con los materiales más suaves y orgánicos del mundo.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/catalogo" className="bg-white text-[var(--text-main)] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-3 hover:scale-105 transition-transform no-underline">
              Explorar Catálogo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="page-wrap flex flex-wrap justify-between gap-8 py-8 border-y border-[var(--line)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--soft-pink)] rounded-2xl text-[var(--text-main)]"><Truck size={24} /></div>
          <div><p className="font-bold text-sm">Envío Express</p><p className="text-xs text-[var(--text-soft)]">Gratis en órdenes &gt; 9 500 XAF</p></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--soft-blue)] rounded-2xl text-[var(--text-main)]"><ShieldCheck size={24} /></div>
          <div><p className="font-bold text-sm">Pago Seguro</p><p className="text-xs text-[var(--text-soft)]">Stripe &amp; Mobile Money</p></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--beige)] rounded-2xl text-[var(--text-main)]"><Star size={24} /></div>
          <div><p className="font-bold text-sm">Calidad Premium</p><p className="text-xs text-[var(--text-soft)]">100% Algodón Orgánico</p></div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-wrap space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-4xl font-bold">Favoritos de la Temporada</h2>
          <p className="text-[var(--text-soft)] max-w-xl mx-auto">Nuestras piezas más queridas, diseñadas para el máximo confort y estilo.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.length > 0 ? (
            featured.map((item) => {
              const imageUrl = item.images?.[0]?.url || "/product_body_knitted_1780008015946.png";
              return (
                <Link key={item.slug} to="/productos/$slug" params={{ slug: item.slug }} className="product-card group cursor-pointer no-underline block">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden relative bg-gray-50 flex items-center justify-center">
                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                      <span className="bg-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">Ver más</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-tight">{item.name}</h3>
                    <p className="text-sm text-[var(--text-soft)]">{useSettings().formatPrice(item.price)}</p>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-400">
              <p>Cargando productos destacados...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
