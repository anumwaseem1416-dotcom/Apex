import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Clear all data - DANGER ZONE
router.delete('/clear-all-data', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    console.log('Starting data clearing process...');
    
    // Delete in order to respect foreign key constraints
    await prisma.$transaction(async (tx) => {
      // Delete credits first (references sales and customers)
      await tx.credit.deleteMany({});
      console.log('Cleared credits');
      
      // Delete sales (references customers and users)
      await tx.sale.deleteMany({});
      console.log('Cleared sales');
      
      // Delete stock movements (references products)
      await tx.stockMovement.deleteMany({});
      console.log('Cleared stock movements');
      
      // Delete all products
      await tx.phone.deleteMany({});
      console.log('Cleared phones');
      
      await tx.laptop.deleteMany({});
      console.log('Cleared laptops');
      
      await tx.watch.deleteMany({});
      console.log('Cleared watches');
      
      await tx.accessory.deleteMany({});
      console.log('Cleared accessories');
      
      // Delete customers
      await tx.customer.deleteMany({});
      console.log('Cleared customers');
      
      // Delete expenses
      await tx.expense.deleteMany({});
      console.log('Cleared expenses');
      
      // Delete system settings (optional - keep if needed)
      await tx.systemSettings.deleteMany({});
      console.log('Cleared system settings');
      
      // Note: Not deleting users as they are needed for authentication
    });
    
    console.log('Data clearing completed successfully');
    res.json({ 
      success: true, 
      message: 'All data cleared successfully',
      cleared: [
        'credits',
        'sales', 
        'stock_movements',
        'phones',
        'laptops', 
        'watches',
        'accessories',
        'customers',
        'expenses',
        'system_settings'
      ]
    });
  } catch (error: any) {
    console.error('Error clearing data:', error);
    res.status(500).json({ 
      error: 'Failed to clear data', 
      details: error.message 
    });
  }
});

export default router;