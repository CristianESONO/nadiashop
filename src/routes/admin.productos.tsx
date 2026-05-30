import { createFileRoute } from '@tanstack/react-router'
import { Edit, Plus, Trash2, Search, X, Save, Upload } from 'lucide-react'
import { useServerFn } from '@tanstack/react-start'
import { getProducts, deleteProduct, createProduct, updateProduct, uploadImage, getCategories } from '../db/functions'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/admin/productos')({
  component: AdminProducts,
})

const formatXAF = (amount: number) =>
  new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount)

const EMPTY_FORM = { 
  name: '', 
  slug: '', 
  description: '', 
  price: '', 
  categoryId: '', 
  imageUrl: '',
  sizes: '' 
}

function AdminProducts() {
  const fetchProducts = useServerFn(getProducts)
  const fetchCategories = useServerFn(getCategories)
  const deleteFn = useServerFn(deleteProduct)
  const createFn = useServerFn(createProduct)
  const updateFn = useServerFn(updateProduct)

  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const uploadFn = useServerFn(uploadImage)

  const reload = () => {
    setLoading(true)
    Promise.all([
      fetchProducts({ data: undefined }),
      fetchCategories({ data: undefined })
    ]).then(([pData, cData]) => {
      setProducts(pData || [])
      setCategories(cData || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { reload() }, [])

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (p: any) => {
    setEditProduct(p)
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price.toString(),
      categoryId: p.categoryId || '',
      imageUrl: p.images?.[0]?.url || '',
      sizes: p.variants?.map((v: any) => v.size).join(', ') || ''
    })
    setShowModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      // Instant preview
      setForm(f => ({ ...f, imageUrl: base64 }))
      
      try {
        const res = await uploadFn({ data: base64 })
        // Replace with final server URL
        setForm(f => ({ ...f, imageUrl: res.url }))
      } catch (err) {
        alert('Error al subir imagen')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteFn({ data: id })
    reload()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean)
      }

      if (editProduct) {
        await updateFn({ data: { ...payload, id: editProduct.id } })
      } else {
        await createFn({ data: payload })
      }
      setShowModal(false)
      reload()
    } catch (error) {
      console.error('Error saving product', error)
      alert('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[var(--text-main)]">Gestión de Productos</h2>
          <p className="text-[var(--text-soft)] text-sm mt-1">Añade, edita o elimina productos de tu catálogo.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--text-main)] text-white px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-transform active:scale-95 hover:scale-105 cursor-pointer"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center gap-4">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/50">
              <th className="px-8 py-5 font-bold">Producto</th>
              <th className="px-8 py-5 font-bold">Categoría</th>
              <th className="px-8 py-5 font-bold">Precio</th>
              <th className="px-8 py-5 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400">Cargando productos...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400">No hay productos disponibles.</td></tr>
            ) : (
              filtered.map((p) => {
                const imageUrl = p.images?.[0]?.url || "/product_body_knitted_1780008015946.png";
                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          <img 
                            src={imageUrl} 
                            alt={p.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.target as any).src = "/product_body_knitted_1780008015946.png" }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[var(--text-main)] block">{p.name}</span>
                          <span className="text-xs text-gray-400">{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-600">{p.category?.name || 'Sin categoría'}</td>
                    <td className="px-8 py-5 font-medium">{formatXAF(p.price)}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-[var(--accent)] transition-colors cursor-pointer" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6 my-8">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl font-bold">{editProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <input 
                  type="file" 
                  id="product-image" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="product-image"
                  className="relative group w-32 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-[var(--accent)] cursor-pointer"
                >
                  {form.imageUrl ? (
                    <>
                      <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={24} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subir Imagen</span>
                    </div>
                  )}
                </label>
              </div>

              {[
                { label: 'Nombre del producto', key: 'name', placeholder: 'Body Algodón Orgánico' },
                { label: 'Slug (URL)', key: 'slug', placeholder: 'body-algodon-organico' },
                { label: 'Descripción', key: 'description', placeholder: 'Descripción del producto...' },
                { label: 'Precio (XAF)', key: 'price', placeholder: '14490' },
                { label: 'Categoría', key: 'categoryId', type: 'select' },
                { label: 'Tallas (separadas por comas)', key: 'sizes', placeholder: '0-3m, 3-6m, 6-9m, 12m' },
                { label: 'URL de la imagen (o ruta)', key: 'imageUrl', placeholder: '/product_body_knitted_1780008015946.png' },
              ].map(({ label, key, placeholder, type }: any) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">{label}</label>
                  {type === 'select' ? (
                    <select
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="">Selecciona una colección...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : key === 'description' ? (
                    <textarea
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                    />
                  ) : (
                    <input
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--text-main)] text-white py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <><Save size={16} /> Guardar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
