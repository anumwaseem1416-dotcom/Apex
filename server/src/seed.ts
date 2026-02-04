import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // Create sample customer
  const customer = await prisma.customer.upsert({
    where: { phone: '1234567890' },
    update: {},
    create: {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      address: '123 Main St'
    }
  });

  // Create sample phone
  const phone = await prisma.phone.upsert({
    where: { imei: '123456789012345' },
    update: {},
    create: {
      imei: '123456789012345',
      brand: 'Apple',
      model: 'iPhone 14',
      color: 'Black',
      batteryHealth: 95,
      buyingSource: 'Supplier A',
      purchasePrice: 800,
      sellingPrice: 1000
    }
  });

  // Create sample accessories
  const accessory = await prisma.accessory.upsert({
    where: { sku: 'ACC001' },
    update: {},
    create: {
      sku: 'ACC001',
      category: 'CHARGER',
      brand: 'Apple',
      type: 'ORIGINAL',
      purchasePrice: 20,
      sellingPrice: 35,
      stockQuantity: 50
    }
  });

  console.log('Database seeded successfully');
  console.log('Admin login: admin@crm.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });