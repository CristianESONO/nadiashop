import { db } from './index';
import * as schema from './schema';

async function seed() {
  console.log('🌱 Empezando el seed...');

  // Limpiar tablas
  await db.delete(schema.sessions);
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.productVariants);
  await db.delete(schema.productImages);
  await db.delete(schema.products);
  await db.delete(schema.categories);
  await db.delete(schema.profiles);

  // Categorías
  const [catRecienNacido] = await db.insert(schema.categories).values([
    { name: 'Recién Nacido', slug: 'recien-nacido', description: 'Ropa delicada para bebés de 0 a 6 meses.' },
    { name: 'Bebé Niña', slug: 'bebe-nina', description: 'Colección elegante para niñas de 6 a 36 meses.' },
    { name: 'Bebé Niño', slug: 'bebe-nino', description: 'Colección moderna para niños de 6 a 36 meses.' },
  ]).returning();

  // Productos
  const [prodKnitted] = await db.insert(schema.products).values([
    { 
      name: 'Conjunto Punto Algodón Orgánico', 
      slug: 'conjunto-punto-organico', 
      description: 'Conjunto de dos piezas tejido en algodón 100% orgánico.', 
      price: '45.00', 
      categoryId: catRecienNacido.id,
      isFeatured: true 
    },
  ]).returning();

  // Variantes
  await db.insert(schema.productVariants).values([
    { productId: prodKnitted.id, size: '0-3M', color: 'Crema', stockQuantity: 10, sku: 'RECN-03-CRM' },
    { productId: prodKnitted.id, size: '3-6M', color: 'Crema', stockQuantity: 15, sku: 'RECN-36-CRM' },
  ]);

  console.log('✅ Seed completado con éxito.');
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
