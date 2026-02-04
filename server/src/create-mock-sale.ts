import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock sales data...');

  // Create a mock sale
  const mockSale = await prisma.sale.create({
    data: {
      customerId: 'cmka4i4pc0001hp5f8hzxhs46', // Use the customer ID from your error
      productType: 'PHONE',
      productId: 'cmka4i4pm0002hp5fqnt3k061', // Use the product ID from your error
      sellingPrice: 1000,
      paidAmount: 899.99,
      remainingAmount: 100.01,
      paymentMode: 'CASH',
      invoiceNumber: 'INV-MOCK-001'
    }
  });

  console.log('Mock sale created:', mockSale);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });