const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new product (For Initial Setup)
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { size, img, crateSize, pricePerCrate, stock, desc, tag } = req.body;

    const newProduct = new Product({
      size,
      img,
      crateSize,
      pricePerCrate,
      stock,
      desc,
      tag
    });

    const product = await newProduct.save();
    
    // Optional: Emit event if new product added
    req.io.emit('stock_updated', product); 
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update Product (Stock or Price)
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    // Find product and update specific fields
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, 
      { new: true } 
    );

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // 🔥 SOCKET EMIT: Refresh Stock on Customer Side instantly
    req.io.emit('stock_updated', product);

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await product.deleteOne();
    
    // Emit delete event so UI removes it
    req.io.emit('stock_updated', { _id: req.params.id, deleted: true }); 

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};