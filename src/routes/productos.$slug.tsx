import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingBag, ArrowLeft, Star, Shield, Truck, Heart, ZoomIn, Check, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useCart } from '../context/CartContext'
import { useServerFn } from '@tanstack/react-start'
import { getProductBySlug } from '../db/functions'

export const Route = createFileRoute('/productos/$slug')({
  component: ProductDetail,
})

function ProductDetail() {
  const { slug } = Route.useParams()
  const fetchProduct = useServerFn(getProductBySlug)
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    fetchProduct({ data: slug }).then((data) => {
      setProduct(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])


  const handleAddToCart = () => {
    if (!product) return
    if (product.variants?.length > 0 && !selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: qty,
      size: selectedSize,
      image: product.images?.[0]?.url || '/product_body_knitted_1780008015946.png'
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin"></div>
        <p className="text-[var(--text-soft)] font-medium animate-pulse">Cargando producto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="p-6 bg-gray-50 rounded-full text-gray-400">
          <ShoppingCart size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-bold">Producto no encontrado</h2>
          <p className="text-[var(--text-soft)]">Lo sentimos, no pudimos encontrar el producto que buscas.</p>
        </div>
        <Link to="/catalogo" className="bg-[var(--text-main)] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform no-underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const sizes = product.variants?.map((v: any) => v.size) || []

  return (
    <div className="page-wrap py-12 px-4">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/catalogo" className="flex items-center gap-2 text-sm text-[var(--text-soft)] hover:text-[var(--text-main)] no-underline transition-colors">
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden relative group bg-gray-50 flex items-center justify-center">
            <img 
              src={product.images?.[0]?.url || '/product_body_knitted_1780008015946.png'} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-white/90 p-3 rounded-full shadow-lg"><ZoomIn size={18} /></button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8 lg:py-4">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{product.category?.name || 'Tienda'}</p>
            <h1 className="font-serif text-4xl font-bold text-[var(--text-main)]">{product.name}</h1>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
              <span className="text-sm text-[var(--text-soft)] ml-1">(24 reseñas)</span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-main)]">{useSettings().formatPrice(product.price)}</p>
          </div>

          {sizes.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-bold">Talla</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-[var(--text-main)] text-white border-transparent'
                        : 'border-[var(--line)] text-[var(--text-soft)] hover:border-[var(--text-main)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[var(--text-soft)] text-sm leading-relaxed">{product.description}</p>

          {/* Qty + CTA */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border border-[var(--line)] rounded-full px-4 py-2">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="font-bold text-gray-500 hover:text-black cursor-pointer">−</button>
              <span className="w-6 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="font-bold text-gray-500 hover:text-black cursor-pointer">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all cursor-pointer ${
                added ? 'bg-green-600 text-white' : 'bg-[var(--text-main)] text-white hover:scale-[1.02]'
              }`}
            >
              {added ? (
                <><Check size={18} /> Añadido</>
              ) : (
                <><ShoppingBag size={18} /> Añadir al carrito</>
              )}
            </button>
            <button className="p-4 border border-[var(--line)] rounded-full hover:bg-red-50 hover:border-red-200 transition-colors">
              <Heart size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--line)]">
            <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
              <Shield size={18} className="text-[var(--accent)]" /> Algodón de alta calidad
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
              <Truck size={18} className="text-[var(--accent)]" /> Envío gratis + 9 500 FCFA
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
