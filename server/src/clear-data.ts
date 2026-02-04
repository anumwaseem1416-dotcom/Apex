import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  try {
    console.log('Clearing all data...');
    
    // Delete in order to avoid foreign key constraints
    await prisma.credit.deleteMany({});
    console.log('✓ Credits cleared');
    
    await prisma.sale.deleteMany({});
    console.log('✓ Sales cleared');
    
    await prisma.expense.deleteMany({});
    console.log('✓ Expenses cleared');
    
    await prisma.customer.deleteMany({});
    console.log('✓ Customers cleared');
    
    await prisma.phone.deleteMany({});
    console.log('✓ Phones cleared');
    
    await prisma.laptop.deleteMany({});
    console.log('✓ Laptops cleared');
    
    await prisma.watch.deleteMany({});
    console.log('✓ Watches cleared');
    
    await prisma.accessory.deleteMany({});
    console.log('✓ Accessories cleared');
    
    console.log('🎉 All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllData();