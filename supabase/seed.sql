-- Seed des categorías
INSERT INTO categories (name, slug, description) VALUES
('Recién Nacido', 'recien-nacido', 'Ropa delicada para bebés de 0 a 6 meses.'),
('Bebé Niña', 'bebe-nina', 'Colección elegante para niñas de 6 a 36 meses.'),
('Bebé Niño', 'bebe-nino', 'Colección moderna para niños de 6 a 36 meses.');

-- Seed de productos
DO $$
DECLARE
  cat_recien_nacido UUID;
  cat_nina UUID;
  cat_nino UUID;
  prod_id UUID;
BEGIN
  SELECT id INTO cat_recien_nacido FROM categories WHERE slug = 'recien-nacido';
  SELECT id INTO cat_nina FROM categories WHERE slug = 'bebe-nina';
  SELECT id INTO cat_nino FROM categories WHERE slug = 'bebe-nino';

  -- Producto 1: Recién Nacido
  INSERT INTO products (name, slug, description, price, category_id, is_featured)
  VALUES ('Conjunto Punto Algodón Orgánico', 'conjunto-punto-organico', 'Conjunto de dos piezas tejido en algodón 100% orgánico.', 45.00, cat_recien_nacido, true)
  RETURNING id INTO prod_id;

  INSERT INTO product_variants (product_id, size, color, stock_quantity, sku)
  VALUES 
    (prod_id, '0-3M', 'Crema', 10, 'RECN-03-CRM'),
    (prod_id, '3-6M', 'Crema', 15, 'RECN-36-CRM');

  -- Producto 2: Niña
  INSERT INTO products (name, slug, description, price, category_id, is_featured)
  VALUES ('Vestido Flores Pastel', 'vestido-flores-pastel', 'Vestido ligero con estampado floral y forro de algodón.', 39.90, cat_nina, true)
  RETURNING id INTO prod_id;

  INSERT INTO product_variants (product_id, size, color, stock_quantity, sku)
  VALUES 
    (prod_id, '6-12M', 'Rosa', 8, 'NINA-612-ROS'),
    (prod_id, '12-18M', 'Rosa', 12, 'NINA-1218-ROS');

  -- Producto 3: Niño
  INSERT INTO products (name, slug, description, price, category_id, is_featured)
  VALUES ('Peto Lino Azul Aire', 'peto-lino-azul', 'Peto clásico de lino con tirantes ajustables.', 42.50, cat_nino, true)
  RETURNING id INTO prod_id;

  INSERT INTO product_variants (product_id, size, color, stock_quantity, sku)
  VALUES 
    (prod_id, '6-12M', 'Azul', 5, 'NINO-612-AZU'),
    (prod_id, '12-18M', 'Azul', 10, 'NINO-1218-AZU');

END $$;
