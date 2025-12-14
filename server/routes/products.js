import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - View all products (10 Points)
router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email');
    console.log('Products retrieved:', products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products - Add new product (15 Points - Optional)
router.post('/', authenticate, authorize('manager', 'store_keeper'), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user.userId,
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id - Edit product
router.put('/:id', authenticate, authorize('manager', 'store_keeper'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id - Delete product (Manager only)
router.delete('/:id', authenticate, authorize('manager'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;