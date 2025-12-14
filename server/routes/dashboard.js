import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/dashboard/stats - Dashboard statistics (30 Points)
router.get('/stats', authenticate, authorize('manager'), async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$price'] } } } }
    ]);
    
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } }
    ]);
    
    const recentProducts = await Product.find()
      .sort({ lastUpdated: -1 })
      .limit(5)
      .populate('createdBy', 'name');
    
    res.json({
      totalProducts,
      totalValue: totalValue[0]?.total || 0,
      productsByCategory,
      recentProducts,
      summary: {
        lowStock: await Product.countDocuments({ quantity: { $lt: 10 } }),
        outOfStock: await Product.countDocuments({ quantity: 0 }),
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;