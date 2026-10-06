/** @format */

import { prisma } from '../config/db.js';

const getAllCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: 'Category not found' });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Server error retrieving category' });
  }
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newcategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    return res.status(201).json({
      success: true,
      data: newcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server create fail..!',
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: 'Category not found' });
    }
    const newUpdateCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    return res.status(200).json({
      success: true,
      data: newUpdateCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Server error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete category successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Delete category fail',
    });
  }
};

export {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
