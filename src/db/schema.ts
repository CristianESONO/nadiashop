import { pgTable, text, timestamp, uuid, decimal, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: text('role', { enum: ['client', 'admin'] }).default('client'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  size: text('size').notNull(),
  color: text('color').notNull(),
  stockQuantity: integer('stock_quantity').default(0),
  sku: text('sku').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id),
  status: text('status', { enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] }).default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  stripePaymentId: text('stripe_payment_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
