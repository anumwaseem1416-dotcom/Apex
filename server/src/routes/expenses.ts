import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all expenses
router.get('/', authenticateToken, requireRole(['ADMIN', 'ACCOUNTANT']), async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create expense
router.post('/', authenticateToken, requireRole(['ADMIN', 'ACCOUNTANT']), async (req, res) => {
  try {
    const { category, amount, date, notes } = req.body;
    
    const expense = await prisma.expense.create({
      data: { category, amount, date: new Date(date), notes }
    });
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get monthly expenses
router.get('/monthly/:year/:month', authenticateToken, requireRole(['ADMIN', 'ACCOUNTANT']), async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    res.json({ expenses, totalExpenses });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, requireRole(['ADMIN', 'ACCOUNTANT']), async (req, res) => {
  try {
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;