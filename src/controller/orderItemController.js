
import { prisma } from '../config/db.js';

// ==========================================
// GET ALL ORDER ITEMS
// ==========================================
const getAllOrderItem = async (req, res) => {
  try {
    const orderItems = await prisma.order_Item.findMany({
      include: {
        product: true,
        order: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: orderItems,
    });
  } catch (error) {
    console.error('Get order items error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

// ==========================================
// GET ORDER ITEM BY ID
// ==========================================
const getOrderItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const orderItem = await prisma.order_Item.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
        order: true,
      },
    });

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        error: 'Order item not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: orderItem,
    });
  } catch (error) {
    console.error('Get order item error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

// ==========================================
// CREATE ORDER ITEM
// ==========================================
const createOrderItem = async (req, res) => {
  const { productId, orderId, quantity } = req.body;

  try {
    const qty = Number(quantity);

    if (!productId || !orderId || !Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        error: 'productId, orderId and valid quantity are required.',
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product does not exist.',
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order does not exist.',
      });
    }

    const newOrderItem = await prisma.order_Item.create({
      data: {
        productId,
        orderId,
        quantity: qty,
        price: product.price,
      },
    });

    // Recalculate order total
    const allItems = await prisma.order_Item.findMany({
      where: {
        orderId,
      },
    });

    const newTotalAmount = allItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0,
    );

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        totalAmout: newTotalAmount,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Order item created successfully!',
      data: newOrderItem,
    });
  } catch (error) {
    console.error('Create order item error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

// ==========================================
// UPDATE ORDER ITEM
// ==========================================
const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0.',
      });
    }

    const orderItem = await prisma.order_Item.findUnique({
      where: {
        id,
      },
    });

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        error: 'Order item not found.',
      });
    }

    const updatedOrderItem = await prisma.order_Item.update({
      where: {
        id,
      },
      data: {
        quantity: qty,
      },
    });

    // Recalculate order total
    const allItems = await prisma.order_Item.findMany({
      where: {
        orderId: orderItem.orderId,
      },
    });

    const newTotalAmount = allItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0,
    );

    await prisma.order.update({
      where: {
        id: orderItem.orderId,
      },
      data: {
        totalAmout: newTotalAmount,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Order item updated successfully!',
      data: updatedOrderItem,
    });
  } catch (error) {
    console.error('Update order item error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

// ==========================================
// DELETE ORDER ITEM
// ==========================================
const deleteOrderItem = async (req, res) => {
  const { id } = req.params;

  try {
    const orderItem = await prisma.order_Item.findUnique({
      where: {
        id,
      },
    });

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        error: 'Order item not found.',
      });
    }

    await prisma.order_Item.delete({
      where: {
        id,
      },
    });

    // Recalculate total
    const allItems = await prisma.order_Item.findMany({
      where: {
        orderId: orderItem.orderId,
      },
    });

    const newTotalAmount = allItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0,
    );

    await prisma.order.update({
      where: {
        id: orderItem.orderId,
      },
      data: {
        totalAmout: newTotalAmount,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Order item deleted successfully!',
    });
  } catch (error) {
    console.error('Delete order item error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

export {
  getAllOrderItem,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
