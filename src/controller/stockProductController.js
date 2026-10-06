/** @format */
import { prisma } from '../config/db.js';

const getAllStockProduct = async (req, res) => {
  try {
    const stockProducts = await prisma.stock_Product.findMany({
      include: {
        product: true,
        productVariant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({
      success: true,
      data: stockProducts,
    });
  } catch (error) {
    console.error('Get all stock error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const getStockProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const stockProduct = await prisma.stock_Product.findUnique({
      where: { id },
      include: {
        product: true,
        productVariant: true,
      },
    });
    if (!stockProduct) {
      return res.status(404).json({
        success: false,
        error: 'Stock Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: stockProduct,
    });
  } catch (error) {
    console.error('Get stock by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server is error ...!',
    });
  }
};

const createStockProduct = async (req, res) => {
  const { productId, productVariantId, stock_in = 0, stock_out = 0 } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not exists',
      });
    }
    const lastStock = await prisma.stock_Product.findFirst({
      where: {
        productId,
        productVariantId: productVariantId || null,
      },
      orderBy: { createdAt: 'desc' },
    });

    const previousBalance = lastStock ? lastStock.balance : 0;
    const newBalance = previousBalance + Number(stock_in) - Number(stock_out);

    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock balance!',
      });
    }
    const newStockProduct = await prisma.stock_Product.create({
      data: {
        productId,
        productVariantId: productVariantId || null,
        stock_in: Number(stock_in),
        stock_out: Number(stock_out),
        balance: newBalance,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: newStockProduct,
    });
  } catch (error) {
    console.error('Create stock error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const updateStockProduct = async (req, res) => {
  const { id } = req.params;
  const { productId, productVariantId, stock_in, stock_out, balance } =
    req.body;

  try {
    const stockProduct = await prisma.stock_Product.update({
      where: { id: id },
      data: {
        productId,
        productVariantId: productVariantId || null,
        stock_in,
        stock_out,
        balance,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Update stock product successfully',
      data: stockProduct,
    });
  } catch (error) {
    console.error('Update stock error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const deleteStockProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.stock_Product.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete stock product successfully..!',
    });
  } catch (error) {
    console.error('Delete stock error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server is error..!',
    });
  }
};

export {
  getAllStockProduct,
  getStockProductById,
  createStockProduct,
  updateStockProduct,
  deleteStockProduct,
};
