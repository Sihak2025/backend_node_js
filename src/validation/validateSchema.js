/** @format */

import { z } from 'zod';

// user validate
const registerSchema = z.object({
  name: z
    .string()
    .min(5, 'name must be the bigger 4 word')
    .max(30, 'You can put name only 30 word'),

  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(4, 'Your password must be bigger than 3')
    .max(25, 'You can input your password only 25 word'),
  role: z
    .enum(['admin', 'customer'], {
      errorMap: () => ({
        message: 'Role must be either customer or admin',
      }),
    })
    .default('customer'),
});

const categorySchema = z.object({
  name: z.string().max(50).optional(),
  description: z.string().max(100).optional(),
});

const updateProductSchema = z.object({
  name: z.string().max(50).optional(),
  price: z.number().min(0).optional(),
  image: z.string().url('Invalid image URL').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  description: z.string().max(200).optional(),
});

const stockProductSchema = z.object({
  productId: z.string().uuid('Invalid product ID').optional(),
  stock_in: z.number().min(0).optional(),
  stock_out: z.number().min(0).optional(),
  balance: z.number().min(0).optional(),
});

const orderSchema = z.object({
  userId: z.string().uuid('Invalid').optional(),
  totalAmount: z.number().min(0).optional(),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        productVariantId: z
          .string()
          .uuid('Invalid product variant ID')
          .optional(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'Order must contain at least one item.'),
});

const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid Id').optional(),
  orderId: z.string().uuid('Invalid Id').optional(),
  quantity: z.number().min(0),
  price: z.number().min(0),
});

const paymentMethodSchema = z.object({
  name: z.string().max(50).optional(),
  description: z.string().max(100).optional(),
  image: z.string().url().optional(),
});

const paymentSchema = z.object({
  paymentMethodId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  amount: z.number().min(0),
  status: z.enum(['process', 'fail', 'success']).optional(),
});

const productVariantSchema = z.object({
  productId: z.string().uuid().optional(),
  size: z.string().max(10).optional(),
});
export {
  registerSchema,
  categorySchema,
  updateProductSchema,
  stockProductSchema,
  productVariantSchema,
  orderSchema,
  createOrderSchema,
  orderItemSchema,
  paymentMethodSchema,
  paymentSchema,
};
