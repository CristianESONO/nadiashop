-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Perfiles de usuario y roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los perfiles" 
  ON profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Categorías de productos
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver las categorías" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Solo los admins pueden gestionar categorías" 
  ON categories FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Productos
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver los productos" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Solo los admins pueden gestionar productos" 
  ON products FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Variantes (Talla/Color)
CREATE TABLE product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver las variantes" 
  ON product_variants FOR SELECT 
  USING (true);

-- Imágenes de productos
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver las imágenes" 
  ON product_images FOR SELECT 
  USING (true);

-- Pedidos
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus propios pedidos" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios pedidos" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Líneas de pedido
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus líneas de pedido" 
  ON order_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));
