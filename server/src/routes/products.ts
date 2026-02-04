import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// PHONES
router.get('/phones', authenticateToken, async (req, res) => {
  try {
    const phones = await prisma.phone.findMany();
    res.json({ data: phones });
  } catch (error) {
    console.error('Error fetching phones:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/phones', authenticateToken, async (req, res) => {
  try {
    const { imei, brand, model, color, batteryHealth, buyingSource, purchasePrice, sellingPrice } = req.body;
    
    if (!imei || !brand || !model || purchasePrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const phone = await prisma.phone.create({
      data: { 
        imei, 
        brand, 
        model, 
        color: color || '', 
        batteryHealth: batteryHealth || 0, 
        buyingSource: buyingSource || '', 
        purchasePrice: Number(purchasePrice), 
        sellingPrice: Number(sellingPrice) 
      }
    });
    
    res.json(phone);
  } catch (error: any) {
    console.error('Error creating phone:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/phones/:id', async (req, res) => {
  try {
    const phone = await prisma.phone.findUnique({
      where: { id: req.params.id }
    });
    
    if (!phone) {
      return res.status(404).json({ error: 'Phone not found' });
    }
    
    res.json(phone);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// LAPTOPS
router.get('/laptops', authenticateToken, async (req, res) => {
  try {
    const laptops = await prisma.laptop.findMany();
    // Parse specifications back to individual fields for frontend
    const laptopsWithFields = laptops.map(laptop => {
      const specs = laptop.specifications || '';
      const parts = specs.split(' ');
      return {
        ...laptop,
        processor: parts[0] || '',
        ram: parts[1] || '',
        storage: parts[2] || ''
      };
    });
    res.json({ data: laptopsWithFields });
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/laptops', authenticateToken, async (req, res) => {
  try {
    const { serialNumber, brand, model, processor, ram, storage, purchasePrice, sellingPrice } = req.body;
    
    if (!serialNumber || !brand || !model || purchasePrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const specifications = `${processor || ''} ${ram || ''} ${storage || ''}`.trim();
    
    const laptop = await prisma.laptop.create({
      data: { 
        serialNumber, 
        brand, 
        model, 
        specifications, 
        purchasePrice: Number(purchasePrice), 
        sellingPrice: Number(sellingPrice) 
      }
    });
    
    res.json(laptop);
  } catch (error: any) {
    console.error('Error creating laptop:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.put('/laptops/:id', authenticateToken, async (req, res) => {
  try {
    const { serialNumber, brand, model, processor, ram, storage, purchasePrice, sellingPrice } = req.body;
    
    const specifications = `${processor || ''} ${ram || ''} ${storage || ''}`.trim();
    
    const laptop = await prisma.laptop.update({
      where: { id: req.params.id },
      data: { serialNumber, brand, model, specifications, purchasePrice, sellingPrice }
    });
    
    res.json(laptop);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// WATCHES
router.get('/watches', authenticateToken, async (req, res) => {
  try {
    const watches = await prisma.watch.findMany();
    // Add color field (not in schema but expected by frontend)
    const watchesWithColor = watches.map(watch => ({
      ...watch,
      color: watch.notes || '' // Use notes field as color for now
    }));
    res.json({ data: watchesWithColor });
  } catch (error) {
    console.error('Error fetching watches:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/watches', authenticateToken, async (req, res) => {
  try {
    const { serialNumber, brand, model, color, condition, purchasePrice, sellingPrice } = req.body;
    
    if (!serialNumber || !brand || !model || purchasePrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const watch = await prisma.watch.create({
      data: { 
        serialNumber, 
        brand, 
        model, 
        condition: condition || 'EXCELLENT', 
        purchasePrice: Number(purchasePrice), 
        sellingPrice: Number(sellingPrice) 
      }
    });
    
    res.json(watch);
  } catch (error: any) {
    console.error('Error creating watch:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.put('/watches/:id', authenticateToken, async (req, res) => {
  try {
    const { serialNumber, brand, model, color, condition, purchasePrice, sellingPrice } = req.body;
    
    const watch = await prisma.watch.update({
      where: { id: req.params.id },
      data: { serialNumber, brand, model, condition: condition || 'EXCELLENT', purchasePrice, sellingPrice }
    });
    
    res.json(watch);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ACCESSORIES
router.get('/accessories', authenticateToken, async (req, res) => {
  try {
    const accessories = await prisma.accessory.findMany();
    res.json({ data: accessories });
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/accessories', authenticateToken, async (req, res) => {
  try {
    const { sku, category, brand, type, purchasePrice, sellingPrice, stockQuantity, minStockLevel } = req.body;
    
    if (!sku || !category || !brand || !type || purchasePrice === undefined || sellingPrice === undefined || stockQuantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const accessory = await prisma.accessory.create({
      data: { 
        sku, 
        category, 
        brand, 
        type, 
        purchasePrice: Number(purchasePrice), 
        sellingPrice: Number(sellingPrice), 
        stockQuantity: Number(stockQuantity), 
        minStockLevel: Number(minStockLevel) || 5 
      }
    });
    
    res.json(accessory);
  } catch (error: any) {
    console.error('Error creating accessory:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.put('/accessories/:id', authenticateToken, async (req, res) => {
  try {
    const { sku, category, brand, type, purchasePrice, sellingPrice, stockQuantity, minStockLevel } = req.body;
    
    const accessory = await prisma.accessory.update({
      where: { id: req.params.id },
      data: { sku, category, brand, type, purchasePrice, sellingPrice, stockQuantity, minStockLevel: minStockLevel || 5 }
    });
    
    res.json(accessory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/phones/:id', authenticateToken, async (req, res) => {
  try {
    const { imei, brand, model, color, batteryHealth, buyingSource, purchasePrice, sellingPrice } = req.body;
    
    const phone = await prisma.phone.update({
      where: { id: req.params.id },
      data: { imei, brand, model, color, batteryHealth, buyingSource, purchasePrice, sellingPrice }
    });
    
    res.json(phone);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/phones/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.phone.delete({ where: { id: req.params.id } });
    res.json({ message: 'Phone deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/laptops/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.laptop.delete({ where: { id: req.params.id } });
    res.json({ message: 'Laptop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/watches/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.watch.delete({ where: { id: req.params.id } });
    res.json({ message: 'Watch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/accessories/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.accessory.delete({ where: { id: req.params.id } });
    res.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;