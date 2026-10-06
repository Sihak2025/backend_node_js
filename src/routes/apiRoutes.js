/** @format */

import express from 'express';
import {
  register,
  login,
  logout,
  getAllUser,
  deleteUser,
} from '../controller/authcontroller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from '../controller/categoryController.js';
import {
  categorySchema,
  createOrderSchema,
  orderItemSchema,
  orderSchema,
  paymentMethodSchema,
  paymentSchema,
  registerSchema,
  stockProductSchema,
  updateProductSchema,
  productVariantSchema,
} from '../validation/validateSchema.js';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from '../controller/productController.js';
import {
  createStockProduct,
  deleteStockProduct,
  getAllStockProduct,
  getStockProductById,
  updateStockProduct,
} from '../controller/stockProductController.js';
import {
  createOrder,
  deleteOrder,
  getAllOrder,
  getOrderById,
  updateOrder,
} from '../controller/orderController.js';
import {
  createOrderItem,
  deleteOrderItem,
  getAllOrderItem,
  getOrderItemById,
  updateOrderItem,
} from '../controller/orderItemController.js';
import {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethod,
  getPaymentMethodById,
  updatePaymentMethod,
} from '../controller/paymentMethodController.js';
import {
  createPayment,
  deletePayment,
  getAllPayment,
  getPaymentById,
  updatePayment,
} from '../controller/paymentController.js';
import {
  createProductVariant,
  deleteProductVariant,
  getAllProductVariant,
  getProductVariantById,
  updateProductVariant,
} from '../controller/productVariantController.js';
import { getDashboard } from '../controller/dashboardController.js';
import { getShoppingHistory } from '../controller/shoppingHistoryController.js';

const router = express.Router();

// public API
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', login);

// API for admin and customer
router.get('/categories', getAllCategory);
router.get('/products', getAllProduct);
router.get('/orders', getAllOrder);
router.get('/order_items', getAllOrderItem);
router.get('/paymentMethods', getAllPaymentMethod);
router.get('/payments', getAllPayment);

router.post('/logout', authMiddleware, logout);
// API User
router.get('/users', authMiddleware, checkRole(['admin']), getAllUser);
router.delete('/users/:id', authMiddleware, checkRole(['admin']), deleteUser);

//API Category
router.post(
  '/categories',
  authMiddleware,
  validateRequest(categorySchema),
  checkRole(['admin']),
  createCategory,
);
router.get('/categories/:id', getCategoryById);
router.put(
  '/categories/:id',
  authMiddleware,
  validateRequest(categorySchema),
  checkRole(['admin']),
  updateCategory,
);
router.delete(
  '/categories/:id',
  authMiddleware,
  checkRole(['admin']),
  deleteCategory,
);

// API product
router.get('/products/:id', getProductById);
router.post('/products', authMiddleware, checkRole(['admin']), createProduct);
router.put(
  '/products/:id',
  authMiddleware,
  checkRole(['admin']),
  validateRequest(updateProductSchema),
  updateProduct,
);
router.delete(
  '/products/:id',
  authMiddleware,
  checkRole(['admin']),
  deleteProduct,
);

// API stock Product
router.get(
  '/stock_products',
  authMiddleware,
  checkRole(['admin']),
  getAllStockProduct,
);
router.get(
  '/stock_products/:id',
  authMiddleware,
  checkRole(['admin']),
  getStockProductById,
);
router.post(
  '/stock_products',
  authMiddleware,
  checkRole(['admin']),
  createStockProduct,
);
router.put(
  '/stock_products/:id',
  authMiddleware,
  checkRole(['admin']),
  validateRequest(stockProductSchema),
  updateStockProduct,
);
router.delete(
  '/stock_products/:id',
  authMiddleware,
  checkRole(['admin']),
  deleteStockProduct,
);

//API Order
router.get(
  '/orders/:id',
  authMiddleware,
  checkRole(['customer']),
  getOrderById,
);
router.post(
  '/orders',
  authMiddleware,
  checkRole(['customer']),
  validateRequest(createOrderSchema),
  createOrder,
);
router.put(
  '/orders/:id',
  authMiddleware,
  checkRole(['customer']),
  validateRequest(orderSchema),
  updateOrder,
);
router.delete(
  '/orders/:id',
  authMiddleware,
  checkRole(['customer']),
  deleteOrder,
);

// API Order_Item
router.get(
  '/order_items/:id',
  authMiddleware,
  checkRole(['customer']),
  getOrderItemById,
);
router.post(
  '/order_items',
  authMiddleware,
  checkRole(['customer']),
  createOrderItem,
);
router.put(
  '/order_items/:id',
  authMiddleware,
  checkRole(['customer']),
  validateRequest(orderItemSchema),
  updateOrderItem,
);
router.delete(
  '/order_items/:id',
  authMiddleware,
  checkRole(['customer']),
  deleteOrderItem,
);

// Payment Method
router.get(
  '/paymentMethods/:id',
  authMiddleware,
  checkRole(['admin']),
  getPaymentMethodById,
);
router.post(
  '/paymentMethods',
  authMiddleware,
  checkRole(['admin']),
  validateRequest(paymentMethodSchema),
  createPaymentMethod,
);
router.put(
  '/paymentMethods/:id',
  authMiddleware,
  checkRole(['admin']),
  validateRequest(paymentMethodSchema),
  updatePaymentMethod,
);
router.delete(
  '/paymentMethods/:id',
  authMiddleware,
  checkRole(['admin']),
  deletePaymentMethod,
);

// API payment
router.get(
  '/payments/:id',
  authMiddleware,
  checkRole(['customer']),
  getPaymentById,
);
router.post(
  '/payments',
  authMiddleware,
  checkRole(['customer']),
  createPayment,
);
router.put(
  '/payments/:id',
  authMiddleware,
  checkRole(['customer']),
  validateRequest(paymentSchema),
  updatePayment,
);
router.delete(
  '/payments/:id',
  authMiddleware,
  checkRole(['customer']),
  deletePayment,
);

//Product Variant
router.get('/product_variants', getAllProductVariant);
router.get('/product_variants/:id', getProductVariantById);
router.post(
  '/product_variants',
  authMiddleware,
  checkRole(['admin']),
  validateRequest(productVariantSchema),
  createProductVariant,
);
router.put(
  '/product_variants/:id',
  authMiddleware,
  checkRole(['admin']),
  validateRequest(productVariantSchema),
  updateProductVariant,
);
router.delete(
  '/product_variants/:id',
  authMiddleware,
  checkRole(['admin']),
  deleteProductVariant,
);

// Shopping History
router.get(
  '/shopping_history',
  authMiddleware,
  checkRole(['customer']),
  getShoppingHistory,
);
router.get('/dashboards', authMiddleware, checkRole(['admin']), getDashboard);
export { router };
