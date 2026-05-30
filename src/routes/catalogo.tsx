import { createFileRoute } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getProducts } from '../db/functions'
import { z } from 'zod'

const productSearchSchema = z.object({
  category: z.string().optional().catch('Todo'),
  q: z.string().optional().catch(''),
})

export const Route = createFileRoute('/catalogo')({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: Catalogo,
})

const CATEGORIES = ['Todo', 'Novedades', 'Recién Nacido', 'Bebé Niña', 'Bebé Niño', 'Accesorios']
const SIZES = ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M', '24-36M']

const formatXAF = (amount: number) =>
  new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount)

function Catalogo() {
  const search = Route.useSearch()
  const { category: initialCategory, q } = search
  const navigate = useNavigate()
  const fetchProducts = useServerFn(getProducts)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'Todo')
  const [activeSizes, setActiveSizes] = useState<string[]>([])

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory)
  }, [initialCategory])

  const changeCategory = (cat: string) => {
    setActiveCategory(cat)
    navigate({ 
      search: { ...search, category: cat === 'Todo' ? undefined : cat } as any,
      replace: true 
    })
  }

  const clearQuery = () => {
    navigate({ 
      search: { ...search, q: undefined } as any,
      replace: true
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchProducts({ data: undefined }).then((data) => {
      setProducts(data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const toggleSize = (size: string) => {
    setActiveSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const filtered = products.filter(p => {
    // Category Filter
    let catMatch = false
    if (activeCategory === 'Todo') catMatch = true
    else if (activeCategory === 'Novedades') catMatch = p.isFeatured
    else catMatch = p.category?.name === activeCategory

    // Search Query Filter
    const queryMatch = !q || 
      p.name.toLowerCase().includes(q.toLowerCase()) || 
      p.description.toLowerCase().includes(q.toLowerCase())

    // Size Filter
    const productSizes = p.variants?.map((v: any) => v.size) || []
    const sizeMatch = activeSizes.length === 0 || activeSizes.some(s => productSizes.includes(s))
    
    return catMatch && queryMatch && sizeMatch
  })

  return (
    <main className="page-wrap px-4 py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">Colecciones</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => changeCategory(cat)}
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl text-left transition-colors ${
                    activeCategory === cat
                      ? 'bg-[var(--text-main)] text-white font-bold'
                      : 'text-[var(--text-soft)] hover:text-[var(--text-main)] hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">Tallas</h3>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-2 py-1.5 text-[0.7rem] border rounded transition-colors ${
                    activeSizes.includes(size)
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white font-bold'
                      : 'border-[var(--line)] hover:border-[var(--accent)] text-[var(--text-soft)]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {activeSizes.length > 0 && (
              <button
                onClick={() => setActiveSizes([])}
                className="mt-3 text-xs text-[var(--text-soft)] hover:text-red-500 transition-colors"
              >
                Limpiar tallas ×
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-serif text-3xl font-bold text-[var(--text-main)]">
                {activeCategory === 'Todo' ? 'Nuestro Catálogo' : activeCategory}
                <span className="ml-3 text-base font-normal text-[var(--text-soft)]">({filtered.length})</span>
              </h1>
              {q && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[var(--text-soft)]">Búsqueda: <span className="font-bold text-[var(--text-main)]">"{q}"</span></p>
                  <button onClick={clearQuery} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full hover:bg-red-50 text-[var(--text-soft)] hover:text-red-500 transition-colors">
                    Limpiar ×
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
              <SlidersHorizontal size={16} />
              <span>Ordenar por: <span className="font-bold text-[var(--text-main)]">Novedades</span></span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin"></div>
              <p className="text-[var(--text-soft)] font-medium animate-pulse">Cargando catálogo...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--text-soft)] mb-4">No hay productos para {q ? `la búsqueda "${q}"` : 'los filtros seleccionados'}.</p>
              <button 
                onClick={() => { 
                  setActiveCategory('Todo'); 
                  setActiveSizes([]); 
                  if (q) clearQuery();
                }} 
                className="text-sm font-bold underline"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 stagger">
              {filtered.map((product) => {
                const imageUrl = product.images?.[0]?.url || "/product_body_knitted_1780008015946.png";
                return (
                  <Link key={product.id} to="/productos/$slug" params={{ slug: product.slug }} className="product-card group cursor-pointer no-underline block">
                    <div className="relative aspect-[3/4] img-zoom rounded-xl overflow-hidden bg-[#f5f5f5] flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).src = "/product_body_knitted_1780008015946.png" }}
                      />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-10 bg-white/90 backdrop-blur-sm py-3 text-xs font-bold uppercase tracking-widest text-[var(--text-main)] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 rounded-full text-center">
                        Ver detalles
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-[var(--text-main)]">{product.name}</h4>
                      <p className="mt-1 text-sm text-[var(--text-soft)] tracking-tight">{formatXAF(product.price)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
