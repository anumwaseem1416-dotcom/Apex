import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const startReminderCron = () => {
  // Run every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      const overdueCredits = await prisma.credit.findMany({
        where: {
          dueDate: { lt: new Date() },
          remainingAmount: { gt: 0 },
          reminderStatus: { not: 'SENT' }
        },
        include: {
          customer: true,
          sale: true
        }
      });

      for (const credit of overdueCredits) {
        // Here you would integrate with SMS/WhatsApp/Email service
        console.log(`Reminder: Customer ${credit.customer.name} has overdue payment of $${credit.remainingAmount}`);
        
        // Update reminder status
        await prisma.credit.update({
          where: { id: credit.id },
          data: { reminderStatus: 'SENT' }
        });
      }

      console.log(`Processed ${overdueCredits.length} reminder(s)`);
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  });

  console.log('Reminder cron job started');
};