const Product = require('../models/Product');

// @desc    Get Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Newest first
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err); // 🔴 Log for Render
    res.status(500).json({ msg: 'Server Error fetching products' });
  }
};

// @desc    Create Product
const createProduct = async (req, res) => {
  try {
    // Basic Validation
    if (!req.body.size || !req.body.pricePerCrate || !req.body.img) {
        return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    
    // 🟢 Socket Update
    if (req.io) {
        req.io.emit('stock_updated', savedProduct);
    }
    
    res.json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err); // 🔴 Log for Render
    res.status(500).send(err.message);
  }
};

// @desc    Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    
    // 🟢 Socket Update
    if (req.io) {
        req.io.emit('stock_updated', product);
    }

    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err); // 🔴 Log for Render
    res.status(500).send('Server Error');
  }
};

// @desc    Delete Product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    
    // 🟢 Socket Update
    if (req.io) {
        req.io.emit('stock_updated', { _id: req.params.id, deleted: true });
    }

    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error("Error deleting product:", err); // 🔴 Log for Render
    res.status(500).send('Server Error');
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };