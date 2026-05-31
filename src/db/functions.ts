// Client-side mock functions to allow SPA deployment without Node.js errors
export const getProducts = async () => {
  return [
    {
      id: 1,
      name: "Conjunto Algodón Orgánico", // Changed from nombre
      description: "Suave conjunto de dos piezas para recién nacido en algodón 100% orgánico.", // Changed from descripcion
      price: 15000, // Changed from precio
      slug: "conjunto-algodon",
      category: { name: "Recién Nacido" }, // Changed from string to object
      images: [
        { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800" }
      ],
      variants: [
        { size: "0-3M", stock: 10 },
        { size: "3-6M", stock: 5 }
      ],
      isFeatured: true
    },
    {
      id: 2,
      name: "Manta de Apego Oso",
      description: "Dulce manta de seguridad con cabeza de peluche, perfecta para calmar al bebé.",
      price: 8500,
      slug: "manta-oso",
      category: { name: "Accesorios" },
      images: [
        { url: "https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=800" }
      ],
      variants: [
        { size: "Talla Única", stock: 20 }
      ],
      isFeatured: false
    },
    {
      id: 3,
      name: "Set de Biberones Premium",
      description: "Set de 3 biberones anticólicos con tetina de silicona ultra suave.",
      price: 12000,
      slug: "set-biberones",
      category: { name: "Accesorios" },
      images: [
        { url: "https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=800" }
      ],
      variants: [
        { size: "150ml", stock: 15 },
        { size: "250ml", stock: 8 }
      ],
      isFeatured: true
    }
  ]
}

export const getProductBySlug = async (slug: string) => {
  const products = await getProducts()
  return products.find(p => p.slug === slug)
}

export const getCategories = async () => [
  { id: 1, name: "Recién Nacido" },
  { id: 2, name: "Bebé Niña" },
  { id: 3, name: "Bebé Niño" },
  { id: 4, name: "Accesorios" }
]

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
