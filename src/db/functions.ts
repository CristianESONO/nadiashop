// Client-side mock functions to allow SPA deployment without Node.js errors
export const getProducts = async () => {
  return [
    {
      id: 1,
      nombre: "Conjunto Algodón Orgánico",
      descripcion: "Suave conjunto de dos piezas para recién nacido en algodón 100% orgánico.",
      precio: 15000,
      imagenUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800",
      slug: "conjunto-algodon",
      categoria: "Ropa"
    },
    {
      id: 2,
      nombre: "Manta de Apego Oso",
      descripcion: "Dulce manta de seguridad con cabeza de peluche, perfecta para calmar al bebé.",
      precio: 8500,
      imagenUrl: "https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=800",
      slug: "manta-oso",
      categoria: "Accesorios"
    },
    {
      id: 3,
      nombre: "Set de Biberones Premium",
      descripcion: "Set de 3 biberones anticólicos con tetina de silicona ultra suave.",
      precio: 12000,
      imagenUrl: "https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=800",
      slug: "set-biberones",
      categoria: "Alimentación"
    }
  ]
}

export const getProductBySlug = async (slug: string) => {
  const products = await getProducts()
  return products.find(p => p.slug === slug)
}

export const getCategories = async () => ["Ropa", "Accesorios", "Alimentación", "Higiene"]

export const loginAdmin = async () => ({ success: true })
export const getAdminStats = async () => ({ totalOrders: 12, totalRevenue: 150000, totalProducts: 3 })
export const getProductsWithStock = async () => getProducts()
export const getOrders = async () => []
export const getClients = async () => []
export const createCheckoutSession = async () => ({ url: '#' })
export const createOrder = async () => ({ success: true })
export const updateOrderStatus = async () => {}
export const deleteProduct = async () => {}
export const createProduct = async () => {}
export const updateProduct = async () => {}
export const uploadImage = async () => "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800"
