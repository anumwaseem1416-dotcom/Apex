import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all sales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        salesperson: true
      }
    });
    res.json({ data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create sale
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Received sale request:', req.body);
    const { customerId, productType, productId, sellingPrice, paidAmount, paymentMode } = req.body;
    
    // Validate required fields
    if (!customerId || !productType || !productId || sellingPrice === undefined || paidAmount === undefined || !paymentMode) {
      console.log('Missing required fields:', { customerId, productType, productId, sellingPrice, paidAmount, paymentMode });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate customer exists
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return res.status(400).json({ error: 'Customer not found' });
    }
    
    // Validate product exists based on type and is available
    let product;
    let purchasePrice = 0;
    if (productType === 'PHONE') {
      product = await prisma.phone.findUnique({ where: { id: productId } });
      if (!product || product.status !== 'IN_STOCK') {
        return res.status(400).json({ error: 'Phone is not available for sale' });
      }
      purchasePrice = product.purchasePrice;
    } else if (productType === 'ACCESSORY') {
      product = await prisma.accessory.findUnique({ where: { id: productId } });
      if (!product || product.stockQuantity <= 0) {
        return res.status(400).json({ error: 'Accessory is out of stock' });
      }
      purchasePrice = product.purchasePrice;
    } else if (productType === 'LAPTOP') {
      product = await prisma.laptop.findUnique({ where: { id: productId } });
      if (!product || product.status !== 'IN_STOCK') {
        return res.status(400).json({ error: 'Laptop is not available for sale' });
      }
      purchasePrice = product.purchasePrice;
    } else if (productType === 'WATCH') {
      product = await prisma.watch.findUnique({ where: { id: productId } });
      if (!product || product.status !== 'IN_STOCK') {
        return res.status(400).json({ error: 'Watch is not available for sale' });
      }
      purchasePrice = product.purchasePrice;
    }
    
    const remainingAmount = sellingPrice - paidAmount;
    const profit = sellingPrice - purchasePrice;
    
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create sale with only the fields that exist in the schema
      const saleData: any = {
        customerId,
        productType,
        productId,
        sellingPrice,
        purchasePrice,
        profit,
        paidAmount,
        remainingAmount,
        paymentMode
      };
      
      // Only add salespersonId if user exists
      if (req.user?.id) {
        saleData.salespersonId = req.user.id;
      }
      
      const sale = await tx.sale.create({ data: saleData });

      // Update product status
      if (productType === 'PHONE') {
        await tx.phone.update({
          where: { id: productId },
          data: { status: 'SOLD' }
        });
      } else if (productType === 'LAPTOP') {
        await tx.laptop.update({
          where: { id: productId },
          data: { status: 'SOLD' }
        });
      } else if (productType === 'WATCH') {
        await tx.watch.update({
          where: { id: productId },
          data: { status: 'SOLD' }
        });
      } else if (productType === 'ACCESSORY') {
        const accessory = await tx.accessory.findUnique({ where: { id: productId } });
        if (accessory && accessory.stockQuantity > 0) {
          await tx.accessory.update({
            where: { id: productId },
            data: { stockQuantity: accessory.stockQuantity - 1 }
          });
        }
      }

      // Create credit if remaining amount > 0
      if (remainingAmount > 0) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1);

        await tx.credit.create({
          data: {
            customerId,
            saleId: sale.id,
            totalAmount: sellingPrice,
            paidAmount,
            remainingAmount,
            dueDate
          }
        });

        await tx.customer.update({
          where: { id: customerId },
          data: { creditStatus: 'PENDING' }
        });
      }

      return sale;
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get sale by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        salesperson: true,
        credits: true
      }
    });
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete sale
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete related credits first
      await tx.credit.deleteMany({ where: { saleId: req.params.id } });
      // Then delete sale
      await tx.sale.delete({ where: { id: req.params.id } });
    });
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;