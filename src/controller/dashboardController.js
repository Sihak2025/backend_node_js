import { prisma } from "../config/db.js";

const getDashboard = async (req, res) => {
  try {
    const allOrders = await prisma.order.findMany({
      include: {
        order_item: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });

    const totalOrders = allOrders.length;

    const totalRevenue = allOrders.reduce((total, order) => {
      return total + Number(order.totalAmout || 0);
    }, 0);

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalCustomers = await prisma.user.count({
      where: {
        role: "customer",
      },
    });

    const recentOrders = [...allOrders]
      .slice(0, 10)
      .map((order) => {
        const firstProduct = order.order_item?.[0]?.product;

        return {
          id: `#ORD-${order.id.slice(0, 8)}`,
          customer: order.user?.name || "Unknown Customer",
          email: order.user?.email || "",
          product: firstProduct?.name || "No Product",
          total: Number(order.totalAmout || 0),
          status: order.status || "Pending",
          date: null,
        };
      });

    const productMap = {};

    allOrders.forEach((order) => {
      order.order_item?.forEach((item) => {
        const product = item.product;

        if (!product) return;

        const productId = product.id;

        const quantity = Number(
          item.quantity || 1
        );

        const price = Number(
          item.price || product.price || 0
        );

        if (!productMap[productId]) {
          productMap[productId] = {
            id: product.id,
            name: product.name,
            category:
              product.category?.name ||
              "Uncategorized",
            sales: 0,
            revenue: 0,
          };
        }

        productMap[productId].sales += quantity;

        productMap[productId].revenue +=
          quantity * price;
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
      .map((product) => ({
        ...product,

        sales: product.sales,

        revenue: Number(
          product.revenue.toFixed(2)
        ),
      }));

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          averageOrderValue: Number(averageOrderValue.toFixed(2)),
          totalCustomers,
          revenueChange: 0,
          orderChange: 0,
          customerChange: 0,
        },
        recentOrders,
        topProducts,
        monthlySales: [],
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};

export { getDashboard };