/** @format */

import { prisma } from '../config/db.js';

const getAllProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server get err..!',
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        category: true,

        productVariants: {
          include: {
            stock_product: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },

        stock_product: {
          where: {
            productVariantId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.',
      });
    }

    // General product stock
    const latestStock = product.stock_product[0];

    const stock = latestStock ? latestStock.balance : 0;

    // Variant stock
    const variants = product.productVariants.map((variant) => {
      const latestVariantStock = variant.stock_product[0];

      return {
        id: variant.id,
        size: variant.size,
        productId: variant.productId,

        stock: latestVariantStock ? latestVariantStock.balance : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Get product successfully',
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,

        stock,

        variants,
      },
    });
  } catch (error) {
    console.error('Get product by ID error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const createProduct = async (req, res) => {
  const { name, categoryId, price, description, image } = req.body;
  try {
    const categories = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categories) {
      return res.status(404).json({
        success: false,
        error: 'Category not exists',
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
        image,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
      include: {
        category: true,
      },
    });
    return res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Serevr is error...!',
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, categoryId, description } = req.body;

  try {
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        price: price,
        stock: stock,
        description: description,
        categoryId: categoryId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Update product error',
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete Product success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

export {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
