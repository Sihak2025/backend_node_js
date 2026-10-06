/** @format */

import { prisma } from '../config/db.js';

const getAllPaymentMethod = async (req,res) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany();
    if (!paymentMethods) {
      return res.status(404).json({
        success: false,
        message: 'Not found payment method',
      });
    }

    return res.status(200).json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....',
    });
  }
};

const getPaymentMethodById = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentMethods = await prisma.paymentMethod.findUnique({
      where: { id },
    });
    if (!paymentMethods) {
      return res.status(404).json({
        success: false,
        mssage: 'Payment not found....!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Get payment method by Id successfully',
      data: paymentMethods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const createPaymentMethod = async (req, res) => {
  const { name, description, image } = req.body;
  try {
    const newPaymentMethod = await prisma.paymentMethod.create({
      data: {
        name,
        description,
        image,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Create payment method successfully..!',
      data: newPaymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const updatePaymentMethod = async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  try {
    const paymentMethods = await prisma.paymentMethod.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        image: image,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Update payment method successfully',
      data: paymentMethods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error',
    });
  }
};

const deletePaymentMethod = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.paymentMethod.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete payment method successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error..!',
    });
  }
};

export {
  getAllPaymentMethod,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
