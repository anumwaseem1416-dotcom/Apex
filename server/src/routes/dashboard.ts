import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Daily stats
    const dailySales = await prisma.sale.findMany({
      where: { saleDate: { gte: startOfDay } }
    });
    const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.sellingPrice, 0);

    // Monthly stats
    const monthlySales = await prisma.sale.findMany({
      where: { saleDate: { gte: startOfMonth } }
    });
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
    const monthlyPurchaseCost = monthlySales.reduce((sum, sale) => sum + (sale.purchasePrice || 0), 0);

    const monthlyExpenses = await prisma.expense.findMany({
      where: { date: { gte: startOfMonth } }
    });
    const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const monthlyProfit = monthlyRevenue - monthlyPurchaseCost - totalMonthlyExpenses;

    // Credit stats
    const pendingCredits = await prisma.credit.findMany({
      where: { remainingAmount: { gt: 0 } },
      include: { customer: true }
    });
    const totalPendingAmount = pendingCredits.reduce((sum, credit) => sum + credit.remainingAmount, 0);

    // Stock stats
    const phonesInStock = await prisma.phone.count({ where: { status: 'IN_STOCK' } });
    const laptopsInStock = await prisma.laptop.count({ where: { status: 'IN_STOCK' } });
    const watchesInStock = await prisma.watch.count({ where: { status: 'IN_STOCK' } });
    const lowStockAccessories = await prisma.accessory.findMany({
      where: { stockQuantity: { lt: 5 } }
    });

    res.json({
      daily: {
        sales: dailySales.length,
        revenue: dailyRevenue
      },
      monthly: {
        sales: monthlySales.length,
        revenue: monthlyRevenue,
        profit: monthlyProfit,
        expenses: totalMonthlyExpenses
      },
      credits: {
        count: pendingCredits.length,
        totalAmount: totalPendingAmount
      },
      stock: {
        phones: phonesInStock,
        laptops: laptopsInStock,
        watches: watchesInStock,
        lowStockAccessories: lowStockAccessories.length
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get best selling products
router.get('/best-selling', authenticateToken, async (req, res) => {
  try {
    const sales = await prisma.sale.findMany();

    const productSales: { [key: string]: { count: number; revenue: number; name: string; type: string } } = {};

    // Get product details for each sale
    for (const sale of sales) {
      let productName = 'Unknown Product';
      let productKey = `${sale.productType}-${sale.productId}`;

      try {
        if (sale.productType === 'PHONE') {
          const phone = await prisma.phone.findUnique({ where: { id: sale.productId } });
          if (phone) {
            productName = `${phone.brand} ${phone.model}`;
            productKey = `phone-${phone.brand}-${phone.model}`;
          }
        } else if (sale.productType === 'LAPTOP') {
          const laptop = await prisma.laptop.findUnique({ where: { id: sale.productId } });
          if (laptop) {
            productName = `${laptop.brand} ${laptop.model}`;
            productKey = `laptop-${laptop.brand}-${laptop.model}`;
          }
        } else if (sale.productType === 'WATCH') {
          const watch = await prisma.watch.findUnique({ where: { id: sale.productId } });
          if (watch) {
            productName = `${watch.brand} ${watch.model}`;
            productKey = `watch-${watch.brand}-${watch.model}`;
          }
        } else if (sale.productType === 'ACCESSORY') {
          const accessory = await prisma.accessory.findUnique({ where: { id: sale.productId } });
          if (accessory) {
            productName = `${accessory.brand} ${accessory.category}`;
            productKey = `accessory-${accessory.category}-${accessory.brand}`;
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }

      if (!productSales[productKey]) {
        productSales[productKey] = { count: 0, revenue: 0, name: productName, type: sale.productType };
      }

      productSales[productKey].count++;
      productSales[productKey].revenue += sale.sellingPrice;
    }

    const bestSelling = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json(bestSelling);
  } catch (error) {
    console.error('Best selling error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;