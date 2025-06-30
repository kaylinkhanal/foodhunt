import express from 'express';
import Product from '../models/product.js';

const productRouter = express.Router();


//to post product
productRouter.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
   console.log('product details are', savedProduct);
   
    res.status(201).json(savedProduct);
  } catch (err) {
    console.log('error while adding the product', err);
    
    res.status(400).json({ error: err.message });
  }
});


//to get all product
productRouter.get('/products', async (req, res) => {
  try {
    let products
    if(req.query?.sellerId){
      products = await Product.find({sellerId:req.query?.sellerId})
      .sort({ createdAt: -1 }) //sort the products based on their created at and decending order
      .populate('sellerId', 'name email phoneNumber'); 
    }else{
      products = await Product.find()
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});



productRouter.get('products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default productRouter;
