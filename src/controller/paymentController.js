/** @format */

import { prisma } from '../config/db.js';

const getAllPayment = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    if (!payments) {
      return res.status(404).json({
        success: false,
        message: 'Not found payment...!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Get all payment successfully...!',
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error....!',
    });
  }
};

const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const payments = await prisma.payment.findUnique({
      where: { id },
    });
    if (!payments) {
      return res.status(404).json({
        success: false,
        message: 'Payment does not exists',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Get payment By ID',
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};


const createPayment = async (req, res) => {
  try {
    const { paymentMethodId, orderId } = req.body;

    if (!paymentMethodId || !orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and payment method are required.',
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found',
      });
    }

    const result = await prisma.payment.create({
      data: {
        paymentMethodId,
        orderId,
        amount: order.totalAmout,
        status: 'success',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Payment successful!',
      data: result,
    });
  } catch (error) {
    console.error('Payment & Stock Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server is error during payment processing...!',
    });
  }
};

const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { paymentMethodId, orderId, amount, status } = req.body;
  try {
    const payments = await prisma.payment.update({
      where: { id: id },
      data: {
        paymentMethodId: paymentMethodId,
        orderId: orderId,
        amount: amount,
        status: status,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Update payment successfully',
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error..!',
    });
  }
};

const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.payment.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete payment successfully...!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

export {
  getAllPayment,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
