const Product = require('../models/Product');

// @desc    Get Products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Newest first
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err); 
    res.status(500).json({ msg: 'Server Error fetching products' });
  }
};

// @desc    Create Product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    // Basic Validation
    // ✅ Added 'crateSize' check because it is required in the Model now
    if (!req.body.size || !req.body.pricePerCrate || !req.body.img || !req.body.crateSize) {
        return res.status(400).json({ msg: "Please fill all required fields: Size, Price, Image, and Crate Size" });
    }

    // req.body mein bulkThreshold aur bulkPrice bhi honge agar frontend se bheje gaye
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    
    // 🟢 Socket Update
    if (req.io) {
        req.io.emit('stock_updated', savedProduct);
    }
    
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err); 
    res.status(500).send(err.message);
  }
};

// @desc    Update Product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, // Yahan naye fields update ho jayenge
      { new: true }
    );
    
    // 🟢 Socket Update
    if (req.io) {
        req.io.emit('stock_updated', product);
    }

    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err); 
    res.status(500).send('Server Error');
  }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    
    // 🟢 Socket Update
    if (req.io) {
        req.io.emit('stock_updated', { _id: req.params.id, deleted: true });
    }

    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error("Error deleting product:", err); 
    res.status(500).send('Server Error');
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };