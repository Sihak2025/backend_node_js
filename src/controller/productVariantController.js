/** @format */

import { prisma } from '../config/db.js';

const getAllProductVariant = async (req, res) => {
  try {
    const productVariant = await prisma.product_variant.findMany({
      include: {
        product: true,
      },
    });
    if (!productVariant) {
      return res.status(404).json({
        success: false,
        message: 'Not found product variant...!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Get all product variant successfully...!',
      data: productVariant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....!',
    });
  }
};

const getProductVariantById = async (req, res) => {
  const { id } = req.params;
  try {
    const productVariant = await prisma.product_variant.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!productVariant) {
      return res.status(404).json({
        success: false,
        message: 'Product variant does not exists',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Get product variant By ID',
      data: productVariant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....!',
    });
  }
};

const createProductVariant = async (req, res) => {
  const { productId, size } = req.body;
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product does not exists',
      });
    }

    const newProductVariant = await prisma.product_variant.create({
      data: {
        productId,
        size,
      },
      include: {
        product: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Create product variant successfully..!',
      data: newProductVariant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....!',
    });
  }
};

const updateProductVariant = async (req, res) => {
  const { id } = req.params;
  const { productId, size } = req.body;
  try {
    const productVariant = await prisma.product_variant.update({
      where: { id },
      data: {
        productId,
        size,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Update product variant successfully..!',
      data: productVariant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....!',
    });
  }
};

const deleteProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product_variant.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete product variant successfully..!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....!',
    });
  }
};

export {
  getAllProductVariant,
  getProductVariantById,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
};
