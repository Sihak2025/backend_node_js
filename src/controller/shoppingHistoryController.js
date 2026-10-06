
import { prisma } from '../config/db.js';

export const getShoppingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        order_item: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Shopping history retrieved successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Get shopping history error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get shopping history',
      error: error.message,
    });
  }
};
