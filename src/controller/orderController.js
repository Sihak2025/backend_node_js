/** @format */

import { prisma } from '../config/db.js';

const getAllOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        order_item: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        order_item: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order items are required.',
      });
    }

    const orderItemsData = [];
    let totalAmout = 0;
    // Check Product + Stock
    for (const item of items) {
      const productId = item.productId;
      const quantity = Number(item.quantity);

      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'Product ID is required.',
        });
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be greater than 0.',
        });
      }

      // Find product
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${productId} not found.`,
        });
      }

      const productVariantId = item.productVariantId || null;

      if (productVariantId) {
        const productVariant = await prisma.product_variant.findFirst({
          where: {
            id: productVariantId,
            productId,
          },
        });

        if (!productVariant) {
          return res.status(400).json({
            success: false,
            error: 'Selected variant does not belong to this product.',
          });
        }
      }

      const lastStock = await prisma.stock_Product.findFirst({
        where: {
          productId,
          productVariantId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const currentStock = lastStock ? Number(lastStock.balance) : 0;

      // Check Stock
      if (currentStock <= 0) {
        return res.status(400).json({
          success: false,
          error: `Product "${product.name}" is out of stock.`,
        });
      }

      if (quantity > currentStock) {
        return res.status(400).json({
          success: false,
          error: `Not enough stock for "${product.name}". Available stock: ${currentStock}, requested: ${quantity}.`,
        });
      }

      //  Calculate Total
      const price = Number(product.price);

      totalAmout += price * quantity;

      orderItemsData.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmout,

          order_item: {
            create: orderItemsData,
          },
        },

        include: {
          order_item: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of items) {
        const productId = item.productId;
        const quantity = Number(item.quantity);
        const productVariantId = item.productVariantId || null;

        const lastStock = await tx.stock_Product.findFirst({
          where: {
            productId,
            productVariantId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        const currentStock = lastStock ? Number(lastStock.balance) : 0;

        const newBalance = currentStock - quantity;

        // Safety check
        if (newBalance < 0) {
          throw new Error(`Insufficient stock for product ${productId}`);
        }

        // Create stock movement
        await tx.stock_Product.create({
          data: {
            productId,
            productVariantId,

            stock_in: 0,
            stock_out: quantity,

            balance: newBalance,
          },
        });
      }

      return order;
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: newOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Server is error...!',
    });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { totalAmount } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found.',
      });
    }

    const amount = Number(totalAmount);

    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid total amount.',
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        totalAmout: amount,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully!',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Update order error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found.',
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order_Item.deleteMany({
        where: {
          orderId: id,
        },
      });

      await tx.order.delete({
        where: {
          id,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully!',
    });
  } catch (error) {
    console.error('Delete order error:', error);

    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

export { getAllOrder, getOrderById, createOrder, updateOrder, deleteOrder };
