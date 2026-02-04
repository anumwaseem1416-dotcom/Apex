import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all credits
router.get('/', authenticateToken, async (req, res) => {
  try {
    const credits = await prisma.credit.findMany({
      include: {
        customer: true,
        sale: true
      }
    });
    res.json({ data: credits });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update credit payment
router.put('/:id/payment', authenticateToken, async (req, res) => {
  try {
    const { paymentAmount } = req.body;
    
    const result = await prisma.$transaction(async (tx) => {
      const credit = await tx.credit.findUnique({
        where: { id: req.params.id }
      });
      
      if (!credit) {
        throw new Error('Credit not found');
      }

      const newPaidAmount = credit.paidAmount + paymentAmount;
      const newRemainingAmount = credit.totalAmount - newPaidAmount;

      const updatedCredit = await tx.credit.update({
        where: { id: req.params.id },
        data: {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount
        }
      });

      // If fully paid, update customer status
      if (newRemainingAmount <= 0) {
        const customerCredits = await tx.credit.findMany({
          where: {
            customerId: credit.customerId,
            remainingAmount: { gt: 0 }
          }
        });

        if (customerCredits.length === 0) {
          await tx.customer.update({
            where: { id: credit.customerId },
            data: { creditStatus: 'CLEAR' }
          });
        }
      }

      return updatedCredit;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get overdue credits
router.get('/overdue', authenticateToken, async (req, res) => {
  try {
    const overdueCredits = await prisma.credit.findMany({
      where: {
        dueDate: { lt: new Date() },
        remainingAmount: { gt: 0 }
      },
      include: {
        customer: true,
        sale: true
      }
    });
    res.json(overdueCredits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete credit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.credit.delete({ where: { id: req.params.id } });
    res.json({ message: 'Credit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;